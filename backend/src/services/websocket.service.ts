import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import prisma from './prisma';
import { verifyAccessToken } from '../utils/jwt';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  InterServerEvents, 
  SocketData,
  Mensagem,
  Chat,
  Notificacao
} from '../types/websocket.types';
import { MensagemInput } from '../validators/mensagem.validator';
import { FileUploadService } from './file-upload.service';

export class WebSocketService {
  private io: SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
  private userSockets: Map<string, string> = new Map(); // userId -> socketId
  private userTenants: Map<string, string> = new Map(); // userId -> tenantId
  private typingUsers: Map<string, Set<string>> = new Map(); // chatId -> Set<userId>

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Token não fornecido'));
        }

        const decoded = verifyAccessToken(token);
        if (!decoded) {
          return next(new Error('Token inválido'));
        }

        socket.data.userId = decoded.userId;
        socket.data.tenantId = decoded.tenantId;
        socket.data.role = decoded.role;
        socket.data.activeChats = new Set();

        // Armazenar o tenantId do usuário
        this.userTenants.set(decoded.userId, decoded.tenantId);

        next();
      } catch (error) {
        next(new Error('Autenticação falhou'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Usuário conectado: ${socket.data.userId} (${socket.data.tenantId})`);
      
      this.userSockets.set(socket.data.userId, socket.id);
      this.handleConnection(socket);
      this.handleDisconnection(socket);
      this.handleJoin(socket);
      this.handleChatEvents(socket);
      this.handleMessageEvents(socket);
      this.handleFileEvents(socket);
      this.handleNotificationEvents(socket);
      this.handlePing(socket);
    });
  }

  private handleConnection(socket: any) {
    // Enviar confirmação de conexão
    socket.emit('connected', {
      message: 'Conectado com sucesso',
      userId: socket.data.userId,
      tenantId: socket.data.tenantId
    });

    // Atualizar status do usuário
    this.broadcastUserStatus(socket.data.userId, 'online');
  }

  private handleDisconnection(socket: any) {
    socket.on('disconnect', () => {
      console.log(`Usuário desconectado: ${socket.data.userId}`);
      
      this.userSockets.delete(socket.data.userId);
      this.userTenants.delete(socket.data.userId);
      this.broadcastUserStatus(socket.data.userId, 'offline');
      
      // Remover de todos os chats ativos
      socket.data.activeChats.forEach((chatId: string) => {
        socket.leave(`chat:${chatId}`);
      });
    });
  }

  private handleJoin(socket: any) {
    socket.on('join', async (data: any) => {
      try {
        // Verificar se o usuário pertence ao tenant
        if (data.tenantId !== socket.data.tenantId) {
          socket.emit('error', 'Acesso negado');
          return;
        }

        // Entrar na sala do tenant
        socket.join(`tenant:${data.tenantId}`);
        
        // Entrar no chat geral automaticamente
        await this.joinGeneralChat(socket);
        
        console.log(`Usuário ${data.userId} entrou no tenant ${data.tenantId}`);
      } catch (error) {
        socket.emit('error', 'Erro ao entrar no chat');
      }
    });
  }

  private async joinGeneralChat(socket: any) {
    try {
      // Buscar ou criar chat geral
      let chatGeral = await prisma.chat.findFirst({
        where: {
          tenantId: socket.data.tenantId,
          tipo: 'GERAL'
        }
      });

      if (!chatGeral) {
        chatGeral = await prisma.chat.create({
          data: {
            tenantId: socket.data.tenantId,
            tipo: 'GERAL',
            nome: 'Chat Geral',
            criadoPor: socket.data.userId
          }
        });

        // Adicionar todos os usuários ativos como participantes
        const usuarios = await prisma.usuario.findMany({
          where: {
            tenantId: socket.data.tenantId,
            ativo: true
          }
        });

        await prisma.chatParticipante.createMany({
          data: usuarios.map((user: any) => ({
            chatId: chatGeral!.id,
            userId: user.id,
            tenantId: socket.data.tenantId
          }))
        });
      }

      // Verificar se o usuário já é participante
      const participante = await prisma.chatParticipante.findUnique({
        where: {
          chatId_userId: {
            chatId: chatGeral!.id,
            userId: socket.data.userId
          }
        }
      });

      if (!participante) {
        await prisma.chatParticipante.create({
          data: {
            chatId: chatGeral!.id,
            userId: socket.data.userId,
            tenantId: socket.data.tenantId
          }
        });
      }

      socket.join(`chat:${chatGeral!.id}`);
      socket.data.activeChats.add(chatGeral!.id);
    } catch (error) {
      console.error('Erro ao entrar no chat geral:', error);
    }
  }

  private handleChatEvents(socket: any) {
    // Entrar em um chat específico
    socket.on('joinChat', async (data: any) => {
      try {
        console.log('Tentando entrar no chat:', {
          chatId: data.chatId,
          userId: socket.data.userId,
          tenantId: socket.data.tenantId
        });

        // Verificar se o usuário é participante do chat
        const participante = await prisma.chatParticipante.findUnique({
          where: {
            chatId_userId: {
              chatId: data.chatId,
              userId: socket.data.userId
            }
          }
        });

        if (!participante) {
          socket.emit('error', 'Você não tem acesso a este chat');
          return;
        }

        socket.join(`chat:${data.chatId}`);
        socket.data.activeChats.add(data.chatId);

        // Buscar chat com participantes
        const chat = await this.getChatWithParticipants(data.chatId);
        socket.emit('chatJoined', chat);

        console.log(`Usuário ${socket.data.userId} entrou no chat ${data.chatId}`);
      } catch (error) {
        console.error('Erro ao entrar no chat:', error);
        socket.emit('error', 'Erro ao entrar no chat');
      }
    });

    // Sair de um chat
    socket.on('leaveChat', async (data: any) => {
      try {
        socket.leave(`chat:${data.chatId}`);
        socket.data.activeChats.delete(data.chatId);
        console.log(`Usuário ${socket.data.userId} saiu do chat ${data.chatId}`);
      } catch (error) {
        console.error('Erro ao sair do chat:', error);
      }
    });
  }

  private handleMessageEvents(socket: any) {
    // Enviar mensagem
    socket.on('message', async (data: MensagemInput) => {
      try {
        console.log('Nova mensagem recebida:', data);

        // Verificar se o usuário é participante do chat
        const participante = await prisma.chatParticipante.findUnique({
          where: {
            chatId_userId: {
              chatId: data.chatId,
              userId: socket.data.userId
            }
          }
        });

        if (!participante) {
          socket.emit('error', 'Você não tem acesso a este chat');
          return;
        }

        // Buscar informações do usuário
        const usuario = await prisma.usuario.findUnique({
          where: { id: socket.data.userId }
        });

        if (!usuario) {
          socket.emit('error', 'Usuário não encontrado');
          return;
        }

        // Criar mensagem
        const mensagem = await prisma.mensagem.create({
          data: {
            tenantId: socket.data.tenantId,
            chatId: data.chatId,
            senderId: socket.data.userId,
            senderName: usuario.email,
            senderRole: usuario.role,
            content: data.content
          },
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                ativo: true
              }
            }
          }
        });

        const mensagemFormatada = this.formatMensagem(mensagem);

        // Enviar para todos os participantes do chat
        this.io.to(`chat:${data.chatId}`).emit('newMessage', mensagemFormatada);

        // Criar notificações para outros usuários
        await this.criarNotificacoes(mensagemFormatada, data.chatId);

        console.log(`Mensagem enviada: ${mensagem.id}`);
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        socket.emit('error', 'Erro ao enviar mensagem');
      }
    });

    // Mensagem privada específica
    socket.on('privateMessage', async (data: any) => {
      try {
        console.log('Mensagem privada recebida:', data);

        // Verificar se o usuário é participante do chat
        const participante = await prisma.chatParticipante.findUnique({
          where: {
            chatId_userId: {
              chatId: data.chatId,
              userId: socket.data.userId
            }
          }
        });

        if (!participante) {
          socket.emit('error', 'Você não tem acesso a este chat');
          return;
        }

        // Buscar informações do usuário
        const usuario = await prisma.usuario.findUnique({
          where: { id: socket.data.userId }
        });

        if (!usuario) {
          socket.emit('error', 'Usuário não encontrado');
          return;
        }

        // Criar mensagem
        const mensagem = await prisma.mensagem.create({
          data: {
            tenantId: socket.data.tenantId,
            chatId: data.chatId,
            senderId: socket.data.userId,
            senderName: usuario.email,
            senderRole: usuario.role,
            content: data.content
          },
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                ativo: true
              }
            }
          }
        });

        const mensagemFormatada = this.formatMensagem(mensagem);

        // Enviar para todos os participantes do chat (incluindo o remetente)
        this.io.to(`chat:${data.chatId}`).emit('newMessage', mensagemFormatada);

        // Enviar notificação específica para mensagem privada
        await this.criarNotificacoes(mensagemFormatada, data.chatId);

        console.log(`Mensagem privada enviada: ${mensagem.id}`);
      } catch (error) {
        console.error('Erro ao enviar mensagem privada:', error);
        socket.emit('error', 'Erro ao enviar mensagem privada');
      }
    });

    // Editar mensagem
    socket.on('editMessage', async (data: any) => {
      try {
        const mensagem = await prisma.mensagem.findUnique({
          where: { id: data.messageId }
        });

        if (!mensagem || mensagem.senderId !== socket.data.userId) {
          socket.emit('error', 'Sem permissão para editar esta mensagem');
          return;
        }

        await prisma.mensagem.update({
          where: { id: data.messageId },
          data: {
            content: data.content,
            editada: true,
            editadaEm: new Date()
          }
        });

        this.io.to(`chat:${mensagem.chatId}`).emit('messageEdited', {
          messageId: data.messageId,
          content: data.content,
          editadaEm: new Date()
        });
      } catch (error) {
        console.error('Erro ao editar mensagem:', error);
        socket.emit('error', 'Erro ao editar mensagem');
      }
    });

    // Deletar mensagem
    socket.on('deleteMessage', async (data: any) => {
      try {
        const mensagem = await prisma.mensagem.findUnique({
          where: { id: data.messageId }
        });

        if (!mensagem || mensagem.senderId !== socket.data.userId) {
          socket.emit('error', 'Sem permissão para deletar esta mensagem');
          return;
        }

        await prisma.mensagem.delete({
          where: { id: data.messageId }
        });

        this.io.to(`chat:${mensagem.chatId}`).emit('messageDeleted', {
          messageId: data.messageId,
          chatId: mensagem.chatId
        });
      } catch (error) {
        console.error('Erro ao deletar mensagem:', error);
        socket.emit('error', 'Erro ao deletar mensagem');
      }
    });

    // Marcar mensagem como lida
    socket.on('markMessageRead', async (data: any) => {
      try {
        await prisma.leituraMensagem.upsert({
          where: {
            mensagemId_userId: {
              mensagemId: data.mensagemId,
              userId: socket.data.userId
            }
          },
          update: {
            status: 'LIDA',
            lidaEm: new Date()
          },
          create: {
            mensagemId: data.mensagemId,
            userId: socket.data.userId,
            tenantId: socket.data.tenantId,
            status: 'LIDA'
          }
        });

        this.io.to(`chat:${data.chatId}`).emit('messageRead', {
          mensagemId: data.mensagemId,
          userId: socket.data.userId,
          lidaEm: new Date()
        });
      } catch (error) {
        console.error('Erro ao marcar mensagem como lida:', error);
      }
    });

    // Indicador de digitação
    socket.on('typing', async (data: any) => {
      try {
        // Verificar se o usuário é participante do chat
        const participante = await prisma.chatParticipante.findUnique({
          where: {
            chatId_userId: {
              chatId: data.chatId,
              userId: socket.data.userId
            }
          }
        });

        if (!participante) {
          return;
        }

        if (data.isTyping) {
          // Adicionar usuário à lista de digitação
          if (!this.typingUsers.has(data.chatId)) {
            this.typingUsers.set(data.chatId, new Set());
          }
          this.typingUsers.get(data.chatId)!.add(socket.data.userId);
        } else {
          // Remover usuário da lista de digitação
          const typingSet = this.typingUsers.get(data.chatId);
          if (typingSet) {
            typingSet.delete(socket.data.userId);
            if (typingSet.size === 0) {
              this.typingUsers.delete(data.chatId);
            }
          }
        }

        // Enviar evento de digitação para outros participantes
        socket.to(`chat:${data.chatId}`).emit('userTyping', {
          chatId: data.chatId,
          userId: socket.data.userId,
          isTyping: data.isTyping
        });
      } catch (error) {
        console.error('Erro ao processar indicador de digitação:', error);
      }
    });
  }

  private handleFileEvents(socket: any) {
    // Upload de arquivo
    socket.on('uploadFile', async (data: any) => {
      try {
        const fileUrl = await FileUploadService.uploadFile(
          data.file, 
          socket.data.tenantId,
          data.chatId,
          socket.data.userId
        );

        // Buscar informações do usuário
        const usuario = await prisma.usuario.findUnique({
          where: { id: socket.data.userId }
        });

        if (!usuario) {
          socket.emit('error', 'Usuário não encontrado');
          return;
        }

        // Criar mensagem com arquivo
        const mensagem = await prisma.mensagem.create({
          data: {
            tenantId: socket.data.tenantId,
            chatId: data.chatId,
            senderId: socket.data.userId,
            senderName: usuario.email,
            senderRole: usuario.role,
            content: `Arquivo enviado: ${fileUrl.nomeOriginal}`
          },
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                ativo: true
              }
            }
          }
        });

        const mensagemFormatada = this.formatMensagem(mensagem);

        // Enviar para todos os participantes do chat
        this.io.to(`chat:${data.chatId}`).emit('newMessage', mensagemFormatada);

        // Emitir evento de arquivo enviado
        this.io.to(`chat:${data.chatId}`).emit('fileUploaded', {
          arquivo: fileUrl,
          mensagemId: mensagem.id
        });

        console.log(`Arquivo enviado: ${fileUrl.id}`);
      } catch (error) {
        console.error('Erro ao enviar arquivo:', error);
        socket.emit('error', 'Erro ao enviar arquivo');
      }
    });
  }

  private handleNotificationEvents(socket: any) {
    // Marcar notificação como lida
    socket.on('markNotificationRead', async (data: any) => {
      try {
        await prisma.notificacao.update({
          where: {
            id: data.notificacaoId
          },
          data: {
            lida: true
          }
        });

        socket.emit('notificationRead', {
          notificacaoId: data.notificacaoId
        });
      } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error);
      }
    });
  }

  private handlePing(socket: any) {
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });
  }

  private async getChatWithParticipants(chatId: string): Promise<Chat> {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participantes: {
          include: {
            usuario: {
              select: {
                id: true,
                email: true,
                role: true,
                ativo: true
              }
            }
          }
        },
        mensagens: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                ativo: true
              }
            }
          }
        }
      }
    });

    if (!chat) {
      throw new Error('Chat não encontrado');
    }

    return this.formatChat(chat);
  }

  private async getMensagemCompleta(mensagemId: string): Promise<Mensagem> {
    const mensagem = await prisma.mensagem.findUnique({
      where: { id: mensagemId },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            ativo: true
          }
        }
      }
    });

    if (!mensagem) {
      throw new Error('Mensagem não encontrada');
    }

    return this.formatMensagem(mensagem);
  }

  private formatMensagem(mensagem: any): Mensagem {
    return {
      id: mensagem.id,
      chatId: mensagem.chatId,
      senderId: mensagem.senderId,
      senderName: mensagem.senderName,
      senderRole: mensagem.senderRole,
      content: mensagem.content,
      timestamp: mensagem.timestamp,
      editada: mensagem.editada,
      editadaEm: mensagem.editadaEm,
      tenantId: mensagem.tenantId,
      arquivos: mensagem.arquivos || []
    };
  }

  private formatChat(chat: any): Chat {
    return {
      id: chat.id,
      tenantId: chat.tenantId,
      tipo: chat.tipo,
      nome: chat.nome,
      descricao: chat.descricao,
      criadoPor: chat.criadoPor,
      ativo: chat.ativo,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      participantes: chat.participantes?.map((p: any) => ({
        id: p.id,
        chatId: p.chatId,
        userId: p.userId,
        tenantId: p.tenantId,
        admin: p.admin,
        ativo: p.ativo,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        usuario: p.usuario
      })),
      ultimaMensagem: chat.mensagens?.[0] ? this.formatMensagem(chat.mensagens[0]) : undefined,
      naoLidas: 0 // Será calculado dinamicamente
    };
  }

  private async criarNotificacoes(mensagem: Mensagem, chatId: string) {
    try {
      // Buscar participantes do chat (exceto o remetente)
      const participantes = await prisma.chatParticipante.findMany({
        where: {
          chatId,
          userId: { not: mensagem.senderId }
        }
      });

      if (participantes.length === 0) return;

      // Criar notificações
      const notificacoes = participantes.map((participante) => ({
        userId: participante.userId,
        mensagemId: mensagem.id,
        titulo: `Nova mensagem de ${mensagem.senderName}`,
        corpo: mensagem.content,
        tipo: 'mensagem',
        tenantId: mensagem.tenantId
      }));

      await prisma.notificacao.createMany({
        data: notificacoes
      });

      // Enviar notificações via WebSocket
      participantes.forEach((participante) => {
        const userSocketId = this.userSockets.get(participante.userId);
        if (userSocketId) {
          this.io.to(userSocketId).emit('notificationReceived', {
            id: '', // Será preenchido pelo banco
            tenantId: mensagem.tenantId,
            userId: participante.userId,
            mensagemId: mensagem.id,
            titulo: `Nova mensagem de ${mensagem.senderName}`,
            corpo: mensagem.content,
            tipo: 'mensagem',
            lida: false,
            enviada: false,
            createdAt: new Date()
          });
        }
      });
    } catch (error) {
      console.error('Erro ao criar notificações:', error);
    }
  }

  private broadcastUserStatus(userId: string, status: 'online' | 'away' | 'busy' | 'offline') {
    const tenantId = this.getUserTenantId(userId);
    if (tenantId) {
      this.io.to(`tenant:${tenantId}`).emit('userStatus', {
        userId,
        status
      });
    }
  }

  private getUserTenantId(userId: string): string | null {
    return this.userTenants.get(userId) || null;
  }

  public isConnected(): boolean {
    return this.io.engine.clientsCount > 0;
  }
}
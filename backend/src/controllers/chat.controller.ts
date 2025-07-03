import { Request, Response } from 'express';
import prisma from '../services/prisma';
import { ChatInput, AtualizarChatInput, ParticipanteChatInput } from '../validators/mensagem.validator';

export default class ChatController {
  // Listar chats do usuário
  static async listarChats(req: Request, res: Response) {
    try {
      const { tenantId } = req as any;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
      }

      const {
        page = 1,
        limit = 10,
        sortBy = 'updatedAt',
        sortOrder = 'desc',
        titulo,
        tipo,
        status,
        criadoPor
      } = req.query;

      const pageNumber = parseInt(page as string);
      const limitNumber = parseInt(limit as string);
      const skip = (pageNumber - 1) * limitNumber;

      // Construir filtros
      const where: any = {
        tenantId,
        participantes: {
          some: {
            userId
          }
        }
      };

      if (titulo) {
        where.nome = {
          contains: titulo as string,
          mode: 'insensitive'
        };
      }

      if (tipo) {
        where.tipo = tipo;
      }

      if (status) {
        where.ativo = status === 'ATIVO';
      }

      if (criadoPor) {
        where.criadoPor = criadoPor;
      }

      // Buscar total de registros
      const total = await prisma.chat.count({ where });

      // Buscar chats com paginação
      const chats = await prisma.chat.findMany({
        where,
        include: {
          participantes: {
            include: {
              usuario: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                  ativo: true,
                  profissional: {
                    select: {
                      id: true,
                      nome: true
                    }
                  }
                }
              }
            }
          },
          mensagens: {
            orderBy: { timestamp: 'desc' },
            take: 1,
            include: {
              arquivos: {
                include: {
                  arquivo: true
                }
              },
              leituras: {
                where: {
                  userId
                }
              }
            }
          }
        },
        orderBy: {
          [sortBy as string]: sortOrder
        },
        skip,
        take: limitNumber
      });

      // Buscar contagem de mensagens não lidas para cada chat
      const chatsComContagem = await Promise.all(
        chats.map(async (chat) => {
          const mensagensNaoLidas = await prisma.mensagem.count({
            where: {
              chatId: chat.id,
              leituras: {
                none: {
                  userId
                }
              }
            }
          });
          return { ...chat, mensagensNaoLidas };
        })
      );

      const totalPages = Math.ceil(total / limitNumber);

      const chatsFormatados = chatsComContagem.map(chat => ({
        id: chat.id,
        tenantId: chat.tenantId,
        titulo: chat.nome,
        tipo: chat.tipo,
        status: chat.ativo ? 'ATIVO' : 'INATIVO',
        criadoPor: chat.criadoPor,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        participantes: chat.participantes.map(p => ({
          id: p.id,
          chatId: p.chatId,
          usuarioId: p.userId,
          nome: p.usuario?.profissional?.nome || p.usuario?.email,
          email: p.usuario?.email,
          role: p.usuario?.role,
          ativo: p.ativo,
          ultimaAtividade: p.updatedAt,
          usuario: p.usuario
        })),
        mensagens: chat.mensagens.map(msg => ({
          id: msg.id,
          chatId: msg.chatId,
          senderId: msg.senderId,
          senderName: msg.senderName,
          senderRole: msg.senderRole,
          content: msg.content,
          timestamp: msg.timestamp,
          lida: msg.leituras.length > 0,
          arquivos: msg.arquivos.map(am => ({
            id: am.arquivo.id,
            mensagemId: am.mensagemId,
            nome: am.arquivo.nome,
            tipo: am.arquivo.tipo,
            url: am.arquivo.url,
            tamanho: am.arquivo.tamanho,
            uploadedAt: am.arquivo.createdAt
          }))
        })),
        criador: chat.participantes.find(p => p.usuario?.id === chat.criadoPor)?.usuario,
        mensagensNaoLidas: chat.mensagensNaoLidas
      }));

      console.log('📋 [Chat Controller] Chats formatados:', {
        count: chatsFormatados.length,
        total,
        page: pageNumber,
        totalPages,
        chats: chatsFormatados.map(c => ({ id: c.id, tipo: c.tipo, participantes: c.participantes.length }))
      });

      res.json({
        success: true,
        data: chatsFormatados,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages,
          hasNext: pageNumber < totalPages,
          hasPrev: pageNumber > 1
        }
      });
    } catch (error) {
      console.error('Erro ao listar chats:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Buscar chat por ID
  static async buscarChat(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId } = req as any;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
      }
      const chat = await prisma.chat.findFirst({
        where: {
          id,
          tenantId,
          participantes: {
            some: {
              userId
            }
          }
        },
        include: {
          participantes: {
            include: {
              usuario: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                  ativo: true,
                  profissional: {
                    select: {
                      id: true,
                      nome: true
                    }
                  }
                }
              }
            }
          },
          mensagens: {
            orderBy: { timestamp: 'asc' },
            include: {
              arquivos: {
                include: {
                  arquivo: true
                }
              },
              leituras: {
                where: {
                  userId
                }
              }
            }
          }
        }
      });

      if (!chat) {
        return res.status(404).json({ error: 'Chat não encontrado.' });
      }

      const chatFormatado = {
        id: chat.id,
        tenantId: chat.tenantId,
        titulo: chat.nome,
        tipo: chat.tipo,
        status: chat.ativo ? 'ATIVO' : 'INATIVO',
        criadoPor: chat.criadoPor,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        participantes: chat.participantes.map(p => ({
          id: p.id,
          chatId: p.chatId,
          usuarioId: p.userId,
          nome: p.usuario?.profissional?.nome || p.usuario?.email,
          email: p.usuario?.email,
          role: p.usuario?.role,
          ativo: p.ativo,
          ultimaAtividade: p.updatedAt,
          usuario: p.usuario
        })),
        mensagens: chat.mensagens.map(msg => ({
          id: msg.id,
          chatId: msg.chatId,
          senderId: msg.senderId,
          senderName: msg.senderName,
          senderRole: msg.senderRole,
          content: msg.content,
          timestamp: msg.timestamp,
          lida: msg.leituras.length > 0,
          arquivos: msg.arquivos.map(am => ({
            id: am.arquivo.id,
            mensagemId: am.mensagemId,
            nome: am.arquivo.nome,
            tipo: am.arquivo.tipo,
            url: am.arquivo.url,
            tamanho: am.arquivo.tamanho,
            uploadedAt: am.arquivo.createdAt
          }))
        })),
        criador: chat.participantes.find(p => p.usuario?.id === chat.criadoPor)?.usuario
      };

      res.json({
        success: true,
        data: chatFormatado
      });
    } catch (error) {
      console.error('Erro ao buscar chat:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Criar novo chat
  static async criarChat(req: Request, res: Response) {
    try {
      const data: ChatInput = req.body;
      const { tenantId } = req as any;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
      }
      // Verificar se todos os participantes pertencem ao tenant
      const participantes = await prisma.usuario.findMany({
        where: {
          id: { in: data.participantes },
          tenantId
        }
      });

      if (participantes.length !== data.participantes.length) {
        return res.status(400).json({ error: 'Alguns participantes não foram encontrados' });
      }

      // Criar chat
      const chat = await prisma.chat.create({
        data: {
          tenantId,
          tipo: data.tipo,
          nome: data.nome,
          descricao: data.descricao,
          criadoPor: userId
        }
      });

      // Adicionar participantes
      await prisma.chatParticipante.createMany({
        data: [
          ...data.participantes.map(participanteId => ({
            chatId: chat.id,
            userId: participanteId,
            tenantId,
            admin: false
          })),
          {
            chatId: chat.id,
            userId: userId,
            tenantId,
            admin: true
          }
        ]
      });

      res.status(201).json(chat);
    } catch (error) {
      console.error('Erro ao criar chat:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Atualizar chat
  static async atualizarChat(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: AtualizarChatInput = req.body;
      const { tenantId, userId } = req as any;

      // Verificar se o usuário é admin do chat
      const participante = await prisma.chatParticipante.findFirst({
        where: {
          chatId: id,
          userId,
          tenantId,
          admin: true
        }
      });

      if (!participante) {
        return res.status(403).json({ error: 'Sem permissão para atualizar este chat' });
      }

      const chat = await prisma.chat.update({
        where: { id },
        data: {
          nome: data.nome,
          descricao: data.descricao
        },
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
          }
        }
      });

      res.json(chat);
    } catch (error) {
      console.error('Erro ao atualizar chat:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Deletar chat
  static async deletarChat(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId, userId } = req as any;

      // Verificar se o usuário é admin do chat
      const participante = await prisma.chatParticipante.findFirst({
        where: {
          chatId: id,
          userId,
          tenantId,
          admin: true
        }
      });

      if (!participante) {
        return res.status(403).json({ error: 'Sem permissão para deletar este chat' });
      }

      await prisma.chat.delete({
        where: { id }
      });

      res.json({ message: 'Chat deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar chat:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Adicionar participante
  static async adicionarParticipante(req: Request, res: Response) {
    try {
      const data: ParticipanteChatInput = req.body;
      const { tenantId, userId } = req as any;

      // Verificar se o usuário é admin do chat
      const participante = await prisma.chatParticipante.findFirst({
        where: {
          chatId: data.chatId,
          userId,
          tenantId,
          admin: true
        }
      });

      if (!participante) {
        return res.status(403).json({ error: 'Sem permissão para adicionar participantes' });
      }

      // Verificar se o novo participante pertence ao tenant
      const novoParticipante = await prisma.usuario.findFirst({
        where: {
          id: data.userId,
          tenantId
        }
      });

      if (!novoParticipante) {
        return res.status(400).json({ error: 'Usuário não encontrado' });
      }

      // Verificar se já é participante
      const participanteExistente = await prisma.chatParticipante.findUnique({
        where: {
          chatId_userId: {
            chatId: data.chatId,
            userId: data.userId
          }
        }
      });

      if (participanteExistente) {
        return res.status(400).json({ error: 'Usuário já é participante deste chat' });
      }

      const novoParticipanteChat = await prisma.chatParticipante.create({
        data: {
          chatId: data.chatId,
          userId: data.userId,
          tenantId,
          admin: false
        },
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
      });

      res.status(201).json(novoParticipanteChat);
    } catch (error) {
      console.error('Erro ao adicionar participante:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Remover participante
  static async removerParticipante(req: Request, res: Response) {
    try {
      const data: ParticipanteChatInput = req.body;
      const { tenantId, userId } = req as any;

      // Verificar se o usuário é admin do chat
      const participante = await prisma.chatParticipante.findFirst({
        where: {
          chatId: data.chatId,
          userId,
          tenantId,
          admin: true
        }
      });

      if (!participante) {
        return res.status(403).json({ error: 'Sem permissão para remover participantes' });
      }

      // Não permitir remover o criador do chat
      const chat = await prisma.chat.findUnique({
        where: { id: data.chatId }
      });

      if (chat?.criadoPor === data.userId) {
        return res.status(400).json({ error: 'Não é possível remover o criador do chat' });
      }

      await prisma.chatParticipante.delete({
        where: {
          chatId_userId: {
            chatId: data.chatId,
            userId: data.userId
          }
        }
      });

      res.json({ message: 'Participante removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover participante:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Listar mensagens do chat
  static async listarMensagens(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const { tenantId } = req as any;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
      }
      const { page = 1, limit = 50 } = req.query;

      // Verificar se o usuário é participante do chat
      const participante = await prisma.chatParticipante.findUnique({
        where: {
          chatId_userId: {
            chatId,
            userId
          }
        }
      });

      if (!participante) {
        return res.status(403).json({ error: 'Você não é participante deste chat' });
      }

      const offset = (Number(page) - 1) * Number(limit);

      const mensagens = await prisma.mensagem.findMany({
        where: {
          chatId,
          tenantId
        },
        include: {
          arquivos: {
            include: {
              arquivo: true
            }
          },
          leituras: {
            where: {
              userId
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        skip: offset,
        take: Number(limit)
      });

      const total = await prisma.mensagem.count({
        where: {
          chatId,
          tenantId
        }
      });

      const mensagensFormatadas = mensagens.map(msg => ({
        id: msg.id,
        chatId: msg.chatId,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderRole: msg.senderRole,
        content: msg.content,
        timestamp: msg.timestamp,
        editada: msg.editada,
        editadaEm: msg.editadaEm,
        tenantId: msg.tenantId,
        arquivos: msg.arquivos.map(am => ({
          id: am.arquivo.id,
          nome: am.arquivo.nome,
          nomeOriginal: am.arquivo.nomeOriginal,
          tipo: am.arquivo.tipo,
          tamanho: am.arquivo.tamanho,
          url: am.arquivo.url,
          mimeType: am.arquivo.mimeType,
          uploadadoPor: am.arquivo.uploadadoPor,
          createdAt: am.arquivo.createdAt
        })),
        lida: msg.leituras.length > 0
      }));

      res.json({
        mensagens: mensagensFormatadas.reverse(),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erro ao listar mensagens:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Buscar chat geral
  static async buscarChatGeral(req: Request, res: Response) {
    try {
      const { tenantId } = req as any;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
      }

      let chatGeral = await prisma.chat.findFirst({
        where: {
          tenantId,
          tipo: 'GERAL'
        },
        include: {
          participantes: {
            include: {
              usuario: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                  ativo: true,
                  profissional: {
                    select: {
                      id: true,
                      nome: true
                    }
                  }
                }
              }
            }
          },
          mensagens: {
            orderBy: { timestamp: 'desc' },
            take: 50,
            include: {
              arquivos: {
                include: { arquivo: true }
              },
              leituras: true
            }
          }
        }
      });

      // Se não existir, criar o chat geral
      if (!chatGeral) {
        chatGeral = await prisma.chat.create({
          data: {
            tenantId,
            tipo: 'GERAL',
            nome: 'Chat Geral',
            criadoPor: userId
          },
          include: {
            participantes: {
              include: {
                usuario: {
                  select: {
                    id: true,
                    email: true,
                    role: true,
                    ativo: true,
                    profissional: {
                      select: {
                        id: true,
                        nome: true
                      }
                    }
                  }
                }
              }
            },
            mensagens: {
              orderBy: { timestamp: 'desc' },
              take: 50,
              include: {
                arquivos: {
                  include: { arquivo: true }
                },
                leituras: true
              }
            }
          }
        });

        // Adicionar todos os usuários ativos como participantes
        const usuarios = await prisma.usuario.findMany({
          where: {
            tenantId,
            ativo: true
          }
        });

        await prisma.chatParticipante.createMany({
          data: usuarios.map((user: any) => ({
            chatId: chatGeral!.id,
            userId: user.id,
            tenantId
          }))
        });
      }

      res.json(chatGeral);
    } catch (error) {
      console.error('Erro ao buscar chat geral:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Buscar ou criar chat privado
  static async buscarOuCriarChatPrivado(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { tenantId } = req as any;
      const currentUserId = req.user?.userId;
      if (!currentUserId) {
        return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
      }

      // Verificar se já existe um chat privado entre os dois usuários
      const chatExistente = await prisma.chat.findFirst({
        where: {
          tenantId,
          tipo: 'PRIVADO',
          participantes: {
            every: {
              userId: {
                in: [currentUserId, userId]
              }
            }
          }
        },
        include: {
          participantes: {
            include: {
              usuario: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                  profissional: {
                    select: {
                      id: true,
                      nome: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (chatExistente) {
        return res.json(chatExistente);
      }

      // Criar novo chat privado
      const novoChat = await prisma.chat.create({
        data: {
          tenantId,
          tipo: 'PRIVADO',
          nome: `Chat Privado`,
          criadoPor: currentUserId
        }
      });

      // Adicionar participantes
      await prisma.chatParticipante.createMany({
        data: [
          {
            chatId: novoChat.id,
            userId: currentUserId,
            tenantId,
            admin: true
          },
          {
            chatId: novoChat.id,
            userId,
            tenantId,
            admin: false
          }
        ]
      });

      const chatComParticipantes = await prisma.chat.findUnique({
        where: { id: novoChat.id },
        include: {
          participantes: {
            include: {
              usuario: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                  profissional: {
                    select: {
                      id: true,
                      nome: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      res.json(chatComParticipantes);
    } catch (error) {
      console.error('Erro ao buscar ou criar chat privado:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Buscar chats por tipo
  static async buscarChatsPorTipo(req: Request, res: Response) {
    try {
      const { tipo } = req.params;
      const { tenantId } = req as any;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
      }

      const chats = await prisma.chat.findMany({
        where: {
          tenantId,
          tipo: tipo as any,
          participantes: {
            some: {
              userId
            }
          }
        },
        include: {
          participantes: {
            include: {
              usuario: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                  profissional: {
                    select: {
                      id: true,
                      nome: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      res.json(chats);
    } catch (error) {
      console.error('Erro ao buscar chats por tipo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Buscar chats por status
  static async buscarChatsPorStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const { tenantId } = req as any;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
      }

      const ativo = status === 'ATIVO';

      const chats = await prisma.chat.findMany({
        where: {
          tenantId,
          ativo,
          participantes: {
            some: {
              userId
            }
          }
        },
        include: {
          participantes: {
            include: {
              usuario: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                  profissional: {
                    select: {
                      id: true,
                      nome: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      res.json({
        success: true,
        data: chats
      });
    } catch (error) {
      console.error('Erro ao buscar chats por status:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Buscar chats por usuário
  static async buscarChatsPorUsuario(req: Request, res: Response) {
    try {
      const { usuarioId } = req.params;
      const { tenantId } = req as any;

      const chats = await prisma.chat.findMany({
        where: {
          tenantId,
          participantes: {
            some: {
              userId: usuarioId
            }
          }
        },
        include: {
          participantes: {
            include: {
              usuario: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                  profissional: {
                    select: {
                      id: true,
                      nome: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      res.json({
        success: true,
        data: chats
      });
    } catch (error) {
      console.error('Erro ao buscar chats por usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Buscar chats (search)
  static async buscarChats(req: Request, res: Response) {
    try {
      const { q, limit = 10 } = req.query;
      const { tenantId } = req as any;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
      }

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Termo de busca é obrigatório'
        });
      }

      const chats = await prisma.chat.findMany({
        where: {
          tenantId,
          participantes: {
            some: {
              userId
            }
          },
          OR: [
            {
              nome: {
                contains: q as string,
                mode: 'insensitive'
              }
            },
            {
              descricao: {
                contains: q as string,
                mode: 'insensitive'
              }
            },
            {
              participantes: {
                some: {
                  usuario: {
                    profissional: {
                      nome: {
                        contains: q as string,
                        mode: 'insensitive'
                      }
                    }
                  }
                }
              }
            }
          ]
        },
        include: {
          participantes: {
            include: {
              usuario: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                  profissional: {
                    select: {
                      id: true,
                      nome: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: parseInt(limit as string)
      });

      res.json({
        success: true,
        data: chats
      });
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Arquivar chat
  static async arquivarChat(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId } = req as any;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
      }

      // Verificar se o usuário é participante do chat
      const participante = await prisma.chatParticipante.findFirst({
        where: {
          chatId: id,
          userId,
          tenantId
        }
      });

      if (!participante) {
        return res.status(403).json({ error: 'Acesso negado.' });
      }

      const chat = await prisma.chat.update({
        where: {
          id,
          tenantId
        },
        data: {
          ativo: false
        },
        include: {
          participantes: {
            include: {
              usuario: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                  profissional: {
                    select: {
                      id: true,
                      nome: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        data: chat
      });
    } catch (error) {
      console.error('Erro ao arquivar chat:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Fechar chat
  static async fecharChat(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId } = req as any;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
      }

      // Verificar se o chat pertence ao tenant e usuário é participante
      const chat = await prisma.chat.findFirst({
        where: {
          id,
          tenantId,
          participantes: {
            some: {
              userId
            }
          }
        }
      });

      if (!chat) {
        return res.status(404).json({ error: 'Chat não encontrado' });
      }

      const chatAtualizado = await prisma.chat.update({
        where: { id },
        data: { ativo: false },
        include: {
          participantes: {
            include: {
              usuario: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                  profissional: {
                    select: {
                      id: true,
                      nome: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        data: chatAtualizado
      });
    } catch (error) {
      console.error('Erro ao fechar chat:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Reativar chat
  static async reativarChat(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId } = req as any;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
      }

      // Verificar se o chat pertence ao tenant e usuário é participante
      const chat = await prisma.chat.findFirst({
        where: {
          id,
          tenantId,
          participantes: {
            some: {
              userId
            }
          }
        }
      });

      if (!chat) {
        return res.status(404).json({ error: 'Chat não encontrado' });
      }

      const chatAtualizado = await prisma.chat.update({
        where: { id },
        data: { ativo: true },
        include: {
          participantes: {
            include: {
              usuario: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                  profissional: {
                    select: {
                      id: true,
                      nome: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        data: chatAtualizado
      });
    } catch (error) {
      console.error('Erro ao reativar chat:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Estatísticas de chats
  static async getStats(req: Request, res: Response) {
    try {
      const { tenantId } = req as any;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
      }

      const { inicio, fim } = req.query;

      const where: any = {
        tenantId,
        participantes: {
          some: {
            userId
          }
        }
      };

      if (inicio && fim) {
        where.createdAt = {
          gte: new Date(inicio as string),
          lte: new Date(fim as string)
        };
      }

      // Total de chats
      const totalChats = await prisma.chat.count({ where });

      // Chats por status
      const chatsPorStatus = await prisma.chat.groupBy({
        by: ['ativo'],
        where,
        _count: {
          ativo: true
        }
      });

      // Chats por tipo
      const chatsPorTipo = await prisma.chat.groupBy({
        by: ['tipo'],
        where,
        _count: {
          tipo: true
        }
      });

      // Converter para formato esperado pelo frontend
      const statusCount = chatsPorStatus.reduce((acc, item) => {
        acc[item.ativo ? 'ATIVO' : 'INATIVO'] = item._count.ativo;
        return acc;
      }, {} as Record<string, number>);

      const tipoCount = chatsPorTipo.reduce((acc, item) => {
        acc[item.tipo] = item._count.tipo;
        return acc;
      }, {} as Record<string, number>);

      // Calcular média de mensagens por chat
      const chatsComMensagens = await prisma.chat.findMany({
        where,
        include: {
          _count: {
            select: {
              mensagens: true
            }
          }
        }
      });

      const totalMensagens = chatsComMensagens.reduce((acc, chat) => acc + chat._count.mensagens, 0);
      const mediaMensagensPorChat = totalChats > 0 ? totalMensagens / totalChats : 0;

      // Calcular crescimento mensal (comparar com mês anterior)
      const mesAtual = new Date();
      const mesAnterior = new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1, 1);
      const inicioMesAtual = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);

      const chatsMesAtual = await prisma.chat.count({
        where: {
          ...where,
          createdAt: {
            gte: inicioMesAtual,
            lte: mesAtual
          }
        }
      });

      const chatsMesAnterior = await prisma.chat.count({
        where: {
          ...where,
          createdAt: {
            gte: mesAnterior,
            lt: inicioMesAtual
          }
        }
      });

      const crescimentoMensal = chatsMesAnterior > 0 
        ? ((chatsMesAtual - chatsMesAnterior) / chatsMesAnterior) * 100 
        : 0;

      res.json({
        success: true,
        data: {
          totalChats,
          chatsPorStatus: statusCount,
          chatsPorTipo: tipoCount,
          mediaMensagensPorChat,
          crescimentoMensal
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 
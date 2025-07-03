"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const socket_io_1 = require("socket.io");
const prisma_1 = __importDefault(require("./prisma"));
const jwt_1 = require("../utils/jwt");
const file_upload_service_1 = require("./file-upload.service");
class WebSocketService {
    constructor(server) {
        this.userSockets = new Map(); // userId -> socketId
        this.userTenants = new Map(); // userId -> tenantId
        this.typingUsers = new Map(); // chatId -> Set<userId>
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:5173",
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        this.setupMiddleware();
        this.setupEventHandlers();
    }
    setupMiddleware() {
        this.io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    return next(new Error('Token não fornecido'));
                }
                const decoded = (0, jwt_1.verifyAccessToken)(token);
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
            }
            catch (error) {
                next(new Error('Autenticação falhou'));
            }
        }));
    }
    setupEventHandlers() {
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
    handleConnection(socket) {
        // Enviar confirmação de conexão
        socket.emit('connected', {
            message: 'Conectado com sucesso',
            userId: socket.data.userId,
            tenantId: socket.data.tenantId
        });
        // Atualizar status do usuário
        this.broadcastUserStatus(socket.data.userId, 'online');
    }
    handleDisconnection(socket) {
        socket.on('disconnect', () => {
            console.log(`Usuário desconectado: ${socket.data.userId}`);
            this.userSockets.delete(socket.data.userId);
            this.userTenants.delete(socket.data.userId);
            this.broadcastUserStatus(socket.data.userId, 'offline');
            // Remover de todos os chats ativos
            socket.data.activeChats.forEach((chatId) => {
                socket.leave(`chat:${chatId}`);
            });
        });
    }
    handleJoin(socket) {
        socket.on('join', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar se o usuário pertence ao tenant
                if (data.tenantId !== socket.data.tenantId) {
                    socket.emit('error', 'Acesso negado');
                    return;
                }
                // Entrar na sala do tenant
                socket.join(`tenant:${data.tenantId}`);
                // Entrar no chat geral automaticamente
                yield this.joinGeneralChat(socket);
                console.log(`Usuário ${data.userId} entrou no tenant ${data.tenantId}`);
            }
            catch (error) {
                socket.emit('error', 'Erro ao entrar no chat');
            }
        }));
    }
    joinGeneralChat(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Buscar ou criar chat geral
                let chatGeral = yield prisma_1.default.chat.findFirst({
                    where: {
                        tenantId: socket.data.tenantId,
                        tipo: 'GERAL'
                    }
                });
                if (!chatGeral) {
                    chatGeral = yield prisma_1.default.chat.create({
                        data: {
                            tenantId: socket.data.tenantId,
                            tipo: 'GERAL',
                            nome: 'Chat Geral',
                            criadoPor: socket.data.userId
                        }
                    });
                    // Adicionar todos os usuários ativos como participantes
                    const usuarios = yield prisma_1.default.usuario.findMany({
                        where: {
                            tenantId: socket.data.tenantId,
                            ativo: true
                        }
                    });
                    yield prisma_1.default.chatParticipante.createMany({
                        data: usuarios.map((user) => ({
                            chatId: chatGeral.id,
                            userId: user.id,
                            tenantId: socket.data.tenantId
                        }))
                    });
                }
                // Verificar se o usuário já é participante
                const participante = yield prisma_1.default.chatParticipante.findUnique({
                    where: {
                        chatId_userId: {
                            chatId: chatGeral.id,
                            userId: socket.data.userId
                        }
                    }
                });
                if (!participante) {
                    yield prisma_1.default.chatParticipante.create({
                        data: {
                            chatId: chatGeral.id,
                            userId: socket.data.userId,
                            tenantId: socket.data.tenantId
                        }
                    });
                }
                socket.join(`chat:${chatGeral.id}`);
                socket.data.activeChats.add(chatGeral.id);
            }
            catch (error) {
                console.error('Erro ao entrar no chat geral:', error);
            }
        });
    }
    handleChatEvents(socket) {
        // Entrar em um chat específico
        socket.on('joinChat', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Tentando entrar no chat:', {
                    chatId: data.chatId,
                    userId: socket.data.userId,
                    tenantId: socket.data.tenantId
                });
                // Verificar se o usuário é participante do chat
                const participante = yield prisma_1.default.chatParticipante.findUnique({
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
                const chat = yield this.getChatWithParticipants(data.chatId);
                socket.emit('chatJoined', chat);
                console.log(`Usuário ${socket.data.userId} entrou no chat ${data.chatId}`);
            }
            catch (error) {
                console.error('Erro ao entrar no chat:', error);
                socket.emit('error', 'Erro ao entrar no chat');
            }
        }));
        // Sair de um chat
        socket.on('leaveChat', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                socket.leave(`chat:${data.chatId}`);
                socket.data.activeChats.delete(data.chatId);
                console.log(`Usuário ${socket.data.userId} saiu do chat ${data.chatId}`);
            }
            catch (error) {
                console.error('Erro ao sair do chat:', error);
            }
        }));
    }
    handleMessageEvents(socket) {
        // Enviar mensagem
        socket.on('message', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Nova mensagem recebida:', data);
                // Verificar se o usuário é participante do chat
                const participante = yield prisma_1.default.chatParticipante.findUnique({
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
                const usuario = yield prisma_1.default.usuario.findUnique({
                    where: { id: socket.data.userId }
                });
                if (!usuario) {
                    socket.emit('error', 'Usuário não encontrado');
                    return;
                }
                // Criar mensagem
                const mensagem = yield prisma_1.default.mensagem.create({
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
                yield this.criarNotificacoes(mensagemFormatada, data.chatId);
                console.log(`Mensagem enviada: ${mensagem.id}`);
            }
            catch (error) {
                console.error('Erro ao enviar mensagem:', error);
                socket.emit('error', 'Erro ao enviar mensagem');
            }
        }));
        // Editar mensagem
        socket.on('editMessage', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const mensagem = yield prisma_1.default.mensagem.findUnique({
                    where: { id: data.messageId }
                });
                if (!mensagem || mensagem.senderId !== socket.data.userId) {
                    socket.emit('error', 'Sem permissão para editar esta mensagem');
                    return;
                }
                yield prisma_1.default.mensagem.update({
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
            }
            catch (error) {
                console.error('Erro ao editar mensagem:', error);
                socket.emit('error', 'Erro ao editar mensagem');
            }
        }));
        // Deletar mensagem
        socket.on('deleteMessage', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const mensagem = yield prisma_1.default.mensagem.findUnique({
                    where: { id: data.messageId }
                });
                if (!mensagem || mensagem.senderId !== socket.data.userId) {
                    socket.emit('error', 'Sem permissão para deletar esta mensagem');
                    return;
                }
                yield prisma_1.default.mensagem.delete({
                    where: { id: data.messageId }
                });
                this.io.to(`chat:${mensagem.chatId}`).emit('messageDeleted', {
                    messageId: data.messageId,
                    chatId: mensagem.chatId
                });
            }
            catch (error) {
                console.error('Erro ao deletar mensagem:', error);
                socket.emit('error', 'Erro ao deletar mensagem');
            }
        }));
        // Marcar mensagem como lida
        socket.on('markMessageRead', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.leituraMensagem.upsert({
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
            }
            catch (error) {
                console.error('Erro ao marcar mensagem como lida:', error);
            }
        }));
    }
    handleFileEvents(socket) {
        // Upload de arquivo
        socket.on('uploadFile', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const fileUrl = yield file_upload_service_1.FileUploadService.uploadFile(data.file, socket.data.tenantId, data.chatId, socket.data.userId);
                // Buscar informações do usuário
                const usuario = yield prisma_1.default.usuario.findUnique({
                    where: { id: socket.data.userId }
                });
                if (!usuario) {
                    socket.emit('error', 'Usuário não encontrado');
                    return;
                }
                // Criar mensagem com arquivo
                const mensagem = yield prisma_1.default.mensagem.create({
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
            }
            catch (error) {
                console.error('Erro ao enviar arquivo:', error);
                socket.emit('error', 'Erro ao enviar arquivo');
            }
        }));
    }
    handleNotificationEvents(socket) {
        // Marcar notificação como lida
        socket.on('markNotificationRead', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.notificacao.update({
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
            }
            catch (error) {
                console.error('Erro ao marcar notificação como lida:', error);
            }
        }));
    }
    handlePing(socket) {
        socket.on('ping', () => {
            socket.emit('pong', { timestamp: new Date().toISOString() });
        });
    }
    getChatWithParticipants(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield prisma_1.default.chat.findUnique({
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
        });
    }
    getMensagemCompleta(mensagemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const mensagem = yield prisma_1.default.mensagem.findUnique({
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
        });
    }
    formatMensagem(mensagem) {
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
    formatChat(chat) {
        var _a, _b;
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
            participantes: (_a = chat.participantes) === null || _a === void 0 ? void 0 : _a.map((p) => ({
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
            ultimaMensagem: ((_b = chat.mensagens) === null || _b === void 0 ? void 0 : _b[0]) ? this.formatMensagem(chat.mensagens[0]) : undefined,
            naoLidas: 0 // Será calculado dinamicamente
        };
    }
    criarNotificacoes(mensagem, chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Buscar participantes do chat (exceto o remetente)
                const participantes = yield prisma_1.default.chatParticipante.findMany({
                    where: {
                        chatId,
                        userId: { not: mensagem.senderId }
                    }
                });
                if (participantes.length === 0)
                    return;
                // Criar notificações
                const notificacoes = participantes.map((participante) => ({
                    userId: participante.userId,
                    mensagemId: mensagem.id,
                    titulo: `Nova mensagem de ${mensagem.senderName}`,
                    corpo: mensagem.content,
                    tipo: 'mensagem',
                    tenantId: mensagem.tenantId
                }));
                yield prisma_1.default.notificacao.createMany({
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
            }
            catch (error) {
                console.error('Erro ao criar notificações:', error);
            }
        });
    }
    broadcastUserStatus(userId, status) {
        const tenantId = this.getUserTenantId(userId);
        if (tenantId) {
            this.io.to(`tenant:${tenantId}`).emit('userStatus', {
                userId,
                status
            });
        }
    }
    getUserTenantId(userId) {
        return this.userTenants.get(userId) || null;
    }
    isConnected() {
        return this.io.engine.clientsCount > 0;
    }
}
exports.WebSocketService = WebSocketService;
//# sourceMappingURL=websocket.service.js.map
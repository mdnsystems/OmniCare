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
const prisma_1 = __importDefault(require("../services/prisma"));
class ChatController {
    // Listar chats do usuário
    static listarChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { tenantId } = req;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
                }
                const chats = yield prisma_1.default.chat.findMany({
                    where: {
                        tenantId,
                        participantes: {
                            some: {
                                userId
                            }
                        },
                        ativo: true
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
                        },
                        mensagens: {
                            orderBy: { timestamp: 'desc' },
                            take: 1,
                            include: {
                                arquivos: {
                                    include: {
                                        arquivo: true
                                    }
                                }
                            }
                        },
                        _count: {
                            select: {
                                mensagens: {
                                    where: {
                                        leituras: {
                                            none: {
                                                userId
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
                const chatsFormatados = chats.map(chat => ({
                    id: chat.id,
                    tenantId: chat.tenantId,
                    tipo: chat.tipo,
                    nome: chat.nome,
                    descricao: chat.descricao,
                    criadoPor: chat.criadoPor,
                    ativo: chat.ativo,
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt,
                    participantes: chat.participantes.map(p => ({
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
                    ultimaMensagem: chat.mensagens[0] ? {
                        id: chat.mensagens[0].id,
                        content: chat.mensagens[0].content,
                        timestamp: chat.mensagens[0].timestamp,
                        senderName: chat.mensagens[0].senderName,
                        arquivos: chat.mensagens[0].arquivos.map(am => ({
                            id: am.arquivo.id,
                            nome: am.arquivo.nome,
                            nomeOriginal: am.arquivo.nomeOriginal,
                            tipo: am.arquivo.tipo,
                            tamanho: am.arquivo.tamanho,
                            url: am.arquivo.url,
                            mimeType: am.arquivo.mimeType
                        }))
                    } : null,
                    naoLidas: chat._count.mensagens
                }));
                console.log('📋 [Chat Controller] Chats formatados:', {
                    count: chatsFormatados.length,
                    chats: chatsFormatados.map(c => ({ id: c.id, tipo: c.tipo, participantes: c.participantes.length }))
                });
                res.json(chatsFormatados);
            }
            catch (error) {
                console.error('Erro ao listar chats:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    // Buscar chat por ID
    static buscarChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const { tenantId } = req;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
                }
                const chat = yield prisma_1.default.chat.findFirst({
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
                                        ativo: true
                                    }
                                }
                            }
                        }
                    }
                });
                if (!chat) {
                    return res.status(404).json({ error: 'Chat não encontrado' });
                }
                res.json(chat);
            }
            catch (error) {
                console.error('Erro ao buscar chat:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    // Criar novo chat
    static criarChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = req.body;
                const { tenantId } = req;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
                }
                // Verificar se todos os participantes pertencem ao tenant
                const participantes = yield prisma_1.default.usuario.findMany({
                    where: {
                        id: { in: data.participantes },
                        tenantId
                    }
                });
                if (participantes.length !== data.participantes.length) {
                    return res.status(400).json({ error: 'Alguns participantes não foram encontrados' });
                }
                // Criar chat
                const chat = yield prisma_1.default.chat.create({
                    data: {
                        tenantId,
                        tipo: data.tipo,
                        nome: data.nome,
                        descricao: data.descricao,
                        criadoPor: userId
                    }
                });
                // Adicionar participantes
                yield prisma_1.default.chatParticipante.createMany({
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
            }
            catch (error) {
                console.error('Erro ao criar chat:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    // Atualizar chat
    static atualizarChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = req.body;
                const { tenantId, userId } = req;
                // Verificar se o usuário é admin do chat
                const participante = yield prisma_1.default.chatParticipante.findFirst({
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
                const chat = yield prisma_1.default.chat.update({
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
            }
            catch (error) {
                console.error('Erro ao atualizar chat:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    // Deletar chat
    static deletarChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { tenantId, userId } = req;
                // Verificar se o usuário é admin do chat
                const participante = yield prisma_1.default.chatParticipante.findFirst({
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
                yield prisma_1.default.chat.delete({
                    where: { id }
                });
                res.json({ message: 'Chat deletado com sucesso' });
            }
            catch (error) {
                console.error('Erro ao deletar chat:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    // Adicionar participante
    static adicionarParticipante(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const { tenantId, userId } = req;
                // Verificar se o usuário é admin do chat
                const participante = yield prisma_1.default.chatParticipante.findFirst({
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
                const novoParticipante = yield prisma_1.default.usuario.findFirst({
                    where: {
                        id: data.userId,
                        tenantId
                    }
                });
                if (!novoParticipante) {
                    return res.status(400).json({ error: 'Usuário não encontrado' });
                }
                // Verificar se já é participante
                const participanteExistente = yield prisma_1.default.chatParticipante.findUnique({
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
                const novoParticipanteChat = yield prisma_1.default.chatParticipante.create({
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
            }
            catch (error) {
                console.error('Erro ao adicionar participante:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    // Remover participante
    static removerParticipante(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const { tenantId, userId } = req;
                // Verificar se o usuário é admin do chat
                const participante = yield prisma_1.default.chatParticipante.findFirst({
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
                const chat = yield prisma_1.default.chat.findUnique({
                    where: { id: data.chatId }
                });
                if ((chat === null || chat === void 0 ? void 0 : chat.criadoPor) === data.userId) {
                    return res.status(400).json({ error: 'Não é possível remover o criador do chat' });
                }
                yield prisma_1.default.chatParticipante.delete({
                    where: {
                        chatId_userId: {
                            chatId: data.chatId,
                            userId: data.userId
                        }
                    }
                });
                res.json({ message: 'Participante removido com sucesso' });
            }
            catch (error) {
                console.error('Erro ao remover participante:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    // Listar mensagens do chat
    static listarMensagens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { chatId } = req.params;
                const { tenantId } = req;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
                }
                const { page = 1, limit = 50 } = req.query;
                // Verificar se o usuário é participante do chat
                const participante = yield prisma_1.default.chatParticipante.findUnique({
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
                const mensagens = yield prisma_1.default.mensagem.findMany({
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
                const total = yield prisma_1.default.mensagem.count({
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
            }
            catch (error) {
                console.error('Erro ao listar mensagens:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    // Buscar chat geral do tenant
    static buscarChatGeral(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { tenantId } = req;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
                }
                // Buscar chat geral
                let chatGeral = yield prisma_1.default.chat.findFirst({
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
                                        ativo: true
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
                    chatGeral = yield prisma_1.default.chat.create({
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
                                            ativo: true
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
                    const usuarios = yield prisma_1.default.usuario.findMany({
                        where: {
                            tenantId,
                            ativo: true
                        }
                    });
                    yield prisma_1.default.chatParticipante.createMany({
                        data: usuarios.map((user) => ({
                            chatId: chatGeral.id,
                            userId: user.id,
                            tenantId
                        }))
                    });
                }
                res.json(chatGeral);
            }
            catch (error) {
                console.error('Erro ao buscar chat geral:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    // Buscar ou criar chat privado entre dois usuários
    static buscarOuCriarChatPrivado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { userId: outroUsuarioId } = req.params;
                const { tenantId } = req;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res.status(400).json({ error: 'Usuário autenticado não encontrado.' });
                }
                console.log('Debug - Parâmetros recebidos:', {
                    outroUsuarioId,
                    tenantId,
                    userId,
                    params: req.params,
                    user: req.user
                });
                if (!outroUsuarioId || !tenantId || !userId) {
                    console.log('Debug - Parâmetros ausentes:', {
                        outroUsuarioId: !!outroUsuarioId,
                        tenantId: !!tenantId,
                        userId: !!userId
                    });
                    return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes.' });
                }
                // Verificar se o outro usuário existe
                const outroUsuario = yield prisma_1.default.usuario.findFirst({
                    where: {
                        id: outroUsuarioId,
                        tenantId,
                        ativo: true
                    }
                });
                if (!outroUsuario) {
                    console.log('Debug - Outro usuário não encontrado:', { outroUsuarioId, tenantId });
                    return res.status(404).json({ error: 'Usuário não encontrado.' });
                }
                // Buscar chat privado existente
                let chat = yield prisma_1.default.chat.findFirst({
                    where: {
                        tenantId,
                        tipo: 'PRIVADO',
                        AND: [
                            { participantes: { some: { userId } } },
                            { participantes: { some: { userId: outroUsuarioId } } }
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
                                        ativo: true
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
                if (!chat) {
                    console.log('Debug - Criando novo chat privado');
                    // Criar novo chat privado
                    const novoChat = yield prisma_1.default.chat.create({
                        data: {
                            tenantId,
                            tipo: 'PRIVADO',
                            nome: null,
                            descricao: null,
                            criadoPor: userId
                        }
                    });
                    if (!novoChat) {
                        throw new Error('Erro ao criar chat privado');
                    }
                    // Adicionar participantes
                    yield prisma_1.default.chatParticipante.createMany({
                        data: [
                            { chatId: novoChat.id, userId, tenantId, admin: true },
                            { chatId: novoChat.id, userId: outroUsuarioId, tenantId, admin: false }
                        ]
                    });
                    // Buscar chat completo
                    chat = yield prisma_1.default.chat.findUnique({
                        where: { id: novoChat.id },
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
                                take: 50,
                                include: {
                                    arquivos: { include: { arquivo: true } },
                                    leituras: true
                                }
                            }
                        }
                    });
                }
                console.log('Debug - Chat retornado:', { chatId: chat === null || chat === void 0 ? void 0 : chat.id });
                res.json(chat);
            }
            catch (error) {
                console.error('Erro ao buscar/criar chat privado:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
}
exports.default = ChatController;
//# sourceMappingURL=chat.controller.js.map
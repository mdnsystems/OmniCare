"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeituraMensagemSchema = exports.NotificacaoSchema = exports.ParticipanteChatSchema = exports.AtualizarChatSchema = exports.ChatInputSchema = exports.DeletarMensagemSchema = exports.EditarMensagemSchema = exports.MensagemInputSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
exports.MensagemInputSchema = zod_1.z.object({
    chatId: zod_1.z.string().uuid(),
    content: zod_1.z.string().min(1).max(2000),
    senderId: zod_1.z.string().uuid(),
    senderName: zod_1.z.string().min(1).max(100),
    senderRole: zod_1.z.nativeEnum(enums_1.RoleUsuario),
    timestamp: zod_1.z.date().optional(),
    arquivos: zod_1.z.array(zod_1.z.string().uuid()).optional(),
});
exports.EditarMensagemSchema = zod_1.z.object({
    messageId: zod_1.z.string().uuid(),
    content: zod_1.z.string().min(1).max(2000),
});
exports.DeletarMensagemSchema = zod_1.z.object({
    messageId: zod_1.z.string().uuid(),
});
exports.ChatInputSchema = zod_1.z.object({
    tipo: zod_1.z.enum(['PRIVADO', 'GRUPO']),
    nome: zod_1.z.string().optional(),
    descricao: zod_1.z.string().optional(),
    participantes: zod_1.z.array(zod_1.z.string().uuid()).min(1),
});
exports.AtualizarChatSchema = zod_1.z.object({
    chatId: zod_1.z.string().uuid(),
    nome: zod_1.z.string().optional(),
    descricao: zod_1.z.string().optional(),
});
exports.ParticipanteChatSchema = zod_1.z.object({
    chatId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
});
exports.NotificacaoSchema = zod_1.z.object({
    notificacaoId: zod_1.z.string().uuid(),
});
exports.LeituraMensagemSchema = zod_1.z.object({
    mensagemId: zod_1.z.string().uuid(),
});
//# sourceMappingURL=mensagem.validator.js.map
import { z } from 'zod';
import { RoleUsuario } from '../types/enums';
export declare const MensagemInputSchema: z.ZodObject<{
    chatId: z.ZodString;
    content: z.ZodString;
    senderId: z.ZodString;
    senderName: z.ZodString;
    senderRole: z.ZodNativeEnum<typeof RoleUsuario>;
    timestamp: z.ZodOptional<z.ZodDate>;
    arquivos: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    chatId: string;
    senderId: string;
    senderName: string;
    senderRole: RoleUsuario;
    content: string;
    arquivos?: string[] | undefined;
    timestamp?: Date | undefined;
}, {
    chatId: string;
    senderId: string;
    senderName: string;
    senderRole: RoleUsuario;
    content: string;
    arquivos?: string[] | undefined;
    timestamp?: Date | undefined;
}>;
export declare const EditarMensagemSchema: z.ZodObject<{
    messageId: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
    messageId: string;
}, {
    content: string;
    messageId: string;
}>;
export declare const DeletarMensagemSchema: z.ZodObject<{
    messageId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    messageId: string;
}, {
    messageId: string;
}>;
export declare const ChatInputSchema: z.ZodObject<{
    tipo: z.ZodEnum<["PRIVADO", "GRUPO"]>;
    nome: z.ZodOptional<z.ZodString>;
    descricao: z.ZodOptional<z.ZodString>;
    participantes: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    tipo: "PRIVADO" | "GRUPO";
    participantes: string[];
    nome?: string | undefined;
    descricao?: string | undefined;
}, {
    tipo: "PRIVADO" | "GRUPO";
    participantes: string[];
    nome?: string | undefined;
    descricao?: string | undefined;
}>;
export declare const AtualizarChatSchema: z.ZodObject<{
    chatId: z.ZodString;
    nome: z.ZodOptional<z.ZodString>;
    descricao: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    chatId: string;
    nome?: string | undefined;
    descricao?: string | undefined;
}, {
    chatId: string;
    nome?: string | undefined;
    descricao?: string | undefined;
}>;
export declare const ParticipanteChatSchema: z.ZodObject<{
    chatId: z.ZodString;
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    chatId: string;
    userId: string;
}, {
    chatId: string;
    userId: string;
}>;
export declare const NotificacaoSchema: z.ZodObject<{
    notificacaoId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    notificacaoId: string;
}, {
    notificacaoId: string;
}>;
export declare const LeituraMensagemSchema: z.ZodObject<{
    mensagemId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    mensagemId: string;
}, {
    mensagemId: string;
}>;
export type MensagemInput = z.infer<typeof MensagemInputSchema>;
export type EditarMensagemInput = z.infer<typeof EditarMensagemSchema>;
export type DeletarMensagemInput = z.infer<typeof DeletarMensagemSchema>;
export type ChatInput = z.infer<typeof ChatInputSchema>;
export type AtualizarChatInput = z.infer<typeof AtualizarChatSchema>;
export type ParticipanteChatInput = z.infer<typeof ParticipanteChatSchema>;
export type NotificacaoInput = z.infer<typeof NotificacaoSchema>;
export type LeituraMensagemInput = z.infer<typeof LeituraMensagemSchema>;

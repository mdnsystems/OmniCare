import { z } from 'zod';
import { RoleUsuario } from '../types/enums';

export const MensagemInputSchema = z.object({
  chatId: z.string().uuid(),
  content: z.string().min(1).max(2000),
  senderId: z.string().uuid(),
  senderName: z.string().min(1).max(100),
  senderRole: z.nativeEnum(RoleUsuario),
  timestamp: z.date().optional(),
  arquivos: z.array(z.string().uuid()).optional(),
});

export const EditarMensagemSchema = z.object({
  messageId: z.string().uuid(),
  content: z.string().min(1).max(2000),
});

export const DeletarMensagemSchema = z.object({
  messageId: z.string().uuid(),
});

export const ChatInputSchema = z.object({
  tipo: z.enum(['PRIVADO', 'GRUPO']),
  nome: z.string().optional(),
  descricao: z.string().optional(),
  participantes: z.array(z.string().uuid()).min(1),
});

export const AtualizarChatSchema = z.object({
  chatId: z.string().uuid(),
  nome: z.string().optional(),
  descricao: z.string().optional(),
});

export const ParticipanteChatSchema = z.object({
  chatId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const NotificacaoSchema = z.object({
  notificacaoId: z.string().uuid(),
});

export const LeituraMensagemSchema = z.object({
  mensagemId: z.string().uuid(),
});

export type MensagemInput = z.infer<typeof MensagemInputSchema>;
export type EditarMensagemInput = z.infer<typeof EditarMensagemSchema>;
export type DeletarMensagemInput = z.infer<typeof DeletarMensagemSchema>;
export type ChatInput = z.infer<typeof ChatInputSchema>;
export type AtualizarChatInput = z.infer<typeof AtualizarChatSchema>;
export type ParticipanteChatInput = z.infer<typeof ParticipanteChatSchema>;
export type NotificacaoInput = z.infer<typeof NotificacaoSchema>;
export type LeituraMensagemInput = z.infer<typeof LeituraMensagemSchema>; 
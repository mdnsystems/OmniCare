import { MensagemInput } from '../validators/mensagem.validator';
import { RoleUsuario } from './enums';

export interface Mensagem {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderRole: RoleUsuario;
  content: string;
  timestamp: Date;
  editada: boolean;
  editadaEm?: Date;
  tenantId: string;
  arquivos?: ArquivoMensagem[];
}

export interface Chat {
  id: string;
  tenantId: string;
  tipo: 'GERAL' | 'PRIVADO' | 'GRUPO';
  nome?: string;
  descricao?: string;
  criadoPor: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  participantes?: ChatParticipante[];
  ultimaMensagem?: Mensagem;
  naoLidas?: number;
}

export interface ChatParticipante {
  id: string;
  chatId: string;
  userId: string;
  tenantId: string;
  admin: boolean;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  usuario?: {
    id: string;
    email: string;
    role: RoleUsuario;
    ativo: boolean;
  };
}

export interface ArquivoMensagem {
  id: string;
  nome: string;
  nomeOriginal: string;
  tipo: 'IMAGEM' | 'DOCUMENTO' | 'AUDIO' | 'VIDEO' | 'OUTRO';
  tamanho: number;
  url: string;
  mimeType: string;
  uploadadoPor: string;
  createdAt: Date;
}

export interface Notificacao {
  id: string;
  tenantId: string;
  userId: string;
  mensagemId: string;
  titulo: string;
  corpo: string;
  tipo: string;
  lida: boolean;
  enviada: boolean;
  enviadaEm?: Date;
  createdAt: Date;
}

export interface ServerToClientEvents {
  connected: (data: { message: string; userId: string; tenantId: string }) => void;
  newMessage: (message: Mensagem) => void;
  messageEdited: (data: { messageId: string; content: string; editadaEm: Date }) => void;
  messageDeleted: (data: { messageId: string; chatId: string }) => void;
  userTyping: (data: { userId: string; chatId: string; isTyping: boolean }) => void;
  userStatus: (data: { userId: string; status: 'online' | 'away' | 'busy' | 'offline' }) => void;
  userDisconnected: (data: { userId: string }) => void;
  
  // Chat events
  chatCreated: (chat: Chat) => void;
  chatUpdated: (chat: Chat) => void;
  chatDeleted: (data: { chatId: string }) => void;
  userJoinedChat: (data: { chatId: string; userId: string; usuario: any }) => void;
  userLeftChat: (data: { chatId: string; userId: string }) => void;
  
  // File events
  fileUploaded: (data: { arquivo: ArquivoMensagem; mensagemId: string }) => void;
  fileDeleted: (data: { arquivoId: string; mensagemId: string }) => void;
  
  // Notification events
  notificationReceived: (notificacao: Notificacao) => void;
  notificationRead: (data: { notificacaoId: string }) => void;
  
  // Read receipts
  messageRead: (data: { mensagemId: string; userId: string; lidaEm: Date }) => void;
  
  pong: (data: { timestamp: string }) => void;
  error: (error: string) => void;
}

export interface ClientToServerEvents {
  join: (data: { tenantId: string; userId: string }) => void;
  joinChat: (data: { chatId: string }) => void;
  leaveChat: (data: { chatId: string }) => void;
  
  message: (data: MensagemInput) => void;
  editMessage: (data: { messageId: string; content: string }) => void;
  deleteMessage: (data: { messageId: string }) => void;
  
  typing: (data: { chatId: string; isTyping: boolean }) => void;
  status: (status: 'online' | 'away' | 'busy' | 'offline') => void;
  
  // Chat management
  createChat: (data: { tipo: 'PRIVADO' | 'GRUPO'; nome?: string; descricao?: string; participantes: string[] }) => void;
  updateChat: (data: { chatId: string; nome?: string; descricao?: string }) => void;
  deleteChat: (data: { chatId: string }) => void;
  addParticipant: (data: { chatId: string; userId: string }) => void;
  removeParticipant: (data: { chatId: string; userId: string }) => void;
  
  // File management
  uploadFile: (data: { chatId: string; file: File; messageId?: string }) => void;
  deleteFile: (data: { arquivoId: string }) => void;
  
  // Notifications
  markNotificationRead: (data: { notificacaoId: string }) => void;
  markMessageRead: (data: { mensagemId: string }) => void;
  
  ping: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  tenantId: string;
  role: string;
  activeChats: Set<string>;
} 
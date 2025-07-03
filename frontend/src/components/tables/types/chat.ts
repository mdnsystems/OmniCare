export interface Chat {
  id: string;
  tenantId: string;
  titulo: string;
  tipo: string;
  status: string;
  criadoPor: string;
  createdAt: string;
  updatedAt: string;
  
  // Relacionamentos
  participantes?: ChatParticipante[];
  mensagens?: Mensagem[];
  criador?: {
    id: string;
    nome: string;
    email: string;
    role: string;
  };
}

export interface ChatParticipante {
  id: string;
  chatId: string;
  usuarioId: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  ultimaAtividade: string;
  usuario?: {
    id: string;
    nome: string;
    email: string;
    role: string;
  };
}

export interface Mensagem {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  tipo: string;
  timestamp: string;
  lida: boolean;
  arquivos?: ArquivoMensagem[];
  sender?: {
    id: string;
    nome: string;
    email: string;
    role: string;
  };
}

export interface ArquivoMensagem {
  id: string;
  mensagemId: string;
  nome: string;
  tipo: string;
  url: string;
  tamanho: number;
  uploadedAt: string;
} 
import { api, extractData, handleApiError, PaginatedResponse } from './api';
import { Chat } from '@/types/api';

export interface CreateChatRequest {
  titulo: string;
  tipo: string;
  participantes: string[];
}

export interface UpdateChatRequest {
  titulo?: string;
  tipo?: string;
  status?: string;
  participantes?: string[];
}

export interface ChatFilters {
  titulo?: string;
  tipo?: string;
  status?: string;
  criadoPor?: string;
  page?: number;
  limit?: number;
}

// Chat
export const getChats = async (filters?: ChatFilters): Promise<PaginatedResponse<Chat>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.titulo) params.append('titulo', filters.titulo);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.criadoPor) params.append('criadoPor', filters.criadoPor);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/chat?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getChat = async (id: string): Promise<Chat> => {
  try {
    const response = await api.get(`/chat/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createChat = async (data: CreateChatRequest): Promise<Chat> => {
  try {
    const response = await api.post('/chat', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateChat = async (id: string, data: UpdateChatRequest): Promise<Chat> => {
  try {
    const response = await api.put(`/chat/${id}`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteChat = async (id: string): Promise<void> => {
  try {
    await api.delete(`/chat/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Chat por tipo
export const getChatsByTipo = async (tipo: string): Promise<Chat[]> => {
  try {
    const response = await api.get(`/chat/tipo/${tipo}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Chat por status
export const getChatsByStatus = async (status: string): Promise<Chat[]> => {
  try {
    const response = await api.get(`/chat/status/${status}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Chat por usuário
export const getChatsByUsuario = async (usuarioId: string): Promise<Chat[]> => {
  try {
    const response = await api.get(`/chat/usuario/${usuarioId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Buscar chats
export const searchChats = async (searchTerm: string, limit: number = 10): Promise<Chat[]> => {
  try {
    const response = await api.get(`/chat/search`, {
      params: { q: searchTerm, limit }
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Arquivar chat
export const arquivarChat = async (id: string): Promise<Chat> => {
  try {
    const response = await api.patch(`/chat/${id}/arquivar`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Fechar chat
export const fecharChat = async (id: string): Promise<Chat> => {
  try {
    const response = await api.patch(`/chat/${id}/fechar`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Reativar chat
export const reativarChat = async (id: string): Promise<Chat> => {
  try {
    const response = await api.patch(`/chat/${id}/reativar`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Adicionar participante
export const adicionarParticipante = async (chatId: string, usuarioId: string): Promise<Chat> => {
  try {
    const response = await api.post(`/chat/${chatId}/participantes`, { usuarioId });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Remover participante
export const removerParticipante = async (chatId: string, usuarioId: string): Promise<Chat> => {
  try {
    const response = await api.delete(`/chat/${chatId}/participantes/${usuarioId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas de chats
export const getChatsStats = async (periodo?: { inicio: string; fim: string }): Promise<{
  totalChats: number;
  chatsPorStatus: Record<string, number>;
  chatsPorTipo: Record<string, number>;
  mediaMensagensPorChat: number;
  crescimentoMensal: number;
}> => {
  try {
    const response = await api.get('/chat/stats', {
      params: periodo
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exportar chats
export const exportChats = async (filters?: ChatFilters, formato: 'pdf' | 'xlsx' = 'xlsx'): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    if (filters?.titulo) params.append('titulo', filters.titulo);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.criadoPor) params.append('criadoPor', filters.criadoPor);
    params.append('formato', formato);

    const response = await api.get(`/chat/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Importar chats
export const importChats = async (file: File): Promise<{ success: number; errors: string[] }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/chat/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Validar chat
export const validarChat = async (data: CreateChatRequest): Promise<{
  valido: boolean;
  erros: string[];
  avisos: string[];
}> => {
  try {
    const response = await api.post('/chat/validar', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export async function buscarOuCriarChatPrivado(userId: string) {
  console.log('🔍 [Chat Service] Buscando chat privado para usuário:', userId);
  const response = await api.get(`/chat/privado/${userId}`);
  console.log('📡 [Chat Service] Resposta da API:', response.data);
  
  // Verificar se a resposta tem a estrutura { success, data, timestamp }
  if (response.data && response.data.success && response.data.data) {
    console.log('✅ [Chat Service] Dados extraídos corretamente:', response.data.data);
    return response.data.data;
  }
  
  // Se não tiver a estrutura esperada, retornar a resposta direta
  console.log('⚠️ [Chat Service] Estrutura inesperada, retornando resposta direta:', response.data);
  return response.data;
}

export async function buscarChatGeral() {
  console.log('🔍 [Chat Service] Buscando chat geral');
  const response = await api.get('/chat/geral');
  console.log('📡 [Chat Service] Resposta chat geral:', response.data);
  
  // Verificar se a resposta tem a estrutura { success, data, timestamp }
  if (response.data && response.data.success && response.data.data) {
    console.log('✅ [Chat Service] Dados chat geral extraídos corretamente:', response.data.data);
    return response.data.data;
  }
  
  // Se não tiver a estrutura esperada, retornar a resposta direta
  console.log('⚠️ [Chat Service] Estrutura inesperada chat geral, retornando resposta direta:', response.data);
  return response.data;
} 
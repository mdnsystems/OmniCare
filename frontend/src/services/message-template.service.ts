import { api, extractData, handleApiError, PaginatedResponse } from './api';
import { MessageTemplate } from '@/types/api';

export interface CreateMessageTemplateRequest {
  nome: string;
  tipo: string;
  conteudo: string;
  variaveis?: string[];
  ativo?: boolean;
  descricao?: string;
}

export interface UpdateMessageTemplateRequest {
  nome?: string;
  tipo?: string;
  conteudo?: string;
  variaveis?: string[];
  ativo?: boolean;
  descricao?: string;
}

export interface MessageTemplateFilters {
  tipo?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
}

// Templates de Mensagem
export const getMessageTemplates = async (filters?: MessageTemplateFilters): Promise<PaginatedResponse<MessageTemplate>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.ativo !== undefined) params.append('ativo', filters.ativo.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/message-templates?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getMessageTemplate = async (id: string): Promise<MessageTemplate> => {
  try {
    const response = await api.get(`/message-templates/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createMessageTemplate = async (data: CreateMessageTemplateRequest): Promise<MessageTemplate> => {
  try {
    const response = await api.post('/message-templates', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateMessageTemplate = async (id: string, data: UpdateMessageTemplateRequest): Promise<MessageTemplate> => {
  try {
    const response = await api.put(`/message-templates/${id}`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteMessageTemplate = async (id: string): Promise<void> => {
  try {
    await api.delete(`/message-templates/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Templates por tipo
export const getMessageTemplatesByTipo = async (tipo: string): Promise<MessageTemplate[]> => {
  try {
    const response = await api.get(`/message-templates/tipo/${tipo}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Templates ativos
export const getMessageTemplatesAtivos = async (): Promise<MessageTemplate[]> => {
  try {
    const response = await api.get('/message-templates/ativos');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Ativar template
export const ativarMessageTemplate = async (id: string): Promise<MessageTemplate> => {
  try {
    const response = await api.put(`/message-templates/${id}/ativar`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Desativar template
export const desativarMessageTemplate = async (id: string): Promise<MessageTemplate> => {
  try {
    const response = await api.put(`/message-templates/${id}/desativar`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Duplicar template
export const duplicarMessageTemplate = async (id: string, nome: string): Promise<MessageTemplate> => {
  try {
    const response = await api.post(`/message-templates/${id}/duplicar`, { nome });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Processar template com variáveis
export const processarTemplate = async (id: string, variaveis: Record<string, any>): Promise<string> => {
  try {
    const response = await api.post(`/message-templates/${id}/processar`, { variaveis });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Validar template
export const validarTemplate = async (conteudo: string): Promise<{
  valido: boolean;
  erros: string[];
  variaveis: string[];
}> => {
  try {
    const response = await api.post('/message-templates/validar', { conteudo });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Importar templates
export const importMessageTemplates = async (file: File): Promise<{ success: number; errors: string[] }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/message-templates/importar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exportar templates
export const exportMessageTemplates = async (filters?: MessageTemplateFilters, formato: 'json' | 'csv' = 'json'): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.ativo !== undefined) params.append('ativo', filters.ativo.toString());
    params.append('formato', formato);

    const response = await api.get(`/message-templates/exportar?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas de templates
export const getEstatisticasTemplates = async (): Promise<{
  totalTemplates: number;
  templatesAtivos: number;
  templatesPorTipo: Record<string, number>;
  templatesMaisUsados: Array<{
    id: string;
    nome: string;
    tipo: string;
    uso: number;
  }>;
}> => {
  try {
    const response = await api.get('/message-templates/estatisticas');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Buscar templates
export const buscarTemplates = async (termo: string, tipo?: string): Promise<MessageTemplate[]> => {
  try {
    const params = new URLSearchParams();
    params.append('termo', termo);
    if (tipo) params.append('tipo', tipo);

    const response = await api.get(`/message-templates/buscar?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Favoritar template
export const favoritarTemplate = async (id: string): Promise<MessageTemplate> => {
  try {
    const response = await api.put(`/message-templates/${id}/favoritar`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Desfavoritar template
export const desfavoritarTemplate = async (id: string): Promise<MessageTemplate> => {
  try {
    const response = await api.put(`/message-templates/${id}/desfavoritar`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Templates favoritos
export const getTemplatesFavoritos = async (): Promise<MessageTemplate[]> => {
  try {
    const response = await api.get('/message-templates/favoritos');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
}; 
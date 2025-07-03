import { api, extractData, handleApiError, PaginatedResponse } from './api';
import { Exame } from '@/types/api';

export interface CreateExameRequest {
  prontuarioId: string;
  tipo: string;
  data: string;
  resultado: string;
  observacoes?: string;
  arquivos?: File[];
}

export interface UpdateExameRequest {
  prontuarioId?: string;
  tipo?: string;
  data?: string;
  resultado?: string;
  observacoes?: string;
  arquivos?: File[];
}

export interface ExameFilters {
  pacienteNome?: string;
  prontuarioId?: string;
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}

// Exame
export const getExames = async (filters?: ExameFilters): Promise<PaginatedResponse<Exame>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.pacienteNome) params.append('pacienteNome', filters.pacienteNome);
    if (filters?.prontuarioId) params.append('prontuarioId', filters.prontuarioId);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters?.dataFim) params.append('dataFim', filters.dataFim);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/exames?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getExame = async (id: string): Promise<Exame> => {
  try {
    const response = await api.get(`/exames/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createExame = async (data: CreateExameRequest): Promise<Exame> => {
  try {
    const formData = new FormData();
    formData.append('prontuarioId', data.prontuarioId);
    formData.append('tipo', data.tipo);
    formData.append('data', data.data);
    formData.append('resultado', data.resultado);
    if (data.observacoes) formData.append('observacoes', data.observacoes);
    
    if (data.arquivos) {
      data.arquivos.forEach((arquivo, index) => {
        formData.append(`arquivos`, arquivo);
      });
    }

    const response = await api.post('/exames', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateExame = async (id: string, data: UpdateExameRequest): Promise<Exame> => {
  try {
    const formData = new FormData();
    if (data.prontuarioId) formData.append('prontuarioId', data.prontuarioId);
    if (data.tipo) formData.append('tipo', data.tipo);
    if (data.data) formData.append('data', data.data);
    if (data.resultado) formData.append('resultado', data.resultado);
    if (data.observacoes) formData.append('observacoes', data.observacoes);
    
    if (data.arquivos) {
      data.arquivos.forEach((arquivo, index) => {
        formData.append(`arquivos`, arquivo);
      });
    }

    const response = await api.put(`/exames/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteExame = async (id: string): Promise<void> => {
  try {
    await api.delete(`/exames/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exame por prontuário
export const getExamesByProntuario = async (prontuarioId: string): Promise<Exame[]> => {
  try {
    const response = await api.get(`/exames/prontuario/${prontuarioId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exame por tipo
export const getExamesByTipo = async (tipo: string): Promise<Exame[]> => {
  try {
    const response = await api.get(`/exames/tipo/${tipo}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exame por período
export const getExamesByPeriodo = async (dataInicio: string, dataFim: string): Promise<Exame[]> => {
  try {
    const response = await api.get(`/exames/periodo`, {
      params: { dataInicio, dataFim }
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Buscar exames
export const searchExames = async (searchTerm: string, limit: number = 10): Promise<Exame[]> => {
  try {
    const response = await api.get(`/exames/search`, {
      params: { q: searchTerm, limit }
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Upload de arquivo
export const uploadArquivo = async (exameId: string, arquivo: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    const response = await api.post(`/exames/${exameId}/arquivos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Download de arquivo
export const downloadArquivo = async (exameId: string, arquivoId: string): Promise<Blob> => {
  try {
    const response = await api.get(`/exames/${exameId}/arquivos/${arquivoId}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Deletar arquivo
export const deleteArquivo = async (exameId: string, arquivoId: string): Promise<void> => {
  try {
    await api.delete(`/exames/${exameId}/arquivos/${arquivoId}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas de exames
export const getExamesStats = async (periodo?: { inicio: string; fim: string }): Promise<{
  totalExames: number;
  examesPorTipo: Record<string, number>;
  examesPorPeriodo: Record<string, number>;
  mediaExamesPorDia: number;
  crescimentoMensal: number;
}> => {
  try {
    const response = await api.get('/exames/stats', {
      params: periodo
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exportar exames
export const exportExames = async (filters?: ExameFilters, formato: 'pdf' | 'xlsx' = 'xlsx'): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    if (filters?.pacienteNome) params.append('pacienteNome', filters.pacienteNome);
    if (filters?.prontuarioId) params.append('prontuarioId', filters.prontuarioId);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters?.dataFim) params.append('dataFim', filters.dataFim);
    params.append('formato', formato);

    const response = await api.get(`/exames/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Importar exames
export const importExames = async (file: File): Promise<{ success: number; errors: string[] }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/exames/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Validar exame
export const validarExame = async (data: CreateExameRequest): Promise<{
  valido: boolean;
  erros: string[];
  avisos: string[];
}> => {
  try {
    const response = await api.post('/exames/validar', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
}; 
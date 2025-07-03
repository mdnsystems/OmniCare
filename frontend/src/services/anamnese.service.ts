import { api, extractData, extractPaginatedData, handleApiError, PaginatedResponse } from './api';
import { Anamnese } from '@/types/api';

export interface CreateAnamneseRequest {
  pacienteId: string;
  profissionalId: string;
  prontuarioId: string;
  data: string;
  templateId: string;
  campos: Record<string, any>;
}

export interface UpdateAnamneseRequest {
  pacienteId?: string;
  profissionalId?: string;
  prontuarioId?: string;
  data?: string;
  templateId?: string;
  campos?: Record<string, any>;
}

export interface AnamneseFilters {
  pacienteId?: string;
  pacienteNome?: string;
  profissionalId?: string;
  prontuarioId?: string;
  data?: string;
  dataInicio?: string;
  dataFim?: string;
  templateId?: string;
  page?: number;
  limit?: number;
}

// Anamnese
export const getAnamneses = async (filters?: AnamneseFilters): Promise<PaginatedResponse<Anamnese>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.pacienteId) params.append('pacienteId', filters.pacienteId);
    if (filters?.pacienteNome) params.append('pacienteNome', filters.pacienteNome);
    if (filters?.profissionalId) params.append('profissionalId', filters.profissionalId);
    if (filters?.prontuarioId) params.append('prontuarioId', filters.prontuarioId);
    if (filters?.data) params.append('data', filters.data);
    if (filters?.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters?.dataFim) params.append('dataFim', filters.dataFim);
    if (filters?.templateId) params.append('templateId', filters.templateId);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    console.log('🔍 [AnamneseService] Fazendo requisição para:', `/anamneses?${params.toString()}`);
    
    const response = await api.get(`/anamneses?${params.toString()}`);
    
    console.log('🔍 [AnamneseService] Resposta bruta:', response);
    console.log('🔍 [AnamneseService] Response.data:', response.data);
    
    // Extrair dados paginados manualmente
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro na resposta da API');
    }
    
    const extractedData: PaginatedResponse<Anamnese> = {
      data: response.data.data || [],
      pagination: response.data.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    };
    
    console.log('🔍 [AnamneseService] Dados extraídos:', extractedData);
    
    return extractedData;
  } catch (error) {
    console.error('❌ [AnamneseService] Erro:', error);
    throw handleApiError(error);
  }
};

export const getAnamnese = async (id: string): Promise<Anamnese> => {
  try {
    const response = await api.get(`/anamneses/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createAnamnese = async (data: CreateAnamneseRequest): Promise<Anamnese> => {
  try {
    const response = await api.post('/anamneses', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAnamnese = async (id: string, data: UpdateAnamneseRequest): Promise<Anamnese> => {
  try {
    const response = await api.put(`/anamneses/${id}`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteAnamnese = async (id: string): Promise<void> => {
  try {
    await api.delete(`/anamneses/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Anamnese por paciente
export const getAnamnesesByPaciente = async (pacienteId: string): Promise<Anamnese[]> => {
  try {
    const response = await api.get(`/anamneses/paciente/${pacienteId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Anamnese por profissional
export const getAnamnesesByProfissional = async (profissionalId: string): Promise<Anamnese[]> => {
  try {
    const response = await api.get(`/anamneses/profissional/${profissionalId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Anamnese por prontuário
export const getAnamnesesByProntuario = async (prontuarioId: string): Promise<Anamnese[]> => {
  try {
    const response = await api.get(`/anamneses/prontuario/${prontuarioId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Anamnese de hoje
export const getAnamnesesHoje = async (): Promise<Anamnese[]> => {
  try {
    const response = await api.get('/anamneses/hoje');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Anamnese por data
export const getAnamnesesByData = async (data: string): Promise<Anamnese[]> => {
  try {
    const response = await api.get(`/anamneses/data/${data}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Anamnese por período
export const getAnamnesesByPeriodo = async (dataInicio: string, dataFim: string): Promise<Anamnese[]> => {
  try {
    const response = await api.get(`/anamneses/periodo`, {
      params: { dataInicio, dataFim }
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Templates de anamnese
export const getTemplatesAnamnese = async (): Promise<any[]> => {
  try {
    const response = await api.get('/anamneses/templates');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getTemplateAnamnese = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/anamneses/templates/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createTemplateAnamnese = async (data: any): Promise<any> => {
  try {
    const response = await api.post('/anamneses/templates', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateTemplateAnamnese = async (id: string, data: any): Promise<any> => {
  try {
    const response = await api.put(`/anamneses/templates/${id}`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteTemplateAnamnese = async (id: string): Promise<void> => {
  try {
    await api.delete(`/anamneses/templates/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Campos do template
export const getCamposTemplateAnamnese = async (templateId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/anamneses/templates/${templateId}/campos`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateCamposTemplateAnamnese = async (templateId: string, campos: any[]): Promise<any[]> => {
  try {
    const response = await api.put(`/anamneses/templates/${templateId}/campos`, { campos });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Validação de anamnese
export const validarAnamnese = async (data: CreateAnamneseRequest): Promise<{
  valida: boolean;
  erros: string[];
  avisos: string[];
}> => {
  try {
    const response = await api.post('/anamneses/validar', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas de anamnese
export const getEstatisticasAnamnese = async (periodo?: { inicio: string; fim: string }): Promise<{
  totalAnamneses: number;
  anamnesesPorTemplate: Record<string, number>;
  anamnesesPorProfissional: Record<string, number>;
  mediaAnamnesesPorDia: number;
  crescimentoMensal: number;
}> => {
  try {
    const params = new URLSearchParams();
    if (periodo?.inicio) params.append('inicio', periodo.inicio);
    if (periodo?.fim) params.append('fim', periodo.fim);

    const response = await api.get(`/anamneses/estatisticas?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exportação de anamnese
export const exportAnamnese = async (id: string, formato: 'pdf' | 'docx' = 'pdf'): Promise<Blob> => {
  try {
    const response = await api.get(`/anamneses/${id}/export`, {
      params: { formato },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Importação de anamneses
export const importAnamneses = async (file: File): Promise<{ success: number; errors: string[] }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/anamneses/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exportação de anamneses
export const exportAnamneses = async (filters?: AnamneseFilters, formato: 'pdf' | 'xlsx' = 'xlsx'): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    if (filters?.pacienteId) params.append('pacienteId', filters.pacienteId);
    if (filters?.profissionalId) params.append('profissionalId', filters.profissionalId);
    if (filters?.prontuarioId) params.append('prontuarioId', filters.prontuarioId);
    if (filters?.data) params.append('data', filters.data);
    if (filters?.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters?.dataFim) params.append('dataFim', filters.dataFim);
    if (filters?.templateId) params.append('templateId', filters.templateId);
    params.append('formato', formato);

    const response = await api.get(`/anamneses/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Verificar relações da anamnese
export const checkAnamneseRelations = async (id: string): Promise<{
  hasRelations: boolean;
  relations: {
    prontuario: number;
    exames: number;
    faturamentos: number;
  };
}> => {
  try {
    const response = await api.get(`/anamneses/${id}/relations`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
}; 
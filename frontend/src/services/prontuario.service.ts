import { api, extractData, extractPaginatedData, handleApiError, PaginatedResponse } from './api';
import { Prontuario, TipoProntuario } from '@/types/api';

export interface CreateProntuarioRequest {
  pacienteId: string;
  profissionalId: string;
  data: string;
  tipo: TipoProntuario;
  descricao: string;
  diagnostico?: string;
  prescricao?: string;
  observacoes?: string;
  camposPersonalizados?: Record<string, any>;
}

export interface UpdateProntuarioRequest {
  pacienteId?: string;
  profissionalId?: string;
  data?: string;
  tipo?: TipoProntuario;
  descricao?: string;
  diagnostico?: string;
  prescricao?: string;
  observacoes?: string;
  camposPersonalizados?: Record<string, any>;
}

export interface ProntuarioFilters {
  pacienteId?: string;
  profissionalId?: string;
  data?: string;
  dataInicio?: string;
  dataFim?: string;
  tipo?: TipoProntuario;
  page?: number;
  limit?: number;
}

// Prontuários
export const getProntuarios = async (filters?: ProntuarioFilters): Promise<Prontuario[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.pacienteId) params.append('pacienteId', filters.pacienteId);
    if (filters?.profissionalId) params.append('profissionalId', filters.profissionalId);
    if (filters?.data) params.append('data', filters.data);
    if (filters?.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters?.dataFim) params.append('dataFim', filters.dataFim);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/prontuarios?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getProntuario = async (id: string): Promise<Prontuario> => {
  try {
    const response = await api.get(`/prontuarios/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createProntuario = async (data: CreateProntuarioRequest): Promise<Prontuario> => {
  try {
    const response = await api.post('/prontuarios', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateProntuario = async (id: string, data: UpdateProntuarioRequest): Promise<Prontuario> => {
  try {
    const response = await api.put(`/prontuarios/${id}`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteProntuario = async (id: string): Promise<void> => {
  try {
    await api.delete(`/prontuarios/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Prontuários por paciente
export const getProntuariosByPaciente = async (pacienteId: string): Promise<Prontuario[]> => {
  try {
    const response = await api.get(`/prontuarios/paciente/${pacienteId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Prontuários por profissional
export const getProntuariosByProfissional = async (profissionalId: string): Promise<Prontuario[]> => {
  try {
    const response = await api.get(`/prontuarios/profissional/${profissionalId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Prontuários de hoje
export const getProntuariosHoje = async (): Promise<Prontuario[]> => {
  try {
    const response = await api.get('/prontuarios/hoje');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Prontuários por data
export const getProntuariosByData = async (data: string): Promise<Prontuario[]> => {
  try {
    const response = await api.get(`/prontuarios/data/${data}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Prontuários por período
export const getProntuariosByPeriodo = async (dataInicio: string, dataFim: string): Promise<Prontuario[]> => {
  try {
    const response = await api.get(`/prontuarios/periodo`, {
      params: { dataInicio, dataFim }
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Histórico completo do paciente
export const getHistoricoCompletoPaciente = async (pacienteId: string): Promise<{
  prontuarios: Prontuario[];
  anamneses: any[];
  exames: any[];
  agendamentos: any[];
}> => {
  try {
    const response = await api.get(`/prontuarios/historico-completo/${pacienteId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Evolução do paciente
export const getEvolucaoPaciente = async (pacienteId: string, periodo?: { inicio: string; fim: string }): Promise<{
  evolucao: any[];
  metricas: any;
  graficos: any[];
}> => {
  try {
    const params = new URLSearchParams();
    if (periodo?.inicio) params.append('inicio', periodo.inicio);
    if (periodo?.fim) params.append('fim', periodo.fim);

    const response = await api.get(`/prontuarios/evolucao/${pacienteId}?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Modelos de prontuário
export const getModelosProntuario = async (): Promise<any[]> => {
  try {
    const response = await api.get('/prontuarios/modelos');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getModeloProntuario = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/prontuarios/modelos/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createModeloProntuario = async (data: any): Promise<any> => {
  try {
    const response = await api.post('/prontuarios/modelos', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateModeloProntuario = async (id: string, data: any): Promise<any> => {
  try {
    const response = await api.put(`/prontuarios/modelos/${id}`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteModeloProntuario = async (id: string): Promise<void> => {
  try {
    await api.delete(`/prontuarios/modelos/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas de prontuários
export const getEstatisticasProntuarios = async (periodo?: { inicio: string; fim: string }): Promise<{
  totalProntuarios: number;
  prontuariosPorTipo: Record<string, number>;
  prontuariosPorProfissional: Record<string, number>;
  mediaProntuariosPorDia: number;
  crescimentoMensal: number;
}> => {
  try {
    const params = new URLSearchParams();
    if (periodo?.inicio) params.append('inicio', periodo.inicio);
    if (periodo?.fim) params.append('fim', periodo.fim);

    const response = await api.get(`/prontuarios/estatisticas?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exportação de prontuário
export const exportProntuario = async (id: string, formato: 'pdf' | 'docx' = 'pdf'): Promise<Blob> => {
  try {
    const response = await api.get(`/prontuarios/${id}/export`, {
      params: { formato },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Importação de prontuários
export const importProntuarios = async (file: File): Promise<{ success: number; errors: string[] }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/prontuarios/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exportação de prontuários
export const exportProntuarios = async (filters?: ProntuarioFilters, formato: 'pdf' | 'xlsx' = 'xlsx'): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    if (filters?.pacienteId) params.append('pacienteId', filters.pacienteId);
    if (filters?.profissionalId) params.append('profissionalId', filters.profissionalId);
    if (filters?.data) params.append('data', filters.data);
    if (filters?.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters?.dataFim) params.append('dataFim', filters.dataFim);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    params.append('formato', formato);

    const response = await api.get(`/prontuarios/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}; 
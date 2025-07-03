import { api, extractData, handleApiError, PaginatedResponse } from './api';
import { Especialidade, TipoClinica } from '@/types/api';

export interface CreateEspecialidadeRequest {
  nome: string;
  descricao: string;
  tipoClinica: TipoClinica;
  configuracoes: {
    camposObrigatorios: string[];
    templatesDisponiveis: string[];
    fluxoEspecifico?: string;
    relatoriosDisponiveis: string[];
    dashboardsDisponiveis: string[];
  };
  templates: string[];
  fluxos: string[];
  ativo: boolean;
}

export interface UpdateEspecialidadeRequest {
  nome?: string;
  descricao?: string;
  tipoClinica?: TipoClinica;
  configuracoes?: {
    camposObrigatorios?: string[];
    templatesDisponiveis?: string[];
    fluxoEspecifico?: string;
    relatoriosDisponiveis?: string[];
    dashboardsDisponiveis?: string[];
  };
  templates?: string[];
  fluxos?: string[];
  ativo?: boolean;
}

export interface EspecialidadeFilters {
  nome?: string;
  tipoClinica?: TipoClinica;
  ativo?: boolean;
  page?: number;
  limit?: number;
}

// Especialidades
export const getEspecialidades = async (filters?: EspecialidadeFilters): Promise<PaginatedResponse<Especialidade>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.nome) params.append('nome', filters.nome);
    if (filters?.tipoClinica) params.append('tipoClinica', filters.tipoClinica);
    if (filters?.ativo !== undefined) params.append('ativo', filters.ativo.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/especialidades?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getEspecialidade = async (id: string): Promise<Especialidade> => {
  try {
    const response = await api.get(`/especialidades/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createEspecialidade = async (data: CreateEspecialidadeRequest): Promise<Especialidade> => {
  try {
    const response = await api.post('/especialidades', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateEspecialidade = async (id: string, data: UpdateEspecialidadeRequest): Promise<Especialidade> => {
  try {
    const response = await api.put(`/especialidades/${id}`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteEspecialidade = async (id: string): Promise<void> => {
  try {
    await api.delete(`/especialidades/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Especialidades ativas
export const getEspecialidadesAtivas = async (): Promise<Especialidade[]> => {
  try {
    const response = await api.get('/especialidades/ativas');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Especialidades por tipo de clínica
export const getEspecialidadesByTipoClinica = async (tipoClinica: TipoClinica): Promise<Especialidade[]> => {
  try {
    const response = await api.get(`/especialidades/tipo/${tipoClinica}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Busca por nome
export const getEspecialidadeByNome = async (nome: string): Promise<Especialidade | null> => {
  try {
    const response = await api.get(`/especialidades/nome/${nome}`);
    return extractData(response);
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw handleApiError(error);
  }
};

// Configurações da especialidade
export const getConfiguracaoEspecialidade = async (especialidadeId: string): Promise<any> => {
  try {
    const response = await api.get(`/especialidades/${especialidadeId}/configuracao`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateConfiguracaoEspecialidade = async (especialidadeId: string, configuracao: any): Promise<any> => {
  try {
    const response = await api.put(`/especialidades/${especialidadeId}/configuracao`, configuracao);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Templates da especialidade
export const getTemplatesEspecialidade = async (especialidadeId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/especialidades/${especialidadeId}/templates`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const addTemplateEspecialidade = async (especialidadeId: string, templateId: string): Promise<void> => {
  try {
    await api.post(`/especialidades/${especialidadeId}/templates`, { templateId });
  } catch (error) {
    throw handleApiError(error);
  }
};

export const removeTemplateEspecialidade = async (especialidadeId: string, templateId: string): Promise<void> => {
  try {
    await api.delete(`/especialidades/${especialidadeId}/templates/${templateId}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Fluxos da especialidade
export const getFluxosEspecialidade = async (especialidadeId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/especialidades/${especialidadeId}/fluxos`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const addFluxoEspecialidade = async (especialidadeId: string, fluxoId: string): Promise<void> => {
  try {
    await api.post(`/especialidades/${especialidadeId}/fluxos`, { fluxoId });
  } catch (error) {
    throw handleApiError(error);
  }
};

export const removeFluxoEspecialidade = async (especialidadeId: string, fluxoId: string): Promise<void> => {
  try {
    await api.delete(`/especialidades/${especialidadeId}/fluxos/${fluxoId}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas da especialidade
export const getEstatisticasEspecialidade = async (especialidadeId: string, periodo?: { inicio: string; fim: string }): Promise<{
  totalProfissionais: number;
  totalPacientes: number;
  totalConsultas: number;
  taxaOcupacao: number;
  receitaTotal: number;
  mediaConsultasPorDia: number;
}> => {
  try {
    const params = new URLSearchParams();
    if (periodo?.inicio) params.append('inicio', periodo.inicio);
    if (periodo?.fim) params.append('fim', periodo.fim);

    const response = await api.get(`/especialidades/${especialidadeId}/estatisticas?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Validação de nome
export const validateNomeEspecialidade = async (nome: string, excludeId?: string): Promise<{ valid: boolean; message?: string }> => {
  try {
    const response = await api.post('/especialidades/validate-nome', { nome, excludeId });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Importação de especialidades
export const importEspecialidades = async (file: File): Promise<{ success: number; errors: string[] }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/especialidades/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exportação de especialidades
export const exportEspecialidades = async (filters?: EspecialidadeFilters): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    if (filters?.nome) params.append('nome', filters.nome);
    if (filters?.tipoClinica) params.append('tipoClinica', filters.tipoClinica);
    if (filters?.ativo !== undefined) params.append('ativo', filters.ativo.toString());

    const response = await api.get(`/especialidades/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}; 
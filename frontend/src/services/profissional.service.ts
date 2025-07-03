import { api, extractData, handleApiError, PaginatedResponse } from './api';
import { Profissional, ProfissionalStatus, Endereco, HorarioTrabalho } from '@/types/api';

export interface CreateProfissionalRequest {
  nome: string;
  especialidadeId: string;
  registro: string;
  crm: string;
  email: string;
  telefone: string;
  sexo: string;
  dataNascimento: string;
  dataContratacao: string;
  status: ProfissionalStatus;
  endereco: Endereco;
  horarios: HorarioTrabalho;
}

export interface UpdateProfissionalRequest {
  nome?: string;
  especialidadeId?: string;
  registro?: string;
  crm?: string;
  email?: string;
  telefone?: string;
  sexo?: string;
  dataNascimento?: string;
  dataContratacao?: string;
  status?: ProfissionalStatus;
  endereco?: Partial<Endereco>;
  horarios?: Partial<HorarioTrabalho>;
}

export interface ProfissionalFilters {
  nome?: string;
  especialidadeId?: string;
  status?: ProfissionalStatus;
  email?: string;
  page?: number;
  limit?: number;
}

// Profissionais
export const getProfissionais = async (filters?: ProfissionalFilters): Promise<PaginatedResponse<Profissional>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.nome) params.append('nome', filters.nome);
    if (filters?.especialidadeId) params.append('especialidadeId', filters.especialidadeId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.email) params.append('email', filters.email);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/profissionais?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getProfissional = async (id: string): Promise<Profissional> => {
  try {
    const response = await api.get(`/profissionais/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createProfissional = async (data: CreateProfissionalRequest): Promise<Profissional> => {
  try {
    const response = await api.post('/profissionais', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateProfissional = async (id: string, data: UpdateProfissionalRequest): Promise<Profissional> => {
  try {
    const response = await api.put(`/profissionais/${id}`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteProfissional = async (id: string): Promise<void> => {
  try {
    await api.delete(`/profissionais/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Profissionais por especialidade
export const getProfissionaisByEspecialidade = async (especialidadeId: string): Promise<Profissional[]> => {
  try {
    const response = await api.get(`/profissionais/especialidade/${especialidadeId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Profissionais ativos
export const getProfissionaisAtivos = async (): Promise<Profissional[]> => {
  try {
    const response = await api.get('/profissionais/ativos');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Busca por CRM
export const getProfissionalByCrm = async (crm: string): Promise<Profissional | null> => {
  try {
    const response = await api.get(`/profissionais/crm/${crm}`);
    return extractData(response);
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw handleApiError(error);
  }
};

// Busca por email
export const getProfissionalByEmail = async (email: string): Promise<Profissional | null> => {
  try {
    const response = await api.get(`/profissionais/email/${email}`);
    return extractData(response);
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw handleApiError(error);
  }
};

// Horários de trabalho
export const getHorariosProfissional = async (profissionalId: string): Promise<HorarioTrabalho> => {
  try {
    const response = await api.get(`/profissionais/${profissionalId}/horarios`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateHorariosProfissional = async (profissionalId: string, horarios: HorarioTrabalho): Promise<HorarioTrabalho> => {
  try {
    const response = await api.put(`/profissionais/${profissionalId}/horarios`, horarios);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Disponibilidade do profissional
export const getDisponibilidadeProfissional = async (profissionalId: string, data: string): Promise<{
  disponivel: boolean;
  horariosDisponiveis: string[];
  agendamentos: any[];
}> => {
  try {
    const response = await api.get(`/profissionais/${profissionalId}/disponibilidade`, {
      params: { data }
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas do profissional
export const getEstatisticasProfissional = async (profissionalId: string, periodo?: { inicio: string; fim: string }): Promise<{
  totalConsultas: number;
  consultasRealizadas: number;
  consultasCanceladas: number;
  taxaOcupacao: number;
  receitaTotal: number;
  mediaConsultasPorDia: number;
}> => {
  try {
    const params = new URLSearchParams();
    if (periodo?.inicio) params.append('inicio', periodo.inicio);
    if (periodo?.fim) params.append('fim', periodo.fim);

    const response = await api.get(`/profissionais/${profissionalId}/estatisticas?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Validação de CRM
export const validateCrm = async (crm: string): Promise<{ valid: boolean; message?: string }> => {
  try {
    const response = await api.post('/profissionais/validate-crm', { crm });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Importação de profissionais
export const importProfissionais = async (file: File): Promise<{ success: number; errors: string[] }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/profissionais/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exportação de profissionais
export const exportProfissionais = async (filters?: ProfissionalFilters): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    if (filters?.nome) params.append('nome', filters.nome);
    if (filters?.especialidadeId) params.append('especialidadeId', filters.especialidadeId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.email) params.append('email', filters.email);

    const response = await api.get(`/profissionais/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Verificar relações do profissional
export const checkProfissionalRelations = async (id: string): Promise<{
  hasRelations: boolean;
  relationsCount: number;
  relations: {
    pacientes: number;
    agendamentos: number;
    prontuarios: number;
    anamneses: number;
    faturamentos: number;
    usuarios: number;
  };
}> => {
  try {
    const response = await api.get(`/profissionais/${id}/relations`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
}; 
import { api, extractData, handleApiError, PaginatedResponse } from './api';
import { Paciente } from '@/types/api';

export interface CreatePacienteRequest {
  nome: string;
  dataNascimento: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  pais?: string;
  convenioNome?: string;
  convenioNumero?: string;
  convenioPlano?: string;
  convenioValidade?: string;
  profissionalId: string;
  camposPersonalizados?: Record<string, any>;
}

export interface UpdatePacienteRequest {
  nome?: string;
  dataNascimento?: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  pais?: string;
  convenioNome?: string;
  convenioNumero?: string;
  convenioPlano?: string;
  convenioValidade?: string;
  profissionalId?: string;
  camposPersonalizados?: Record<string, any>;
}

export interface PacienteFilters {
  nome?: string;
  cpf?: string;
  email?: string;
  profissionalId?: string;
  page?: number;
  limit?: number;
}

// Pacientes
export const getPacientes = async (filters?: PacienteFilters): Promise<PaginatedResponse<Paciente>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.nome) params.append('nome', filters.nome);
    if (filters?.cpf) params.append('cpf', filters.cpf);
    if (filters?.email) params.append('email', filters.email);
    if (filters?.profissionalId) params.append('profissionalId', filters.profissionalId);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/pacientes?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPaciente = async (id: string): Promise<Paciente> => {
  try {
    const response = await api.get(`/pacientes/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createPaciente = async (data: CreatePacienteRequest): Promise<Paciente> => {
  try {
    const response = await api.post('/pacientes', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updatePaciente = async (id: string, data: UpdatePacienteRequest): Promise<Paciente> => {
  try {
    const response = await api.put(`/pacientes/${id}`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deletePaciente = async (id: string, cascade: boolean = false): Promise<void> => {
  try {
    const url = cascade ? `/pacientes/${id}?cascade=true` : `/pacientes/${id}`;
    await api.delete(url);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Verificar relações do paciente
export const checkPacienteRelations = async (id: string): Promise<{
  hasRelations: boolean;
  relations: {
    agendamentos: number;
    prontuarios: number;
    anamneses: number;
    faturamentos: number;
  };
}> => {
  try {
    const response = await api.get(`/pacientes/${id}/relations`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Busca por CPF
export const getPacienteByCpf = async (cpf: string): Promise<Paciente | null> => {
  try {
    const response = await api.get(`/pacientes/cpf/${cpf}`);
    return extractData(response);
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw handleApiError(error);
  }
};

// Busca por email
export const getPacienteByEmail = async (email: string): Promise<Paciente | null> => {
  try {
    const response = await api.get(`/pacientes/email/${email}`);
    return extractData(response);
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw handleApiError(error);
  }
};

// Pacientes por profissional
export const getPacientesByProfissional = async (profissionalId: string): Promise<Paciente[]> => {
  try {
    const response = await api.get(`/pacientes/profissional/${profissionalId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Histórico do paciente
export const getHistoricoPaciente = async (pacienteId: string): Promise<{
  agendamentos: any[];
  prontuarios: any[];
  anamneses: any[];
  exames: any[];
  faturamentos: any[];
}> => {
  try {
    const response = await api.get(`/pacientes/${pacienteId}/historico`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Validação de CPF
export const validateCpf = async (cpf: string): Promise<{ valid: boolean; message?: string }> => {
  try {
    const response = await api.post('/pacientes/validate-cpf', { cpf });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Importação de pacientes
export const importPacientes = async (file: File): Promise<{ success: number; errors: string[] }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/pacientes/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exportação de pacientes
export const exportPacientes = async (filters?: PacienteFilters): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    if (filters?.nome) params.append('nome', filters.nome);
    if (filters?.cpf) params.append('cpf', filters.cpf);
    if (filters?.email) params.append('email', filters.email);
    if (filters?.profissionalId) params.append('profissionalId', filters.profissionalId);

    const response = await api.get(`/pacientes/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}; 
import { api, extractData, handleApiError, PaginatedResponse } from './api';
import { Agendamento, TipoAgendamento, StatusAgendamento } from '@/types/api';

export interface CreateAgendamentoRequest {
  pacienteId: string;
  profissionalId: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  tipo: TipoAgendamento;
  observacoes?: string;
  camposPersonalizados?: Record<string, any>;
}

export interface UpdateAgendamentoRequest {
  pacienteId?: string;
  profissionalId?: string;
  data?: string;
  horaInicio?: string;
  horaFim?: string;
  tipo?: TipoAgendamento;
  status?: StatusAgendamento;
  observacoes?: string;
  camposPersonalizados?: Record<string, any>;
}

export interface AgendamentoFilters {
  pacienteId?: string;
  pacienteNome?: string;
  profissionalId?: string;
  data?: string;
  dataInicio?: string;
  dataFim?: string;
  tipo?: TipoAgendamento;
  status?: StatusAgendamento;
  page?: number;
  limit?: number;
}

// Agendamentos
export const getAgendamentos = async (filters?: AgendamentoFilters): Promise<PaginatedResponse<Agendamento>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.pacienteId) params.append('pacienteId', filters.pacienteId);
    if (filters?.pacienteNome) params.append('pacienteNome', filters.pacienteNome);
    if (filters?.profissionalId) params.append('profissionalId', filters.profissionalId);
    if (filters?.data) params.append('data', filters.data);
    if (filters?.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters?.dataFim) params.append('dataFim', filters.dataFim);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/agendamentos?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAgendamento = async (id: string): Promise<Agendamento> => {
  try {
    const response = await api.get(`/agendamentos/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createAgendamento = async (data: CreateAgendamentoRequest): Promise<Agendamento> => {
  try {
    const response = await api.post('/agendamentos', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAgendamento = async (id: string, data: UpdateAgendamentoRequest): Promise<Agendamento> => {
  try {
    const response = await api.put(`/agendamentos/${id}`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteAgendamento = async (id: string): Promise<void> => {
  try {
    await api.delete(`/agendamentos/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Agendamentos por data
export const getAgendamentosByData = async (data: string): Promise<Agendamento[]> => {
  try {
    const response = await api.get(`/agendamentos/data/${data}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Agendamentos por profissional
export const getAgendamentosByProfissional = async (profissionalId: string, data?: string): Promise<Agendamento[]> => {
  try {
    const params = new URLSearchParams();
    if (data) params.append('data', data);

    const response = await api.get(`/agendamentos/profissional/${profissionalId}?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Agendamentos por paciente
export const getAgendamentosByPaciente = async (pacienteId: string): Promise<Agendamento[]> => {
  try {
    const response = await api.get(`/agendamentos/paciente/${pacienteId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Agendamentos de hoje
export const getAgendamentosHoje = async (): Promise<Agendamento[]> => {
  try {
    const response = await api.get('/agendamentos/hoje');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Agendamentos da semana
export const getAgendamentosSemana = async (dataInicio?: string): Promise<Agendamento[]> => {
  try {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);

    const response = await api.get(`/agendamentos/semana?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Agendamentos do mês
export const getAgendamentosMes = async (ano?: number, mes?: number): Promise<Agendamento[]> => {
  try {
    const params = new URLSearchParams();
    if (ano) params.append('ano', ano.toString());
    if (mes) params.append('mes', mes.toString());

    const response = await api.get(`/agendamentos/mes?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Confirmação de agendamento
export const confirmarAgendamento = async (id: string): Promise<Agendamento> => {
  try {
    const response = await api.put(`/agendamentos/${id}/confirmar`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Cancelamento de agendamento
export const cancelarAgendamento = async (id: string, motivo?: string): Promise<Agendamento> => {
  try {
    const response = await api.put(`/agendamentos/${id}/cancelar`, { motivo });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Remarcação de agendamento
export const remarcarAgendamento = async (id: string, novaData: string, novaHoraInicio: string, novaHoraFim: string): Promise<Agendamento> => {
  try {
    const response = await api.put(`/agendamentos/${id}/remarcar`, {
      novaData,
      novaHoraInicio,
      novaHoraFim
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Realização de agendamento
export const realizarAgendamento = async (id: string): Promise<Agendamento> => {
  try {
    const response = await api.put(`/agendamentos/${id}/realizar`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Verificação de disponibilidade
export const verificarDisponibilidade = async (profissionalId: string, data: string, horaInicio: string, horaFim: string, excludeId?: string): Promise<{
  disponivel: boolean;
  conflitos: Agendamento[];
}> => {
  try {
    const params = new URLSearchParams();
    params.append('data', data);
    params.append('horaInicio', horaInicio);
    params.append('horaFim', horaFim);
    if (excludeId) params.append('excludeId', excludeId);

    const response = await api.get(`/agendamentos/disponibilidade/${profissionalId}?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Horários disponíveis
export const getHorariosDisponiveis = async (profissionalId: string, data: string): Promise<string[]> => {
  try {
    const response = await api.get(`/agendamentos/horarios-disponiveis/${profissionalId}`, {
      params: { data }
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas de agendamentos
export const getEstatisticasAgendamentos = async (periodo?: { inicio: string; fim: string }): Promise<{
  totalAgendamentos: number;
  agendamentosConfirmados: number;
  agendamentosCancelados: number;
  agendamentosRealizados: number;
  taxaOcupacao: number;
  mediaAgendamentosPorDia: number;
}> => {
  try {
    const params = new URLSearchParams();
    if (periodo?.inicio) params.append('inicio', periodo.inicio);
    if (periodo?.fim) params.append('fim', periodo.fim);

    const response = await api.get(`/agendamentos/estatisticas?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Lembretes de agendamento
export const enviarLembreteAgendamento = async (id: string): Promise<void> => {
  try {
    await api.post(`/agendamentos/${id}/lembrete`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Confirmação via link
export const confirmarAgendamentoViaLink = async (token: string): Promise<Agendamento> => {
  try {
    const response = await api.post('/agendamentos/confirmar-via-link', { token });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Cancelamento via link
export const cancelarAgendamentoViaLink = async (token: string): Promise<Agendamento> => {
  try {
    const response = await api.post('/agendamentos/cancelar-via-link', { token });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Importação de agendamentos
export const importAgendamentos = async (file: File): Promise<{ success: number; errors: string[] }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/agendamentos/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exportação de agendamentos
export const exportAgendamentos = async (filters?: AgendamentoFilters): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    if (filters?.pacienteId) params.append('pacienteId', filters.pacienteId);
    if (filters?.profissionalId) params.append('profissionalId', filters.profissionalId);
    if (filters?.data) params.append('data', filters.data);
    if (filters?.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters?.dataFim) params.append('dataFim', filters.dataFim);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.status) params.append('status', filters.status);

    const response = await api.get(`/agendamentos/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}; 
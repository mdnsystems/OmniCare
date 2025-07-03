import { api, extractData, handleApiError, PaginatedResponse } from './api';
import { TipoLembrete, StatusLembrete, Lembrete } from '@/types/api';

export interface LembretePersonalizado {
  faturaId: string;
  tipo: TipoLembrete;
  mensagem: string;
  destinatario: string;
  assunto?: string;
}

export interface NotificacaoLembrete {
  id: string;
  faturaId: string;
  tipo: string;
  mensagem: string;
  destinatario: string;
  dataEnvio: string;
  status: StatusLembrete;
  lida: boolean;
  fatura?: {
    numeroFatura: string;
    valor: number;
    dataVencimento: string;
    clinica?: {
      nome: string;
    };
  };
}

export interface CreateLembreteRequest {
  pacienteId: string;
  profissionalId: string;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  tipo: string;
  prioridade: string;
  repetir: boolean;
  frequencia?: string;
}

export interface UpdateLembreteRequest {
  pacienteId?: string;
  profissionalId?: string;
  titulo?: string;
  descricao?: string;
  data?: string;
  hora?: string;
  tipo?: string;
  prioridade?: string;
  repetir?: boolean;
  frequencia?: string;
}

export interface LembreteFilters {
  pacienteNome?: string;
  profissionalId?: string;
  tipo?: string;
  status?: string;
  prioridade?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}

// Buscar notificações de lembretes
export const buscarNotificacoesLembretes = async (): Promise<NotificacaoLembrete[]> => {
  const response = await api.get('/lembretes/notificacoes');
  return extractData(response);
};

// Marcar notificação como lida
export const marcarNotificacaoComoLida = async (notificacaoId: string): Promise<any> => {
  const response = await api.put(`/lembretes/notificacoes/${notificacaoId}/marcar-lida`);
  return extractData(response);
};

// Marcar todas as notificações como lidas
export const marcarTodasNotificacoesComoLidas = async (): Promise<any> => {
  const response = await api.put('/lembretes/notificacoes/marcar-todas-lidas');
  return extractData(response);
};

// Enviar lembrete personalizado (para SUPER_ADMIN)
export const enviarLembretePersonalizado = async (dados: LembretePersonalizado): Promise<any> => {
  const response = await api.post('/lembretes/enviar-lembrete', dados);
  return extractData(response);
};

// Buscar estatísticas de lembretes
export const buscarEstatisticasLembretes = async (): Promise<any> => {
  const response = await api.get('/lembretes/notificacoes/estatisticas');
  return extractData(response);
};

// Lembrete
export const getLembretes = async (filters?: LembreteFilters): Promise<PaginatedResponse<Lembrete>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.pacienteNome) params.append('pacienteNome', filters.pacienteNome);
    if (filters?.profissionalId) params.append('profissionalId', filters.profissionalId);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.prioridade) params.append('prioridade', filters.prioridade);
    if (filters?.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters?.dataFim) params.append('dataFim', filters.dataFim);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/lembretes?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getLembrete = async (id: string): Promise<Lembrete> => {
  try {
    const response = await api.get(`/lembretes/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createLembrete = async (data: CreateLembreteRequest): Promise<Lembrete> => {
  try {
    const response = await api.post('/lembretes', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateLembrete = async (id: string, data: UpdateLembreteRequest): Promise<Lembrete> => {
  try {
    const response = await api.put(`/lembretes/${id}`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteLembrete = async (id: string): Promise<void> => {
  try {
    await api.delete(`/lembretes/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Lembrete por paciente
export const getLembretesByPaciente = async (pacienteId: string): Promise<Lembrete[]> => {
  try {
    const response = await api.get(`/lembretes/paciente/${pacienteId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Lembrete por profissional
export const getLembretesByProfissional = async (profissionalId: string): Promise<Lembrete[]> => {
  try {
    const response = await api.get(`/lembretes/profissional/${profissionalId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Lembrete por tipo
export const getLembretesByTipo = async (tipo: string): Promise<Lembrete[]> => {
  try {
    const response = await api.get(`/lembretes/tipo/${tipo}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Lembrete por status
export const getLembretesByStatus = async (status: string): Promise<Lembrete[]> => {
  try {
    const response = await api.get(`/lembretes/status/${status}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Lembrete por período
export const getLembretesByPeriodo = async (dataInicio: string, dataFim: string): Promise<Lembrete[]> => {
  try {
    const response = await api.get(`/lembretes/periodo`, {
      params: { dataInicio, dataFim }
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Buscar lembretes
export const searchLembretes = async (searchTerm: string, limit: number = 10): Promise<Lembrete[]> => {
  try {
    const response = await api.get(`/lembretes/search`, {
      params: { q: searchTerm, limit }
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Marcar lembrete como concluído
export const marcarLembreteConcluido = async (id: string): Promise<Lembrete> => {
  try {
    const response = await api.patch(`/lembretes/${id}/concluir`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Marcar lembrete como cancelado
export const marcarLembreteCancelado = async (id: string): Promise<Lembrete> => {
  try {
    const response = await api.patch(`/lembretes/${id}/cancelar`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas de lembretes
export const getLembretesStats = async (periodo?: { inicio: string; fim: string }): Promise<{
  totalLembretes: number;
  lembretesPorStatus: Record<string, number>;
  lembretesPorTipo: Record<string, number>;
  lembretesPorPrioridade: Record<string, number>;
  mediaLembretesPorDia: number;
  crescimentoMensal: number;
}> => {
  try {
    const response = await api.get('/lembretes/stats', {
      params: periodo
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Exportar lembretes
export const exportLembretes = async (filters?: LembreteFilters, formato: 'pdf' | 'xlsx' = 'xlsx'): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    if (filters?.pacienteNome) params.append('pacienteNome', filters.pacienteNome);
    if (filters?.profissionalId) params.append('profissionalId', filters.profissionalId);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.prioridade) params.append('prioridade', filters.prioridade);
    if (filters?.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters?.dataFim) params.append('dataFim', filters.dataFim);
    params.append('formato', formato);

    const response = await api.get(`/lembretes/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Importar lembretes
export const importLembretes = async (file: File): Promise<{ success: number; errors: string[] }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/lembretes/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Validar lembrete
export const validarLembrete = async (data: CreateLembreteRequest): Promise<{
  valido: boolean;
  erros: string[];
  avisos: string[];
}> => {
  try {
    const response = await api.post('/lembretes/validar', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
}; 
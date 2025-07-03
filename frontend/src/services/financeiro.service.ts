import { api, extractData, handleApiError, PaginatedResponse } from './api';
import { Faturamento, Pagamento, TipoFaturamento, FormaPagamento, StatusFaturamento } from '@/types/api';

export interface CreateFaturamentoRequest {
  pacienteId: string;
  profissionalId: string;
  agendamentoId?: string;
  prontuarioId?: string;
  tipo: TipoFaturamento;
  valor: number;
  desconto?: number;
  valorFinal: number;
  formaPagamento: FormaPagamento;
  dataVencimento: string;
  observacoes?: string;
  camposPersonalizados?: Record<string, any>;
}

export interface UpdateFaturamentoRequest {
  pacienteId?: string;
  profissionalId?: string;
  agendamentoId?: string;
  prontuarioId?: string;
  tipo?: TipoFaturamento;
  valor?: number;
  desconto?: number;
  valorFinal?: number;
  formaPagamento?: FormaPagamento;
  status?: StatusFaturamento;
  dataVencimento?: string;
  dataPagamento?: string;
  observacoes?: string;
  camposPersonalizados?: Record<string, any>;
}

export interface FaturamentoFilters {
  pacienteId?: string;
  profissionalId?: string;
  tipo?: TipoFaturamento;
  status?: StatusFaturamento;
  dataInicio?: string;
  dataFim?: string;
  dataVencimentoInicio?: string;
  dataVencimentoFim?: string;
  page?: number;
  limit?: number;
}

// Faturamento - Endpoints que existem no backend
export const getFaturamentos = async (filters?: FaturamentoFilters): Promise<PaginatedResponse<Faturamento>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.pacienteId) params.append('pacienteId', filters.pacienteId);
    if (filters?.profissionalId) params.append('profissionalId', filters.profissionalId);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters?.dataFim) params.append('dataFim', filters.dataFim);
    if (filters?.dataVencimentoInicio) params.append('dataVencimentoInicio', filters.dataVencimentoInicio);
    if (filters?.dataVencimentoFim) params.append('dataVencimentoFim', filters.dataVencimentoFim);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/faturamento?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getFaturamento = async (id: string): Promise<Faturamento> => {
  try {
    const response = await api.get(`/faturamento/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createFaturamento = async (data: CreateFaturamentoRequest): Promise<Faturamento> => {
  try {
    const response = await api.post('/faturamento', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateFaturamento = async (id: string, data: UpdateFaturamentoRequest): Promise<Faturamento> => {
  try {
    const response = await api.put(`/faturamento/${id}`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteFaturamento = async (id: string): Promise<void> => {
  try {
    await api.delete(`/faturamento/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Faturamentos por paciente
export const getFaturamentosByPaciente = async (pacienteId: string): Promise<Faturamento[]> => {
  try {
    const response = await api.get(`/faturamento/paciente/${pacienteId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Faturamentos por profissional
export const getFaturamentosByProfissional = async (profissionalId: string): Promise<Faturamento[]> => {
  try {
    const response = await api.get(`/faturamento/profissional/${profissionalId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Faturamentos por status
export const getFaturamentosByStatus = async (status: StatusFaturamento): Promise<Faturamento[]> => {
  try {
    const response = await api.get(`/faturamento/status/${status}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Faturamentos vencidos
export const getFaturamentosVencidos = async (): Promise<Faturamento[]> => {
  try {
    const response = await api.get('/faturamento/vencidos');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Faturamentos a vencer
export const getFaturamentosAVencer = async (dias: number = 7): Promise<Faturamento[]> => {
  try {
    const response = await api.get(`/faturamento/a-vencer?dias=${dias}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Pagamentos - Endpoints que existem no backend
export const getPagamentos = async (faturamentoId?: string): Promise<Pagamento[]> => {
  try {
    const params = new URLSearchParams();
    if (faturamentoId) params.append('faturamentoId', faturamentoId);

    const response = await api.get(`/pagamentos?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPagamento = async (id: string): Promise<Pagamento> => {
  try {
    const response = await api.get(`/pagamentos/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createPagamento = async (data: {
  faturamentoId: string;
  valor: number;
  formaPagamento: FormaPagamento;
  dataPagamento: string;
  comprovante?: string;
  observacoes?: string;
}): Promise<Pagamento> => {
  try {
    const response = await api.post('/pagamentos', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updatePagamento = async (id: string, data: Partial<Pagamento>): Promise<Pagamento> => {
  try {
    const response = await api.put(`/pagamentos/${id}`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deletePagamento = async (id: string): Promise<void> => {
  try {
    await api.delete(`/pagamentos/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPagamentosByFaturamento = async (faturamentoId: string): Promise<Pagamento[]> => {
  try {
    const response = await api.get(`/pagamentos/faturamento/${faturamentoId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Funções mock para funcionalidades que não existem no backend ainda
export const getEstatisticasFinanceiras = async (periodo?: { inicio: string; fim: string }): Promise<{
  receitaTotal: number;
  receitaPaga: number;
  receitaPendente: number;
  receitaVencida: number;
  mediaTicket: number;
  taxaConversao: number;
  crescimentoMensal: number;
  faturamentosPorStatus: Record<StatusFaturamento, number>;
  faturamentosPorTipo: Record<TipoFaturamento, number>;
  pagamentosPorForma: Record<FormaPagamento, number>;
}> => {
  // Mock temporário até implementar no backend
  return {
    receitaTotal: 50000,
    receitaPaga: 35000,
    receitaPendente: 12000,
    receitaVencida: 3000,
    mediaTicket: 250,
    taxaConversao: 0.85,
    crescimentoMensal: 0.12,
    faturamentosPorStatus: {
      PENDENTE: 15,
      PAGO: 140,
      VENCIDO: 3,
      CANCELADO: 2
    } as Record<StatusFaturamento, number>,
    faturamentosPorTipo: {
      CONSULTA: 120,
      EXAME: 25,
      PROCEDIMENTO: 15
    } as Record<TipoFaturamento, number>,
    pagamentosPorForma: {
      DINHEIRO: 5000,
      CARTAO_CREDITO: 20000,
      CARTAO_DEBITO: 8000,
      PIX: 2000
    } as Record<FormaPagamento, number>
  };
};

export const getFluxoCaixa = async (periodo: { inicio: string; fim: string }): Promise<{
  entradas: number;
  saidas: number;
  saldo: number;
  detalhamento: Array<{
    data: string;
    entradas: number;
    saidas: number;
    saldo: number;
  }>;
}> => {
  // Mock temporário até implementar no backend
  return {
    entradas: 50000,
    saidas: 15000,
    saldo: 35000,
    detalhamento: [
      {
        data: '2024-01-01',
        entradas: 5000,
        saidas: 1500,
        saldo: 3500
      }
    ]
  };
};

export const getInadimplencia = async (): Promise<{
  totalInadimplentes: number;
  valorTotalInadimplente: number;
  inadimplentes: Array<{
    pacienteId: string;
    pacienteNome: string;
    valorDevido: number;
    diasAtraso: number;
    ultimoPagamento: string;
  }>;
}> => {
  // Mock temporário até implementar no backend
  return {
    totalInadimplentes: 5,
    valorTotalInadimplente: 3000,
    inadimplentes: [
      {
        pacienteId: '1',
        pacienteNome: 'João Silva',
        valorDevido: 500,
        diasAtraso: 15,
        ultimoPagamento: '2024-01-01'
      }
    ]
  };
};

export const gerarRelatorioFinanceiro = async (tipo: string, periodo: { inicio: string; fim: string }, filtros?: any): Promise<Blob> => {
  // Mock temporário até implementar no backend
  return new Blob(['Relatório financeiro'], { type: 'application/pdf' });
};

export const exportFaturamentos = async (filters?: FaturamentoFilters, formato: 'pdf' | 'xlsx' = 'xlsx'): Promise<Blob> => {
  // Mock temporário até implementar no backend
  return new Blob(['Exportação de faturamentos'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

export const importFaturamentos = async (file: File): Promise<{ success: number; errors: string[] }> => {
  // Mock temporário até implementar no backend
  return {
    success: 10,
    errors: []
  };
}; 
import { api, extractData, handleApiError } from './api';

export interface DashboardData {
  agendamentos: {
    hoje: number;
    mes: number;
    realizados: number;
    cancelados: number;
    taxaSucesso: number;
  };
  financeiro: {
    receitaTotal: number;
    receitaPaga: number;
    receitaPendente: number;
    mediaTicket: number;
  };
  pacientes: {
    total: number;
    novosMes: number;
  };
  profissionais: {
    total: number;
    ativos: number;
  };
  prontuarios: {
    mes: number;
  };
  anamnese: {
    mes: number;
  };
}

export interface EstatisticasAgendamentos {
  total: number;
  realizados: number;
  cancelados: number;
  confirmados: number;
  pendentes: number;
  taxaSucesso: number;
  taxaCancelamento: number;
  porTipo: {
    CONSULTA: number;
    RETORNO: number;
    EXAME: number;
    PROCEDIMENTO: number;
  };
  porProfissional: number;
}

export interface EstatisticasFinanceiras {
  total: number;
  receitaTotal: number;
  receitaPaga: number;
  receitaPendente: number;
  receitaVencida: number;
  taxaConversao: number;
  mediaTicket: number;
  porFormaPagamento: {
    DINHEIRO: number;
    CARTAO_CREDITO: number;
    CARTAO_DEBITO: number;
    PIX: number;
    TRANSFERENCIA: number;
  };
}

export interface EstatisticasPacientes {
  total: number;
  novosMes: number;
  comAgendamentos: number;
  taxaRetencao: number;
}

export interface EstatisticasProfissionais {
  total: number;
  ativos: number;
  comAgendamentos: number;
  taxaAtividade: number;
}

export interface EstatisticasProntuarios {
  total: number;
  porTipo: Record<string, number>;
}

export interface EstatisticasAnamnese {
  total: number;
  pacientesComAnamnese: number;
  totalPacientes: number;
  taxaCobertura: number;
}

export interface EstatisticasAtividades {
  agendamentosSemana: number;
  agendamentosRealizadosSemana: number;
  prontuariosSemana: number;
  anamneseSemana: number;
  receitaSemana: number;
  taxaSucesso: number;
}

export interface EvolucaoSemanalData {
  dia: string;
  agendamentos: number;
  realizados: number;
  receita: number;
  prontuarios: number;
}

// Dashboard geral
export const getDashboard = async (): Promise<DashboardData> => {
  try {
    const response = await api.get('/dashboard');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas de agendamentos
export const getEstatisticasAgendamentos = async (periodo?: { inicio: string; fim: string }): Promise<EstatisticasAgendamentos> => {
  try {
    const params = new URLSearchParams();
    if (periodo) {
      params.append('dataInicio', periodo.inicio);
      params.append('dataFim', periodo.fim);
    }
    
    const response = await api.get(`/dashboard/agendamentos?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas financeiras
export const getEstatisticasFinanceiras = async (periodo?: { inicio: string; fim: string }): Promise<EstatisticasFinanceiras> => {
  try {
    const params = new URLSearchParams();
    if (periodo) {
      params.append('dataInicio', periodo.inicio);
      params.append('dataFim', periodo.fim);
    }
    
    const response = await api.get(`/dashboard/financeiro?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas de pacientes
export const getEstatisticasPacientes = async (): Promise<EstatisticasPacientes> => {
  try {
    const response = await api.get('/dashboard/pacientes');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas de profissionais
export const getEstatisticasProfissionais = async (): Promise<EstatisticasProfissionais> => {
  try {
    const response = await api.get('/dashboard/profissionais');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas de prontuários
export const getEstatisticasProntuarios = async (periodo?: { inicio: string; fim: string }): Promise<EstatisticasProntuarios> => {
  try {
    const params = new URLSearchParams();
    if (periodo) {
      params.append('dataInicio', periodo.inicio);
      params.append('dataFim', periodo.fim);
    }
    
    const response = await api.get(`/dashboard/prontuarios?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas de anamnese
export const getEstatisticasAnamnese = async (periodo?: { inicio: string; fim: string }): Promise<EstatisticasAnamnese> => {
  try {
    const params = new URLSearchParams();
    if (periodo) {
      params.append('dataInicio', periodo.inicio);
      params.append('dataFim', periodo.fim);
    }
    
    const response = await api.get(`/dashboard/anamnese?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas de atividades
export const getEstatisticasAtividades = async (): Promise<EstatisticasAtividades> => {
  try {
    const response = await api.get('/dashboard/atividades');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Evolução semanal
export const getEvolucaoSemanal = async (): Promise<EvolucaoSemanalData[]> => {
  try {
    const response = await api.get('/dashboard/evolucao-semanal');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
}; 
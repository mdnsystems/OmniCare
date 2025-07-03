import { api, extractData, handleApiError } from './api';

export interface RelatorioData {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  dataCriacao: string;
  status: 'PENDENTE' | 'PROCESSANDO' | 'CONCLUIDO' | 'ERRO';
  formato: 'PDF' | 'EXCEL' | 'CSV';
  tamanho?: number;
  url?: string;
}

export interface RelatorioFiltros {
  dataInicio?: string;
  dataFim?: string;
  tipo?: string;
  status?: string;
  profissionalId?: string;
  pacienteId?: string;
}

export interface RelatorioAgendado {
  id: string;
  nome: string;
  tipo: string;
  frequencia: 'DIARIO' | 'SEMANAL' | 'MENSAL';
  proximaExecucao: string;
  ativo: boolean;
  emailDestinatario?: string;
}

export interface TemplateRelatorio {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  configuracao: any;
  ativo: boolean;
}

// Relatórios gerais
export const getRelatorios = async (filtros?: RelatorioFiltros): Promise<RelatorioData[]> => {
  try {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const response = await api.get(`/relatorios?${params.toString()}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRelatorioById = async (id: string): Promise<RelatorioData> => {
  try {
    const response = await api.get(`/relatorios/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const gerarRelatorio = async (tipo: string, filtros: RelatorioFiltros): Promise<RelatorioData> => {
  try {
    const response = await api.post('/relatorios/gerar', { tipo, filtros });
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const downloadRelatorio = async (id: string, formato: string): Promise<Blob> => {
  try {
    const response = await api.get(`/relatorios/${id}/download`, {
      params: { formato },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deletarRelatorio = async (id: string): Promise<void> => {
  try {
    await api.delete(`/relatorios/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Relatórios específicos
export const getRelatorioAgendamentos = async (filtros: RelatorioFiltros): Promise<RelatorioData> => {
  try {
    const response = await api.post('/relatorios/consultas', filtros);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRelatorioFinanceiro = async (filtros: RelatorioFiltros): Promise<RelatorioData> => {
  try {
    const response = await api.post('/relatorios/faturamento', filtros);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRelatorioPacientes = async (filtros: RelatorioFiltros): Promise<RelatorioData> => {
  try {
    const response = await api.post('/relatorios/pacientes', filtros);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRelatorioProfissionais = async (filtros: RelatorioFiltros): Promise<RelatorioData> => {
  try {
    const response = await api.post('/relatorios/profissionais', filtros);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRelatorioProntuarios = async (filtros: RelatorioFiltros): Promise<RelatorioData> => {
  try {
    const response = await api.post('/relatorios/prontuarios', filtros);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRelatorioAnamnese = async (filtros: RelatorioFiltros): Promise<RelatorioData> => {
  try {
    const response = await api.post('/relatorios/anamnese', filtros);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRelatorioAtividades = async (filtros: RelatorioFiltros): Promise<RelatorioData> => {
  try {
    const response = await api.post('/relatorios/atividades', filtros);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Templates de relatório
export const getTemplatesRelatorio = async (): Promise<TemplateRelatorio[]> => {
  try {
    const response = await api.get('/relatorios/templates');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getTemplateById = async (id: string): Promise<TemplateRelatorio> => {
  try {
    const response = await api.get(`/relatorios/templates/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const criarTemplate = async (template: Omit<TemplateRelatorio, 'id'>): Promise<TemplateRelatorio> => {
  try {
    const response = await api.post('/relatorios/templates', template);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const atualizarTemplate = async (id: string, template: Partial<TemplateRelatorio>): Promise<TemplateRelatorio> => {
  try {
    const response = await api.put(`/relatorios/templates/${id}`, template);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deletarTemplate = async (id: string): Promise<void> => {
  try {
    await api.delete(`/relatorios/templates/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Relatórios agendados
export const getRelatoriosAgendados = async (): Promise<RelatorioAgendado[]> => {
  try {
    const response = await api.get('/relatorios/agendados');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const agendarRelatorio = async (relatorio: Omit<RelatorioAgendado, 'id'>): Promise<RelatorioAgendado> => {
  try {
    const response = await api.post('/relatorios/agendados', relatorio);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const atualizarRelatorioAgendado = async (id: string, relatorio: Partial<RelatorioAgendado>): Promise<RelatorioAgendado> => {
  try {
    const response = await api.put(`/relatorios/agendados/${id}`, relatorio);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deletarRelatorioAgendado = async (id: string): Promise<void> => {
  try {
    await api.delete(`/relatorios/agendados/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const ativarRelatorioAgendado = async (id: string): Promise<void> => {
  try {
    await api.patch(`/relatorios/agendados/${id}/ativar`);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const desativarRelatorioAgendado = async (id: string): Promise<void> => {
  try {
    await api.patch(`/relatorios/agendados/${id}/desativar`);
  } catch (error) {
    throw handleApiError(error);
  }
}; 
// =============================================================================
// SERVIÇO - SUPER ADMIN
// =============================================================================
// 
// Serviço para operações do SUPER_ADMIN no frontend
// Foco em gestão de clínicas e relatórios macro
//
// =============================================================================

import { api } from './api';

// =============================================================================
// TIPOS
// =============================================================================

export interface ClinicaSuperAdmin {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  ativo: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  plano?: string;
  dataExpiracao?: string;
  _count: {
    usuarios: number;
    profissionais: number;
    pacientes: number;
    agendamentos: number;
  };
}

export interface DetalhesClinica extends ClinicaSuperAdmin {
  endereco?: string;
  configuracoes?: any;
  _count: {
    usuarios: number;
    profissionais: number;
    pacientes: number;
    agendamentos: number;
    prontuarios: number;
    faturas: number;
  };
}

export interface RelatorioUsuarios {
  usuariosPorClinica: Record<string, {
    clinica: {
      id: string;
      nome: string;
      tenantId: string;
    };
    total: number;
    ativos: number;
    inativos: number;
    porRole: {
      ADMIN: number;
      PROFISSIONAL: number;
      RECEPCIONISTA: number;
      SUPER_ADMIN: number;
    };
  }>;
  totalUsuarios: number;
  totalAtivos: number;
  totalInativos: number;
}

export interface RelatorioAtividades {
  acessos: Array<{
    id: string;
    email: string;
    lastLoginAt: string;
    clinica: {
      nome: string;
      tenantId: string;
    };
  }>;
  atividadesPorClinica: Array<{
    id: string;
    nome: string;
    tenantId: string;
    ativo: boolean;
    createdAt: string;
    updatedAt: string;
    _count: {
      agendamentos: number;
      prontuarios: number;
      mensagens: number;
    };
  }>;
  periodo: {
    inicio: string;
    fim: string;
  };
}

export interface RelatorioGestaoClinicas {
  clinicas: Array<{
    id: string;
    nome: string;
    cnpj: string;
    email: string;
    ativo: boolean;
    createdAt: string;
    updatedAt: string;
    plano?: string;
    dataExpiracao?: string;
    _count: {
      usuarios: number;
      pacientes: number;
      agendamentos: number;
      faturas: number;
    };
  }>;
  estatisticas: {
    total: number;
    ativas: number;
    inativas: number;
    comPlanoAtivo: number;
    comPlanoExpirado: number;
  };
}

export interface RelatorioChat {
  mensagensPorClinica: Array<{
    id: string;
    nome: string;
    tenantId: string;
    _count: {
      mensagens: number;
    };
  }>;
  totalMensagens: number;
  periodo: {
    inicio: string;
    fim: string;
  };
}

export interface AtualizarClinicaData {
  nome?: string;
  email?: string;
  telefone?: string;
  plano?: string;
  dataExpiracao?: string;
}

// =============================================================================
// FUNÇÕES DE API
// =============================================================================

/**
 * Lista todas as clínicas cadastradas
 */
export const listarClinicas = async (): Promise<ClinicaSuperAdmin[]> => {
  const response = await api.get('/super-admin/clinicas');
  return response.data.data;
};

/**
 * Obtém detalhes de uma clínica específica
 */
export const obterDetalhesClinica = async (id: string): Promise<DetalhesClinica> => {
  const response = await api.get(`/super-admin/clinicas/${id}`);
  return response.data.data;
};

/**
 * Ativa/desativa uma clínica
 */
export const toggleStatusClinica = async (id: string): Promise<ClinicaSuperAdmin> => {
  const response = await api.patch(`/super-admin/clinicas/${id}/toggle-status`);
  return response.data.data;
};

/**
 * Atualiza dados básicos de uma clínica
 */
export const atualizarClinica = async (id: string, data: AtualizarClinicaData): Promise<ClinicaSuperAdmin> => {
  const response = await api.put(`/super-admin/clinicas/${id}`, data);
  return response.data.data;
};

/**
 * Relatório de gestão de usuários e permissões
 */
export const relatorioUsuarios = async (clinicaId?: string): Promise<RelatorioUsuarios> => {
  const params = clinicaId ? { clinicaId } : {};
  const response = await api.get('/super-admin/relatorios/usuarios', { params });
  return response.data.data;
};

/**
 * Relatório de monitoramento de atividades
 */
export const relatorioAtividades = async (clinicaId?: string, periodo?: 'semana' | 'mes'): Promise<RelatorioAtividades> => {
  const params: any = {};
  if (clinicaId) params.clinicaId = clinicaId;
  if (periodo) params.periodo = periodo;
  
  const response = await api.get('/super-admin/relatorios/atividades', { params });
  return response.data.data;
};

/**
 * Relatório de gestão de clínicas
 */
export const relatorioGestaoClinicas = async (): Promise<RelatorioGestaoClinicas> => {
  const response = await api.get('/super-admin/relatorios/gestao-clinicas');
  return response.data.data;
};

/**
 * Relatório de chat e comunicação
 */
export const relatorioChat = async (clinicaId?: string, periodo?: 'semana' | 'mes'): Promise<RelatorioChat> => {
  const params: any = {};
  if (clinicaId) params.clinicaId = clinicaId;
  if (periodo) params.periodo = periodo;
  
  const response = await api.get('/super-admin/relatorios/chat', { params });
  return response.data.data;
}; 
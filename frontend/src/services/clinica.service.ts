import { api, extractData, handleApiError } from './api';
import { Clinica, ConfiguracaoClinica, TipoClinica } from '@/types/api';

export interface CreateClinicaRequest {
  nome: string;
  tipo: TipoClinica;
  logo?: string;
  corPrimaria: string;
  corSecundaria: string;
  tema: 'light' | 'dark' | 'auto';
}

export interface UpdateClinicaRequest {
  nome?: string;
  tipo?: TipoClinica;
  logo?: string;
  corPrimaria?: string;
  corSecundaria?: string;
  tema?: 'light' | 'dark' | 'auto';
  ativo?: boolean;
}

// Clínicas - Endpoints que existem no backend
export const getClinicas = async (): Promise<Clinica[]> => {
  try {
    const response = await api.get('/clinicas');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getClinica = async (id: string): Promise<Clinica> => {
  try {
    const response = await api.get(`/clinicas/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createClinica = async (data: CreateClinicaRequest): Promise<Clinica> => {
  try {
    const response = await api.post('/clinicas', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateClinica = async (id: string, data: UpdateClinicaRequest): Promise<Clinica> => {
  try {
    const response = await api.put(`/clinicas/${id}`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteClinica = async (id: string): Promise<void> => {
  try {
    await api.delete(`/clinicas/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Buscar clínica por tenant ID (endpoint que existe no backend)
export const getClinicaByTenant = async (tenantId: string): Promise<Clinica> => {
  try {
    const response = await api.get(`/clinicas/tenant/${tenantId}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Ativar/desativar clínica (endpoint que existe no backend)
export const toggleClinicaStatus = async (id: string): Promise<Clinica> => {
  try {
    const response = await api.patch(`/clinicas/${id}/toggle-status`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Configuração WhatsApp (endpoints que existem no backend)
export const configurarWhatsApp = async (tenantId: string, config: any): Promise<any> => {
  try {
    const response = await api.post(`/clinicas/${tenantId}/whatsapp`, config);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getConfiguracaoWhatsApp = async (tenantId: string): Promise<any> => {
  try {
    const response = await api.get(`/clinicas/${tenantId}/whatsapp`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Templates de mensagem (endpoints que existem no backend)
export const criarTemplateMensagem = async (tenantId: string, template: any): Promise<any> => {
  try {
    const response = await api.post(`/clinicas/${tenantId}/templates`, template);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getTemplatesMensagem = async (tenantId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/clinicas/${tenantId}/templates`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateTemplateMensagem = async (id: string, template: any): Promise<any> => {
  try {
    const response = await api.put(`/clinicas/templates/${id}`, template);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteTemplateMensagem = async (id: string): Promise<void> => {
  try {
    await api.delete(`/clinicas/templates/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Estatísticas da clínica (endpoint que existe no backend)
export const getEstatisticasClinica = async (tenantId: string): Promise<any> => {
  try {
    const response = await api.get(`/clinicas/${tenantId}/stats`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Funções mock para funcionalidades que não existem no backend ainda
export const getConfiguracaoClinica = async (): Promise<ConfiguracaoClinica> => {
  // Mock temporário até implementar no backend
  return {
    id: 'config-1',
    tenantId: localStorage.getItem('tenantId') || '',
    nome: 'OmniCare',
    tipo: 'NUTRICIONAL',
    logo: null,
    corPrimaria: '#059669',
    corSecundaria: '#047857',
    tema: 'auto',
    ativo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const updateConfiguracaoClinica = async (data: Partial<ConfiguracaoClinica>): Promise<ConfiguracaoClinica> => {
  // Mock temporário até implementar no backend
  console.log('Atualizando configuração:', data);
  return {
    id: 'config-1',
    tenantId: localStorage.getItem('tenantId') || '',
    nome: data.nome || 'OmniCare',
    tipo: data.tipo || 'NUTRICIONAL',
    logo: data.logo || null,
    corPrimaria: data.corPrimaria || '#059669',
    corSecundaria: data.corSecundaria || '#047857',
    tema: data.tema || 'auto',
    ativo: data.ativo !== undefined ? data.ativo : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const getTenantInfo = async (): Promise<{ tenantId: string; tenantName: string }> => {
  // Mock temporário até implementar no backend
  return {
    tenantId: localStorage.getItem('tenantId') || 'default-tenant',
    tenantName: 'OmniCare'
  };
};

export const switchTenant = async (tenantId: string): Promise<{ token: string; tenantId: string; tenantName: string }> => {
  // Mock temporário até implementar no backend
  return {
    token: localStorage.getItem('token') || '',
    tenantId,
    tenantName: 'OmniCare'
  };
};

// Funções mock para templates e fluxos
export const getTemplatesEspecialidade = async (): Promise<any[]> => {
  return [];
};

export const getFluxosEspecialidade = async (): Promise<any[]> => {
  return [];
};

// Funções mock para campos personalizados
export const getCamposPersonalizados = async (): Promise<any[]> => {
  return [];
};

export const createCampoPersonalizado = async (data: any): Promise<any> => {
  return data;
};

export const updateCampoPersonalizado = async (id: string, data: any): Promise<any> => {
  return { id, ...data };
};

export const deleteCampoPersonalizado = async (id: string): Promise<void> => {
  console.log('Deletando campo personalizado:', id);
}; 
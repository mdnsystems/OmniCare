import { api, extractData, handleApiError } from './api';
import { Usuario, RoleUsuario } from '@/types/api';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  usuario: Usuario;
  tenantId: string;
  tenantName: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface ChangePasswordRequest {
  senhaAtual: string;
  novaSenha: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  novaSenha: string;
}

// Autenticação
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Não lançar erro no logout, apenas limpar localStorage
    console.warn('Erro no logout:', error);
  }
};

export const refreshToken = async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  try {
    const response = await api.post('/auth/refresh-token', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  try {
    await api.put('/auth/change-password', data);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<void> => {
  try {
    await api.post('/auth/forgot-password', data);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  try {
    await api.post('/auth/reset-password', data);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Usuários
export const getUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await api.get('/usuarios/ativos');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUsuario = async (id: string): Promise<Usuario> => {
  try {
    const response = await api.get(`/usuarios/${id}`);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createUsuario = async (data: Omit<Usuario, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<Usuario> => {
  try {
    const response = await api.post('/usuarios/registrar', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateUsuario = async (id: string, data: Partial<Usuario>): Promise<Usuario> => {
  try {
    const response = await api.put(`/usuarios/${id}/atualizar`, data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteUsuario = async (id: string): Promise<void> => {
  try {
    await api.delete(`/usuarios/${id}/desativar`);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPerfil = async (): Promise<Usuario> => {
  try {
    const response = await api.get('/auth/profile');
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updatePerfil = async (data: Partial<Usuario>): Promise<Usuario> => {
  try {
    const response = await api.put('/auth/profile', data);
    return extractData(response);
  } catch (error) {
    throw handleApiError(error);
  }
}; 
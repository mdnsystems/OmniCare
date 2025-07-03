import { api } from '@/lib/axios';

// Re-exportar a instância da API para uso em outros serviços
export { api };

// Tipos de resposta padrão da API OmniCare v3.0
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextPage?: number;
    prevPage?: number;
  };
  meta?: {
    filters: Record<string, any>;
    sort: {
      field: string;
      order: 'asc' | 'desc';
    };
  };
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
  code?: string;
  details?: any;
}

// Função helper para tratar erros da API com mensagens amigáveis
export const handleApiError = (error: any): never => {
  let errorMessage = 'Erro interno do servidor';
  const apiError: ApiError = { message: errorMessage };

  if (error.response?.data) {
    const responseData = error.response.data;
    
    // Se tem mensagem específica da API
    if (responseData.message) {
      errorMessage = responseData.message;
    }
    
    // Se tem erros de validação
    if (responseData.errors && typeof responseData.errors === 'object') {
      const validationErrors = Object.values(responseData.errors).flat();
      errorMessage = validationErrors.join(', ');
    }
    
    // Se tem código de erro específico
    if (responseData.code) {
      apiError.code = responseData.code;
    }
    
    apiError.status = error.response.status;
    apiError.errors = responseData.errors;
    apiError.details = responseData.details;
  } else if (error.message) {
    errorMessage = error.message;
  }

  // Mapeamento de códigos de erro para mensagens amigáveis
  const errorMessages: Record<string, string> = {
    'UNAUTHORIZED': 'Sessão expirada. Faça login novamente.',
    'FORBIDDEN': 'Você não tem permissão para realizar esta ação.',
    'NOT_FOUND': 'Recurso não encontrado.',
    'VALIDATION_ERROR': 'Dados inválidos. Verifique as informações.',
    'DUPLICATE_ENTRY': 'Este registro já existe.',
    'NETWORK_ERROR': 'Erro de conexão. Verifique sua internet.',
    'TIMEOUT': 'Tempo limite excedido. Tente novamente.',
    'SERVER_ERROR': 'Erro interno do servidor. Tente novamente mais tarde.',
    'TENANT_NOT_FOUND': 'Clínica não encontrada.',
    'TENANT_INACTIVE': 'Clínica inativa.',
    'USER_INACTIVE': 'Usuário inativo.',
    'INVALID_TOKEN': 'Token inválido.',
    'TOKEN_EXPIRED': 'Token expirado.',
    'RATE_LIMIT_EXCEEDED': 'Muitas requisições. Tente novamente em alguns minutos.',
    'MAINTENANCE_MODE': 'Sistema em manutenção. Tente novamente mais tarde.',
  };

  if (apiError.code && errorMessages[apiError.code]) {
    errorMessage = errorMessages[apiError.code];
  }

  apiError.message = errorMessage;
  throw new Error(errorMessage);
};

// Função helper para extrair dados da resposta
export const extractData = <T>(response: { data: ApiResponse<T> }): T => {
  if (!response.data.success) {
    throw new Error(response.data.message || 'Erro na resposta da API');
  }
  // Garantir que os dados não sejam undefined
  return response.data.data ?? (Array.isArray(response.data.data) ? [] : null);
};

// Função helper para extrair dados paginados
export const extractPaginatedData = <T>(response: { data: ApiResponse<PaginatedResponse<T>> }): PaginatedResponse<T> => {
  if (!response.data.success) {
    throw new Error(response.data.message || 'Erro na resposta da API');
  }
  return response.data.data;
};

// Função helper para criar query keys consistentes
export const createQueryKey = (base: string, params?: Record<string, any>): string[] => {
  const key = [base];
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        key.push(k, String(v));
      }
    });
  }
  return key;
};

// Função helper para criar filtros de busca
export const createSearchParams = (params: Record<string, any>): URLSearchParams => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams;
};

// Função helper para formatar datas para a API
export const formatDateForAPI = (date: Date | string): string => {
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString();
};

// Função helper para validar se a resposta é válida
export const isValidResponse = (response: any): response is ApiResponse => {
  return response && typeof response === 'object' && 'success' in response;
};

// Função helper para retry de requisições
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      // Se não é erro de rede, não tentar novamente
      if (error.response?.status && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      // Aguardar antes da próxima tentativa
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError!;
};

// Função helper para criar headers de upload
export const createUploadHeaders = (): Record<string, string> => ({
  'Content-Type': 'multipart/form-data',
});

// Função helper para criar headers de download
export const createDownloadHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/octet-stream',
});

// Função helper para validar campos obrigatórios
export const validateRequiredFields = (data: Record<string, any>, requiredFields: string[]): void => {
  const missingFields = requiredFields.filter(field => !data[field] || data[field] === '');
  if (missingFields.length > 0) {
    throw new Error(`Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`);
  }
};

// Função helper para sanitizar dados antes de enviar para a API
export const sanitizeData = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      } else {
        sanitized[key] = value;
      }
    }
  });
  
  return sanitized;
};

// Função helper para criar filtros de data
export const createDateFilters = (startDate?: string, endDate?: string): Record<string, string> => {
  const filters: Record<string, string> = {};
  
  if (startDate) {
    filters.dataInicio = startDate;
  }
  
  if (endDate) {
    filters.dataFim = endDate;
  }
  
  return filters;
};

// Função helper para criar filtros de paginação
export const createPaginationFilters = (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder: 'asc' | 'desc' = 'desc'
): Record<string, any> => {
  const filters: Record<string, any> = {
    page,
    limit
  };
  
  if (sortBy) {
    filters.sortBy = sortBy;
    filters.sortOrder = sortOrder;
  }
  
  return filters;
};

// Função helper para processar resposta de upload
export const processUploadResponse = (response: any): { success: boolean; message: string; data?: any } => {
  if (response.data?.success) {
    return {
      success: true,
      message: response.data.message || 'Upload realizado com sucesso',
      data: response.data.data
    };
  }
  
  return {
    success: false,
    message: response.data?.message || 'Erro no upload'
  };
};

// Função helper para processar resposta de download
export const processDownloadResponse = (response: any, filename?: string): Blob => {
  const blob = new Blob([response.data], {
    type: response.headers['content-type'] || 'application/octet-stream'
  });
  
  if (filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
  
  return blob;
};

// Função helper para verificar se a API está online
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    return false;
  }
};

// Função helper para obter informações da API
export const getApiInfo = async (): Promise<{ version: string; status: string }> => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}; 
import { api, handleApiError } from './api';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    database: 'healthy' | 'unhealthy';
    redis?: 'healthy' | 'unhealthy';
    websocket?: 'healthy' | 'unhealthy';
  };
  checks: {
    database: boolean;
    redis?: boolean;
    websocket?: boolean;
  };
}

export interface ApiInfo {
  name: string;
  version: string;
  description: string;
  environment: string;
  timestamp: string;
  endpoints: {
    auth: string[];
    clinicas: string[];
    profissionais: string[];
    pacientes: string[];
    agendamentos: string[];
    prontuarios: string[];
    anamnese: string[];
    exames: string[];
    chat: string[];
    mensagens: string[];
    messageTemplates: string[];
    faturamento: string[];
    pagamentos: string[];
    relatorios: string[];
    dashboard: string[];
    usuarios: string[];
  };
}

// Verificar saúde da API
export const checkHealth = async (): Promise<HealthStatus> => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Obter informações da API
export const getApiInfo = async (): Promise<ApiInfo> => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Verificar se a API está online
export const isApiOnline = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    return false;
  }
};

// Verificar conectividade com timeout
export const checkConnectivity = async (timeout: number = 5000): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    await api.get('/health', { signal: controller.signal });
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    return false;
  }
};

// Verificar status dos serviços
export const checkServicesStatus = async (): Promise<{
  api: boolean;
  database: boolean;
  websocket?: boolean;
}> => {
  try {
    const health = await checkHealth();
    
    return {
      api: health.status === 'healthy',
      database: health.checks.database,
      websocket: health.checks.websocket
    };
  } catch (error) {
    return {
      api: false,
      database: false,
      websocket: false
    };
  }
};

// Ping da API
export const pingApi = async (): Promise<{ success: boolean; latency: number }> => {
  const startTime = Date.now();
  
  try {
    await api.get('/health');
    const latency = Date.now() - startTime;
    
    return {
      success: true,
      latency
    };
  } catch (error) {
    const latency = Date.now() - startTime;
    
    return {
      success: false,
      latency
    };
  }
}; 
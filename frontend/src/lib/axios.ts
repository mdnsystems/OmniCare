import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000, // 10 segundos de timeout
  withCredentials: true, // Importante para enviar cookies
});

// Função helper para extrair dados da resposta
export const extractData = <T>(response: { data: any }): T => {
  if (!response.data.success) {
    throw new Error(response.data.message || 'Erro na resposta da API');
  }
  return response.data.data;
};

// Flag para evitar múltiplas tentativas de refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// Cache para controlar retries de rate limiting
const rateLimitRetries = new Map<string, { count: number; lastRetry: number }>();

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Função para calcular delay exponencial para retry
const calculateRetryDelay = (retryCount: number): number => {
  const baseDelay = 1000; // 1 segundo
  const maxDelay = 30000; // 30 segundos
  const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
  return delay + Math.random() * 1000; // Adiciona jitter
};

// Função para verificar se deve fazer retry
const shouldRetry = (config: any, retryCount: number): boolean => {
  const maxRetries = 3;
  const retryableMethods = ['GET', 'POST', 'PUT', 'PATCH'];
  const retryableStatuses = [429, 500, 502, 503, 504];
  
  return (
    retryCount < maxRetries &&
    retryableMethods.includes(config.method?.toUpperCase()) &&
    retryableStatuses.includes(config.response?.status)
  );
};

api.interceptors.request.use((config) => {
  const tenantId = localStorage.getItem('tenantId');
  
  if (tenantId) {
    config.headers['x-tenant-id'] = tenantId;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Se for erro de rede (sem resposta), simular erro 503
    if (!error.response) {
      error.response = {
        status: 503,
        data: { message: 'Serviço indisponível' }
      };
      return Promise.reject(error);
    }
    
    // Tratamento específico para erro 429 (Rate Limiting)
    if (error.response.status === 429) {
      const requestKey = `${originalRequest.method}-${originalRequest.url}`;
      const retryInfo = rateLimitRetries.get(requestKey) || { count: 0, lastRetry: 0 };
      const now = Date.now();
      
      // Verificar se já tentou muitas vezes recentemente
      if (retryInfo.count >= 3 && (now - retryInfo.lastRetry) < 60000) {
        return Promise.reject(error);
      }
      
      // Incrementar contador de retries
      retryInfo.count++;
      retryInfo.lastRetry = now;
      rateLimitRetries.set(requestKey, retryInfo);
      
      // Calcular delay para retry
      const delay = calculateRetryDelay(retryInfo.count);
      
      // Aguardar e tentar novamente
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Fazer retry da requisição
      return api(originalRequest);
    }
    
    // Se o erro for 401 (token expirado) e não for uma tentativa de refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      // Não tentar refresh se for uma requisição de login
      if (originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        // Se já está tentando renovar, adicionar à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        console.log('🔄 [Axios] Tentando renovar token...');
        
        // Tentar renovar o token (os cookies serão enviados automaticamente)
        await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/refresh-token`,
          {},
          { 
            timeout: 5000,
            withCredentials: true
          }
        );
        
        console.log('🔄 [Axios] Token renovado com sucesso');
        
        // Processar fila de requisições pendentes
        processQueue(null, null);
        
        // Retry da requisição original
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error('🔄 [Axios] Erro ao renovar token:', refreshError);
        
        // Se o refresh falhou, limpar dados locais e redirecionar para login
        localStorage.clear();
        
        // Só redirecionar se não estiver já na página de login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
        
      } finally {
        isRefreshing = false;
      }
    }
    
    // Tratamento para outros erros de servidor (5xx)
    if (error.response.status >= 500 && error.response.status < 600) {
      const requestKey = `${originalRequest.method}-${originalRequest.url}`;
      const retryInfo = rateLimitRetries.get(requestKey) || { count: 0, lastRetry: 0 };
      
      if (shouldRetry(originalRequest, retryInfo.count)) {
        retryInfo.count++;
        retryInfo.lastRetry = Date.now();
        rateLimitRetries.set(requestKey, retryInfo);
        
        const delay = calculateRetryDelay(retryInfo.count);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return api(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
); 
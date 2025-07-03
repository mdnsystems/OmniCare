import { useState, useCallback } from 'react';
import { api, extractData } from '../lib/axios';

interface UseApiWithRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
}

export function useApiWithRetry<T = any>(options: UseApiWithRetryOptions = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError,
    onSuccess
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0
  });

  const executeRequest = useCallback(async (
    requestFn: () => Promise<any>,
    retryCount = 0
  ): Promise<T> => {
    try {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null
      }));

      const response = await requestFn();
      const data = extractData<T>(response);

      setState(prev => ({
        ...prev,
        data,
        loading: false,
        retryCount: 0
      }));

      onSuccess?.(data);
      return data;

    } catch (error: any) {
      const isRateLimitError = error.response?.status === 429;
      const isServerError = error.response?.status >= 500 && error.response?.status < 600;
      const canRetry = retryCount < maxRetries && (isRateLimitError || isServerError);

      if (canRetry) {
        const delay = retryDelay * Math.pow(2, retryCount); // Exponential backoff
        console.log(`🔄 [useApiWithRetry] Tentativa ${retryCount + 1}/${maxRetries + 1}, aguardando ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        setState(prev => ({
          ...prev,
          retryCount: retryCount + 1
        }));

        return executeRequest(requestFn, retryCount + 1);
      }

      const errorMessage = error.response?.data?.error || error.message || 'Erro desconhecido';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        retryCount: 0
      }));

      onError?.(error);
      throw error;
    }
  }, [maxRetries, retryDelay, onError, onSuccess]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      retryCount: 0
    });
  }, []);

  return {
    ...state,
    executeRequest,
    reset
  };
}

// Hook específico para GET requests
export function useGetWithRetry<T = any>(url: string, options?: UseApiWithRetryOptions) {
  const apiState = useApiWithRetry<T>(options);

  const fetchData = useCallback(async (params?: any) => {
    return apiState.executeRequest(() => api.get(url, { params }));
  }, [url, apiState]);

  return {
    ...apiState,
    fetchData
  };
}

// Hook específico para POST requests
export function usePostWithRetry<T = any>(url: string, options?: UseApiWithRetryOptions) {
  const apiState = useApiWithRetry<T>(options);

  const postData = useCallback(async (data?: any) => {
    return apiState.executeRequest(() => api.post(url, data));
  }, [url, apiState]);

  return {
    ...apiState,
    postData
  };
}

// Hook específico para PUT requests
export function usePutWithRetry<T = any>(url: string, options?: UseApiWithRetryOptions) {
  const apiState = useApiWithRetry<T>(options);

  const putData = useCallback(async (data?: any) => {
    return apiState.executeRequest(() => api.put(url, data));
  }, [url, apiState]);

  return {
    ...apiState,
    putData
  };
}

// Hook específico para DELETE requests
export function useDeleteWithRetry<T = any>(url: string, options?: UseApiWithRetryOptions) {
  const apiState = useApiWithRetry<T>(options);

  const deleteData = useCallback(async () => {
    return apiState.executeRequest(() => api.delete(url));
  }, [url, apiState]);

  return {
    ...apiState,
    deleteData
  };
} 
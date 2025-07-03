import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import * as healthService from '@/services/health.service';

// Hook para verificar saúde da API
export const useApiHealth = () => {
  return useQuery({
    queryKey: ['api-health'],
    queryFn: healthService.checkHealth,
    refetchInterval: 30000, // Verificar a cada 30 segundos
    retry: 3,
    retryDelay: 1000,
    staleTime: 10000, // 10 segundos
  });
};

// Hook para verificar se a API está online
export const useApiOnline = () => {
  return useQuery({
    queryKey: ['api-online'],
    queryFn: healthService.isApiOnline,
    refetchInterval: 10000, // Verificar a cada 10 segundos
    retry: 2,
    retryDelay: 2000,
    staleTime: 5000, // 5 segundos
  });
};

// Hook para obter informações da API
export const useApiInfo = () => {
  return useQuery({
    queryKey: ['api-info'],
    queryFn: healthService.getApiInfo,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });
};

// Hook para verificar conectividade com timeout
export const useApiConnectivity = (timeout: number = 5000) => {
  return useQuery({
    queryKey: ['api-connectivity', timeout],
    queryFn: () => healthService.checkConnectivity(timeout),
    refetchInterval: 15000, // Verificar a cada 15 segundos
    retry: 2,
    retryDelay: 3000,
    staleTime: 10000, // 10 segundos
  });
};

// Hook para verificar status dos serviços
export const useServicesStatus = () => {
  return useQuery({
    queryKey: ['services-status'],
    queryFn: healthService.checkServicesStatus,
    refetchInterval: 20000, // Verificar a cada 20 segundos
    retry: 2,
    retryDelay: 2000,
    staleTime: 15000, // 15 segundos
  });
};

// Hook para ping da API
export const useApiPing = () => {
  return useQuery({
    queryKey: ['api-ping'],
    queryFn: healthService.pingApi,
    refetchInterval: 25000, // Verificar a cada 25 segundos
    retry: 1,
    retryDelay: 1000,
    staleTime: 20000, // 20 segundos
  });
};

// Hook para monitorar conectividade e mostrar notificações
export const useApiMonitor = () => {
  const queryClient = useQueryClient();
  const wasOnline = useRef<boolean | null>(null);
  
  const { data: isOnline, isLoading } = useApiOnline();
  
  useEffect(() => {
    if (isLoading) return;
    
    // Se é a primeira verificação, apenas armazenar o status
    if (wasOnline.current === null) {
      wasOnline.current = isOnline;
      return;
    }
    
    // Se o status mudou
    if (wasOnline.current !== isOnline) {
      if (isOnline) {
        // API voltou online
        toast.success('Conexão com o servidor restaurada!', {
          description: 'A aplicação está funcionando normalmente.',
          duration: 5000,
        });
        
        // Invalidar todas as queries para forçar refetch
        queryClient.invalidateQueries();
      } else {
        // API ficou offline
        toast.error('Conexão com o servidor perdida!', {
          description: 'Verificando conectividade...',
          duration: 0, // Não fechar automaticamente
        });
      }
      
      wasOnline.current = isOnline;
    }
  }, [isOnline, isLoading, queryClient]);
  
  return {
    isOnline,
    isLoading,
  };
};

// Hook para verificar saúde completa da API
export const useApiHealthComplete = () => {
  const health = useApiHealth();
  const isOnline = useApiOnline();
  const services = useServicesStatus();
  const ping = useApiPing();
  
  const isLoading = health.isLoading || isOnline.isLoading || services.isLoading || ping.isLoading;
  const hasError = health.error || isOnline.error || services.error || ping.error;
  
  const isHealthy = health.data?.status === 'healthy' && 
                   isOnline.data === true && 
                   services.data?.api === true &&
                   services.data?.database === true;
  
  return {
    health: health.data,
    isOnline: isOnline.data,
    services: services.data,
    ping: ping.data,
    isLoading,
    hasError,
    isHealthy,
  };
}; 
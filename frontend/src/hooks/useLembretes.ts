import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as lembreteService from '@/services/lembrete.service';
import { Lembrete, PaginatedResponse } from '@/types/api';
import { createQueryKey } from '@/services/api';

// Tipos para filtros e parâmetros
export interface LembreteFilters {
  pacienteNome?: string;
  profissionalId?: string;
  tipo?: string;
  status?: string;
  prioridade?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface LembreteParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: LembreteFilters;
}

// Hook para listar lembretes com paginação
export const useLembretes = (params: LembreteParams = {}) => {
  const { page = 1, limit = 10, sortBy, sortOrder, filters } = params;
  
  return useQuery({
    queryKey: createQueryKey('lembretes', { page, limit, sortBy, sortOrder, ...filters }),
    queryFn: () => lembreteService.getLembretes({ page, limit, sortBy, sortOrder, filters }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para buscar lembretes por termo (autocomplete)
export const useLembretesSearch = (searchTerm: string, limit: number = 10) => {
  return useQuery({
    queryKey: createQueryKey('lembretes', 'search', { searchTerm, limit }),
    queryFn: () => lembreteService.searchLembretes(searchTerm, limit),
    enabled: searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obter um lembrete específico
export const useLembrete = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('lembrete', { id }),
    queryFn: () => lembreteService.getLembrete(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter lembretes por paciente
export const useLembretesPorPaciente = (pacienteId: string) => {
  return useQuery({
    queryKey: createQueryKey('lembretes', 'paciente', { pacienteId }),
    queryFn: () => lembreteService.getLembretesByPaciente(pacienteId),
    enabled: !!pacienteId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter lembretes por profissional
export const useLembretesPorProfissional = (profissionalId: string) => {
  return useQuery({
    queryKey: createQueryKey('lembretes', 'profissional', { profissionalId }),
    queryFn: () => lembreteService.getLembretesByProfissional(profissionalId),
    enabled: !!profissionalId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter lembretes por tipo
export const useLembretesPorTipo = (tipo: string) => {
  return useQuery({
    queryKey: createQueryKey('lembretes', 'tipo', { tipo }),
    queryFn: () => lembreteService.getLembretesByTipo(tipo),
    enabled: !!tipo,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter lembretes por status
export const useLembretesPorStatus = (status: string) => {
  return useQuery({
    queryKey: createQueryKey('lembretes', 'status', { status }),
    queryFn: () => lembreteService.getLembretesByStatus(status),
    enabled: !!status,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter lembretes por período
export const useLembretesPorPeriodo = (dataInicio: string, dataFim: string) => {
  return useQuery({
    queryKey: createQueryKey('lembretes', 'periodo', { dataInicio, dataFim }),
    queryFn: () => lembreteService.getLembretesByPeriodo(dataInicio, dataFim),
    enabled: !!dataInicio && !!dataFim,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter estatísticas de lembretes
export const useLembretesStats = (periodoInicio?: string, periodoFim?: string) => {
  return useQuery({
    queryKey: createQueryKey('lembretes', 'stats', { periodoInicio, periodoFim }),
    queryFn: () => lembreteService.getLembretesStats(periodoInicio, periodoFim),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para criar lembrete
export const useCreateLembrete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Lembrete, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => 
      lembreteService.createLembrete(data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
      queryClient.invalidateQueries({ queryKey: ['lembretes', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Adicionar à cache
      queryClient.setQueryData(
        createQueryKey('lembrete', { id: data.id }),
        data
      );
      
      toast.success('Lembrete criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar lembrete');
    }
  });
};

// Hook para atualizar lembrete
export const useUpdateLembrete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lembrete> }) => 
      lembreteService.updateLembrete(id, data),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
      queryClient.invalidateQueries({ queryKey: ['lembrete', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['lembretes', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('lembrete', { id: data.id }),
        data
      );
      
      toast.success('Lembrete atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar lembrete');
    }
  });
};

// Hook para deletar lembrete
export const useDeleteLembrete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lembreteService.deleteLembrete(id),
    onSuccess: (_, id) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
      queryClient.invalidateQueries({ queryKey: ['lembretes', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Remover da cache
      queryClient.removeQueries({ queryKey: ['lembrete', id] });
      
      toast.success('Lembrete removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover lembrete');
    }
  });
};

// Hook para marcar lembrete como concluído
export const useMarcarLembreteConcluido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lembreteService.marcarLembreteConcluido(id),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
      queryClient.invalidateQueries({ queryKey: ['lembrete', data.id] });
      queryClient.invalidateQueries({ queryKey: ['lembretes', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('lembrete', { id: data.id }),
        data
      );
      
      toast.success('Lembrete marcado como concluído!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao marcar lembrete como concluído');
    }
  });
};

// Hook para marcar lembrete como cancelado
export const useMarcarLembreteCancelado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lembreteService.marcarLembreteCancelado(id),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
      queryClient.invalidateQueries({ queryKey: ['lembrete', data.id] });
      queryClient.invalidateQueries({ queryKey: ['lembretes', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('lembrete', { id: data.id }),
        data
      );
      
      toast.success('Lembrete marcado como cancelado!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao marcar lembrete como cancelado');
    }
  });
};

// Hook para exportar lembretes
export const useExportLembretes = () => {
  return useMutation({
    mutationFn: (filters?: LembreteFilters) => lembreteService.exportLembretes(filters),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao exportar lembretes');
    }
  });
};

// Hook para importar lembretes
export const useImportLembretes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => lembreteService.importLembretes(file),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
      queryClient.invalidateQueries({ queryKey: ['lembretes', 'stats'] });
      
      toast.success(`Importação concluída: ${data.success} lembretes importados`);
      if (data.errors.length > 0) {
        toast.error(`Erros na importação: ${data.errors.join(', ')}`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao importar lembretes');
    }
  });
}; 
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as exameService from '@/services/exame.service';
import { Exame, PaginatedResponse } from '@/types/api';
import { createQueryKey } from '@/services/api';

// Tipos para filtros e parâmetros
export interface ExameFilters {
  pacienteNome?: string;
  prontuarioId?: string;
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface ExameParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: ExameFilters;
}

// Hook para listar exames com paginação
export const useExames = (params: ExameParams = {}) => {
  const { page = 1, limit = 10, sortBy, sortOrder, filters } = params;
  
  return useQuery({
    queryKey: createQueryKey('exames', { page, limit, sortBy, sortOrder, ...filters }),
    queryFn: () => exameService.getExames({ page, limit, sortBy, sortOrder, filters }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para buscar exames por termo (autocomplete)
export const useExamesSearch = (searchTerm: string, limit: number = 10) => {
  return useQuery({
    queryKey: createQueryKey('exames', 'search', { searchTerm, limit }),
    queryFn: () => exameService.searchExames(searchTerm, limit),
    enabled: searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obter um exame específico
export const useExame = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('exame', { id }),
    queryFn: () => exameService.getExame(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter exames por prontuário
export const useExamesPorProntuario = (prontuarioId: string) => {
  return useQuery({
    queryKey: createQueryKey('exames', 'prontuario', { prontuarioId }),
    queryFn: () => exameService.getExamesPorProntuario(prontuarioId),
    enabled: !!prontuarioId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter exames por tipo
export const useExamesPorTipo = (tipo: string) => {
  return useQuery({
    queryKey: createQueryKey('exames', 'tipo', { tipo }),
    queryFn: () => exameService.getExamesPorTipo(tipo),
    enabled: !!tipo,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter exames por período
export const useExamesPorPeriodo = (dataInicio: string, dataFim: string) => {
  return useQuery({
    queryKey: createQueryKey('exames', 'periodo', { dataInicio, dataFim }),
    queryFn: () => exameService.getExamesPorPeriodo(dataInicio, dataFim),
    enabled: !!dataInicio && !!dataFim,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter estatísticas de exames
export const useExamesStats = (periodoInicio?: string, periodoFim?: string) => {
  return useQuery({
    queryKey: createQueryKey('exames', 'stats', { periodoInicio, periodoFim }),
    queryFn: () => exameService.getExamesStats(periodoInicio, periodoFim),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para criar exame
export const useCreateExame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Exame, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => 
      exameService.createExame(data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['exames'] });
      queryClient.invalidateQueries({ queryKey: ['exames', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Adicionar à cache
      queryClient.setQueryData(
        createQueryKey('exame', { id: data.id }),
        data
      );
      
      toast.success('Exame criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar exame');
    }
  });
};

// Hook para atualizar exame
export const useUpdateExame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Exame> }) => 
      exameService.updateExame(id, data),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['exames'] });
      queryClient.invalidateQueries({ queryKey: ['exame', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['exames', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('exame', { id: data.id }),
        data
      );
      
      toast.success('Exame atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar exame');
    }
  });
};

// Hook para deletar exame
export const useDeleteExame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => exameService.deleteExame(id),
    onSuccess: (_, id) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['exames'] });
      queryClient.invalidateQueries({ queryKey: ['exames', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Remover da cache
      queryClient.removeQueries({ queryKey: ['exame', id] });
      
      toast.success('Exame removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover exame');
    }
  });
};

// Hook para upload de arquivo
export const useUploadArquivoExame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ exameId, arquivo }: { exameId: string; arquivo: File }) => 
      exameService.uploadArquivo(exameId, arquivo),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['exame', variables.exameId] });
      queryClient.invalidateQueries({ queryKey: ['exames'] });
      
      toast.success('Arquivo enviado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao enviar arquivo');
    }
  });
};

// Hook para download de arquivo
export const useDownloadArquivoExame = () => {
  return useMutation({
    mutationFn: ({ exameId, arquivoId }: { exameId: string; arquivoId: string }) => 
      exameService.downloadArquivo(exameId, arquivoId),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao baixar arquivo');
    }
  });
};

// Hook para exportar exames
export const useExportExames = () => {
  return useMutation({
    mutationFn: (filters?: ExameFilters) => exameService.exportExames(filters),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao exportar exames');
    }
  });
};

// Hook para importar exames
export const useImportExames = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => exameService.importExames(file),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['exames'] });
      queryClient.invalidateQueries({ queryKey: ['exames', 'stats'] });
      
      toast.success(`Importação concluída: ${data.success} exames importados`);
      if (data.errors.length > 0) {
        toast.error(`Erros na importação: ${data.errors.join(', ')}`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao importar exames');
    }
  });
}; 
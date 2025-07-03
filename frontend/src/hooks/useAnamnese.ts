import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as anamneseService from '@/services/anamnese.service';
import { Anamnese, PaginatedResponse } from '@/types/api';
import { createQueryKey } from '@/services/api';

// Tipos para filtros e parâmetros
export interface AnamneseFilters {
  pacienteId?: string;
  pacienteNome?: string;
  profissionalId?: string;
  templateId?: string;
  dataInicio?: string;
  dataFim?: string;
  ativo?: boolean;
}

export interface AnamneseParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: AnamneseFilters;
}

// Hook para listar anamneses com paginação
export const useAnamneses = (params: AnamneseParams = {}) => {
  const { page = 1, limit = 10, sortBy, sortOrder, filters } = params;
  
  return useQuery({
    queryKey: createQueryKey('anamneses', { page, limit, sortBy, sortOrder, ...filters }),
    queryFn: () => anamneseService.getAnamneses({ page, limit, sortBy, sortOrder, filters }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para buscar anamneses por termo (autocomplete)
export const useAnamnesesSearch = (searchTerm: string, limit: number = 10) => {
  return useQuery({
    queryKey: createQueryKey('anamneses', 'search', { searchTerm, limit }),
    queryFn: () => anamneseService.searchAnamneses(searchTerm, limit),
    enabled: searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obter uma anamnese específica
export const useAnamnese = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('anamnese', { id }),
    queryFn: () => anamneseService.getAnamnese(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter anamneses por paciente
export const useAnamnesesPorPaciente = (pacienteId: string) => {
  return useQuery({
    queryKey: createQueryKey('anamneses', 'paciente', { pacienteId }),
    queryFn: () => anamneseService.getAnamnesesPorPaciente(pacienteId),
    enabled: !!pacienteId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter anamneses por profissional
export const useAnamnesesPorProfissional = (profissionalId: string) => {
  return useQuery({
    queryKey: createQueryKey('anamneses', 'profissional', { profissionalId }),
    queryFn: () => anamneseService.getAnamnesesPorProfissional(profissionalId),
    enabled: !!profissionalId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter anamneses por template
export const useAnamnesesPorTemplate = (templateId: string) => {
  return useQuery({
    queryKey: createQueryKey('anamneses', 'template', { templateId }),
    queryFn: () => anamneseService.getAnamnesesPorTemplate(templateId),
    enabled: !!templateId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter anamneses por período
export const useAnamnesesPorPeriodo = (dataInicio: string, dataFim: string) => {
  return useQuery({
    queryKey: createQueryKey('anamneses', 'periodo', { dataInicio, dataFim }),
    queryFn: () => anamneseService.getAnamnesesPorPeriodo(dataInicio, dataFim),
    enabled: !!dataInicio && !!dataFim,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter estatísticas de anamneses
export const useAnamnesesStats = (periodoInicio?: string, periodoFim?: string) => {
  return useQuery({
    queryKey: createQueryKey('anamneses', 'stats', { periodoInicio, periodoFim }),
    queryFn: () => anamneseService.getAnamnesesStats(periodoInicio, periodoFim),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para criar anamnese
export const useCreateAnamnese = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Anamnese, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => 
      anamneseService.createAnamnese(data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['anamneses'] });
      queryClient.invalidateQueries({ queryKey: ['anamneses', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Adicionar à cache
      queryClient.setQueryData(
        createQueryKey('anamnese', { id: data.id }),
        data
      );
      
      toast.success('Anamnese criada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar anamnese');
    }
  });
};

// Hook para atualizar anamnese
export const useUpdateAnamnese = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Anamnese> }) => 
      anamneseService.updateAnamnese(id, data),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['anamneses'] });
      queryClient.invalidateQueries({ queryKey: ['anamnese', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['anamneses', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('anamnese', { id: data.id }),
        data
      );
      
      toast.success('Anamnese atualizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar anamnese');
    }
  });
};

// Hook para deletar anamnese
export const useDeleteAnamnese = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => anamneseService.deleteAnamnese(id),
    onSuccess: (_, id) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['anamneses'] });
      queryClient.invalidateQueries({ queryKey: ['anamneses', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Remover da cache
      queryClient.removeQueries({ queryKey: ['anamnese', id] });
      
      toast.success('Anamnese removida com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover anamnese');
    }
  });
};

// Hook para duplicar anamnese
export const useDuplicarAnamnese = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, pacienteId }: { id: string; pacienteId: string }) => 
      anamneseService.duplicarAnamnese(id, pacienteId),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['anamneses'] });
      queryClient.invalidateQueries({ queryKey: ['anamneses', 'stats'] });
      
      // Adicionar à cache
      queryClient.setQueryData(
        createQueryKey('anamnese', { id: data.id }),
        data
      );
      
      toast.success('Anamnese duplicada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao duplicar anamnese');
    }
  });
};

// Hook para importar anamneses
export const useImportAnamneses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => anamneseService.importAnamneses(file),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['anamneses'] });
      queryClient.invalidateQueries({ queryKey: ['anamneses', 'stats'] });
      
      toast.success(`${data.importados} anamneses importadas com sucesso!`);
      
      if (data.erros && data.erros.length > 0) {
        toast.warning(`${data.erros.length} registros com erro. Verifique o relatório.`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao importar anamneses');
    }
  });
};

// Hook para exportar anamneses
export const useExportAnamneses = () => {
  return useMutation({
    mutationFn: (filters?: AnamneseFilters) => anamneseService.exportAnamneses(filters),
    onSuccess: (data) => {
      // Criar download do arquivo
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anamneses_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Exportação realizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao exportar anamneses');
    }
  });
};

// Hook para obter templates de anamnese
export const useTemplatesAnamnese = () => {
  return useQuery({
    queryKey: createQueryKey('anamneses', 'templates'),
    queryFn: () => anamneseService.getTemplatesAnamnese(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para obter um template específico
export const useTemplateAnamnese = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('anamnese', 'template', { id }),
    queryFn: () => anamneseService.getTemplateAnamnese(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para criar template de anamnese
export const useCreateTemplateAnamnese = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => anamneseService.createTemplateAnamnese(data),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['anamneses', 'templates'] });
      
      toast.success('Template de anamnese criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar template de anamnese');
    }
  });
};

// Hook para atualizar template de anamnese
export const useUpdateTemplateAnamnese = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      anamneseService.updateTemplateAnamnese(id, data),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['anamneses', 'templates'] });
      queryClient.invalidateQueries({ queryKey: ['anamnese', 'template'] });
      
      toast.success('Template de anamnese atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar template de anamnese');
    }
  });
};

// Hook para deletar template de anamnese
export const useDeleteTemplateAnamnese = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => anamneseService.deleteTemplateAnamnese(id),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['anamneses', 'templates'] });
      
      toast.success('Template de anamnese removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover template de anamnese');
    }
  });
};

// Hook para validar campos da anamnese
export const useValidarCamposAnamnese = () => {
  return useMutation({
    mutationFn: ({ templateId, campos }: { templateId: string; campos: Record<string, any> }) => 
      anamneseService.validarCamposAnamnese(templateId, campos),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao validar campos da anamnese');
    }
  });
};

// Hook para calcular campos da anamnese
export const useCalcularCamposAnamnese = () => {
  return useMutation({
    mutationFn: ({ templateId, campos }: { templateId: string; campos: Record<string, any> }) => 
      anamneseService.calcularCamposAnamnese(templateId, campos),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao calcular campos da anamnese');
    }
  });
};

// Hook para obter histórico da anamnese
export const useAnamneseHistorico = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('anamnese', 'historico', { id }),
    queryFn: () => anamneseService.getAnamneseHistorico(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter relatórios da anamnese
export const useAnamneseRelatorios = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('anamnese', 'relatorios', { id }),
    queryFn: () => anamneseService.getAnamneseRelatorios(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para gerar relatório da anamnese
export const useGerarRelatorioAnamnese = () => {
  return useMutation({
    mutationFn: ({ id, tipo }: { id: string; tipo: string }) => 
      anamneseService.gerarRelatorioAnamnese(id, tipo),
    onSuccess: (data) => {
      // Criar download do arquivo
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_anamnese_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Relatório gerado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao gerar relatório');
    }
  });
}; 
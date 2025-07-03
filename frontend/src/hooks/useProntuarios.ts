import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as prontuarioService from '@/services/prontuario.service';
import { Prontuario, TipoProntuario } from '@/types/api';
import { createQueryKey } from '@/services/api';

// Tipos para filtros
export interface ProntuarioFilters {
  pacienteId?: string;
  profissionalId?: string;
  dataInicio?: string;
  dataFim?: string;
  tipo?: TipoProntuario;
  especialidadeId?: string;
  ativo?: boolean;
}

// Hook para listar prontuários
export const useProntuarios = () => {
  return useQuery({
    queryKey: createQueryKey('prontuarios'),
    queryFn: () => prontuarioService.getProntuarios(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false, // Evita refetch desnecessário
    refetchOnMount: false, // Evita refetch ao montar
    // Garantir que sempre retorne um array válido
    select: (data) => Array.isArray(data) ? data : [],
  });
};

// Hook para obter um prontuário específico
export const useProntuario = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('prontuario', { id }),
    queryFn: () => prontuarioService.getProntuario(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook para obter prontuários de hoje
export const useProntuariosHoje = () => {
  return useQuery({
    queryKey: createQueryKey('prontuarios', 'hoje'),
    queryFn: () => prontuarioService.getProntuariosHoje(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook para obter prontuários por paciente
export const useProntuariosPorPaciente = (pacienteId: string) => {
  return useQuery({
    queryKey: createQueryKey('prontuarios', 'paciente', { pacienteId }),
    queryFn: () => prontuarioService.getProntuariosByPaciente(pacienteId),
    enabled: !!pacienteId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook para obter prontuários por profissional
export const useProntuariosPorProfissional = (profissionalId: string) => {
  return useQuery({
    queryKey: createQueryKey('prontuarios', 'profissional', { profissionalId }),
    queryFn: () => prontuarioService.getProntuariosByProfissional(profissionalId),
    enabled: !!profissionalId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook para obter prontuários por período
export const useProntuariosPorPeriodo = (dataInicio: string, dataFim: string) => {
  return useQuery({
    queryKey: createQueryKey('prontuarios', 'periodo', { dataInicio, dataFim }),
    queryFn: () => prontuarioService.getProntuariosByPeriodo(dataInicio, dataFim),
    enabled: !!dataInicio && !!dataFim,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook para obter estatísticas de prontuários
export const useProntuariosStats = (periodoInicio?: string, periodoFim?: string) => {
  return useQuery({
    queryKey: createQueryKey('prontuarios', 'stats', { periodoInicio, periodoFim }),
    queryFn: () => prontuarioService.getEstatisticasProntuarios({ inicio: periodoInicio, fim: periodoFim }),
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook para criar prontuário
export const useCreateProntuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Prontuario, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => 
      prontuarioService.createProntuario(data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] });
      queryClient.invalidateQueries({ queryKey: ['prontuarios', 'hoje'] });
      queryClient.invalidateQueries({ queryKey: ['prontuarios', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Adicionar à cache
      queryClient.setQueryData(
        createQueryKey('prontuario', { id: data.id }),
        data
      );
      
      toast.success('Prontuário criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar prontuário');
    }
  });
};

// Hook para atualizar prontuário
export const useUpdateProntuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Prontuario> }) => 
      prontuarioService.updateProntuario(id, data),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] });
      queryClient.invalidateQueries({ queryKey: ['prontuario', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['prontuarios', 'hoje'] });
      queryClient.invalidateQueries({ queryKey: ['prontuarios', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('prontuario', { id: data.id }),
        data
      );
      
      toast.success('Prontuário atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar prontuário');
    }
  });
};

// Hook para deletar prontuário
export const useDeleteProntuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => prontuarioService.deleteProntuario(id),
    onSuccess: (_, id) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] });
      queryClient.invalidateQueries({ queryKey: ['prontuarios', 'hoje'] });
      queryClient.invalidateQueries({ queryKey: ['prontuarios', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Remover da cache
      queryClient.removeQueries({ queryKey: ['prontuario', id] });
      
      toast.success('Prontuário removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover prontuário');
    }
  });
};

// Hook para importar prontuários
export const useImportProntuarios = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => prontuarioService.importProntuarios(file),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] });
      queryClient.invalidateQueries({ queryKey: ['prontuarios', 'stats'] });
      
      toast.success(`Importação concluída! ${data.success} prontuários importados com sucesso.`);
      
      if (data.errors.length > 0) {
        toast.error(`Erros na importação: ${data.errors.join(', ')}`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao importar prontuários');
    }
  });
};

// Hook para exportar prontuários
export const useExportProntuarios = () => {
  return useMutation({
    mutationFn: ({ filters, formato }: { filters?: ProntuarioFilters; formato?: 'pdf' | 'xlsx' }) => 
      prontuarioService.exportProntuarios(filters, formato),
    onSuccess: (blob, variables) => {
      // Download automático do arquivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prontuarios_${new Date().toISOString().split('T')[0]}.${variables.formato || 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Exportação concluída com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao exportar prontuários');
    }
  });
};

// Hook para modelos de prontuário
export const useModelosProntuario = () => {
  return useQuery({
    queryKey: createQueryKey('prontuarios', 'modelos'),
    queryFn: () => prontuarioService.getModelosProntuario(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook para template de prontuário por tipo
export const useTemplateProntuario = (tipo: TipoProntuario) => {
  return useQuery({
    queryKey: createQueryKey('prontuarios', 'template', { tipo }),
    queryFn: () => prontuarioService.getModeloProntuario(tipo),
    enabled: !!tipo,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}; 
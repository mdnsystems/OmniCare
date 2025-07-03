import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as profissionalService from '@/services/profissional.service';
import { Profissional, ProfissionalStatus, PaginatedResponse } from '@/types/api';
import { createQueryKey } from '@/services/api';

// Tipos para filtros e parâmetros
export interface ProfissionalFilters {
  nome?: string;
  email?: string;
  telefone?: string;
  especialidadeId?: string;
  status?: ProfissionalStatus;
  registro?: string;
  crm?: string;
  ativo?: boolean;
}

export interface ProfissionalParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: ProfissionalFilters;
}

// Hook para listar profissionais com paginação
export const useProfissionais = (params: ProfissionalParams = {}) => {
  const { page = 1, limit = 10, sortBy, sortOrder, filters } = params;
  
  return useQuery({
    queryKey: createQueryKey('profissionais', { page, limit, ...filters }),
    queryFn: () => profissionalService.getProfissionais({ page, limit, ...filters }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para buscar profissionais por nome (autocomplete)
export const useProfissionaisSearch = (searchTerm: string, limit: number = 10) => {
  return useQuery({
    queryKey: createQueryKey('profissionais', 'search', { searchTerm, limit }),
    queryFn: () => profissionalService.searchProfissionais(searchTerm, limit),
    enabled: searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obter um profissional específico
export const useProfissional = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('profissional', { id }),
    queryFn: () => profissionalService.getProfissional(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter profissionais por especialidade
export const useProfissionaisByEspecialidade = (especialidadeId: string) => {
  return useQuery({
    queryKey: createQueryKey('profissionais', 'especialidade', { especialidadeId }),
    queryFn: () => profissionalService.getProfissionaisByEspecialidade(especialidadeId),
    enabled: !!especialidadeId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter profissionais ativos
export const useProfissionaisAtivos = () => {
  return useQuery({
    queryKey: createQueryKey('profissionais', 'ativos'),
    queryFn: () => profissionalService.getProfissionaisAtivos(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter estatísticas de profissionais
export const useProfissionaisStats = () => {
  return useQuery({
    queryKey: createQueryKey('profissionais', 'stats'),
    queryFn: () => profissionalService.getProfissionaisStats(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para criar profissional
export const useCreateProfissional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Profissional, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => 
      profissionalService.createProfissional(data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
      queryClient.invalidateQueries({ queryKey: ['profissionais', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Adicionar à cache
      queryClient.setQueryData(
        createQueryKey('profissional', { id: data.id }),
        data
      );
      
      toast.success('Profissional criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar profissional');
    }
  });
};

// Hook para atualizar profissional
export const useUpdateProfissional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Profissional> }) => 
      profissionalService.updateProfissional(id, data),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
      queryClient.invalidateQueries({ queryKey: ['profissional', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['profissionais', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('profissional', { id: data.id }),
        data
      );
      
      toast.success('Profissional atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar profissional');
    }
  });
};

// Hook para deletar profissional
export const useDeleteProfissional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => profissionalService.deleteProfissional(id),
    onSuccess: (_, id) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
      queryClient.invalidateQueries({ queryKey: ['profissionais', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Remover da cache
      queryClient.removeQueries({ queryKey: ['profissional', id] });
      
      toast.success('Profissional removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover profissional');
    }
  });
};

// Hook para alterar status do profissional
export const useToggleProfissionalStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProfissionalStatus }) => 
      profissionalService.toggleProfissionalStatus(id, status),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
      queryClient.invalidateQueries({ queryKey: ['profissional', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['profissionais', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('profissional', { id: data.id }),
        data
      );
      
      toast.success(`Status do profissional alterado para ${variables.status}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao alterar status do profissional');
    }
  });
};

// Hook para importar profissionais
export const useImportProfissionais = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profissionalService.importProfissionais(file),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
      queryClient.invalidateQueries({ queryKey: ['profissionais', 'stats'] });
      
      toast.success(`${data.importados} profissionais importados com sucesso!`);
      
      if (data.erros && data.erros.length > 0) {
        toast.warning(`${data.erros.length} registros com erro. Verifique o relatório.`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao importar profissionais');
    }
  });
};

// Hook para exportar profissionais
export const useExportProfissionais = () => {
  return useMutation({
    mutationFn: (filters?: ProfissionalFilters) => profissionalService.exportProfissionais(filters),
    onSuccess: (data) => {
      // Criar download do arquivo
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profissionais_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Exportação realizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao exportar profissionais');
    }
  });
};

// Hook para validar registro profissional
export const useValidateRegistro = () => {
  return useMutation({
    mutationFn: (registro: string) => profissionalService.validateRegistro(registro),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao validar registro');
    }
  });
};

// Hook para validar CRM
export const useValidateCRM = () => {
  return useMutation({
    mutationFn: (crm: string) => profissionalService.validateCRM(crm),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao validar CRM');
    }
  });
};

// Hook para obter horários do profissional
export const useProfissionalHorarios = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('profissional', 'horarios', { id }),
    queryFn: () => profissionalService.getProfissionalHorarios(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para atualizar horários do profissional
export const useUpdateProfissionalHorarios = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, horarios }: { id: string; horarios: any }) => 
      profissionalService.updateProfissionalHorarios(id, horarios),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['profissional', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['profissional', 'horarios', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      
      toast.success('Horários atualizados com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar horários');
    }
  });
};

// Hook para obter pacientes do profissional
export const useProfissionalPacientes = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('profissional', 'pacientes', { id }),
    queryFn: () => profissionalService.getProfissionalPacientes(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter agendamentos do profissional
export const useProfissionalAgendamentos = (id: string, data?: string) => {
  return useQuery({
    queryKey: createQueryKey('profissional', 'agendamentos', { id, data }),
    queryFn: () => profissionalService.getProfissionalAgendamentos(id, data),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obter prontuários do profissional
export const useProfissionalProntuarios = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('profissional', 'prontuarios', { id }),
    queryFn: () => profissionalService.getProfissionalProntuarios(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter faturamento do profissional
export const useProfissionalFaturamento = (id: string, periodoInicio?: string, periodoFim?: string) => {
  return useQuery({
    queryKey: createQueryKey('profissional', 'faturamento', { id, periodoInicio, periodoFim }),
    queryFn: () => profissionalService.getProfissionalFaturamento(id, periodoInicio, periodoFim),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter relatórios do profissional
export const useProfissionalRelatorios = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('profissional', 'relatorios', { id }),
    queryFn: () => profissionalService.getProfissionalRelatorios(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para obter disponibilidade do profissional
export const useProfissionalDisponibilidade = (id: string, data: string) => {
  return useQuery({
    queryKey: createQueryKey('profissional', 'disponibilidade', { id, data }),
    queryFn: () => profissionalService.getProfissionalDisponibilidade(id, data),
    enabled: !!id && !!data,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

// Hook para obter agenda do profissional
export const useProfissionalAgenda = (id: string, dataInicio: string, dataFim: string) => {
  return useQuery({
    queryKey: createQueryKey('profissional', 'agenda', { id, dataInicio, dataFim }),
    queryFn: () => profissionalService.getProfissionalAgenda(id, dataInicio, dataFim),
    enabled: !!id && !!dataInicio && !!dataFim,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}; 
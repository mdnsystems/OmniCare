import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as agendamentoService from '@/services/agendamento.service';
import { Agendamento, StatusAgendamento, TipoAgendamento, PaginatedResponse } from '@/types/api';
import { createQueryKey } from '@/services/api';

// Tipos para filtros e parâmetros
export interface AgendamentoFilters {
  pacienteId?: string;
  pacienteNome?: string;
  profissionalId?: string;
  dataInicio?: string;
  dataFim?: string;
  status?: StatusAgendamento;
  tipo?: TipoAgendamento;
  especialidadeId?: string;
  ativo?: boolean;
}

export interface AgendamentoParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: AgendamentoFilters;
}

// Hook para listar agendamentos com paginação
export const useAgendamentos = (params: AgendamentoParams = {}) => {
  const { page = 1, limit = 10, sortBy, sortOrder, filters } = params;
  
  return useQuery({
    queryKey: createQueryKey('agendamentos', { page, limit, sortBy, sortOrder, ...filters }),
    queryFn: () => agendamentoService.getAgendamentos({ page, limit, sortBy, sortOrder, filters }),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar agendamentos por termo (autocomplete)
export const useAgendamentosSearch = (searchTerm: string, limit: number = 10) => {
  return useQuery({
    queryKey: createQueryKey('agendamentos', 'search', { searchTerm, limit }),
    queryFn: () => agendamentoService.searchAgendamentos(searchTerm, limit),
    enabled: searchTerm.length >= 2,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

// Hook para obter um agendamento específico
export const useAgendamento = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('agendamento', { id }),
    queryFn: () => agendamentoService.getAgendamento(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obter agendamentos de hoje
export const useAgendamentosHoje = () => {
  return useQuery({
    queryKey: createQueryKey('agendamentos', 'hoje'),
    queryFn: () => agendamentoService.getAgendamentosHoje(),
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

// Hook para obter agendamentos por data
export const useAgendamentosPorData = (data: string) => {
  return useQuery({
    queryKey: createQueryKey('agendamentos', 'data', { data }),
    queryFn: () => agendamentoService.getAgendamentosPorData(data),
    enabled: !!data,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

// Hook para obter agendamentos por período
export const useAgendamentosPorPeriodo = (dataInicio: string, dataFim: string) => {
  return useQuery({
    queryKey: createQueryKey('agendamentos', 'periodo', { dataInicio, dataFim }),
    queryFn: () => agendamentoService.getAgendamentosPorPeriodo(dataInicio, dataFim),
    enabled: !!dataInicio && !!dataFim,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obter agendamentos por profissional
export const useAgendamentosPorProfissional = (profissionalId: string, data?: string) => {
  return useQuery({
    queryKey: createQueryKey('agendamentos', 'profissional', { profissionalId, data }),
    queryFn: () => agendamentoService.getAgendamentosPorProfissional(profissionalId, data),
    enabled: !!profissionalId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obter agendamentos por paciente
export const useAgendamentosPorPaciente = (pacienteId: string) => {
  return useQuery({
    queryKey: createQueryKey('agendamentos', 'paciente', { pacienteId }),
    queryFn: () => agendamentoService.getAgendamentosPorPaciente(pacienteId),
    enabled: !!pacienteId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obter estatísticas de agendamentos
export const useAgendamentosStats = (periodoInicio?: string, periodoFim?: string) => {
  return useQuery({
    queryKey: createQueryKey('agendamentos', 'stats', { periodoInicio, periodoFim }),
    queryFn: () => agendamentoService.getAgendamentosStats(periodoInicio, periodoFim),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para criar agendamento
export const useCreateAgendamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Agendamento, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => 
      agendamentoService.createAgendamento(data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'hoje'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Adicionar à cache
      queryClient.setQueryData(
        createQueryKey('agendamento', { id: data.id }),
        data
      );
      
      toast.success('Agendamento criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar agendamento');
    }
  });
};

// Hook para atualizar agendamento
export const useUpdateAgendamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Agendamento> }) => 
      agendamentoService.updateAgendamento(id, data),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agendamento', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'hoje'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('agendamento', { id: data.id }),
        data
      );
      
      toast.success('Agendamento atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar agendamento');
    }
  });
};

// Hook para deletar agendamento
export const useDeleteAgendamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => agendamentoService.deleteAgendamento(id),
    onSuccess: (_, id) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'hoje'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Remover da cache
      queryClient.removeQueries({ queryKey: ['agendamento', id] });
      
      toast.success('Agendamento removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover agendamento');
    }
  });
};

// Hook para confirmar agendamento
export const useConfirmarAgendamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, observacoes }: { id: string; observacoes?: string }) => 
      agendamentoService.confirmarAgendamento(id, observacoes),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agendamento', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'hoje'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('agendamento', { id: data.id }),
        data
      );
      
      toast.success('Agendamento confirmado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao confirmar agendamento');
    }
  });
};

// Hook para cancelar agendamento
export const useCancelarAgendamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo: string }) => 
      agendamentoService.cancelarAgendamento(id, motivo),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agendamento', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'hoje'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('agendamento', { id: data.id }),
        data
      );
      
      toast.success('Agendamento cancelado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao cancelar agendamento');
    }
  });
};

// Hook para remarcar agendamento
export const useRemarcarAgendamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, novaData, novaHoraInicio, novaHoraFim, motivo }: {
      id: string;
      novaData: string;
      novaHoraInicio: string;
      novaHoraFim: string;
      motivo?: string;
    }) => agendamentoService.remarcarAgendamento(id, novaData, novaHoraInicio, novaHoraFim, motivo),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agendamento', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'hoje'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('agendamento', { id: data.id }),
        data
      );
      
      toast.success('Agendamento remarcado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remarcar agendamento');
    }
  });
};

// Hook para realizar agendamento
export const useRealizarAgendamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, observacoes }: { id: string; observacoes?: string }) => 
      agendamentoService.realizarAgendamento(id, observacoes),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agendamento', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'hoje'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('agendamento', { id: data.id }),
        data
      );
      
      toast.success('Agendamento realizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao realizar agendamento');
    }
  });
};

// Hook para verificar disponibilidade
export const useVerificarDisponibilidade = () => {
  return useMutation({
    mutationFn: ({ profissionalId, data, horaInicio, horaFim }: {
      profissionalId: string;
      data: string;
      horaInicio: string;
      horaFim: string;
    }) => agendamentoService.verificarDisponibilidade(profissionalId, data, horaInicio, horaFim),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao verificar disponibilidade');
    }
  });
};

// Hook para obter horários disponíveis
export const useHorariosDisponiveis = (profissionalId: string, data: string) => {
  return useQuery({
    queryKey: createQueryKey('agendamentos', 'horarios-disponiveis', { profissionalId, data }),
    queryFn: () => agendamentoService.getHorariosDisponiveis(profissionalId, data),
    enabled: !!profissionalId && !!data,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

// Hook para enviar confirmação por WhatsApp
export const useEnviarConfirmacaoWhatsApp = () => {
  return useMutation({
    mutationFn: (agendamentoId: string) => agendamentoService.enviarConfirmacaoWhatsApp(agendamentoId),
    onSuccess: () => {
      toast.success('Confirmação enviada por WhatsApp!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao enviar confirmação por WhatsApp');
    }
  });
};

// Hook para enviar lembrete por WhatsApp
export const useEnviarLembreteWhatsApp = () => {
  return useMutation({
    mutationFn: (agendamentoId: string) => agendamentoService.enviarLembreteWhatsApp(agendamentoId),
    onSuccess: () => {
      toast.success('Lembrete enviado por WhatsApp!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao enviar lembrete por WhatsApp');
    }
  });
};

// Hook para importar agendamentos
export const useImportAgendamentos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => agendamentoService.importAgendamentos(file),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'stats'] });
      
      toast.success(`${data.importados} agendamentos importados com sucesso!`);
      
      if (data.erros && data.erros.length > 0) {
        toast.warning(`${data.erros.length} registros com erro. Verifique o relatório.`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao importar agendamentos');
    }
  });
};

// Hook para exportar agendamentos
export const useExportAgendamentos = () => {
  return useMutation({
    mutationFn: (filters?: AgendamentoFilters) => agendamentoService.exportAgendamentos(filters),
    onSuccess: (data) => {
      // Criar download do arquivo
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agendamentos_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Exportação realizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao exportar agendamentos');
    }
  });
};

// Hook para obter agenda do profissional
export const useAgendaProfissional = (profissionalId: string, dataInicio: string, dataFim: string) => {
  return useQuery({
    queryKey: createQueryKey('agendamentos', 'agenda-profissional', { profissionalId, dataInicio, dataFim }),
    queryFn: () => agendamentoService.getAgendaProfissional(profissionalId, dataInicio, dataFim),
    enabled: !!profissionalId && !!dataInicio && !!dataFim,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obter agenda da clínica
export const useAgendaClinica = (dataInicio: string, dataFim: string) => {
  return useQuery({
    queryKey: createQueryKey('agendamentos', 'agenda-clinica', { dataInicio, dataFim }),
    queryFn: () => agendamentoService.getAgendaClinica(dataInicio, dataFim),
    enabled: !!dataInicio && !!dataFim,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}; 
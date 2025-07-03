import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as pacienteService from '@/services/paciente.service';
import { Paciente, PaginatedResponse } from '@/types/api';
import { createQueryKey } from '@/services/api';

// Tipos para filtros e parâmetros
export interface PacienteFilters {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  profissionalId?: string;
  ativo?: boolean;
  dataNascimentoInicio?: string;
  dataNascimentoFim?: string;
  convenio?: string;
}

export interface PacienteParams {
  page?: number;
  limit?: number;
  filters?: PacienteFilters;
}

// Hook para listar pacientes com paginação
export const usePacientes = (params: PacienteParams = {}) => {
  const { page = 1, limit = 10, filters } = params;
  
  return useQuery({
    queryKey: createQueryKey('pacientes', { page, limit, ...filters }),
    queryFn: () => pacienteService.getPacientes({ page, limit, ...filters }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para obter um paciente específico
export const usePaciente = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('paciente', { id }),
    queryFn: () => pacienteService.getPaciente(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para criar paciente
export const useCreatePaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Paciente, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => 
      pacienteService.createPaciente(data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Adicionar à cache
      queryClient.setQueryData(
        createQueryKey('paciente', { id: data.id }),
        data
      );
      
      toast.success('Paciente criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar paciente');
    }
  });
};

// Hook para atualizar paciente
export const useUpdatePaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Paciente> }) => 
      pacienteService.updatePaciente(id, data),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['paciente', variables.id] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('paciente', { id: data.id }),
        data
      );
      
      toast.success('Paciente atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar paciente');
    }
  });
};

// Hook para deletar paciente
export const useDeletePaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cascade = false }: { id: string; cascade?: boolean }) => 
      pacienteService.deletePaciente(id, cascade),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Remover da cache
      queryClient.removeQueries({ queryKey: ['paciente', variables.id] });
      
      const message = variables.cascade 
        ? 'Paciente e todos os registros relacionados removidos com sucesso!' 
        : 'Paciente removido com sucesso!';
      toast.success(message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover paciente');
    }
  });
};

// Hook para validar CPF
export const useValidateCPF = () => {
  return useMutation({
    mutationFn: (cpf: string) => pacienteService.validateCpf(cpf),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao validar CPF');
    }
  });
};

// Hook para obter histórico do paciente
export const usePacienteHistorico = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('paciente', 'historico', { id }),
    queryFn: () => pacienteService.getHistoricoPaciente(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}; 
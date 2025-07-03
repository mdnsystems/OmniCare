// =============================================================================
// HOOKS - SUPER ADMIN
// =============================================================================
// 
// Hooks para operações do SUPER_ADMIN
// Foco em gestão de clínicas e relatórios macro
//
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  listarClinicas,
  obterDetalhesClinica,
  toggleStatusClinica,
  atualizarClinica,
  relatorioUsuarios,
  relatorioAtividades,
  relatorioGestaoClinicas,
  relatorioChat,
  ClinicaSuperAdmin,
  DetalhesClinica,
  AtualizarClinicaData
} from '../services/super-admin.service';

// =============================================================================
// HOOKS DE CLÍNICAS
// =============================================================================

/**
 * Hook para listar todas as clínicas
 */
export const useClinicasSuperAdmin = () => {
  return useQuery({
    queryKey: ['super-admin', 'clinicas'],
    queryFn: listarClinicas,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obter detalhes de uma clínica
 */
export const useDetalhesClinica = (id: string) => {
  return useQuery({
    queryKey: ['super-admin', 'clinica', id],
    queryFn: () => obterDetalhesClinica(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para ativar/desativar clínica
 */
export const useToggleStatusClinica = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleStatusClinica,
    onSuccess: (data) => {
      toast.success(`Clínica ${data.ativo ? 'ativada' : 'desativada'} com sucesso!`);
      
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'clinicas'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'clinica', data.id] });
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'relatorios'] });
    },
    onError: (error) => {
      toast.error('Erro ao alterar status da clínica');
      console.error('Erro ao alterar status da clínica:', error);
    }
  });
};

/**
 * Hook para atualizar clínica
 */
export const useAtualizarClinica = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AtualizarClinicaData }) =>
      atualizarClinica(id, data),
    onSuccess: (data) => {
      toast.success('Clínica atualizada com sucesso!');
      
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'clinicas'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'clinica', data.id] });
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'relatorios'] });
    },
    onError: (error) => {
      toast.error('Erro ao atualizar clínica');
      console.error('Erro ao atualizar clínica:', error);
    }
  });
};

// =============================================================================
// HOOKS DE RELATÓRIOS
// =============================================================================

/**
 * Hook para relatório de usuários
 */
export const useRelatorioUsuarios = (clinicaId?: string) => {
  return useQuery({
    queryKey: ['super-admin', 'relatorios', 'usuarios', clinicaId],
    queryFn: () => relatorioUsuarios(clinicaId),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para relatório de atividades
 */
export const useRelatorioAtividades = (clinicaId?: string, periodo?: 'semana' | 'mes') => {
  return useQuery({
    queryKey: ['super-admin', 'relatorios', 'atividades', clinicaId, periodo],
    queryFn: () => relatorioAtividades(clinicaId, periodo),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para relatório de gestão de clínicas
 */
export const useRelatorioGestaoClinicas = () => {
  return useQuery({
    queryKey: ['super-admin', 'relatorios', 'gestao-clinicas'],
    queryFn: relatorioGestaoClinicas,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para relatório de chat
 */
export const useRelatorioChat = (clinicaId?: string, periodo?: 'semana' | 'mes') => {
  return useQuery({
    queryKey: ['super-admin', 'relatorios', 'chat', clinicaId, periodo],
    queryFn: () => relatorioChat(clinicaId, periodo),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}; 
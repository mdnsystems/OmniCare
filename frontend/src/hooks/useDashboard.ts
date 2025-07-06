import { useQuery } from '@tanstack/react-query';
import { 
  getDashboard, 
  getEstatisticasAgendamentos, 
  getEstatisticasFinanceiras,
  getEstatisticasPacientes,
  getEstatisticasProfissionais,
  getEstatisticasProntuarios,
  getEstatisticasAnamnese,
  getEstatisticasAtividades,
  getEvolucaoSemanal
} from '../services/dashboard.service';

// Hook para dashboard geral
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Atualiza a cada 5 minutos
  });
};

// Hook para estatísticas de agendamentos
export const useEstatisticasAgendamentos = (periodo?: { inicio: string; fim: string }) => {
  return useQuery({
    queryKey: ['dashboard', 'agendamentos', periodo],
    queryFn: () => getEstatisticasAgendamentos(periodo),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};

// Hook para estatísticas financeiras
export const useEstatisticasFinanceiras = (periodo?: { inicio: string; fim: string }) => {
  return useQuery({
    queryKey: ['dashboard', 'financeiro', periodo],
    queryFn: () => getEstatisticasFinanceiras(periodo),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};

// Hook para estatísticas de pacientes
export const useEstatisticasPacientes = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['dashboard', 'pacientes'],
    queryFn: getEstatisticasPacientes,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchInterval: 10 * 60 * 1000,
    enabled: options?.enabled !== false, // Por padrão é true, mas pode ser desabilitado
  });
};

// Hook para estatísticas de profissionais
export const useEstatisticasProfissionais = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['dashboard', 'profissionais'],
    queryFn: getEstatisticasProfissionais,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    enabled: options?.enabled !== false,
  });
};

// Hook para estatísticas de prontuários
export const useEstatisticasProntuarios = (periodo?: { inicio: string; fim: string }, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['dashboard', 'prontuarios', periodo],
    queryFn: () => getEstatisticasProntuarios(periodo),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    enabled: options?.enabled !== false,
  });
};

// Hook para estatísticas de anamnese
export const useEstatisticasAnamnese = (periodo?: { inicio: string; fim: string }, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['dashboard', 'anamnese', periodo],
    queryFn: () => getEstatisticasAnamnese(periodo),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    enabled: options?.enabled !== false,
  });
};

// Hook para estatísticas de atividades
export const useEstatisticasAtividades = () => {
  return useQuery({
    queryKey: ['dashboard', 'atividades'],
    queryFn: getEstatisticasAtividades,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 2 * 60 * 1000,
  });
};

// Hook para evolução semanal
export const useEvolucaoSemanal = () => {
  return useQuery({
    queryKey: ['dashboard', 'evolucao-semanal'],
    queryFn: getEvolucaoSemanal,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000,
  });
}; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Agendamento, StatusAgendamento } from '@/types/api';
import { useToast } from '@/components/ui/use-toast';
import { useMemo } from 'react';
import { isBefore, addDays } from 'date-fns';

export function useConfirmacoes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar agendamentos
  const { data: agendamentos, isLoading, error } = useQuery({
    queryKey: ['agendamentos-confirmacoes'],
    queryFn: async () => {
      const response = await api.get('/agendamentos');
      return response.data.data as Agendamento[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Filtrar agendamentos por status
  const agendamentosPendentes = useMemo(() => {
    if (!agendamentos) return [];
    return agendamentos.filter(ag => ag.status === StatusAgendamento.AGENDADO);
  }, [agendamentos]);

  const agendamentosConfirmados = useMemo(() => {
    if (!agendamentos) return [];
    return agendamentos.filter(ag => ag.status === StatusAgendamento.CONFIRMADO);
  }, [agendamentos]);

  const agendamentosCancelados = useMemo(() => {
    if (!agendamentos) return [];
    return agendamentos.filter(ag => ag.status === StatusAgendamento.CANCELADO);
  }, [agendamentos]);

  const agendamentosProximos = useMemo(() => {
    if (!agendamentos) return [];
    const hoje = new Date();
    const proximos2Dias = addDays(hoje, 2);
    
    return agendamentos.filter(ag => {
      const dataAgendamento = new Date(ag.data);
      return dataAgendamento >= hoje && dataAgendamento <= proximos2Dias && ag.status !== StatusAgendamento.CANCELADO;
    });
  }, [agendamentos]);

  const agendamentosAtrasados = useMemo(() => {
    if (!agendamentos) return [];
    const hoje = new Date();
    
    return agendamentos.filter(ag => {
      const dataAgendamento = new Date(ag.data);
      return isBefore(dataAgendamento, hoje) && ag.status === StatusAgendamento.AGENDADO;
    });
  }, [agendamentos]);

  // Confirmar agendamento
  const confirmarAgendamento = useMutation({
    mutationFn: async (agendamentoId: string) => {
      const response = await api.patch(`/agendamentos/${agendamentoId}/confirmar`, {
        status: StatusAgendamento.CONFIRMADO
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos-confirmacoes'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      
      toast({
        title: "Agendamento confirmado!",
        description: `Consulta confirmada com sucesso.`,
      });
    },
    onError: () => {
      toast({
        title: "Erro ao confirmar",
        description: "Não foi possível confirmar o agendamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Cancelar agendamento
  const cancelarAgendamento = useMutation({
    mutationFn: async (agendamentoId: string) => {
      const response = await api.patch(`/agendamentos/${agendamentoId}/cancelar`, {
        status: StatusAgendamento.CANCELADO
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos-confirmacoes'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      
      toast({
        title: "Agendamento cancelado!",
        description: `Consulta cancelada com sucesso.`,
      });
    },
    onError: () => {
      toast({
        title: "Erro ao cancelar",
        description: "Não foi possível cancelar o agendamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Reagendar agendamento
  const reagendarAgendamento = useMutation({
    mutationFn: async ({ agendamentoId, novaData, novaHora }: {
      agendamentoId: string;
      novaData: string;
      novaHora: string;
    }) => {
      const response = await api.patch(`/agendamentos/${agendamentoId}/reagendar`, {
        novaData,
        novaHora,
        status: StatusAgendamento.AGENDADO
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos-confirmacoes'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      
      toast({
        title: "Agendamento reagendado!",
        description: `Consulta reagendada com sucesso.`,
      });
    },
    onError: () => {
      toast({
        title: "Erro ao reagendar",
        description: "Não foi possível reagendar o agendamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Enviar lembrete
  const enviarLembrete = useMutation({
    mutationFn: async ({ agendamentoId, mensagem }: { agendamentoId: string; mensagem: string }) => {
      const response = await api.post(`/agendamentos/${agendamentoId}/lembrete`, { mensagem });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Lembrete enviado!",
        description: `Lembrete enviado com sucesso para o paciente.`,
      });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar lembrete",
        description: "Não foi possível enviar o lembrete. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Enviar confirmação por WhatsApp
  const enviarConfirmacaoWhatsApp = useMutation({
    mutationFn: async (agendamentoId: string) => {
      const response = await api.post(`/agendamentos/${agendamentoId}/confirmacao-whatsapp`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Confirmação enviada!",
        description: `Confirmação enviada via WhatsApp com sucesso.`,
      });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar confirmação",
        description: "Não foi possível enviar a confirmação via WhatsApp. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    // Dados
    agendamentos,
    agendamentosPendentes,
    agendamentosConfirmados,
    agendamentosCancelados,
    agendamentosProximos,
    agendamentosAtrasados,
    
    // Estados
    isLoading,
    error,
    isConfirming: confirmarAgendamento.isPending,
    isCanceling: cancelarAgendamento.isPending,
    isSendingReminder: enviarLembrete.isPending,
    
    // Mutations
    confirmarAgendamento: confirmarAgendamento.mutateAsync,
    cancelarAgendamento: cancelarAgendamento.mutateAsync,
    reagendarAgendamento: reagendarAgendamento.mutateAsync,
    enviarLembrete: enviarLembrete.mutateAsync,
    enviarConfirmacaoWhatsApp: enviarConfirmacaoWhatsApp.mutateAsync,
    
    // Funções auxiliares
    refetch: () => queryClient.invalidateQueries({ queryKey: ['agendamentos-confirmacoes'] })
  };
} 
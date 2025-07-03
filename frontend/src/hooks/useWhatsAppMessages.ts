import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { zApiService } from '@/lib/z-api-service';
import { AgendamentoMessage, ZApiResponse } from '@/types/api';
import { useClinica } from '@/contexts/ClinicaContext';

export function useWhatsAppMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { configuracao } = useClinica();

  // Enviar mensagem de agendamento
  const sendAgendamentoMessage = useMutation({
    mutationFn: async (agendamentoData: Omit<AgendamentoMessage, 'clinica'>) => {
      if (!configuracao) {
        throw new Error('Configuração da clínica não encontrada');
      }

      const fullData: AgendamentoMessage = {
        ...agendamentoData,
        clinica: configuracao
      };

      return zApiService.sendAgendamentoMessage(fullData);
    },
    onSuccess: (response: ZApiResponse) => {
      if (response.success) {
        toast({
          title: "✅ Mensagem enviada!",
          description: "Confirmação de agendamento enviada via WhatsApp com sucesso.",
        });
      } else {
        toast({
          title: "❌ Erro ao enviar mensagem",
          description: response.error || "Não foi possível enviar a mensagem.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Erro ao enviar mensagem",
        description: error.message || "Erro inesperado ao enviar mensagem.",
        variant: "destructive",
      });
    },
  });

  // Enviar lembrete
  const sendLembreteMessage = useMutation({
    mutationFn: async (agendamentoData: Omit<AgendamentoMessage, 'clinica'>) => {
      if (!configuracao) {
        throw new Error('Configuração da clínica não encontrada');
      }

      const fullData: AgendamentoMessage = {
        ...agendamentoData,
        clinica: configuracao
      };

      return zApiService.sendLembreteMessage(fullData);
    },
    onSuccess: (response: ZApiResponse) => {
      if (response.success) {
        toast({
          title: "✅ Lembrete enviado!",
          description: "Lembrete de consulta enviado via WhatsApp com sucesso.",
        });
      } else {
        toast({
          title: "❌ Erro ao enviar lembrete",
          description: response.error || "Não foi possível enviar o lembrete.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Erro ao enviar lembrete",
        description: error.message || "Erro inesperado ao enviar lembrete.",
        variant: "destructive",
      });
    },
  });

  // Enviar mensagem de cancelamento
  const sendCancelamentoMessage = useMutation({
    mutationFn: async (agendamentoData: Omit<AgendamentoMessage, 'clinica'>) => {
      if (!configuracao) {
        throw new Error('Configuração da clínica não encontrada');
      }

      const fullData: AgendamentoMessage = {
        ...agendamentoData,
        clinica: configuracao
      };

      return zApiService.sendCancelamentoMessage(fullData);
    },
    onSuccess: (response: ZApiResponse) => {
      if (response.success) {
        toast({
          title: "✅ Cancelamento comunicado!",
          description: "Mensagem de cancelamento enviada via WhatsApp com sucesso.",
        });
      } else {
        toast({
          title: "❌ Erro ao enviar cancelamento",
          description: response.error || "Não foi possível enviar a mensagem de cancelamento.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Erro ao enviar cancelamento",
        description: error.message || "Erro inesperado ao enviar cancelamento.",
        variant: "destructive",
      });
    },
  });

  // Agendar lembrete
  const scheduleLembrete = useMutation({
    mutationFn: async (agendamentoData: Omit<AgendamentoMessage, 'clinica'>) => {
      if (!configuracao) {
        throw new Error('Configuração da clínica não encontrada');
      }

      const fullData: AgendamentoMessage = {
        ...agendamentoData,
        clinica: configuracao
      };

      // Agendar o lembrete
      zApiService.scheduleLembreteMessage(fullData);
      
      return { success: true, message: 'Lembrete agendado com sucesso' };
    },
    onSuccess: () => {
      toast({
        title: "📅 Lembrete agendado!",
        description: "Lembrete será enviado automaticamente um dia antes da consulta.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Erro ao agendar lembrete",
        description: error.message || "Erro inesperado ao agendar lembrete.",
        variant: "destructive",
      });
    },
  });

  // Enviar mensagem de agendamento e agendar lembrete
  const sendAgendamentoAndScheduleLembrete = useMutation({
    mutationFn: async (agendamentoData: Omit<AgendamentoMessage, 'clinica'>) => {
      if (!configuracao) {
        throw new Error('Configuração da clínica não encontrada');
      }

      const fullData: AgendamentoMessage = {
        ...agendamentoData,
        clinica: configuracao
      };

      // Enviar mensagem de agendamento
      const agendamentoResponse = await zApiService.sendAgendamentoMessage(fullData);
      
      if (agendamentoResponse.success) {
        // Agendar lembrete
        zApiService.scheduleLembreteMessage(fullData);
      }

      return agendamentoResponse;
    },
    onSuccess: (response: ZApiResponse) => {
      if (response.success) {
        toast({
          title: "✅ Agendamento completo!",
          description: "Mensagem enviada e lembrete agendado com sucesso.",
        });
      } else {
        toast({
          title: "❌ Erro no agendamento",
          description: response.error || "Não foi possível completar o agendamento.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Erro no agendamento",
        description: error.message || "Erro inesperado no agendamento.",
        variant: "destructive",
      });
    },
  });

  return {
    sendAgendamentoMessage,
    sendLembreteMessage,
    sendCancelamentoMessage,
    scheduleLembrete,
    sendAgendamentoAndScheduleLembrete,
    isLoading: sendAgendamentoMessage.isPending || 
               sendLembreteMessage.isPending || 
               sendCancelamentoMessage.isPending || 
               scheduleLembrete.isPending ||
               sendAgendamentoAndScheduleLembrete.isPending
  };
} 
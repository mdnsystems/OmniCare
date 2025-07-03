import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  buscarNotificacoesLembretes, 
  marcarNotificacaoComoLida, 
  marcarTodasNotificacoesComoLidas,
  NotificacaoLembrete 
} from '@/services/lembrete.service';

export function useNotificacoesLembretes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar notificações de lembretes
  const { data: notificacoes = [], isLoading, error } = useQuery<NotificacaoLembrete[]>({
    queryKey: ['notificacoes-lembretes'],
    queryFn: buscarNotificacoesLembretes,
    enabled: !!user && user.role === 'ADMIN',
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    retry: 1,
    onError: (error: any) => {
      console.error('Erro ao buscar notificações:', error);
    }
  });

  // Marcar notificação como lida
  const marcarComoLida = useMutation({
    mutationFn: marcarNotificacaoComoLida,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes-lembretes'] });
      toast.success("Notificação marcada como lida");
    },
    onError: (error: any) => {
      console.error('Erro ao marcar notificação como lida:', error);
      toast.error("Erro ao marcar notificação como lida");
    },
  });

  // Marcar todas como lidas
  const marcarTodasComoLidas = useMutation({
    mutationFn: marcarTodasNotificacoesComoLidas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes-lembretes'] });
      toast.success("Todas as notificações foram marcadas como lidas");
    },
    onError: (error: any) => {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      toast.error("Erro ao marcar notificações como lidas");
    },
  });

  // Contar notificações não lidas
  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida);
  const totalNaoLidas = notificacoesNaoLidas.length;

  // Verificar se deve mostrar o botão de notificações
  const deveMostrarNotificacoes = user?.role === 'ADMIN';

  return {
    notificacoes,
    notificacoesNaoLidas,
    totalNaoLidas,
    isLoading,
    error,
    marcarComoLida,
    marcarTodasComoLidas,
    deveMostrarNotificacoes,
  };
} 
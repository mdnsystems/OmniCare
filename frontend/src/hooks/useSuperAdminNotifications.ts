import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/socket-context';
import { getChats } from '@/services/chat.service';

interface SuperAdminNotification {
  id: string;
  chatId: string;
  chatName: string;
  messageCount: number;
  lastMessage: {
    content: string;
    senderName: string;
    timestamp: string;
  };
  isRead: boolean;
}

export function useSuperAdminNotifications() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // Buscar chats com mensagens do super admin
  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['super-admin-notifications'],
    queryFn: async () => {
      try {
        const chats = await getChats();
        
        if (!Array.isArray(chats)) {
          return [];
        }

        // Filtrar apenas chats gerais que podem ter mensagens do super admin
        const geralChats = chats.filter((chat: any) => 
          chat.tipo === 'GERAL' && chat.mensagens && chat.mensagens.length > 0
        );

        // Processar notificações
        const processedNotifications: SuperAdminNotification[] = geralChats.map((chat: any) => {
          // Contar mensagens não lidas
          const unreadMessages = chat.mensagens.filter((msg: any) => 
            !msg.leituras || msg.leituras.length === 0
          );

          // Última mensagem
          const lastMessage = chat.mensagens[chat.mensagens.length - 1];

          return {
            id: chat.id,
            chatId: chat.id,
            chatName: chat.nome || 'Chat Geral',
            messageCount: unreadMessages.length,
            lastMessage: {
              content: lastMessage.content,
              senderName: lastMessage.senderName,
              timestamp: lastMessage.timestamp
            },
            isRead: unreadMessages.length === 0
          };
        });

        return processedNotifications.filter(notification => notification.messageCount > 0);
      } catch (error) {
        console.error('Erro ao buscar notificações do super admin:', error);
        return [];
      }
    },
    enabled: !!user,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  // Marcar notificação como lida
  const markAsRead = useMutation({
    mutationFn: async (chatId: string) => {
      // Aqui você implementaria a lógica para marcar como lida
      // Por enquanto, apenas invalida a query
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-notifications'] });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erro",
        description: "Erro ao marcar notificação como lida",
        variant: "destructive",
      });
    },
  });

  // Marcar todas como lidas
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      // Implementar lógica para marcar todas como lidas
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-notifications'] });
      toast({
        title: "✅ Sucesso",
        description: "Todas as notificações foram marcadas como lidas",
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erro",
        description: "Erro ao marcar notificações como lidas",
        variant: "destructive",
      });
    },
  });

  // Contar notificações não lidas
  const unreadCount = notifications.reduce((total, notification) => 
    total + notification.messageCount, 0
  );

  // Verificar se deve mostrar notificações
  const shouldShowNotifications = !!user && unreadCount > 0;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    shouldShowNotifications
  };
} 
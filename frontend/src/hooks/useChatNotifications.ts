import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/contexts/socket-context';
import { useAuth } from '@/contexts/AuthContext';
import { getChats } from '@/services/chat.service';

interface ChatNotification {
  hasUnreadMessages: boolean;
  unreadCount: number;
  lastNotificationTime: Date | null;
}

export function useChatNotifications() {
  const { socket, setOnPrivateMessage, setOnChatUpdate } = useSocket();
  const { user } = useAuth();
  const [notification, setNotification] = useState<ChatNotification>({
    hasUnreadMessages: false,
    unreadCount: 0,
    lastNotificationTime: null
  });

  // Função para carregar notificações
  const loadNotifications = useCallback(async () => {
    try {
      const chats = await getChats();
      
      if (!Array.isArray(chats)) {
        return;
      }
      
      const totalUnread = chats.reduce((total, chat) => {
        return total + (chat.naoLidas || 0);
      }, 0);
      
      setNotification(prev => ({
        ...prev,
        hasUnreadMessages: totalUnread > 0,
        unreadCount: totalUnread
      }));
    } catch (error) {
      console.error('❌ [Chat Notifications] Erro ao carregar notificações:', error);
    }
  }, []);

  // Configurar listeners de WebSocket
  useEffect(() => {
    if (socket) {
      // Listener para mensagens privadas
      setOnPrivateMessage((data: any) => {
        if (data && data.senderId !== user?.id) {
          setNotification(prev => ({
            hasUnreadMessages: true,
            unreadCount: prev.unreadCount + 1,
            lastNotificationTime: new Date()
          }));
        }
      });

      // Listener para atualizações de chat
      setOnChatUpdate((data: any) => {
        loadNotifications();
      });
    }
  }, [socket, user?.id, setOnPrivateMessage, setOnChatUpdate, loadNotifications]);

  // Carregar notificações inicialmente
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Função para limpar notificações (quando o usuário acessa o chat)
  const clearNotifications = useCallback(() => {
    setNotification({
      hasUnreadMessages: false,
      unreadCount: 0,
      lastNotificationTime: null
    });
  }, []);

  return {
    notification,
    clearNotifications,
    loadNotifications
  };
} 
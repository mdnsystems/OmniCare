import { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/socket-context';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  titulo: string;
  corpo: string;
  tipo: string;
  lida: boolean;
  createdAt: string;
}

export function useChatNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Usar try-catch para evitar erros se o contexto não estiver disponível
  let socketContext;
  try {
    socketContext = useSocket();
  } catch (error) {
    console.warn('⚠️ [Notifications] Socket context não disponível:', error);
    socketContext = { socket: null, isConnected: false };
  }
  
  const { socket, isConnected } = socketContext;
  const { user } = useAuth();

  useEffect(() => {
    if (!socket || !isConnected) {
      console.log('🔔 [Notifications] Socket não conectado, pulando configuração de listeners');
      return;
    }

    // Listener para novas notificações
    const handleNewNotification = (notification: Notification) => {
      console.log('🔔 [Notifications] Nova notificação recebida:', notification);
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Mostrar notificação visual (toast)
      if (notification.tipo === 'mensagem') {
        showToast(notification);
      }
    };

    socket.on('notificationReceived', handleNewNotification);

    return () => {
      if (socket) {
        socket.off('notificationReceived', handleNewNotification);
      }
    };
  }, [socket, isConnected]);

  const showToast = (notification: Notification) => {
    // Verificar se o navegador suporta notificações
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.titulo, {
        body: notification.corpo,
        icon: '/favicon.ico',
        tag: 'chat-notification'
      });
    }

    // Mostrar toast na interface (se disponível)
    // Aqui você pode integrar com uma biblioteca de toast como react-hot-toast
    console.log('📢 [Notifications] Toast:', notification.titulo);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, lida: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications,
    requestNotificationPermission
  };
} 
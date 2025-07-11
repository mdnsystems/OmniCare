import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/contexts/socket-context';

interface UserStatus {
  [userId: string]: 'online' | 'away' | 'busy' | 'offline';
}

export const useUserStatus = () => {
  const { socket, isConnected } = useSocket();
  const [userStatuses, setUserStatuses] = useState<UserStatus>({});

  // Atualizar status de um usuário
  const updateUserStatus = useCallback((userId: string, status: 'online' | 'away' | 'busy' | 'offline') => {
    setUserStatuses(prev => ({
      ...prev,
      [userId]: status
    }));
  }, []);

  // Obter status de um usuário
  const getUserStatus = useCallback((userId: string): 'online' | 'away' | 'busy' | 'offline' => {
    return userStatuses[userId] || 'offline';
  }, [userStatuses]);

  // Verificar se um usuário está online
  const isUserOnline = useCallback((userId: string): boolean => {
    return userStatuses[userId] === 'online';
  }, [userStatuses]);

  // Configurar listeners de eventos de status
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleUserStatus = (data: { userId: string; status: 'online' | 'away' | 'busy' | 'offline' }) => {
      console.log('👤 [UserStatus] Status atualizado:', data);
      updateUserStatus(data.userId, data.status);
    };

    const handleUserDisconnected = (data: { userId: string }) => {
      console.log('👋 [UserStatus] Usuário desconectado:', data);
      updateUserStatus(data.userId, 'offline');
    };

    // Adicionar listeners
    socket.on('userStatus', handleUserStatus);
    socket.on('userDisconnected', handleUserDisconnected);

    // Cleanup
    return () => {
      socket.off('userStatus', handleUserStatus);
      socket.off('userDisconnected', handleUserDisconnected);
    };
  }, [socket, isConnected, updateUserStatus]);

  return {
    userStatuses,
    getUserStatus,
    isUserOnline,
    updateUserStatus
  };
}; 
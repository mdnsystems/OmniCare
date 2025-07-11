import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useClinica } from './ClinicaContext';
import { Mensagem, RoleUsuario } from '@/types/api';
import { buscarChatGeral } from '@/services/chat.service';

interface SocketContextData {
  socket: Socket | null;
  isConnected: boolean;
  messages: Mensagem[];
  generalChatId: string | null;
  sendMessage: (content: string) => void;
  sendTyping: (isTyping: boolean) => void;
  sendStatus: (status: 'online' | 'away' | 'busy' | 'offline') => void;
  ping: () => void;
  // Novas funcionalidades para chats privados
  onPrivateMessage?: (message: Mensagem) => void;
  setOnPrivateMessage: (callback: (message: Mensagem) => void) => void;
  onChatUpdate?: (chatId: string, data: any) => void;
  setOnChatUpdate: (callback: (chatId: string, data: any) => void) => void;
  onUserTyping?: (data: any) => void;
  setOnUserTyping: (callback: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextData>({} as SocketContextData);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Mensagem[]>([]);
  const [generalChatId, setGeneralChatId] = useState<string | null>(null);
  const [onPrivateMessage, setOnPrivateMessage] = useState<((message: Mensagem) => void) | undefined>();
  const [onChatUpdate, setOnChatUpdate] = useState<((chatId: string, data: any) => void) | undefined>();
  const [onUserTyping, setOnUserTyping] = useState<((data: any) => void) | undefined>();
  const { user } = useAuth();
  const { configuracao } = useClinica();

  const sendMessage = (content: string) => {
    if (socket && user && configuracao && generalChatId) {
      socket.emit('message', {
        chatId: generalChatId,
        content,
        senderId: user.id,
        senderName: user.nome || user.email,
        senderRole: user.role,
        timestamp: new Date().toISOString()
      });
    }
  };

  const sendTyping = (isTyping: boolean) => {
    if (socket && isConnected && generalChatId) {
      socket.emit('typing', { chatId: generalChatId, isTyping });
    }
  };

  const sendStatus = (status: 'online' | 'away' | 'busy' | 'offline') => {
    if (socket && isConnected) {
      socket.emit('status', status);
    }
  };

  const ping = () => {
    if (socket && isConnected) {
      socket.emit('ping');
    }
  };

  // Callback para mensagens privadas
  const handlePrivateMessage = useCallback((message: Mensagem) => {
    // Verificar se a mensagem é válida
    if (!message || typeof message !== 'object') {
      console.warn('⚠️ [Socket] Mensagem privada inválida:', message);
      return;
    }

    console.log('📨 [Socket] Mensagem privada recebida:', {
      message,
      messageChatId: message?.chatId,
      hasCallback: !!onPrivateMessage
    });
    
    // Verificar se o callback está definido antes de chamá-lo
    if (onPrivateMessage && typeof onPrivateMessage === 'function') {
      try {
        onPrivateMessage(message);
      } catch (error) {
        console.error('❌ [Socket] Erro ao executar callback de mensagem privada:', error);
      }
    }
  }, [onPrivateMessage]);

  // Callback para atualizações de chat
  const handleChatUpdate = useCallback((chatId: string, data: any) => {
    // Verificar se os parâmetros são válidos
    if (!chatId || typeof chatId !== 'string') {
      console.warn('⚠️ [Socket] ChatId inválido para atualização:', chatId);
      return;
    }

    console.log('🔄 [Socket] Chat atualizado:', { chatId, data, hasCallback: !!onChatUpdate });
    
    // Verificar se o callback está definido antes de chamá-lo
    if (onChatUpdate && typeof onChatUpdate === 'function') {
      try {
        onChatUpdate(chatId, data);
      } catch (error) {
        console.error('❌ [Socket] Erro ao executar callback de atualização de chat:', error);
      }
    }
  }, [onChatUpdate]);

  // Callback para usuário digitando
  const handleUserTyping = useCallback((data: any) => {
    // Verificar se os dados são válidos
    if (!data || typeof data !== 'object') {
      console.warn('⚠️ [Socket] Dados de digitação inválidos:', data);
      return;
    }

    console.log('⌨️ [Socket] Usuário digitando:', { data, hasCallback: !!onUserTyping });
    
    // Verificar se o callback está definido antes de chamá-lo
    if (onUserTyping && typeof onUserTyping === 'function') {
      try {
        onUserTyping(data);
      } catch (error) {
        console.error('❌ [Socket] Erro ao executar callback de digitação:', error);
      }
    }
  }, [onUserTyping]);

  useEffect(() => {
    console.log('🟡 [Socket] useEffect chamado', { user, configuracao });
    if (!user || !configuracao) {
      console.log('🟡 [Socket] Usuário ou configuração não disponível, desconectando socket');
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Pegar o token do localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ [Socket] Token não encontrado no localStorage');
      return;
    }

    const wsUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';
    console.log('🟢 [Socket] Tentando conectar WebSocket', {
      url: wsUrl,
      token: token ? '***' : 'undefined',
      tenantId: user.tenantId,
      userId: user.id
    });

    const socketInstance = io(wsUrl, {
      auth: {
        token: token,
        tenantId: user.tenantId,
        userId: user.id
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 10,
      forceNew: true
    });

    socketInstance.on('connect', () => {
      console.log('🔌 WebSocket conectado');
      setIsConnected(true);
      
      // Buscar chat geral
      buscarChatGeral()
        .then((response) => {
          const chatGeral = response.data || response;
          console.log('✅ Chat geral encontrado:', chatGeral.id);
          setGeneralChatId(chatGeral.id);
        })
        .catch((error) => {
          console.error('❌ Erro ao buscar chat geral:', error);
        });
      
      // Entrar na sala do tenant
      socketInstance.emit('join', {
        tenantId: user.tenantId,
        userId: user.id
      });
    });

    socketInstance.on('connected', (data) => {
      console.log('✅ Conectado ao chat:', data.message);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 WebSocket desconectado:', reason);
      setIsConnected(false);
    });

    // Mensagens do chat geral
    socketInstance.on('newMessage', (message: Mensagem) => {
      // Verificar se a mensagem é válida
      if (!message || typeof message !== 'object') {
        console.warn('⚠️ [Socket] Mensagem inválida recebida:', message);
        return;
      }

      console.log('📨 Nova mensagem recebida no socket-context:', {
        message,
        messageChatId: message?.chatId,
        generalChatId,
        isGeneralChat: message?.chatId === generalChatId
      });
      
      // Se for mensagem do chat geral, adicionar ao estado
      if (message.chatId === generalChatId) {
        setMessages(prev => {
          const newMessages = [...prev, message];
          console.log('📝 Mensagens atualizadas no socket-context:', newMessages);
          return newMessages;
        });
      } else {
        // Se for mensagem privada, chamar callback
        handlePrivateMessage(message);
      }
    });

    // Mensagens privadas específicas
    socketInstance.on('privateMessage', (message: Mensagem) => {
      // Verificar se a mensagem é válida
      if (!message || typeof message !== 'object') {
        console.warn('⚠️ [Socket] Mensagem privada específica inválida:', message);
        return;
      }

      console.log('📨 [Socket] Mensagem privada específica:', message);
      handlePrivateMessage(message);
    });

    // Notificações de nova mensagem
    socketInstance.on('notificationReceived', (notification: any) => {
      console.log('🔔 [Socket] Nova notificação recebida:', notification);
      // Aqui você pode implementar a lógica para mostrar notificações
      // Por exemplo, mostrar um toast ou atualizar o badge de notificações
    });

    // Atualizações de chat
    socketInstance.on('chatUpdated', (data: any) => {
      // Verificar se os dados são válidos
      if (!data || typeof data !== 'object' || !data.id) {
        console.warn('⚠️ [Socket] Dados de atualização de chat inválidos:', data);
        return;
      }

      console.log('🔄 [Socket] Chat atualizado:', data);
      handleChatUpdate(data.id, data);
    });

    // Usuário digitando
    socketInstance.on('userTyping', (data) => {
      // Verificar se os dados são válidos
      if (!data || typeof data !== 'object') {
        console.warn('⚠️ [Socket] Dados de digitação inválidos:', data);
        return;
      }

      console.log('⌨️ [Socket] Usuário digitando:', data);
      handleUserTyping(data);
    });

    socketInstance.on('userStatus', (data) => {
      console.log('👤 Status do usuário:', data);
      // Aqui você pode implementar a lógica para mostrar status online/offline
    });

    socketInstance.on('userDisconnected', (data) => {
      console.log('👋 Usuário desconectado:', data);
      // Aqui você pode implementar a lógica para mostrar usuário offline
    });

    socketInstance.on('pong', (data) => {
      console.log('🏓 Pong recebido:', data.timestamp);
    });

    socketInstance.on('error', (error) => {
      console.error('❌ Erro no WebSocket:', error);
      console.error('❌ Detalhes do erro:', {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Erro de conexão WebSocket:', error);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      console.log('🟡 [Socket] Cleanup: desconectando socket');
      socketInstance.disconnect();
    };
  }, [user, configuracao, handlePrivateMessage, handleChatUpdate, handleUserTyping]);

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected, 
      messages, 
      generalChatId, 
      sendMessage, 
      sendTyping, 
      sendStatus, 
      ping,
      onPrivateMessage,
      setOnPrivateMessage,
      onChatUpdate,
      setOnChatUpdate,
      onUserTyping,
      setOnUserTyping
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    console.warn('⚠️ [Socket] useSocket deve ser usado dentro de um SocketProvider');
    // Retornar valores padrão seguros
    return {
      socket: null,
      isConnected: false,
      messages: [],
      generalChatId: null,
      sendMessage: () => {},
      sendTyping: () => {},
      sendStatus: () => {},
      ping: () => {},
      onPrivateMessage: undefined,
      setOnPrivateMessage: () => {},
      onChatUpdate: undefined,
      setOnChatUpdate: () => {},
      onUserTyping: undefined,
      setOnUserTyping: () => {}
    };
  }

  return context;
} 
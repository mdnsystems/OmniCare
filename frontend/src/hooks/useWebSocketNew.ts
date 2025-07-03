import { useEffect, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  webSocketService, 
  WebSocketConfig, 
  WebSocketConnectionStatus,
  WebSocketMessage,
  WebSocketNotification
} from '@/services/websocket.service';
import { useAuth } from './useAuth';
import { 
  Agendamento, 
  Prontuario, 
  Faturamento, 
  Mensagem,
  Paciente,
  Profissional
} from '@/types/api';

export interface UseWebSocketOptions {
  autoConnect?: boolean;
  autoReconnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (message: WebSocketMessage) => void;
  onNotification?: (notification: WebSocketNotification) => void;
}

export interface UseWebSocketReturn {
  // Status da conexão
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  connectionStatus: WebSocketConnectionStatus;
  
  // Métodos de conexão
  connect: (config?: Partial<WebSocketConfig>) => Promise<void>;
  disconnect: () => void;
  reconnect: () => void;
  
  // Métodos de comunicação
  sendMessage: (content: string, recipientId?: string) => void;
  sendNotification: (type: string, data: any, recipients?: string[]) => void;
  
  // Métodos de sala
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  
  // Métodos de inscrição
  subscribeToUpdates: (entity: string, id?: string) => void;
  unsubscribeFromUpdates: (entity: string, id?: string) => void;
  
  // Ping e status
  ping: () => Promise<number>;
  sendStatus: (status: 'online' | 'away' | 'busy' | 'offline') => void;
  sendTyping: (isTyping: boolean, recipientId?: string) => void;
  
  // Mensagens
  markMessageAsRead: (messageId: string) => void;
  requestMessageHistory: (recipientId: string, limit?: number) => void;
  
  // Notificações
  requestUnreadNotifications: () => void;
  markNotificationAsRead: (notificationId: string) => void;
  
  // Dashboard e estatísticas
  requestRealTimeStats: () => void;
  requestRealTimeDashboard: () => void;
  
  // Eventos específicos
  onPacienteCreated: (callback: (data: Paciente) => void) => void;
  onPacienteUpdated: (callback: (data: Paciente) => void) => void;
  onPacienteDeleted: (callback: (data: { id: string }) => void) => void;
  onProfissionalCreated: (callback: (data: Profissional) => void) => void;
  onProfissionalUpdated: (callback: (data: Profissional) => void) => void;
  onProfissionalDeleted: (callback: (data: { id: string }) => void) => void;
  onAgendamentoCreated: (callback: (data: Agendamento) => void) => void;
  onAgendamentoUpdated: (callback: (data: Agendamento) => void) => void;
  onAgendamentoCancelled: (callback: (data: { id: string; motivo: string }) => void) => void;
  onAgendamentoConfirmed: (callback: (data: { id: string }) => void) => void;
  onProntuarioCreated: (callback: (data: Prontuario) => void) => void;
  onProntuarioUpdated: (callback: (data: Prontuario) => void) => void;
  onProntuarioDeleted: (callback: (data: { id: string }) => void) => void;
  onFaturamentoCreated: (callback: (data: Faturamento) => void) => void;
  onFaturamentoUpdated: (callback: (data: Faturamento) => void) => void;
  onFaturamentoPaid: (callback: (data: { id: string; valor: number }) => void) => void;
  onMessageReceived: (callback: (data: Mensagem) => void) => void;
  onNotificationReceived: (callback: (data: WebSocketNotification) => void) => void;
  onSystemMaintenance: (callback: (data: { message: string; duration?: number }) => void) => void;
  onSystemUpdate: (callback: (data: { version: string; changes: string[] }) => void) => void;
  onTenantStatusChanged: (callback: (data: { active: boolean; reason?: string }) => void) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    autoConnect = true,
    autoReconnect = true,
    onConnect,
    onDisconnect,
    onError,
    onMessage,
    onNotification
  } = options;

  const { user, token, tenantId } = useAuth();
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<WebSocketConnectionStatus>(
    webSocketService.getConnectionStatus()
  );
  
  const eventListeners = useRef<Map<string, Function[]>>(new Map());

  // Atualizar status da conexão
  const updateConnectionStatus = useCallback(() => {
    setConnectionStatus(webSocketService.getConnectionStatus());
  }, []);

  // Configurar listeners de eventos
  const setupEventListeners = useCallback(() => {
    // Eventos de conexão
    webSocketService.on('connect', () => {
      updateConnectionStatus();
      onConnect?.();
      toast.success('Conectado ao servidor em tempo real');
    });

    webSocketService.on('disconnect', () => {
      updateConnectionStatus();
      onDisconnect?.();
      toast.warning('Desconectado do servidor');
    });

    webSocketService.on('connect_error', (error: Error) => {
      updateConnectionStatus();
      onError?.(error);
      toast.error('Erro de conexão com o servidor');
    });

    webSocketService.on('reconnect', () => {
      updateConnectionStatus();
      toast.success('Reconectado ao servidor');
    });

    // Eventos de pacientes
    webSocketService.on('paciente:created', (data: Paciente) => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['pacientes', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      const listeners = eventListeners.current.get('paciente:created');
      listeners?.forEach(callback => callback(data));
      
      toast.success(`Novo paciente cadastrado: ${data.nome}`);
    });

    webSocketService.on('paciente:updated', (data: Paciente) => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['paciente', data.id] });
      queryClient.invalidateQueries({ queryKey: ['pacientes', 'stats'] });
      
      const listeners = eventListeners.current.get('paciente:updated');
      listeners?.forEach(callback => callback(data));
      
      toast.info(`Paciente atualizado: ${data.nome}`);
    });

    webSocketService.on('paciente:deleted', (data: { id: string }) => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['pacientes', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      const listeners = eventListeners.current.get('paciente:deleted');
      listeners?.forEach(callback => callback(data));
      
      toast.warning('Paciente removido');
    });

    // Eventos de profissionais
    webSocketService.on('profissional:created', (data: Profissional) => {
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
      queryClient.invalidateQueries({ queryKey: ['profissionais', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      const listeners = eventListeners.current.get('profissional:created');
      listeners?.forEach(callback => callback(data));
      
      toast.success(`Novo profissional cadastrado: ${data.nome}`);
    });

    webSocketService.on('profissional:updated', (data: Profissional) => {
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
      queryClient.invalidateQueries({ queryKey: ['profissional', data.id] });
      queryClient.invalidateQueries({ queryKey: ['profissionais', 'stats'] });
      
      const listeners = eventListeners.current.get('profissional:updated');
      listeners?.forEach(callback => callback(data));
      
      toast.info(`Profissional atualizado: ${data.nome}`);
    });

    webSocketService.on('profissional:deleted', (data: { id: string }) => {
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
      queryClient.invalidateQueries({ queryKey: ['profissionais', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      const listeners = eventListeners.current.get('profissional:deleted');
      listeners?.forEach(callback => callback(data));
      
      toast.warning('Profissional removido');
    });

    // Eventos de agendamentos
    webSocketService.on('agendamento:created', (data: Agendamento) => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos', 'hoje'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      const listeners = eventListeners.current.get('agendamento:created');
      listeners?.forEach(callback => callback(data));
      
      toast.success(`Novo agendamento criado: ${data.paciente?.nome}`);
    });

    webSocketService.on('agendamento:updated', (data: Agendamento) => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agendamento', data.id] });
      
      const listeners = eventListeners.current.get('agendamento:updated');
      listeners?.forEach(callback => callback(data));
      
      toast.info(`Agendamento atualizado: ${data.paciente?.nome}`);
    });

    webSocketService.on('agendamento:cancelled', (data: { id: string; motivo: string }) => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agendamento', data.id] });
      
      const listeners = eventListeners.current.get('agendamento:cancelled');
      listeners?.forEach(callback => callback(data));
      
      toast.warning(`Agendamento cancelado: ${data.motivo}`);
    });

    webSocketService.on('agendamento:confirmed', (data: { id: string }) => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agendamento', data.id] });
      
      const listeners = eventListeners.current.get('agendamento:confirmed');
      listeners?.forEach(callback => callback(data));
      
      toast.success('Agendamento confirmado');
    });

    // Eventos de prontuários
    webSocketService.on('prontuario:created', (data: Prontuario) => {
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] });
      queryClient.invalidateQueries({ queryKey: ['prontuarios', 'hoje'] });
      
      const listeners = eventListeners.current.get('prontuario:created');
      listeners?.forEach(callback => callback(data));
      
      toast.success(`Novo prontuário criado: ${data.paciente?.nome}`);
    });

    webSocketService.on('prontuario:updated', (data: Prontuario) => {
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] });
      queryClient.invalidateQueries({ queryKey: ['prontuario', data.id] });
      
      const listeners = eventListeners.current.get('prontuario:updated');
      listeners?.forEach(callback => callback(data));
      
      toast.info(`Prontuário atualizado: ${data.paciente?.nome}`);
    });

    webSocketService.on('prontuario:deleted', (data: { id: string }) => {
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] });
      
      const listeners = eventListeners.current.get('prontuario:deleted');
      listeners?.forEach(callback => callback(data));
      
      toast.warning('Prontuário removido');
    });

    // Eventos de faturamento
    webSocketService.on('faturamento:created', (data: Faturamento) => {
      queryClient.invalidateQueries({ queryKey: ['faturamento'] });
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
      
      const listeners = eventListeners.current.get('faturamento:created');
      listeners?.forEach(callback => callback(data));
      
      toast.success(`Novo faturamento criado: R$ ${data.valor.toFixed(2)}`);
    });

    webSocketService.on('faturamento:updated', (data: Faturamento) => {
      queryClient.invalidateQueries({ queryKey: ['faturamento'] });
      queryClient.invalidateQueries({ queryKey: ['faturamento', data.id] });
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
      
      const listeners = eventListeners.current.get('faturamento:updated');
      listeners?.forEach(callback => callback(data));
      
      toast.info(`Faturamento atualizado: R$ ${data.valor.toFixed(2)}`);
    });

    webSocketService.on('faturamento:paid', (data: { id: string; valor: number }) => {
      queryClient.invalidateQueries({ queryKey: ['faturamento'] });
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
      
      const listeners = eventListeners.current.get('faturamento:paid');
      listeners?.forEach(callback => callback(data));
      
      toast.success(`Pagamento recebido: R$ ${data.valor.toFixed(2)}`);
    });

    // Eventos de mensagens
    webSocketService.on('message:received', (data: Mensagem) => {
      const listeners = eventListeners.current.get('message:received');
      listeners?.forEach(callback => callback(data));
      
      // Notificação de nova mensagem
      if (data.senderId !== user?.id) {
        toast.info(`Nova mensagem de ${data.senderName}`);
      }
    });

    // Eventos de notificações
    webSocketService.on('notification:received', (data: WebSocketNotification) => {
      const listeners = eventListeners.current.get('notification:received');
      listeners?.forEach(callback => callback(data));
      
      onNotification?.(data);
      
      // Mostrar notificação baseada no tipo
      switch (data.type) {
        case 'success':
          toast.success(data.message);
          break;
        case 'warning':
          toast.warning(data.message);
          break;
        case 'error':
          toast.error(data.message);
          break;
        default:
          toast.info(data.message);
      }
    });

    // Eventos de sistema
    webSocketService.on('system:maintenance', (data: { message: string; duration?: number }) => {
      const listeners = eventListeners.current.get('system:maintenance');
      listeners?.forEach(callback => callback(data));
      
      toast.warning(`Manutenção: ${data.message}`);
    });

    webSocketService.on('system:update', (data: { version: string; changes: string[] }) => {
      const listeners = eventListeners.current.get('system:update');
      listeners?.forEach(callback => callback(data));
      
      toast.info(`Atualização disponível: v${data.version}`);
    });

    webSocketService.on('tenant:status_changed', (data: { active: boolean; reason?: string }) => {
      const listeners = eventListeners.current.get('tenant:status_changed');
      listeners?.forEach(callback => callback(data));
      
      if (!data.active) {
        toast.error(`Clínica inativa: ${data.reason || 'Motivo não informado'}`);
      } else {
        toast.success('Clínica reativada');
      }
    });
  }, [queryClient, user?.id, onConnect, onDisconnect, onError, onNotification, updateConnectionStatus]);

  // Conectar automaticamente
  useEffect(() => {
    if (autoConnect && token && tenantId && user?.id) {
      const config: WebSocketConfig = {
        url: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
        token,
        tenantId,
        userId: user.id
      };
      
      webSocketService.connect(config).catch(console.error);
    }
  }, [autoConnect, token, tenantId, user?.id]);

  // Configurar listeners
  useEffect(() => {
    setupEventListeners();
    
    return () => {
      // Limpar listeners ao desmontar
      eventListeners.current.clear();
    };
  }, [setupEventListeners]);

  // Limpar ao desmontar
  useEffect(() => {
    return () => {
      if (!autoReconnect) {
        webSocketService.disconnect();
      }
    };
  }, [autoReconnect]);

  // Função para registrar callbacks de eventos
  const registerEventCallback = useCallback((event: string, callback: Function) => {
    if (!eventListeners.current.has(event)) {
      eventListeners.current.set(event, []);
    }
    eventListeners.current.get(event)!.push(callback);
  }, []);

  return {
    // Status da conexão
    isConnected: connectionStatus.isConnected,
    isConnecting: connectionStatus.isConnecting,
    isReconnecting: connectionStatus.isReconnecting,
    connectionStatus,
    
    // Métodos de conexão
    connect: useCallback(async (config?: Partial<WebSocketConfig>) => {
      const fullConfig: WebSocketConfig = {
        url: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
        token: token!,
        tenantId: tenantId!,
        userId: user!.id,
        ...config
      };
      await webSocketService.connect(fullConfig);
    }, [token, tenantId, user]),
    
    disconnect: useCallback(() => {
      webSocketService.disconnect();
    }, []),
    
    reconnect: useCallback(() => {
      webSocketService.reconnect();
    }, []),
    
    // Métodos de comunicação
    sendMessage: useCallback((content: string, recipientId?: string) => {
      webSocketService.sendMessage(content, recipientId);
    }, []),
    
    sendNotification: useCallback((type: string, data: any, recipients?: string[]) => {
      webSocketService.sendNotification(type, data, recipients);
    }, []),
    
    // Métodos de sala
    joinRoom: useCallback((room: string) => {
      webSocketService.joinRoom(room);
    }, []),
    
    leaveRoom: useCallback((room: string) => {
      webSocketService.leaveRoom(room);
    }, []),
    
    // Métodos de inscrição
    subscribeToUpdates: useCallback((entity: string, id?: string) => {
      webSocketService.subscribeToUpdates(entity, id);
    }, []),
    
    unsubscribeFromUpdates: useCallback((entity: string, id?: string) => {
      webSocketService.unsubscribeFromUpdates(entity, id);
    }, []),
    
    // Ping e status
    ping: useCallback(() => webSocketService.ping(), []),
    sendStatus: useCallback((status: 'online' | 'away' | 'busy' | 'offline') => {
      webSocketService.sendStatus(status);
    }, []),
    sendTyping: useCallback((isTyping: boolean, recipientId?: string) => {
      webSocketService.sendTyping(isTyping, recipientId);
    }, []),
    
    // Mensagens
    markMessageAsRead: useCallback((messageId: string) => {
      webSocketService.markMessageAsRead(messageId);
    }, []),
    requestMessageHistory: useCallback((recipientId: string, limit: number = 50) => {
      webSocketService.requestMessageHistory(recipientId, limit);
    }, []),
    
    // Notificações
    requestUnreadNotifications: useCallback(() => {
      webSocketService.requestUnreadNotifications();
    }, []),
    markNotificationAsRead: useCallback((notificationId: string) => {
      webSocketService.markNotificationAsRead(notificationId);
    }, []),
    
    // Dashboard e estatísticas
    requestRealTimeStats: useCallback(() => {
      webSocketService.requestRealTimeStats();
    }, []),
    requestRealTimeDashboard: useCallback(() => {
      webSocketService.requestRealTimeDashboard();
    }, []),
    
    // Eventos específicos
    onPacienteCreated: useCallback((callback: (data: Paciente) => void) => {
      registerEventCallback('paciente:created', callback);
    }, [registerEventCallback]),
    
    onPacienteUpdated: useCallback((callback: (data: Paciente) => void) => {
      registerEventCallback('paciente:updated', callback);
    }, [registerEventCallback]),
    
    onPacienteDeleted: useCallback((callback: (data: { id: string }) => void) => {
      registerEventCallback('paciente:deleted', callback);
    }, [registerEventCallback]),
    
    onProfissionalCreated: useCallback((callback: (data: Profissional) => void) => {
      registerEventCallback('profissional:created', callback);
    }, [registerEventCallback]),
    
    onProfissionalUpdated: useCallback((callback: (data: Profissional) => void) => {
      registerEventCallback('profissional:updated', callback);
    }, [registerEventCallback]),
    
    onProfissionalDeleted: useCallback((callback: (data: { id: string }) => void) => {
      registerEventCallback('profissional:deleted', callback);
    }, [registerEventCallback]),
    
    onAgendamentoCreated: useCallback((callback: (data: Agendamento) => void) => {
      registerEventCallback('agendamento:created', callback);
    }, [registerEventCallback]),
    
    onAgendamentoUpdated: useCallback((callback: (data: Agendamento) => void) => {
      registerEventCallback('agendamento:updated', callback);
    }, [registerEventCallback]),
    
    onAgendamentoCancelled: useCallback((callback: (data: { id: string; motivo: string }) => void) => {
      registerEventCallback('agendamento:cancelled', callback);
    }, [registerEventCallback]),
    
    onAgendamentoConfirmed: useCallback((callback: (data: { id: string }) => void) => {
      registerEventCallback('agendamento:confirmed', callback);
    }, [registerEventCallback]),
    
    onProntuarioCreated: useCallback((callback: (data: Prontuario) => void) => {
      registerEventCallback('prontuario:created', callback);
    }, [registerEventCallback]),
    
    onProntuarioUpdated: useCallback((callback: (data: Prontuario) => void) => {
      registerEventCallback('prontuario:updated', callback);
    }, [registerEventCallback]),
    
    onProntuarioDeleted: useCallback((callback: (data: { id: string }) => void) => {
      registerEventCallback('prontuario:deleted', callback);
    }, [registerEventCallback]),
    
    onFaturamentoCreated: useCallback((callback: (data: Faturamento) => void) => {
      registerEventCallback('faturamento:created', callback);
    }, [registerEventCallback]),
    
    onFaturamentoUpdated: useCallback((callback: (data: Faturamento) => void) => {
      registerEventCallback('faturamento:updated', callback);
    }, [registerEventCallback]),
    
    onFaturamentoPaid: useCallback((callback: (data: { id: string; valor: number }) => void) => {
      registerEventCallback('faturamento:paid', callback);
    }, [registerEventCallback]),
    
    onMessageReceived: useCallback((callback: (data: Mensagem) => void) => {
      registerEventCallback('message:received', callback);
    }, [registerEventCallback]),
    
    onNotificationReceived: useCallback((callback: (data: WebSocketNotification) => void) => {
      registerEventCallback('notification:received', callback);
    }, [registerEventCallback]),
    
    onSystemMaintenance: useCallback((callback: (data: { message: string; duration?: number }) => void) => {
      registerEventCallback('system:maintenance', callback);
    }, [registerEventCallback]),
    
    onSystemUpdate: useCallback((callback: (data: { version: string; changes: string[] }) => void) => {
      registerEventCallback('system:update', callback);
    }, [registerEventCallback]),
    
    onTenantStatusChanged: useCallback((callback: (data: { active: boolean; reason?: string }) => void) => {
      registerEventCallback('tenant:status_changed', callback);
    }, [registerEventCallback]),
  };
}; 
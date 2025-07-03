import { io, Socket } from 'socket.io-client';
import { Mensagem, Agendamento, Prontuario, Faturamento, Paciente, Profissional } from '@/types/api';

export interface WebSocketConfig {
  url: string;
  token: string;
  tenantId: string;
  userId: string;
}

export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: string;
}

export interface WebSocketMessage {
  type: 'message' | 'notification' | 'update' | 'delete' | 'create';
  data: any;
  senderId?: string;
  senderName?: string;
  senderRole?: string;
}

export interface WebSocketConnectionStatus {
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  lastConnected?: Date;
  connectionAttempts: number;
  lastError?: string;
}

export interface WebSocketNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  data?: any;
  timestamp: string;
  read: boolean;
}

class WebSocketService {
  private socket: Socket | null = null;
  private config: WebSocketConfig | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private connectionStatus: WebSocketConnectionStatus = {
    isConnected: false,
    isConnecting: false,
    isReconnecting: false,
    connectionAttempts: 0
  };
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;

  // Conectar ao WebSocket
  connect(config: WebSocketConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.config = config;
      this.connectionStatus.isConnecting = true;
      this.connectionStatus.connectionAttempts++;

      this.socket = io(config.url, {
        auth: {
          token: config.token,
          tenantId: config.tenantId,
          userId: config.userId
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: this.maxReconnectAttempts,
        forceNew: true
      });

      this.socket.on('connect', () => {
        this.connectionStatus.isConnected = true;
        this.connectionStatus.isConnecting = false;
        this.connectionStatus.isReconnecting = false;
        this.connectionStatus.lastConnected = new Date();
        this.connectionStatus.connectionAttempts = 0;
        this.connectionStatus.lastError = undefined;
        
        console.log('🔌 WebSocket conectado');
        this.emit('join', { tenantId: config.tenantId, userId: config.userId });
        this.startHeartbeat();
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        this.connectionStatus.isConnected = false;
        this.connectionStatus.isConnecting = false;
        this.stopHeartbeat();
        console.log('🔌 WebSocket desconectado:', reason);
        
        if (reason === 'io server disconnect') {
          // Desconexão iniciada pelo servidor
          this.reconnect();
        }
      });

      this.socket.on('connect_error', (error) => {
        this.connectionStatus.isConnected = false;
        this.connectionStatus.isConnecting = false;
        this.connectionStatus.lastError = error.message;
        console.error('❌ Erro de conexão WebSocket:', error);
        reject(error);
      });

      this.socket.on('reconnect', (attemptNumber) => {
        this.connectionStatus.isConnected = true;
        this.connectionStatus.isReconnecting = false;
        this.connectionStatus.lastConnected = new Date();
        this.connectionStatus.lastError = undefined;
        console.log(`🔌 WebSocket reconectado na tentativa ${attemptNumber}`);
        
        if (this.config) {
          this.emit('join', { tenantId: this.config.tenantId, userId: this.config.userId });
        }
        this.startHeartbeat();
      });

      this.socket.on('reconnect_attempt', (attemptNumber) => {
        this.connectionStatus.isReconnecting = true;
        console.log(`🔄 Tentativa de reconexão WebSocket: ${attemptNumber}`);
      });

      this.socket.on('reconnect_error', (error) => {
        this.connectionStatus.lastError = error.message;
        console.error('❌ Erro na reconexão WebSocket:', error);
      });

      this.socket.on('reconnect_failed', () => {
        this.connectionStatus.isReconnecting = false;
        this.connectionStatus.lastError = 'Falha na reconexão';
        console.error('❌ Falha na reconexão WebSocket');
      });

      // Configurar listeners para eventos específicos
      this.setupEventListeners();
    });
  }

  // Desconectar do WebSocket
  disconnect(): void {
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus.isConnected = false;
      this.connectionStatus.isConnecting = false;
      this.connectionStatus.isReconnecting = false;
      console.log('🔌 WebSocket desconectado manualmente');
    }
  }

  // Enviar mensagem
  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ WebSocket não conectado, não foi possível enviar mensagem');
    }
  }

  // Enviar mensagem de chat
  sendMessage(content: string, recipientId?: string): void {
    this.emit('message', {
      content,
      recipientId,
      timestamp: new Date().toISOString()
    });
  }

  // Enviar notificação
  sendNotification(type: string, data: any, recipients?: string[]): void {
    this.emit('notification', {
      type,
      data,
      recipients,
      timestamp: new Date().toISOString()
    });
  }

  // Adicionar listener para evento
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remover listener para evento
  off(event: string, callback?: Function): void {
    if (callback) {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
      if (this.socket) {
        this.socket.off(event, callback);
      }
    } else {
      this.eventListeners.delete(event);
      if (this.socket) {
        this.socket.off(event);
      }
    }
  }

  // Obter status da conexão
  getConnectionStatus(): WebSocketConnectionStatus {
    return { ...this.connectionStatus };
  }

  // Reconectar manualmente
  reconnect(): void {
    if (this.config && !this.connectionStatus.isConnecting) {
      console.log('🔄 Iniciando reconexão manual...');
      this.connect(this.config);
    }
  }

  // Iniciar heartbeat
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('ping');
      }
    }, 30000); // 30 segundos
  }

  // Parar heartbeat
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Configurar listeners de eventos específicos
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Eventos de sistema
    this.socket.on('pong', () => {
      console.log('🏓 Pong recebido');
    });

    this.socket.on('error', (error) => {
      console.error('❌ Erro WebSocket:', error);
      this.triggerEvent('error', error);
    });

    // Eventos de entidades
    this.socket.on('paciente:created', (data: Paciente) => {
      this.triggerEvent('paciente:created', data);
    });

    this.socket.on('paciente:updated', (data: Paciente) => {
      this.triggerEvent('paciente:updated', data);
    });

    this.socket.on('paciente:deleted', (data: { id: string }) => {
      this.triggerEvent('paciente:deleted', data);
    });

    this.socket.on('profissional:created', (data: Profissional) => {
      this.triggerEvent('profissional:created', data);
    });

    this.socket.on('profissional:updated', (data: Profissional) => {
      this.triggerEvent('profissional:updated', data);
    });

    this.socket.on('profissional:deleted', (data: { id: string }) => {
      this.triggerEvent('profissional:deleted', data);
    });

    this.socket.on('agendamento:created', (data: Agendamento) => {
      this.triggerEvent('agendamento:created', data);
    });

    this.socket.on('agendamento:updated', (data: Agendamento) => {
      this.triggerEvent('agendamento:updated', data);
    });

    this.socket.on('agendamento:cancelled', (data: { id: string; motivo: string }) => {
      this.triggerEvent('agendamento:cancelled', data);
    });

    this.socket.on('agendamento:confirmed', (data: { id: string }) => {
      this.triggerEvent('agendamento:confirmed', data);
    });

    this.socket.on('prontuario:created', (data: Prontuario) => {
      this.triggerEvent('prontuario:created', data);
    });

    this.socket.on('prontuario:updated', (data: Prontuario) => {
      this.triggerEvent('prontuario:updated', data);
    });

    this.socket.on('prontuario:deleted', (data: { id: string }) => {
      this.triggerEvent('prontuario:deleted', data);
    });

    this.socket.on('faturamento:created', (data: Faturamento) => {
      this.triggerEvent('faturamento:created', data);
    });

    this.socket.on('faturamento:updated', (data: Faturamento) => {
      this.triggerEvent('faturamento:updated', data);
    });

    this.socket.on('faturamento:paid', (data: { id: string; valor: number }) => {
      this.triggerEvent('faturamento:paid', data);
    });

    this.socket.on('message:received', (data: Mensagem) => {
      this.triggerEvent('message:received', data);
    });

    this.socket.on('notification:received', (data: WebSocketNotification) => {
      this.triggerEvent('notification:received', data);
    });

    // Eventos de sistema
    this.socket.on('system:maintenance', (data: { message: string; duration?: number }) => {
      this.triggerEvent('system:maintenance', data);
    });

    this.socket.on('system:update', (data: { version: string; changes: string[] }) => {
      this.triggerEvent('system:update', data);
    });

    this.socket.on('tenant:status_changed', (data: { active: boolean; reason?: string }) => {
      this.triggerEvent('tenant:status_changed', data);
    });
  }

  // Disparar evento para todos os listeners
  private triggerEvent(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Erro no listener do evento ${event}:`, error);
        }
      });
    }
  }

  // Entrar em uma sala
  joinRoom(room: string): void {
    this.emit('join_room', { room });
  }

  // Sair de uma sala
  leaveRoom(room: string): void {
    this.emit('leave_room', { room });
  }

  // Inscrever-se em atualizações de uma entidade
  subscribeToUpdates(entity: string, id?: string): void {
    this.emit('subscribe', { entity, id });
  }

  // Cancelar inscrição em atualizações de uma entidade
  unsubscribeFromUpdates(entity: string, id?: string): void {
    this.emit('unsubscribe', { entity, id });
  }

  // Ping para verificar latência
  ping(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('WebSocket não conectado'));
        return;
      }

      const start = Date.now();
      this.socket!.emit('ping', {}, () => {
        const latency = Date.now() - start;
        resolve(latency);
      });

      // Timeout após 5 segundos
      setTimeout(() => {
        reject(new Error('Timeout no ping'));
      }, 5000);
    });
  }

  // Enviar mensagem de status
  sendStatus(status: 'online' | 'away' | 'busy' | 'offline'): void {
    this.emit('status', { status, timestamp: new Date().toISOString() });
  }

  // Enviar mensagem de digitação
  sendTyping(isTyping: boolean, recipientId?: string): void {
    this.emit('typing', { isTyping, recipientId, timestamp: new Date().toISOString() });
  }

  // Marcar mensagem como lida
  markMessageAsRead(messageId: string): void {
    this.emit('mark_read', { messageId, timestamp: new Date().toISOString() });
  }

  // Solicitar histórico de mensagens
  requestMessageHistory(recipientId: string, limit: number = 50): void {
    this.emit('get_history', { recipientId, limit });
  }

  // Solicitar notificações não lidas
  requestUnreadNotifications(): void {
    this.emit('get_unread_notifications');
  }

  // Marcar notificação como lida
  markNotificationAsRead(notificationId: string): void {
    this.emit('mark_notification_read', { notificationId });
  }

  // Solicitar estatísticas em tempo real
  requestRealTimeStats(): void {
    this.emit('get_realtime_stats');
  }

  // Solicitar dashboard em tempo real
  requestRealTimeDashboard(): void {
    this.emit('get_realtime_dashboard');
  }
}

// Instância singleton do serviço
const webSocketService = new WebSocketService();

// Exportações
export { webSocketService };

// Funções de conveniência
export const connectWebSocket = (config: WebSocketConfig) => webSocketService.connect(config);
export const disconnectWebSocket = () => webSocketService.disconnect();
export const sendWebSocketMessage = (content: string, recipientId?: string) => webSocketService.sendMessage(content, recipientId);
export const getWebSocketStatus = () => webSocketService.getConnectionStatus();
export const webSocketPing = () => webSocketService.ping();
export const sendWebSocketNotification = (type: string, data: any, recipients?: string[]) => webSocketService.sendNotification(type, data, recipients);
export const joinWebSocketRoom = (room: string) => webSocketService.joinRoom(room);
export const leaveWebSocketRoom = (room: string) => webSocketService.leaveRoom(room);
export const subscribeToWebSocketUpdates = (entity: string, id?: string) => webSocketService.subscribeToUpdates(entity, id);
export const unsubscribeFromWebSocketUpdates = (entity: string, id?: string) => webSocketService.unsubscribeFromUpdates(entity, id); 
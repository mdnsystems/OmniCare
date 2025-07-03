import { Server as HTTPServer } from 'http';
export declare class WebSocketService {
    private io;
    private userSockets;
    private userTenants;
    private typingUsers;
    constructor(server: HTTPServer);
    private setupMiddleware;
    private setupEventHandlers;
    private handleConnection;
    private handleDisconnection;
    private handleJoin;
    private joinGeneralChat;
    private handleChatEvents;
    private handleMessageEvents;
    private handleFileEvents;
    private handleNotificationEvents;
    private handlePing;
    private getChatWithParticipants;
    private getMensagemCompleta;
    private formatMensagem;
    private formatChat;
    private criarNotificacoes;
    private broadcastUserStatus;
    private getUserTenantId;
    isConnected(): boolean;
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '@/contexts/socket-context';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Search,
  Wifi, 
  WifiOff,
  ArrowLeft,
  MoreVertical,
  Plus,
  Phone,
  Video,
  Paperclip,
  Smile,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { buscarOuCriarChatPrivado, getChats } from '@/services/chat.service';
import { useUsuariosAtivos } from '@/hooks/useUsuarios';
import { useChatNotifications } from '@/hooks/useChatNotifications';
import { useUserStatus } from '@/hooks/useUserStatus';
import { ChatNotification } from '@/components/chat-notification';
import { useTheme } from '@/components/theme-provider';
import chatLight from '@/assets/chat-light.jpg';
import chatDark from '@/assets/chat-dark.png';
import { Usuario } from '@/types/api';

interface Conversation {
  id: string;
  contact: Usuario | null;
  lastMessage: { content: string; timestamp: string } | null | undefined;
  unreadCount: number;
  timestamp: string | undefined;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  timestamp: string;
  chatId?: string;
}

export default function ChatPage() {
  const { socket, isConnected, messages, generalChatId, sendMessage, sendTyping, setOnPrivateMessage, setOnChatUpdate, setOnUserTyping } = useSocket();
  const { user } = useAuth();
  const { clearNotifications } = useChatNotifications();
  const { isUserOnline } = useUserStatus();
  const { theme } = useTheme();
  const [message, setMessage] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<Usuario | null>(null);
  const [selectedChat, setSelectedChat] = useState<{ id: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [privateTypingUsers, setPrivateTypingUsers] = useState<Set<string>>(new Set());
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: usuarios, isLoading: isLoadingUsuarios } = useUsuariosAtivos();

  // Filtrar mensagens do chat geral (não privado)
  const safeMessages = messages.filter(msg => !msg.chatId || msg.chatId === generalChatId);

  // Configurar handlers de WebSocket
  useEffect(() => {
    if (socket) {
      setOnPrivateMessage((data: Message) => {
        console.log('📨 [Chat] Mensagem privada recebida:', data);
        if (data && selectedChat && data.chatId === selectedChat.id) {
          setChatMessages(prev => [...prev, data]);
        }
      });

      setOnChatUpdate((chatId: string, data: unknown) => {
        console.log('🔄 [Chat] Atualização de chat recebida:', { chatId, data });
        loadConversations();
      });

      setOnUserTyping((data: { userId: string; chatId: string; isTyping: boolean }) => {
        console.log('⌨️ [Chat] Usuário digitando:', data);
        if (data && selectedChat && data.chatId === selectedChat.id) {
          if (data.isTyping && data.userId) {
            setPrivateTypingUsers(prev => new Set(prev).add(data.userId));
          } else if (data.userId) {
            setPrivateTypingUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(data.userId);
              return newSet;
            });
          }
        }
      });
    }
  }, [socket, selectedChat, setOnPrivateMessage, setOnChatUpdate, setOnUserTyping]);

  // Carregar conversas
  const loadConversations = useCallback(async () => {
    try {
      console.log('📋 [Chat] Carregando conversas...');
      const chats = await getChats();
      
      if (!Array.isArray(chats)) {
        console.error('❌ [Chat] Chats não é um array:', chats);
        setConversations([]);
        return;
      }
      
      const conversationsData = chats
        .filter((chat: unknown) => chat && typeof chat === 'object' && chat !== null && 'participantes' in chat && Array.isArray((chat as { participantes: unknown[] }).participantes))
        .map((chat: unknown) => {
          const chatObj = chat as { 
            id: string;
            participantes: Array<{ userId: string; usuario?: Usuario }>;
            ultimaMensagem?: { content: string; timestamp: string };
            naoLidas?: number;
            updatedAt?: string;
          };
          const otherParticipant = chatObj.participantes.find((p) => p.userId !== user?.id);
          return {
            id: chatObj.id,
            contact: otherParticipant?.usuario || null,
            lastMessage: chatObj.ultimaMensagem,
            unreadCount: chatObj.naoLidas || 0,
            timestamp: chatObj.ultimaMensagem?.timestamp || chatObj.updatedAt
          };
        })
        .filter((conv) => conv.contact); // Filtrar conversas sem contato
      
      console.log('📋 [Chat] Conversas carregadas:', conversationsData.length);
      setConversations(conversationsData);
    } catch (error) {
      console.error('❌ [Chat] Erro ao carregar conversas:', error);
      setConversations([]);
    }
  }, [user?.id]);

  // Carregar conversas inicialmente
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Auto-scroll para mensagens
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [safeMessages.length, chatMessages.length]);

  // Handler para envio de mensagem
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;

    if (selectedChat) {
      // Para chat privado
      if (socket && selectedChat.id) {
        console.log('📤 [Chat] Enviando mensagem privada:', {
          chatId: selectedChat.id,
          content: message.trim()
        });
        
        socket.emit('privateMessage', {
          chatId: selectedChat.id,
          content: message.trim()
        });

        // Adicionar mensagem localmente para feedback imediato
        const novaMensagem: Message = {
          id: `temp-${Date.now()}`,
          content: message.trim(),
          senderId: user?.id || '',
          senderName: user?.email || '',
          senderRole: user?.role || '',
          timestamp: new Date().toISOString(),
          chatId: selectedChat.id
        };

        setChatMessages(prev => [...prev, novaMensagem]);
      }
    } else {
      // Para chat geral
      sendMessage(message.trim());
    }

    setMessage('');
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  // Handler para mudança no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Indicador de digitação
    if (selectedChat) {
      // Para chat privado
      if (socket && selectedChat.id) {
        socket.emit('typing', { chatId: selectedChat.id, isTyping: true });
      }
    } else {
      // Para chat geral
      sendTyping(true);
    }

    // Limpar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Definir novo timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (selectedChat) {
        // Para chat privado
        if (socket && selectedChat.id) {
          socket.emit('typing', { chatId: selectedChat.id, isTyping: false });
        }
      } else {
        // Para chat geral
        sendTyping(false);
      }
    }, 1000);
  };

  // Handler para seleção de contato
  const handleSelectContact = useCallback(async (contact: Usuario) => {
    console.log('🔍 Debug handleSelectContact:', { contact });
    setSelectedContact(contact);
    setShowNewChat(false);
    
    try {
      console.log('📞 Buscando chat privado para usuário:', contact.id);
      const response = await buscarOuCriarChatPrivado(contact.id);
      console.log('✅ Resposta da API:', response);
      
      // Extrair dados da resposta
      const chat = response.data || response;
      
      if (!chat || !chat.id) {
        console.error('❌ Chat inválido retornado:', chat);
        alert('Erro ao criar chat privado. Tente novamente.');
        return;
      }
      
      console.log('✅ Chat encontrado/criado:', chat);
      setSelectedChat(chat);
      
      // Inicializar mensagens do chat
      const mensagensIniciais = chat.mensagens ? [...chat.mensagens].reverse() : [];
      console.log('📚 Mensagens iniciais do chat:', mensagensIniciais);
      setChatMessages(mensagensIniciais);
      
      // Entrar no chat privado via WebSocket
      if (socket && chat.id) {
        console.log('🔗 Entrando no chat privado:', chat.id);
        socket.emit('joinChat', { chatId: chat.id });
      }
      
    } catch (err) {
      console.error('❌ Erro ao abrir chat privado:', err);
      alert('Erro ao abrir chat privado');
    }
  }, [socket]);

  // Handler para clique em conversa
  const handleConversationClick = async (conversation: Conversation) => {
    try {
      console.log('🔍 [Chat] Clique em conversa:', conversation);
      
      // Buscar o contato da conversa
      const contact = conversation.contact;
      if (!contact) {
        console.error('❌ [Chat] Contato não encontrado na conversa');
        return;
      }
      
      setSelectedContact(contact);
      setSelectedChat({ id: conversation.id });
      
      // Buscar chat completo para obter mensagens
      try {
        const response = await buscarOuCriarChatPrivado(contact.id);
        const chat = response.data || response;
        
        if (chat && chat.mensagens) {
          const mensagensIniciais = [...chat.mensagens].reverse();
          console.log('📚 [Chat] Mensagens carregadas:', mensagensIniciais.length);
          setChatMessages(mensagensIniciais);
        } else {
          setChatMessages([]);
        }
      } catch (error) {
        console.error('❌ [Chat] Erro ao carregar mensagens:', error);
        setChatMessages([]);
      }
      
      // Entrar no chat via WebSocket
      if (socket && conversation.id) {
        console.log('🔗 [Chat] Entrando no chat:', conversation.id);
        socket.emit('joinChat', { chatId: conversation.id });
      }
      
      // Limpar notificações
      clearNotifications();
      
    } catch (error) {
      console.error('❌ [Chat] Erro ao abrir conversa:', error);
    }
  };

  // Filtrar conversas baseado no termo de busca
  const filteredConversations = conversations.filter(conv => 
    conv.contact?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar usuários para novo chat
  const filteredUsers = usuarios?.filter(u => 
    u.id !== user?.id && 
    (u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'PROFISSIONAL': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'RECEPCIONISTA': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'PROFISSIONAL': return 'Profissional';
      case 'RECEPCIONISTA': return 'Recepcionista';
      default: return role;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar - Lista de Conversas */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header da Sidebar */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Conversas</h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNewChat(true)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Barra de Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de Conversas */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {showNewChat ? (
              // Lista de usuários para novo chat
              <div className="p-1">
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowNewChat(false)}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">Nova conversa</span>
                </div>

                {isLoadingUsuarios ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  filteredUsers.map((usuario) => (
                    <div
                      key={usuario.id}
                      onClick={() => handleSelectContact(usuario)}
                      className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer rounded-lg"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={usuario.fotoPerfil} />
                        <AvatarFallback>
                          {usuario.nome?.charAt(0) || usuario.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {usuario.nome || usuario.email}
                          </p>
                          <Badge 
                            className={`text-xs ${getRoleColor(usuario.role)}`}
                          >
                            {getRoleLabel(usuario.role)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {usuario.email}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              // Lista de conversas existentes
              <div className="p-1">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm">Nenhuma conversa encontrada</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowNewChat(true)}
                      className="mt-2"
                    >
                      Iniciar conversa
                    </Button>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation)}
                      className={`flex items-center gap-2 p-2 hover:bg-accent cursor-pointer rounded-lg ${
                        selectedChat?.id === conversation.id ? 'bg-accent/50' : ''
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.contact?.fotoPerfil} />
                          <AvatarFallback>
                            {conversation.contact?.nome?.charAt(0) || conversation.contact?.email.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.unreadCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {conversation.contact?.nome || conversation.contact?.email}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {conversation.timestamp ? format(new Date(conversation.timestamp), 'HH:mm', { locale: ptBR }) : ''}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage?.content || 'Nenhuma mensagem'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Área Principal - Conversa Ativa */}
      <div 
        className="flex-1 flex flex-col relative"
        style={{
          backgroundImage: `url(${theme === 'dark' ? chatDark : chatLight})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay sutil para melhorar legibilidade */}
        <div className={`absolute inset-0 backdrop-blur-[1px] ${
          theme === 'dark' ? 'bg-background/40' : 'bg-background/20'
        }`} />
        <div className="relative z-10 flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Header da Conversa */}
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedContact(null);
                    setSelectedChat(null);
                    setChatMessages([]);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={selectedContact?.fotoPerfil} />
                  <AvatarFallback>
                    {selectedContact?.nome?.charAt(0) || selectedContact?.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedContact?.nome || selectedContact?.email}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`text-xs ${getRoleColor(selectedContact?.role)}`}
                    >
                      {getRoleLabel(selectedContact?.role)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {isUserOnline(selectedContact.id) ? (
                        <Wifi className="h-3 w-3 text-green-500" />
                      ) : (
                        <WifiOff className="h-3 w-3 text-red-500" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {isUserOnline(selectedContact.id) ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Video className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Área de Mensagens */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea ref={scrollRef} className="h-full p-3">
                <div className="space-y-3">
                  {selectedChat ? (
                    // Mensagens do chat privado
                    chatMessages.map((msg, index) => (
                      <div
                        key={msg.id || index}
                        className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.senderId === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.senderId === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {format(new Date(msg.timestamp), 'HH:mm', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Mensagens do chat geral
                    safeMessages.map((msg, index) => (
                      <div
                        key={msg.id || index}
                        className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.senderId === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.senderId === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {format(new Date(msg.timestamp), 'HH:mm', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Indicador de digitação */}
                  {privateTypingUsers.size > 0 && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg">
                        <p className="text-sm">Digitando...</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Área de Input */}
            <div className="p-3 border-t border-border">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={message}
                  onChange={handleInputChange}
                  placeholder="Digite uma mensagem..."
                  className="flex-1"
                  // disabled={!isConnected}
                />
                <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button type="submit" size="sm" disabled={!message.trim() || !isConnected}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          // Estado vazio - nenhuma conversa selecionada
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Selecione uma conversa
              </h3>
              <p className="text-muted-foreground mb-4">
                Escolha uma conversa da lista ou inicie uma nova
              </p>
              <Button onClick={() => setShowNewChat(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova conversa
              </Button>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Componente de Notificação */}
      <ChatNotification position="top-right" />
    </div>
  );
} 
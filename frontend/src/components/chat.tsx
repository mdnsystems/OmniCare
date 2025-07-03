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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  MessageCircle, 
  Send, 
  Search,
  Wifi, 
  WifiOff,
  X,
  MoreVertical,
  UserPlus,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChatContacts } from './chat-contacts';
import { buscarOuCriarChatPrivado, getChats } from '@/services/chat.service';

interface ChatProps {
  isModal?: boolean;
  selectedContact?: any;
  onClose?: () => void;
  onSelectContact?: (contact: any) => void;
}

interface Conversation {
  id: string;
  contact: any;
  lastMessage?: any;
  unreadCount: number;
  timestamp: Date;
}

export function Chat({ isModal = false, selectedContact: initialContact, onClose, onSelectContact }: ChatProps) {
  const { socket, isConnected, messages, generalChatId, sendMessage, sendTyping, setOnPrivateMessage, setOnChatUpdate, setOnUserTyping } = useSocket();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(initialContact);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [privateTypingUsers, setPrivateTypingUsers] = useState<Set<string>>(new Set());
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filtrar mensagens do chat geral (não privado)
  const safeMessages = messages.filter(msg => !msg.chatId || msg.chatId === generalChatId);

  // Configurar callbacks do WebSocket para mensagens privadas
  useEffect(() => {
    // Callback para mensagens privadas
    setOnPrivateMessage((message: any) => {
      // Verificar se a mensagem é válida
      if (!message || typeof message !== 'object') {
        console.warn('⚠️ [Chat] Mensagem inválida recebida:', message);
        return;
      }

      console.log('📨 [Chat] Mensagem privada recebida via callback:', {
        message,
        selectedChatId: selectedChat?.id,
        messageChatId: message?.chatId
      });
      
      // Se é uma mensagem do chat privado atual, adicionar à lista
      if (selectedChat && selectedChat.id && message.chatId && message.chatId === selectedChat.id) {
        console.log('✅ [Chat] Adicionando mensagem ao chat privado atual:', message);
        setChatMessages(prev => {
          const newMessages = [...prev, message];
          console.log('📝 [Chat] Novas mensagens do chat privado:', newMessages);
          return newMessages;
        });
      }
      
      // Não chamar loadConversations aqui para evitar loops
      // A lista será atualizada quando o usuário voltar para a tela de conversas
    });

    // Callback para atualizações de chat
    setOnChatUpdate((chatId: string, data: any) => {
      // Verificar se os parâmetros são válidos
      if (!chatId || typeof chatId !== 'string') {
        console.warn('⚠️ [Chat] ChatId inválido recebido:', chatId);
        return;
      }

      console.log('🔄 [Chat] Chat atualizado via callback:', { chatId, data });
      if (selectedChat && selectedChat.id === chatId) {
        setSelectedChat(prev => ({ ...prev, ...data }));
      }
      // Não chamar loadConversations aqui para evitar loops
    });

    // Callback para usuário digitando
    setOnUserTyping((data: any) => {
      // Verificar se os dados são válidos
      if (!data || typeof data !== 'object') {
        console.warn('⚠️ [Chat] Dados de digitação inválidos:', data);
        return;
      }

      console.log('⌨️ [Chat] Usuário digitando via callback:', data);
      if (data.chatId && selectedChat && data.chatId === selectedChat.id) {
        if (data.isTyping) {
          setPrivateTypingUsers(prev => new Set(prev).add(data.userId));
        } else {
          setPrivateTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.userId);
            return newSet;
          });
        }
      }
    });

    // Cleanup dos callbacks
    return () => {
      setOnPrivateMessage(undefined);
      setOnChatUpdate(undefined);
      setOnUserTyping(undefined);
    };
  }, [selectedChat?.id, setOnPrivateMessage, setOnChatUpdate, setOnUserTyping]);

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
        .filter((chat: any) => chat && chat.participantes && Array.isArray(chat.participantes))
        .map((chat: any) => {
          const otherParticipant = chat.participantes.find((p: any) => p.userId !== user?.id);
          return {
            id: chat.id,
            contact: otherParticipant?.usuario || null,
            lastMessage: chat.ultimaMensagem,
            unreadCount: chat.naoLidas || 0,
            timestamp: chat.ultimaMensagem?.timestamp || chat.updatedAt
          };
        })
        .filter((conv: any) => conv.contact); // Filtrar conversas sem contato
      
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
  }, []);

  // Atualizar conversas quando o modal for aberto ou quando houver mudanças
  useEffect(() => {
    if (showChatModal || showContacts) {
      loadConversations();
    }
  }, [showChatModal, showContacts, loadConversations]);

  // Filtrar conversas por busca
  const filteredConversations = conversations.filter(conv => 
    conv.contact?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [safeMessages.length]);

  // Monitorar mudanças no selectedChat
  useEffect(() => {
    if (selectedChat?.id) {
      console.log('🔍 selectedChat mudou:', {
        selectedChatId: selectedChat.id,
        selectedContactEmail: selectedContact?.email
      });
    }
  }, [selectedChat?.id]);

  // Monitorar mudanças no chatMessages
  useEffect(() => {
    if (chatMessages.length > 0) {
      console.log('📚 chatMessages mudou:', {
        chatMessagesLength: chatMessages.length,
        lastMessage: chatMessages[chatMessages.length - 1]?.content?.substring(0, 50)
      });
    }
  }, [chatMessages.length]); // Monitorar apenas o length em vez do array completo

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Limpar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Enviar status de digitação
    if (value.length > 0 && !isTyping) {
      setIsTyping(true);
      if (selectedChat) {
        // Para chat privado
        if (socket && selectedChat.id) {
          socket.emit('typing', { chatId: selectedChat.id, isTyping: true });
        }
      } else {
        // Para chat geral
        sendTyping(true);
      }
    } else if (value.length === 0 && isTyping) {
      setIsTyping(false);
      if (selectedChat) {
        // Para chat privado
        if (socket && selectedChat.id) {
          socket.emit('typing', { chatId: selectedChat.id, isTyping: false });
        }
      } else {
        // Para chat geral
        sendTyping(false);
      }
    }
    
    // Definir timeout para parar de digitar
    if (value.length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        if (selectedChat) {
          // Para chat privado
          if (socket && selectedChat.id) {
            socket.emit('typing', { chatId: selectedChat.id, isTyping: false });
          }
        } else {
          // Para chat geral
          sendTyping(false);
        }
      }, 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;

    console.log('🔍 Debug handleSubmit:', {
      selectedChat,
      selectedChatId: selectedChat?.id,
      message,
      isConnected,
      user: user?.id
    });

    if (selectedChat) {
      // Enviar mensagem para chat privado
      if (socket) {
        const messageData = {
          chatId: selectedChat.id,
          content: message,
          senderId: user?.id,
          senderName: user?.nome || user?.email,
          senderRole: user?.role,
          timestamp: new Date().toISOString()
        };
        
        console.log('📤 Enviando mensagem para chat privado:', messageData);
        
        // Verificar se chatId está definido antes de enviar
        if (!selectedChat.id) {
          console.error('❌ Chat ID está undefined!', { selectedChat });
          alert('Erro: Chat não encontrado. Tente novamente.');
          return;
        }
        
        socket.emit('message', messageData);
      }
    } else {
      // Enviar mensagem para chat geral
      if (generalChatId) {
        sendMessage(message);
      } else {
        console.error('❌ Chat geral não encontrado');
        return;
      }
    }
    
    setMessage('');
    setIsTyping(false);
    if (selectedChat) {
      // Para chat privado
      if (socket && selectedChat.id) {
        socket.emit('typing', { chatId: selectedChat.id, isTyping: false });
      }
    } else {
      // Para chat geral
      sendTyping(false);
    }
  };

  const handleShowContacts = () => {
    setShowContacts(true);
  };

  const handleBackToChat = () => {
    setShowContacts(false);
    setSelectedContact(null);
  };

  const handleSelectContact = useCallback(async (contact: any) => {
    console.log('🔍 Debug handleSelectContact:', { contact });
    setSelectedContact(contact);
    setShowContacts(false);
    
    // Se há uma callback onSelectContact, usar ela (para modal)
    if (onSelectContact) {
      onSelectContact(contact);
      return;
    }
    
    // Caso contrário, buscar ou criar chat privado na mesma tela
    try {
      console.log('📞 Buscando chat privado para usuário:', contact.id);
      const chat = await buscarOuCriarChatPrivado(contact.id);
      console.log('✅ Chat encontrado/criado:', chat);
      
      if (!chat || !chat.id) {
        console.error('❌ Chat inválido retornado:', chat);
        alert('Erro ao criar chat privado. Tente novamente.');
        return;
      }
      
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
      
      // Abrir modal do chat
      setShowChatModal(true);
      
    } catch (err) {
      console.error('❌ Erro ao abrir chat privado:', err);
      alert('Erro ao abrir chat privado');
    }
  }, [onSelectContact, socket, buscarOuCriarChatPrivado]);

  // useEffect para initialContact - movido para depois da definição de handleSelectContact
  useEffect(() => {
    if (initialContact && !selectedChat) {
      handleSelectContact(initialContact);
    }
  }, [initialContact, selectedChat?.id]);

  const handleCloseChat = () => {
    console.log('🔒 Fechando chat privado:', {
      selectedChatId: selectedChat?.id,
      selectedContact: selectedContact?.email
    });
    
    setSelectedChat(null);
    setSelectedContact(null);
    setChatMessages([]);
    setShowChatModal(false);
    if (onClose) {
      onClose();
    }
  };

  const handleConversationClick = async (conversation: Conversation) => {
    try {
      const chat = await buscarOuCriarChatPrivado(conversation.contact.id);
      setSelectedChat(chat);
      setSelectedContact(conversation.contact);
      setChatMessages(chat.mensagens ? [...chat.mensagens].reverse() : []);
      
      if (socket && chat.id) {
        socket.emit('joinChat', { chatId: chat.id });
      }
      
      setShowChatModal(true);
    } catch (error) {
      console.error('Erro ao abrir conversa:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'PROFISSIONAL':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'RECEPCIONISTA':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'PROFISSIONAL':
        return 'Profissional';
      case 'RECEPCIONISTA':
        return 'Recepcionista';
      default:
        return role;
    }
  };

  // Se estiver mostrando contatos, renderizar o componente de contatos
  if (showContacts) {
    return <ChatContacts onSelectContact={handleSelectContact} onBackToChat={handleBackToChat} />;
  }

  // Se for modal e não há contato selecionado, mostrar lista de conversas
  if (isModal && !selectedContact) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Conversas</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowContacts(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Chat
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="p-4">
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
          </div>

          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma conversa encontrada</h3>
                  <p className="mb-4">Inicie uma nova conversa para começar a conversar!</p>
                  <Button onClick={() => setShowContacts(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nova Conversa
                  </Button>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const contactName = conversation.contact?.nome || conversation.contact?.email || 'Usuário';
                  
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${contactName}&background=random`}
                          alt={contactName}
                        />
                        <AvatarFallback>
                          {contactName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">
                            {contactName}
                          </h4>
                          {conversation.timestamp && (
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(conversation.timestamp), 'HH:mm', { locale: ptBR })}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage?.content || 'Nenhuma mensagem ainda'}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }).filter(Boolean) // Remover elementos null
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  // Se for modal e há contato selecionado, mostrar chat privado
  if (isModal && selectedContact) {
    return (
      <div className="flex flex-col h-full">
        {/* Header do chat */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedContact(null);
                setSelectedChat(null);
                setChatMessages([]);
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${selectedContact?.nome || selectedContact?.email || 'U'}&background=random`}
                alt={selectedContact?.nome || selectedContact?.email || 'Usuário'}
              />
              <AvatarFallback>
                {(selectedContact?.nome || selectedContact?.email || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">
                {selectedContact?.nome || selectedContact?.email || 'Usuário'}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedContact?.role && getRoleLabel(selectedContact.role)}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Área de mensagens */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4 p-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma mensagem ainda.</h3>
                  <p className="mb-4">Envie a primeira mensagem!</p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  // Verificar se a mensagem tem dados válidos
                  if (!msg || !msg.senderName) {
                    console.warn('⚠️ [Chat] Mensagem inválida:', msg);
                    return null;
                  }

                  return (
                    <div key={msg.id || `${msg.timestamp}-${msg.senderId}`} className="flex gap-3">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${msg.senderName}&background=random`}
                          alt={msg.senderName}
                        />
                        <AvatarFallback>
                          {msg.senderName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{msg.senderName}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(msg.senderRole)}`}>
                            {getRoleLabel(msg.senderRole)}
                          </span>
                        </div>
                        <div className={`mt-1 px-4 py-2 rounded-lg max-w-full break-words ${
                          msg.senderId === user?.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {format(new Date(msg.timestamp), 'HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  );
                }).filter(Boolean) // Remover elementos null
              )}

              {/* Indicador de digitação para chat privado */}
              {privateTypingUsers.size > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span>Digitando...</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Formulário de envio */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={handleInputChange}
              placeholder="Digite sua mensagem..."
              disabled={!isConnected}
              className="flex-1"
              maxLength={500}
            />
            <Button 
              type="submit" 
              disabled={!isConnected || !message.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {message.length > 0 && (
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {message.length}/500
            </div>
          )}
        </form>
      </div>
    );
  }

  // Renderização padrão (não modal)
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Chat</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowContacts(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChatModal(true)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Conversas
          </Button>
        </div>
      </div>

      {/* Área de mensagens do chat geral */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollRef}>
          <div className="space-y-4 p-4">
            {safeMessages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nenhuma mensagem ainda.</h3>
                <p className="mb-4">Envie a primeira mensagem!</p>
              </div>
            ) : (
              safeMessages.map((msg) => {
                if (!msg || !msg.senderName) {
                  console.warn('⚠️ [Chat] Mensagem inválida:', msg);
                  return null;
                }

                return (
                  <div key={msg.id || `${msg.timestamp}-${msg.senderId}`} className="flex gap-3">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${msg.senderName}&background=random`}
                        alt={msg.senderName}
                      />
                      <AvatarFallback>
                        {msg.senderName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{msg.senderName}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(msg.senderRole)}`}>
                          {getRoleLabel(msg.senderRole)}
                        </span>
                      </div>
                      <div className={`mt-1 px-4 py-2 rounded-lg max-w-full break-words ${
                        msg.senderId === user?.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {format(new Date(msg.timestamp), 'HH:mm', { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                );
              }).filter(Boolean)
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Formulário de envio */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={handleInputChange}
            placeholder="Digite sua mensagem..."
            disabled={!isConnected}
            className="flex-1"
            maxLength={500}
          />
          <Button 
            type="submit" 
            disabled={!isConnected || !message.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {message.length > 0 && (
          <div className="text-xs text-muted-foreground mt-1 text-right">
            {message.length}/500
          </div>
        )}
      </form>

      {/* Modal do Chat */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${selectedContact?.nome || selectedContact?.email || 'U'}&background=random`}
                  alt={selectedContact?.nome || selectedContact?.email || 'Usuário'}
                />
                <AvatarFallback>
                  {(selectedContact?.nome || selectedContact?.email || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">
                  {selectedContact?.nome || selectedContact?.email || 'Usuário'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedContact?.role && getRoleLabel(selectedContact.role)}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Área de mensagens */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4 p-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma mensagem ainda.</h3>
                    <p className="mb-4">Envie a primeira mensagem!</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    // Verificar se a mensagem tem dados válidos
                    if (!msg || !msg.senderName) {
                      console.warn('⚠️ [Chat] Mensagem inválida:', msg);
                      return null;
                    }

                    return (
                      <div key={msg.id || `${msg.timestamp}-${msg.senderId}`} className="flex gap-3">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${msg.senderName}&background=random`}
                            alt={msg.senderName}
                          />
                          <AvatarFallback>
                            {msg.senderName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{msg.senderName}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(msg.senderRole)}`}>
                              {getRoleLabel(msg.senderRole)}
                            </span>
                          </div>
                          <div className={`mt-1 px-4 py-2 rounded-lg max-w-full break-words ${
                            msg.senderId === user?.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            {msg.content}
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {format(new Date(msg.timestamp), 'HH:mm', { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    );
                  }).filter(Boolean) // Remover elementos null
                )}

                {/* Indicador de digitação para chat privado */}
                {privateTypingUsers.size > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span>Digitando...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Formulário de envio */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={handleInputChange}
                placeholder="Digite sua mensagem..."
                disabled={!isConnected}
                className="flex-1"
                maxLength={500}
              />
              <Button 
                type="submit" 
                disabled={!isConnected || !message.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {message.length > 0 && (
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {message.length}/500
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
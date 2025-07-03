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
  UserPlus,
  ArrowLeft,
  MoreVertical,
  Plus,
  Calendar,
  Users,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  Archive
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { buscarOuCriarChatPrivado, getChats } from '@/services/chat.service';
import { useUsuariosAtivos } from '@/hooks/useUsuarios';
import { useChatNotifications } from '@/hooks/useChatNotifications';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChatsTable from "@/components/tables/chats";
import { useChatsStats } from "@/hooks/useChats";

interface Conversation {
  id: string;
  contact: any;
  lastMessage: any;
  unreadCount: number;
  timestamp: string;
}

export default function ChatPage() {
  const { socket, isConnected, messages, generalChatId, sendMessage, sendTyping, setOnPrivateMessage, setOnChatUpdate, setOnUserTyping } = useSocket();
  const { user } = useAuth();
  const { clearNotifications } = useChatNotifications();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [privateTypingUsers, setPrivateTypingUsers] = useState<Set<string>>(new Set());
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: usuarios, isLoading: isLoadingUsuarios } = useUsuariosAtivos();
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useChatsStats();

  // Filtrar mensagens do chat geral (não privado)
  const safeMessages = messages.filter(msg => !msg.chatId || msg.chatId === generalChatId);

  // Configurar handlers de WebSocket
  useEffect(() => {
    if (socket) {
      setOnPrivateMessage((data: any) => {
        console.log('📨 [Chat] Mensagem privada recebida:', data);
        if (data && selectedChat && data.chatId === selectedChat.id) {
          setChatMessages(prev => [...prev, data]);
        }
      });

      setOnChatUpdate((data: any) => {
        console.log('🔄 [Chat] Atualização de chat recebida:', data);
        loadConversations();
      });

      setOnUserTyping((data: any) => {
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
  }, [loadConversations]);

  // Auto-scroll para mensagens
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [safeMessages.length, chatMessages.length]);

  // Handler para envio de mensagem
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;

    if (selectedChat) {
      // Para chat privado
      if (socket && selectedChat.id) {
        socket.emit('privateMessage', {
          chatId: selectedChat.id,
          content: message.trim(),
          receiverId: selectedContact.id
        });
      }
    } else {
      // Para chat geral
      sendMessage(message.trim());
    }

    setMessage('');
    setIsTyping(false);
    
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
    }, 1000);
  };

  // Handler para seleção de contato
  const handleSelectContact = useCallback(async (contact: any) => {
    console.log('🔍 Debug handleSelectContact:', { contact });
    setSelectedContact(contact);
    setShowContacts(false);
    setShowNewChat(false);
    
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
      
    } catch (err) {
      console.error('❌ Erro ao abrir chat privado:', err);
      alert('Erro ao abrir chat privado');
    }
  }, [socket]);

  // Handler para clique em conversa
  const handleConversationClick = async (conversation: Conversation) => {
    try {
      const chat = await buscarOuCriarChatPrivado(conversation.contact.id);
      setSelectedChat(chat);
      setSelectedContact(conversation.contact);
      setChatMessages(chat.mensagens ? [...chat.mensagens].reverse() : []);
      
      if (socket && chat.id) {
        socket.emit('joinChat', { chatId: chat.id });
      }
    } catch (error) {
      console.error('Erro ao abrir conversa:', error);
    }
  };

  // Filtrar conversas por busca
  const filteredConversations = conversations.filter(conv => 
    conv.contact?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar usuários para nova conversa
  const filteredUsuarios = usuarios?.filter((usuario: any) => 
    usuario.id !== user?.id &&
    (usuario.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

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

  // Limpar notificações quando acessar a página de chat
  useEffect(() => {
    clearNotifications();
  }, [clearNotifications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chats</h1>
          <p className="text-muted-foreground">
            Gerencie os chats e conversas da clínica
          </p>
        </div>
        <Button onClick={() => navigate("/chat/novo")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Chat
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold">{stats?.totalChats || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Todos os chats criados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {stats?.chatsPorStatus?.ATIVO || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Chats em atividade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arquivados</CardTitle>
            <Archive className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-600">
                {stats?.chatsPorStatus?.ARQUIVADO || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Chats arquivados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fechados</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {stats?.chatsPorStatus?.FECHADO || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Chats encerrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por Tipo */}
      {stats?.chatsPorTipo && Object.keys(stats.chatsPorTipo).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
            <CardDescription>
              Quantidade de chats por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.chatsPorTipo).map(([tipo, quantidade]) => (
                <div key={tipo} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">{tipo}</span>
                  <Badge variant="secondary">{quantidade}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas Adicionais */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Média de Mensagens
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {stats?.mediaMensagensPorChat?.toFixed(1) || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Mensagens por chat em média
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Crescimento Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {stats?.crescimentoMensal ? (
                  <span className={stats.crescimentoMensal >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {stats.crescimentoMensal >= 0 ? '+' : ''}{stats.crescimentoMensal.toFixed(1)}%
                  </span>
                ) : (
                  '0%'
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Comparado ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Chats */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Chats</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os chats da clínica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChatsTable />
        </CardContent>
      </Card>
    </div>
  );
} 
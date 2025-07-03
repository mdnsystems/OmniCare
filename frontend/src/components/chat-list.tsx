import { useChats } from '@/hooks/useChats';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
  onCreateChat?: () => void;
}

export function ChatList({ onSelectChat, selectedChatId, onCreateChat }: ChatListProps) {
  const { data: chats, isLoading, error } = useChats();
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);

  if (isLoading) {
    return <div className="p-4 text-gray-500">Carregando chats...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-500">Erro ao carregar chats</div>;
  }

  return (
    <div className="flex flex-col h-full border-r bg-white dark:bg-gray-900 w-80">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-lg">Conversas</h2>
        <Button size="icon" variant="outline" onClick={onCreateChat || (() => setShowCreate(true))}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {(!chats || chats.length === 0) ? (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            Nenhum chat encontrado
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {chats.map((chat: any) => (
              <li
                key={chat.id}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedChatId === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                onClick={() => onSelectChat(chat.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={chat.tipo === 'GRUPO' ? undefined : `https://ui-avatars.com/api/?name=${chat.nome || 'Chat'}&background=random`}
                    alt={chat.nome || 'Chat'}
                  />
                  <AvatarFallback>
                    {chat.nome?.charAt(0).toUpperCase() || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">
                      {chat.tipo === 'GERAL' ? 'Chat Geral' : chat.nome || 'Chat Privado'}
                    </span>
                    {chat.tipo === 'GRUPO' && (
                      <Badge variant="secondary" className="text-xs"><Users className="h-3 w-3 mr-1" />Grupo</Badge>
                    )}
                    {chat.tipo === 'PRIVADO' && (
                      <Badge variant="secondary" className="text-xs">Privado</Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {chat.ultimaMensagem?.content ? chat.ultimaMensagem.content : 'Sem mensagens'}
                  </div>
                </div>
                {chat.naoLidas > 0 && (
                  <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                    {chat.naoLidas}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 
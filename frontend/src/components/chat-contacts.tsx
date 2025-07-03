'use client';

import React, { useState } from 'react';
import { useUsuariosAtivos } from '@/hooks/useUsuarios';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Users, MessageCircle, Crown, User, UserCheck } from 'lucide-react';
import { RoleUsuario } from '@/types/api';

interface ChatContactsProps {
  onSelectContact: (contact: any) => void;
  onBackToChat: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export function ChatContacts({ onSelectContact, onBackToChat, isModal = false, onClose }: ChatContactsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: usuarios, isLoading, error } = useUsuariosAtivos();
  const { user } = useAuth();

  // Filtrar usuários (excluir o usuário atual e papéis indesejados)
  const filteredUsuarios = usuarios?.filter(usuario => 
    usuario.id !== user?.id && 
    usuario.role !== RoleUsuario.SUPER_ADMIN &&
    usuario.role !== RoleUsuario.ADMIN &&
    (usuario.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     usuario.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const getRoleIcon = (role: RoleUsuario) => {
    switch (role) {
      case RoleUsuario.ADMIN:
        return <Crown className="h-3 w-3" />;
      case RoleUsuario.PROFISSIONAL:
        return <UserCheck className="h-3 w-3" />;
      case RoleUsuario.RECEPCIONISTA:
        return <User className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getRoleColor = (role: RoleUsuario) => {
    switch (role) {
      case RoleUsuario.ADMIN:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case RoleUsuario.PROFISSIONAL:
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case RoleUsuario.RECEPCIONISTA:
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const getRoleLabel = (role: RoleUsuario) => {
    switch (role) {
      case RoleUsuario.ADMIN:
        return 'Administrador';
      case RoleUsuario.PROFISSIONAL:
        return 'Profissional';
      case RoleUsuario.RECEPCIONISTA:
        return 'Recepcionista';
      default:
        return role;
    }
  };

  const handleContactClick = (contact: any) => {
    onSelectContact(contact);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBackToChat}>
              ← Voltar
            </Button>
            <h3 className="font-semibold">Contatos</h3>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Carregando contatos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBackToChat}>
              ← Voltar
            </Button>
            <h3 className="font-semibold">Contatos</h3>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>Erro ao carregar contatos</p>
            <p className="text-sm">Tente novamente mais tarde</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBackToChat}>
            ← Voltar
          </Button>
          <h3 className="font-semibold">Contatos</h3>
        </div>
        <div className="text-xs text-gray-500">
          {filteredUsuarios.length} contatos
        </div>
      </div>

      {/* Barra de busca */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar contatos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de contatos */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2">
            {filteredUsuarios.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>
                  {searchTerm ? 'Nenhum contato encontrado' : 'Nenhum contato disponível'}
                </p>
                {searchTerm && (
                  <p className="text-sm">Tente uma busca diferente</p>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredUsuarios.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => handleContactClick(contact)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${contact.nome || contact.email}&background=random`}
                        alt={contact.nome || contact.email}
                      />
                      <AvatarFallback>
                        {(contact.nome || contact.email).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {contact.nome || 'Sem nome'}
                        </span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getRoleColor(contact.role)}`}
                        >
                          {getRoleIcon(contact.role)}
                          <span className="ml-1">{getRoleLabel(contact.role)}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {contact.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {contact.ativo ? (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                      <MessageCircle className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer com estatísticas */}
      <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
        <div className="text-xs text-gray-500 text-center">
          <p>Clique em um contato para iniciar uma conversa</p>
          <p className="mt-1">
            {filteredUsuarios.filter(u => u.ativo).length} online • {filteredUsuarios.length} total
          </p>
        </div>
      </div>
    </div>
  );
} 
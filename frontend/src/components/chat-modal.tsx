import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Chat } from './chat';
import { useSocket } from '@/contexts/socket-context';
import { buscarOuCriarChatPrivado } from '@/services/chat.service';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedContact?: any;
}

export function ChatModal({ isOpen, onClose, selectedContact }: ChatModalProps) {
  const { socket } = useSocket();

  useEffect(() => {
    if (isOpen && selectedContact && socket) {
      const joinChat = async () => {
        try {
          const chat = await buscarOuCriarChatPrivado(selectedContact.id);
          console.log('Entrando no chat privado via modal:', chat.id);
          socket.emit('joinChat', { chatId: chat.id });
        } catch (error) {
          console.error('Erro ao entrar no chat privado:', error);
        }
      };
      
      joinChat();
    }
  }, [isOpen, selectedContact, socket]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Chat com {selectedContact?.nome || selectedContact?.email || 'Contato'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <Chat 
            isModal={true}
            selectedContact={selectedContact}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 
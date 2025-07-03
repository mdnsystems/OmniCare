import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as chatService from '@/services/chat.service';
import { Chat, PaginatedResponse } from '@/types/api';
import { createQueryKey } from '@/services/api';

// Tipos para filtros e parâmetros
export interface ChatFilters {
  titulo?: string;
  tipo?: string;
  status?: string;
  criadoPor?: string;
}

export interface ChatParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: ChatFilters;
}

// Hook para listar chats com paginação
export const useChats = (params: ChatParams = {}) => {
  const { page = 1, limit = 10, sortBy, sortOrder, filters } = params;
  
  return useQuery({
    queryKey: createQueryKey('chats', { page, limit, sortBy, sortOrder, ...filters }),
    queryFn: () => chatService.getChats({ page, limit, sortBy, sortOrder, filters }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para buscar chats por termo (autocomplete)
export const useChatsSearch = (searchTerm: string, limit: number = 10) => {
  return useQuery({
    queryKey: createQueryKey('chats', 'search', { searchTerm, limit }),
    queryFn: () => chatService.searchChats(searchTerm, limit),
    enabled: searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obter um chat específico
export const useChat = (id: string) => {
  return useQuery({
    queryKey: createQueryKey('chat', { id }),
    queryFn: () => chatService.getChat(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter chats por tipo
export const useChatsPorTipo = (tipo: string) => {
  return useQuery({
    queryKey: createQueryKey('chats', 'tipo', { tipo }),
    queryFn: () => chatService.getChatsByTipo(tipo),
    enabled: !!tipo,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter chats por status
export const useChatsPorStatus = (status: string) => {
  return useQuery({
    queryKey: createQueryKey('chats', 'status', { status }),
    queryFn: () => chatService.getChatsByStatus(status),
    enabled: !!status,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter chats por usuário
export const useChatsPorUsuario = (usuarioId: string) => {
  return useQuery({
    queryKey: createQueryKey('chats', 'usuario', { usuarioId }),
    queryFn: () => chatService.getChatsByUsuario(usuarioId),
    enabled: !!usuarioId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter estatísticas de chats
export const useChatsStats = (periodoInicio?: string, periodoFim?: string) => {
  return useQuery({
    queryKey: createQueryKey('chats', 'stats', { periodoInicio, periodoFim }),
    queryFn: () => chatService.getChatsStats(periodoInicio, periodoFim),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para criar chat
export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Chat, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => 
      chatService.createChat(data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chats', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Adicionar à cache
      queryClient.setQueryData(
        createQueryKey('chat', { id: data.id }),
        data
      );
      
      toast.success('Chat criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar chat');
    }
  });
};

// Hook para atualizar chat
export const useUpdateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Chat> }) => 
      chatService.updateChat(id, data),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['chats', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('chat', { id: data.id }),
        data
      );
      
      toast.success('Chat atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar chat');
    }
  });
};

// Hook para deletar chat
export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => chatService.deleteChat(id),
    onSuccess: (_, id) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chats', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Remover da cache
      queryClient.removeQueries({ queryKey: ['chat', id] });
      
      toast.success('Chat removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover chat');
    }
  });
};

// Hook para arquivar chat
export const useArquivarChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => chatService.arquivarChat(id),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat', data.id] });
      queryClient.invalidateQueries({ queryKey: ['chats', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('chat', { id: data.id }),
        data
      );
      
      toast.success('Chat arquivado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao arquivar chat');
    }
  });
};

// Hook para fechar chat
export const useFecharChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => chatService.fecharChat(id),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat', data.id] });
      queryClient.invalidateQueries({ queryKey: ['chats', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('chat', { id: data.id }),
        data
      );
      
      toast.success('Chat fechado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao fechar chat');
    }
  });
};

// Hook para reativar chat
export const useReativarChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => chatService.reativarChat(id),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat', data.id] });
      queryClient.invalidateQueries({ queryKey: ['chats', 'stats'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('chat', { id: data.id }),
        data
      );
      
      toast.success('Chat reativado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao reativar chat');
    }
  });
};

// Hook para adicionar participante
export const useAdicionarParticipante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, usuarioId }: { chatId: string; usuarioId: string }) => 
      chatService.adicionarParticipante(chatId, usuarioId),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat', data.id] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('chat', { id: data.id }),
        data
      );
      
      toast.success('Participante adicionado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao adicionar participante');
    }
  });
};

// Hook para remover participante
export const useRemoverParticipante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, usuarioId }: { chatId: string; usuarioId: string }) => 
      chatService.removerParticipante(chatId, usuarioId),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat', data.id] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('chat', { id: data.id }),
        data
      );
      
      toast.success('Participante removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover participante');
    }
  });
};

// Hook para exportar chats
export const useExportChats = () => {
  return useMutation({
    mutationFn: (filters?: ChatFilters) => chatService.exportChats(filters),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao exportar chats');
    }
  });
};

// Hook para importar chats
export const useImportChats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => chatService.importChats(file),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chats', 'stats'] });
      
      toast.success(`Importação concluída: ${data.success} chats importados`);
      if (data.errors.length > 0) {
        toast.error(`Erros na importação: ${data.errors.join(', ')}`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao importar chats');
    }
  });
}; 
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as especialidadeService from '@/services/especialidade.service';
import { CreateEspecialidadeRequest, UpdateEspecialidadeRequest, EspecialidadeFilters } from '@/services/especialidade.service';
import { api } from '@/lib/axios';
import { Especialidade } from '@/types/api';

interface EspecialidadesParams {
  page?: number;
  limit?: number;
  filters?: {
    nome?: string;
  };
}

// Hook para buscar especialidades com paginação e filtros
export const useEspecialidades = (params: EspecialidadesParams = {}) => {
  const { page = 1, limit = 10, filters = {} } = params;
  
  return useQuery({
    queryKey: ['especialidades', { page, limit, filters }],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      if (filters.nome) {
        queryParams.append('nome', filters.nome);
      }
      
      const response = await api.get(`/especialidades?${queryParams.toString()}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para buscar especialidade por ID
export const useEspecialidade = (id: string) => {
  return useQuery({
    queryKey: ['especialidade', id],
    queryFn: async () => {
      const response = await api.get(`/especialidades/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para especialidades ativas
export const useEspecialidadesAtivas = () => {
  return useQuery({
    queryKey: ['especialidades-ativas'],
    queryFn: () => especialidadeService.getEspecialidadesAtivas(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para especialidades por tipo de clínica
export const useEspecialidadesByTipoClinica = (tipoClinica: string) => {
  return useQuery({
    queryKey: ['especialidades-tipo', tipoClinica],
    queryFn: async () => {
      const response = await api.get(`/especialidades/tipo/${tipoClinica}`);
      return response.data.data;
    },
    enabled: !!tipoClinica,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para buscar especialidade por nome
export const useEspecialidadeByNome = (nome: string) => {
  return useQuery({
    queryKey: ['especialidade-nome', nome],
    queryFn: () => especialidadeService.getEspecialidadeByNome(nome),
    enabled: !!nome && nome.length >= 3,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para criar especialidade
export const useCreateEspecialidade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Especialidade>) => {
      const response = await api.post('/especialidades', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['especialidades'] });
    },
  });
};

// Hook para atualizar especialidade
export const useUpdateEspecialidade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Especialidade> }) => {
      const response = await api.put(`/especialidades/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['especialidades'] });
      queryClient.invalidateQueries({ queryKey: ['especialidade', id] });
    },
  });
};

// Hook para deletar especialidade
export const useDeleteEspecialidade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/especialidades/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['especialidades'] });
    },
  });
};

// Hook para validar nome de especialidade
export const useValidateNomeEspecialidade = () => {
  return useMutation({
    mutationFn: ({ nome, excludeId }: { nome: string; excludeId?: string }) =>
      especialidadeService.validateNomeEspecialidade(nome, excludeId),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao validar nome da especialidade');
    }
  });
};

// Hook para importar especialidades
export const useImportEspecialidades = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => especialidadeService.importEspecialidades(file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['especialidades'] });
      queryClient.invalidateQueries({ queryKey: ['especialidades-ativas'] });
      
      if (result.success > 0) {
        toast.success(`${result.success} especialidades importadas com sucesso!`);
      }
      
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} erros encontrados durante a importação`);
        console.error('Erros de importação:', result.errors);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao importar especialidades');
    }
  });
};

// Hook para exportar especialidades
export const useExportEspecialidades = () => {
  return useMutation({
    mutationFn: (filters?: EspecialidadeFilters) => especialidadeService.exportEspecialidades(filters),
    onSuccess: (blob) => {
      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `especialidades-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Exportação realizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao exportar especialidades');
    }
  });
}; 
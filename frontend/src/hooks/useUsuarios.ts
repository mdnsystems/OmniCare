import { useQuery } from '@tanstack/react-query';
import { getUsuarios, getUsuario } from '@/services/auth.service';
import { Usuario, RoleUsuario } from '@/types/api';

export interface UsuarioParams {
  role?: RoleUsuario;
  ativo?: boolean;
  search?: string;
}

export const useUsuarios = (params: UsuarioParams = {}) => {
  return useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => getUsuarios(),
    select: (usuarios) => {
      let filtered = usuarios;

      // Filtrar por role
      if (params.role) {
        filtered = filtered.filter(usuario => usuario.role === params.role);
      }

      // Filtrar por status ativo
      if (params.ativo !== undefined) {
        filtered = filtered.filter(usuario => usuario.ativo === params.ativo);
      }

      // Filtrar por busca
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filtered = filtered.filter(usuario => 
          usuario.nome?.toLowerCase().includes(searchTerm) ||
          usuario.email.toLowerCase().includes(searchTerm)
        );
      }

      return filtered;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useUsuario = (id: string) => {
  return useQuery({
    queryKey: ['usuario', id],
    queryFn: () => getUsuario(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useUsuariosAtivos = () => {
  return useUsuarios({ ativo: true });
};

export const useUsuariosByRole = (role: RoleUsuario) => {
  return useUsuarios({ role, ativo: true });
};

export const useUsuariosSearch = (searchTerm: string, limit: number = 10) => {
  return useQuery({
    queryKey: ['usuarios', 'search', searchTerm, limit],
    queryFn: () => getUsuarios(),
    select: (usuarios) => {
      if (!searchTerm) return usuarios.slice(0, limit);
      
      const searchLower = searchTerm.toLowerCase();
      return usuarios
        .filter(usuario => 
          usuario.nome?.toLowerCase().includes(searchLower) ||
          usuario.email.toLowerCase().includes(searchLower)
        )
        .slice(0, limit);
    },
    enabled: !!searchTerm,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

export const useUsuariosStats = () => {
  return useQuery({
    queryKey: ['usuarios', 'stats'],
    queryFn: () => getUsuarios(),
    select: (usuarios) => {
      const stats = {
        total: usuarios.length,
        ativos: usuarios.filter(u => u.ativo).length,
        inativos: usuarios.filter(u => !u.ativo).length,
        porRole: {
          ADMIN: usuarios.filter(u => u.role === RoleUsuario.ADMIN).length,
          PROFISSIONAL: usuarios.filter(u => u.role === RoleUsuario.PROFISSIONAL).length,
          RECEPCIONISTA: usuarios.filter(u => u.role === RoleUsuario.RECEPCIONISTA).length,
          SUPER_ADMIN: usuarios.filter(u => u.role === RoleUsuario.SUPER_ADMIN).length,
        }
      };
      return stats;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}; 
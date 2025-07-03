import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as authService from '@/services/auth.service';
import { LoginRequest, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/services/auth.service';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      // Salvar tokens e informações no localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('tenantId', data.tenantId);
      localStorage.setItem('tenantName', data.tenantName);
      localStorage.setItem('user', JSON.stringify(data.usuario));

      // Invalidar queries relacionadas ao usuário
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao fazer login');
    }
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Limpar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tenantId');
      localStorage.removeItem('tenantName');
      localStorage.removeItem('user');

      // Limpar cache do React Query
      queryClient.clear();

      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    },
    onError: () => {
      // Mesmo com erro, fazer logout local
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tenantId');
      localStorage.removeItem('tenantName');
      localStorage.removeItem('user');
      queryClient.clear();
      navigate('/login');
    }
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) => authService.refreshToken({ refreshToken }),
    onSuccess: (data) => {
      // Atualizar tokens no localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Invalidar queries que dependem do token
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => {
      // Se falhar o refresh, fazer logout
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tenantId');
      localStorage.removeItem('tenantName');
      localStorage.removeItem('user');
      queryClient.clear();
      window.location.href = '/login';
    }
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao alterar senha');
    }
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
    onSuccess: () => {
      toast.success('Email de recuperação enviado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao enviar email de recuperação');
    }
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso!');
      navigate('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao redefinir senha');
    }
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getPerfil(),
    enabled: !!localStorage.getItem('token'),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => authService.updatePerfil(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar perfil');
    }
  });
};

// Hook para verificar se o usuário está autenticado
export const useAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const tenantId = localStorage.getItem('tenantId');

  return {
    isAuthenticated: !!token && !!user && !!tenantId,
    user: user ? JSON.parse(user) : null,
    token,
    tenantId,
  };
};

// Hook para verificar permissões
export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    // Implementar lógica de verificação de permissões baseada no role do usuário
    const userRole = user.role;
    
    // Mapeamento de permissões por role
    const permissionsByRole = {
      SUPER_ADMIN: ['*'], // Todas as permissões
      ADMIN: [
        'users.read', 'users.create', 'users.update', 'users.delete',
        'patients.read', 'patients.create', 'patients.update', 'patients.delete',
        'professionals.read', 'professionals.create', 'professionals.update', 'professionals.delete',
        'appointments.read', 'appointments.create', 'appointments.update', 'appointments.delete',
        'medical_records.read', 'medical_records.create', 'medical_records.update', 'medical_records.delete',
        'billing.read', 'billing.create', 'billing.update', 'billing.delete',
        'reports.read', 'reports.create',
        'settings.read', 'settings.update'
      ],
      PROFISSIONAL: [
        'patients.read', 'patients.create', 'patients.update',
        'appointments.read', 'appointments.create', 'appointments.update',
        'medical_records.read', 'medical_records.create', 'medical_records.update',
        'billing.read', 'billing.create',
        'reports.read'
      ],
      RECEPCIONISTA: [
        'patients.read', 'patients.create', 'patients.update',
        'appointments.read', 'appointments.create', 'appointments.update', 'appointments.delete',
        'billing.read', 'billing.create', 'billing.update',
        'reports.read'
      ]
    };

    const userPermissions = permissionsByRole[userRole as keyof typeof permissionsByRole] || [];
    
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  return {
    hasPermission,
    userRole: user?.role,
  };
}; 
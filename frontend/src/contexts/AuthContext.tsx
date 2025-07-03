import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, extractData } from '@/lib/axios';
import { Usuario, RoleUsuario } from '@/types/api';

interface AuthContextData {
  user: Usuario | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Verificar se há dados do usuário no localStorage
        const storedUser = localStorage.getItem('user');
        const storedTenantId = localStorage.getItem('tenantId');

        if (storedUser && storedTenantId) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('🔐 [AuthContext] Usuário carregado do localStorage:', parsedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('🔐 [AuthContext] Erro ao parsear usuário do localStorage:', error);
            // Limpar dados inválidos
            localStorage.removeItem('user');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('tenantId');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log('🔐 [AuthContext] Nenhum usuário encontrado no localStorage');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('🔐 [AuthContext] Erro na inicialização:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 [AuthContext] Iniciando login para:', email);
      
      const response = await api.post('/auth/login', { email, senha: password });
      
      // Usar extractData para extrair os dados corretamente
      const { usuario, expiresIn, refreshExpiresIn } = extractData(response);
      
      console.log('🔐 [AuthContext] Login bem-sucedido:', usuario);
      
      // Salvar dados do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(usuario));
      localStorage.setItem('userInfo', JSON.stringify(usuario));
      localStorage.setItem('tenantId', usuario.tenantId);

      setUser(usuario);
      setIsAuthenticated(true);

      // Aguardar um pouco antes de redirecionar para evitar problemas de renderização
      setTimeout(() => {
        // Redirecionar baseado no role
        let redirectPath = '/dashboard';
        
        if (usuario.role === 'SUPER_ADMIN') {
          redirectPath = '/admin/controle-financeiro';
        } else if (usuario.role === 'ADMIN') {
          redirectPath = '/dashboard/administrativo';
        } else if (usuario.role === 'PROFISSIONAL') {
          redirectPath = '/dashboard/profissional';
        } else if (usuario.role === 'RECEPCIONISTA') {
          redirectPath = '/dashboard/recepcionista';
        }
        
        console.log('🔐 [AuthContext] Redirecionando para:', redirectPath);
        navigate(redirectPath);
      }, 100);

    } catch (error: any) {
      console.error('🔐 [AuthContext] Erro no login:', error);
      
      // Tratar diferentes tipos de erro
      if (error.response?.status === 400) {
        throw new Error('Credenciais inválidas');
      } else if (error.response?.status === 401) {
        throw new Error('Usuário não autorizado');
      } else if (error.response?.status === 403) {
        throw new Error('Acesso negado');
      } else if (error.response?.status === 404) {
        throw new Error('Usuário não encontrado');
      } else if (error.response?.status >= 500) {
        throw new Error('Erro interno do servidor');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else {
        throw new Error(error.message || 'Erro ao fazer login');
      }
    }
  }, [navigate]);

  const signOut = useCallback(async () => {
    try {
      console.log('🔐 [AuthContext] Iniciando logout');
      
      // Chamar endpoint de logout para limpar cookies no servidor
      await api.post('/auth/logout');
    } catch (error) {
      // Continuar mesmo se o logout no servidor falhar
      console.warn('🔐 [AuthContext] Erro ao fazer logout no servidor:', error);
    } finally {
      // Limpar dados locais
      localStorage.removeItem('user');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('tenantId');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  }, [navigate]);

  // Memoizar o valor do contexto para evitar re-renderizações desnecessárias
  const contextValue = useMemo(() => ({
    user,
    signIn,
    signOut,
    isAuthenticated,
    isInitialized
  }), [user, signIn, signOut, isAuthenticated, isInitialized]);

  // Não renderizar até que a inicialização esteja completa
  if (!isInitialized) {
    console.log('🔐 [AuthContext] Aguardando inicialização...');
    return null;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
} 
import { useAuth } from '@/contexts/AuthContext';
import { useClinica } from '@/contexts/ClinicaContext';
import { useEffect } from 'react';

export function DebugAuth() {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const { configuracao, isLoading, tenantId } = useClinica();

  useEffect(() => {
    console.log('🐛 [DebugAuth] Estado dos contextos:', {
      auth: {
        user,
        isAuthenticated,
        isInitialized
      },
      clinica: {
        configuracao: !!configuracao,
        isLoading,
        tenantId
      },
      localStorage: {
        user: localStorage.getItem('user'),
        tenantId: localStorage.getItem('tenantId'),
        userInfo: localStorage.getItem('userInfo')
      }
    });
  }, [user, isAuthenticated, isInitialized, configuracao, isLoading, tenantId]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Auth</h3>
      <div className="space-y-1">
        <div>Auth Initialized: {isInitialized ? '✅' : '⏳'}</div>
        <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>User: {user ? '✅' : '❌'}</div>
        <div>User Role: {user?.role || 'N/A'}</div>
        <div>Clinica Loading: {isLoading ? '⏳' : '✅'}</div>
        <div>Clinica Config: {configuracao ? '✅' : '❌'}</div>
        <div>Tenant ID: {tenantId || 'N/A'}</div>
      </div>
    </div>
  );
} 
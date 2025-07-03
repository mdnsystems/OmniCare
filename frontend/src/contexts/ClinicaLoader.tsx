import { useClinica } from './ClinicaContext';
import { useAuth } from './AuthContext';

export function ClinicaLoader({ children }: { children: React.ReactNode }) {
  const { configuracao, isLoading } = useClinica();
  const { isAuthenticated, user, isInitialized: authInitialized } = useAuth();
  
  console.log('🏥 [ClinicaLoader] Estado atual:', { 
    isLoading, 
    hasConfiguracao: !!configuracao, 
    isAuthenticated, 
    hasUser: !!user,
    authInitialized
  });
  
  // Aguardar tanto a inicialização do Auth quanto do Clinica
  if (!authInitialized || isLoading) {
    console.log('🏥 [ClinicaLoader] Aguardando inicialização dos contextos...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Se não estiver autenticado, não precisa carregar configuração da clínica
  if (!isAuthenticated) {
    console.log('🏥 [ClinicaLoader] Usuário não autenticado, renderizando children');
    return <>{children}</>;
  }
  
  // Se estiver autenticado mas não tem configuração, mostrar erro
  if (!configuracao) {
    console.log('🏥 [ClinicaLoader] Erro ao carregar configuração da clínica');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar configuração</h2>
          <p className="text-muted-foreground">Não foi possível carregar a configuração da clínica.</p>
        </div>
      </div>
    );
  }
  
  console.log('🏥 [ClinicaLoader] Clínica carregada, renderizando children');
  return <>{children}</>;
} 
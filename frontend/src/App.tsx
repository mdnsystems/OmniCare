import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Login } from './pages/auth/Login';
import { SidebarLayout } from './components/sidebar-layout';
import { useAuth } from './contexts/AuthContext';
import React from 'react';

// Lazy loading para todas as páginas - usando função helper para lidar com diferentes tipos de export
const createLazyComponent = (importFn: () => Promise<Record<string, React.ComponentType<unknown>>>, exportName?: string) => {
  return lazy(() => 
    importFn().then(module => ({
      default: exportName ? module[exportName] : module.default
    }))
  );
};

// Lazy loading para todas as páginas
const DashboardAdministrativo = createLazyComponent(() => import('./pages/dashboard/Administrativo'), 'DashboardAdministrativo');
const DashboardProfissional = createLazyComponent(() => import('./pages/dashboard/Profissional'), 'DashboardProfissional');
const DashboardRecepcionista = createLazyComponent(() => import('./pages/dashboard/Recepcionista'), 'DashboardRecepcionista');
const DashboardAtividades = createLazyComponent(() => import('./pages/dashboard/atividades'), 'DashboardAtividades');
const ListaAgendamentos = createLazyComponent(() => import('./pages/agendamentos'), 'ListaAgendamentos');
const Confirmacoes = createLazyComponent(() => import('./pages/agendamentos/Confirmacoes'), 'Confirmacoes');
const NovoAgendamento = createLazyComponent(() => import('./pages/agendamentos/NovoAgendamento'), 'NovoAgendamento');
const ListaPacientes = createLazyComponent(() => import('./pages/pacientes/ListaPacientes'), 'ListaPacientes');
const NovoPaciente = createLazyComponent(() => import('./pages/pacientes/NovoPaciente'), 'NovoPaciente');
const ListaProfissionais = createLazyComponent(() => import('./pages/profissionais/ListaProfissionais'), 'ListaProfissionais');
const Especialidades = createLazyComponent(() => import('./pages/profissionais/Especialidades'), 'Especialidades');
const NovaEspecialidade = createLazyComponent(() => import('./pages/profissionais/NovaEspecialidade'), 'NovaEspecialidade');
const NovoProfissional = createLazyComponent(() => import('./pages/profissionais/NovoProfissional'), 'NovoProfissional');
const Prontuarios = createLazyComponent(() => import('./pages/prontuarios'), 'Prontuarios');
const ListaProntuarios = createLazyComponent(() => import('./pages/prontuarios/ListaProntuarios'), 'ListaProntuarios');
const ModelosProntuario = createLazyComponent(() => import('./pages/prontuarios/ModelosProntuario'), 'ModelosProntuario');
const NovoProntuario = createLazyComponent(() => import('./pages/prontuarios/NovoProntuario'), 'NovoProntuario');
const NovoModelo = createLazyComponent(() => import('./pages/prontuarios/NovoModelo'), 'NovoModelo');
const ProntuariosHoje = createLazyComponent(() => import('./pages/prontuarios/ProntuariosHoje'), 'ProntuariosHoje');
const Anamnese = createLazyComponent(() => import('./pages/anamnese')); // default export
const NovaAnamnese = createLazyComponent(() => import('./pages/anamnese/NovaAnamnese')); // default export
const ConfiguracaoClinica = createLazyComponent(() => import('./pages/configuracao/ConfiguracaoClinica'), 'ConfiguracaoClinica');
const WhatsAppConfig = createLazyComponent(() => import('./pages/configuracao/WhatsAppConfig'), 'WhatsAppConfig');
const DemonstracaoMultitenant = createLazyComponent(() => import('./pages/configuracao/DemonstracaoMultitenant'), 'DemonstracaoMultitenant');
const Financeiro = createLazyComponent(() => import('./pages/financeiro'), 'Financeiro');
const Faturamento = createLazyComponent(() => import('./pages/financeiro/faturamento'), 'Faturamento');
const Pagamentos = createLazyComponent(() => import('./pages/financeiro/pagamentos'), 'Pagamentos');
const Relatorios = createLazyComponent(() => import('./pages/financeiro/relatorios'), 'Relatorios');
const ControleFinanceiro = createLazyComponent(() => import('./pages/admin/ControleFinanceiro'), 'ControleFinanceiro');
const ChatPage = createLazyComponent(() => import('./pages/chat'), 'ChatPage');
const SuperAdminDashboard = createLazyComponent(() => import('./pages/super-admin/SuperAdminDashboard'), 'SuperAdminDashboard');
const GestaoClinicas = createLazyComponent(() => import('./pages/super-admin/GestaoClinicas'), 'GestaoClinicas');
const DetalhesClinica = createLazyComponent(() => import('./pages/super-admin/DetalhesClinica'), 'DetalhesClinica');
const RelatoriosSuperAdmin = createLazyComponent(() => import('./pages/super-admin/RelatoriosSuperAdmin'), 'RelatoriosSuperAdmin');
const RelatorioUsuarios = createLazyComponent(() => import('./pages/super-admin/RelatorioUsuarios'), 'RelatorioUsuarios');
const RelatorioAtividades = createLazyComponent(() => import('./pages/super-admin/RelatorioAtividades'), 'RelatorioAtividades');
const RelatorioGestaoClinicas = createLazyComponent(() => import('./pages/super-admin/RelatorioGestaoClinicas'), 'RelatorioGestaoClinicas');
const RelatorioChat = createLazyComponent(() => import('./pages/super-admin/RelatorioChat'), 'RelatorioChat');

// Componente de loading para o Suspense
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Função para obter rotas baseadas na role do usuário
const getRoutesByRole = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return (
        <>
          {/* Rotas do SUPER_ADMIN - Gestão de Clínicas e Relatórios Macro */}
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/clinicas" element={<GestaoClinicas />} />
          <Route path="/super-admin/clinicas/:id" element={<DetalhesClinica />} />
          <Route path="/super-admin/relatorios" element={<RelatoriosSuperAdmin />} />
          <Route path="/super-admin/relatorios/usuarios" element={<RelatorioUsuarios />} />
          <Route path="/super-admin/relatorios/atividades" element={<RelatorioAtividades />} />
          <Route path="/super-admin/relatorios/gestao-clinicas" element={<RelatorioGestaoClinicas />} />
          <Route path="/super-admin/relatorios/chat" element={<RelatorioChat />} />
        </>
      );

    case 'ADMIN':
      return (
        <>
          {/* Rotas do dashboard */}
          <Route path="/dashboard/administrativo" element={<DashboardAdministrativo />} />
          <Route path="/dashboard/atividades" element={<DashboardAtividades />} />

          {/* Rotas de agendamentos */}
          <Route path="/agendamentos" element={<ListaAgendamentos />} />
          <Route path="/agendamentos/confirmacoes" element={<Confirmacoes />} />
          <Route path="/agendamentos/novo" element={<NovoAgendamento />} />

          {/* Rotas de pacientes */}
          <Route path="/pacientes" element={<ListaPacientes />} />
          <Route path="/pacientes/novo" element={<NovoPaciente />} />

          {/* Rotas de profissionais */}
          <Route path="/profissionais" element={<ListaProfissionais />} />
          <Route path="/profissionais/especialidades" element={<Especialidades />} />
          <Route path="/profissionais/especialidades/nova" element={<NovaEspecialidade />} />
          <Route path="/profissionais/novo" element={<NovoProfissional />} />

          {/* Rotas de prontuários */}
          <Route path="/prontuarios" element={<Prontuarios />} />
          <Route path="/prontuarios/lista" element={<ListaProntuarios />} />
          <Route path="/prontuarios/modelos" element={<ModelosProntuario />} />
          <Route path="/prontuarios/modelos/novo" element={<NovoModelo />} />
          <Route path="/prontuarios/novo" element={<NovoProntuario />} />
          <Route path="/prontuarios/hoje" element={<ProntuariosHoje />} />

          {/* Rotas de anamnese */}
          <Route path="/anamnese" element={<Anamnese />} />
          <Route path="/anamnese/nova" element={<NovaAnamnese />} />

          {/* Rotas de configuração */}
          <Route path="/configuracao" element={<ConfiguracaoClinica />} />
          <Route path="/configuracao/whatsapp" element={<WhatsAppConfig />} />
          <Route path="/configuracao/demonstracao" element={<DemonstracaoMultitenant />} />

          {/* Rotas financeiras */}
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/financeiro/faturamento" element={<Faturamento />} />
          <Route path="/financeiro/pagamentos" element={<Pagamentos />} />
          <Route path="/financeiro/relatorios" element={<Relatorios />} />
          <Route path="/admin/controle-financeiro" element={<ControleFinanceiro />} />

          {/* Rotas de chat */}
          <Route path="/chat" element={<ChatPage />} />
        </>
      );

    case 'PROFISSIONAL':
      return (
        <>
          {/* Rotas do dashboard */}
          <Route path="/dashboard/profissional" element={<DashboardProfissional />} />
          <Route path="/dashboard/atividades" element={<DashboardAtividades />} />

          {/* Rotas de agendamentos */}
          <Route path="/agendamentos" element={<ListaAgendamentos />} />
          <Route path="/agendamentos/confirmacoes" element={<Confirmacoes />} />

          {/* Rotas de pacientes */}
          <Route path="/pacientes" element={<ListaPacientes />} />

          {/* Rotas de prontuários */}
          <Route path="/prontuarios" element={<Prontuarios />} />
          <Route path="/prontuarios/lista" element={<ListaProntuarios />} />
          <Route path="/prontuarios/modelos" element={<ModelosProntuario />} />
          <Route path="/prontuarios/novo" element={<NovoProntuario />} />
          <Route path="/prontuarios/hoje" element={<ProntuariosHoje />} />

          {/* Rotas de anamnese */}
          <Route path="/anamnese" element={<Anamnese />} />
          <Route path="/anamnese/nova" element={<NovaAnamnese />} />

          {/* Rotas de chat */}
          <Route path="/chat" element={<ChatPage />} />
        </>
      );

    case 'RECEPCIONISTA':
      return (
        <>
          {/* Rotas do dashboard */}
          <Route path="/dashboard/recepcionista" element={<DashboardRecepcionista />} />
          <Route path="/dashboard/atividades" element={<DashboardAtividades />} />

          {/* Rotas de agendamentos */}
          <Route path="/agendamentos" element={<ListaAgendamentos />} />
          <Route path="/agendamentos/confirmacoes" element={<Confirmacoes />} />
          <Route path="/agendamentos/novo" element={<NovoAgendamento />} />

          {/* Rotas de pacientes */}
          <Route path="/pacientes" element={<ListaPacientes />} />
          <Route path="/pacientes/novo" element={<NovoPaciente />} />

          {/* Rotas de profissionais */}
          <Route path="/profissionais" element={<ListaProfissionais />} />
          <Route path="/profissionais/especialidades" element={<Especialidades />} />

          {/* Rotas de chat */}
          <Route path="/chat" element={<ChatPage />} />
        </>
      );

    default:
      return null;
  }
};

// Função para obter a rota padrão baseada na role
const getDefaultRoute = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/super-admin';
    case 'ADMIN':
      return '/dashboard/administrativo';
    case 'PROFISSIONAL':
      return '/dashboard/profissional';
    case 'RECEPCIONISTA':
      return '/dashboard/recepcionista';
    default:
      return '/dashboard';
  }
};

function AppContent() {
  const { isAuthenticated, user, isInitialized } = useAuth();
  const location = useLocation();

  console.log('🚀 [AppContent] Estado atual:', {
    isAuthenticated,
    hasUser: !!user,
    userRole: user?.role,
    isInitialized,
    currentPath: location.pathname
  });

  // Aguardar inicialização do AuthContext
  if (!isInitialized) {
    console.log('🚀 [AppContent] Aguardando inicialização do AuthContext...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar apenas a tela de login
  if (!isAuthenticated) {
    console.log('🚀 [AppContent] Usuário não autenticado, mostrando login');
    return (
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    );
  }

  // Se estiver na página de login e já autenticado, redireciona para dashboard
  if (location.pathname === '/login') {
    const redirectPath = getDefaultRoute(user?.role || '');
    console.log('🚀 [AppContent] Usuário autenticado na página de login, redirecionando para:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Se estiver autenticado, mostrar o layout com sidebar
  console.log('🚀 [AppContent] Usuário autenticado, mostrando layout com sidebar');
  return (
    <>
      <SidebarLayout>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* Rotas específicas da role do usuário */}
            {getRoutesByRole(user?.role || '')}

            {/* Rota padrão - redireciona para dashboard baseado no role */}
            <Route 
              path="/dashboard" 
              element={<Navigate to={getDefaultRoute(user?.role || '')} replace />} 
            />

            {/* Rota raiz - redireciona para dashboard */}
            <Route path="/" element={<Navigate to={getDefaultRoute(user?.role || '')} replace />} />

            {/* Rota de fallback - redireciona para dashboard */}
            <Route path="*" element={<Navigate to={getDefaultRoute(user?.role || '')} replace />} />
          </Routes>
        </Suspense>
      </SidebarLayout>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;

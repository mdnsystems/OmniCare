"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  UserX, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Stethoscope,
  Bell,
  CheckCircle,
  XCircle,
  Info,
  Phone,
  MessageSquare,
  ClipboardList,
  Heart,
  Activity
} from 'lucide-react';
import { useDashboard, useEstatisticasPacientes, useEstatisticasAnamnese } from '@/hooks/useDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardInsightsProps {
  className?: string;
}

export function DashboardInsights({ className }: DashboardInsightsProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: dashboardData, isLoading: isLoadingDashboard } = useDashboard();
  
  // Chamadas condicionais baseadas no role do usuário
  const shouldFetchPacientes = user?.role === 'ADMIN' || user?.role === 'PROFISSIONAL';
  const shouldFetchAnamnese = user?.role === 'ADMIN' || user?.role === 'PROFISSIONAL';
  
  const { data: pacientesData, isLoading: isLoadingPacientes } = useEstatisticasPacientes({
    enabled: shouldFetchPacientes
  });
  
  const { data: anamneseData, isLoading: isLoadingAnamnese } = useEstatisticasAnamnese({
    enabled: shouldFetchAnamnese
  });

  const isLoading = isLoadingDashboard || 
    (shouldFetchPacientes && isLoadingPacientes) || 
    (shouldFetchAnamnese && isLoadingAnamnese);

  // Calcular insights baseados no role
  const getInsights = () => {
    if (!dashboardData) return [];

    const insights = [];

    switch (user?.role) {
      case 'ADMIN':
        return getAdminInsights();
      case 'PROFISSIONAL':
        return getProfissionalInsights();
      case 'RECEPCIONISTA':
        return getRecepcionistaInsights();
      default:
        return [];
    }
  };

  // Insights para ADMIN (mantém os originais)
  const getAdminInsights = () => {
    const insights = [];

    // 1. Taxa de ocupação hoje
    const taxaOcupacao = dashboardData.agendamentos.hoje > 0 
      ? (dashboardData.agendamentos.realizados / dashboardData.agendamentos.hoje) * 100 
      : 0;
    
    if (taxaOcupacao < 70) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="h-4 w-4" />,
        title: 'Baixa Ocupação',
        description: `Apenas ${taxaOcupacao.toFixed(1)}% das consultas foram realizadas hoje`,
        action: 'Ver Agendamentos',
        onClick: () => navigate('/agendamentos')
      });
    }

    // 2. Cancelamentos altos
    if (dashboardData.agendamentos.cancelados > 3) {
      insights.push({
        type: 'danger',
        icon: <UserX className="h-4 w-4" />,
        title: 'Muitos Cancelamentos',
        description: `${dashboardData.agendamentos.cancelados} consultas canceladas hoje`,
        action: 'Analisar',
        onClick: () => navigate('/relatorios/consultas')
      });
    }

    // 3. Pacientes sem anamnese
    if (pacientesData && anamneseData) {
      const pacientesSemAnamnese = pacientesData.total - anamneseData.pacientesComAnamnese;
      if (pacientesSemAnamnese > 10) {
        insights.push({
          type: 'info',
          icon: <FileText className="h-4 w-4" />,
          title: 'Anamneses Pendentes',
          description: `${pacientesSemAnamnese} pacientes sem anamnese`,
          action: 'Ver Pacientes',
          onClick: () => navigate('/anamnese')
        });
      }
    }

    // 4. Receita pendente alta
    if (dashboardData.financeiro.receitaPendente > 1000) {
      insights.push({
        type: 'warning',
        icon: <DollarSign className="h-4 w-4" />,
        title: 'Receita Pendente',
        description: `R$ ${dashboardData.financeiro.receitaPendente.toLocaleString('pt-BR')} em aberto`,
        action: 'Ver Financeiro',
        onClick: () => navigate('/financeiro')
      });
    }

    // 5. Performance do mês
    const performanceMes = dashboardData.agendamentos.taxaSucesso;
    if (performanceMes < 80) {
      insights.push({
        type: 'danger',
        icon: <TrendingDown className="h-4 w-4" />,
        title: 'Performance Baixa',
        description: `${performanceMes.toFixed(1)}% de taxa de sucesso no mês`,
        action: 'Analisar',
        onClick: () => navigate('/relatorios/consultas')
      });
    }

    // 6. Novos pacientes
    if (dashboardData.pacientes.novosMes > 20) {
      insights.push({
        type: 'success',
        icon: <TrendingUp className="h-4 w-4" />,
        title: 'Crescimento',
        description: `${dashboardData.pacientes.novosMes} novos pacientes este mês`,
        action: 'Ver Pacientes',
        onClick: () => navigate('/pacientes')
      });
    }

    return insights;
  };

  // Insights para PROFISSIONAL
  const getProfissionalInsights = () => {
    const insights = [];

    // 1. Próximas consultas
    if (dashboardData.agendamentos.hoje > 0) {
      insights.push({
        type: 'info',
        icon: <Calendar className="h-4 w-4" />,
        title: 'Consultas Hoje',
        description: `${dashboardData.agendamentos.hoje} pacientes agendados para hoje`,
        action: 'Ver Agenda',
        onClick: () => navigate('/agendamentos')
      });
    }

    // 2. Prontuários pendentes
    if (dashboardData.prontuarios.mes < 5) {
      insights.push({
        type: 'warning',
        icon: <FileText className="h-4 w-4" />,
        title: 'Prontuários Pendentes',
        description: 'Atualize os prontuários dos pacientes atendidos',
        action: 'Ver Prontuários',
        onClick: () => navigate('/prontuarios')
      });
    }

    // 3. Anamneses para fazer
    if (anamneseData && anamneseData.total < 10) {
      insights.push({
        type: 'info',
        icon: <ClipboardList className="h-4 w-4" />,
        title: 'Anamneses',
        description: 'Complete as anamneses dos pacientes',
        action: 'Ver Anamneses',
        onClick: () => navigate('/anamnese')
      });
    }

    // 4. Performance pessoal
    const taxaSucesso = dashboardData.agendamentos.taxaSucesso;
    if (taxaSucesso < 85) {
      insights.push({
        type: 'warning',
        icon: <TrendingDown className="h-4 w-4" />,
        title: 'Performance',
        description: `${taxaSucesso.toFixed(1)}% de taxa de sucesso`,
        action: 'Analisar',
        onClick: () => navigate('/relatorios/consultas')
      });
    }

    return insights;
  };

  // Insights para RECEPCIONISTA
  const getRecepcionistaInsights = () => {
    const insights = [];

    // 1. Confirmações pendentes
    if (dashboardData.agendamentos.hoje > 5) {
      insights.push({
        type: 'info',
        icon: <Phone className="h-4 w-4" />,
        title: 'Confirmações',
        description: `${dashboardData.agendamentos.hoje} consultas para confirmar hoje`,
        action: 'Confirmar',
        onClick: () => navigate('/agendamentos/confirmacoes')
      });
    }

    // 2. Novos pacientes
    if (dashboardData.pacientes.novosMes > 15) {
      insights.push({
        type: 'success',
        icon: <Users className="h-4 w-4" />,
        title: 'Novos Pacientes',
        description: `${dashboardData.pacientes.novosMes} novos pacientes este mês`,
        action: 'Ver Pacientes',
        onClick: () => navigate('/pacientes')
      });
    }

    // 3. Cancelamentos
    if (dashboardData.agendamentos.cancelados > 2) {
      insights.push({
        type: 'warning',
        icon: <UserX className="h-4 w-4" />,
        title: 'Cancelamentos',
        description: `${dashboardData.agendamentos.cancelados} consultas canceladas`,
        action: 'Analisar',
        onClick: () => navigate('/agendamentos')
      });
    }

    // 4. Lembretes
    insights.push({
      type: 'info',
      icon: <Bell className="h-4 w-4" />,
      title: 'Lembretes',
      description: 'Envie lembretes para consultas de amanhã',
      action: 'Enviar',
      onClick: () => navigate('/agendamentos')
    });

    return insights;
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'danger':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'danger':
        return 'text-red-600 dark:text-red-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 dark:border-green-800 text-green-700 dark:text-green-300';
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300';
      case 'danger':
        return 'border-red-200 dark:border-red-800 text-red-700 dark:text-red-300';
      case 'info':
        return 'border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';
      default:
        return 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  // Obter título baseado no role
  const getTitle = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'Insights Gerenciais';
      case 'PROFISSIONAL':
        return 'Insights Profissionais';
      case 'RECEPCIONISTA':
        return 'Insights Operacionais';
      default:
        return 'Insights';
    }
  };

  // Obter ícone baseado no role
  const getIcon = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <Bell className="w-5 h-5 text-purple-700 dark:text-purple-400" />;
      case 'PROFISSIONAL':
        return <Stethoscope className="w-5 h-5 text-blue-700 dark:text-blue-400" />;
      case 'RECEPCIONISTA':
        return <Activity className="w-5 h-5 text-green-700 dark:text-green-400" />;
      default:
        return <Bell className="w-5 h-5 text-purple-700 dark:text-purple-400" />;
    }
  };

  // Obter cor do ícone baseado no role
  const getIconBgColor = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'bg-purple-100 dark:bg-purple-900/30';
      case 'PROFISSIONAL':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'RECEPCIONISTA':
        return 'bg-green-100 dark:bg-green-900/30';
      default:
        return 'bg-purple-100 dark:bg-purple-900/30';
    }
  };

  const insights = getInsights();

  return (
    <Card className={`${className} flex flex-col h-[600px]`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg ${getIconBgColor()}`}>
              {getIcon()}
            </div>
            <div>
              <CardTitle className="text-xl">{getTitle()}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {insights.length} itens
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col">
        {isLoading ? (
          <div className="space-y-3 flex-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : insights.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              Tudo em ordem!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Nenhum item pendente para hoje
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getInsightColor(insight.type)} transition-colors hover:bg-opacity-80`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${getIconColor(insight.type)}`}>
                      {insight.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium">
                          {insight.title}
                        </h4>
                        <Badge variant="outline" className={`text-xs ${getBadgeColor(insight.type)}`}>
                          {insight.type === 'success' && 'Sucesso'}
                          {insight.type === 'warning' && 'Atenção'}
                          {insight.type === 'danger' && 'Crítico'}
                          {insight.type === 'info' && 'Info'}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">
                        {insight.description}
                      </p>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={insight.onClick}
                        className="h-6 px-2 text-xs"
                      >
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo rápido baseado no role */}
            {dashboardData && (
              <>
                <Separator className="my-4 flex-shrink-0" />
                <div className="grid grid-cols-2 gap-3 text-xs flex-shrink-0">
                  {user?.role === 'ADMIN' ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-blue-500" />
                        <span className="text-muted-foreground">Hoje:</span>
                        <span className="font-medium">{dashboardData.agendamentos.hoje} consultas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-green-500" />
                        <span className="text-muted-foreground">Pacientes:</span>
                        <span className="font-medium">{dashboardData.pacientes.total}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-3 w-3 text-purple-500" />
                        <span className="text-muted-foreground">Profissionais:</span>
                        <span className="font-medium">{dashboardData.profissionais.ativos}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3 text-orange-500" />
                        <span className="text-muted-foreground">Receita:</span>
                        <span className="font-medium">
                          R$ {dashboardData.financeiro.receitaTotal.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </>
                  ) : user?.role === 'PROFISSIONAL' ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-blue-500" />
                        <span className="text-muted-foreground">Consultas:</span>
                        <span className="font-medium">{dashboardData.agendamentos.hoje} hoje</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3 text-green-500" />
                        <span className="text-muted-foreground">Prontuários:</span>
                        <span className="font-medium">{dashboardData.prontuarios.mes} este mês</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-3 w-3 text-purple-500" />
                        <span className="text-muted-foreground">Anamneses:</span>
                        <span className="font-medium">{anamneseData?.total || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-orange-500" />
                        <span className="text-muted-foreground">Pacientes:</span>
                        <span className="font-medium">{dashboardData.pacientes.total}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-blue-500" />
                        <span className="text-muted-foreground">Agendamentos:</span>
                        <span className="font-medium">{dashboardData.agendamentos.hoje} hoje</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-3 w-3 text-green-500" />
                        <span className="text-muted-foreground">Novos:</span>
                        <span className="font-medium">{dashboardData.pacientes.novosMes} este mês</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserX className="h-3 w-3 text-red-500" />
                        <span className="text-muted-foreground">Cancelamentos:</span>
                        <span className="font-medium">{dashboardData.agendamentos.cancelados}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-purple-500" />
                        <span className="text-muted-foreground">Confirmações:</span>
                        <span className="font-medium">Pendentes</span>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
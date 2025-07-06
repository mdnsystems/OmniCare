import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  TrendingUp,
  Activity,
  Bell,
  MessageSquare,
  FileText,
  DollarSign,
  Star,
  BarChart3,
  LineChart
} from "lucide-react"
import { useClinica } from "@/contexts/ClinicaContext"
import { useEstatisticasAtividades, useEvolucaoSemanal } from "@/hooks/useDashboard"
import { EvolucaoSemanalChart, EvolucaoReceitaChart } from "@/components/charts/EvolucaoSemanalChart"

export function DashboardAtividades() {
  const { getNomenclatura } = useClinica()
  const { data: metricasAtividades, isLoading, error } = useEstatisticasAtividades();
  const { data: evolucaoSemanal, isLoading: isLoadingEvolucao } = useEvolucaoSemanal();
  const [activeTab, setActiveTab] = useState("hoje")

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Erro ao carregar dados de atividades
      </div>
    );
  }

  const metricas = metricasAtividades || {
    agendamentosSemana: 0,
    agendamentosRealizadosSemana: 0,
    prontuariosSemana: 0,
    anamneseSemana: 0,
    receitaSemana: 0,
    taxaSucesso: 0
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "agendamento":
        return <Calendar className="h-4 w-4" />
      case "pagamento":
        return <DollarSign className="h-4 w-4" />
      case "cancelamento":
        return <UserX className="h-4 w-4" />
      case "prontuario":
        return <FileText className="h-4 w-4" />
      case "satisfacao":
        return <Star className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
      case "concluido":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "cancelado":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "em_andamento":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "pendente":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "normal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "baixa":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{getNomenclatura('consultas')} da Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.agendamentosSemana}</div>
            <p className="text-xs text-muted-foreground">
              {metricas.agendamentosRealizadosSemana} realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Semanal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {metricas.receitaSemana.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              Total da semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.taxaSucesso.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {getNomenclatura('consultas')} realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prontuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.prontuariosSemana}</div>
            <p className="text-xs text-muted-foreground">
              Criados esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Semanal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{getNomenclatura('consultas')} Realizadas</span>
                <span className="text-sm font-bold">{metricas.agendamentosRealizadosSemana}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${metricas.agendamentosSemana > 0 ? (metricas.agendamentosRealizadosSemana / metricas.agendamentosSemana) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Receita Gerada</span>
                <span className="text-sm font-bold">R$ {metricas.receitaSemana.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taxa de Ocupação</span>
                <span className="text-sm font-bold">{metricas.taxaSucesso.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${metricas.taxaSucesso}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Prontuários criados</span>
                </div>
                <Badge variant="secondary">{metricas.prontuariosSemana}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Anamnese realizadas</span>
                </div>
                <Badge variant="secondary">{metricas.anamneseSemana}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">{getNomenclatura('consultas')} agendadas</span>
                </div>
                <Badge variant="secondary">{metricas.agendamentosSemana}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Receita gerada</span>
                </div>
                <Badge variant="secondary">R$ {metricas.receitaSemana.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingEvolucao ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <EvolucaoSemanalChart 
                tipo="line" 
                altura={250} 
                data={evolucaoSemanal}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução da Receita</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingEvolucao ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <EvolucaoReceitaChart 
                altura={250} 
                data={evolucaoSemanal}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
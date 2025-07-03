import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Users, 
  Activity, 
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useRelatorioGestaoClinicas } from "@/hooks/useSuperAdmin"

export function SuperAdminDashboard() {
  const navigate = useNavigate()
  const { data: relatorio, isLoading } = useRelatorioGestaoClinicas()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando dados do sistema...</p>
        </div>
      </div>
    )
  }

  const estatisticas = relatorio?.estatisticas || {
    total: 0,
    ativas: 0,
    inativas: 0,
    comPlanoAtivo: 0,
    comPlanoExpirado: 0
  }

  const clinicasRecentes = relatorio?.clinicas?.slice(0, 5) || []

  const cardsPrincipais = [
    {
      titulo: "Total de Clínicas",
      valor: estatisticas.total,
      icon: Building2,
      cor: "bg-blue-100 dark:bg-blue-900/30",
      corIcon: "text-blue-600 dark:text-blue-400",
      rota: "/super-admin/clinicas"
    },
    {
      titulo: "Clínicas Ativas",
      valor: estatisticas.ativas,
      icon: CheckCircle,
      cor: "bg-green-100 dark:bg-green-900/30",
      corIcon: "text-green-600 dark:text-green-400",
      rota: "/super-admin/clinicas"
    },
    {
      titulo: "Planos Ativos",
      valor: estatisticas.comPlanoAtivo,
      icon: TrendingUp,
      cor: "bg-purple-100 dark:bg-purple-900/30",
      corIcon: "text-purple-600 dark:text-purple-400",
      rota: "/super-admin/relatorios/gestao-clinicas"
    },
    {
      titulo: "Planos Expirados",
      valor: estatisticas.comPlanoExpirado,
      icon: AlertTriangle,
      cor: "bg-orange-100 dark:bg-orange-900/30",
      corIcon: "text-orange-600 dark:text-orange-400",
      rota: "/super-admin/relatorios/gestao-clinicas"
    }
  ]

  const modulosAcesso = [
    {
      id: "clinicas",
      titulo: "Gestão de Clínicas",
      descricao: "Gerencie todas as clínicas cadastradas no sistema",
      icon: Building2,
      rota: "/super-admin/clinicas",
      cor: "bg-blue-100 dark:bg-blue-900/30",
      corIcon: "text-blue-600 dark:text-blue-400"
    },
    {
      id: "usuarios",
      titulo: "Usuários e Permissões",
      descricao: "Relatórios de gestão de usuários e permissões",
      icon: Users,
      rota: "/super-admin/relatorios/usuarios",
      cor: "bg-green-100 dark:bg-green-900/30",
      corIcon: "text-green-600 dark:text-green-400"
    },
    {
      id: "atividades",
      titulo: "Monitoramento de Atividades",
      descricao: "Acompanhe as atividades das clínicas",
      icon: Activity,
      rota: "/super-admin/relatorios/atividades",
      cor: "bg-purple-100 dark:bg-purple-900/30",
      corIcon: "text-purple-600 dark:text-purple-400"
    },
    {
      id: "chat",
      titulo: "Chat e Comunicação",
      descricao: "Relatórios de comunicação entre clínicas",
      icon: MessageSquare,
      rota: "/super-admin/relatorios/chat",
      cor: "bg-orange-100 dark:bg-orange-900/30",
      corIcon: "text-orange-600 dark:text-orange-400"
    }
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Super Admin</h1>
          <p className="text-muted-foreground">
            Visão macro do sistema e gestão de clínicas
          </p>
        </div>
      </div>

      {/* Cards Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cardsPrincipais.map((card) => (
          <Card 
            key={card.titulo}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(card.rota)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.titulo}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.cor}`}>
                <card.icon className={`h-4 w-4 ${card.corIcon}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.valor}</div>
              <p className="text-xs text-muted-foreground">
                Clínicas no sistema
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Módulos de Acesso */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {modulosAcesso.map((modulo) => (
          <Card 
            key={modulo.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(modulo.rota)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className={`p-2 rounded-lg ${modulo.cor}`}>
                <modulo.icon className={`h-4 w-4 ${modulo.corIcon}`} />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg font-semibold mb-2">
                {modulo.titulo}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {modulo.descricao}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Clínicas Recentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Clínicas Recentes</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/super-admin/clinicas")}
            >
              Ver Todas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clinicasRecentes.length > 0 ? (
              clinicasRecentes.map((clinica) => (
                <div 
                  key={clinica.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/super-admin/clinicas/${clinica.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">{clinica.nome}</h4>
                      <p className="text-sm text-muted-foreground">{clinica.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={clinica.ativo ? "default" : "secondary"}>
                      {clinica.ativo ? "Ativa" : "Inativa"}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Nenhuma clínica cadastrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
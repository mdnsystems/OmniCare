import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Users, 
  Activity,
  MessageSquare,
  Building2,
  TrendingUp,
  ArrowRight
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export function RelatoriosSuperAdmin() {
  const navigate = useNavigate()

  const modulosRelatorios = [
    {
      id: "usuarios",
      titulo: "Usuários e Permissões",
      descricao: "Relatórios de gestão de usuários e permissões por clínica",
      icon: Users,
      rota: "/super-admin/relatorios/usuarios",
      cor: "bg-blue-100 dark:bg-blue-900/30",
      corIcon: "text-blue-600 dark:text-blue-400"
    },
    {
      id: "atividades",
      titulo: "Monitoramento de Atividades",
      descricao: "Acompanhe as atividades e acessos das clínicas",
      icon: Activity,
      rota: "/super-admin/relatorios/atividades",
      cor: "bg-green-100 dark:bg-green-900/30",
      corIcon: "text-green-600 dark:text-green-400"
    },
    {
      id: "gestao-clinicas",
      titulo: "Gestão de Clínicas",
      descricao: "Relatórios de status e gestão das clínicas",
      icon: Building2,
      rota: "/super-admin/relatorios/gestao-clinicas",
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
          <h1 className="text-3xl font-bold tracking-tight">Relatórios Super Admin</h1>
          <p className="text-muted-foreground">
            Relatórios macro para gestão e monitoramento do sistema
          </p>
        </div>
        <Button onClick={() => navigate("/super-admin")}>
          Voltar ao Dashboard
        </Button>
      </div>

      {/* Módulos de Relatórios */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {modulosRelatorios.map((modulo) => (
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

      {/* Informações sobre Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle>Informações sobre os Relatórios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">🔒 Privacidade e LGPD</h4>
              <p className="text-sm text-muted-foreground">
                Todos os relatórios respeitam a privacidade dos dados dos clientes. 
                Apenas informações macro e volumetria são exibidas, sem acesso a 
                dados sensíveis como prontuários, anamneses ou informações pessoais.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📊 Dados Macro</h4>
              <p className="text-sm text-muted-foreground">
                Os relatórios fornecem visão macro do sistema, incluindo estatísticas 
                de uso, distribuição de usuários, atividades gerais e status das clínicas, 
                sempre mantendo a confidencialidade dos dados privados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
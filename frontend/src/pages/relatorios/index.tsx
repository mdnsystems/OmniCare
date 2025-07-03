import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  FileText, 
  TrendingUp,
  Calendar,
  Users,
  Star,
  Activity,
  PieChart
} from "lucide-react"
import { useClinica } from "@/contexts/ClinicaContext"
import { useNavigate } from "react-router-dom"

export function Relatorios() {
  const { getNomenclatura } = useClinica()
  const navigate = useNavigate()

  const modulosRelatorios = [
    {
      id: "consultas",
      titulo: `Relatórios de ${getNomenclatura('consultas')}`,
      descricao: `Análise detalhada das ${getNomenclatura('consultas')} da clínica`,
      icon: Calendar,
      rota: "/relatorios/consultas",
      cor: "bg-blue-100 dark:bg-blue-900/30",
      corIcon: "text-blue-600 dark:text-blue-400"
    },
    {
      id: "receitas",
      titulo: "Relatórios de Receitas",
      descricao: "Análise financeira e projeções de receita",
      icon: TrendingUp,
      rota: "/relatorios/receitas",
      cor: "bg-green-100 dark:bg-green-900/30",
      corIcon: "text-green-600 dark:text-green-400"
    },
    {
      id: "desempenho",
      titulo: "Relatórios de Desempenho",
      descricao: "Métricas de performance e indicadores operacionais",
      icon: Activity,
      rota: "/relatorios/desempenho",
      cor: "bg-purple-100 dark:bg-purple-900/30",
      corIcon: "text-purple-600 dark:text-purple-400"
    }
  ]

  const metricasRelatorios = {
    totalRelatorios: 12,
    relatoriosGerados: 8,
    relatoriosPendentes: 4,
    satisfacaoRelatorios: 4.8
  }

  const relatoriosRecentes = [
    {
      id: "1",
      nome: "Relatório de Faturamento Mensal",
      tipo: "Financeiro",
      dataGeracao: "2024-01-15",
      status: "concluido"
    },
    {
      id: "2",
      nome: `Relatório de ${getNomenclatura('consultas')} por Profissional`,
      tipo: "Operacional",
      dataGeracao: "2024-01-14",
      status: "concluido"
    },
    {
      id: "3",
      nome: "Relatório de Satisfação dos Pacientes",
      tipo: "Qualidade",
      dataGeracao: "2024-01-13",
      status: "pendente"
    }
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Módulo de Relatórios</h1>
          <p className="text-muted-foreground">
            Acesse relatórios detalhados e análises da clínica
          </p>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Relatórios</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricasRelatorios.totalRelatorios}</div>
            <p className="text-xs text-muted-foreground">
              Relatórios disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gerados Este Mês</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metricasRelatorios.relatoriosGerados}</div>
            <p className="text-xs text-muted-foreground">
              {((metricasRelatorios.relatoriosGerados / metricasRelatorios.totalRelatorios) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metricasRelatorios.relatoriosPendentes}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando geração
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricasRelatorios.satisfacaoRelatorios}/5.0</div>
            <p className="text-xs text-muted-foreground">
              Avaliação dos usuários
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulosRelatorios.map((modulo) => (
          <Card key={modulo.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${modulo.cor}`}>
                  <modulo.icon className={`h-6 w-6 ${modulo.corIcon}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{modulo.titulo}</CardTitle>
                  <p className="text-sm text-muted-foreground">{modulo.descricao}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate(modulo.rota)}
              >
                Acessar {modulo.titulo}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Relatórios Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {relatoriosRecentes.map((relatorio) => (
              <div key={relatorio.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">{relatorio.nome}</h3>
                    <p className="text-sm text-muted-foreground">{relatorio.tipo}</p>
                    <p className="text-xs text-muted-foreground">
                      Gerado em: {new Date(relatorio.dataGeracao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={relatorio.status === 'concluido' ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    {relatorio.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Visualizar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Funcionalidades dos Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades dos Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Relatórios de {getNomenclatura('consultas')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• {getNomenclatura('consultas')} por período</li>
                <li>• Performance por profissional</li>
                <li>• Taxa de ocupação</li>
                <li>• Cancelamentos e remarcações</li>
                <li>• Satisfação dos pacientes</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Relatórios de Receitas</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Receita por período</li>
                <li>• Análise por serviço</li>
                <li>• Receita por paciente</li>
                <li>• Projeções futuras</li>
                <li>• Comparativo entre períodos</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Relatórios de Desempenho</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Desempenho por profissional</li>
                <li>• Métricas operacionais</li>
                <li>• Indicadores de qualidade</li>
                <li>• Eficiência de atendimento</li>
                <li>• KPIs da clínica</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Recursos Avançados</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Exportação em múltiplos formatos</li>
                <li>• Agendamento automático</li>
                <li>• Filtros personalizáveis</li>
                <li>• Gráficos interativos</li>
                <li>• Compartilhamento seguro</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
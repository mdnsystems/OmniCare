import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  UserCheck,
  Clock,
  Star,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Eye,
  FileText,
  Target,
  Award,
  Activity
} from "lucide-react"
import { useClinica } from "@/contexts/ClinicaContext"
import { TipoRelatorioDesempenho } from "@/types/api"

export function RelatoriosDesempenho() {
  const { getNomenclatura } = useClinica()
  const [dateInicio, setDateInicio] = useState<Date | null>(new Date())
  const [dateFim, setDateFim] = useState<Date | null>(new Date())
  const [selectedTipo, setSelectedTipo] = useState<string>("DESEMPENHO_PROFISSIONAIS")

  // Mock data para demonstração
  const relatoriosDisponiveis = [
    {
      id: "1",
      nome: "Desempenho por Profissional",
      tipo: TipoRelatorioDesempenho.DESEMPENHO_PROFISSIONAIS,
      descricao: "Análise de performance individual dos profissionais",
      ultimaGeracao: "2024-01-15",
      status: "disponivel"
    },
    {
      id: "2",
      nome: "Desempenho por Especialidade",
      tipo: TipoRelatorioDesempenho.DESEMPENHO_ESPECIALIDADES,
      descricao: "Análise de performance por especialidade",
      ultimaGeracao: "2024-01-14",
      status: "disponivel"
    },
    {
      id: "3",
      nome: "Métricas Operacionais",
      tipo: TipoRelatorioDesempenho.METRICAS_OPERACIONAIS,
      descricao: "Indicadores operacionais da clínica",
      ultimaGeracao: "2024-01-13",
      status: "disponivel"
    },
    {
      id: "4",
      nome: "Satisfação dos Pacientes",
      tipo: TipoRelatorioDesempenho.SATISFACAO_PACIENTES,
      descricao: "Análise de satisfação e feedback",
      ultimaGeracao: "2024-01-12",
      status: "disponivel"
    }
  ]

  const metricasPrincipais = {
    mediaConsultasPorDia: 5.2,
    taxaOcupacaoGeral: 85.2,
    tempoMedioAtendimento: 45,
    satisfacaoGeral: 4.6,
    eficienciaGeral: 87.5,
    crescimentoDesempenho: 12.3
  }

  const desempenhoProfissionais = [
    { 
      nome: "Dr. Carlos Santos", 
      consultas: 45, 
      ocupacao: 92, 
      satisfacao: 4.8, 
      eficiencia: 95,
      especialidade: "Cardiologia"
    },
    { 
      nome: "Dra. Ana Costa", 
      consultas: 38, 
      ocupacao: 88, 
      satisfacao: 4.7, 
      eficiencia: 92,
      especialidade: "Dermatologia"
    },
    { 
      nome: "Dr. João Silva", 
      consultas: 42, 
      ocupacao: 85, 
      satisfacao: 4.6, 
      eficiencia: 89,
      especialidade: "Ortopedia"
    },
    { 
      nome: "Dra. Maria Oliveira", 
      consultas: 35, 
      ocupacao: 82, 
      satisfacao: 4.5, 
      eficiencia: 87,
      especialidade: "Ginecologia"
    }
  ]

  const desempenhoPorPeriodo = [
    { periodo: "Jan", consultasPorDia: 4.8, ocupacao: 82.1, tempoAtendimento: 48, satisfacao: 4.4, eficiencia: 84.2 },
    { periodo: "Fev", consultasPorDia: 5.2, ocupacao: 85.2, tempoAtendimento: 45, satisfacao: 4.6, eficiencia: 87.5 },
    { periodo: "Mar", consultasPorDia: 5.5, ocupacao: 87.3, tempoAtendimento: 43, satisfacao: 4.7, eficiencia: 89.1 },
    { periodo: "Abr", consultasPorDia: 5.8, ocupacao: 88.5, tempoAtendimento: 42, satisfacao: 4.8, eficiencia: 90.3 },
  ]

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios de Desempenho</h1>
          <p className="text-muted-foreground">
            Acesse relatórios detalhados sobre o desempenho da clínica e profissionais
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar Todos
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de {getNomenclatura('consultas')}/Dia</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricasPrincipais.mediaConsultasPorDia}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +{metricasPrincipais.crescimentoDesempenho}% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricasPrincipais.taxaOcupacaoGeral}%</div>
            <p className="text-xs text-muted-foreground">
              Horários ocupados vs disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação Geral</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricasPrincipais.satisfacaoGeral}/5.0</div>
            <p className="text-xs text-muted-foreground">
              Avaliação média dos pacientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiência Geral</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricasPrincipais.eficienciaGeral}%</div>
            <p className="text-xs text-muted-foreground">
              Indicador de eficiência operacional
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros para Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gerar Novo Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Relatório</label>
              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TipoRelatorioDesempenho).map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Início</label>
              <DatePicker date={dateInicio} onSelect={setDateInicio} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data Fim</label>
              <DatePicker date={dateFim} onSelect={setDateFim} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <Button className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desempenho por Profissional */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Profissional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {desempenhoProfissionais.map((profissional, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">{profissional.nome}</h3>
                    <p className="text-sm text-muted-foreground">{profissional.especialidade}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm font-bold">{profissional.consultas}</div>
                    <div className="text-xs text-muted-foreground">{getNomenclatura('consultas')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold">{profissional.ocupacao}%</div>
                    <div className="text-xs text-muted-foreground">Ocupação</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold">{profissional.satisfacao}/5.0</div>
                    <div className="text-xs text-muted-foreground">Satisfação</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold">{profissional.eficiencia}%</div>
                    <div className="text-xs text-muted-foreground">Eficiência</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráficos de Desempenho */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Desempenho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {desempenhoPorPeriodo.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.periodo}</span>
                    <span>{item.consultasPorDia} {getNomenclatura('consultas')}/dia</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.ocupacao}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Ocupação: {item.ocupacao}%</span>
                    <span>Tempo: {item.tempoAtendimento}min</span>
                    <span>Satisfação: {item.satisfacao}/5.0</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Satisfação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto mb-2" />
                <p>Gráfico de Pizza - Satisfação dos Pacientes</p>
                <p className="text-sm">Dados de exemplo para demonstração</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Relatórios Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {relatoriosDisponiveis.map((relatorio) => (
              <div key={relatorio.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">{relatorio.nome}</h3>
                    <p className="text-sm text-muted-foreground">{relatorio.descricao}</p>
                    <p className="text-xs text-muted-foreground">
                      Última geração: {formatDate(relatorio.ultimaGeracao)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {relatorio.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tempo Médio de Atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{metricasPrincipais.tempoMedioAtendimento} min</div>
                <p className="text-sm text-muted-foreground">
                  Tempo médio por atendimento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Melhor Profissional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Award className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-600">Dr. Carlos Santos</div>
                <p className="text-sm text-muted-foreground">
                  95% de eficiência
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Meta de Crescimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">+{metricasPrincipais.crescimentoDesempenho}%</div>
                <p className="text-sm text-muted-foreground">
                  Crescimento vs período anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
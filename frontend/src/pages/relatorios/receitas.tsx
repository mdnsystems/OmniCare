import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Eye,
  FileText,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from "lucide-react"
import { useClinica } from "@/contexts/ClinicaContext"
import { useEstatisticasFinanceiras } from "@/hooks/useDashboard"
import { formatCurrency } from "@/lib/utils"

enum TipoRelatorioReceitas {
  RECEITA_POR_PERIODO = 'RECEITA_POR_PERIODO',
  RECEITA_POR_SERVICO = 'RECEITA_POR_SERVICO',
  RECEITA_POR_PACIENTE = 'RECEITA_POR_PACIENTE',
  PROJECAO_RECEITA = 'PROJECAO_RECEITA'
}

export function RelatoriosReceitas() {
  const { getNomenclatura } = useClinica()
  const [dateInicio, setDateInicio] = useState<Date | null>(new Date())
  const [dateFim, setDateFim] = useState<Date | null>(new Date())
  const [selectedTipo, setSelectedTipo] = useState<string>("RECEITA_POR_PERIODO")

  const periodo = dateInicio && dateFim ? {
    inicio: dateInicio.toISOString(),
    fim: dateFim.toISOString()
  } : undefined;

  const { data: estatisticas, isLoading, error } = useEstatisticasFinanceiras(periodo);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Erro ao carregar dados de receitas
      </div>
    );
  }

  const metricasPrincipais = {
    receitaTotal: estatisticas?.receitaTotal || 0,
    receitaMedia: estatisticas?.mediaTicket || 0,
    receitaMaxima: estatisticas?.receitaTotal || 0,
    receitaMinima: 0,
    crescimentoPeriodo: 0,
    projecaoProximoPeriodo: estatisticas?.receitaTotal || 0
  };

  const receitaPorPeriodo = [
    { periodo: "Jan", receita: estatisticas?.receitaTotal || 0, quantidade: 0, media: estatisticas?.mediaTicket || 0, crescimento: 0 },
    { periodo: "Fev", receita: estatisticas?.receitaTotal || 0, quantidade: 0, media: estatisticas?.mediaTicket || 0, crescimento: 0 },
    { periodo: "Mar", receita: estatisticas?.receitaTotal || 0, quantidade: 0, media: estatisticas?.mediaTicket || 0, crescimento: 0 },
    { periodo: "Abr", receita: estatisticas?.receitaTotal || 0, quantidade: 0, media: estatisticas?.mediaTicket || 0, crescimento: 0 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios de Receitas</h1>
          <p className="text-muted-foreground">
            Análise detalhada das receitas e projeções financeiras
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Data Início</label>
              <Input
                type="date"
                value={dateInicio ? dateInicio.toISOString().split('T')[0] : ''}
                onChange={(e) => setDateInicio(e.target.value ? new Date(e.target.value) : null)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Data Fim</label>
              <Input
                type="date"
                value={dateFim ? dateFim.toISOString().split('T')[0] : ''}
                onChange={(e) => setDateFim(e.target.value ? new Date(e.target.value) : null)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo de Relatório</label>
              <select
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value={TipoRelatorioReceitas.RECEITA_POR_PERIODO}>Receita por Período</option>
                <option value={TipoRelatorioReceitas.RECEITA_POR_SERVICO}>Receita por Serviço</option>
                <option value={TipoRelatorioReceitas.RECEITA_POR_PACIENTE}>Receita por Paciente</option>
                <option value={TipoRelatorioReceitas.PROJECAO_RECEITA}>Projeção de Receita</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metricasPrincipais.receitaTotal)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +{metricasPrincipais.crescimentoPeriodo}% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Média</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metricasPrincipais.receitaMedia)}</div>
            <p className="text-xs text-muted-foreground">
              Por atendimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projeção Próximo Período</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(metricasPrincipais.projecaoProximoPeriodo)}</div>
            <p className="text-xs text-muted-foreground">
              Baseado no crescimento atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas?.taxaConversao ? (estatisticas.taxaConversao * 100).toFixed(1) : 0}%</div>
            <p className="text-xs text-muted-foreground">
              Receita vs agendamentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Evolução da Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {receitaPorPeriodo.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.periodo}</span>
                    <span>{formatCurrency(item.receita)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.receita > 0 ? Math.min((item.receita / Math.max(...receitaPorPeriodo.map(r => r.receita))) * 100, 100) : 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Média: {formatCurrency(item.media)}</span>
                    <span>Crescimento: {item.crescimento}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {estatisticas?.porFormaPagamento && Object.entries(estatisticas.porFormaPagamento).map(([forma, quantidade]) => (
                <div key={forma} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{forma.replace('_', ' ')}</span>
                    <span>{quantidade} pagamentos</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ 
                        width: `${estatisticas.total > 0 ? (quantidade / estatisticas.total) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Receita Máxima</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <ArrowUpRight className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(metricasPrincipais.receitaMaxima)}</div>
                <p className="text-sm text-muted-foreground">
                  Maior valor por atendimento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Receita Mínima</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <ArrowDownRight className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(metricasPrincipais.receitaMinima)}</div>
                <p className="text-sm text-muted-foreground">
                  Menor valor por atendimento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Receita Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{formatCurrency(estatisticas?.receitaPendente || 0)}</div>
                <p className="text-sm text-muted-foreground">
                  Aguardando pagamento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
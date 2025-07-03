import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  UserCheck,
  UserX,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Eye,
  FileText,
  Filter,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react"
import { useClinica } from "@/contexts/ClinicaContext"
import { TipoClinica } from "@/types/api"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useToast } from '@/components/ui/use-toast'
import { useProfissionais } from "@/hooks/useProfissionais"

enum TipoRelatorioConsultas {
  CONSULTAS_POR_PERIODO = "CONSULTAS_POR_PERIODO",
  CONSULTAS_POR_PROFISSIONAL = "CONSULTAS_POR_PROFISSIONAL",
  TAXA_OCUPACAO = "TAXA_OCUPACAO",
  CANCELAMENTOS = "CANCELAMENTOS"
}

interface Relatorio {
  id: string
  nome: string
  tipo: TipoRelatorioConsultas
  descricao: string
  ultimaGeracao: string
  status: string
}

interface Profissional {
  id: string
  nome: string
  especialidade?: {
    nome: string
  }
}

interface MetricasConsultas {
  totalConsultas: number
  consultasRealizadas: number
  consultasCanceladas: number
  consultasRemarcadas: number
  taxaOcupacao: number
  mediaConsultasPorDia: number
  crescimentoMensal: number
}

export function RelatoriosConsultas() {
  const { configuracao } = useClinica()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [dateInicio, setDateInicio] = useState<Date | null>(new Date())
  const [dateFim, setDateFim] = useState<Date | null>(new Date())
  const [selectedTipo, setSelectedTipo] = useState<string>("CONSULTAS_POR_PERIODO")
  const [selectedProfissional, setSelectedProfissional] = useState<string>("TODOS")

  // Buscar relatórios disponíveis
  const { data: relatoriosDisponiveis, isLoading: isLoadingRelatorios } = useQuery({
    queryKey: ['relatorios-consultas'],
    queryFn: async () => {
      const response = await api.get('/relatorios/consultas')
      return response.data.data as Relatorio[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  // Buscar profissionais usando o hook
  const { data: profissionaisData, isLoading: isLoadingProfissionais } = useProfissionais();
  
  // Extrair a lista de profissionais do PaginatedResponse
  const profissionais = profissionaisData?.data || [];

  // Buscar métricas
  const { data: metricasPrincipais, isLoading: isLoadingMetricas } = useQuery({
    queryKey: ['metricas-consultas', dateInicio, dateFim],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (dateInicio) params.append('dataInicio', dateInicio.toISOString())
      if (dateFim) params.append('dataFim', dateFim.toISOString())
      
      const response = await api.get(`/relatorios/consultas/metricas?${params.toString()}`)
      return response.data.data as MetricasConsultas
    },
    enabled: !!dateInicio && !!dateFim,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  // Gerar relatório
  const gerarRelatorio = useMutation({
    mutationFn: async (params: {
      tipo: string
      profissionalId?: string
      dataInicio: string
      dataFim: string
    }) => {
      const response = await api.post('/relatorios/consultas/gerar', params)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorios-consultas'] })
      toast({
        title: "Relatório gerado!",
        description: "O relatório foi gerado com sucesso.",
      })
    },
    onError: () => {
      toast({
        title: "Erro ao gerar relatório",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive",
      })
    },
  })

  const getNomenclatura = (tipo: string) => {
    switch (configuracao?.tipo) {
      case TipoClinica.NUTRICIONAL:
        return tipo === 'consultas' ? 'consultas nutricionais' : 'consultas'
      case TipoClinica.PSICOLOGICA:
        return tipo === 'consultas' ? 'sessões psicológicas' : 'sessões'
      case TipoClinica.FISIOTERAPICA:
        return tipo === 'consultas' ? 'sessões fisioterapêuticas' : 'sessões'
      case TipoClinica.MEDICA:
        return tipo === 'consultas' ? 'consultas médicas' : 'consultas'
      case TipoClinica.ODONTOLOGICA:
        return tipo === 'consultas' ? 'consultas odontológicas' : 'consultas'
      case TipoClinica.ESTETICA:
        return tipo === 'consultas' ? 'procedimentos estéticos' : 'procedimentos'
      case TipoClinica.VETERINARIA:
        return tipo === 'consultas' ? 'consultas veterinárias' : 'consultas'
      default:
        return tipo === 'consultas' ? 'consultas' : 'atendimentos'
    }
  }

  const handleGerarRelatorio = () => {
    if (!dateInicio || !dateFim) {
      toast({
        title: "Datas obrigatórias",
        description: "Selecione as datas de início e fim.",
        variant: "destructive",
      })
      return
    }

    gerarRelatorio.mutate({
      tipo: selectedTipo,
      profissionalId: selectedProfissional !== "TODOS" ? selectedProfissional : undefined,
      dataInicio: dateInicio.toISOString(),
      dataFim: dateFim.toISOString(),
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios de {getNomenclatura('consultas')}</h1>
          <p className="text-muted-foreground">
            Acesse relatórios detalhados sobre as {getNomenclatura('consultas')} da clínica
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
            <CardTitle className="text-sm font-medium">Total de {getNomenclatura('consultas')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetricas ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{metricasPrincipais?.totalConsultas || 0}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                  +{metricasPrincipais?.crescimentoMensal || 0}% vs mês anterior
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{getNomenclatura('consultas')} Realizadas</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetricas ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">{metricasPrincipais?.consultasRealizadas || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {metricasPrincipais?.totalConsultas ? 
                    ((metricasPrincipais.consultasRealizadas / metricasPrincipais.totalConsultas) * 100).toFixed(1) : 0}% do total
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetricas ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{metricasPrincipais?.taxaOcupacao || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  Horários ocupados vs disponíveis
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Dia</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetricas ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{metricasPrincipais?.mediaConsultasPorDia || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {getNomenclatura('consultas')} por dia útil
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filtros para Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gerar Novo Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Relatório</label>
              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TipoRelatorioConsultas).map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Profissional</label>
              <Select value={selectedProfissional} onValueChange={setSelectedProfissional}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o profissional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos os Profissionais</SelectItem>
                  {isLoadingProfissionais ? (
                    <SelectItem value="loading" disabled>Carregando...</SelectItem>
                  ) : (
                    Array.isArray(profissionais) && profissionais.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id}>
                        {prof.nome}
                      </SelectItem>
                    ))
                  )}
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
              <Button 
                className="w-full" 
                onClick={handleGerarRelatorio}
                disabled={gerarRelatorio.isPending}
              >
                {gerarRelatorio.isPending ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                {gerarRelatorio.isPending ? 'Gerando...' : 'Gerar Relatório'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Relatórios Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRelatorios ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.isArray(relatoriosDisponiveis) && relatoriosDisponiveis.map((relatorio) => (
                <div key={relatorio.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">{relatorio.nome}</h3>
                        <p className="text-sm text-muted-foreground">{relatorio.descricao}</p>
                        <p className="text-xs text-muted-foreground">
                          Última geração: {formatDate(relatorio.ultimaGeracao)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={relatorio.status === "disponivel" ? "default" : "secondary"}>
                      {relatorio.status === "disponivel" ? "Disponível" : "Processando"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {(!Array.isArray(relatoriosDisponiveis) || relatoriosDisponiveis.length === 0) && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum relatório disponível</h3>
                  <p className="text-muted-foreground">
                    Gere seu primeiro relatório usando os filtros acima
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráficos de Exemplo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{getNomenclatura('consultas')} por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {consultasPorPeriodo.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.periodo}</span>
                    <span>{item.total} {getNomenclatura('consultas')}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.ocupacao}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Realizadas: {item.realizadas}</span>
                    <span>Canceladas: {item.canceladas}</span>
                    <span>Remarcadas: {item.remarcadas}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto mb-2" />
                <p>Gráfico de Pizza - Status das {getNomenclatura('consultas')}</p>
                <p className="text-sm">Dados de exemplo para demonstração</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cancelamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <UserX className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{metricasPrincipais?.consultasCanceladas || 0}</div>
                <p className="text-sm text-muted-foreground">
                  {((metricasPrincipais.consultasCanceladas / metricasPrincipais.totalConsultas) * 100).toFixed(1)}% do total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Remarcações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{metricasPrincipais?.consultasRemarcadas || 0}</div>
                <p className="text-sm text-muted-foreground">
                  {((metricasPrincipais.consultasRemarcadas / metricasPrincipais.totalConsultas) * 100).toFixed(1)}% do total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Taxa de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {((metricasPrincipais.consultasRealizadas / metricasPrincipais.totalConsultas) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">
                  {getNomenclatura('consultas')} realizadas com sucesso
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  MessageSquare, 
  ArrowLeft,
  Activity,
  Building2,
  TrendingUp,
  BarChart3
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useRelatorioChat, useClinicasSuperAdmin } from "@/hooks/useSuperAdmin"

export function RelatorioChat() {
  const navigate = useNavigate()
  const [clinicaSelecionada, setClinicaSelecionada] = useState<string>("")
  const [periodo, setPeriodo] = useState<'semana' | 'mes'>('semana')
  
  const { data: relatorio, isLoading } = useRelatorioChat(
    clinicaSelecionada || undefined, 
    periodo
  )
  const { data: clinicas } = useClinicasSuperAdmin()

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando relatório de chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate("/super-admin/relatorios")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatório de Chat</h1>
            <p className="text-muted-foreground">
              Comunicação e mensagens entre clínicas
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Clínica</label>
              <Select value={clinicaSelecionada} onValueChange={setClinicaSelecionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as clínicas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as clínicas</SelectItem>
                  {clinicas?.map((clinica) => (
                    <SelectItem key={clinica.id} value={clinica.id}>
                      {clinica.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={periodo} onValueChange={(value: 'semana' | 'mes') => setPeriodo(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Última semana</SelectItem>
                  <SelectItem value="mes">Último mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Comunicação */}
      {relatorio && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{relatorio.totalMensagens}</div>
              <p className="text-xs text-muted-foreground">Mensagens no período</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clínicas Ativas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{relatorio.mensagensPorClinica.length}</div>
              <p className="text-xs text-muted-foreground">Clínicas com atividade</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média por Clínica</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {relatorio.mensagensPorClinica.length > 0 
                  ? Math.round(relatorio.totalMensagens / relatorio.mensagensPorClinica.length)
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Mensagens por clínica</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Período do Relatório */}
      {relatorio && (
        <Card>
          <CardHeader>
            <CardTitle>Período do Relatório</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Início:</span>
                <span className="text-sm text-muted-foreground">
                  {formatarData(relatorio.periodo.inicio)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Fim:</span>
                <span className="text-sm text-muted-foreground">
                  {formatarData(relatorio.periodo.fim)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensagens por Clínica */}
      {relatorio && (
        <Card>
          <CardHeader>
            <CardTitle>Mensagens por Clínica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatorio.mensagensPorClinica.length > 0 ? (
                relatorio.mensagensPorClinica
                  .sort((a, b) => b._count.mensagens - a._count.mensagens)
                  .map((clinica) => (
                    <div key={clinica.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{clinica.nome}</h3>
                            <p className="text-sm text-muted-foreground">Tenant: {clinica.tenantId}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {clinica._count.mensagens}
                            </div>
                            <p className="text-xs text-muted-foreground">Mensagens</p>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-sm font-medium">
                              {relatorio.totalMensagens > 0 
                                ? Math.round((clinica._count.mensagens / relatorio.totalMensagens) * 100)
                                : 0}%
                            </div>
                            <p className="text-xs text-muted-foreground">Do total</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma mensagem encontrada</h3>
                  <p className="text-muted-foreground">
                    Não há mensagens no período selecionado.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de Distribuição */}
      {relatorio && relatorio.mensagensPorClinica.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Mensagens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatorio.mensagensPorClinica
                .sort((a, b) => b._count.mensagens - a._count.mensagens)
                .slice(0, 5)
                .map((clinica, index) => {
                  const porcentagem = relatorio.totalMensagens > 0 
                    ? (clinica._count.mensagens / relatorio.totalMensagens) * 100 
                    : 0
                  
                  return (
                    <div key={clinica.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{clinica.nome}</span>
                        <span className="text-sm text-muted-foreground">
                          {clinica._count.mensagens} mensagens ({porcentagem.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${porcentagem}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações sobre Privacidade */}
      <Card>
        <CardHeader>
          <CardTitle>Informações sobre Privacidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">🔒 Dados Protegidos</h4>
              <p className="text-sm text-muted-foreground">
                Este relatório mostra apenas a volumetria de mensagens por clínica. 
                Não são exibidos conteúdos, conversas ou informações pessoais.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📊 Monitoramento de Uso</h4>
              <p className="text-sm text-muted-foreground">
                O relatório permite acompanhar o uso do sistema de comunicação, 
                facilitando o suporte técnico e a gestão de recursos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
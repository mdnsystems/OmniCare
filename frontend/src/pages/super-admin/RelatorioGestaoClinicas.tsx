import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Users,
  Activity
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useRelatorioGestaoClinicas } from "@/hooks/useSuperAdmin"

export function RelatorioGestaoClinicas() {
  const navigate = useNavigate()
  const { data: relatorio, isLoading } = useRelatorioGestaoClinicas()

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando relatório de gestão...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Relatório de Gestão de Clínicas</h1>
            <p className="text-muted-foreground">
              Status e gestão das clínicas no sistema
            </p>
          </div>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      {relatorio && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clínicas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{relatorio.estatisticas.total}</div>
              <p className="text-xs text-muted-foreground">Clínicas cadastradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clínicas Ativas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{relatorio.estatisticas.ativas}</div>
              <p className="text-xs text-muted-foreground">Clínicas ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clínicas Inativas</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{relatorio.estatisticas.inativas}</div>
              <p className="text-xs text-muted-foreground">Clínicas inativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planos Ativos</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{relatorio.estatisticas.comPlanoAtivo}</div>
              <p className="text-xs text-muted-foreground">Planos vigentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planos Expirados</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{relatorio.estatisticas.comPlanoExpirado}</div>
              <p className="text-xs text-muted-foreground">Planos vencidos</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de Clínicas */}
      {relatorio && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes das Clínicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatorio.clinicas.map((clinica) => {
                const hoje = new Date()
                const expiracao = clinica.dataExpiracao ? new Date(clinica.dataExpiracao) : null
                const diasParaExpiracao = expiracao ? Math.ceil((expiracao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)) : null

                return (
                  <div key={clinica.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{clinica.nome}</h3>
                          <p className="text-sm text-muted-foreground">{clinica.email}</p>
                          <p className="text-xs text-muted-foreground">CNPJ: {clinica.cnpj}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {/* Status da Clínica */}
                        <Badge variant={clinica.ativo ? "default" : "secondary"}>
                          {clinica.ativo ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ativa
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inativa
                            </>
                          )}
                        </Badge>

                        {/* Status do Plano */}
                        {clinica.dataExpiracao ? (
                          <Badge 
                            variant={expiracao && expiracao > hoje ? "default" : "destructive"}
                          >
                            {expiracao && expiracao > hoje ? (
                              <>
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Ativo
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Expirado
                              </>
                            )}
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            Sem plano
                          </Badge>
                        )}

                        {/* Estatísticas */}
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{clinica._count.usuarios}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Activity className="h-4 w-4" />
                            <span>{clinica._count.agendamentos}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informações Adicionais */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Cadastrada em:</span>
                          <p className="font-medium">{formatarData(clinica.createdAt)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Última atualização:</span>
                          <p className="font-medium">{formatarData(clinica.updatedAt)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Plano:</span>
                          <p className="font-medium">{clinica.plano || "Não definido"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expiração:</span>
                          <p className="font-medium">
                            {clinica.dataExpiracao ? (
                              <>
                                {formatarData(clinica.dataExpiracao)}
                                {diasParaExpiracao !== null && (
                                  <span className={`ml-2 text-xs ${
                                    diasParaExpiracao > 30 ? 'text-green-600' : 
                                    diasParaExpiracao > 7 ? 'text-orange-600' : 'text-red-600'
                                  }`}>
                                    ({diasParaExpiracao > 0 ? `${diasParaExpiracao} dias` : 'Expirado'})
                                  </span>
                                )}
                              </>
                            ) : (
                              "Não definida"
                            )}
                          </p>
                        </div>
                      </div>
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
                Este relatório mostra apenas informações de gestão das clínicas. 
                Não são exibidos dados de pacientes, prontuários ou informações sensíveis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📊 Gestão Comercial</h4>
              <p className="text-sm text-muted-foreground">
                O relatório permite acompanhar o status das clínicas, planos e 
                assinaturas para gestão comercial e suporte técnico.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
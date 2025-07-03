import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Activity, 
  ArrowLeft,
  Users,
  Calendar,
  MessageSquare,
  FileText,
  Building2,
  Clock
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useRelatorioAtividades, useClinicasSuperAdmin } from "@/hooks/useSuperAdmin"

export function RelatorioAtividades() {
  const navigate = useNavigate()
  const [clinicaSelecionada, setClinicaSelecionada] = useState<string>("")
  const [periodo, setPeriodo] = useState<'semana' | 'mes'>('semana')
  
  const { data: relatorio, isLoading } = useRelatorioAtividades(
    clinicaSelecionada || undefined, 
    periodo
  )
  const { data: clinicas } = useClinicasSuperAdmin()

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando relatório de atividades...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Relatório de Atividades</h1>
            <p className="text-muted-foreground">
              Monitoramento de atividades e acessos das clínicas
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

      {/* Resumo de Atividades */}
      {relatorio && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Acessos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{relatorio.acessos.length}</div>
              <p className="text-xs text-muted-foreground">Logins no período</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {relatorio.atividadesPorClinica.reduce((total, clinica) => total + clinica._count.agendamentos, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Criados no período</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prontuários</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {relatorio.atividadesPorClinica.reduce((total, clinica) => total + clinica._count.prontuarios, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Criados no período</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {relatorio.atividadesPorClinica.reduce((total, clinica) => total + clinica._count.mensagens, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Enviadas no período</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Acessos Recentes */}
      {relatorio && relatorio.acessos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Acessos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatorio.acessos.slice(0, 10).map((acesso) => (
                <div key={acesso.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">{acesso.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {acesso.clinica?.nome || 'Sistema'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatarData(acesso.lastLoginAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Atividades por Clínica */}
      {relatorio && (
        <Card>
          <CardHeader>
            <CardTitle>Atividades por Clínica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {relatorio.atividadesPorClinica.map((clinica) => (
                <div key={clinica.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">{clinica.nome}</h3>
                      <Badge variant={clinica.ativo ? "default" : "secondary"}>
                        {clinica.ativo ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Agendamentos</span>
                      </div>
                      <div className="text-2xl font-bold">{clinica._count.agendamentos}</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Prontuários</span>
                      </div>
                      <div className="text-2xl font-bold">{clinica._count.prontuarios}</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">Mensagens</span>
                      </div>
                      <div className="text-2xl font-bold">{clinica._count.mensagens}</div>
                    </div>
                  </div>
                </div>
              ))}
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
                Este relatório mostra apenas estatísticas de atividades e acessos. 
                Não são exibidos detalhes de conteúdo, prontuários ou informações pessoais.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📊 Monitoramento Macro</h4>
              <p className="text-sm text-muted-foreground">
                O relatório permite acompanhar o uso do sistema por clínica, 
                facilitando o suporte técnico e a gestão de recursos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
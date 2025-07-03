import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  ArrowLeft,
  Activity,
  CheckCircle,
  XCircle,
  Building2,
  BarChart3
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useRelatorioUsuarios, useClinicasSuperAdmin } from "@/hooks/useSuperAdmin"
import { RoleUsuario } from "@/types/api"

export function RelatorioUsuarios() {
  const navigate = useNavigate()
  const [clinicaSelecionada, setClinicaSelecionada] = useState<string>("")
  
  const { data: relatorio, isLoading } = useRelatorioUsuarios(clinicaSelecionada || undefined)
  const { data: clinicas } = useClinicasSuperAdmin()

  const getRoleColor = (role: string) => {
    switch (role) {
      case RoleUsuario.ADMIN:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case RoleUsuario.PROFISSIONAL:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case RoleUsuario.RECEPCIONISTA:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case RoleUsuario.SUPER_ADMIN:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case RoleUsuario.ADMIN:
        return "Administrador"
      case RoleUsuario.PROFISSIONAL:
        return "Profissional"
      case RoleUsuario.RECEPCIONISTA:
        return "Recepcionista"
      case RoleUsuario.SUPER_ADMIN:
        return "Super Admin"
      default:
        return role
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando relatório de usuários...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Relatório de Usuários</h1>
            <p className="text-muted-foreground">
              Gestão de usuários e permissões por clínica
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
          </div>
        </CardContent>
      </Card>

      {/* Resumo Geral */}
      {relatorio && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{relatorio.totalUsuarios}</div>
              <p className="text-xs text-muted-foreground">Usuários no sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{relatorio.totalAtivos}</div>
              <p className="text-xs text-muted-foreground">Usuários ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{relatorio.totalInativos}</div>
              <p className="text-xs text-muted-foreground">Usuários inativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Atividade</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {relatorio.totalUsuarios > 0 
                  ? Math.round((relatorio.totalAtivos / relatorio.totalUsuarios) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Usuários ativos</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detalhes por Clínica */}
      {relatorio && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes por Clínica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(relatorio.usuariosPorClinica).map(([clinicaNome, dados]) => (
                <div key={clinicaNome} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">{clinicaNome}</h3>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">
                        Total: {dados.total}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Ativos: {dados.ativos}
                      </Badge>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Inativos: {dados.inativos}
                      </Badge>
                    </div>
                  </div>

                  {/* Distribuição por Role */}
                  <div className="grid gap-4 md:grid-cols-4">
                    {Object.entries(dados.porRole).map(([role, count]) => (
                      <div key={role} className="text-center">
                        <Badge className={getRoleColor(role)}>
                          {getRoleLabel(role)}
                        </Badge>
                        <div className="text-2xl font-bold mt-2">{count}</div>
                        <p className="text-xs text-muted-foreground">
                          {dados.total > 0 ? Math.round((count / dados.total) * 100) : 0}% do total
                        </p>
                      </div>
                    ))}
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
                Este relatório mostra apenas estatísticas macro de usuários por clínica. 
                Não são exibidos dados pessoais, emails ou informações sensíveis dos usuários.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📊 Foco em Gestão</h4>
              <p className="text-sm text-muted-foreground">
                O relatório permite acompanhar a distribuição de usuários por perfil 
                e status, facilitando a gestão de licenças e suporte técnico.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
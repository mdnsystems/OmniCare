import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  ArrowLeft, 
  Edit, 
  CheckCircle, 
  XCircle,
  Calendar,
  Users,
  Activity,
  MessageSquare,
  FileText,
  DollarSign,
  AlertTriangle
} from "lucide-react"
import { useDetalhesClinica, useToggleStatusClinica, useAtualizarClinica } from "@/hooks/useSuperAdmin"
import { useState } from "react"
import { DetalhesClinica as DetalhesClinicaType } from "@/services/super-admin.service"

export function DetalhesClinica() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<DetalhesClinicaType>>({})
  
  const { data: clinica, isLoading } = useDetalhesClinica(id!)
  const toggleStatus = useToggleStatusClinica()
  const atualizarClinica = useAtualizarClinica()

  const handleToggleStatus = async () => {
    if (!clinica) return
    try {
      await toggleStatus.mutateAsync(clinica.id)
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  const handleSave = async () => {
    if (!clinica) return
    try {
      await atualizarClinica.mutateAsync({ id: clinica.id, data: editData })
      setIsEditing(false)
      setEditData({})
    } catch (error) {
      console.error('Erro ao atualizar clínica:', error)
    }
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (ativo: boolean) => {
    return ativo 
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  }

  const getPlanoStatus = (dataExpiracao?: string) => {
    if (!dataExpiracao) return { status: "Sem plano", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" }
    
    const hoje = new Date()
    const expiracao = new Date(dataExpiracao)
    
    if (expiracao > hoje) {
      return { status: "Ativo", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" }
    } else {
      return { status: "Expirado", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando detalhes da clínica...</p>
        </div>
      </div>
    )
  }

  if (!clinica) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Clínica não encontrada</h3>
          <p className="text-muted-foreground">A clínica solicitada não foi encontrada.</p>
          <Button onClick={() => navigate("/super-admin/clinicas")} className="mt-4">
            Voltar à Lista
          </Button>
        </div>
      </div>
    )
  }

  const planoStatus = getPlanoStatus(clinica.dataExpiracao)

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate("/super-admin/clinicas")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{clinica.nome}</h1>
            <p className="text-muted-foreground">Detalhes da clínica</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
          <Button
            variant="outline"
            onClick={handleToggleStatus}
            disabled={toggleStatus.isPending}
          >
            {clinica.ativo ? "Desativar" : "Ativar"}
          </Button>
          {isEditing && (
            <Button onClick={handleSave} disabled={atualizarClinica.isPending}>
              Salvar
            </Button>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status da Clínica</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(clinica.ativo)}>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Plano</CardTitle>
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <Badge className={planoStatus.color}>
              {planoStatus.status}
            </Badge>
            {clinica.dataExpiracao && (
              <p className="text-xs text-muted-foreground mt-1">
                Expira em: {formatarData(clinica.dataExpiracao)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenant ID</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-mono">{clinica.tenantId}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Informações */}
      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados Básicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome da Clínica</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.nome || clinica.nome}
                      onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                      className="w-full p-2 border rounded-md mt-1"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{clinica.nome}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">CNPJ</label>
                  <p className="text-sm text-muted-foreground mt-1">{clinica.cnpj}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email || clinica.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full p-2 border rounded-md mt-1"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{clinica.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.telefone || clinica.telefone}
                      onChange={(e) => setEditData({ ...editData, telefone: e.target.value })}
                      className="w-full p-2 border rounded-md mt-1"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{clinica.telefone}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Plano</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.plano || clinica.plano || ""}
                      onChange={(e) => setEditData({ ...editData, plano: e.target.value })}
                      className="w-full p-2 border rounded-md mt-1"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{clinica.plano || "Não definido"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Data de Expiração</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.dataExpiracao ? editData.dataExpiracao.split('T')[0] : clinica.dataExpiracao?.split('T')[0] || ""}
                      onChange={(e) => setEditData({ ...editData, dataExpiracao: e.target.value })}
                      className="w-full p-2 border rounded-md mt-1"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {clinica.dataExpiracao ? formatarData(clinica.dataExpiracao) : "Não definida"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data de Cadastro</label>
                  <p className="text-sm text-muted-foreground mt-1">{formatarData(clinica.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Última Atualização</label>
                  <p className="text-sm text-muted-foreground mt-1">{formatarData(clinica.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estatisticas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clinica._count.usuarios}</div>
                <p className="text-xs text-muted-foreground">Total de usuários</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profissionais</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clinica._count.profissionais}</div>
                <p className="text-xs text-muted-foreground">Profissionais cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pacientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clinica._count.pacientes}</div>
                <p className="text-xs text-muted-foreground">Pacientes cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clinica._count.agendamentos}</div>
                <p className="text-xs text-muted-foreground">Total de agendamentos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prontuários</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clinica._count.prontuarios}</div>
                <p className="text-xs text-muted-foreground">Prontuários criados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faturas</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clinica._count.faturas}</div>
                <p className="text-xs text-muted-foreground">Faturas geradas</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Clínica</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                {JSON.stringify(clinica.configuracoes || {}, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
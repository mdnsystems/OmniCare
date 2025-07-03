import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Building2, 
  Search, 
  Plus, 
  Edit, 
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  Activity
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useClinicasSuperAdmin, useToggleStatusClinica } from "@/hooks/useSuperAdmin"
import { ClinicaSuperAdmin } from "@/services/super-admin.service"

export function GestaoClinicas() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const { data: clinicas, isLoading } = useClinicasSuperAdmin()
  const toggleStatus = useToggleStatusClinica()

  const clinicasFiltradas = clinicas?.filter(clinica =>
    clinica.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinica.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinica.cnpj.includes(searchTerm)
  ) || []

  const handleToggleStatus = async (clinica: ClinicaSuperAdmin) => {
    try {
      await toggleStatus.mutateAsync(clinica.id)
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR')
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
          <p className="text-muted-foreground">Carregando clínicas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Clínicas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as clínicas cadastradas no sistema
          </p>
        </div>
        <Button onClick={() => navigate("/super-admin")}>
          <Plus className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clínicas */}
      <div className="grid gap-4">
        {clinicasFiltradas.length > 0 ? (
          clinicasFiltradas.map((clinica) => {
            const planoStatus = getPlanoStatus(clinica.dataExpiracao)
            
            return (
              <Card key={clinica.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{clinica.nome}</h3>
                        <p className="text-sm text-muted-foreground">{clinica.email}</p>
                        <p className="text-xs text-muted-foreground">CNPJ: {clinica.cnpj}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Status da Clínica */}
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

                      {/* Status do Plano */}
                      <Badge className={planoStatus.color}>
                        {planoStatus.status}
                      </Badge>

                      {/* Estatísticas */}
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{clinica._count.usuarios}</span>
                        <Activity className="h-4 w-4 ml-2" />
                        <span>{clinica._count.agendamentos}</span>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/super-admin/clinicas/${clinica.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(clinica)}
                          disabled={toggleStatus.isPending}
                        >
                          {clinica.ativo ? "Desativar" : "Ativar"}
                        </Button>
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
                        <span className="text-muted-foreground">Profissionais:</span>
                        <p className="font-medium">{clinica._count.profissionais}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pacientes:</span>
                        <p className="font-medium">{clinica._count.pacientes}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma clínica encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Tente ajustar os filtros de busca." : "Não há clínicas cadastradas no sistema."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Resumo */}
      {clinicas && clinicas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{clinicas.length}</div>
                <p className="text-sm text-muted-foreground">Total de Clínicas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {clinicas.filter(c => c.ativo).length}
                </div>
                <p className="text-sm text-muted-foreground">Clínicas Ativas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {clinicas.filter(c => c.dataExpiracao && new Date(c.dataExpiracao) > new Date()).length}
                </div>
                <p className="text-sm text-muted-foreground">Planos Ativos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {clinicas.filter(c => c.dataExpiracao && new Date(c.dataExpiracao) <= new Date()).length}
                </div>
                <p className="text-sm text-muted-foreground">Planos Expirados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
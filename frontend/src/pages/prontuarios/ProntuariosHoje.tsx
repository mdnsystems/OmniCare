import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  Heart, 
  Activity, 
  UserCheck, 
  FileEdit,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  Clock as ClockIcon,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Prontuario } from "../../components/tables/types/prontuario";

// Dados de exemplo para prontuários do dia
const prontuariosHoje: Prontuario[] = [
  {
    id: "1",
    pacienteId: "1",
    profissionalId: "1",
    data: new Date().toISOString(),
    tipo: "CONSULTA",
    descricao: "Consulta inicial - Avaliação nutricional",
    diagnostico: "Sobrepeso - IMC 28.5",
    prescricao: "Dieta hipocalórica, exercícios aeróbicos 3x/semana",
    observacoes: "Paciente motivado para mudança de hábitos",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paciente: {
      id: "1",
      nome: "João Silva",
      dataNascimento: "1990-05-15T00:00:00Z",
      cpf: "123.456.789-00",
      telefone: "(11) 99999-9999",
      email: "joao@email.com",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      endereco: "Rua das Flores",
      numero: "123",
      complemento: "Apto 45",
      bairro: "Centro",
      cep: "01234-567",
      cidade: "São Paulo",
      estado: "SP",
      pais: "Brasil",
      convenioNome: "Unimed",
      convenioNumero: "123456",
      convenioPlano: "Premium",
      convenioValidade: "2024-12-31T00:00:00Z",
      profissionalId: "1",
    },
    profissional: {
      id: "1",
      nome: "Dr. João Santos",
      especialidadeId: "1",
      registro: "12345",
      crm: "12345-SP",
      email: "joao.santos@clinica.com",
      telefone: "(11) 88888-8888",
      sexo: "M",
      dataNascimento: "1980-01-01T00:00:00Z",
      dataContratacao: "2020-01-01T00:00:00Z",
      status: "ATIVO",
      createdAt: "2020-01-01T00:00:00Z",
      updatedAt: "2020-01-01T00:00:00Z",
      rua: "Rua A",
      numero: "123",
      complemento: "",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
      horarioInicio: "08:00",
      horarioFim: "18:00",
      intervalo: "12:00-13:00",
      diasTrabalho: ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"],
    },
  },
  {
    id: "2",
    pacienteId: "2",
    profissionalId: "2",
    data: new Date().toISOString(),
    tipo: "RETORNO",
    descricao: "Retorno - Acompanhamento de perda de peso",
    diagnostico: "Evolução positiva - Perda de 3kg em 30 dias",
    prescricao: "Manter dieta atual, aumentar exercícios para 4x/semana",
    observacoes: "Paciente aderindo bem ao tratamento",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paciente: {
      id: "2",
      nome: "Maria Santos",
      dataNascimento: "1985-08-20T00:00:00Z",
      cpf: "987.654.321-00",
      telefone: "(11) 88888-8888",
      email: "maria@email.com",
      createdAt: "2024-01-10T14:30:00Z",
      updatedAt: "2024-01-10T14:30:00Z",
      endereco: "Av. Paulista",
      numero: "456",
      complemento: "",
      bairro: "Bela Vista",
      cep: "01310-000",
      cidade: "São Paulo",
      estado: "SP",
      pais: "Brasil",
      convenioNome: "Amil",
      convenioNumero: "654321",
      convenioPlano: "Standard",
      convenioValidade: "2024-06-30T00:00:00Z",
      profissionalId: "2",
    },
    profissional: {
      id: "2",
      nome: "Dra. Ana Costa",
      especialidadeId: "2",
      registro: "54321",
      crm: "54321-SP",
      email: "ana.costa@clinica.com",
      telefone: "(11) 77777-7777",
      sexo: "F",
      dataNascimento: "1985-01-01T00:00:00Z",
      dataContratacao: "2021-01-01T00:00:00Z",
      status: "ATIVO",
      createdAt: "2021-01-01T00:00:00Z",
      updatedAt: "2021-01-01T00:00:00Z",
      rua: "Rua B",
      numero: "456",
      complemento: "",
      bairro: "Vila Madalena",
      cidade: "São Paulo",
      estado: "SP",
      cep: "05433-000",
      horarioInicio: "09:00",
      horarioFim: "17:00",
      intervalo: "12:00-13:00",
      diasTrabalho: ["SEGUNDA", "TERCA", "QUARTA", "QUINTA"],
    },
  },
];

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "CONSULTA":
      return <Stethoscope className="h-5 w-5" />;
    case "RETORNO":
      return <Heart className="h-5 w-5" />;
    case "EXAME":
      return <Activity className="h-5 w-5" />;
    case "PROCEDIMENTO":
      return <UserCheck className="h-5 w-5" />;
    case "DOCUMENTO":
      return <FileEdit className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case "CONSULTA":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "RETORNO":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "EXAME":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "PROCEDIMENTO":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "DOCUMENTO":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDENTE":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "EM_ANDAMENTO":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "CONCLUIDO":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "CANCELADO":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export function ProntuariosHoje() {
  const navigate = useNavigate();
  const [prontuarios, setProntuarios] = useState<Prontuario[]>(prontuariosHoje);
  const [filter, setFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("TODOS");

  const filteredProntuarios = prontuarios.filter(prontuario => {
    const matchesFilter = prontuario.paciente?.nome.toLowerCase().includes(filter.toLowerCase()) ||
                         prontuario.profissional?.nome.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = selectedStatus === "TODOS" || prontuario.tipo === selectedStatus;
    return matchesFilter && matchesStatus;
  });

  const handleCreateProntuario = (prontuario: Prontuario) => {
    navigate(`/prontuarios/novo?pacienteId=${prontuario.pacienteId}&profissionalId=${prontuario.profissionalId}`);
  };

  const handleViewProntuario = (prontuario: Prontuario) => {
    navigate(`/prontuarios/visualizar/${prontuario.id}`);
  };

  const handleEditProntuario = (prontuario: Prontuario) => {
    navigate(`/prontuarios/novo?id=${prontuario.id}`);
  };

  const handleDeleteProntuario = (prontuario: Prontuario) => {
    setProntuarios(prev => prev.filter(p => p.id !== prontuario.id));
  };

  const hoje = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prontuários de Hoje</h1>
            <p className="text-muted-foreground">
              {hoje} - Gerencie os prontuários das consultas agendadas
            </p>
          </div>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => navigate("/prontuarios/novo")}
        >
          <Plus className="h-4 w-4" />
          Novo Prontuário
        </Button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prontuarios.length}</div>
            <p className="text-xs text-muted-foreground">
              Consultas agendadas para hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {prontuarios.filter(p => !p.descricao).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando prontuário
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {prontuarios.filter(p => p.descricao).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Prontuários finalizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prontuarios.length > 0 ? Math.round((prontuarios.filter(p => p.descricao).length / prontuarios.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Prontuários completados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Filtrar por paciente ou profissional..."
          className="max-w-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="TODOS">Todos os Tipos</option>
          <option value="CONSULTA">Consultas</option>
          <option value="RETORNO">Retornos</option>
          <option value="EXAME">Exames</option>
          <option value="PROCEDIMENTO">Procedimentos</option>
        </select>
      </div>

      {/* Lista de Prontuários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProntuarios.map((prontuario) => (
          <Card key={prontuario.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {getTipoIcon(prontuario.tipo)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{prontuario.paciente?.nome}</CardTitle>
                    <CardDescription>
                      {prontuario.profissional?.nome} • {new Date(prontuario.data).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getTipoColor(prontuario.tipo)}>
                    {prontuario.tipo}
                  </Badge>
                  <Badge className={prontuario.descricao ? getStatusColor("CONCLUIDO") : getStatusColor("PENDENTE")}>
                    {prontuario.descricao ? "Concluído" : "Pendente"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Paciente: {prontuario.paciente?.nome}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Stethoscope className="h-4 w-4" />
                  <span>Profissional: {prontuario.profissional?.nome}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Horário: {new Date(prontuario.data).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
              </div>

              {prontuario.descricao && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {prontuario.descricao}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  {prontuario.descricao ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProntuario(prontuario)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProntuario(prontuario)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o prontuário de {prontuario.paciente?.nome}? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProntuario(prontuario)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleCreateProntuario(prontuario)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Prontuário
                    </Button>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {prontuario.descricao ? "Prontuário criado" : "Aguardando prontuário"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProntuarios.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum prontuário encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {filter ? "Tente ajustar os filtros de busca" : "Não há consultas agendadas para hoje"}
            </p>
            <Button onClick={() => navigate("/prontuarios/novo")}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Prontuário
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
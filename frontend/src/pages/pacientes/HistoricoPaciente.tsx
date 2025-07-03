import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { AnamneseView } from "../../components/anamnese/AnamneseView";
import { EvolucaoPacienteChart } from "../../components/charts/EvolucaoPacienteChart";
import { usePacientes, usePaciente } from "../../hooks/useQueries";
import { Paciente } from "../../types/api";
import { 
  User, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Stethoscope, 
  ArrowLeft,
  Search,
  Filter,
  TrendingDown,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Dados temporários para evolução
const evolucaoMock = [
  {
    data: "2024-01-01",
    peso: 70,
    altura: 170,
    pressaoSistolica: 120,
    pressaoDiastolica: 80,
    imc: 24.2,
    observacoes: "Peso estável, pressão normal"
  },
  {
    data: "2024-02-01",
    peso: 69,
    altura: 170,
    pressaoSistolica: 118,
    pressaoDiastolica: 78,
    imc: 23.9,
    observacoes: "Pequena redução de peso, pressão melhorou"
  },
  {
    data: "2024-03-01",
    peso: 68,
    altura: 170,
    pressaoSistolica: 115,
    pressaoDiastolica: 75,
    imc: 23.5,
    observacoes: "Continuando evolução positiva"
  }
];

// Dados temporários para prontuários
const prontuariosMock = [
  {
    id: "1",
    data: "2024-03-15T10:00:00Z",
    tipo: "CONSULTA",
    descricao: "Consulta de rotina - acompanhamento nutricional",
    diagnostico: "Paciente em evolução positiva",
    prescricao: "Manter dieta atual, aumentar atividade física",
    observacoes: "Paciente relatou melhora na disposição",
    profissional: {
      nome: "Dr. Ana Silva",
      especialidade: "Nutricionista"
    }
  },
  {
    id: "2",
    data: "2024-02-15T14:30:00Z",
    tipo: "AVALIACAO",
    descricao: "Avaliação inicial - primeira consulta",
    diagnostico: "Sobrepeso leve, pressão arterial normal",
    prescricao: "Dieta personalizada, exercícios moderados",
    observacoes: "Paciente motivado para mudanças",
    profissional: {
      nome: "Dr. Ana Silva",
      especialidade: "Nutricionista"
    }
  },
  {
    id: "3",
    data: "2024-01-15T09:00:00Z",
    tipo: "CONSULTA",
    descricao: "Consulta de retorno - ajuste de dieta",
    diagnostico: "Boa adesão ao tratamento",
    prescricao: "Ajustar horários das refeições",
    observacoes: "Paciente segue orientações corretamente",
    profissional: {
      nome: "Dr. Ana Silva",
      especialidade: "Nutricionista"
    }
  }
];

export function HistoricoPaciente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedPacienteId, setSelectedPacienteId] = useState<string>(id || "");
  const [activeTab, setActiveTab] = useState("overview");
  const [filterPeriod, setFilterPeriod] = useState("6months");

  // Queries
  const { data: pacientes, isLoading: loadingPacientes } = usePacientes();
  const { data: paciente } = usePaciente(selectedPacienteId);

  // Dados filtrados por período
  const getFilteredProntuarios = () => {
    if (!prontuariosMock) return [];
    
    const now = new Date();
    const filterDate = new Date();
    
    switch (filterPeriod) {
      case "1month":
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case "3months":
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case "6months":
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case "1year":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return prontuariosMock;
    }
    
    return prontuariosMock.filter(p => new Date(p.data) >= filterDate);
  };

  const filteredProntuarios = getFilteredProntuarios();

  // Dados do paciente para AnamneseView
  const pacienteForAnamnese = paciente ? {
    id: parseInt(paciente.id),
    nome: paciente.nome,
    email: paciente.email,
    telefone: paciente.telefone,
    dataNascimento: paciente.dataNascimento,
    status: "Ativo"
  } : null;

  if (loadingPacientes) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Card className="p-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User className="h-6 w-6" />
              Histórico do Paciente
            </h1>
            <p className="text-muted-foreground">
              Visualize o histórico completo e evolução do paciente
            </p>
          </div>
        </div>
      </div>

      {/* Seletor de Paciente */}
      <Card className="group flex flex-col justify-between w-full hover:bg-muted/50 transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Search className="h-4 w-4 text-blue-700 dark:text-blue-400" />
            </div>
            Selecionar Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select
              value={selectedPacienteId}
              onValueChange={setSelectedPacienteId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um paciente" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(pacientes) && pacientes.map((paciente: Paciente) => (
                  <SelectItem key={paciente.id} value={paciente.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{paciente.nome}</span>
                      <Badge variant="secondary" className="text-xs">
                        {new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedPacienteId && paciente && (
        <>
          {/* Informações do Paciente */}
          <Card className="group flex flex-col justify-between w-full hover:bg-muted/50 transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <User className="h-4 w-4 text-green-700 dark:text-green-400" />
                </div>
                Informações do Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="text-lg font-semibold">{paciente.nome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                  <p className="text-lg font-semibold">
                    {format(new Date(paciente.dataNascimento), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Convênio</p>
                  <p className="text-lg font-semibold">{paciente.convenioNome}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs de Histórico */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="anamnese" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Anamnese
              </TabsTrigger>
              <TabsTrigger value="evolution" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Evolução
              </TabsTrigger>
              <TabsTrigger value="consultations" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Consultas
              </TabsTrigger>
            </TabsList>

            {/* Visão Geral */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resumo de Evolução */}
                <Card className="group flex flex-col justify-between w-full hover:bg-muted/50 transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-green-700 dark:text-green-400" />
                      </div>
                      Resumo de Evolução
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">2kg</p>
                          </div>
                          <p className="text-sm text-muted-foreground">Perda de Peso</p>
                        </div>
                        <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">5mmHg</p>
                          </div>
                          <p className="text-sm text-muted-foreground">Redução Pressão</p>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-violet-100 dark:bg-violet-900/30 rounded-lg border border-violet-200 dark:border-violet-800">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                          <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">3</p>
                        </div>
                        <p className="text-sm text-muted-foreground">Consultas Realizadas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Próximas Consultas */}
                <Card className="group flex flex-col justify-between w-full hover:bg-muted/50 transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                      </div>
                      Próximas Consultas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div>
                          <p className="font-medium">Consulta de Retorno</p>
                          <p className="text-sm text-muted-foreground">Dr. Ana Silva</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">15/04/2024</p>
                          <p className="text-sm text-muted-foreground">14:30</p>
                        </div>
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        Nenhuma outra consulta agendada
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Anamnese */}
            <TabsContent value="anamnese">
              <Card className="group flex flex-col justify-between w-full hover:bg-muted/50 transition-all duration-300 hover:shadow-md">
                <CardContent className="p-0">
                  {pacienteForAnamnese ? (
                    <AnamneseView paciente={pacienteForAnamnese} />
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <p className="text-muted-foreground">Carregando anamnese...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evolução */}
            <TabsContent value="evolution">
              <Card className="group flex flex-col justify-between w-full hover:bg-muted/50 transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-violet-700 dark:text-violet-400" />
                    </div>
                    Evolução do Paciente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EvolucaoPacienteChart data={evolucaoMock} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Consultas */}
            <TabsContent value="consultations">
              <Card className="group flex flex-col justify-between w-full hover:bg-muted/50 transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Calendar className="h-4 w-4 text-orange-700 dark:text-orange-400" />
                      </div>
                      Histórico de Consultas
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1month">Último mês</SelectItem>
                          <SelectItem value="3months">Últimos 3 meses</SelectItem>
                          <SelectItem value="6months">Últimos 6 meses</SelectItem>
                          <SelectItem value="1year">Último ano</SelectItem>
                          <SelectItem value="all">Todas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {filteredProntuarios.map((prontuario) => (
                        <div key={prontuario.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-all duration-300">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Stethoscope className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{prontuario.descricao}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {prontuario.profissional.nome} - {prontuario.profissional.especialidade}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {format(new Date(prontuario.data), "dd/MM/yyyy", { locale: ptBR })}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(prontuario.data), "HH:mm", { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {prontuario.diagnostico && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Diagnóstico</p>
                                <p className="text-sm">{prontuario.diagnostico}</p>
                              </div>
                            )}
                            {prontuario.prescricao && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Prescrição</p>
                                <p className="text-sm">{prontuario.prescricao}</p>
                              </div>
                            )}
                          </div>
                          
                          {prontuario.observacoes && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <p className="text-sm font-medium text-muted-foreground">Observações</p>
                              <p className="text-sm">{prontuario.observacoes}</p>
                            </div>
                          )}
                          
                          <div className="mt-3 pt-3 border-t border-border">
                            <Badge variant="outline" className="text-xs">
                              {prontuario.tipo}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      
                      {filteredProntuarios.length === 0 && (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Nenhuma consulta encontrada no período selecionado</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {!selectedPacienteId && (
        <Card className="group flex flex-col justify-between w-full hover:bg-muted/50 transition-all duration-300 hover:shadow-md">
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Selecione um paciente para visualizar o histórico</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
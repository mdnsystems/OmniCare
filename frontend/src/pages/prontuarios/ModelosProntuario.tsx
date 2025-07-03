import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Edit, 
  Copy, 
  Trash2,
  Stethoscope,
  Heart,
  Activity,
  UserCheck,
  FileEdit
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "../../components/ErrorBoundary";

interface ModeloProntuario {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  categoria: string;
  conteudo: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

function ModelosProntuarioContent() {
  const navigate = useNavigate();
  const [modelos, setModelos] = useState<ModeloProntuario[]>([
    {
      id: "1",
      nome: "Avaliação Nutricional Inicial",
      descricao: "Template para primeira consulta nutricional",
      tipo: "CONSULTA",
      categoria: "Nutrição",
      conteudo: "Avaliação completa com anamnese, medidas antropométricas e plano alimentar",
      ativo: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      nome: "Retorno Nutricional",
      descricao: "Template para consultas de retorno",
      tipo: "RETORNO",
      categoria: "Nutrição",
      conteudo: "Acompanhamento de evolução, ajustes no plano alimentar",
      ativo: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "3",
      nome: "Avaliação Clínica Geral",
      descricao: "Template para consulta médica geral",
      tipo: "CONSULTA",
      categoria: "Clínica Geral",
      conteudo: "Histórico médico, exame físico, diagnóstico e prescrição",
      ativo: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "4",
      nome: "Prescrição de Exercícios",
      descricao: "Template para prescrição de atividade física",
      tipo: "PROCEDIMENTO",
      categoria: "Educação Física",
      conteudo: "Avaliação física, prescrição de exercícios personalizada",
      ativo: false,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "5",
      nome: "Relatório de Exames",
      descricao: "Template para relatórios de exames laboratoriais",
      tipo: "EXAME",
      categoria: "Laboratório",
      conteudo: "Interpretação de resultados, recomendações",
      ativo: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ]);

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
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleToggleAtivo = (id: string) => {
    setModelos(prev => 
      prev.map(modelo => 
        modelo.id === id 
          ? { ...modelo, ativo: !modelo.ativo }
          : modelo
      )
    );
  };

  const handleDeleteModelo = (id: string) => {
    setModelos(prev => prev.filter(modelo => modelo.id !== id));
  };

  const handleCopyModelo = (modelo: ModeloProntuario) => {
    const novoModelo = {
      ...modelo,
      id: Date.now().toString(),
      nome: `${modelo.nome} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setModelos(prev => [...prev, novoModelo]);
  };

  const handleEditModelo = (modelo: ModeloProntuario) => {
    console.log("Editando modelo:", modelo);
    navigate(`/prontuarios/modelos/novo?id=${modelo.id}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Modelos de Prontuário</h1>
            <p className="text-muted-foreground">
              Gerencie templates e modelos para criação de prontuários
            </p>
          </div>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => navigate("/prontuarios/modelos/novo")}
        >
          <Plus className="h-4 w-4" />
          Novo Modelo
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 mb-6">
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
          Todos
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
          Nutrição
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
          Clínica Geral
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
          Educação Física
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
          Laboratório
        </Badge>
      </div>

      {/* Grid de Modelos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modelos.map((modelo) => (
          <Card key={modelo.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {getTipoIcon(modelo.tipo)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{modelo.nome}</CardTitle>
                    <CardDescription className="mt-1">
                      {modelo.descricao}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={modelo.ativo ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => handleToggleAtivo(modelo.id)}
                  >
                    {modelo.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getTipoColor(modelo.tipo)}>
                    {modelo.tipo}
                  </Badge>
                  <Badge variant="outline">
                    {modelo.categoria}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {modelo.conteudo}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  Atualizado em {new Date(modelo.updatedAt).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyModelo(modelo)}
                    title="Duplicar modelo"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditModelo(modelo)}
                    title="Editar modelo"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteModelo(modelo.id)}
                    title="Excluir modelo"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Modelos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelos.length}</div>
            <p className="text-xs text-muted-foreground">
              {modelos.filter(m => m.ativo).length} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modelos Ativos</CardTitle>
            <FileEdit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelos.filter(m => m.ativo).length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((modelos.filter(m => m.ativo).length / modelos.length) * 100)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(modelos.map(m => m.categoria)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Diferentes especialidades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(modelos.map(m => m.tipo)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Diferentes tipos de atendimento
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ModelosProntuario() {
  return (
    <ErrorBoundary>
      <ModelosProntuarioContent />
    </ErrorBoundary>
  );
}

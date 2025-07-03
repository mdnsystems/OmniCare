import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  User,
  ClipboardList,
  History,
  Heart,
  Utensils,
  Stethoscope,
  Pill,
  Droplet,
  Brain,
  Activity,
  TrendingUp,
  Target,
  Zap,
  Moon,
  Coffee,
  Dumbbell,
  Cigarette,
  Wine,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Edit,
  Save,
  X,
  Eye,
  Printer,
  Scale
} from "lucide-react";
import { useClinica } from "@/contexts/ClinicaContext";
import { TipoClinica } from "@/types/api";

interface Paciente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  status: string;
}

interface AnamneseViewProps {
  paciente: Paciente;
}

export function AnamneseView({ paciente }: AnamneseViewProps) {
  const [activeTab, setActiveTab] = useState("dados-gerais");
  const [isEditing, setIsEditing] = useState(false);
  const { configuracao, getCustomFields } = useClinica();

  // Tabs dinâmicas baseadas no tipo de clínica
  const getTabsByClinicaType = () => {
    const baseTabs = [
      {
        id: "dados-gerais",
        label: "Dados Gerais",
        icon: ClipboardList,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
      },
      {
        id: "antecedentes",
        label: "Antecedentes",
        icon: History,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
      },
    ];

    switch (configuracao?.tipo) {
      case TipoClinica.NUTRICIONAL:
        return [
          ...baseTabs,
          {
            id: "habitos",
            label: "Hábitos",
            icon: Heart,
            color: "text-rose-600 dark:text-rose-400",
            bgColor: "bg-rose-100 dark:bg-rose-900/30",
          },
          {
            id: "alimentacao",
            label: "Alimentação",
            icon: Utensils,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
          },
          {
            id: "hidratacao",
            label: "Hidratação",
            icon: Droplet,
            color: "text-cyan-600 dark:text-cyan-400",
            bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
          },
        ];

      case TipoClinica.PSICOLOGICA:
        return [
          ...baseTabs,
          {
            id: "estado-mental",
            label: "Estado Mental",
            icon: Brain,
            color: "text-violet-600 dark:text-violet-400",
            bgColor: "bg-violet-100 dark:bg-violet-900/30",
          },
          {
            id: "sintomas",
            label: "Sintomas",
            icon: Heart,
            color: "text-rose-600 dark:text-rose-400",
            bgColor: "bg-rose-100 dark:bg-rose-900/30",
          },
          {
            id: "historia-social",
            label: "História Social",
            icon: User,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
          },
        ];

      case TipoClinica.FISIOTERAPICA:
        return [
          ...baseTabs,
          {
            id: "avaliacao-fisica",
            label: "Avaliação Física",
            icon: Stethoscope,
            color: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-100 dark:bg-red-900/30",
          },
          {
            id: "mobilidade",
            label: "Mobilidade",
            icon: Heart,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-100 dark:bg-orange-900/30",
          },
          {
            id: "dor",
            label: "Avaliação da Dor",
            icon: Brain,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
          },
        ];

      case TipoClinica.MEDICA:
        return [
          ...baseTabs,
          {
            id: "exame-fisico",
            label: "Exame Físico",
            icon: Stethoscope,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
          },
          {
            id: "medicamentos",
            label: "Medicamentos",
            icon: Pill,
            color: "text-indigo-600 dark:text-indigo-400",
            bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
          },
          {
            id: "exames",
            label: "Exames",
            icon: Stethoscope,
            color: "text-amber-600 dark:text-amber-400",
            bgColor: "bg-amber-100 dark:bg-amber-900/30",
          },
        ];

      default:
        return [
          ...baseTabs,
          {
            id: "avaliacao",
            label: "Avaliação",
            icon: Stethoscope,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/30",
          },
          {
            id: "observacoes",
            label: "Observações",
            icon: ClipboardList,
            color: "text-gray-600 dark:text-gray-400",
            bgColor: "bg-gray-100 dark:bg-gray-900/30",
          },
        ];
    }
  };

  const tabs = getTabsByClinicaType();

  const getTituloAnamnese = () => {
    switch (configuracao?.tipo) {
      case TipoClinica.NUTRICIONAL:
        return "Anamnese Nutricional";
      case TipoClinica.PSICOLOGICA:
        return "Avaliação Psicológica";
      case TipoClinica.FISIOTERAPICA:
        return "Avaliação Fisioterapêutica";
      case TipoClinica.MEDICA:
        return "Anamnese Médica";
      case TipoClinica.ODONTOLOGICA:
        return "Anamnese Odontológica";
      case TipoClinica.ESTETICA:
        return "Avaliação Estética";
      case TipoClinica.VETERINARIA:
        return "Avaliação Veterinária";
      default:
        return "Avaliação";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dados-gerais":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <div className={cn("p-2 rounded-lg", tabs[0].bgColor)}>
                  <ClipboardList className={cn("h-5 w-5", tabs[0].color)} />
                </div>
                <CardTitle className="text-lg">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <p className="font-medium">{paciente.nome}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data de Nascimento:</span>
                    <p className="font-medium">{paciente.dataNascimento}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{paciente.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telefone:</span>
                    <p className="font-medium">{paciente.telefone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campos personalizados */}
            {getCustomFields('anamnese').length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Campos Específicos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getCustomFields('anamnese').map((campo) => (
                    <div key={campo.id} className="p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">{campo.nome}</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {campo.obrigatorio ? "Obrigatório" : "Opcional"}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "antecedentes":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <div className={cn("p-2 rounded-lg", tabs[1].bgColor)}>
                  <History className={cn("h-5 w-5", tabs[1].color)} />
                </div>
                <CardTitle className="text-lg">Histórico Clínico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Histórico Familiar</span>
                    <p className="text-sm text-muted-foreground mt-1">Diabetes, hipertensão, câncer</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Alergias</span>
                    <p className="text-sm text-muted-foreground mt-1">Nenhuma alergia conhecida</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Cirurgias</span>
                    <p className="text-sm text-muted-foreground mt-1">Apendicectomia (2018)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // Conteúdo específico por tipo de clínica
      case "alimentacao":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <div className={cn("p-2 rounded-lg", tabs[3].bgColor)}>
                  <Utensils className={cn("h-5 w-5", tabs[3].color)} />
                </div>
                <CardTitle className="text-lg">Preferências Alimentares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Alimentos Preferidos</span>
                    <p className="text-sm text-muted-foreground mt-1">Frutas, verduras, carnes magras</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Alimentos Rejeitados</span>
                    <p className="text-sm text-muted-foreground mt-1">Frituras, doces em excesso</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Restrições</span>
                    <p className="text-sm text-muted-foreground mt-1">Nenhuma</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "estado-mental":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <div className={cn("p-2 rounded-lg", tabs[2].bgColor)}>
                  <Brain className={cn("h-5 w-5", tabs[2].color)} />
                </div>
                <CardTitle className="text-lg">Estado Mental Atual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Humor</span>
                    <p className="text-sm text-muted-foreground mt-1">Estável, com momentos de ansiedade</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Sono</span>
                    <p className="text-sm text-muted-foreground mt-1">6-7 horas por noite, qualidade regular</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Concentração</span>
                    <p className="text-sm text-muted-foreground mt-1">Boa, com dificuldade em momentos de estresse</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "avaliacao-fisica":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <div className={cn("p-2 rounded-lg", tabs[2].bgColor)}>
                  <Stethoscope className={cn("h-5 w-5", tabs[2].color)} />
                </div>
                <CardTitle className="text-lg">Avaliação Física</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Força Muscular</span>
                    <p className="text-sm text-muted-foreground mt-1">4/5 - Boa força geral</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Amplitude de Movimento</span>
                    <p className="text-sm text-muted-foreground mt-1">Normal em todas as articulações</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Equilíbrio</span>
                    <p className="text-sm text-muted-foreground mt-1">Estável, sem alterações</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "exame-fisico":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <div className={cn("p-2 rounded-lg", tabs[2].bgColor)}>
                  <Stethoscope className={cn("h-5 w-5", tabs[2].color)} />
                </div>
                <CardTitle className="text-lg">Exame Físico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Ausculta Cardíaca</span>
                    <p className="text-sm text-muted-foreground mt-1">Ritmo regular, sem sopros</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Ausculta Pulmonar</span>
                    <p className="text-sm text-muted-foreground mt-1">Murmúrio vesicular presente, sem ruídos adventícios</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Abdome</span>
                    <p className="text-sm text-muted-foreground mt-1">Flácido, indolor à palpação, sem visceromegalias</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Extremidades</span>
                    <p className="text-sm text-muted-foreground mt-1">Sem edema, pulsos presentes e simétricos</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Pele e Mucosas</span>
                    <p className="text-sm text-muted-foreground mt-1">Corada, hidratada, sem lesões</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "medicamentos":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <div className={cn("p-2 rounded-lg", tabs[3].bgColor)}>
                  <Pill className={cn("h-5 w-5", tabs[3].color)} />
                </div>
                <CardTitle className="text-lg">Medicamentos em Uso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Losartana 50mg</span>
                    <p className="text-sm text-muted-foreground mt-1">1 comprimido ao dia - Controle da pressão arterial</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Metformina 850mg</span>
                    <p className="text-sm text-muted-foreground mt-1">1 comprimido 2x ao dia - Controle da glicemia</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Vitamina D 1000UI</span>
                    <p className="text-sm text-muted-foreground mt-1">1 cápsula ao dia - Suplementação</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-lg">Alergias Medicamentosas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <span className="text-sm font-medium">Penicilina</span>
                    <p className="text-sm text-muted-foreground mt-1">Reação alérgica com urticária</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "exames":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <div className={cn("p-2 rounded-lg", tabs[4].bgColor)}>
                  <Stethoscope className={cn("h-5 w-5", tabs[4].color)} />
                </div>
                <CardTitle className="text-lg">Exames Laboratoriais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Hemograma Completo</span>
                    <p className="text-sm text-muted-foreground mt-1">Normal - Realizado em 15/03/2024</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Glicemia de Jejum</span>
                    <p className="text-sm text-muted-foreground mt-1">95 mg/dL - Normal - Realizado em 15/03/2024</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Colesterol Total</span>
                    <p className="text-sm text-muted-foreground mt-1">180 mg/dL - Normal - Realizado em 15/03/2024</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Creatinina</span>
                    <p className="text-sm text-muted-foreground mt-1">0.9 mg/dL - Normal - Realizado em 15/03/2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Exames de Imagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Radiografia de Tórax</span>
                    <p className="text-sm text-muted-foreground mt-1">Normal - Realizado em 10/03/2024</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Eletrocardiograma</span>
                    <p className="text-sm text-muted-foreground mt-1">Ritmo sinusal normal - Realizado em 10/03/2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">
                Conteúdo específico para {activeTab} será implementado conforme necessário.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header com ações */}
      <div className="flex items-center justify-between mb-6 p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{getTituloAnamnese()}</h2>
            <p className="text-muted-foreground">
              Avaliação completa - {paciente.nome}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button 
            variant={isEditing ? "default" : "outline"} 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs de navegação */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="px-4">
            <TabsList className="w-full flex flex-row justify-center gap-2 items-center">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value={activeTab} className="h-full mt-0">
              {renderContent()}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
} 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Plus, 
  ClipboardList,
  Calendar,
  UserCheck
} from "lucide-react";

export function Prontuarios() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Novo Prontuário",
      description: "Criar um novo prontuário para paciente",
      icon: Plus,
      href: "/prontuarios/novo",
      color: "bg-blue-500",
      iconColor: "text-blue-600",
    },
    {
      title: "Lista de Prontuários",
      description: "Visualizar e gerenciar todos os prontuários",
      icon: ClipboardList,
      href: "/prontuarios/lista",
      color: "bg-green-500",
      iconColor: "text-green-600",
    },
    {
      title: "Modelos de Prontuário",
      description: "Gerenciar modelos e templates de prontuários",
      icon: FileText,
      href: "/prontuarios/modelos",
      color: "bg-purple-500",
      iconColor: "text-purple-600",
    },
    {
      title: "Consultas do Dia",
      description: "Prontuários das consultas agendadas para hoje",
      icon: Calendar,
      href: "/prontuarios/hoje",
      color: "bg-orange-500",
      iconColor: "text-orange-600",
    },
    {
      title: "Anamnese",
      description: "Gerenciar avaliações nutricionais dos pacientes",
      icon: UserCheck,
      href: "/anamnese",
      color: "bg-teal-500",
      iconColor: "text-teal-600",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prontuários</h1>
          <p className="text-muted-foreground">
            Gerencie os prontuários médicos e nutricionais dos pacientes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card 
            key={card.title} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(card.href)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-opacity-10 ${card.color.replace('bg-', 'bg-')}`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {card.description}
              </CardDescription>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(card.href);
                }}
              >
                Acessar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Prontuários</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prontuários Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              5 consultas pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anamneses</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">
              89% dos pacientes com anamnese completa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modelos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 modelos personalizados
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  FileText, 
  Plus, 
  Activity, 
  Calendar, 
  Clock,
  Download
} from 'lucide-react';
import { useClinica } from '@/contexts/ClinicaContext';
import { TipoClinica } from '@/types/api';
import { useExames } from "@/hooks/useExames";
import ExamesTable from "@/components/tables/exames";

export function Exames() {
  const navigate = useNavigate();
  const { configuracao } = useClinica();

  // Buscar estatísticas de exames
  const { data: examesData } = useExames({ limit: 1000 }); // Buscar todas para estatísticas
  const exames = examesData?.data || [];

  const getTituloPagina = () => {
    switch (configuracao?.tipo) {
      case TipoClinica.NUTRICIONAL:
        return "Exames Nutricionais";
      case TipoClinica.PSICOLOGICA:
        return "Avaliações Psicológicas";
      case TipoClinica.FISIOTERAPICA:
        return "Exames Fisioterapêuticos";
      case TipoClinica.MEDICA:
        return "Exames Médicos";
      case TipoClinica.ODONTOLOGICA:
        return "Exames Odontológicos";
      case TipoClinica.ESTETICA:
        return "Exames Estéticos";
      case TipoClinica.VETERINARIA:
        return "Exames Veterinários";
      default:
        return "Exames";
    }
  };

  const getSubtitulo = () => {
    switch (configuracao?.tipo) {
      case TipoClinica.NUTRICIONAL:
        return "Gerencie os exames nutricionais dos pacientes";
      case TipoClinica.PSICOLOGICA:
        return "Gerencie as avaliações psicológicas dos pacientes";
      case TipoClinica.FISIOTERAPICA:
        return "Gerencie os exames fisioterapêuticos dos pacientes";
      case TipoClinica.MEDICA:
        return "Gerencie os exames médicos dos pacientes";
      case TipoClinica.ODONTOLOGICA:
        return "Gerencie os exames odontológicos dos pacientes";
      case TipoClinica.ESTETICA:
        return "Gerencie os exames estéticos dos pacientes";
      case TipoClinica.VETERINARIA:
        return "Gerencie os exames veterinários dos pacientes";
      default:
        return "Gerencie os exames dos pacientes";
    }
  };

  const getBotaoNovoExame = () => {
    switch (configuracao?.tipo) {
      case TipoClinica.NUTRICIONAL:
        return "Novo Exame Nutricional";
      case TipoClinica.PSICOLOGICA:
        return "Nova Avaliação Psicológica";
      case TipoClinica.FISIOTERAPICA:
        return "Novo Exame Fisioterapêutico";
      case TipoClinica.MEDICA:
        return "Novo Exame Médico";
      case TipoClinica.ODONTOLOGICA:
        return "Novo Exame Odontológico";
      case TipoClinica.ESTETICA:
        return "Novo Exame Estético";
      case TipoClinica.VETERINARIA:
        return "Novo Exame Veterinário";
      default:
        return "Novo Exame";
    }
  };

  // Calcular estatísticas
  const totalExames = exames.length;
  const examesHoje = exames.filter(e => {
    const hoje = new Date().toDateString();
    const dataExame = new Date(e.data).toDateString();
    return hoje === dataExame;
  }).length;
  
  const examesEstaSemana = exames.filter(e => {
    const hoje = new Date();
    const dataExame = new Date(e.data);
    const diffTime = Math.abs(hoje.getTime() - dataExame.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  const examesEsteMes = exames.filter(e => {
    const hoje = new Date();
    const dataExame = new Date(e.data);
    return hoje.getMonth() === dataExame.getMonth() && 
           hoje.getFullYear() === dataExame.getFullYear();
  }).length;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{getTituloPagina()}</h1>
            <p className="text-muted-foreground">
              {getSubtitulo()}
            </p>
          </div>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => navigate("/exames/novo")}
        >
          <Plus className="h-4 w-4" />
          {getBotaoNovoExame()}
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalExames}</p>
                <p className="text-sm text-muted-foreground">Total de Exames</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{examesHoje}</p>
                <p className="text-sm text-muted-foreground">Exames Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{examesEstaSemana}</p>
                <p className="text-sm text-muted-foreground">Esta Semana</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{examesEsteMes}</p>
                <p className="text-sm text-muted-foreground">Este Mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Exames */}
      <Card className="flex-1">
        <CardContent className="p-0">
          <ExamesTable />
        </CardContent>
      </Card>
    </div>
  );
} 
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  UserCheck, 
  Plus
} from 'lucide-react';
import { useClinica } from '@/contexts/ClinicaContext';
import { TipoClinica } from '@/types/api';
import AnamneseTable from "@/components/tables/anamnese";

export default function Anamnese() {
  const navigate = useNavigate();
  const { configuracao } = useClinica();

  const getTituloPagina = () => {
    switch (configuracao?.tipo) {
      case TipoClinica.NUTRICIONAL:
        return "Avaliações Nutricionais";
      case TipoClinica.PSICOLOGICA:
        return "Avaliações Psicológicas";
      case TipoClinica.FISIOTERAPICA:
        return "Avaliações Fisioterapêuticas";
      case TipoClinica.MEDICA:
        return "Anamneses Médicas";
      case TipoClinica.ODONTOLOGICA:
        return "Anamneses Odontológicas";
      case TipoClinica.ESTETICA:
        return "Avaliações Estéticas";
      case TipoClinica.VETERINARIA:
        return "Avaliações Veterinárias";
      default:
        return "Avaliações";
    }
  };

  const getSubtitulo = () => {
    switch (configuracao?.tipo) {
      case TipoClinica.NUTRICIONAL:
        return "Gerencie as avaliações nutricionais dos pacientes";
      case TipoClinica.PSICOLOGICA:
        return "Gerencie as avaliações psicológicas dos pacientes";
      case TipoClinica.FISIOTERAPICA:
        return "Gerencie as avaliações fisioterapêuticas dos pacientes";
      case TipoClinica.MEDICA:
        return "Gerencie as anamneses médicas dos pacientes";
      case TipoClinica.ODONTOLOGICA:
        return "Gerencie as anamneses odontológicas dos pacientes";
      case TipoClinica.ESTETICA:
        return "Gerencie as avaliações estéticas dos pacientes";
      case TipoClinica.VETERINARIA:
        return "Gerencie as avaliações veterinárias dos pacientes";
      default:
        return "Gerencie as avaliações dos pacientes";
    }
  };

  const getBotaoNovaAvaliacao = () => {
    switch (configuracao?.tipo) {
      case TipoClinica.NUTRICIONAL:
        return "Nova Avaliação Nutricional";
      case TipoClinica.PSICOLOGICA:
        return "Nova Avaliação Psicológica";
      case TipoClinica.FISIOTERAPICA:
        return "Nova Avaliação Fisioterapêutica";
      case TipoClinica.MEDICA:
        return "Nova Anamnese";
      case TipoClinica.ODONTOLOGICA:
        return "Nova Anamnese";
      case TipoClinica.ESTETICA:
        return "Nova Avaliação Estética";
      case TipoClinica.VETERINARIA:
        return "Nova Avaliação Veterinária";
      default:
        return "Nova Avaliação";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <UserCheck className="h-6 w-6 text-primary" />
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
          onClick={() => navigate("/anamnese/nova")}
        >
          <Plus className="h-4 w-4" />
          {getBotaoNovaAvaliacao()}
        </Button>
      </div>

      {/* Tabela de Anamneses */}
      <Card className="flex-1">
        <CardContent className="pt-0 p-4">
          <AnamneseTable />
        </CardContent>
      </Card>
    </div>
  );
} 
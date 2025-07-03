import { PacienteForm } from "../../components/forms/paciente";
import { Card } from "../../components/ui/card";

export function NovoPaciente() {
  return (
    <Card className="p-4">
      <PacienteForm />
    </Card>
  );
} 
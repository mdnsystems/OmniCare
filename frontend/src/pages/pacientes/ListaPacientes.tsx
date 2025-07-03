import PacientesTable from "../../components/tables/pacientes";
import { Card } from "../../components/ui/card";

export function ListaPacientes() {
  return (
    <Card className="p-4">
      <PacientesTable />
    </Card>
  );
} 
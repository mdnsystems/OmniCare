import AgendamentosTable from "../../components/tables/agendamentos";
import { Card } from "../../components/ui/card";

export function ListaAgendamentos() {
  return (
    <Card className="p-4">
      <AgendamentosTable />
    </Card>
  );
} 
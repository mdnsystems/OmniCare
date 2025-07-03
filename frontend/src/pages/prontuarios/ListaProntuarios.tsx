import { ProntuariosTable } from "../../components/tables/prontuarios";
import { Card } from "../../components/ui/card";

export function ListaProntuarios() {
  return (
    <Card className="p-4">
      <ProntuariosTable />
    </Card>
  );
}

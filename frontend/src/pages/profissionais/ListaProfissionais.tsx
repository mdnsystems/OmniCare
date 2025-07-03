import { Card } from "../../components/ui/card";
import ProfissionaisTable from "../../components/tables/profissionais";

export function ListaProfissionais() {
  return (
    <Card className="p-4">
      <ProfissionaisTable />
    </Card>
  );
} 
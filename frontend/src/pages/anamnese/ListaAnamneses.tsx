import AnamneseTable from "../../components/tables/anamnese";
import { Card } from "../../components/ui/card";

export function ListaAnamneses() {
  return (
    <Card className="p-4">
      <AnamneseTable />
    </Card>
  );
} 
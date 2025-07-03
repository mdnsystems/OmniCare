import ProntuarioForm from "../../components/forms/prontuario";
import { Card } from "../../components/ui/card";

export function NovoProntuario() {
  return (
    <Card className="p-4">
      <ProntuarioForm />
    </Card>
  );
}

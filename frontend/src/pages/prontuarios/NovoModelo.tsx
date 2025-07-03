import ModeloProntuarioForm from "../../components/forms/modelo-prontuario";
import { Card } from "../../components/ui/card";
import { ErrorBoundary } from "../../components/ErrorBoundary";

export function NovoModelo() {
  return (
    <ErrorBoundary>
      <Card className="p-4">
        <ModeloProntuarioForm />
      </Card>
    </ErrorBoundary>
  );
} 
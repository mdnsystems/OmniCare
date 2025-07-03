import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileText, AlertTriangle, Loader2 } from "lucide-react";
import { Anamnese } from "@/types/api";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DeleteAnamneseDialogProps {
  anamnese: Anamnese | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  hasRelatedRecords?: boolean;
}

export function DeleteAnamneseDialog({
  anamnese,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  hasRelatedRecords = false,
}: DeleteAnamneseDialogProps) {
  if (!anamnese) return null;

  if (hasRelatedRecords) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Não é possível excluir
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span>Esta anamnese possui registros relacionados e não pode ser excluída.</span>
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mt-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Considere editar a anamnese em vez de excluí-la.</span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction onClick={onClose}>
              Entendi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta anamnese? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">
                Anamnese de {anamnese.paciente?.nome || "Paciente"}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(parseISO(anamnese.data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              {anamnese.campos?.queixaPrincipal && (
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">Queixa:</span> {anamnese.campos.queixaPrincipal.length > 50 
                    ? `${anamnese.campos.queixaPrincipal.substring(0, 50)}...` 
                    : anamnese.campos.queixaPrincipal}
                </p>
              )}
            </div>
          </div>

          {anamnese.profissional && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Profissional:</span> {anamnese.profissional.nome}
            </div>
          )}

          {anamnese.campos?.hipoteseDiagnostica && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Hipótese:</span> {anamnese.campos.hipoteseDiagnostica.length > 40 
                ? `${anamnese.campos.hipoteseDiagnostica.substring(0, 40)}...` 
                : anamnese.campos.hipoteseDiagnostica}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Excluindo...
              </>
            ) : (
              "Excluir Anamnese"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 
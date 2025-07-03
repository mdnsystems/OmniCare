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
import { Exame } from "../types/exame";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DeleteExameDialogProps {
  exame: Exame | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteExameDialog({
  exame,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteExameDialogProps) {
  if (!exame) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este exame? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">
                Exame de {exame.prontuario?.paciente?.nome || "Paciente"}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(parseISO(exame.data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-medium">Tipo:</span> {exame.tipo}
              </p>
            </div>
          </div>

          {exame.resultado && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Resultado:</span> {exame.resultado.length > 50 
                ? `${exame.resultado.substring(0, 50)}...` 
                : exame.resultado}
            </div>
          )}

          {exame.prontuario?.profissional && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Profissional:</span> {exame.prontuario.profissional.nome}
            </div>
          )}

          {exame.arquivos && exame.arquivos.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Arquivos:</span> {exame.arquivos.length} arquivo(s) serão removidos
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
              "Excluir Exame"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 
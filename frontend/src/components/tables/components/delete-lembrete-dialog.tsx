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
import { Bell, AlertTriangle, Loader2 } from "lucide-react";
import { Lembrete } from "../types/lembrete";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DeleteLembreteDialogProps {
  lembrete: Lembrete | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteLembreteDialog({
  lembrete,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteLembreteDialogProps) {
  if (!lembrete) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este lembrete? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">
                Lembrete de {lembrete.paciente?.nome || "Paciente"}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(parseISO(lembrete.data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-medium">Título:</span> {lembrete.titulo}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Hora:</span> {lembrete.hora}
              </p>
            </div>
          </div>

          {lembrete.descricao && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Descrição:</span> {lembrete.descricao.length > 50 
                ? `${lembrete.descricao.substring(0, 50)}...` 
                : lembrete.descricao}
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Tipo:</span> {lembrete.tipo}
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Status:</span> {lembrete.status}
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Prioridade:</span> {lembrete.prioridade}
          </div>

          {lembrete.profissional && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Profissional:</span> {lembrete.profissional.nome}
            </div>
          )}

          {lembrete.repetir && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Repetir:</span> Sim{lembrete.frequencia && ` - ${lembrete.frequencia}`}
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
              "Excluir Lembrete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 
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
import { Calendar, AlertTriangle, Loader2 } from "lucide-react";
import { Agendamento } from "../types/agendamento";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DeleteAgendamentoDialogProps {
  agendamento: Agendamento | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteAgendamentoDialog({
  agendamento,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteAgendamentoDialogProps) {
  if (!agendamento) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">
                {agendamento.paciente?.nome || "Paciente"} - {agendamento.tipo}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(parseISO(agendamento.data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground">
                {agendamento.horaInicio} - {agendamento.horaFim}
              </p>
            </div>
          </div>

          {agendamento.profissional && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Profissional:</span> {agendamento.profissional.nome}
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Status:</span> {agendamento.status}
          </div>
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
              "Excluir Agendamento"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 
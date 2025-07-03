import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Profissional } from "../types/profissional";
import { AlertTriangle } from "lucide-react";

interface DeleteProfissionalDialogProps {
  profissional: Profissional | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  hasRelatedRecords?: boolean;
}

export function DeleteProfissionalDialog({
  profissional,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  hasRelatedRecords = false,
}: DeleteProfissionalDialogProps) {
  if (hasRelatedRecords) {
    return (
      <ConfirmDialog
        open={isOpen}
        onOpenChange={onClose}
        title="Não é possível excluir"
        description={
          <>
            <span>Este profissional possui registros relacionados e não pode ser excluído.</span>
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mt-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Considere desativar o profissional em vez de excluí-lo.</span>
            </div>
          </>
        }
        confirmText="Entendi"
        onConfirm={onClose}
        variant="default"
      />
    );
  }

  return (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={onClose}
      title="Confirmar exclusão"
      description={`Tem certeza que deseja excluir o profissional "${profissional?.nome}"?\n\nEsta ação não pode ser desfeita.`}
      confirmText="Excluir"
      onConfirm={onConfirm}
      variant="destructive"
      isLoading={isLoading}
    />
  );
} 
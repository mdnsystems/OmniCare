import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Paciente } from "../types/paciente";

interface DeletePacienteDialogProps {
  paciente: Paciente | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cascade: boolean) => void;
  isLoading?: boolean;
  hasRelatedRecords?: boolean;
}

export function DeletePacienteDialog({
  paciente,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  hasRelatedRecords = false,
}: DeletePacienteDialogProps) {
  const [cascade, setCascade] = useState(false);

  const handleConfirm = () => {
    onConfirm(cascade);
  };

  const handleClose = () => {
    setCascade(false);
    onClose();
  };

  return (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={handleClose}
      title="Confirmar exclusão"
      description={
        <>
          <span>
            Tem certeza que deseja excluir o paciente <strong>"{paciente?.nome}"</strong>?
          </span>
          
          {hasRelatedRecords && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-4">
              <span className="text-sm text-yellow-800 dark:text-yellow-200 block mb-3">
                ⚠️ Este paciente possui registros relacionados (agendamentos, prontuários, etc.) que impedem a exclusão.
              </span>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cascade"
                  checked={cascade}
                  onCheckedChange={(checked) => setCascade(checked as boolean)}
                />
                <Label htmlFor="cascade" className="text-sm font-medium">
                  Deletar também todos os registros relacionados
                </Label>
              </div>
              
              {cascade && (
                <span className="text-xs text-yellow-700 dark:text-yellow-300 block mt-2">
                  ⚠️ Esta ação irá remover permanentemente todos os agendamentos, prontuários, anamneses e faturamentos relacionados ao paciente.
                </span>
              )}
            </div>
          )}
          
          <span className="text-sm text-gray-600 dark:text-gray-400 block mt-4">
            Esta ação não pode ser desfeita.
          </span>
        </>
      }
      confirmText={cascade ? "Excluir tudo" : "Excluir"}
      onConfirm={handleConfirm}
      variant="destructive"
      isLoading={isLoading}
    />
  );
} 
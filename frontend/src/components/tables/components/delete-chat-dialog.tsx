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
import { MessageSquare, AlertTriangle, Loader2 } from "lucide-react";
import { Chat } from "../types/chat";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DeleteChatDialogProps {
  chat: Chat | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteChatDialog({
  chat,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteChatDialogProps) {
  if (!chat) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este chat? Esta ação não pode ser desfeita e todas as mensagens serão perdidas.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">
                {chat.titulo}
              </p>
              <p className="text-sm text-muted-foreground">
                Criado em {format(parseISO(chat.createdAt), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-medium">Tipo:</span> {chat.tipo}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Status:</span> {chat.status}
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Participantes:</span> {chat.participantes ? chat.participantes.length : 0}
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Mensagens:</span> {chat.mensagens ? chat.mensagens.length : 0}
          </div>

          {chat.criador && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Criado por:</span> {chat.criador.nome}
            </div>
          )}

          <div className="text-sm text-muted-foreground bg-destructive/10 p-3 rounded-md border border-destructive/20">
            <span className="font-medium text-destructive">⚠️ Atenção:</span> Esta ação irá excluir permanentemente o chat e todas as suas mensagens. Esta operação não pode ser desfeita.
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
              "Excluir Chat"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 
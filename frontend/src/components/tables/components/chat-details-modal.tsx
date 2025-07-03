import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, MessageSquare, Users, Clock, MapPin, FileText, Mail, Phone } from "lucide-react";
import { Chat } from "../types/chat";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChatDetailsModalProps {
  chat: Chat | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatDetailsModal({ chat, isOpen, onClose }: ChatDetailsModalProps) {
  if (!chat) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return <Badge variant="outline" className="text-green-600 border-green-600">Ativo</Badge>;
      case 'ARQUIVADO':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Arquivado</Badge>;
      case 'FECHADO':
        return <Badge variant="outline" className="text-red-600 border-red-600">Fechado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'GRUPO':
        return <Badge className="bg-blue-500 text-white">Grupo</Badge>;
      case 'PRIVADO':
        return <Badge className="bg-purple-500 text-white">Privado</Badge>;
      case 'SUPORTE':
        return <Badge className="bg-orange-500 text-white">Suporte</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Detalhes do Chat
          </DialogTitle>
          <DialogDescription>
            Visualização detalhada do chat incluindo informações dos participantes, mensagens e dados do sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Chat */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-3">Informações do Chat</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Título</p>
                  <p className="text-sm text-muted-foreground">{chat.titulo}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium">Tipo</p>
                  <div className="mt-1">{getTipoBadge(chat.tipo)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium">Status</p>
                  <div className="mt-1">{getStatusBadge(chat.status)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Participantes</p>
                  <p className="text-sm text-muted-foreground">
                    {chat.participantes ? chat.participantes.length : 0} participantes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Mensagens</p>
                  <p className="text-sm text-muted-foreground">
                    {chat.mensagens ? chat.mensagens.length : 0} mensagens
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Criado em</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(chat.createdAt), "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Criador */}
          {chat.criador && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Informações do Criador</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Nome</p>
                    <p className="text-sm text-muted-foreground">{chat.criador.nome}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{chat.criador.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Função</p>
                    <p className="text-sm text-muted-foreground">{chat.criador.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Participantes */}
          {chat.participantes && chat.participantes.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Participantes</h3>
              <div className="space-y-3">
                {chat.participantes.map((participante) => (
                  <div key={participante.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-md border">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{participante.nome}</p>
                        <p className="text-xs text-muted-foreground">{participante.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={participante.ativo ? "default" : "secondary"}>
                        {participante.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {participante.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Últimas Mensagens */}
          {chat.mensagens && chat.mensagens.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Últimas Mensagens</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {chat.mensagens.slice(-5).map((mensagem) => (
                  <div key={mensagem.id} className="p-3 bg-white dark:bg-gray-900 rounded-md border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{mensagem.senderName}</span>
                        <Badge variant="outline" className="text-xs">
                          {mensagem.senderRole}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(mensagem.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      {mensagem.content.length > 100 
                        ? `${mensagem.content.substring(0, 100)}...` 
                        : mensagem.content}
                    </p>
                    {mensagem.arquivos && mensagem.arquivos.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          {mensagem.arquivos.length} arquivo(s) anexado(s)
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informações do Sistema */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-3">Informações do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Criado em</p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(chat.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="font-medium">Última atualização</p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(chat.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
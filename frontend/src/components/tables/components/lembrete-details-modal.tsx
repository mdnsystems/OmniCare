import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Phone, Mail, FileText, Clock, MapPin, Bell, AlertCircle } from "lucide-react";
import { Lembrete } from "../types/lembrete";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LembreteDetailsModalProps {
  lembrete: Lembrete | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LembreteDetailsModal({ lembrete, isOpen, onClose }: LembreteDetailsModalProps) {
  if (!lembrete) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pendente</Badge>;
      case 'CONCLUIDO':
        return <Badge variant="outline" className="text-green-600 border-green-600">Concluído</Badge>;
      case 'CANCELADO':
        return <Badge variant="outline" className="text-red-600 border-red-600">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'ALTA':
        return <Badge className="bg-red-500 text-white">Alta</Badge>;
      case 'MEDIA':
        return <Badge className="bg-yellow-500 text-white">Média</Badge>;
      case 'BAIXA':
        return <Badge className="bg-green-500 text-white">Baixa</Badge>;
      default:
        return <Badge variant="outline">{prioridade}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Detalhes do Lembrete
          </DialogTitle>
          <DialogDescription>
            Visualização detalhada do lembrete incluindo informações de agendamento, paciente e profissional responsável.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Lembrete */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-3">Informações do Lembrete</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Data</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(lembrete.data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Hora</p>
                  <p className="text-sm text-muted-foreground">{lembrete.hora}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Título</p>
                  <p className="text-sm text-muted-foreground">{lembrete.titulo}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Tipo</p>
                  <p className="text-sm text-muted-foreground">{lembrete.tipo}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium">Status</p>
                  <div className="mt-1">{getStatusBadge(lembrete.status)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium">Prioridade</p>
                  <div className="mt-1">{getPrioridadeBadge(lembrete.prioridade)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium">Repetir</p>
                  <p className="text-sm text-muted-foreground">
                    {lembrete.repetir ? "Sim" : "Não"}
                  </p>
                </div>
              </div>

              {lembrete.frequencia && (
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">Frequência</p>
                    <p className="text-sm text-muted-foreground">{lembrete.frequencia}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Descrição */}
          {lembrete.descricao && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Descrição</h3>
              <p className="text-sm text-muted-foreground bg-white dark:bg-gray-900 p-3 rounded-md border whitespace-pre-wrap">
                {lembrete.descricao}
              </p>
            </div>
          )}

          {/* Informações do Paciente */}
          {lembrete.paciente && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Informações do Paciente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Nome</p>
                    <p className="text-sm text-muted-foreground">{lembrete.paciente.nome}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{lembrete.paciente.telefone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{lembrete.paciente.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">CPF</p>
                    <p className="text-sm text-muted-foreground">{lembrete.paciente.cpf}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informações do Profissional */}
          {lembrete.profissional && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Informações do Profissional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Nome</p>
                    <p className="text-sm text-muted-foreground">{lembrete.profissional.nome}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">CRM</p>
                    <p className="text-sm text-muted-foreground">{lembrete.profissional.crm}</p>
                  </div>
                </div>

                {lembrete.profissional.especialidade && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Especialidade</p>
                      <p className="text-sm text-muted-foreground">{lembrete.profissional.especialidade.nome}</p>
                    </div>
                  </div>
                )}
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
                  {format(parseISO(lembrete.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="font-medium">Última atualização</p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(lembrete.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
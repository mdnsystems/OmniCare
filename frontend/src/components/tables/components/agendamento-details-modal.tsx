import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Mail, MapPin, FileText, Calendar as CalendarIcon } from "lucide-react";
import { Agendamento } from "../types/agendamento";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TipoAgendamento, StatusAgendamento } from "@/types/api";
import { cn } from "@/lib/utils";

interface AgendamentoDetailsModalProps {
  agendamento: Agendamento | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AgendamentoDetailsModal({ agendamento, isOpen, onClose }: AgendamentoDetailsModalProps) {
  if (!agendamento) return null;

  const getTipoColor = (tipo: TipoAgendamento) => {
    switch (tipo) {
      case TipoAgendamento.CONSULTA:
        return 'bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 text-emerald-700 border-emerald-200 dark:border-emerald-800';
      case TipoAgendamento.RETORNO:
        return 'bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 text-blue-700 border-blue-200 dark:border-blue-800';
      case TipoAgendamento.EXAME:
        return 'bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 text-orange-700 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400 text-gray-700 border-gray-200 dark:border-gray-800';
    }
  };

  const getStatusColor = (status: StatusAgendamento) => {
    switch (status) {
      case StatusAgendamento.CONFIRMADO:
        return 'bg-green-100 dark:bg-green-900/30 dark:text-green-400 text-green-700 border-green-200 dark:border-green-800';
      case StatusAgendamento.AGENDADO:
        return 'bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 text-yellow-700 border-yellow-200 dark:border-yellow-800';
      case StatusAgendamento.CANCELADO:
        return 'bg-red-100 dark:bg-red-900/30 dark:text-red-400 text-red-700 border-red-200 dark:border-red-800';
      case StatusAgendamento.REALIZADO:
        return 'bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 text-blue-700 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400 text-gray-700 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Detalhes do Agendamento
          </DialogTitle>
          <DialogDescription>
            Visualização detalhada do agendamento incluindo informações da consulta, paciente e profissional responsável.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Agendamento */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-3">Informações da Consulta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Data</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(agendamento.data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Horário</p>
                  <p className="text-sm text-muted-foreground">
                    {agendamento.horaInicio} - {agendamento.horaFim}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Tipo</p>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "mt-1",
                      getTipoColor(agendamento.tipo)
                    )}
                  >
                    {agendamento.tipo}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Status</p>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "mt-1",
                      getStatusColor(agendamento.status)
                    )}
                  >
                    {agendamento.status}
                  </Badge>
                </div>
              </div>
            </div>

            {agendamento.observacoes && (
              <div className="mt-4">
                <p className="font-medium mb-2">Observações</p>
                <p className="text-sm text-muted-foreground bg-white dark:bg-gray-900 p-3 rounded-md border">
                  {agendamento.observacoes}
                </p>
              </div>
            )}
          </div>

          {/* Informações do Paciente */}
          {agendamento.paciente && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Informações do Paciente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Nome</p>
                    <p className="text-sm text-muted-foreground">{agendamento.paciente.nome}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{agendamento.paciente.telefone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{agendamento.paciente.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">CPF</p>
                    <p className="text-sm text-muted-foreground">{agendamento.paciente.cpf}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informações do Profissional */}
          {agendamento.profissional && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Informações do Profissional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Nome</p>
                    <p className="text-sm text-muted-foreground">{agendamento.profissional.nome}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">CRM</p>
                    <p className="text-sm text-muted-foreground">{agendamento.profissional.crm}</p>
                  </div>
                </div>

                {agendamento.profissional.especialidade && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Especialidade</p>
                      <p className="text-sm text-muted-foreground">{agendamento.profissional.especialidade.nome}</p>
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
                  {format(parseISO(agendamento.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="font-medium">Última atualização</p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(agendamento.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Calendar, User, Phone } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Agendamento, TipoAgendamento } from "@/types/api";

interface AgendamentoNotificationsProps {
  agendamentosProximos: Agendamento[];
  agendamentosAtrasados: Agendamento[];
  onConfirmar: (agendamento: Agendamento) => void;
  onCancelar: (agendamento: Agendamento) => void;
  onEnviarLembrete: (agendamento: Agendamento) => void;
}

export function AgendamentoNotifications({
  agendamentosProximos,
  agendamentosAtrasados,
  onConfirmar,
  onCancelar,
  onEnviarLembrete,
}: AgendamentoNotificationsProps) {
  const getTipoColor = (tipo: TipoAgendamento) => {
    switch (tipo) {
      case TipoAgendamento.CONSULTA:
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case TipoAgendamento.RETORNO:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case TipoAgendamento.EXAME:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const totalNotificacoes = agendamentosProximos.length + agendamentosAtrasados.length;

  if (totalNotificacoes === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-lg text-orange-800 dark:text-orange-200">
            Agendamentos que Precisam de Atenção
          </CardTitle>
          <Badge variant="outline" className="text-orange-600 border-orange-300">
            {totalNotificacoes}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Agendamentos Atrasados */}
        {agendamentosAtrasados.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-600" />
              <h4 className="font-medium text-red-800 dark:text-red-200">
                Atrasados ({agendamentosAtrasados.length})
              </h4>
            </div>
            {agendamentosAtrasados.map((agendamento) => (
              <div
                key={agendamento.id}
                className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-800 dark:text-red-200">
                      {agendamento.paciente?.nome}
                    </span>
                    <Badge className={getTipoColor(agendamento.tipo)}>
                      {agendamento.tipo}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-red-700 dark:text-red-300">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(parseISO(agendamento.data), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {agendamento.horaInicio}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {agendamento.paciente?.telefone}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEnviarLembrete(agendamento)}
                    className="text-red-600 border-red-300 hover:bg-red-100"
                  >
                    Lembrete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCancelar(agendamento)}
                    className="text-red-600 border-red-300 hover:bg-red-100"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Agendamentos Próximos */}
        {agendamentosProximos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <h4 className="font-medium text-orange-800 dark:text-orange-200">
                Próximos ({agendamentosProximos.length})
              </h4>
            </div>
            {agendamentosProximos.map((agendamento) => (
              <div
                key={agendamento.id}
                className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-800 dark:text-orange-200">
                      {agendamento.paciente?.nome}
                    </span>
                    <Badge className={getTipoColor(agendamento.tipo)}>
                      {agendamento.tipo}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-orange-700 dark:text-orange-300">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(parseISO(agendamento.data), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {agendamento.horaInicio}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {agendamento.paciente?.telefone}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onConfirmar(agendamento)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Confirmar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEnviarLembrete(agendamento)}
                    className="text-orange-600 border-orange-300 hover:bg-orange-100"
                  >
                    Lembrete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirmacoes } from "@/hooks/useConfirmacoes";
import { useWhatsAppMessages } from "@/hooks/useWhatsAppMessages";
import { AgendamentoNotifications } from "@/components/agendamento-notifications";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Send, 
  Search,
  RefreshCw,
  Bell,
  Loader2,
  MessageCircle,
  IdCard
} from "lucide-react";
import { format, parseISO, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Agendamento, StatusAgendamento, TipoAgendamento } from "@/types/api";

export function Confirmacoes() {
  const {
    agendamentos,
    agendamentosPendentes,
    agendamentosConfirmados,
    agendamentosCancelados,
    agendamentosProximos,
    agendamentosAtrasados,
    isLoading,
    error,
    confirmarAgendamento,
    cancelarAgendamento,
    enviarLembrete,
    isConfirming,
    isCanceling,
    isSendingReminder,
  } = useConfirmacoes();

  const { sendLembreteMessage, sendCancelamentoMessage, isLoading: isWhatsAppLoading } = useWhatsAppMessages();

  const [filteredAgendamentos, setFilteredAgendamentos] = useState<Agendamento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [tipoFilter, setTipoFilter] = useState<string>("TODOS");
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");
  const [useWhatsApp, setUseWhatsApp] = useState(true);

  useEffect(() => {
    if (agendamentos) {
      filterAgendamentos();
    }
  }, [searchTerm, statusFilter, tipoFilter, agendamentos]);

  const filterAgendamentos = () => {
    if (!agendamentos) return;

    let filtered = agendamentos;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (agendamento) =>
          agendamento.paciente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agendamento.profissional?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agendamento.paciente?.telefone.includes(searchTerm) ||
          agendamento.paciente?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== "TODOS") {
      filtered = filtered.filter((agendamento) => agendamento.status === statusFilter);
    }

    // Filtro por tipo
    if (tipoFilter !== "TODOS") {
      filtered = filtered.filter((agendamento) => agendamento.tipo === tipoFilter);
    }

    setFilteredAgendamentos(filtered);
  };

  const getStatusColor = (status: StatusAgendamento) => {
    switch (status) {
      case StatusAgendamento.CONFIRMADO:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case StatusAgendamento.AGENDADO:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case StatusAgendamento.CANCELADO:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case StatusAgendamento.REALIZADO:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

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

  const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  };

  const isAgendamentoProximo = (data: string) => {
    const hoje = new Date();
    const dataAgendamento = new Date(data);
    const diffTime = dataAgendamento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  const isAgendamentoAtrasado = (data: string) => {
    const hoje = new Date();
    const dataAgendamento = new Date(data);
    return isBefore(dataAgendamento, hoje);
  };

  const handleConfirmarAgendamento = async (agendamento: Agendamento) => {
    try {
      await confirmarAgendamento(agendamento.id);
      setIsConfirmDialogOpen(false);
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);
    }
  };

  const handleCancelarAgendamento = async (agendamento: Agendamento) => {
    try {
      await cancelarAgendamento(agendamento.id);
      
      // Enviar mensagem de cancelamento via WhatsApp se habilitado
      if (useWhatsApp && agendamento.paciente && agendamento.profissional) {
        await sendCancelamentoMessage({
          agendamentoId: agendamento.id,
          pacienteId: agendamento.pacienteId,
          profissionalId: agendamento.profissionalId,
          data: agendamento.data,
          horaInicio: agendamento.horaInicio,
          horaFim: agendamento.horaFim,
          tipo: agendamento.tipo,
          paciente: agendamento.paciente,
          profissional: agendamento.profissional
        });
      }
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
    }
  };

  const handleEnviarLembrete = async () => {
    if (!selectedAgendamento) return;

    try {
      if (useWhatsApp && selectedAgendamento.paciente && selectedAgendamento.profissional) {
        // Enviar via WhatsApp
        await sendLembreteMessage({
          agendamentoId: selectedAgendamento.id,
          pacienteId: selectedAgendamento.pacienteId,
          profissionalId: selectedAgendamento.profissionalId,
          data: selectedAgendamento.data,
          horaInicio: selectedAgendamento.horaInicio,
          horaFim: selectedAgendamento.horaFim,
          tipo: selectedAgendamento.tipo,
          paciente: selectedAgendamento.paciente,
          profissional: selectedAgendamento.profissional
        });
      } else {
        // Enviar via sistema interno (fallback)
        await enviarLembrete({
          agendamentoId: selectedAgendamento.id,
          mensagem: reminderMessage
        });
      }

      setReminderMessage("");
      setIsReminderDialogOpen(false);
    } catch (error) {
      console.error("Erro ao enviar lembrete:", error);
    }
  };

  const handleEnviarLembreteFromNotification = async (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento);
    setReminderMessage(`Olá ${agendamento.paciente?.nome}, lembramos que você tem uma consulta agendada para ${format(parseISO(agendamento.data), "dd/MM/yyyy", { locale: ptBR })} às ${agendamento.horaInicio}. Por favor, confirme sua presença.`);
    setIsReminderDialogOpen(true);
  };

  // Filtrar agendamentos para as abas
  const agendamentosPendentesFiltrados = filteredAgendamentos.filter(
    (ag) => ag.status === StatusAgendamento.AGENDADO
  );

  const agendamentosConfirmadosFiltrados = filteredAgendamentos.filter(
    (ag) => ag.status === StatusAgendamento.CONFIRMADO
  );

  const agendamentosCanceladosFiltrados = filteredAgendamentos.filter(
    (ag) => ag.status === StatusAgendamento.CANCELADO
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div>
            <Skeleton className="w-48 h-6 mb-2" />
            <Skeleton className="w-64 h-4" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-4 h-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-12 h-8 mb-2" />
                <Skeleton className="w-32 h-3" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="w-24 h-6" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-full h-10" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-700 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Erro ao carregar confirmações</h1>
            <p className="text-sm text-muted-foreground">
              Não foi possível carregar os dados dos agendamentos
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Erro ao carregar dados
            </p>
            <p className="text-sm text-muted-foreground">
              Verifique sua conexão e tente novamente
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-700 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Confirmações de Agendamentos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as confirmações e lembretes dos agendamentos
          </p>
        </div>
      </div>

      {/* Notificações de Agendamentos que Precisam de Atenção */}
      <AgendamentoNotifications
        agendamentosProximos={agendamentosProximos}
        agendamentosAtrasados={agendamentosAtrasados}
        onConfirmar={handleConfirmarAgendamento}
        onCancelar={handleCancelarAgendamento}
        onEnviarLembrete={handleEnviarLembreteFromNotification}
      />

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {agendamentosPendentes.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {agendamentosConfirmados.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Consultas confirmadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {agendamentosProximos.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Próximos 2 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {agendamentosCancelados.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Consultas canceladas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome, telefone ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos os status</SelectItem>
                  <SelectItem value={StatusAgendamento.AGENDADO}>Agendado</SelectItem>
                  <SelectItem value={StatusAgendamento.CONFIRMADO}>Confirmado</SelectItem>
                  <SelectItem value={StatusAgendamento.CANCELADO}>Cancelado</SelectItem>
                  <SelectItem value={StatusAgendamento.REALIZADO}>Realizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos os tipos</SelectItem>
                  <SelectItem value={TipoAgendamento.CONSULTA}>Consulta</SelectItem>
                  <SelectItem value={TipoAgendamento.RETORNO}>Retorno</SelectItem>
                  <SelectItem value={TipoAgendamento.EXAME}>Exame</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Comunicação</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useWhatsApp"
                  checked={useWhatsApp}
                  onChange={(e) => setUseWhatsApp(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="useWhatsApp" className="text-sm">
                  Usar WhatsApp
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("TODOS");
                  setTipoFilter("TODOS");
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agendamentos */}
      <Tabs defaultValue="pendentes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pendentes">
            Pendentes ({agendamentosPendentesFiltrados.length})
          </TabsTrigger>
          <TabsTrigger value="confirmados">
            Confirmados ({agendamentosConfirmadosFiltrados.length})
          </TabsTrigger>
          <TabsTrigger value="cancelados">
            Cancelados ({agendamentosCanceladosFiltrados.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes" className="space-y-4">
          {agendamentosPendentesFiltrados.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Nenhum agendamento pendente
                </p>
                <p className="text-sm text-muted-foreground">
                  Todos os agendamentos foram confirmados!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {agendamentosPendentesFiltrados.map((agendamento) => (
                <Card key={agendamento.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {agendamento.paciente?.nome}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {calcularIdade(agendamento.paciente?.dataNascimento || "")} anos • {agendamento.paciente?.convenioNome}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(parseISO(agendamento.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {agendamento.horaInicio} - {agendamento.horaFim}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{agendamento.profissional?.nome}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={getTipoColor(agendamento.tipo)}>
                            {agendamento.tipo}
                          </Badge>
                          {isAgendamentoProximo(agendamento.data) && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              Próximo
                            </Badge>
                          )}
                          {isAgendamentoAtrasado(agendamento.data) && (
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              Atrasado
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {agendamento.paciente?.telefone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {agendamento.paciente?.email}
                          </div>
                        </div>

                        {agendamento.observacoes && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Observações:</strong> {agendamento.observacoes}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setSelectedAgendamento(agendamento)}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={isConfirming}
                            >
                              {isConfirming ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Confirmar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirmar Agendamento</DialogTitle>
                              <DialogDescription>
                                Tem certeza que deseja confirmar a consulta de{" "}
                                <strong>{selectedAgendamento?.paciente?.nome}</strong>?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsConfirmDialogOpen(false)}
                                disabled={isConfirming}
                              >
                                Cancelar
                              </Button>
                              <Button
                                onClick={() => selectedAgendamento && handleConfirmarAgendamento(selectedAgendamento)}
                                className="bg-green-600 hover:bg-green-700"
                                disabled={isConfirming}
                              >
                                {isConfirming ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                Confirmar Consulta
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAgendamento(agendamento)}
                              disabled={isSendingReminder}
                            >
                              {isSendingReminder ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Bell className="h-4 w-4 mr-2" />
                              )}
                              Lembrete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Enviar Lembrete</DialogTitle>
                              <DialogDescription>
                                {useWhatsApp ? (
                                  <>
                                    Envie um lembrete via WhatsApp para {selectedAgendamento?.paciente?.nome} sobre a consulta.
                                    <br />
                                    <span className="text-sm text-muted-foreground">
                                      O lembrete incluirá um link de confirmação personalizado.
                                    </span>
                                  </>
                                ) : (
                                  `Envie um lembrete para ${selectedAgendamento?.paciente?.nome} sobre a consulta.`
                                )}
                              </DialogDescription>
                            </DialogHeader>
                            {!useWhatsApp && (
                              <div className="space-y-4">
                                <Textarea
                                  placeholder="Digite sua mensagem de lembrete..."
                                  value={reminderMessage}
                                  onChange={(e) => setReminderMessage(e.target.value)}
                                  rows={4}
                                  disabled={isSendingReminder}
                                />
                              </div>
                            )}
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsReminderDialogOpen(false)}
                                disabled={isSendingReminder || isWhatsAppLoading}
                              >
                                Cancelar
                              </Button>
                              <Button
                                onClick={handleEnviarLembrete}
                                disabled={(!useWhatsApp && !reminderMessage.trim()) || isSendingReminder || isWhatsAppLoading}
                              >
                                {isSendingReminder || isWhatsAppLoading ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4 mr-2" />
                                )}
                                {useWhatsApp ? 'Enviar via WhatsApp' : 'Enviar Lembrete'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelarAgendamento(agendamento)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          disabled={isCanceling}
                        >
                          {isCanceling ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                          )}
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmados" className="space-y-4">
          {agendamentosConfirmadosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-blue-500 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Nenhum agendamento confirmado
                </p>
                <p className="text-sm text-muted-foreground">
                  Confirme os agendamentos pendentes para vê-los aqui.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {agendamentosConfirmadosFiltrados.map((agendamento) => (
                <Card key={agendamento.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-green-100 rounded-full">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {agendamento.paciente?.nome}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {calcularIdade(agendamento.paciente?.dataNascimento || "")} anos • {agendamento.paciente?.convenioNome}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(parseISO(agendamento.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {agendamento.horaInicio} - {agendamento.horaFim}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{agendamento.profissional?.nome}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={getTipoColor(agendamento.tipo)}>
                            {agendamento.tipo}
                          </Badge>
                          <Badge className={getStatusColor(agendamento.status)}>
                            {agendamento.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelados" className="space-y-4">
          {agendamentosCanceladosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Nenhum agendamento cancelado
                </p>
                <p className="text-sm text-muted-foreground">
                  Ótimo! Não há cancelamentos registrados.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {agendamentosCanceladosFiltrados.map((agendamento) => (
                <Card key={agendamento.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-red-100 rounded-full">
                            <XCircle className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {agendamento.paciente?.nome}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {calcularIdade(agendamento.paciente?.dataNascimento || "")} anos • {agendamento.paciente?.convenioNome}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(parseISO(agendamento.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {agendamento.horaInicio} - {agendamento.horaFim}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{agendamento.profissional?.nome}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={getTipoColor(agendamento.tipo)}>
                            {agendamento.tipo}
                          </Badge>
                          <Badge className={getStatusColor(agendamento.status)}>
                            {agendamento.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Agendamento, StatusAgendamento } from "@/types/api";
import { 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  AlertCircle,
  Loader2,
  Check,
  X
} from "lucide-react";

export function ConfirmarAgendamento() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [action, setAction] = useState<'confirm' | 'cancel' | null>(null);

  const agendamentoId = searchParams.get('id');
  const token = searchParams.get('token');

  useEffect(() => {
    if (agendamentoId && token) {
      loadAgendamento();
    } else {
      setIsLoading(false);
    }
  }, [agendamentoId, token]);

  const loadAgendamento = async () => {
    try {
      // Em produção, isso seria uma chamada para a API
      // Por enquanto, vamos simular um agendamento
      const mockAgendamento: Agendamento = {
        id: agendamentoId || '1',
        pacienteId: '1',
        profissionalId: '1',
        data: '2024-06-26T00:00:00',
        horaInicio: '15:00',
        horaFim: '16:00',
        tipo: 'CONSULTA',
        status: StatusAgendamento.AGENDADO,
        observacoes: 'Consulta de rotina',
        createdAt: '2024-06-20T10:00:00',
        updatedAt: '2024-06-20T10:00:00',
        paciente: {
          id: '1',
          nome: 'João Silva',
          dataNascimento: '1990-05-15',
          cpf: '123.456.789-00',
          telefone: '(11) 97777-7777',
          email: 'joao.silva@exemplo.com',
          createdAt: '2024-06-20T10:00:00',
          updatedAt: '2024-06-20T10:00:00',
          endereco: 'Rua das Flores',
          numero: '123',
          complemento: 'Apto 45',
          bairro: 'Centro',
          cep: '01234-567',
          cidade: 'São Paulo',
          estado: 'SP',
          pais: 'Brasil',
          convenioNome: 'Unimed',
          convenioNumero: '123456',
          convenioPlano: 'Premium',
          convenioValidade: '2024-12-31',
          profissionalId: '1'
        },
        profissional: {
          id: '1',
          nome: 'Dra. Ana Silva',
          especialidadeId: '1',
          registro: '12345',
          crm: 'CRM-12345',
          email: 'ana.silva@exemplo.com',
          telefone: '(11) 98888-8888',
          sexo: 'F',
          dataNascimento: '1980-01-01',
          dataContratacao: '2020-01-01',
          status: 'ATIVO',
          createdAt: '2024-06-20T10:00:00',
          updatedAt: '2024-06-20T10:00:00',
          rua: 'Rua dos Médicos',
          numero: '456',
          complemento: 'Sala 10',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567',
          horarioInicio: '08:00',
          horarioFim: '18:00',
          intervalo: '12:00-13:00',
          diasTrabalho: ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'],
          especialidade: {
            id: '1',
            nome: 'Nutricionista',
            descricao: 'Especialidade em nutrição clínica',
            createdAt: '2024-06-20T10:00:00',
            updatedAt: '2024-06-20T10:00:00'
          }
        }
      };

      setAgendamento(mockAgendamento);
    } catch (error) {
      console.error('Erro ao carregar agendamento:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar os dados do agendamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmar = async () => {
    if (!agendamento) return;

    setIsConfirming(true);
    try {
      // Em produção, isso seria uma chamada para a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAgendamento({
        ...agendamento,
        status: StatusAgendamento.CONFIRMADO
      });

      toast({
        title: "✅ Consulta confirmada!",
        description: "Sua presença foi confirmada com sucesso.",
      });

      setShowConfirmDialog(false);
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível confirmar a consulta.",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancelar = async () => {
    if (!agendamento) return;

    setIsCanceling(true);
    try {
      // Em produção, isso seria uma chamada para a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAgendamento({
        ...agendamento,
        status: StatusAgendamento.CANCELADO
      });

      toast({
        title: "❌ Consulta cancelada",
        description: "Sua consulta foi cancelada com sucesso.",
      });

      setShowCancelDialog(false);
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível cancelar a consulta.",
        variant: "destructive",
      });
    } finally {
      setIsCanceling(false);
    }
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

  const getStatusIcon = (status: StatusAgendamento) => {
    switch (status) {
      case StatusAgendamento.CONFIRMADO:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case StatusAgendamento.AGENDADO:
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case StatusAgendamento.CANCELADO:
        return <XCircle className="h-5 w-5 text-red-600" />;
      case StatusAgendamento.REALIZADO:
        return <CheckCircle className="h-5 w-5 text-purple-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando agendamento...</p>
        </div>
      </div>
    );
  }

  if (!agendamento) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-lg font-medium text-muted-foreground mb-2">
              Agendamento não encontrado
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              O link de confirmação é inválido ou expirou.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = agendamento.status === StatusAgendamento.CANCELADO || 
                   agendamento.status === StatusAgendamento.REALIZADO;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              {getStatusIcon(agendamento.status)}
              <h1 className="text-2xl font-bold">Confirmação de Consulta</h1>
            </div>
            <p className="text-muted-foreground">
              Confirme ou cancele sua consulta agendada
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-center">
              <Badge className={`${getStatusColor(agendamento.status)} text-sm font-medium px-4 py-2`}>
                {agendamento.status}
              </Badge>
            </div>

            {/* Informações do Paciente */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">{agendamento.paciente?.nome}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {agendamento.paciente?.telefone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {agendamento.paciente?.email}
                </div>
              </div>
            </div>

            <Separator />

            {/* Detalhes da Consulta */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Detalhes da Consulta</h3>
              
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
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Profissional</p>
                    <p className="text-sm text-muted-foreground">
                      {agendamento.profissional?.nome}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Especialidade</p>
                    <p className="text-sm text-muted-foreground">
                      {agendamento.profissional?.especialidade?.nome}
                    </p>
                  </div>
                </div>
              </div>

              {agendamento.observacoes && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="font-medium text-sm mb-1">Observações</p>
                  <p className="text-sm text-muted-foreground">{agendamento.observacoes}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Ações */}
            {!isExpired && agendamento.status === StatusAgendamento.AGENDADO && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => {
                    setAction('confirm');
                    setShowConfirmDialog(true);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Confirmar Presença
                </Button>
                <Button
                  onClick={() => {
                    setAction('cancel');
                    setShowCancelDialog(true);
                  }}
                  variant="destructive"
                  className="flex-1"
                  size="lg"
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancelar Consulta
                </Button>
              </div>
            )}

            {agendamento.status === StatusAgendamento.CONFIRMADO && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="font-medium text-green-600">Consulta Confirmada</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sua presença foi confirmada. Aguardamos você na data e horário agendados.
                </p>
              </div>
            )}

            {agendamento.status === StatusAgendamento.CANCELADO && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <span className="font-medium text-red-600">Consulta Cancelada</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Esta consulta foi cancelada. Entre em contato conosco para reagendar.
                </p>
              </div>
            )}

            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">
                Em caso de dúvidas, entre em contato conosco pelo telefone ou WhatsApp.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Confirmação */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Presença</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja confirmar sua presença na consulta do dia{" "}
              {agendamento && format(parseISO(agendamento.data), "dd/MM/yyyy", { locale: ptBR })} às{" "}
              {agendamento?.horaInicio}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmar}
              disabled={isConfirming}
              className="bg-green-600 hover:bg-green-700"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Confirmando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirmar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Cancelamento */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Consulta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar a consulta do dia{" "}
              {agendamento && format(parseISO(agendamento.data), "dd/MM/yyyy", { locale: ptBR })} às{" "}
              {agendamento?.horaInicio}?
              <br />
              <span className="text-sm text-muted-foreground">
                Entre em contato conosco para reagendar.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Voltar
            </Button>
            <Button
              onClick={handleCancelar}
              disabled={isCanceling}
              variant="destructive"
            >
              {isCanceling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelando...
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar Consulta
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
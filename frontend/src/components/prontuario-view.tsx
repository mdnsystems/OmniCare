import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  FileText, 
  User, 
  Calendar, 
  Stethoscope, 
  Heart, 
  Activity, 
  UserCheck, 
  FileEdit,
  MapPin,
  Phone,
  Mail,
  CreditCard
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Prontuario } from "@/types/api";

interface ProntuarioViewProps {
  prontuario: Prontuario | null;
  isOpen: boolean;
  onClose: () => void;
}

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "CONSULTA":
      return <Stethoscope className="h-5 w-5" />;
    case "RETORNO":
      return <Heart className="h-5 w-5" />;
    case "EXAME":
      return <Activity className="h-5 w-5" />;
    case "PROCEDIMENTO":
      return <UserCheck className="h-5 w-5" />;
    case "DOCUMENTO":
      return <FileEdit className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case "CONSULTA":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "RETORNO":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "EXAME":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "PROCEDIMENTO":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "DOCUMENTO":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

// Função para formatar data com validação
const formatarData = (dataString: string) => {
  try {
    const data = new Date(dataString);
    if (isNaN(data.getTime())) {
      return "Data inválida";
    }
    return format(data, "dd/MM/yyyy", { locale: ptBR });
  } catch (error) {
    return "Data inválida";
  }
};

// Função para formatar data e hora com validação
const formatarDataHora = (dataString: string) => {
  try {
    const data = new Date(dataString);
    if (isNaN(data.getTime())) {
      return "Data inválida";
    }
    return format(data, "dd/MM/yyyy HH:mm", { locale: ptBR });
  } catch (error) {
    return "Data inválida";
  }
};

export function ProntuarioView({ prontuario, isOpen, onClose }: ProntuarioViewProps) {
  // Validação de segurança
  if (!prontuario) {
    return null;
  }

  // Verificação adicional de segurança para campos críticos
  const paciente = prontuario.paciente;
  const profissional = prontuario.profissional;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] min-w-[60%] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Prontuário - {paciente?.nome || 'Paciente não informado'}
            <Badge className={getTipoColor(prontuario.tipo)}>
              <div className="flex items-center gap-1">
                {getTipoIcon(prontuario.tipo)}
                {prontuario.tipo}
              </div>
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Visualização detalhada do prontuário médico com informações do paciente, atendimento e dados clínicos.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex flex-col gap-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Informações Básicas */}
            <div className="bg-muted rounded-md p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Básicas
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID do Prontuário</p>
                  <p className="text-sm">{prontuario.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                  <p className="text-sm">{prontuario.tipo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data</p>
                  <p className="text-sm">
                    {prontuario.data ? formatarData(prontuario.data) : 'Não informado'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paciente</p>
                  <p className="text-sm">{paciente?.nome || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profissional</p>
                  <p className="text-sm">{profissional?.nome || 'Não informado'}</p>
                </div>
              </div>
            </div>

            {/* Informações do Paciente */}
            {paciente && (
              <div className="bg-muted rounded-md p-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações do Paciente
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="text-sm">{paciente.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CPF</p>
                    <p className="text-sm">{paciente.cpf}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                    <p className="text-sm">{formatarData(paciente.dataNascimento)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p className="text-sm">{paciente.telefone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-sm">{paciente.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                    <p className="text-sm">
                      {paciente.endereco}, {paciente.numero}
                      {paciente.complemento && ` - ${paciente.complemento}`}
                      <br />
                      {paciente.bairro}, {paciente.cidade} - {paciente.estado}
                      <br />
                      CEP: {paciente.cep}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Informações do Profissional */}
            {profissional && (
              <div className="bg-muted rounded-md p-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Informações do Profissional
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="text-sm">{profissional.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CRM</p>
                    <p className="text-sm">{profissional.crm}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Registro</p>
                    <p className="text-sm">{profissional.registro}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Especialidade</p>
                    <p className="text-sm">{profissional.especialidade?.nome || 'Não informado'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Descrição */}
            {prontuario.descricao && (
              <div className="bg-muted rounded-md p-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Descrição do Atendimento
                </h3>
                <div className="mt-2">
                  <p className="text-sm whitespace-pre-wrap">{prontuario.descricao}</p>
                </div>
              </div>
            )}

            {/* Diagnóstico */}
            {prontuario.diagnostico && (
              <div className="bg-muted rounded-md p-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Diagnóstico
                </h3>
                <div className="mt-2">
                  <p className="text-sm whitespace-pre-wrap">{prontuario.diagnostico}</p>
                </div>
              </div>
            )}

            {/* Prescrição */}
            {prontuario.prescricao && (
              <div className="bg-muted rounded-md p-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileEdit className="h-5 w-5" />
                  Prescrição
                </h3>
                <div className="mt-2">
                  <p className="text-sm whitespace-pre-wrap">{prontuario.prescricao}</p>
                </div>
              </div>
            )}

            {/* Observações */}
            {prontuario.observacoes && (
              <div className="bg-muted rounded-md p-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Observações Adicionais
                </h3>
                <div className="mt-2">
                  <p className="text-sm whitespace-pre-wrap">{prontuario.observacoes}</p>
                </div>
              </div>
            )}

            {/* Informações de Cadastro */}
            <div className="bg-muted rounded-md p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações de Cadastro
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                  <p className="text-sm">{formatarDataHora(prontuario.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Última Atualização</p>
                  <p className="text-sm">{formatarDataHora(prontuario.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
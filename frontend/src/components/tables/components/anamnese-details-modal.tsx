import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar, User, Phone, Mail, FileText, Clock, MapPin, Stethoscope } from "lucide-react";
import { Anamnese } from "@/types/api";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AnamneseDetailsModalProps {
  anamnese: Anamnese | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AnamneseDetailsModal({ anamnese, isOpen, onClose }: AnamneseDetailsModalProps) {
  if (!anamnese) return null;

  // Função para formatar data com validação
  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) {
        return "Data inválida";
      }
      return format(data, "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "Data inválida";
    }
  };

  // Função para renderizar campos dinâmicos
  const renderCampo = (label: string, value: any) => {
    if (!value || value === '') return null;
    
    return (
      <div className="bg-muted rounded-md p-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <FileText className="h-5 w-5" />
          {label}
        </h3>
        <p className="text-sm text-muted-foreground bg-background p-3 rounded-md border whitespace-pre-wrap">
          {value}
        </p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80%] min-w-[40%] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Anamnese - {anamnese.paciente?.nome || "Paciente"}
          </DialogTitle>
          <DialogDescription>
            Visualização detalhada da anamnese médica incluindo queixa principal, história clínica e informações do paciente.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex flex-col gap-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Informações da Consulta */}
            <div className="bg-muted rounded-md p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações da Consulta
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data</p>
                  <p className="text-sm">{formatarData(anamnese.data)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Horário</p>
                  <p className="text-sm">{format(parseISO(anamnese.createdAt), "HH:mm", { locale: ptBR })}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Template</p>
                  <p className="text-sm">{anamnese.templateId || "Padrão"}</p>
                </div>
              </div>
            </div>

            {/* Campos Dinâmicos */}
            {anamnese.campos && Object.entries(anamnese.campos).map(([key, value]) => {
              if (!value || value === '') return null;
              
              const label = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .replace(/([A-Z])/g, (match, p1) => {
                  const commonWords = ['De', 'Da', 'Do', 'Em', 'Com', 'Para', 'Por', 'Sem', 'Sob', 'Sobre'];
                  return commonWords.includes(p1) ? ` ${p1.toLowerCase()}` : ` ${p1}`;
                });

              return renderCampo(label, value);
            })}

            {/* Informações do Paciente */}
            {anamnese.paciente && (
              <div className="bg-muted rounded-md p-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações do Paciente
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="text-sm">{anamnese.paciente.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p className="text-sm">{anamnese.paciente.telefone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-sm">{anamnese.paciente.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CPF</p>
                    <p className="text-sm">{anamnese.paciente.cpf}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Informações do Profissional */}
            {anamnese.profissional && (
              <div className="bg-muted rounded-md p-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Informações do Profissional
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="text-sm">{anamnese.profissional.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CRM</p>
                    <p className="text-sm">{anamnese.profissional.crm}</p>
                  </div>
                  {anamnese.profissional.especialidade && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Especialidade</p>
                      <p className="text-sm">{anamnese.profissional.especialidade.nome}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Informações do Sistema */}
            <div className="bg-muted rounded-md p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Informações do Sistema
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Criado em</p>
                  <p className="text-sm">{formatarData(anamnese.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Última atualização</p>
                  <p className="text-sm">{formatarData(anamnese.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
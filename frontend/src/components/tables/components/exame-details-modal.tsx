import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Phone, Mail, FileText, Clock, MapPin, Download, File } from "lucide-react";
import { Exame } from "../types/exame";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ExameDetailsModalProps {
  exame: Exame | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExameDetailsModal({ exame, isOpen, onClose }: ExameDetailsModalProps) {
  if (!exame) return null;

  const handleDownload = (arquivo: any) => {
    if (arquivo?.url) {
      window.open(arquivo.url, '_blank');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhes do Exame
          </DialogTitle>
          <DialogDescription>
            Visualização detalhada do exame, incluindo arquivos anexados, resultado, paciente e profissional responsável.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Exame */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-3">Informações do Exame</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Data</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(exame.data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Tipo</p>
                  <p className="text-sm text-muted-foreground">{exame.tipo}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Horário</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(exame.createdAt), "HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Arquivos</p>
                  <p className="text-sm text-muted-foreground">{exame.arquivos?.length || 0} arquivo(s)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resultado */}
          {exame.resultado && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Resultado</h3>
              <p className="text-sm text-muted-foreground bg-white dark:bg-gray-900 p-3 rounded-md border whitespace-pre-wrap">
                {exame.resultado}
              </p>
            </div>
          )}

          {/* Observações */}
          {exame.observacoes && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Observações</h3>
              <p className="text-sm text-muted-foreground bg-white dark:bg-gray-900 p-3 rounded-md border whitespace-pre-wrap">
                {exame.observacoes}
              </p>
            </div>
          )}

          {/* Arquivos */}
          {exame.arquivos && exame.arquivos.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Arquivos Anexados</h3>
              <div className="space-y-3">
                {exame.arquivos.map((arquivo, index) => (
                  <div key={arquivo.id || index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-md border">
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{arquivo.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(arquivo.tamanho)} • {arquivo.tipo}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(arquivo)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informações do Paciente */}
          {exame.prontuario?.paciente && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Informações do Paciente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Nome</p>
                    <p className="text-sm text-muted-foreground">{exame.prontuario.paciente.nome}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{exame.prontuario.paciente.telefone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{exame.prontuario.paciente.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">CPF</p>
                    <p className="text-sm text-muted-foreground">{exame.prontuario.paciente.cpf}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informações do Profissional */}
          {exame.prontuario?.profissional && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Informações do Profissional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Nome</p>
                    <p className="text-sm text-muted-foreground">{exame.prontuario.profissional.nome}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">CRM</p>
                    <p className="text-sm text-muted-foreground">{exame.prontuario.profissional.crm}</p>
                  </div>
                </div>

                {exame.prontuario.profissional.especialidade && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Especialidade</p>
                      <p className="text-sm text-muted-foreground">{exame.prontuario.profissional.especialidade.nome}</p>
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
                  {format(parseISO(exame.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="font-medium">Última atualização</p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(exame.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Clock, 
  DollarSign, 
  Calendar,
  Send,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { FaturaClinica, TipoLembrete } from '@/types/api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLembretesPersonalizados } from '@/hooks/useLembretesPersonalizados';

interface LembretePersonalizadoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fatura?: FaturaClinica | null;
}

export function LembretePersonalizadoDialog({ 
  open, 
  onOpenChange, 
  fatura 
}: LembretePersonalizadoDialogProps) {
  const {
    templatesLembretes,
    enviarLembrete,
    calcularDiasAtraso,
    processarTemplate,
    selecionarTemplateAutomatico
  } = useLembretesPersonalizados();

  const [templateSelecionado, setTemplateSelecionado] = useState<string>('');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [destinatario, setDestinatario] = useState('');

  // Formatar valor monetário
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Atualizar dados quando a fatura mudar
  useEffect(() => {
    if (fatura) {
      const diasAtraso = calcularDiasAtraso(fatura.dataVencimento);
      const template = selecionarTemplateAutomatico(diasAtraso);
      
      setTemplateSelecionado(template.id);
      setAssunto(template.assunto);
      setMensagem(processarTemplate(template, fatura));
      setDestinatario(fatura.clinica?.nome || 'Administrador da Clínica');
    }
  }, [fatura, calcularDiasAtraso, selecionarTemplateAutomatico, processarTemplate]);

  // Atualizar mensagem quando o template mudar
  useEffect(() => {
    if (fatura && templateSelecionado) {
      const template = templatesLembretes.find(t => t.id === templateSelecionado);
      if (template) {
        setAssunto(template.assunto);
        setMensagem(processarTemplate(template, fatura));
      }
    }
  }, [templateSelecionado, fatura, templatesLembretes, processarTemplate]);

  const handleEnviar = async () => {
    if (!fatura) return;

    const template = templatesLembretes.find(t => t.id === templateSelecionado);
    if (!template) return;

    await enviarLembrete.mutateAsync({
      faturaId: fatura.id,
      tipo: template.tipo,
      mensagem,
      destinatario,
      assunto
    });

    onOpenChange(false);
  };

  const handleCancelar = () => {
    onOpenChange(false);
  };

  if (!fatura) {
    return null;
  }

  const diasAtraso = calcularDiasAtraso(fatura.dataVencimento);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Enviar Lembrete Personalizado
          </DialogTitle>
          <DialogDescription>
            Envie um lembrete personalizado para a clínica sobre a fatura em atraso
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detalhes da Fatura */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalhes da Fatura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Número da Fatura:</span>
                <span className="font-mono text-sm">{fatura.numeroFatura}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Clínica:</span>
                <span className="text-sm">{fatura.clinica?.nome || 'Clínica não encontrada'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Valor:</span>
                <span className="font-bold">{formatarValor(fatura.valor)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Vencimento:</span>
                <span className="text-sm">
                  {format(parseISO(fatura.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dias em Atraso:</span>
                <Badge variant="destructive" className="text-xs">
                  {diasAtraso} dia{diasAtraso !== 1 ? 's' : ''}
                </Badge>
              </div>

              {fatura.observacoes && (
                <div>
                  <span className="text-sm font-medium">Observações:</span>
                  <p className="text-sm text-muted-foreground mt-1">{fatura.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuração do Lembrete */}
          <div className="space-y-6">
            {/* Seleção de Template */}
            <div className="space-y-2">
              <Label htmlFor="template">Template do Lembrete</Label>
              <Select value={templateSelecionado} onValueChange={setTemplateSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  {templatesLembretes.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{template.nome}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destinatário */}
            <div className="space-y-2">
              <Label htmlFor="destinatario">Destinatário</Label>
              <Input
                id="destinatario"
                value={destinatario}
                onChange={(e) => setDestinatario(e.target.value)}
                placeholder="Nome do destinatário"
              />
            </div>

            {/* Assunto */}
            <div className="space-y-2">
              <Label htmlFor="assunto">Assunto</Label>
              <Input
                id="assunto"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                placeholder="Assunto do email"
              />
            </div>

            {/* Mensagem */}
            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea
                id="mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Mensagem do lembrete"
                rows={12}
                className="resize-none"
              />
            </div>

            {/* Variáveis disponíveis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Variáveis Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="font-mono bg-muted px-1 rounded">{'{nome_clinica}'}</span>
                    <span>Nome da clínica</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono bg-muted px-1 rounded">{'{numero_fatura}'}</span>
                    <span>Número da fatura</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono bg-muted px-1 rounded">{'{dias_atraso}'}</span>
                    <span>Dias em atraso</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono bg-muted px-1 rounded">{'{valor_fatura}'}</span>
                    <span>Valor da fatura</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono bg-muted px-1 rounded">{'{data_vencimento}'}</span>
                    <span>Data de vencimento</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono bg-muted px-1 rounded">{'{mensagem_personalizada}'}</span>
                    <span>Mensagem personalizada</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <DialogFooter>
          <Button variant="outline" onClick={handleCancelar}>
            Cancelar
          </Button>
          <Button 
            onClick={handleEnviar} 
            disabled={enviarLembrete.isPending || !templateSelecionado || !mensagem.trim()}
          >
            {enviarLembrete.isPending ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Lembrete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
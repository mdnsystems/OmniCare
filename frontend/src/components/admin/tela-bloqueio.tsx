import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Lock, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  QrCode, 
  FileText,
  MessageSquare,
  Phone,
  ExternalLink,
  Download,
  Copy
} from 'lucide-react';
import { FaturaClinica, NivelBloqueio } from '@/types/api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';

interface TelaBloqueioProps {
  fatura: FaturaClinica;
  onGerarBoleto?: () => void;
  onPagarPix?: () => void;
  onFalarSuporte?: () => void;
}

export function TelaBloqueio({ 
  fatura, 
  onGerarBoleto, 
  onPagarPix, 
  onFalarSuporte 
}: TelaBloqueioProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const calcularDiasAtraso = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = hoje.getTime() - vencimento.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const diasAtraso = calcularDiasAtraso(fatura.dataVencimento);

  const handleGerarBoleto = async () => {
    setIsLoading(true);
    try {
      // TODO: Implementar geração de boleto
      await new Promise(resolve => setTimeout(resolve, 1000));
      onGerarBoleto?.();
      toast({
        title: "📄 Boleto gerado",
        description: "Boleto foi gerado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao gerar boleto",
        description: "Tente novamente ou entre em contato com o suporte.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePagarPix = async () => {
    setIsLoading(true);
    try {
      // TODO: Implementar geração de PIX
      await new Promise(resolve => setTimeout(resolve, 1000));
      onPagarPix?.();
      toast({
        title: "📱 PIX gerado",
        description: "QR Code do PIX foi gerado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao gerar PIX",
        description: "Tente novamente ou entre em contato com o suporte.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFalarSuporte = () => {
    onFalarSuporte?.();
  };

  const handleCopiarNumeroFatura = () => {
    navigator.clipboard.writeText(fatura.numeroFatura);
    toast({
      title: "📋 Número copiado",
      description: "Número da fatura copiado para a área de transferência!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950/20 dark:via-background dark:to-red-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-red-800 dark:text-red-200 mb-2">
            Acesso Temporariamente Bloqueado
          </h1>
          <p className="text-red-600 dark:text-red-300">
            Sua conta possui uma fatura em atraso que precisa ser regularizada
          </p>
        </div>

        {/* Card Principal */}
        <Card className="border-red-200 bg-white dark:border-red-800 dark:bg-card shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-red-800 dark:text-red-200">
              Detalhes da Cobrança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informações da Fatura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Número da Fatura</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {fatura.numeroFatura}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopiarNumeroFatura}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Valor em Atraso</span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {formatarValor(fatura.valor)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Data de Vencimento</span>
                </div>
                <div className="text-sm">
                  {format(parseISO(fatura.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Dias em Atraso</span>
                </div>
                <Badge variant="destructive" className="text-sm">
                  {diasAtraso} dia{diasAtraso !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Opções de Pagamento */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">
                Escolha uma forma de pagamento
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PIX */}
                <Button
                  variant="outline"
                  size="lg"
                  className="h-auto p-4 flex flex-col items-center gap-2 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950/20"
                  onClick={handlePagarPix}
                  disabled={isLoading}
                >
                  <QrCode className="h-6 w-6 text-green-600" />
                  <div className="text-center">
                    <div className="font-medium">Pagar com PIX</div>
                    <div className="text-xs text-muted-foreground">
                      Pagamento instantâneo
                    </div>
                  </div>
                </Button>

                {/* Boleto */}
                <Button
                  variant="outline"
                  size="lg"
                  className="h-auto p-4 flex flex-col items-center gap-2 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/20"
                  onClick={handleGerarBoleto}
                  disabled={isLoading}
                >
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div className="text-center">
                    <div className="font-medium">Gerar Boleto</div>
                    <div className="text-xs text-muted-foreground">
                      Vencimento em 3 dias úteis
                    </div>
                  </div>
                </Button>
              </div>

              {/* Cartão de Crédito */}
              <Button
                variant="outline"
                size="lg"
                className="w-full h-auto p-4 flex items-center justify-center gap-2 border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950/20"
                disabled={isLoading}
              >
                <CreditCard className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Pagar com Cartão de Crédito</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <Separator />

            {/* Suporte */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">Precisa de ajuda?</span>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFalarSuporte}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Falar com Suporte
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Baixar Comprovante
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            Após o pagamento, o acesso será liberado automaticamente em até 30 minutos.
          </p>
          <p className="mt-1">
            Em caso de dúvidas, entre em contato conosco através do WhatsApp ou telefone.
          </p>
        </div>
      </div>
    </div>
  );
} 
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Lock, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  CreditCard, 
  QrCode, 
  FileText, 
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';
import { FaturaClinica, FormaPagamentoClinica } from '@/types/api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';

interface TelaBloqueioTotalProps {
  fatura: FaturaClinica;
  onPagar?: (formaPagamento: FormaPagamentoClinica) => void;
  onFalarSuporte?: () => void;
}

export function TelaBloqueioTotal({ fatura, onPagar, onFalarSuporte }: TelaBloqueioTotalProps) {
  const [formaPagamentoSelecionada, setFormaPagamentoSelecionada] = useState<FormaPagamentoClinica | null>(null);
  const [copiado, setCopiado] = useState(false);

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

  const formasPagamento = [
    {
      tipo: FormaPagamentoClinica.PIX,
      nome: 'PIX',
      descricao: 'Pagamento instantâneo',
      icon: QrCode,
      cor: 'bg-green-500',
      vantagens: ['Pagamento instantâneo', 'Sem taxas', 'Disponível 24h']
    },
    {
      tipo: FormaPagamentoClinica.BOLETO,
      nome: 'Boleto Bancário',
      descricao: 'Pagamento via boleto',
      icon: FileText,
      cor: 'bg-blue-500',
      vantagens: ['Vencimento em até 3 dias', 'Pode ser pago em qualquer banco', 'Comprovante automático']
    },
    {
      tipo: FormaPagamentoClinica.CARTAO_CREDITO,
      nome: 'Cartão de Crédito',
      descricao: 'Pagamento parcelado',
      icon: CreditCard,
      cor: 'bg-purple-500',
      vantagens: ['Pode ser parcelado', 'Pagamento seguro', 'Pontos e benefícios']
    }
  ];

  const handleCopiarPix = () => {
    const chavePix = 'omnicare@pagamento.com';
    navigator.clipboard.writeText(chavePix);
    setCopiado(true);
    toast({
      title: "✅ Chave PIX copiada",
      description: "Chave PIX copiada para a área de transferência",
    });
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleGerarBoleto = () => {
    toast({
      title: "📄 Boleto gerado",
      description: "Boleto gerado com sucesso. Verifique seu email.",
    });
  };

  const handlePagarCartao = () => {
    toast({
      title: "💳 Redirecionando",
      description: "Redirecionando para o gateway de pagamento...",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-red-800 dark:text-red-200 mb-2">
            Acesso Temporariamente Bloqueado
          </h1>
          <p className="text-red-600 dark:text-red-300 max-w-2xl mx-auto">
            Sua conta foi bloqueada devido ao não pagamento da fatura. 
            Para reativar o acesso, realize o pagamento através de uma das opções abaixo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detalhes da Fatura */}
          <Card className="lg:col-span-1 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <DollarSign className="w-5 h-5" />
                Detalhes da Fatura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Número da Fatura:</span>
                  <span className="text-sm font-mono text-red-800 dark:text-red-200">{fatura.numeroFatura}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Clínica:</span>
                  <span className="text-sm text-red-800 dark:text-red-200">{fatura.clinica?.nome || 'Clínica não encontrada'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Valor:</span>
                  <span className="text-lg font-bold text-red-800 dark:text-red-200">{formatarValor(fatura.valor)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Vencimento:</span>
                  <span className="text-sm text-red-800 dark:text-red-200">
                    {format(parseISO(fatura.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Dias em Atraso:</span>
                  <Badge variant="destructive" className="text-xs">
                    {diasAtraso} dia{diasAtraso !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>

              <Separator className="bg-red-200 dark:bg-red-800" />

              {fatura.observacoes && (
                <div>
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Observações:</span>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{fatura.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Opções de Pagamento */}
          <Card className="lg:col-span-2 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <CreditCard className="w-5 h-5" />
                Escolha a Forma de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formasPagamento.map((forma) => (
                  <Card 
                    key={forma.tipo}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      formaPagamentoSelecionada === forma.tipo 
                        ? 'ring-2 ring-orange-500 bg-orange-100 dark:bg-orange-900/30' 
                        : 'hover:bg-orange-100 dark:hover:bg-orange-900/20'
                    }`}
                    onClick={() => setFormaPagamentoSelecionada(forma.tipo)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 ${forma.cor} rounded-full flex items-center justify-center`}>
                          <forma.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-orange-800 dark:text-orange-200">{forma.nome}</h3>
                          <p className="text-xs text-orange-600 dark:text-orange-400">{forma.descricao}</p>
                        </div>
                      </div>
                      
                      <ul className="space-y-1">
                        {forma.vantagens.map((vantagem, index) => (
                          <li key={index} className="text-xs text-orange-700 dark:text-orange-300 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {vantagem}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Botões de Ação */}
              <div className="mt-6 space-y-3">
                {formaPagamentoSelecionada === FormaPagamentoClinica.PIX && (
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Chave PIX:</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopiarPix}
                          className="text-xs"
                        >
                          {copiado ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiado ? 'Copiado!' : 'Copiar'}
                        </Button>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono text-sm">
                        omnicare@pagamento.com
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => onPagar?.(FormaPagamentoClinica.PIX)}
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Pagar com PIX
                    </Button>
                  </div>
                )}

                {formaPagamentoSelecionada === FormaPagamentoClinica.BOLETO && (
                  <div className="space-y-3">
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Importante
                        </span>
                      </div>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        O boleto será enviado para o email cadastrado. O acesso será liberado após a confirmação do pagamento.
                      </p>
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleGerarBoleto}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Gerar Boleto
                    </Button>
                  </div>
                )}

                {formaPagamentoSelecionada === FormaPagamentoClinica.CARTAO_CREDITO && (
                  <div className="space-y-3">
                    <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                          Pagamento Seguro
                        </span>
                      </div>
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        Você será redirecionado para um gateway de pagamento seguro.
                      </p>
                    </div>
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={handlePagarCartao}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pagar com Cartão
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suporte */}
        <Card className="mt-6 border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/20">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Precisa de Ajuda?</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={onFalarSuporte}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Falar com Suporte
                </Button>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>(11) 99999-9999</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>suporte@omnicare.com</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
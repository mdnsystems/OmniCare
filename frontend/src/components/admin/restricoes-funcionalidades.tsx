import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  AlertTriangle, 
  DollarSign, 
  Calendar,
  XCircle,
  MessageCircle
} from 'lucide-react';
import { FaturaClinica, NivelBloqueio } from '@/types/api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RestricoesFuncionalidadesProps {
  faturas: FaturaClinica[];
  children: ReactNode;
  onPagar?: (fatura: FaturaClinica) => void;
  onFalarSuporte?: () => void;
}

export function RestricoesFuncionalidades({ 
  faturas, 
  children, 
  onPagar, 
  onFalarSuporte 
}: RestricoesFuncionalidadesProps) {
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

  // Verificar se há faturas com restrição de funcionalidades
  const faturasComRestricao = faturas.filter(fatura => 
    fatura.nivelBloqueio === NivelBloqueio.RESTRICAO_FUNCIONALIDADES
  );

  if (faturasComRestricao.length === 0) {
    return <>{children}</>;
  }

  const totalEmAtraso = faturasComRestricao.reduce((total, fatura) => total + fatura.valor, 0);
  const diasAtrasoMaximo = Math.max(...faturasComRestricao.map(fatura => calcularDiasAtraso(fatura.dataVencimento)));

  return (
    <div className="relative">
      {/* Overlay de restrição */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-orange-800 dark:text-orange-200">
                  Funcionalidades Restritas
                </CardTitle>
                <p className="text-sm text-orange-600 dark:text-orange-300">
                  Sua conta possui faturas em atraso. Algumas funcionalidades foram temporariamente desabilitadas.
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Detalhes das faturas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Faturas em atraso:
                </span>
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  {faturasComRestricao.length} fatura{faturasComRestricao.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Total em atraso:
                </span>
                <span className="text-lg font-bold text-orange-800 dark:text-orange-200">
                  {formatarValor(totalEmAtraso)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Dias de atraso:
                </span>
                <Badge variant="destructive" className="text-xs">
                  {diasAtrasoMaximo} dia{diasAtrasoMaximo !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>

            {/* Lista de faturas */}
            <div className="space-y-3">
              <h4 className="font-medium text-orange-800 dark:text-orange-200">
                Faturas afetadas:
              </h4>
              {faturasComRestricao.map((fatura) => (
                <div 
                  key={fatura.id}
                  className="flex items-center justify-between p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-orange-800 dark:text-orange-200">
                        {fatura.numeroFatura}
                      </span>
                      <span className="text-sm text-orange-600 dark:text-orange-300">
                        Venc: {format(parseISO(fatura.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                    <div className="text-sm text-orange-600 dark:text-orange-300">
                      {formatarValor(fatura.valor)}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onPagar?.(fatura)}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <DollarSign className="h-3 w-3 mr-1" />
                    Pagar
                  </Button>
                </div>
              ))}
            </div>

            {/* Funcionalidades restritas */}
            <div className="space-y-3">
              <h4 className="font-medium text-orange-800 dark:text-orange-200">
                Funcionalidades temporariamente desabilitadas:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-300">
                  <XCircle className="h-4 w-4" />
                  <span>Geração de relatórios</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-300">
                  <XCircle className="h-4 w-4" />
                  <span>Exportação de dados</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-300">
                  <XCircle className="h-4 w-4" />
                  <span>Backup automático</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-300">
                  <XCircle className="h-4 w-4" />
                  <span>Integrações avançadas</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-orange-200 dark:border-orange-800">
              <Button
                onClick={() => onPagar?.(faturasComRestricao[0])}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Pagar Faturas
              </Button>
              
              <Button
                variant="outline"
                onClick={onFalarSuporte}
                className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Falar com Suporte
              </Button>
            </div>

            {/* Aviso importante */}
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  <p className="font-medium mb-1">Aviso Importante:</p>
                  <p>
                    Após 10 dias de atraso, o acesso completo ao sistema será bloqueado. 
                    Para evitar interrupções, regularize sua situação o quanto antes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo original (desabilitado) */}
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </div>
  );
} 
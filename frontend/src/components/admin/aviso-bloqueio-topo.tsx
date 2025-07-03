import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  X, 
  DollarSign, 
  Calendar,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from 'lucide-react';
import { FaturaClinica, NivelBloqueio } from '@/types/api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AvisoBloqueioTopoProps {
  faturas: FaturaClinica[];
  onDismiss?: () => void;
  onPagar?: (fatura: FaturaClinica) => void;
  onFalarSuporte?: () => void;
}

export function AvisoBloqueioTopo({ faturas, onDismiss, onPagar, onFalarSuporte }: AvisoBloqueioTopoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

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

  const getNivelBloqueioColor = (nivel: NivelBloqueio) => {
    switch (nivel) {
      case NivelBloqueio.NOTIFICACAO:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case NivelBloqueio.AVISO_TOPO:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case NivelBloqueio.RESTRICAO_FUNCIONALIDADES:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case NivelBloqueio.BLOQUEIO_TOTAL:
        return 'bg-red-900 text-red-100 dark:bg-red-800 dark:text-red-200 border-red-800 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  const getNivelBloqueioText = (nivel: NivelBloqueio) => {
    switch (nivel) {
      case NivelBloqueio.NOTIFICACAO:
        return 'Notificação';
      case NivelBloqueio.AVISO_TOPO:
        return 'Aviso no Topo';
      case NivelBloqueio.RESTRICAO_FUNCIONALIDADES:
        return 'Restrição de Funcionalidades';
      case NivelBloqueio.BLOQUEIO_TOTAL:
        return 'Bloqueio Total';
      default:
        return 'Sem Bloqueio';
    }
  };

  const getNivelBloqueioIcon = (nivel: NivelBloqueio) => {
    switch (nivel) {
      case NivelBloqueio.NOTIFICACAO:
        return '🔔';
      case NivelBloqueio.AVISO_TOPO:
        return '⚠️';
      case NivelBloqueio.RESTRICAO_FUNCIONALIDADES:
        return '🔒';
      case NivelBloqueio.BLOQUEIO_TOTAL:
        return '🚫';
      default:
        return '✅';
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  // Filtrar faturas que devem mostrar aviso no topo
  const faturasComAviso = faturas.filter(fatura => 
    fatura.nivelBloqueio === NivelBloqueio.AVISO_TOPO || 
    fatura.nivelBloqueio === NivelBloqueio.RESTRICAO_FUNCIONALIDADES ||
    fatura.nivelBloqueio === NivelBloqueio.BLOQUEIO_TOTAL
  );

  if (dismissed || faturasComAviso.length === 0) {
    return null;
  }

  const faturasCriticas = faturasComAviso.filter(fatura => 
    fatura.nivelBloqueio === NivelBloqueio.BLOQUEIO_TOTAL
  );

  const faturasRestricao = faturasComAviso.filter(fatura => 
    fatura.nivelBloqueio === NivelBloqueio.RESTRICAO_FUNCIONALIDADES
  );

  const faturasAviso = faturasComAviso.filter(fatura => 
    fatura.nivelBloqueio === NivelBloqueio.AVISO_TOPO
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <Card className={`border-2 shadow-lg max-w-4xl mx-auto ${getNivelBloqueioColor(faturasCriticas.length > 0 ? NivelBloqueio.BLOQUEIO_TOTAL : faturasRestricao.length > 0 ? NivelBloqueio.RESTRICAO_FUNCIONALIDADES : NivelBloqueio.AVISO_TOPO)}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Informações Principais */}
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {getNivelBloqueioIcon(faturasCriticas.length > 0 ? NivelBloqueio.BLOQUEIO_TOTAL : faturasRestricao.length > 0 ? NivelBloqueio.RESTRICAO_FUNCIONALIDADES : NivelBloqueio.AVISO_TOPO)}
                </span>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">
                    {faturasCriticas.length > 0 ? 'Acesso Bloqueado' : 
                     faturasRestricao.length > 0 ? 'Funcionalidades Restritas' : 
                     'Fatura em Atraso'}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {faturasComAviso.length} fatura{faturasComAviso.length !== 1 ? 's' : ''} pendente{faturasComAviso.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>
                      Total: {formatarValor(faturasComAviso.reduce((total, fatura) => total + fatura.valor, 0))}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {faturasComAviso.length} vencida{faturasComAviso.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs"
              >
                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {isExpanded ? 'Menos' : 'Detalhes'}
              </Button>
              
              {faturasCriticas.length > 0 && (
                <Button
                  size="sm"
                  onClick={() => onPagar?.(faturasCriticas[0])}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs"
                >
                  <DollarSign className="h-3 w-3 mr-1" />
                  Pagar Agora
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={onFalarSuporte}
                className="text-xs"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Suporte
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-xs"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Detalhes Expandidos */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-current/20">
              <div className="space-y-3">
                {/* Faturas com Bloqueio Total */}
                {faturasCriticas.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                      🚫 Bloqueio Total ({faturasCriticas.length})
                    </h4>
                    {faturasCriticas.map((fatura) => (
                      <div key={fatura.id} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/30 rounded text-sm">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs">{fatura.numeroFatura}</span>
                          <span>{fatura.clinica?.nome}</span>
                          <span className="font-semibold">{formatarValor(fatura.valor)}</span>
                          <span className="text-xs">
                            {calcularDiasAtraso(fatura.dataVencimento)} dia{calcularDiasAtraso(fatura.dataVencimento) !== 1 ? 's' : ''} em atraso
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onPagar?.(fatura)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs"
                        >
                          Pagar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Faturas com Restrição */}
                {faturasRestricao.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      🔒 Restrição de Funcionalidades ({faturasRestricao.length})
                    </h4>
                    {faturasRestricao.map((fatura) => (
                      <div key={fatura.id} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/30 rounded text-sm">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs">{fatura.numeroFatura}</span>
                          <span>{fatura.clinica?.nome}</span>
                          <span className="font-semibold">{formatarValor(fatura.valor)}</span>
                          <span className="text-xs">
                            {calcularDiasAtraso(fatura.dataVencimento)} dia{calcularDiasAtraso(fatura.dataVencimento) !== 1 ? 's' : ''} em atraso
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onPagar?.(fatura)}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                        >
                          Pagar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Faturas com Aviso */}
                {faturasAviso.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      ⚠️ Aviso ({faturasAviso.length})
                    </h4>
                    {faturasAviso.map((fatura) => (
                      <div key={fatura.id} className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded text-sm">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs">{fatura.numeroFatura}</span>
                          <span>{fatura.clinica?.nome}</span>
                          <span className="font-semibold">{formatarValor(fatura.valor)}</span>
                          <span className="text-xs">
                            {calcularDiasAtraso(fatura.dataVencimento)} dia{calcularDiasAtraso(fatura.dataVencimento) !== 1 ? 's' : ''} em atraso
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onPagar?.(fatura)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
                        >
                          Pagar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <AlertTriangle className="h-3 w-3" />
                <span>
                  Para evitar bloqueio total, regularize suas faturas o quanto antes.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
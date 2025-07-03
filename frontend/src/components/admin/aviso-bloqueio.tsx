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
  ChevronUp
} from 'lucide-react';
import { FaturaClinica, NivelBloqueio } from '@/types/api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AvisoBloqueioProps {
  fatura: FaturaClinica;
  onDismiss?: () => void;
  onPagar?: () => void;
}

export function AvisoBloqueio({ fatura, onDismiss, onPagar }: AvisoBloqueioProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <Card className={`border-2 ${getNivelBloqueioColor(fatura.nivelBloqueio)} shadow-lg`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Informações Principais */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getNivelBloqueioIcon(fatura.nivelBloqueio)}</span>
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">
                  Fatura em Atraso
                </span>
                <Badge variant="outline" className="text-xs">
                  {getNivelBloqueioText(fatura.nivelBloqueio)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{formatarValor(fatura.valor)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Venc: {format(parseISO(fatura.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-red-600">
                    {diasAtraso} dia{diasAtraso !== 1 ? 's' : ''} em atraso
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
              onClick={onPagar}
              className="text-xs"
            >
              Regularizar
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="text-xs"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Conteúdo Expandido */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-current/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Número da Fatura:</span>
                <div className="text-muted-foreground font-mono">
                  {fatura.numeroFatura}
                </div>
              </div>
              
              <div>
                <span className="font-medium">Clínica:</span>
                <div className="text-muted-foreground">
                  {fatura.clinica?.nome || 'Clínica não encontrada'}
                </div>
              </div>
              
              <div>
                <span className="font-medium">Status:</span>
                <div className="text-muted-foreground">
                  {fatura.status}
                </div>
              </div>
            </div>
            
            {fatura.observacoes && (
              <div className="mt-3">
                <span className="font-medium text-sm">Observações:</span>
                <div className="text-muted-foreground text-sm mt-1">
                  {fatura.observacoes}
                </div>
              </div>
            )}
            
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3" />
              <span>
                Para evitar bloqueio total, regularize sua fatura o quanto antes.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
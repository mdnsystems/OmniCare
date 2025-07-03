import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusFatura, NivelBloqueio, FormaPagamentoClinica } from '@/types/api';

interface EstatisticasFinanceirasProps {
  estatisticas: {
    faturasPorStatus: Array<{ status: StatusFatura; quantidade: number; valor: number }>;
    faturasPorNivelBloqueio: Array<{ nivel: NivelBloqueio; quantidade: number }>;
    pagamentosPorForma: Array<{ forma: FormaPagamentoClinica; quantidade: number; valor: number }>;
  };
}

export function EstatisticasFinanceiras({ estatisticas }: EstatisticasFinanceirasProps) {
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getStatusColor = (status: StatusFatura) => {
    switch (status) {
      case StatusFatura.PAGO:
        return 'bg-green-500';
      case StatusFatura.PENDENTE:
        return 'bg-yellow-500';
      case StatusFatura.VENCIDO:
        return 'bg-red-500';
      case StatusFatura.PARCIAL:
        return 'bg-blue-500';
      case StatusFatura.CANCELADO:
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getNivelBloqueioColor = (nivel: NivelBloqueio) => {
    switch (nivel) {
      case NivelBloqueio.SEM_BLOQUEIO:
        return 'bg-green-500';
      case NivelBloqueio.NOTIFICACAO:
        return 'bg-yellow-500';
      case NivelBloqueio.AVISO_TOPO:
        return 'bg-orange-500';
      case NivelBloqueio.RESTRICAO_FUNCIONALIDADES:
        return 'bg-red-500';
      case NivelBloqueio.BLOQUEIO_TOTAL:
        return 'bg-red-900';
      default:
        return 'bg-gray-500';
    }
  };

  const getFormaPagamentoColor = (forma: FormaPagamentoClinica) => {
    switch (forma) {
      case FormaPagamentoClinica.PIX:
        return 'bg-green-500';
      case FormaPagamentoClinica.BOLETO:
        return 'bg-blue-500';
      case FormaPagamentoClinica.CARTAO_CREDITO:
        return 'bg-purple-500';
      case FormaPagamentoClinica.CARTAO_DEBITO:
        return 'bg-indigo-500';
      case FormaPagamentoClinica.TRANSFERENCIA:
        return 'bg-teal-500';
      case FormaPagamentoClinica.DINHEIRO:
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Faturas por Status */}
      <Card>
        <CardHeader>
          <CardTitle>Faturas por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {estatisticas.faturasPorStatus.map((item) => (
              <div key={item.status} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.status}</span>
                  <span>{item.quantidade} faturas</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className={`h-2 rounded-full ${getStatusColor(item.status)}`}
                    style={{ 
                      width: `${estatisticas.faturasPorStatus.reduce((acc, curr) => acc + curr.quantidade, 0) > 0 
                        ? (item.quantidade / estatisticas.faturasPorStatus.reduce((acc, curr) => acc + curr.quantidade, 0)) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatarValor(item.valor)} ({item.quantidade} faturas)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Faturas por Nível de Bloqueio */}
      <Card>
        <CardHeader>
          <CardTitle>Faturas por Nível de Bloqueio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {estatisticas.faturasPorNivelBloqueio.map((item) => (
              <div key={item.nivel} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.nivel.replace('_', ' ')}</span>
                  <span>{item.quantidade} faturas</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className={`h-2 rounded-full ${getNivelBloqueioColor(item.nivel)}`}
                    style={{ 
                      width: `${estatisticas.faturasPorNivelBloqueio.reduce((acc, curr) => acc + curr.quantidade, 0) > 0 
                        ? (item.quantidade / estatisticas.faturasPorNivelBloqueio.reduce((acc, curr) => acc + curr.quantidade, 0)) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagamentos por Forma */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Pagamentos por Forma de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {estatisticas.pagamentosPorForma.map((item) => (
                <div key={item.forma} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.forma.replace('_', ' ')}</span>
                    <span>{item.quantidade} pagamentos</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className={`h-2 rounded-full ${getFormaPagamentoColor(item.forma)}`}
                      style={{ 
                        width: `${estatisticas.pagamentosPorForma.reduce((acc, curr) => acc + curr.valor, 0) > 0 
                          ? (item.valor / estatisticas.pagamentosPorForma.reduce((acc, curr) => acc + curr.valor, 0)) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatarValor(item.valor)} ({item.quantidade} pagamentos)
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatarValor(estatisticas.pagamentosPorForma.reduce((acc, curr) => acc + curr.valor, 0))}
                </div>
                <p className="text-sm text-muted-foreground">Total Recebido</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Resumo por Forma:</h4>
                {estatisticas.pagamentosPorForma.map((item) => (
                  <div key={item.forma} className="flex justify-between text-sm">
                    <span>{item.forma.replace('_', ' ')}</span>
                    <span className="font-medium">{formatarValor(item.valor)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
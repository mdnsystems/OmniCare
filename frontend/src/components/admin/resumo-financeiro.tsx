import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Building
} from 'lucide-react';

interface ResumoFinanceiroProps {
  resumo: {
    totalFaturas: number;
    totalPendente: number;
    totalPago: number;
    totalVencido: number;
    totalEmAtraso: number;
    valorTotalPendente: number;
    valorTotalPago: number;
    valorTotalVencido: number;
  };
}

export function ResumoFinanceiro({ resumo }: ResumoFinanceiroProps) {
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const calcularPercentual = (valor: number, total: number) => {
    if (total === 0) return 0;
    return ((valor / total) * 100).toFixed(1);
  };

  const valorTotal = resumo.valorTotalPendente + resumo.valorTotalPago + resumo.valorTotalVencido;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Faturas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Faturas</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resumo.totalFaturas}</div>
          <p className="text-xs text-muted-foreground">
            Faturas emitidas
          </p>
        </CardContent>
      </Card>

      {/* Valor Total Pago */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatarValor(resumo.valorTotalPago)}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
            {calcularPercentual(resumo.valorTotalPago, valorTotal)}% do total
          </div>
        </CardContent>
      </Card>

      {/* Valor Pendente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendente</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {formatarValor(resumo.valorTotalPendente)}
          </div>
          <p className="text-xs text-muted-foreground">
            {resumo.totalPendente} faturas pendentes
          </p>
        </CardContent>
      </Card>

      {/* Valor Vencido */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vencido</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatarValor(resumo.valorTotalVencido)}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
            {resumo.totalVencido} faturas vencidas
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  Download, 
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  User,
  FileText
} from "lucide-react"
import { DataTable } from "./components/data-table"
import { columns } from "./components/pagamentos-columns"
import { Pagamento, FormaPagamento } from "@/types/api"
import { usePagamentos } from "@/hooks/useFinanceiro"
import { formatCurrency } from "@/lib/utils"

export function PagamentosTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [formaPagamentoFilter, setFormaPagamentoFilter] = useState<string>("")
  
  const { data: pagamentos = [], isLoading, error } = usePagamentos();

  // Filtrar dados baseado nos filtros
  const filteredData = pagamentos.filter((pagamento) => {
    const matchesSearch = 
      pagamento.faturamento?.paciente?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagamento.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFormaPagamento = !formaPagamentoFilter || pagamento.formaPagamento === formaPagamentoFilter;

    return matchesSearch && matchesFormaPagamento;
  });

  const totalPagamentos = filteredData.reduce((acc, pag) => acc + Number(pag.valor), 0);
  const pagamentosPix = filteredData
    .filter(pag => pag.formaPagamento === FormaPagamento.PIX)
    .reduce((acc, pag) => acc + Number(pag.valor), 0);
  const pagamentosCartao = filteredData
    .filter(pag => pag.formaPagamento === FormaPagamento.CARTAO_CREDITO || pag.formaPagamento === FormaPagamento.CARTAO_DEBITO)
    .reduce((acc, pag) => acc + Number(pag.valor), 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Erro ao carregar dados de pagamentos
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPagamentos)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredData.length} pagamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos PIX</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(pagamentosPix)}</div>
            <p className="text-xs text-muted-foreground">
              {totalPagamentos > 0 ? ((pagamentosPix / totalPagamentos) * 100).toFixed(1) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Cartão</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(pagamentosCartao)}</div>
            <p className="text-xs text-muted-foreground">
              {totalPagamentos > 0 ? ((pagamentosCartao / totalPagamentos) * 100).toFixed(1) : 0}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pagamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <select
                value={formaPagamentoFilter}
                onChange={(e) => setFormaPagamentoFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">Todas as formas</option>
                <option value={FormaPagamento.DINHEIRO}>Dinheiro</option>
                <option value={FormaPagamento.CARTAO_CREDITO}>Cartão de Crédito</option>
                <option value={FormaPagamento.CARTAO_DEBITO}>Cartão de Débito</option>
                <option value={FormaPagamento.PIX}>PIX</option>
                <option value={FormaPagamento.TRANSFERENCIA}>Transferência</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Pagamento
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
}

export default PagamentosTable; 
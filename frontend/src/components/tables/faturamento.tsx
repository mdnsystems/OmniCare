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
import { columns } from "./components/columns"
import { Faturamento, TipoFaturamento, FormaPagamento, StatusFaturamento } from "@/types/api"
import { useFaturamentos } from "@/hooks/useFinanceiro"
import { formatCurrency } from "@/lib/utils"

export function FaturamentoTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [tipoFilter, setTipoFilter] = useState<string>("")
  
  const { data: faturamentos = [], isLoading, error } = useFaturamentos();

  // Filtrar dados baseado nos filtros
  const filteredData = faturamentos.filter((faturamento) => {
    const matchesSearch = 
      faturamento.paciente?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faturamento.profissional?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faturamento.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || faturamento.status === statusFilter;
    const matchesTipo = !tipoFilter || faturamento.tipo === tipoFilter;

    return matchesSearch && matchesStatus && matchesTipo;
  });

  const totalReceita = filteredData.reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
  const receitaPaga = filteredData
    .filter(fat => fat.status === StatusFaturamento.PAGO)
    .reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
  const receitaPendente = filteredData
    .filter(fat => fat.status === StatusFaturamento.PENDENTE)
    .reduce((acc, fat) => acc + Number(fat.valorFinal), 0);

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
        Erro ao carregar dados de faturamento
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalReceita)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredData.length} faturas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Paga</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(receitaPaga)}</div>
            <p className="text-xs text-muted-foreground">
              {((receitaPaga / totalReceita) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Pendente</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(receitaPendente)}</div>
            <p className="text-xs text-muted-foreground">
              {((receitaPendente / totalReceita) * 100).toFixed(1)}% do total
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
                  placeholder="Buscar faturamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">Todos os status</option>
                <option value={StatusFaturamento.PENDENTE}>Pendente</option>
                <option value={StatusFaturamento.PAGO}>Pago</option>
                <option value={StatusFaturamento.VENCIDO}>Vencido</option>
                <option value={StatusFaturamento.CANCELADO}>Cancelado</option>
              </select>

              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">Todos os tipos</option>
                <option value={TipoFaturamento.CONSULTA}>Consulta</option>
                <option value={TipoFaturamento.EXAME}>Exame</option>
                <option value={TipoFaturamento.PROCEDIMENTO}>Procedimento</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Faturamento
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
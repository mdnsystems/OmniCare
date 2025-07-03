import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  User, 
  UserCheck,
  Plus,
  Download,
  Filter
} from "lucide-react"
import FaturamentoTable from "@/components/tables/faturamento"
import { useClinica } from "@/contexts/ClinicaContext"
import { StatusFaturamento, TipoFaturamento, FormaPagamento } from "@/types/api"

export function Faturamento() {
  const { getNomenclatura } = useClinica()
  const [date, setDate] = useState<Date | null>(new Date())
  const [selectedStatus, setSelectedStatus] = useState<string>("TODOS")
  const [selectedTipo, setSelectedTipo] = useState<string>("TODOS")
  const [selectedFormaPagamento, setSelectedFormaPagamento] = useState<string>("TODOS")

  // Mock data para demonstração
  const resumoFaturamento = {
    totalFaturado: 45680.00,
    totalPago: 42350.00,
    totalPendente: 2850.00,
    totalVencido: 480.00,
    mediaTicket: 285.50,
    taxaConversao: 92.5,
    crescimentoMensal: 15.3
  }

  const faturamentoPorPeriodo = [
    { periodo: "Jan", receita: 42000, pagamentos: 39500, pendente: 2000, vencido: 500 },
    { periodo: "Fev", receita: 45680, pagamentos: 42350, pendente: 2850, vencido: 480 },
    { periodo: "Mar", receita: 48900, pagamentos: 45600, pendente: 2800, vencido: 500 },
    { periodo: "Abr", receita: 51200, pagamentos: 47800, pendente: 3000, vencido: 400 },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Faturamento</h1>
          <p className="text-muted-foreground">
            Gerencie o faturamento e acompanhe a saúde financeira da clínica
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo Faturamento
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faturado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(resumoFaturamento.totalFaturado)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +{resumoFaturamento.crescimentoMensal}% em relação ao mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(resumoFaturamento.totalPago)}</div>
            <p className="text-xs text-muted-foreground">
              {((resumoFaturamento.totalPago / resumoFaturamento.totalFaturado) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(resumoFaturamento.totalPendente)}</div>
            <p className="text-xs text-muted-foreground">
              {((resumoFaturamento.totalPendente / resumoFaturamento.totalFaturado) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencido</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(resumoFaturamento.totalVencido)}</div>
            <p className="text-xs text-muted-foreground">
              {((resumoFaturamento.totalVencido / resumoFaturamento.totalFaturado) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filtros</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Limpar Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data</label>
              <DatePicker date={date} onSelect={setDate} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos os Status</SelectItem>
                  {Object.values(StatusFaturamento).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos os Tipos</SelectItem>
                  {Object.values(TipoFaturamento).map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Forma de Pagamento</label>
              <Select value={selectedFormaPagamento} onValueChange={setSelectedFormaPagamento}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todas as Formas</SelectItem>
                  {Object.values(FormaPagamento).map((forma) => (
                    <SelectItem key={forma} value={forma}>
                      {forma}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Faturamento */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Faturamento</CardTitle>
        </CardHeader>
        <CardContent>
          <FaturamentoTable />
        </CardContent>
      </Card>
    </div>
  )
} 
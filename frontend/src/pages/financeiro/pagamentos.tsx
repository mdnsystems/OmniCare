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
  Filter,
  Receipt
} from "lucide-react"
import PagamentosTable from "@/components/tables/pagamentos"
import { useClinica } from "@/contexts/ClinicaContext"
import { FormaPagamento } from "@/types/api"

export function Pagamentos() {
  const { getNomenclatura } = useClinica()
  const [date, setDate] = useState<Date | null>(new Date())
  const [selectedFormaPagamento, setSelectedFormaPagamento] = useState<string>("TODOS")

  // Mock data para demonstração
  const resumoPagamentos = {
    totalRecebido: 42350.00,
    totalPix: 18500.00,
    totalCartao: 15600.00,
    totalDinheiro: 8250.00,
    mediaPagamento: 423.50,
    crescimentoMensal: 12.8
  }

  const pagamentosPorForma = [
    { forma: "PIX", valor: 18500, quantidade: 45, percentual: 43.7 },
    { forma: "Cartão de Crédito", valor: 12000, quantidade: 28, percentual: 28.3 },
    { forma: "Cartão de Débito", valor: 3600, quantidade: 12, percentual: 8.5 },
    { forma: "Dinheiro", valor: 8250, quantidade: 15, percentual: 19.5 },
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
          <h1 className="text-2xl font-bold tracking-tight">Pagamentos</h1>
          <p className="text-muted-foreground">
            Acompanhe todos os pagamentos recebidos pela clínica
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo Pagamento
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(resumoPagamentos.totalRecebido)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +{resumoPagamentos.crescimentoMensal}% em relação ao mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos PIX</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(resumoPagamentos.totalPix)}</div>
            <p className="text-xs text-muted-foreground">
              {((resumoPagamentos.totalPix / resumoPagamentos.totalRecebido) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Cartão</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(resumoPagamentos.totalCartao)}</div>
            <p className="text-xs text-muted-foreground">
              {((resumoPagamentos.totalCartao / resumoPagamentos.totalRecebido) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Pagamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(resumoPagamentos.mediaPagamento)}</div>
            <p className="text-xs text-muted-foreground">
              Valor médio por transação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Pagamentos por Forma */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pagamentos por Forma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pagamentosPorForma.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">{item.forma}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{formatCurrency(item.valor)}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.quantidade} pagamentos ({item.percentual}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pagamentosPorForma.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.forma}</span>
                    <span>{item.percentual}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.percentual}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data</label>
              <DatePicker date={date} onSelect={setDate} />
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <Input placeholder="Buscar por paciente..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <PagamentosTable />
        </CardContent>
      </Card>
    </div>
  )
} 
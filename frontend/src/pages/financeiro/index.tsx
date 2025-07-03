import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  DollarSign, 
  Receipt, 
  FileText,
  TrendingUp,
  BarChart3,
  PieChart
} from "lucide-react"
import { useClinica } from "@/contexts/ClinicaContext"
import { useNavigate } from "react-router-dom"

export function Financeiro() {
  const { getNomenclatura } = useClinica()
  const navigate = useNavigate()

  const modulosFinanceiro = [
    {
      id: "faturamento",
      titulo: "Faturamento",
      descricao: "Gerencie o faturamento e acompanhe a saúde financeira da clínica",
      icon: DollarSign,
      rota: "/financeiro/faturamento",
      cor: "bg-blue-100 dark:bg-blue-900/30",
      corIcon: "text-blue-600 dark:text-blue-400"
    },
    {
      id: "pagamentos",
      titulo: "Pagamentos",
      descricao: "Acompanhe todos os pagamentos recebidos pela clínica",
      icon: Receipt,
      rota: "/financeiro/pagamentos",
      cor: "bg-green-100 dark:bg-green-900/30",
      corIcon: "text-green-600 dark:text-green-400"
    },
    {
      id: "relatorios",
      titulo: "Relatórios Financeiros",
      descricao: "Acesse relatórios detalhados sobre a performance financeira",
      icon: FileText,
      rota: "/financeiro/relatorios",
      cor: "bg-purple-100 dark:bg-purple-900/30",
      corIcon: "text-purple-600 dark:text-purple-400"
    }
  ]

  const metricasFinanceiras = {
    receitaTotal: 45680.00,
    receitaPaga: 42350.00,
    receitaPendente: 2850.00,
    receitaVencida: 480.00
  }

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
          <h1 className="text-2xl font-bold tracking-tight">Módulo Financeiro</h1>
          <p className="text-muted-foreground">
            Gerencie todas as operações financeiras da clínica
          </p>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metricasFinanceiras.receitaTotal)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +15.3% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Paga</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(metricasFinanceiras.receitaPaga)}</div>
            <p className="text-xs text-muted-foreground">
              {((metricasFinanceiras.receitaPaga / metricasFinanceiras.receitaTotal) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(metricasFinanceiras.receitaPendente)}</div>
            <p className="text-xs text-muted-foreground">
              {((metricasFinanceiras.receitaPendente / metricasFinanceiras.receitaTotal) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(metricasFinanceiras.receitaVencida)}</div>
            <p className="text-xs text-muted-foreground">
              {((metricasFinanceiras.receitaVencida / metricasFinanceiras.receitaTotal) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulosFinanceiro.map((modulo) => (
          <Card key={modulo.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${modulo.cor}`}>
                  <modulo.icon className={`h-6 w-6 ${modulo.corIcon}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{modulo.titulo}</CardTitle>
                  <p className="text-sm text-muted-foreground">{modulo.descricao}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate(modulo.rota)}
              >
                Acessar {modulo.titulo}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades do Módulo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Faturamento</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Gestão completa de faturas e cobranças</li>
                <li>• Controle de status de pagamentos</li>
                <li>• Aplicação de descontos e taxas</li>
                <li>• Integração com agendamentos</li>
                <li>• Relatórios de faturamento</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Pagamentos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Registro de pagamentos recebidos</li>
                <li>• Múltiplas formas de pagamento</li>
                <li>• Comprovantes e recibos</li>
                <li>• Controle de inadimplência</li>
                <li>• Relatórios de recebimentos</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Relatórios</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Relatórios de faturamento mensal</li>
                <li>• Análise de receita por profissional</li>
                <li>• Controle de inadimplência</li>
                <li>• Fluxo de caixa</li>
                <li>• Projeções financeiras</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Integração</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Integração com agendamentos</li>
                <li>• Sincronização com prontuários</li>
                <li>• Notificações automáticas</li>
                <li>• Exportação de dados</li>
                <li>• Backup automático</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
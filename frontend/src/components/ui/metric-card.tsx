import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  titulo: string
  valor: string | number
  descricao?: string
  icon?: LucideIcon
  trend?: {
    valor: number
    positivo: boolean
    texto: string
  }
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

export function MetricCard({ 
  titulo, 
  valor, 
  descricao, 
  icon: Icon,
  trend,
  variant = 'default',
  className 
}: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          icon: 'text-green-600 dark:text-green-400',
          value: 'text-green-600 dark:text-green-400',
          trend: 'text-green-600'
        }
      case 'warning':
        return {
          icon: 'text-yellow-600 dark:text-yellow-400',
          value: 'text-yellow-600 dark:text-yellow-400',
          trend: 'text-yellow-600'
        }
      case 'danger':
        return {
          icon: 'text-red-600 dark:text-red-400',
          value: 'text-red-600 dark:text-red-400',
          trend: 'text-red-600'
        }
      default:
        return {
          icon: 'text-muted-foreground',
          value: '',
          trend: 'text-green-600'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{titulo}</CardTitle>
        {Icon && <Icon className={cn("h-4 w-4", styles.icon)} />}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", styles.value)}>
          {valor}
        </div>
        {descricao && (
          <p className="text-xs text-muted-foreground">
            {descricao}
          </p>
        )}
        {trend && (
          <div className={cn("flex items-center text-xs", styles.trend)}>
            <span className={cn("mr-1", trend.positivo ? "text-green-600" : "text-red-600")}>
              {trend.positivo ? "↗" : "↘"}
            </span>
            {trend.valor}% {trend.texto}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
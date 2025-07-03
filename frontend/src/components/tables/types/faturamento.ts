import { ColumnDef } from "@tanstack/react-table"
import { Faturamento, StatusFaturamento, TipoFaturamento, FormaPagamento } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const getStatusFaturamentoColor = (status: StatusFaturamento) => {
  switch (status) {
    case StatusFaturamento.PAGO:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case StatusFaturamento.PENDENTE:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case StatusFaturamento.VENCIDO:
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    case StatusFaturamento.PARCIAL:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case StatusFaturamento.CANCELADO:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    case StatusFaturamento.ESTORNADO:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

export const getTipoFaturamentoColor = (tipo: TipoFaturamento) => {
  switch (tipo) {
    case TipoFaturamento.CONSULTA:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case TipoFaturamento.PROCEDIMENTO:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    case TipoFaturamento.EXAME:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case TipoFaturamento.MEDICAMENTO:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    case TipoFaturamento.MATERIAL:
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400"
    case TipoFaturamento.TAXA:
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    case TipoFaturamento.OUTROS:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

export const getFormaPagamentoColor = (forma: FormaPagamento) => {
  switch (forma) {
    case FormaPagamento.PIX:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case FormaPagamento.CARTAO_CREDITO:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case FormaPagamento.CARTAO_DEBITO:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    case FormaPagamento.DINHEIRO:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case FormaPagamento.TRANSFERENCIA:
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400"
    case FormaPagamento.BOLETO:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    case FormaPagamento.CONVENIO:
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
    case FormaPagamento.PARCELADO:
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

export type FaturamentoTableProps = {
  onView?: (faturamento: Faturamento) => void
  onEdit?: (faturamento: Faturamento) => void
  onDelete?: (faturamento: Faturamento) => void
} 
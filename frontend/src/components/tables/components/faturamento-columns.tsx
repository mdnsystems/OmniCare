import { ColumnDef } from "@tanstack/react-table"
import { Faturamento, StatusFaturamento, TipoFaturamento } from "@/types/api"
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
import { formatCurrency, formatDate, getStatusFaturamentoColor, getTipoFaturamentoColor } from "../types/faturamento"

export const columns: ColumnDef<Faturamento>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string
      return <div className="font-mono text-sm">{id.substring(0, 8)}...</div>
    },
  },
  {
    accessorKey: "paciente.nome",
    header: "Paciente",
    cell: ({ row }) => {
      const paciente = row.original.paciente
      return <div className="font-medium">{paciente?.nome || "N/A"}</div>
    },
  },
  {
    accessorKey: "profissional.nome",
    header: "Profissional",
    cell: ({ row }) => {
      const profissional = row.original.profissional
      return <div className="font-medium">{profissional?.nome || "N/A"}</div>
    },
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as TipoFaturamento
      return (
        <Badge className={getTipoFaturamentoColor(tipo)}>
          {tipo}
        </Badge>
      )
    },
  },
  {
    accessorKey: "valorFinal",
    header: "Valor",
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("valorFinal"))
      return <div className="font-medium">{formatCurrency(valor)}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as StatusFaturamento
      return (
        <Badge className={getStatusFaturamentoColor(status)}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "dataVencimento",
    header: "Vencimento",
    cell: ({ row }) => {
      const data = row.getValue("dataVencimento") as string
      return <div>{formatDate(data)}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const data = row.getValue("createdAt") as string
      return <div>{formatDate(data)}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const faturamento = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(faturamento.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 
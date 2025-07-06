import { ColumnDef } from "@tanstack/react-table"
import { Pagamento, FormaPagamento } from "@/types/api"
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
import { formatCurrency, formatDate, getFormaPagamentoColor } from "../types/faturamento"

export const columns: ColumnDef<Pagamento>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string
      return <div className="font-mono text-sm">{id.substring(0, 8)}...</div>
    },
  },
  {
    accessorKey: "faturamento.paciente.nome",
    header: "Paciente",
    cell: ({ row }) => {
      const paciente = row.original.faturamento?.paciente
      return <div className="font-medium">{paciente?.nome || "N/A"}</div>
    },
  },
  {
    accessorKey: "faturamento.profissional.nome",
    header: "Profissional",
    cell: ({ row }) => {
      const profissional = row.original.faturamento?.profissional
      return <div className="font-medium">{profissional?.nome || "N/A"}</div>
    },
  },
  {
    accessorKey: "valor",
    header: "Valor",
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("valor"))
      return <div className="font-medium">{formatCurrency(valor)}</div>
    },
  },
  {
    accessorKey: "formaPagamento",
    header: "Forma de Pagamento",
    cell: ({ row }) => {
      const forma = row.getValue("formaPagamento") as FormaPagamento
      return (
        <Badge className={getFormaPagamentoColor(forma)}>
          {forma}
        </Badge>
      )
    },
  },
  {
    accessorKey: "dataPagamento",
    header: "Data do Pagamento",
    cell: ({ row }) => {
      const data = row.getValue("dataPagamento") as string
      return <div>{formatDate(data)}</div>
    },
  },
  {
    accessorKey: "observacoes",
    header: "Observações",
    cell: ({ row }) => {
      const obs = row.getValue("observacoes") as string
      return <div className="max-w-[200px] truncate">{obs || "N/A"}</div>
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
      const pagamento = row.original

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
              onClick={() => navigator.clipboard.writeText(pagamento.id)}
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
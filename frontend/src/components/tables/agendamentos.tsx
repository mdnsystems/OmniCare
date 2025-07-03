import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ColumnDef, SortingState, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Agendamento } from "./types/agendamento";
import { DataTable } from "./components/data-table";
import { DataTablePagination } from "./components/table-pagination";
import { CopyableCell } from "./components/copyable-cell";
import { AgendamentoDetailsModal } from "./components/agendamento-details-modal";
import { DeleteAgendamentoDialog } from "./components/delete-agendamento-dialog";
import { Calendar, Clock, User, Edit, Trash2, Loader2, Search, X, Eye } from "lucide-react";
import { useAgendamentos, useDeleteAgendamento } from "@/hooks/useAgendamentos";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TipoAgendamento, StatusAgendamento } from "@/types/api";
import { cn } from "@/lib/utils";

export default function AgendamentosTable() {
	const navigate = useNavigate();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
	const [agendamentoToDelete, setAgendamentoToDelete] = useState<Agendamento | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [appliedFilter, setAppliedFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	// Buscar agendamentos da API
	const { data: agendamentosData, isLoading, error, refetch } = useAgendamentos({
		page: currentPage,
		limit: pageSize,
		filters: {
			pacienteNome: appliedFilter || undefined,
		}
	});

	// Hook para deletar agendamento
	const deleteAgendamentoMutation = useDeleteAgendamento();

	const handleDeleteAgendamento = async () => {
		if (agendamentoToDelete) {
			try {
				await deleteAgendamentoMutation.mutateAsync(agendamentoToDelete.id);
				setAgendamentoToDelete(null);
			} catch {
				// O erro já é tratado no hook
			}
		}
	};

	// Função para aplicar filtro
	const handleApplyFilter = () => {
		setAppliedFilter(searchTerm);
		setCurrentPage(1); // Resetar para primeira página quando filtrar
	};

	// Função para limpar filtro
	const handleClearFilter = () => {
		setSearchTerm("");
		setAppliedFilter("");
		setCurrentPage(1);
	};

	const getTipoColor = (tipo: TipoAgendamento) => {
		switch (tipo) {
			case TipoAgendamento.CONSULTA:
				return 'bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 text-emerald-700 border-emerald-200 dark:border-emerald-800';
			case TipoAgendamento.RETORNO:
				return 'bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 text-blue-700 border-blue-200 dark:border-blue-800';
			case TipoAgendamento.EXAME:
				return 'bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 text-orange-700 border-orange-200 dark:border-orange-800';
			default:
				return 'bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400 text-gray-700 border-gray-200 dark:border-gray-800';
		}
	};

	const getStatusColor = (status: StatusAgendamento) => {
		switch (status) {
			case StatusAgendamento.CONFIRMADO:
				return 'bg-green-100 dark:bg-green-900/30 dark:text-green-400 text-green-700 border-green-200 dark:border-green-800';
			case StatusAgendamento.AGENDADO:
				return 'bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 text-yellow-700 border-yellow-200 dark:border-yellow-800';
			case StatusAgendamento.CANCELADO:
				return 'bg-red-100 dark:bg-red-900/30 dark:text-red-400 text-red-700 border-red-200 dark:border-red-800';
			case StatusAgendamento.REALIZADO:
				return 'bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 text-blue-700 border-blue-200 dark:border-blue-800';
			default:
				return 'bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400 text-gray-700 border-gray-200 dark:border-gray-800';
		}
	};

	const agendamentos = agendamentosData?.data || [];

	const columns: ColumnDef<Agendamento>[] = [
		{
			accessorKey: "data",
			header: "Data",
			size: 120,
			cell: ({ row }) => {
				const data = row.getValue("data") as string;
				if (!data) return "";
				return format(parseISO(data), "dd/MM/yyyy", { locale: ptBR });
			},
		},
		{
			accessorKey: "horaInicio",
			header: "Horário",
			size: 120,
			cell: ({ row }) => {
				const horaInicio = row.getValue("horaInicio") as string;
				const horaFim = row.getValue("horaFim") as string;
				return `${horaInicio} - ${horaFim}`;
			},
		},
		{
			accessorKey: "paciente.nome",
			header: "Paciente",
			size: 200,
			cell: ({ row }) => {
				const paciente = row.original.paciente;
				return paciente?.nome || "";
			},
		},
		{
			accessorKey: "profissional.nome",
			header: "Profissional",
			size: 200,
			cell: ({ row }) => {
				const profissional = row.original.profissional;
				return profissional?.nome || "";
			},
		},
		{
			accessorKey: "tipo",
			header: "Tipo",
			size: 120,
			cell: ({ row }) => {
				const tipo = row.getValue("tipo") as TipoAgendamento;
				return (
					<Badge 
						variant="outline" 
						className={cn(
							"flex items-center justify-center gap-1 px-3 py-1",
							getTipoColor(tipo)
						)}
					>
						{tipo}
					</Badge>
				);
			}
		},
		{
			accessorKey: "status",
			header: "Status",
			size: 120,
			cell: ({ row }) => {
				const status = row.getValue("status") as StatusAgendamento;
				return (
					<Badge 
						variant="outline" 
						className={cn(
							"flex items-center justify-center gap-1 px-3 py-1",
							getStatusColor(status)
						)}
					>
						{status}
					</Badge>
				);
			}
		},
		{
			id: "actions",
			size: 160,
			cell: ({ row }) => {
				const agendamento = row.original;

				return (
					<div className="flex items-center gap-2">
						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => setSelectedAgendamento(agendamento)}
							title="Visualizar detalhes"
						>
							<span className="sr-only">Visualizar</span>
							<Eye className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => {
								navigate(`/agendamentos/novo?id=${agendamento.id}`);
							}}
							title="Editar agendamento"
						>
							<span className="sr-only">Editar</span>
							<Edit className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-red-500 hover:text-red-700"
							onClick={() => setAgendamentoToDelete(agendamento)}
							disabled={deleteAgendamentoMutation.isPending}
							title="Excluir agendamento"
						>
							<span className="sr-only">Excluir</span>
							{deleteAgendamentoMutation.isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Trash2 className="h-4 w-4" />
							)}
						</button>
					</div>
				);
			},
		},
	];

	const table = useReactTable({
		data: agendamentos,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
			pagination: {
				pageIndex: currentPage - 1,
				pageSize,
			},
		},
		manualPagination: true,
		pageCount: agendamentosData?.pagination?.totalPages || 0,
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				const newState = updater({
					pageIndex: currentPage - 1,
					pageSize,
				});
				setCurrentPage(newState.pageIndex + 1);
				setPageSize(newState.pageSize);
			}
		},
	});

	// Se houver erro, mostrar mensagem
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-[calc(100vh-130px)]">
				<div className="text-center">
					<h3 className="text-lg font-semibold text-destructive mb-2">
						Erro ao carregar agendamentos
					</h3>
					<p className="text-muted-foreground mb-4">
						{error.message || "Ocorreu um erro inesperado"}
					</p>
					<button
						onClick={() => refetch()}
						className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
					>
						Tentar novamente
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col h-[calc(100vh-130px)]">
				<div className="flex items-center gap-2 py-4">
					<Input
						placeholder="Filtrar agendamentos..."
						className="max-w-sm"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleApplyFilter();
							}
						}}
						disabled={isLoading}
					/>
					<Button
						onClick={handleApplyFilter}
						disabled={isLoading}
						size="sm"
						className="flex items-center gap-2"
					>
						<Search className="h-4 w-4" />
						Filtrar
					</Button>
					{(searchTerm || appliedFilter) && (
						<Button
							onClick={handleClearFilter}
							disabled={isLoading}
							size="sm"
							variant="outline"
							className="flex items-center gap-2"
						>
							<X className="h-4 w-4" />
							Limpar
						</Button>
					)}
				</div>
				<div className="flex-1 min-h-0">
					{isLoading ? (
						<div className="flex items-center justify-center h-full">
							<div className="flex items-center gap-2">
								<Loader2 className="h-6 w-6 animate-spin" />
								<span>Carregando agendamentos...</span>
							</div>
						</div>
					) : (
						<DataTable table={table} />
					)}
				</div>
				<DataTablePagination table={table} />
			</div>

			<AgendamentoDetailsModal
				agendamento={selectedAgendamento}
				isOpen={!!selectedAgendamento}
				onClose={() => setSelectedAgendamento(null)}
			/>

			<DeleteAgendamentoDialog
				agendamento={agendamentoToDelete}
				isOpen={!!agendamentoToDelete}
				onClose={() => setAgendamentoToDelete(null)}
				onConfirm={handleDeleteAgendamento}
				isLoading={deleteAgendamentoMutation.isPending}
			/>
		</>
	);
} 
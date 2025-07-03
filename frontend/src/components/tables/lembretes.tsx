import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ColumnDef, SortingState, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Lembrete } from "./types/lembrete";
import { DataTable } from "./components/data-table";
import { DataTablePagination } from "./components/table-pagination";
import { CopyableCell } from "./components/copyable-cell";
import { LembreteDetailsModal } from "./components/lembrete-details-modal";
import { DeleteLembreteDialog } from "./components/delete-lembrete-dialog";
import { Bell, User, Calendar, Edit, Trash2, Loader2, Search, X, Eye, Clock, AlertCircle } from "lucide-react";
import { useLembretes, useDeleteLembrete } from "@/hooks/useLembretes";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function LembretesTable() {
	const navigate = useNavigate();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [selectedLembrete, setSelectedLembrete] = useState<Lembrete | null>(null);
	const [lembreteToDelete, setLembreteToDelete] = useState<Lembrete | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [appliedFilter, setAppliedFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	// Buscar lembretes da API
	const { data: lembretesData, isLoading, error, refetch } = useLembretes({
		page: currentPage,
		limit: pageSize,
		filters: {
			pacienteNome: appliedFilter || undefined,
		}
	});

	// Hook para deletar lembrete
	const deleteLembreteMutation = useDeleteLembrete();

	const handleDeleteLembrete = async () => {
		if (lembreteToDelete) {
			try {
				await deleteLembreteMutation.mutateAsync(lembreteToDelete.id);
				setLembreteToDelete(null);
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

	const lembretes = lembretesData?.data || [];

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'PENDENTE':
				return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pendente</Badge>;
			case 'CONCLUIDO':
				return <Badge variant="outline" className="text-green-600 border-green-600">Concluído</Badge>;
			case 'CANCELADO':
				return <Badge variant="outline" className="text-red-600 border-red-600">Cancelado</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const getPrioridadeBadge = (prioridade: string) => {
		switch (prioridade) {
			case 'ALTA':
				return <Badge className="bg-red-500 text-white">Alta</Badge>;
			case 'MEDIA':
				return <Badge className="bg-yellow-500 text-white">Média</Badge>;
			case 'BAIXA':
				return <Badge className="bg-green-500 text-white">Baixa</Badge>;
			default:
				return <Badge variant="outline">{prioridade}</Badge>;
		}
	};

	const columns: ColumnDef<Lembrete>[] = [
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
			accessorKey: "hora",
			header: "Hora",
			size: 80,
			cell: ({ row }) => {
				const hora = row.getValue("hora") as string;
				return hora || "";
			},
		},
		{
			accessorKey: "titulo",
			header: "Título",
			size: 200,
			cell: ({ row }) => {
				const titulo = row.getValue("titulo") as string;
				return titulo?.length > 30 ? `${titulo.substring(0, 30)}...` : titulo || "";
			},
		},
		{
			accessorKey: "paciente.nome",
			header: "Paciente",
			size: 180,
			cell: ({ row }) => {
				const paciente = row.original.paciente;
				return paciente?.nome || "";
			},
		},
		{
			accessorKey: "tipo",
			header: "Tipo",
			size: 120,
			cell: ({ row }) => {
				const tipo = row.getValue("tipo") as string;
				return tipo || "";
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			size: 120,
			cell: ({ row }) => {
				const status = row.getValue("status") as string;
				return getStatusBadge(status);
			},
		},
		{
			accessorKey: "prioridade",
			header: "Prioridade",
			size: 100,
			cell: ({ row }) => {
				const prioridade = row.getValue("prioridade") as string;
				return getPrioridadeBadge(prioridade);
			},
		},
		{
			accessorKey: "repetir",
			header: "Repetir",
			size: 80,
			cell: ({ row }) => {
				const repetir = row.getValue("repetir") as boolean;
				return repetir ? (
					<Badge variant="outline" className="text-blue-600 border-blue-600">Sim</Badge>
				) : (
					<Badge variant="outline" className="text-gray-600 border-gray-600">Não</Badge>
				);
			},
		},
		{
			id: "actions",
			size: 160,
			cell: ({ row }) => {
				const lembrete = row.original;

				return (
					<div className="flex items-center gap-2">
						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => setSelectedLembrete(lembrete)}
							title="Visualizar detalhes"
						>
							<span className="sr-only">Visualizar</span>
							<Eye className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => {
								navigate(`/lembretes/novo?id=${lembrete.id}`);
							}}
							title="Editar lembrete"
						>
							<span className="sr-only">Editar</span>
							<Edit className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-red-500 hover:text-red-700"
							onClick={() => setLembreteToDelete(lembrete)}
							disabled={deleteLembreteMutation.isPending}
							title="Excluir lembrete"
						>
							<span className="sr-only">Excluir</span>
							{deleteLembreteMutation.isPending ? (
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
		data: lembretes,
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
		pageCount: lembretesData?.pagination?.totalPages || 0,
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
						Erro ao carregar lembretes
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
						placeholder="Filtrar lembretes..."
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
								<span>Carregando lembretes...</span>
							</div>
						</div>
					) : (
						<DataTable table={table} />
					)}
				</div>
				<DataTablePagination table={table} />
			</div>

			<LembreteDetailsModal
				lembrete={selectedLembrete}
				isOpen={!!selectedLembrete}
				onClose={() => setSelectedLembrete(null)}
			/>

			<DeleteLembreteDialog
				lembrete={lembreteToDelete}
				isOpen={!!lembreteToDelete}
				onClose={() => setLembreteToDelete(null)}
				onConfirm={handleDeleteLembrete}
				isLoading={deleteLembreteMutation.isPending}
			/>
		</>
	);
} 
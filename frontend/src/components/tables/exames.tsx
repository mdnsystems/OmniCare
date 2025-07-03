import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ColumnDef, SortingState, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Exame } from "./types/exame";
import { DataTable } from "./components/data-table";
import { DataTablePagination } from "./components/table-pagination";
import { CopyableCell } from "./components/copyable-cell";
import { ExameDetailsModal } from "./components/exame-details-modal";
import { DeleteExameDialog } from "./components/delete-exame-dialog";
import { FileText, User, Calendar, Edit, Trash2, Loader2, Search, X, Eye, Download } from "lucide-react";
import { useExames, useDeleteExame } from "@/hooks/useExames";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ExamesTable() {
	const navigate = useNavigate();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [selectedExame, setSelectedExame] = useState<Exame | null>(null);
	const [exameToDelete, setExameToDelete] = useState<Exame | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [appliedFilter, setAppliedFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	// Buscar exames da API
	const { data: examesData, isLoading, error, refetch } = useExames({
		page: currentPage,
		limit: pageSize,
		filters: {
			pacienteNome: appliedFilter || undefined,
		}
	});

	// Hook para deletar exame
	const deleteExameMutation = useDeleteExame();

	const handleDeleteExame = async () => {
		if (exameToDelete) {
			try {
				await deleteExameMutation.mutateAsync(exameToDelete.id);
				setExameToDelete(null);
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

	const exames = examesData?.data || [];

	const columns: ColumnDef<Exame>[] = [
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
			accessorKey: "tipo",
			header: "Tipo",
			size: 150,
			cell: ({ row }) => {
				const tipo = row.getValue("tipo") as string;
				return tipo || "";
			},
		},
		{
			accessorKey: "prontuario.paciente.nome",
			header: "Paciente",
			size: 200,
			cell: ({ row }) => {
				const paciente = row.original.prontuario?.paciente;
				return paciente?.nome || "";
			},
		},
		{
			accessorKey: "prontuario.profissional.nome",
			header: "Profissional",
			size: 200,
			cell: ({ row }) => {
				const profissional = row.original.prontuario?.profissional;
				return profissional?.nome || "";
			},
		},
		{
			accessorKey: "resultado",
			header: "Resultado",
			size: 250,
			cell: ({ row }) => {
				const resultado = row.getValue("resultado") as string;
				return resultado?.length > 50 ? `${resultado.substring(0, 50)}...` : resultado || "";
			},
		},
		{
			accessorKey: "observacoes",
			header: "Observações",
			size: 200,
			cell: ({ row }) => {
				const observacoes = row.getValue("observacoes") as string;
				return observacoes?.length > 40 ? `${observacoes.substring(0, 40)}...` : observacoes || "";
			},
		},
		{
			accessorKey: "arquivos",
			header: "Arquivos",
			size: 100,
			cell: ({ row }) => {
				const arquivos = row.getValue("arquivos") as any[];
				return arquivos?.length || 0;
			},
		},
		{
			id: "actions",
			size: 160,
			cell: ({ row }) => {
				const exame = row.original;

				return (
					<div className="flex items-center gap-2">
						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => setSelectedExame(exame)}
							title="Visualizar detalhes"
						>
							<span className="sr-only">Visualizar</span>
							<Eye className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => {
								navigate(`/exames/novo?id=${exame.id}`);
							}}
							title="Editar exame"
						>
							<span className="sr-only">Editar</span>
							<Edit className="h-4 w-4" />
						</button>

						{exame.arquivos && exame.arquivos.length > 0 && (
							<button
								className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
								onClick={() => {
									// Download do primeiro arquivo
									const arquivo = exame.arquivos[0];
									if (arquivo?.url) {
										window.open(arquivo.url, '_blank');
									}
								}}
								title="Download arquivo"
							>
								<span className="sr-only">Download</span>
								<Download className="h-4 w-4" />
							</button>
						)}

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-red-500 hover:text-red-700"
							onClick={() => setExameToDelete(exame)}
							disabled={deleteExameMutation.isPending}
							title="Excluir exame"
						>
							<span className="sr-only">Excluir</span>
							{deleteExameMutation.isPending ? (
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
		data: exames,
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
		pageCount: examesData?.pagination?.totalPages || 0,
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
						Erro ao carregar exames
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
						placeholder="Filtrar exames..."
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
								<span>Carregando exames...</span>
							</div>
						</div>
					) : (
						<DataTable table={table} />
					)}
				</div>
				<DataTablePagination table={table} />
			</div>

			<ExameDetailsModal
				exame={selectedExame}
				isOpen={!!selectedExame}
				onClose={() => setSelectedExame(null)}
			/>

			<DeleteExameDialog
				exame={exameToDelete}
				isOpen={!!exameToDelete}
				onClose={() => setExameToDelete(null)}
				onConfirm={handleDeleteExame}
				isLoading={deleteExameMutation.isPending}
			/>
		</>
	);
} 
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ColumnDef, SortingState, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Anamnese } from "@/types/api";
import { DataTable } from "./components/data-table";
import { DataTablePagination } from "./components/table-pagination";
import { AnamneseDetailsModal } from "./components/anamnese-details-modal";
import { DeleteAnamneseDialog } from "./components/delete-anamnese-dialog";
import { Edit, Trash2, Loader2, Search, X, Eye } from "lucide-react";
import { useAnamneses, useDeleteAnamnese } from "@/hooks/useAnamnese";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { checkAnamneseRelations } from "@/services/anamnese.service";

export default function AnamneseTable() {
	const navigate = useNavigate();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [selectedAnamnese, setSelectedAnamnese] = useState<Anamnese | null>(null);
	const [anamneseToDelete, setAnamneseToDelete] = useState<Anamnese | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [appliedFilter, setAppliedFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [hasRelatedRecords, setHasRelatedRecords] = useState(false);

	// Buscar anamneses da API
	const { data: anamnesesData, isLoading, error, refetch } = useAnamneses({
		page: currentPage,
		limit: pageSize,
		filters: {
			pacienteNome: appliedFilter || undefined,
		}
	});

	// Debug: Log dos dados recebidos
	console.log('🔍 [AnamneseTable] Dados recebidos:', {
		anamnesesData,
		isLoading,
		error,
		currentPage,
		pageSize,
		appliedFilter
	});

	const anamneses = anamnesesData?.data || [];

	// Debug: Log das anamneses processadas
	console.log('🔍 [AnamneseTable] Anamneses processadas:', anamneses);
	console.log('🔍 [AnamneseTable] Paginação:', anamnesesData?.pagination);

	// Hook para deletar anamnese
	const deleteAnamneseMutation = useDeleteAnamnese();

	// Verificar relações da anamnese antes de mostrar o diálogo
	const handleDeleteClick = useCallback(async (anamnese: Anamnese) => {
		try {
			const relations = await checkAnamneseRelations(anamnese.id);
			setHasRelatedRecords(relations.hasRelations);
			setAnamneseToDelete(anamnese);
		} catch {
			// Se não conseguir verificar, assume que tem relações por segurança
			setHasRelatedRecords(true);
			setAnamneseToDelete(anamnese);
		}
	}, []);

	const handleDeleteAnamnese = async () => {
		if (anamneseToDelete) {
			try {
				await deleteAnamneseMutation.mutateAsync(anamneseToDelete.id);
				setAnamneseToDelete(null);
				setHasRelatedRecords(false);
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

	const columns: ColumnDef<Anamnese>[] = [
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
			accessorKey: "campos.queixaPrincipal",
			header: "Queixa Principal",
			size: 250,
			cell: ({ row }) => {
				const campos = row.original.campos;
				const queixa = campos?.queixaPrincipal;
				return queixa?.length > 50 ? `${queixa.substring(0, 50)}...` : queixa || "";
			},
		},
		{
			accessorKey: "campos.hipoteseDiagnostica",
			header: "Hipótese Diagnóstica",
			size: 200,
			cell: ({ row }) => {
				const campos = row.original.campos;
				const hipotese = campos?.hipoteseDiagnostica;
				return hipotese?.length > 40 ? `${hipotese.substring(0, 40)}...` : hipotese || "";
			},
		},
		{
			accessorKey: "campos.conduta",
			header: "Conduta",
			size: 150,
			cell: ({ row }) => {
				const campos = row.original.campos;
				const conduta = campos?.conduta;
				return conduta?.length > 30 ? `${conduta.substring(0, 30)}...` : conduta || "";
			},
		},
		{
			id: "actions",
			size: 160,
			cell: ({ row }) => {
				const anamnese = row.original;

				return (
					<div className="flex items-center gap-2">
						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => setSelectedAnamnese(anamnese)}
							title="Visualizar detalhes"
						>
							<span className="sr-only">Visualizar</span>
							<Eye className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => {
								navigate(`/anamnese/novo?id=${anamnese.id}`);
							}}
							title="Editar anamnese"
						>
							<span className="sr-only">Editar</span>
							<Edit className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-red-500 hover:text-red-700"
							onClick={() => handleDeleteClick(anamnese)}
							disabled={deleteAnamneseMutation.isPending}
							title="Excluir anamnese"
						>
							<span className="sr-only">Excluir</span>
							{deleteAnamneseMutation.isPending ? (
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
		data: anamneses,
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
		pageCount: anamnesesData?.pagination?.totalPages || 0,
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
						Erro ao carregar anamneses
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
						placeholder="Filtrar anamneses..."
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
								<span>Carregando anamneses...</span>
							</div>
						</div>
					) : (
						<DataTable table={table} />
					)}
				</div>
				<DataTablePagination table={table} />
			</div>

			<AnamneseDetailsModal
				anamnese={selectedAnamnese}
				isOpen={!!selectedAnamnese}
				onClose={() => setSelectedAnamnese(null)}
			/>

			<DeleteAnamneseDialog
				anamnese={anamneseToDelete}
				isOpen={!!anamneseToDelete}
				onClose={() => {
					setAnamneseToDelete(null);
					setHasRelatedRecords(false);
				}}
				onConfirm={handleDeleteAnamnese}
				isLoading={deleteAnamneseMutation.isPending}
				hasRelatedRecords={hasRelatedRecords}
			/>
		</>
	);
} 
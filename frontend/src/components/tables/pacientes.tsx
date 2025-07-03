import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ColumnDef, SortingState, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Paciente } from "./types/paciente";
import { DataTable } from "./components/data-table";
import { DataTablePagination } from "./components/table-pagination";
import { CopyableCell } from "./components/copyable-cell";
import { PacienteDetailsModal } from "./components/paciente-details-modal";
import { DeletePacienteDialog } from "./components/delete-paciente-dialog";
import { HistoricoPacienteModal } from "./components/historico-paciente-modal";
import { calcularIdade } from "@/lib/utils";
import { Eye, Edit, Trash2, Loader2, Search, X, History } from "lucide-react";
import { usePacientes, useDeletePaciente } from "@/hooks/usePacientes";
import { checkPacienteRelations } from "@/services/paciente.service";

export default function PacientesTable() {
	const navigate = useNavigate();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
	const [pacienteToDelete, setPacienteToDelete] = useState<Paciente | null>(null);
	const [pacienteHistorico, setPacienteHistorico] = useState<Paciente | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [appliedFilter, setAppliedFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [hasRelatedRecords, setHasRelatedRecords] = useState(false);

	// Buscar pacientes da API
	const { data: pacientesData, isLoading, error, refetch } = usePacientes({
		page: currentPage,
		limit: pageSize,
		filters: {
			nome: appliedFilter || undefined,
		}
	});

	// Hook para deletar paciente
	const deletePacienteMutation = useDeletePaciente();

	// Verificar relações do paciente antes de mostrar o diálogo
	const handleDeleteClick = useCallback(async (paciente: Paciente) => {
		try {
			const relations = await checkPacienteRelations(paciente.id);
			setHasRelatedRecords(relations.hasRelations);
			setPacienteToDelete(paciente);
		} catch {
			// Se não conseguir verificar, assume que tem relações por segurança
			setHasRelatedRecords(true);
			setPacienteToDelete(paciente);
		}
	}, []);

	const handleDeletePaciente = async (cascade: boolean = false) => {
		if (pacienteToDelete) {
			try {
				await deletePacienteMutation.mutateAsync({ id: pacienteToDelete.id, cascade });
				setPacienteToDelete(null);
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

	const pacientes = pacientesData?.data || [];

	const columns: ColumnDef<Paciente>[] = [
		{
			accessorKey: "nome",
			header: "Nome",
			size: 200,
		},
		{
			accessorKey: "dataNascimento",
			header: "Nascimento",
			size: 150,
			cell: ({ row }) => {
				const data = row.getValue("dataNascimento") as string;
				if (!data) return "";
				return new Date(data).toLocaleDateString('pt-BR');
			},
		},
		{
			accessorKey: "idade",
			header: "Idade",
			size: 100,
			cell: ({ row }) => {
				const dataNascimento = row.getValue("dataNascimento") as string;
				if (!dataNascimento) return "";
				return `${calcularIdade(dataNascimento)} anos`;
			},
		},
		{
			accessorKey: "telefone",
			header: "Telefone",
			size: 150,
			cell: ({ row }) => <CopyableCell value={row.getValue("telefone")} />,
		},
		{
			accessorKey: "convenioNome",
			header: "Convênio",
			size: 150,
			cell: ({ row }) => {
				return row.original.convenioNome || "";
			},
		},
		{
			accessorKey: "convenioPlano",
			header: "Plano",
			size: 150,
			cell: ({ row }) => {
				return row.original.convenioPlano || "";
			},
		},
		{
			accessorKey: "cidade",
			header: "Cidade",
			size: 150,
			cell: ({ row }) => {
				return row.original.cidade || "";
			},
		},
		{
			id: "actions",
			size: 160,
			cell: ({ row }) => {
				const paciente = row.original;

				return (
					<div className="flex items-center gap-2">
						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => setSelectedPaciente(paciente)}
							title="Visualizar detalhes"
						>
							<span className="sr-only">Visualizar</span>
							<Eye className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => setPacienteHistorico(paciente)}
							title="Ver histórico"
						>
							<span className="sr-only">Histórico</span>
							<History className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => {
								navigate(`/pacientes/novo?id=${paciente.id}`);
							}}
							title="Editar paciente"
						>
							<span className="sr-only">Editar</span>
							<Edit className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-red-500 hover:text-red-700"
							onClick={() => handleDeleteClick(paciente)}
							disabled={deletePacienteMutation.isPending}
							title="Excluir paciente"
						>
							<span className="sr-only">Excluir</span>
							{deletePacienteMutation.isPending ? (
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
		data: pacientes,
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
		pageCount: pacientesData?.pagination?.totalPages || 0,
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
						Erro ao carregar pacientes
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
						placeholder="Filtrar pacientes..."
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
								<span>Carregando pacientes...</span>
							</div>
						</div>
					) : (
						<DataTable table={table} />
					)}
				</div>
				<DataTablePagination table={table} />
			</div>

			<PacienteDetailsModal
				paciente={selectedPaciente}
				isOpen={!!selectedPaciente}
				onClose={() => setSelectedPaciente(null)}
			/>

			<HistoricoPacienteModal
				isOpen={!!pacienteHistorico}
				onClose={() => setPacienteHistorico(null)}
				pacienteId={pacienteHistorico?.id || ""}
			/>

			<DeletePacienteDialog
				paciente={pacienteToDelete}
				isOpen={!!pacienteToDelete}
				onClose={() => {
					setPacienteToDelete(null);
					setHasRelatedRecords(false);
				}}
				onConfirm={handleDeletePaciente}
				isLoading={deletePacienteMutation.isPending}
				hasRelatedRecords={hasRelatedRecords}
			/>
		</>
	);
}
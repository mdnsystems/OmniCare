import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { ColumnDef, SortingState, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { toast } from "sonner";
import { Prontuario, TipoProntuario } from "@/types/api";
import { DataTable } from "./components/data-table";
import { DataTablePagination } from "./components/table-pagination";
import { Badge } from "../ui/badge";
import { Eye, Edit, Trash2, FileText, Calendar, User } from "lucide-react";
import { ProntuarioView } from "../prontuario-view";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Download, Plus, Stethoscope } from "lucide-react";
import { useProntuarios } from "@/hooks/useProntuarios";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const getTipoProntuarioColor = (tipo: string) => {
	switch (tipo) {
		case "CONSULTA":
			return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
		case "RETORNO":
			return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
		case "EXAME":
			return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
		case "PROCEDIMENTO":
			return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
		case "DOCUMENTO":
			return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
		default:
			return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
	}
};

export function ProntuariosTable() {
	const navigate = useNavigate();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [selectedProntuario, setSelectedProntuario] = useState<Prontuario | null>(null);
	const [prontuarioToDelete, setProntuarioToDelete] = useState<Prontuario | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [tipoFilter, setTipoFilter] = useState<string>("all");

	const { data: prontuariosData = [], isLoading, error } = useProntuarios();

	// Filtrar dados baseado nos filtros - memoizado para evitar recálculos desnecessários
	const filteredData = useMemo(() => {
		// Garantir que prontuariosData seja sempre um array
		const data = Array.isArray(prontuariosData) ? prontuariosData : [];
		
		return data.filter((prontuario: Prontuario) => {
			const matchesSearch = 
				prontuario.paciente?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				prontuario.profissional?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				prontuario.id?.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesTipo = tipoFilter === "all" || prontuario.tipo === tipoFilter;

			return matchesSearch && matchesTipo;
		});
	}, [prontuariosData, searchTerm, tipoFilter]);

	// Estatísticas memoizadas
	const { totalProntuarios, consultas, retornos } = useMemo(() => {
		const total = filteredData.length;
		const consultasCount = filteredData.filter((p: Prontuario) => p.tipo === 'CONSULTA').length;
		const retornosCount = filteredData.filter((p: Prontuario) => p.tipo === 'RETORNO').length;
		
		return {
			totalProntuarios: total,
			consultas: consultasCount,
			retornos: retornosCount
		};
	}, [filteredData]);

	const handleDeleteProntuario = useCallback(() => {
		if (prontuarioToDelete) {
			// Aqui você implementaria a chamada para deletar o prontuário
			toast.success(`Prontuário excluído com sucesso!`);
			setProntuarioToDelete(null);
		}
	}, [prontuarioToDelete]);

	const handleViewProntuario = useCallback((prontuario: Prontuario) => {
		setSelectedProntuario(prontuario);
	}, []);

	const handleEditProntuario = useCallback((prontuarioId: string) => {
		navigate(`/prontuarios/novo?id=${prontuarioId}`);
	}, [navigate]);

	const handleDeleteClick = useCallback((prontuario: Prontuario) => {
		setProntuarioToDelete(prontuario);
	}, []);

	const handleCloseView = useCallback(() => {
		setSelectedProntuario(null);
	}, []);

	const columns: ColumnDef<Prontuario>[] = useMemo(() => [
		{
			accessorKey: "paciente.nome",
			header: "Paciente",
			size: 200,
			cell: ({ row }) => {
				const paciente = row.original.paciente;
				return (
					<div className="flex items-center gap-2">
						<User className="h-4 w-4 text-muted-foreground" />
						<span>{paciente?.nome || "N/A"}</span>
					</div>
				);
			},
		},
		{
			accessorKey: "profissional.nome",
			header: "Profissional",
			size: 200,
			cell: ({ row }) => {
				const profissional = row.original.profissional;
				return (
					<div className="flex items-center gap-2">
						<User className="h-4 w-4 text-muted-foreground" />
						<span>{profissional?.nome || "N/A"}</span>
					</div>
				);
			},
		},
		{
			accessorKey: "data",
			header: "Data",
			size: 150,
			cell: ({ row }) => {
				const data = row.getValue("data") as string;
				if (!data) return "";
				return (
					<div className="flex items-center gap-2">
						<Calendar className="h-4 w-4 text-muted-foreground" />
						<span>{new Date(data).toLocaleDateString('pt-BR')}</span>
					</div>
				);
			},
		},
		{
			accessorKey: "tipo",
			header: "Tipo",
			size: 150,
			cell: ({ row }) => {
				const tipo = row.getValue("tipo") as string;
				return (
					<Badge className={getTipoProntuarioColor(tipo)}>
						{tipo}
					</Badge>
				);
			},
		},
		{
			accessorKey: "descricao",
			header: "Descrição",
			size: 300,
			cell: ({ row }) => {
				const descricao = row.getValue("descricao") as string;
				return (
					<div className="max-w-[280px] truncate" title={descricao}>
						{descricao}
					</div>
				);
			},
		},
		{
			accessorKey: "diagnostico",
			header: "Diagnóstico",
			size: 200,
			cell: ({ row }) => {
				const diagnostico = row.getValue("diagnostico") as string;
				return (
					<div className="max-w-[180px] truncate" title={diagnostico}>
						{diagnostico || "Não informado"}
					</div>
				);
			},
		},
		{
			id: "actions",
			size: 120,
			cell: ({ row }) => {
				const prontuario = row.original;

				return (
					<div className="flex items-center gap-2">
						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => handleViewProntuario(prontuario)}
							title="Visualizar prontuário"
						>
							<span className="sr-only">Visualizar</span>
							<Eye className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => handleEditProntuario(prontuario.id)}
							title="Editar prontuário"
						>
							<span className="sr-only">Editar</span>
							<Edit className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-red-500 hover:text-red-700"
							onClick={() => handleDeleteClick(prontuario)}
							title="Excluir prontuário"
						>
							<span className="sr-only">Excluir</span>
							<Trash2 className="h-4 w-4" />
						</button>
					</div>
				);
			},
		},
	], [handleViewProntuario, handleEditProntuario, handleDeleteClick]);

	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
			globalFilter,
		},
		onGlobalFilterChange: setGlobalFilter,
	});

	// Renderização condicional após todos os hooks
	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="h-24 bg-gray-200 rounded"></div>
						))}
					</div>
					<div className="h-96 bg-gray-200 rounded"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center text-red-600">
				Erro ao carregar dados de prontuários
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Cards de Resumo */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total de Prontuários</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalProntuarios}</div>
						<p className="text-xs text-muted-foreground">
							Prontuários cadastrados
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Consultas</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">{consultas}</div>
						<p className="text-xs text-muted-foreground">
							{totalProntuarios > 0 ? ((consultas / totalProntuarios) * 100).toFixed(1) : 0}% do total
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Retornos</CardTitle>
						<Stethoscope className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{retornos}</div>
						<p className="text-xs text-muted-foreground">
							{totalProntuarios > 0 ? ((retornos / totalProntuarios) * 100).toFixed(1) : 0}% do total
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filtros e Ações */}
			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
						<div className="flex flex-col sm:flex-row gap-4 flex-1">
							<div className="relative flex-1 max-w-sm">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Buscar prontuário..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-8"
								/>
							</div>
							<Select value={tipoFilter} onValueChange={setTipoFilter}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Todos os tipos" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todos os tipos</SelectItem>
									<SelectItem value={TipoProntuario.CONSULTA}>Consulta</SelectItem>
									<SelectItem value={TipoProntuario.RETORNO}>Retorno</SelectItem>
									<SelectItem value={TipoProntuario.AVALIACAO}>Avaliação</SelectItem>
									<SelectItem value={TipoProntuario.PROCEDIMENTO}>Procedimento</SelectItem>
									<SelectItem value={TipoProntuario.EXAME}>Exame</SelectItem>
									<SelectItem value={TipoProntuario.DOCUMENTO}>Documento</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex gap-2">
							<Button variant="outline" size="sm">
								<Download className="h-4 w-4 mr-2" />
								Exportar
							</Button>
							<Button size="sm" onClick={() => navigate("/prontuarios/novo")}>
								<Plus className="h-4 w-4 mr-2" />
								Novo Prontuário
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<DataTable columns={columns} data={filteredData} />
					<DataTablePagination table={table} />
				</CardContent>
			</Card>

			{/* Modal de Visualização */}
			<ProntuarioView
				prontuario={selectedProntuario}
				isOpen={!!selectedProntuario}
				onClose={handleCloseView}
			/>

			{/* Alert Dialog para Exclusão */}
			<AlertDialog open={!!prontuarioToDelete} onOpenChange={() => setProntuarioToDelete(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
						<AlertDialogDescription>
							Tem certeza que deseja excluir o prontuário de{" "}
							<strong>{prontuarioToDelete?.paciente?.nome}</strong>?
							<br />
							Esta ação não pode ser desfeita.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteProntuario}
							className="bg-red-500 hover:bg-red-600"
						>
							Excluir
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
} 
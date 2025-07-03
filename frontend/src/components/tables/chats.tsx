import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ColumnDef, SortingState, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Chat } from "./types/chat";
import { DataTable } from "./components/data-table";
import { DataTablePagination } from "./components/table-pagination";
import { CopyableCell } from "./components/copyable-cell";
import { ChatDetailsModal } from "./components/chat-details-modal";
import { DeleteChatDialog } from "./components/delete-chat-dialog";
import { MessageSquare, Users, Edit, Trash2, Loader2, Search, X, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import { useChats, useDeleteChat } from "@/hooks/useChats";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ChatsTable() {
	const navigate = useNavigate();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
	const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [appliedFilter, setAppliedFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	// Buscar chats da API
	const { data: chatsData, isLoading, error, refetch } = useChats({
		page: currentPage,
		limit: pageSize,
		filters: {
			titulo: appliedFilter || undefined,
		}
	});

	// Hook para deletar chat
	const deleteChatMutation = useDeleteChat();

	const handleDeleteChat = async () => {
		if (chatToDelete) {
			try {
				await deleteChatMutation.mutateAsync(chatToDelete.id);
				setChatToDelete(null);
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

	const chats = chatsData?.data || [];

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'ATIVO':
				return <Badge variant="outline" className="text-green-600 border-green-600">Ativo</Badge>;
			case 'ARQUIVADO':
				return <Badge variant="outline" className="text-gray-600 border-gray-600">Arquivado</Badge>;
			case 'FECHADO':
				return <Badge variant="outline" className="text-red-600 border-red-600">Fechado</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const getTipoBadge = (tipo: string) => {
		switch (tipo) {
			case 'GRUPO':
				return <Badge className="bg-blue-500 text-white">Grupo</Badge>;
			case 'PRIVADO':
				return <Badge className="bg-purple-500 text-white">Privado</Badge>;
			case 'SUPORTE':
				return <Badge className="bg-orange-500 text-white">Suporte</Badge>;
			default:
				return <Badge variant="outline">{tipo}</Badge>;
		}
	};

	const columns: ColumnDef<Chat>[] = [
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
			accessorKey: "tipo",
			header: "Tipo",
			size: 120,
			cell: ({ row }) => {
				const tipo = row.getValue("tipo") as string;
				return getTipoBadge(tipo);
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
			accessorKey: "participantes",
			header: "Participantes",
			size: 120,
			cell: ({ row }) => {
				const participantes = row.original.participantes;
				return participantes ? participantes.length : 0;
			},
		},
		{
			accessorKey: "mensagens",
			header: "Mensagens",
			size: 120,
			cell: ({ row }) => {
				const mensagens = row.original.mensagens;
				return mensagens ? mensagens.length : 0;
			},
		},
		{
			accessorKey: "criador.nome",
			header: "Criado por",
			size: 150,
			cell: ({ row }) => {
				const criador = row.original.criador;
				return criador?.nome || "";
			},
		},
		{
			accessorKey: "createdAt",
			header: "Criado em",
			size: 120,
			cell: ({ row }) => {
				const data = row.getValue("createdAt") as string;
				if (!data) return "";
				return format(parseISO(data), "dd/MM/yyyy", { locale: ptBR });
			},
		},
		{
			id: "actions",
			size: 160,
			cell: ({ row }) => {
				const chat = row.original;

				return (
					<div className="flex items-center gap-2">
						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => setSelectedChat(chat)}
							title="Visualizar detalhes"
						>
							<span className="sr-only">Visualizar</span>
							<Eye className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => {
								navigate(`/chat/${chat.id}`);
							}}
							title="Abrir chat"
						>
							<span className="sr-only">Abrir</span>
							<MessageSquare className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							onClick={() => {
								navigate(`/chat/editar/${chat.id}`);
							}}
							title="Editar chat"
						>
							<span className="sr-only">Editar</span>
							<Edit className="h-4 w-4" />
						</button>

						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-red-500 hover:text-red-700"
							onClick={() => setChatToDelete(chat)}
							disabled={deleteChatMutation.isPending}
							title="Excluir chat"
						>
							<span className="sr-only">Excluir</span>
							{deleteChatMutation.isPending ? (
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
		data: chats,
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
		pageCount: chatsData?.pagination?.totalPages || 0,
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
						Erro ao carregar chats
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
						placeholder="Filtrar chats..."
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
								<span>Carregando chats...</span>
							</div>
						</div>
					) : (
						<DataTable table={table} />
					)}
				</div>
				<DataTablePagination table={table} />
			</div>

			<ChatDetailsModal
				chat={selectedChat}
				isOpen={!!selectedChat}
				onClose={() => setSelectedChat(null)}
			/>

			<DeleteChatDialog
				chat={chatToDelete}
				isOpen={!!chatToDelete}
				onClose={() => setChatToDelete(null)}
				onConfirm={handleDeleteChat}
				isLoading={deleteChatMutation.isPending}
			/>
		</>
	);
} 
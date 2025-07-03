import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef, SortingState, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Search, X, Loader2 } from "lucide-react";
import { Profissional } from "./types/profissional";
import { ProfissionalStatus } from "@/types/api";
import { DataTable } from "./components/data-table";
import { DataTablePagination } from "./components/table-pagination";
import { CopyableCell } from "./components/copyable-cell";
import { ProfissionalDetailsModal } from "./components/profissional-details-modal";
import { DeleteProfissionalDialog } from "./components/delete-profissional-dialog";
import { cn } from "@/lib/utils";
import { useProfissionais, useDeleteProfissional } from "@/hooks/useProfissionais";
import { checkProfissionalRelations } from "@/services/profissional.service";

export default function ProfissionaisTable() {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedProfissional, setSelectedProfissional] = useState<Profissional | null>(null);
  const [profissionalToDelete, setProfissionalToDelete] = useState<Profissional | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasRelatedRecords, setHasRelatedRecords] = useState(false);

  // Queries e mutations
  const { data: profissionaisData, isLoading, error, refetch } = useProfissionais({
    page: currentPage,
    limit: pageSize,
    filters: {
      nome: appliedFilter || undefined,
    }
  });
  const deleteProfissionalMutation = useDeleteProfissional();

  // Verificar relações do profissional antes de mostrar o diálogo
  const handleDeleteClick = useCallback(async (profissional: Profissional) => {
    try {
      const relations = await checkProfissionalRelations(profissional.id);
      setHasRelatedRecords(relations.hasRelations);
      setProfissionalToDelete(profissional);
    } catch {
      // Se não conseguir verificar, assume que tem relações por segurança
      setHasRelatedRecords(true);
      setProfissionalToDelete(profissional);
    }
  }, []);

  const handleDeleteProfissional = async () => {
    if (!profissionalToDelete) return;

    try {
      await deleteProfissionalMutation.mutateAsync(profissionalToDelete.id);
      setProfissionalToDelete(null);
      setHasRelatedRecords(false);
    } catch (error) {
      console.error('Erro ao excluir profissional:', error);
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

  const profissionais = profissionaisData?.data || [];

  const getStatusColor = (status: ProfissionalStatus) => {
    switch (status) {
      case ProfissionalStatus.ATIVO:
        return 'bg-lime-100 dark:bg-lime-900/30 dark:text-lime-400 text-lime-700 border-lime-200 dark:border-lime-800';
      case ProfissionalStatus.INATIVO:
        return 'bg-red-100 dark:bg-red-900/30 dark:text-red-400 text-red-700 border-red-200 dark:border-red-800';
      case ProfissionalStatus.FERIAS:
        return 'bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 text-blue-700 border-blue-200 dark:border-blue-800';
      case ProfissionalStatus.LICENCA:
        return 'bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 text-yellow-700 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400 text-gray-700 border-gray-200 dark:border-gray-800';
    }
  };

  const columns: ColumnDef<Profissional>[] = [
    {
      accessorKey: "nome",
      header: "Nome",
      size: 200,
    },
    {
      accessorKey: "crm",
      header: "CRM",
      size: 120,
    },
    {
      accessorKey: "telefone",
      header: "Telefone",
      size: 150,
      cell: ({ row }) => <CopyableCell value={row.getValue("telefone")} />,
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 200,
    },
    {
      accessorKey: "cidade",
      header: "Cidade",
      size: 150,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 120,
      cell: ({ row }) => {
        const status = row.getValue("status") as ProfissionalStatus;
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
      size: 120,
      cell: ({ row }) => {
        const profissional = row.original;

        return (
          <div className="flex items-center gap-2">
            <button
              className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => setSelectedProfissional(profissional)}
              title="Visualizar detalhes"
            >
              <span className="sr-only">Visualizar</span>
              <Eye className="h-4 w-4" />
            </button>

            <button
              className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => {
                navigate(`/profissionais/novo?id=${profissional.id}`);
              }}
              title="Editar profissional"
            >
              <span className="sr-only">Editar</span>
              <Edit className="h-4 w-4" />
            </button>

            <button
              className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-red-500 hover:text-red-700"
              onClick={() => handleDeleteClick(profissional)}
              disabled={deleteProfissionalMutation.isPending}
              title="Excluir profissional"
            >
              <span className="sr-only">Excluir</span>
              {deleteProfissionalMutation.isPending ? (
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
    data: profissionais,
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
    pageCount: profissionaisData?.pagination?.totalPages || 0,
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
            Erro ao carregar profissionais
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
            placeholder="Filtrar profissionais..."
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
                <span>Carregando profissionais...</span>
              </div>
            </div>
          ) : (
            <DataTable table={table} />
          )}
        </div>
        <DataTablePagination table={table} />
      </div>

      <ProfissionalDetailsModal
        profissional={selectedProfissional}
        isOpen={!!selectedProfissional}
        onClose={() => setSelectedProfissional(null)}
      />

      <DeleteProfissionalDialog
        profissional={profissionalToDelete}
        isOpen={!!profissionalToDelete}
        onClose={() => {
          setProfissionalToDelete(null);
          setHasRelatedRecords(false);
        }}
        onConfirm={handleDeleteProfissional}
        isLoading={deleteProfissionalMutation.isPending}
        hasRelatedRecords={hasRelatedRecords}
      />
    </>
  );
} 
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColumnDef, SortingState, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Especialidade } from "@/types/api";
import { DataTable } from "./components/data-table";
import { DataTablePagination } from "./components/table-pagination";
import { Edit, Trash2, Search, X, Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useEspecialidades, useDeleteEspecialidade } from "@/hooks/useEspecialidades";

export default function EspecialidadesTable() {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [especialidadeToDelete, setEspecialidadeToDelete] = useState<Especialidade | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Buscar especialidades da API
  const { data: especialidadesData, isLoading, error, refetch } = useEspecialidades({
    page: currentPage,
    limit: pageSize,
    filters: {
      nome: appliedFilter || undefined,
    }
  });

  // Hook para deletar especialidade
  const deleteEspecialidadeMutation = useDeleteEspecialidade();

  const handleDeleteEspecialidade = async () => {
    if (especialidadeToDelete) {
      try {
        await deleteEspecialidadeMutation.mutateAsync(especialidadeToDelete.id);
        setEspecialidadeToDelete(null);
        toast.success(`Especialidade "${especialidadeToDelete.nome}" excluída com sucesso!`);
      } catch (error: any) {
        console.error("Erro ao excluir especialidade:", error);
        
        // Tratar erros específicos
        if (error.response?.status === 409) {
          toast.error("Não é possível excluir esta especialidade. Ela está sendo usada por profissionais.");
        } else if (error.response?.status === 404) {
          toast.error("Especialidade não encontrada.");
        } else {
          toast.error("Erro ao excluir especialidade. Tente novamente.");
        }
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

  const especialidades = especialidadesData?.data || [];

  const columns: ColumnDef<Especialidade>[] = [
    {
      accessorKey: "nome",
      header: "Nome",
      size: 200,
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      size: 300,
    },
    {
      accessorKey: "createdAt",
      header: "Data de Criação",
      size: 150,
      cell: ({ row }) => {
        const dataString = row.getValue("createdAt") as string;
        try {
          const data = new Date(dataString);
          return format(data, "dd/MM/yyyy", { locale: ptBR });
        } catch {
          return "Data inválida";
        }
      },
    },
    {
      id: "actions",
      size: 120,
      cell: ({ row }) => {
        const especialidade = row.original;

        return (
          <div className="flex items-center gap-2">
            <button
              className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => {
                navigate(`/profissionais/especialidades/nova?id=${especialidade.id}`);
              }}
              title="Editar especialidade"
            >
              <span className="sr-only">Editar</span>
              <Edit className="h-4 w-4" />
            </button>
          
            <button
              className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-red-500 hover:text-red-700"
              onClick={() => setEspecialidadeToDelete(especialidade)}
              disabled={deleteEspecialidadeMutation.isPending}
              title="Excluir especialidade"
            >
              <span className="sr-only">Excluir</span>
              {deleteEspecialidadeMutation.isPending ? (
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
    data: especialidades,
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
    pageCount: especialidadesData?.pagination?.totalPages || 0,
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
            Erro ao carregar especialidades
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
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filtrar especialidades..."
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
              size="sm"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
              Filtrar
            </Button>
            {(searchTerm || appliedFilter) && (
              <Button
                onClick={handleClearFilter}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>
          <Button onClick={() => navigate("/profissionais/especialidades/nova")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Especialidade
          </Button>
        </div>
        <div className="flex-1 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Carregando especialidades...</span>
              </div>
            </div>
          ) : (
            <DataTable table={table} />
          )}
        </div>
        <DataTablePagination table={table} />
      </div>

      {/* Alert Dialog de confirmação de exclusão */}
      <ConfirmDialog
        open={!!especialidadeToDelete}
        onOpenChange={(open) => !open && setEspecialidadeToDelete(null)}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir a especialidade "${especialidadeToDelete?.nome}"?\n\nEsta ação não pode ser desfeita.`}
        confirmText="Excluir"
        onConfirm={handleDeleteEspecialidade}
        variant="destructive"
        isLoading={deleteEspecialidadeMutation.isPending}
      />
    </>
  );
} 
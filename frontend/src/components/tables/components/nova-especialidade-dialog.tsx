import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Edit } from "lucide-react";
import { toast } from "sonner";
import { Especialidade } from "@/types/api";

interface NovaEspecialidadeDialogProps {
  onEspecialidadeCreated?: (especialidade: Especialidade) => void;
  onEspecialidadeUpdated?: (especialidade: Especialidade) => void;
  especialidadeToEdit?: Especialidade | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NovaEspecialidadeDialog({ 
  onEspecialidadeCreated, 
  onEspecialidadeUpdated,
  especialidadeToEdit,
  open: externalOpen,
  onOpenChange: externalOnOpenChange
}: NovaEspecialidadeDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
  });

  // Determinar se é modo de edição ou criação
  const isEditMode = !!especialidadeToEdit;
  
  // Controlar estado do modal (interno ou externo)
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  // Preencher formulário quando especialidade para edição for fornecida
  useEffect(() => {
    if (especialidadeToEdit) {
      setFormData({
        nome: especialidadeToEdit.nome,
        descricao: especialidadeToEdit.descricao,
      });
    } else {
      setFormData({ nome: "", descricao: "" });
    }
  }, [especialidadeToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast.error("Nome da especialidade é obrigatório");
      return;
    }

    if (!formData.descricao.trim()) {
      toast.error("Descrição da especialidade é obrigatória");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode && especialidadeToEdit) {
        // Modo de edição
        const especialidadeAtualizada: Especialidade = {
          ...especialidadeToEdit,
          nome: formData.nome.trim(),
          descricao: formData.descricao.trim(),
          updatedAt: new Date().toISOString(),
        };

        // Aqui você faria a chamada para a API
        // await updateEspecialidade(especialidadeAtualizada);

        toast.success("Especialidade atualizada com sucesso!");
        
        // Callback para atualizar a tabela
        onEspecialidadeUpdated?.(especialidadeAtualizada);
      } else {
        // Modo de criação
        const novaEspecialidade: Especialidade = {
          id: crypto.randomUUID(),
          tenantId: "clinica-1", // TODO: Pegar do contexto da clínica
          nome: formData.nome.trim(),
          descricao: formData.descricao.trim(),
          tipoClinica: "MEDICA", // TODO: Permitir seleção
          configuracoes: {
            camposObrigatorios: [],
            templatesDisponiveis: [],
            relatoriosDisponiveis: [],
            dashboardsDisponiveis: []
          },
          templates: [],
          fluxos: [],
          ativo: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Aqui você faria a chamada para a API
        // await createEspecialidade(novaEspecialidade);

        toast.success("Especialidade criada com sucesso!");
        
        // Callback para atualizar a tabela
        onEspecialidadeCreated?.(novaEspecialidade);
      }
      
      // Limpar formulário
      setFormData({ nome: "", descricao: "" });
      
      // Fechar modal
      setOpen(false);
      
    } catch (error) {
      toast.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} especialidade. Tente novamente.`);
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} especialidade:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      setOpen(newOpen);
      if (!newOpen) {
        // Limpar formulário ao fechar
        setFormData({ nome: "", descricao: "" });
      }
    }
  };

  // Se for modo de edição controlado externamente, não renderizar o trigger
  if (isEditMode && externalOpen !== undefined) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Editar Especialidade
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Atualize os dados da especialidade médica.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">
                  Nome da Especialidade *
                </Label>
                <Input
                  id="nome"
                  placeholder="Ex: Cardiologia, Nutrição, Pediatria..."
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  disabled={loading}
                  className="h-10"
                  maxLength={100}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-sm font-medium">
                  Descrição *
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva brevemente o foco e atuação desta especialidade..."
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  disabled={loading}
                  className="min-h-[100px] resize-none"
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formData.descricao.length}/500 caracteres
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Atualizar Especialidade
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Modo de criação (com trigger)
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Especialidade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Nova Especialidade
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha os dados para criar uma nova especialidade médica.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium">
                Nome da Especialidade *
              </Label>
              <Input
                id="nome"
                placeholder="Ex: Cardiologia, Nutrição, Pediatria..."
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                disabled={loading}
                className="h-10"
                maxLength={100}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-sm font-medium">
                Descrição *
              </Label>
              <Textarea
                id="descricao"
                placeholder="Descreva brevemente o foco e atuação desta especialidade..."
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                disabled={loading}
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right">
                {formData.descricao.length}/500 caracteres
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Especialidade
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
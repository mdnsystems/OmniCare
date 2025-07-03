"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Stethoscope, 
  Save, 
  X,
  Loader2
} from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { especialidadeSchema, type EspecialidadeFormValues } from "./schema/especialidade";
import { useEspecialidade, useCreateEspecialidade, useUpdateEspecialidade } from "@/hooks/useEspecialidades";

export function EspecialidadeForm() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Buscar especialidade se estiver editando
  const { data: especialidade, isLoading: isLoadingEspecialidade } = useEspecialidade(id || "");

  // Hooks para criar/atualizar especialidade
  const createEspecialidadeMutation = useCreateEspecialidade();
  const updateEspecialidadeMutation = useUpdateEspecialidade();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EspecialidadeFormValues>({
    resolver: zodResolver(especialidadeSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      tipoClinica: "MEDICA",
    },
  });

  // Preencher formulário com dados da especialidade quando carregar
  useEffect(() => {
    if (especialidade && !isEditing) {
      console.log('Dados da especialidade carregados:', especialidade);
      
      // Mapear campos do backend para o frontend
      const mappedData = {
        nome: especialidade.nome || "",
        descricao: especialidade.descricao || "",
        tipoClinica: especialidade.tipoClinica || "MEDICA",
      };

      console.log('Dados mapeados:', mappedData);

      // Definir valores no formulário
      Object.entries(mappedData).forEach(([key, value]) => {
        setValue(key as keyof EspecialidadeFormValues, value);
      });
      
      setIsEditing(true);
    }
  }, [especialidade, setValue, isEditing]);

  const onSubmit = async (data: EspecialidadeFormValues) => {
    try {
      if (id) {
        // Atualizar especialidade
        await updateEspecialidadeMutation.mutateAsync({ id, data });
        toast({
          title: "Especialidade atualizada!",
          description: "Dados da especialidade foram atualizados com sucesso.",
        });
      } else {
        // Criar especialidade
        await createEspecialidadeMutation.mutateAsync(data);
        toast({
          title: "Especialidade criada!",
          description: "Especialidade foi criada com sucesso.",
        });
      }
      navigate("/profissionais/especialidades");
    } catch (error: any) {
      console.error('Erro ao salvar especialidade:', error);
      toast({
        title: id ? "Erro ao atualizar especialidade" : "Erro ao criar especialidade",
        description: error.response?.data?.error || "Não foi possível salvar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const isSubmittingForm = isSubmitting || createEspecialidadeMutation.isPending || updateEspecialidadeMutation.isPending;

  if (isLoadingEspecialidade) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando especialidade...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6" />
          {id ? "Editar Especialidade" : "Nova Especialidade"}
        </CardTitle>
        <p className="text-muted-foreground">
          {id ? "Atualize os dados da especialidade" : "Preencha os dados da nova especialidade"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium">
              Nome da Especialidade *
            </Label>
            <Input
              id="nome"
              placeholder="Ex: Cardiologia, Nutrição, Pediatria..."
              {...register("nome")}
              disabled={isSubmittingForm}
              className="h-10"
              maxLength={100}
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoClinica" className="text-sm font-medium">
              Tipo de Clínica *
            </Label>
            <Select 
              value={watch("tipoClinica")} 
              onValueChange={(value) => setValue("tipoClinica", value as any)}
              disabled={isSubmittingForm}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEDICA">Médica</SelectItem>
                <SelectItem value="NUTRICIONAL">Nutricional</SelectItem>
                <SelectItem value="ODONTOLOGICA">Odontológica</SelectItem>
                <SelectItem value="PSICOLOGICA">Psicológica</SelectItem>
                <SelectItem value="FISIOTERAPICA">Fisioterapêutica</SelectItem>
                <SelectItem value="ESTETICA">Estética</SelectItem>
                <SelectItem value="VETERINARIA">Veterinária</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipoClinica && (
              <p className="text-sm text-destructive">{errors.tipoClinica.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao" className="text-sm font-medium">
            Descrição *
          </Label>
          <Textarea
            id="descricao"
            placeholder="Descreva brevemente o foco e atuação desta especialidade..."
            {...register("descricao")}
            disabled={isSubmittingForm}
            className="min-h-[100px] resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            {errors.descricao && (
              <p className="text-sm text-destructive">{errors.descricao.message}</p>
            )}
            <div className="text-xs text-muted-foreground ml-auto">
              {watch("descricao")?.length || 0}/500 caracteres
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmittingForm}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmittingForm}>
            {isSubmittingForm ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {id ? "Atualizando..." : "Criando..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {id ? "Atualizar Especialidade" : "Criar Especialidade"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 
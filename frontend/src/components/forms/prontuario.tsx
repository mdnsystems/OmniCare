"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  FileText, 
  User, 
  Stethoscope, 
  Save, 
  X,
  Calendar
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Prontuario, TipoProntuario } from '@/types/api';

interface ProntuarioFormValues {
  pacienteId: string;
  profissionalId: string;
  data: Date;
  tipo: TipoProntuario;
  descricao: string;
  diagnostico: string;
  prescricao: string;
  observacoes: string;
}

interface Paciente {
  id: string;
  nome: string;
}

interface Profissional {
  id: string;
  nome: string;
  especialidade?: {
    nome: string;
  };
}

export function ProntuarioForm() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Buscar pacientes
  const { data: pacientesData, isLoading: isLoadingPacientes, error: pacientesError } = useQuery({
    queryKey: ['pacientes'],
    queryFn: async () => {
      const response = await api.get('/pacientes');
      // Pacientes retorna {data: [...], pagination: {...}}
      return response.data.data as Paciente[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Garantir que pacientes seja sempre um array
  const pacientes = Array.isArray(pacientesData) ? pacientesData : [];

  // Buscar profissionais
  const { data: profissionaisData, isLoading: isLoadingProfissionais, error: profissionaisError } = useQuery({
    queryKey: ['profissionais'],
    queryFn: async () => {
      const response = await api.get('/profissionais');
      // Profissionais retorna {data: [...], pagination: {...}}
      return response.data.data as Profissional[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Garantir que profissionais seja sempre um array
  const profissionais = Array.isArray(profissionaisData) ? profissionaisData : [];

  // Buscar prontuário se estiver editando
  const { data: prontuario, isLoading: isLoadingProntuario } = useQuery({
    queryKey: ['prontuario', id],
    queryFn: async () => {
      const response = await api.get(`/prontuarios/${id}`);
      return response.data.data as Prontuario;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProntuarioFormValues>({
    defaultValues: {
      pacienteId: "",
      profissionalId: "",
      data: new Date(),
      tipo: TipoProntuario.CONSULTA,
      descricao: "",
      diagnostico: "",
      prescricao: "",
      observacoes: "",
    },
  });

  // Preencher formulário com dados do prontuário quando carregar
  useEffect(() => {
    if (prontuario && !isEditing) {
      console.log('Dados do prontuário carregados:', prontuario);
      
      // Mapear campos do backend para o frontend
      const mappedData = {
        pacienteId: prontuario.pacienteId || "",
        profissionalId: prontuario.profissionalId || "",
        data: prontuario.data ? new Date(prontuario.data) : new Date(),
        tipo: prontuario.tipo || TipoProntuario.CONSULTA,
        descricao: prontuario.descricao || "",
        diagnostico: prontuario.diagnostico || "",
        prescricao: prontuario.prescricao || "",
        observacoes: prontuario.observacoes || "",
      };

      console.log('Dados mapeados:', mappedData);

      // Definir valores no formulário
      Object.entries(mappedData).forEach(([key, value]) => {
        setValue(key as keyof ProntuarioFormValues, value);
      });
      
      setIsEditing(true);
    }
  }, [prontuario, setValue, isEditing]);

  // Criar/Atualizar prontuário
  const createProntuario = useMutation({
    mutationFn: async (data: ProntuarioFormValues) => {
      // Converter dados para o formato esperado pelo backend
      const backendData = {
        pacienteId: data.pacienteId,
        profissionalId: data.profissionalId,
        data: data.data.toISOString(),
        tipo: data.tipo,
        descricao: data.descricao,
        diagnostico: data.diagnostico,
        prescricao: data.prescricao,
        observacoes: data.observacoes,
      };

      if (id) {
        const response = await api.put(`/prontuarios/${id}`, backendData);
        return response.data.data;
      } else {
        const response = await api.post('/prontuarios', backendData);
        return response.data.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] });
      toast({
        title: id ? "Prontuário atualizado!" : "Prontuário criado!",
        description: id ? "Dados do prontuário foram atualizados com sucesso." : "Prontuário foi criado com sucesso.",
      });
      navigate("/prontuarios");
    },
    onError: () => {
      toast({
        title: id ? "Erro ao atualizar prontuário" : "Erro ao criar prontuário",
        description: "Não foi possível salvar os dados. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProntuarioFormValues) => {
    createProntuario.mutate(data);
  };

  const handleDateSelect = (date: Date | null, field: string) => {
    setValue(field as keyof ProntuarioFormValues, date || new Date());
  };

  if (isLoadingProntuario || isLoadingPacientes || isLoadingProfissionais) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Verificar se há erros
  if (pacientesError || profissionaisError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Erro ao carregar dados</p>
          <p className="text-sm text-muted-foreground">
            {pacientesError && `Erro pacientes: ${pacientesError.message}`}
            {profissionaisError && `Erro profissionais: ${profissionaisError.message}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div>
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {id ? "Editar Prontuário" : "Novo Prontuário"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {id ? "Atualize os dados do prontuário" : "Preencha os dados para criar um novo prontuário"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Informações Básicas */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Informações Básicas</h3>
                  <p className="text-sm text-muted-foreground">
                    Selecione o paciente e profissional responsável
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pacienteId">Paciente *</Label>
                  <Select 
                    value={watch("pacienteId") || ""} 
                    onValueChange={(value) => {
                      if (value && value !== "") {
                        setValue("pacienteId", value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {pacientes && pacientes.length > 0 ? (
                        pacientes.map((paciente) => (
                          <SelectItem key={paciente.id} value={paciente.id}>
                            {paciente.nome}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          Nenhum paciente encontrado
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.pacienteId && (
                    <p className="text-sm text-red-500">{errors.pacienteId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profissionalId">Profissional *</Label>
                  <Select 
                    value={watch("profissionalId") || ""} 
                    onValueChange={(value) => {
                      if (value && value !== "") {
                        setValue("profissionalId", value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {profissionais && profissionais.length > 0 ? (
                        profissionais.map((profissional) => (
                          <SelectItem key={profissional.id} value={profissional.id}>
                            {profissional.nome}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          Nenhum profissional encontrado
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.profissionalId && (
                    <p className="text-sm text-red-500">{errors.profissionalId.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Data e Tipo */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Data e Tipo</h3>
                  <p className="text-sm text-muted-foreground">
                    Defina a data do atendimento e o tipo de prontuário
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="data">Data do Atendimento *</Label>
                  <DatePicker
                    className="w-full"
                    date={watch("data")}
                    onSelect={(date) => handleDateSelect(date, "data")}
                  />
                  {errors.data && (
                    <p className="text-sm text-red-500">{errors.data.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Prontuário *</Label>
                  <Select 
                    value={watch("tipo") || TipoProntuario.CONSULTA} 
                    onValueChange={(value) => {
                      if (value && value !== "") {
                        setValue("tipo", value as TipoProntuario);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TipoProntuario.CONSULTA}>Consulta</SelectItem>
                      <SelectItem value={TipoProntuario.RETORNO}>Retorno</SelectItem>
                      <SelectItem value={TipoProntuario.EXAME}>Exame</SelectItem>
                      <SelectItem value={TipoProntuario.PROCEDIMENTO}>Procedimento</SelectItem>
                      <SelectItem value={TipoProntuario.DOCUMENTO}>Documento</SelectItem>
                      <SelectItem value={TipoProntuario.AVALIACAO}>Avaliação</SelectItem>
                      <SelectItem value={TipoProntuario.SESSAO}>Sessão</SelectItem>
                      <SelectItem value={TipoProntuario.RELATORIO}>Relatório</SelectItem>
                      <SelectItem value={TipoProntuario.EVOLUCAO}>Evolução</SelectItem>
                      <SelectItem value={TipoProntuario.PRESCRICAO}>Prescrição</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo && (
                    <p className="text-sm text-red-500">{errors.tipo.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Descrição do Atendimento</h3>
                  <p className="text-sm text-muted-foreground">
                    Descreva detalhadamente o atendimento realizado
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  {...register("descricao")}
                  placeholder="Descreva o atendimento, queixas do paciente, procedimentos realizados..."
                  rows={4}
                />
                {errors.descricao && (
                  <p className="text-sm text-red-500">{errors.descricao.message}</p>
                )}
              </div>
            </div>

            {/* Diagnóstico */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Diagnóstico</h3>
                  <p className="text-sm text-muted-foreground">
                    Informe o diagnóstico e prescrições
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnostico">Diagnóstico</Label>
                  <Textarea
                    id="diagnostico"
                    {...register("diagnostico")}
                    placeholder="Informe o diagnóstico..."
                    rows={3}
                  />
                  {errors.diagnostico && (
                    <p className="text-sm text-red-500">{errors.diagnostico.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prescricao">Prescrição</Label>
                  <Textarea
                    id="prescricao"
                    {...register("prescricao")}
                    placeholder="Informe a prescrição médica..."
                    rows={3}
                  />
                  {errors.prescricao && (
                    <p className="text-sm text-red-500">{errors.prescricao.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    {...register("observacoes")}
                    placeholder="Observações adicionais..."
                    rows={3}
                  />
                  {errors.observacoes && (
                    <p className="text-sm text-red-500">{errors.observacoes.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/prontuarios")}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || createProntuario.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting || createProntuario.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProntuarioForm; 
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  User, 
  MapPin, 
  FileText, 
  Save, 
  X, 
  GraduationCap,
  Clock
} from "lucide-react";
import { profissionalSchema, type ProfissionalFormValues } from "@/components/forms/schema/profissional";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { CEPInput } from "@/components/ui/cep-input";
import { TimePicker } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";
import { Especialidade } from "@/types/api";

export function ProfissionalForm() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Buscar especialidades
  const { data: especialidades, isLoading: isLoadingEspecialidades } = useQuery({
    queryKey: ['especialidades'],
    queryFn: async () => {
      const response = await api.get('/especialidades');
      return response.data.data as Especialidade[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Buscar profissional se estiver editando
  const { data: profissional, isLoading: isLoadingProfissional } = useQuery({
    queryKey: ['profissional', id],
    queryFn: async () => {
      const response = await api.get(`/profissionais/${id}`);
      return response.data.data;
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
  } = useForm<ProfissionalFormValues>({
    resolver: zodResolver(profissionalSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      dataNascimento: null,
      cpf: "",
      crm: "",
      especialidadeId: "",
      endereco: {
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
      },
      formacao: "",
      experiencia: "",
      observacoes: "",
      horarios: {
        segunda: { inicio: "", fim: "" },
        terca: { inicio: "", fim: "" },
        quarta: { inicio: "", fim: "" },
        quinta: { inicio: "", fim: "" },
        sexta: { inicio: "", fim: "" },
        sabado: { inicio: "", fim: "" },
        domingo: { inicio: "", fim: "" },
      },
      status: "ATIVO",
    },
  });

  // Preencher formulário com dados do profissional quando carregar
  useEffect(() => {
    if (profissional && !isEditing) {
      // Mapear os campos corretamente
      const camposSimples = ['nome', 'email', 'telefone', 'cpf', 'crm', 'especialidadeId', 'formacao', 'experiencia', 'observacoes', 'status'] as const;
      
      camposSimples.forEach(campo => {
        if (profissional[campo] !== null && profissional[campo] !== undefined) {
          setValue(campo, profissional[campo] as ProfissionalFormValues[typeof campo]);
        }
      });

      // Mapear data de nascimento separadamente
      if (profissional.dataNascimento) {
        const dataNascimento = new Date(profissional.dataNascimento);
        if (!isNaN(dataNascimento.getTime())) {
          setValue('dataNascimento', dataNascimento);
        }
      }

      // Mapear endereço
      if (profissional.endereco) {
        Object.entries(profissional.endereco).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            setValue(`endereco.${key}` as keyof ProfissionalFormValues, value as string);
          }
        });
      }

      // Mapear horários
      if (profissional.horarios) {
        Object.entries(profissional.horarios).forEach(([dia, horario]) => {
          if (horario && typeof horario === 'object' && horario !== null) {
            const horarioObj = horario as { inicio?: string; fim?: string };
            if (horarioObj.inicio) {
              setValue(`horarios.${dia}.inicio` as keyof ProfissionalFormValues, horarioObj.inicio);
            }
            if (horarioObj.fim) {
              setValue(`horarios.${dia}.fim` as keyof ProfissionalFormValues, horarioObj.fim);
            }
          }
        });
      }
      
      setIsEditing(true);
    }
  }, [profissional, setValue, isEditing]);

  // Criar/Atualizar profissional
  const createProfissional = useMutation({
    mutationFn: async (data: ProfissionalFormValues) => {
      if (id) {
        const response = await api.put(`/profissionais/${id}`, data);
        return response.data.data;
      } else {
        const response = await api.post('/profissionais', data);
        return response.data.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
      toast({
        title: id ? "Profissional atualizado!" : "Profissional criado!",
        description: id ? "Dados do profissional foram atualizados com sucesso." : "Profissional foi criado com sucesso.",
      });
      navigate("/profissionais");
    },
    onError: () => {
      toast({
        title: id ? "Erro ao atualizar profissional" : "Erro ao criar profissional",
        description: "Não foi possível salvar os dados. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfissionalFormValues) => {
    createProfissional.mutate(data);
  };

  const handleDateSelect = (date: Date | null, field: string) => {
    setValue(field as keyof ProfissionalFormValues, date);
  };

  if (isLoadingProfissional) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div>
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {id ? "Editar Profissional" : "Novo Profissional"}
              </h1>
              <p className="text-muted-foreground">
                {id ? "Atualize os dados do profissional" : "Preencha os dados para cadastrar um novo profissional"}
              </p>
            </div>
          </div>
        </div>
        <div className="pt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Básicas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    {...register("nome")}
                    placeholder="Nome completo do profissional"
                  />
                  {errors.nome && (
                    <p className="text-sm text-red-500">{errors.nome.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="email@exemplo.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    {...register("telefone")}
                    placeholder="(11) 99999-9999"
                  />
                  {errors.telefone && (
                    <p className="text-sm text-red-500">{errors.telefone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <DatePicker
                    date={watch("dataNascimento")}
                    onSelect={(date) => handleDateSelect(date, "dataNascimento")}
                  />
                  {errors.dataNascimento && (
                    <p className="text-sm text-red-500">{errors.dataNascimento.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    {...register("cpf")}
                    placeholder="000.000.000-00"
                  />
                  {errors.cpf && (
                    <p className="text-sm text-red-500">{errors.cpf.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crm">CRM/Registro Profissional</Label>
                  <Input
                    id="crm"
                    {...register("crm")}
                    placeholder="CRM 12345 SP"
                  />
                  {errors.crm && (
                    <p className="text-sm text-red-500">{errors.crm.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Especialidade */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Especialidade
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="especialidadeId">Especialidade *</Label>
                <Select value={watch("especialidadeId")} onValueChange={(value) => setValue("especialidadeId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingEspecialidades ? (
                      <SelectItem value="loading" disabled>Carregando...</SelectItem>
                    ) : (
                      especialidades?.map((especialidade) => (
                        <SelectItem key={especialidade.id} value={especialidade.id}>
                          {especialidade.nome}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.especialidadeId && (
                  <p className="text-sm text-red-500">{errors.especialidadeId.message}</p>
                )}
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CEPInput
                  value={watch("endereco.cep")}
                  onChange={(cep) => setValue("endereco.cep", cep)}
                  onBlur={() => {}}
                  label="CEP"
                  placeholder="00000-000"
                  fieldMapping={{
                    logradouro: "endereco.logradouro",
                    bairro: "endereco.bairro",
                    localidade: "endereco.cidade",
                    uf: "endereco.estado"
                  }}
                  setValue={(field: string, value: string) => {
                    setValue(field as keyof ProfissionalFormValues, value);
                  }}
                  error={errors.endereco?.cep?.message}
                />

                <div className="space-y-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input
                    id="logradouro"
                    {...register("endereco.logradouro")}
                    placeholder="Rua, Avenida, etc."
                  />
                  {errors.endereco?.logradouro && (
                    <p className="text-sm text-red-500">{errors.endereco.logradouro.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    {...register("endereco.numero")}
                    placeholder="123"
                  />
                  {errors.endereco?.numero && (
                    <p className="text-sm text-red-500">{errors.endereco.numero.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    {...register("endereco.complemento")}
                    placeholder="Apto, Casa, etc."
                  />
                  {errors.endereco?.complemento && (
                    <p className="text-sm text-red-500">{errors.endereco.complemento.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    {...register("endereco.bairro")}
                    placeholder="Nome do bairro"
                  />
                  {errors.endereco?.bairro && (
                    <p className="text-sm text-red-500">{errors.endereco.bairro.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    {...register("endereco.cidade")}
                    placeholder="Nome da cidade"
                  />
                  {errors.endereco?.cidade && (
                    <p className="text-sm text-red-500">{errors.endereco.cidade.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={watch("endereco.estado")} onValueChange={(value) => setValue("endereco.estado", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AC">Acre</SelectItem>
                      <SelectItem value="AL">Alagoas</SelectItem>
                      <SelectItem value="AP">Amapá</SelectItem>
                      <SelectItem value="AM">Amazonas</SelectItem>
                      <SelectItem value="BA">Bahia</SelectItem>
                      <SelectItem value="CE">Ceará</SelectItem>
                      <SelectItem value="DF">Distrito Federal</SelectItem>
                      <SelectItem value="ES">Espírito Santo</SelectItem>
                      <SelectItem value="GO">Goiás</SelectItem>
                      <SelectItem value="MA">Maranhão</SelectItem>
                      <SelectItem value="MT">Mato Grosso</SelectItem>
                      <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="PA">Pará</SelectItem>
                      <SelectItem value="PB">Paraíba</SelectItem>
                      <SelectItem value="PR">Paraná</SelectItem>
                      <SelectItem value="PE">Pernambuco</SelectItem>
                      <SelectItem value="PI">Piauí</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                      <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                      <SelectItem value="RO">Rondônia</SelectItem>
                      <SelectItem value="RR">Roraima</SelectItem>
                      <SelectItem value="SC">Santa Catarina</SelectItem>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="SE">Sergipe</SelectItem>
                      <SelectItem value="TO">Tocantins</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.endereco?.estado && (
                    <p className="text-sm text-red-500">{errors.endereco.estado.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Formação e Experiência */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Formação e Experiência
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="formacao">Formação Acadêmica</Label>
                  <Textarea
                    id="formacao"
                    {...register("formacao")}
                    placeholder="Descreva a formação acadêmica do profissional..."
                    rows={3}
                  />
                  {errors.formacao && (
                    <p className="text-sm text-red-500">{errors.formacao.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experiencia">Experiência Profissional</Label>
                  <Textarea
                    id="experiencia"
                    {...register("experiencia")}
                    placeholder="Descreva a experiência profissional..."
                    rows={3}
                  />
                  {errors.experiencia && (
                    <p className="text-sm text-red-500">{errors.experiencia.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Horários de Atendimento */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Horários de Atendimento</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure os horários de trabalho para cada dia da semana
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {([
                  { key: 'segunda' as const, label: 'Segunda-feira' },
                  { key: 'terca' as const, label: 'Terça-feira' },
                  { key: 'quarta' as const, label: 'Quarta-feira' },
                  { key: 'quinta' as const, label: 'Quinta-feira' },
                  { key: 'sexta' as const, label: 'Sexta-feira' },
                  { key: 'sabado' as const, label: 'Sábado' },
                  { key: 'domingo' as const, label: 'Domingo' }
                ] as const).map(({ key, label }) => (
                  <div key={key} className="bg-card border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base font-medium text-foreground">
                        {label}
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-muted-foreground">Ativo</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Início</Label>
                        <TimePicker
                          time={watch(`horarios.${key}.inicio`) || ""}
                          onTimeChange={(time) => setValue(`horarios.${key}.inicio`, time)}
                          placeholder="08:00"
                        />
                        {errors.horarios?.[key]?.inicio && (
                          <p className="text-sm text-red-500">{errors.horarios[key]?.inicio?.message}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-px bg-border"></div>
                        <span className="px-2 text-xs text-muted-foreground">até</span>
                        <div className="w-8 h-px bg-border"></div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Término</Label>
                        <TimePicker
                          time={watch(`horarios.${key}.fim`) || ""}
                          onTimeChange={(time) => setValue(`horarios.${key}.fim`, time)}
                          placeholder="18:00"
                        />
                        {errors.horarios?.[key]?.fim && (
                          <p className="text-sm text-red-500">{errors.horarios[key]?.fim?.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Resumo dos horários */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-3">Resumo dos Horários</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {([
                    { key: 'segunda' as const, label: 'Segunda-feira' },
                    { key: 'terca' as const, label: 'Terça-feira' },
                    { key: 'quarta' as const, label: 'Quarta-feira' },
                    { key: 'quinta' as const, label: 'Quinta-feira' },
                    { key: 'sexta' as const, label: 'Sexta-feira' },
                    { key: 'sabado' as const, label: 'Sábado' },
                    { key: 'domingo' as const, label: 'Domingo' }
                  ] as const).map(({ key, label }) => {
                    const inicio = watch(`horarios.${key}.inicio`)
                    const fim = watch(`horarios.${key}.fim`)
                    const temHorario = inicio && fim
                    
                    return (
                      <div key={key} className="text-center">
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          {label.slice(0, 3)}
                        </div>
                        <div className={cn(
                          "text-xs px-2 py-1 rounded",
                          temHorario 
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "bg-muted text-muted-foreground"
                        )}>
                          {temHorario ? `${inicio} - ${fim}` : "Não definido"}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Badge className="h-5 w-5" />
                Status
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status do Profissional</Label>
                <Select value={watch("status")} onValueChange={(value) => setValue("status", value as "ATIVO" | "INATIVO" | "FERIAS" | "LICENCA")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
                    <SelectItem value="FERIAS">Férias</SelectItem>
                    <SelectItem value="LICENCA">Licença</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Observações
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Gerais</Label>
                <Textarea
                  id="observacoes"
                  {...register("observacoes")}
                  placeholder="Observações importantes sobre o profissional..."
                  rows={4}
                />
                {errors.observacoes && (
                  <p className="text-sm text-red-500">{errors.observacoes.message}</p>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/profissionais")}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || createProfissional.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting || createProfissional.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfissionalForm; 
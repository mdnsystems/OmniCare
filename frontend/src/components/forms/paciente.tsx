"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { CEPInput } from "@/components/ui/cep-input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  User, 
  MapPin, 
  FileText, 
  Save, 
  X
} from "lucide-react";
import { pacienteSchema, type PacienteFormValues } from "@/components/forms/schema/paciente";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { CardTitle } from "@/components/ui/card";

interface Profissional {
  id: string;
  nome: string;
  especialidade?: {
    nome: string;
  };
}

export function PacienteForm() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Buscar profissionais
  const { data: profissionaisData, isLoading: isLoadingProfissionais, error: profissionaisError } = useQuery({
    queryKey: ['profissionais-ativos'],
    queryFn: async () => {
      const response = await api.get('/profissionais/ativos');
      return response.data.data as Profissional[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Garantir que profissionais seja sempre um array
  const profissionais = profissionaisData || [];

  // Debug: log dos dados
  console.log('Profissionais data:', profissionaisData);
  console.log('Profissionais array:', profissionais);
  console.log('Profissionais error:', profissionaisError);

  // Buscar paciente se estiver editando
  const { data: paciente, isLoading: isLoadingPaciente } = useQuery({
    queryKey: ['paciente', id],
    queryFn: async () => {
      const response = await api.get(`/pacientes/${id}`);
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
  } = useForm<PacienteFormValues>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      dataNascimento: new Date(),
      cpf: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cep: "",
      cidade: "",
      estado: "",
      pais: "",
      convenioNome: "",
      convenioNumero: "",
      convenioPlano: "",
      convenioValidade: new Date(),
      profissionalId: "",
    },
  });

  // Preencher formulário com dados do paciente quando carregar
  useEffect(() => {
    if (paciente && !isEditing) {
      console.log('Dados do paciente carregados:', paciente);
      
      // Mapear campos do backend para o frontend
      const mappedData = {
        nome: paciente.nome || "",
        email: paciente.email || "",
        telefone: paciente.telefone || "",
        dataNascimento: paciente.dataNascimento ? new Date(paciente.dataNascimento) : new Date(),
        cpf: paciente.cpf || "",
        endereco: paciente.endereco || "",
        numero: paciente.numero || "",
        complemento: paciente.complemento || "",
        bairro: paciente.bairro || "",
        cep: paciente.cep || "",
        cidade: paciente.cidade || "",
        estado: paciente.estado || "",
        pais: paciente.pais || "",
        convenioNome: paciente.convenioNome || "",
        convenioNumero: paciente.convenioNumero || "",
        convenioPlano: paciente.convenioPlano || "",
        convenioValidade: paciente.convenioValidade ? new Date(paciente.convenioValidade) : new Date(),
        profissionalId: paciente.profissionalId || "",
      };

      console.log('Dados mapeados:', mappedData);

      // Definir valores no formulário
      Object.entries(mappedData).forEach(([key, value]) => {
        setValue(key as keyof PacienteFormValues, value);
      });
      
      setIsEditing(true);
    }
  }, [paciente, setValue, isEditing]);

  // Criar/Atualizar paciente
  const createPaciente = useMutation({
    mutationFn: async (data: PacienteFormValues) => {
      // Converter dados para o formato esperado pelo backend
      const backendData = {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        dataNascimento: data.dataNascimento.toISOString(),
        cpf: data.cpf,
        endereco: data.endereco,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cep: data.cep,
        cidade: data.cidade,
        estado: data.estado,
        pais: data.pais,
        convenioNome: data.convenioNome,
        convenioNumero: data.convenioNumero,
        convenioPlano: data.convenioPlano,
        convenioValidade: data.convenioValidade.toISOString(),
        profissionalId: data.profissionalId,
      };

      if (id) {
        const response = await api.put(`/pacientes/${id}`, backendData);
        return response.data.data;
      } else {
        const response = await api.post('/pacientes', backendData);
        return response.data.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      toast({
        title: id ? "Paciente atualizado!" : "Paciente criado!",
        description: id ? "Dados do paciente foram atualizados com sucesso." : "Paciente foi criado com sucesso.",
      });
      navigate("/pacientes");
    },
    onError: () => {
      toast({
        title: id ? "Erro ao atualizar paciente" : "Erro ao criar paciente",
        description: "Não foi possível salvar os dados. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PacienteFormValues) => {
    createPaciente.mutate(data);
  };

  const handleDateSelect = (date: Date | null, field: string) => {
    setValue(field as keyof PacienteFormValues, date || new Date());
  };

  if (isLoadingPaciente) {
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
              <CardTitle className="text-2xl font-bold">
                {id ? "Editar Paciente" : "Novo Paciente"}
              </CardTitle>
              <p className="text-muted-foreground">
                {id ? "Atualize os dados do paciente" : "Preencha os dados para cadastrar um novo paciente"}
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
                    placeholder="Nome completo do paciente"
                  />
                  {errors.nome && (
                    <p className="text-sm text-red-500">{errors.nome.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <DatePicker
                    className="w-full"
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
                  <Label htmlFor="profissionalId">Profissional Responsável *</Label>
                  <Select 
                    value={watch("profissionalId")} 
                    onValueChange={(value) => setValue("profissionalId", value)}
                    disabled={isLoadingProfissionais}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {profissionais.map((profissional) => (
                        <SelectItem key={profissional.id} value={profissional.id}>
                          {profissional.nome} {profissional.especialidade ? `(${profissional.especialidade.nome})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.profissionalId && (
                    <p className="text-sm text-red-500">{errors.profissionalId.message}</p>
                  )}
                </div>
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
                  value={watch("cep")}
                  onChange={(cep) => setValue("cep", cep)}
                  onBlur={() => {}}
                  label="CEP"
                  placeholder="00000-000"
                  fieldMapping={{
                    logradouro: "endereco",
                    bairro: "bairro",
                    localidade: "cidade",
                    uf: "estado"
                  }}
                  setValue={(field: string, value: string) => {
                    setValue(field as keyof PacienteFormValues, value);
                  }}
                  error={errors.cep?.message}
                />

                <div className="space-y-2">
                  <Label htmlFor="endereco">Logradouro</Label>
                  <Input
                    id="endereco"
                    {...register("endereco")}
                    placeholder="Rua, Avenida, etc."
                  />
                  {errors.endereco && (
                    <p className="text-sm text-red-500">{errors.endereco.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    {...register("numero")}
                    placeholder="123"
                  />
                  {errors.numero && (
                    <p className="text-sm text-red-500">{errors.numero.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    {...register("complemento")}
                    placeholder="Apto, Casa, etc."
                  />
                  {errors.complemento && (
                    <p className="text-sm text-red-500">{errors.complemento.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    {...register("bairro")}
                    placeholder="Nome do bairro"
                  />
                  {errors.bairro && (
                    <p className="text-sm text-red-500">{errors.bairro.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    {...register("cidade")}
                    placeholder="Nome da cidade"
                  />
                  {errors.cidade && (
                    <p className="text-sm text-red-500">{errors.cidade.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={watch("estado")} onValueChange={(value) => setValue("estado", value)}>
                    <SelectTrigger className="w-full">
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
                  {errors.estado && (
                    <p className="text-sm text-red-500">{errors.estado.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pais">País</Label>
                  <Input
                    id="pais"
                    {...register("pais")}
                    placeholder="Nome do país"
                  />
                  {errors.pais && (
                    <p className="text-sm text-red-500">{errors.pais.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Convênio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Convênio
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="convenioNome">Nome do Convênio</Label>
                  <Input
                    id="convenioNome"
                    {...register("convenioNome")}
                    placeholder="Nome do convênio"
                  />
                  {errors.convenioNome && (
                    <p className="text-sm text-red-500">{errors.convenioNome.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="convenioNumero">Número do Convênio</Label>
                  <Input
                    id="convenioNumero"
                    {...register("convenioNumero")}
                    placeholder="Número do convênio"
                  />
                  {errors.convenioNumero && (
                    <p className="text-sm text-red-500">{errors.convenioNumero.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="convenioPlano">Plano do Convênio</Label>
                  <Input
                    id="convenioPlano"
                    {...register("convenioPlano")}
                    placeholder="Plano do convênio"
                  />
                  {errors.convenioPlano && (
                    <p className="text-sm text-red-500">{errors.convenioPlano.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="convenioValidade">Validade</Label>
                  <DatePicker
                    className="w-full"
                    date={watch("convenioValidade")}
                    onSelect={(date) => handleDateSelect(date, "convenioValidade")}
                  />
                  {errors.convenioValidade && (
                    <p className="text-sm text-red-500">{errors.convenioValidade.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/pacientes")}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || createPaciente.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting || createPaciente.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

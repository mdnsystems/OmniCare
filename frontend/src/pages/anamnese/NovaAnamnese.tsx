import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserCheck, Save, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { usePacientes } from "../../hooks/useQueries";
import { useAnamnese } from "../../hooks/useAnamnese";
import { useAuth } from "../../contexts/AuthContext";

interface Paciente {
  id: string;
  nome: string;
  email: string;
}

interface FormErrors {
  pacienteId?: string;
  data?: string;
  altura?: string;
  peso?: string;
}

export default function NovaAnamnese() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [form, setForm] = useState({
    pacienteId: "",
    data: null as Date | null,
    altura: "",
    peso: "",
    imc: "",
    circAbdominal: "",
    habitos: "",
    alimentacao: "",
    exames: "",
    medicamentos: "",
    hidratacao: "",
    cognitivo: "",
    observacoes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Buscar pacientes usando o hook
  const { data: pacientes, isLoading: isLoadingPacientes } = usePacientes();

  // Buscar anamnese se estiver editando
  const { data: anamnese, isLoading: isLoadingAnamnese } = useAnamnese(id || "", {
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Buscar prontuário do paciente
  const { data: prontuario } = useQuery({
    queryKey: ['prontuario', form.pacienteId],
    queryFn: async () => {
      if (!form.pacienteId) return null;
      const response = await api.get(`/prontuarios/paciente/${form.pacienteId}`);
      return response.data.data;
    },
    enabled: !!form.pacienteId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Buscar template padrão de anamnese
  const { data: template } = useQuery({
    queryKey: ['template-anamnese'],
    queryFn: async () => {
      const response = await api.get('/anamneses/templates');
      const templates = response.data.data;
      return templates.find((t: any) => t.categoria === 'ANAMNESE') || templates[0];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Preencher formulário com dados da anamnese quando carregar
  useEffect(() => {
    if (anamnese && !isEditing) {
      console.log('Dados da anamnese carregados:', anamnese);
      
      // Mapear campos do backend para o frontend
      const mappedData = {
        pacienteId: anamnese.pacienteId || "",
        data: anamnese.data ? new Date(anamnese.data) : new Date(),
        altura: anamnese.campos?.altura?.toString() || "",
        peso: anamnese.campos?.peso?.toString() || "",
        imc: anamnese.campos?.imc?.toString() || "",
        circAbdominal: anamnese.campos?.circAbdominal?.toString() || "",
        habitos: anamnese.campos?.habitos || "",
        alimentacao: anamnese.campos?.alimentacao || "",
        exames: anamnese.campos?.exames || "",
        medicamentos: anamnese.campos?.medicamentos || "",
        hidratacao: anamnese.campos?.hidratacao || "",
        cognitivo: anamnese.campos?.cognitivo || "",
        observacoes: anamnese.campos?.observacoes || "",
      };

      console.log('Dados mapeados:', mappedData);

      // Definir valores no formulário
      setForm(mappedData);
      setIsEditing(true);
    }
  }, [anamnese, isEditing]);

  // Criar/Atualizar anamnese
  const criarAnamnese = useMutation({
    mutationFn: async (data: any) => {
      // Usar o profissional logado
      const profissionalId = user?.profissionalId;
      if (!profissionalId) {
        throw new Error('Profissional não encontrado. Faça login novamente.');
      }

      // Criar prontuário se não existir
      let prontuarioId = prontuario?.id;
      if (!prontuarioId && form.pacienteId) {
        try {
          const prontuarioResponse = await api.post('/prontuarios', {
            pacienteId: form.pacienteId,
            profissionalId: profissionalId,
            data: data.data?.toISOString(),
            tipo: 'CONSULTA',
            descricao: 'Prontuário criado automaticamente para anamnese',
          });
          prontuarioId = prontuarioResponse.data.data.id;
        } catch (error) {
          console.warn('Erro ao criar prontuário:', error);
          // Usar um ID temporário se não conseguir criar o prontuário
          prontuarioId = "temp-" + Date.now();
        }
      }

      const templateId = template?.id || "default";

      const anamneseData = {
        pacienteId: data.pacienteId,
        profissionalId: profissionalId,
        prontuarioId: prontuarioId,
        data: data.data?.toISOString(),
        templateId: templateId,
        campos: {
          altura: data.altura ? parseFloat(data.altura) : null,
          peso: data.peso ? parseFloat(data.peso) : null,
          imc: data.imc ? parseFloat(data.imc) : null,
          circAbdominal: data.circAbdominal ? parseFloat(data.circAbdominal) : null,
          habitos: data.habitos,
          alimentacao: data.alimentacao,
          exames: data.exames,
          medicamentos: data.medicamentos,
          hidratacao: data.hidratacao,
          cognitivo: data.cognitivo,
          observacoes: data.observacoes,
        }
      };

      console.log('Dados a serem enviados:', anamneseData);

      if (id) {
        const response = await api.put(`/anamneses/${id}`, anamneseData);
        return response.data.data;
      } else {
        const response = await api.post('/anamneses', anamneseData);
        return response.data.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anamneses'] });
      queryClient.invalidateQueries({ queryKey: ['pacientes-anamnese'] });
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] });
      toast({
        title: id ? "Anamnese atualizada!" : "Anamnese criada!",
        description: id ? "Avaliação foi atualizada com sucesso." : "Avaliação registrada com sucesso.",
      });
      navigate("/anamnese");
    },
    onError: (error: any) => {
      console.error('Erro ao salvar anamnese:', error);
      toast({
        title: id ? "Erro ao atualizar anamnese" : "Erro ao criar anamnese",
        description: error.response?.data?.error || "Não foi possível salvar os dados. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSelectPaciente(value: string) {
    setForm({ ...form, pacienteId: value });
  }

  function handleDateSelect(date: Date | null) {
    setForm({ ...form, data: date });
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.pacienteId) errs.pacienteId = "Selecione o paciente";
    if (!form.data) errs.data = "Informe a data";
    if (!form.altura) errs.altura = "Informe a altura";
    if (!form.peso) errs.peso = "Informe o peso";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      criarAnamnese.mutate(form);
    }
  }

  if (isLoadingPacientes || (id && isLoadingAnamnese)) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 w-full mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 w-full mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {id ? "Editar Anamnese Nutricional" : "Nova Anamnese Nutricional"}
              </CardTitle>
              <p className="text-muted-foreground">
                {id ? "Edite os dados da avaliação nutricional" : "Preencha os dados para registrar uma nova avaliação nutricional"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Paciente *</label>
                <Select value={form.pacienteId} onValueChange={handleSelectPaciente}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(pacientes) && pacientes.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.pacienteId && <span className="text-xs text-red-500">{errors.pacienteId}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data *</label>
                <DatePicker date={form.data} onSelect={handleDateSelect} />
                {errors.data && <span className="text-xs text-red-500">{errors.data}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Altura (m) *</label>
                <Input name="altura" value={form.altura} onChange={handleChange} placeholder="Ex: 1.70" />
                {errors.altura && <span className="text-xs text-red-500">{errors.altura}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Peso (kg) *</label>
                <Input name="peso" value={form.peso} onChange={handleChange} placeholder="Ex: 70" />
                {errors.peso && <span className="text-xs text-red-500">{errors.peso}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IMC</label>
                <Input name="imc" value={form.imc} onChange={handleChange} placeholder="Ex: 24.2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Circunferência Abdominal (cm)</label>
                <Input name="circAbdominal" value={form.circAbdominal} onChange={handleChange} placeholder="Ex: 90" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hábitos</label>
              <Textarea name="habitos" value={form.habitos} onChange={handleChange} placeholder="Atividade física, sono, tabagismo, etc." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Alimentação</label>
              <Textarea name="alimentacao" value={form.alimentacao} onChange={handleChange} placeholder="Preferências, restrições, refeições, etc." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Exames</label>
              <Textarea name="exames" value={form.exames} onChange={handleChange} placeholder="Hemograma, glicemia, colesterol, etc." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Medicamentos</label>
              <Textarea name="medicamentos" value={form.medicamentos} onChange={handleChange} placeholder="Remédios em uso, suplementos, etc." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hidratação</label>
              <Textarea name="hidratacao" value={form.hidratacao} onChange={handleChange} placeholder="Consumo de água, outros líquidos" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cognitivo</label>
              <Textarea name="cognitivo" value={form.cognitivo} onChange={handleChange} placeholder="Memória, concentração, estresse, etc." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Observações</label>
              <Textarea name="observacoes" value={form.observacoes} onChange={handleChange} placeholder="Observações gerais" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/anamnese")}> 
                <X className="h-4 w-4 mr-2" /> Cancelar 
              </Button>
              <Button type="submit" disabled={criarAnamnese.isPending}> 
                <Save className="h-4 w-4 mr-2" /> 
                {criarAnamnese.isPending ? 'Salvando...' : (id ? 'Atualizar' : 'Salvar')} 
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
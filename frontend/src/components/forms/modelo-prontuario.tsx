"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileText, Stethoscope, Heart, Activity, UserCheck, FileEdit, Save, X } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { modeloProntuarioSchema, ModeloProntuarioFormValues } from "./schema/modelo-prontuario";

const tiposProntuario = [
  { value: "CONSULTA", label: "Consulta", icon: Stethoscope, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  { value: "RETORNO", label: "Retorno", icon: Heart, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  { value: "EXAME", label: "Exame", icon: Activity, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
  { value: "PROCEDIMENTO", label: "Procedimento", icon: UserCheck, color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
  { value: "DOCUMENTO", label: "Documento", icon: FileEdit, color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" },
];

const categorias = [
  "Nutrição",
  "Clínica Geral", 
  "Endocrinologia",
  "Cardiologia",
  "Educação Física",
  "Laboratório",
  "Psicologia",
  "Fisioterapia",
  "Outros"
];

// Dados mockados para teste - em produção viriam da API
const modelosMock = [
  {
    id: "1",
    nome: "Avaliação Nutricional Inicial",
    descricao: "Template para primeira consulta nutricional",
    tipo: "CONSULTA",
    categoria: "Nutrição",
    conteudo: "Avaliação completa com anamnese, medidas antropométricas e plano alimentar",
    ativo: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    nome: "Retorno Nutricional",
    descricao: "Template para consultas de retorno",
    tipo: "RETORNO",
    categoria: "Nutrição",
    conteudo: "Acompanhamento de evolução, ajustes no plano alimentar",
    ativo: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    nome: "Avaliação Clínica Geral",
    descricao: "Template para consulta médica geral",
    tipo: "CONSULTA",
    categoria: "Clínica Geral",
    conteudo: "Histórico médico, exame físico, diagnóstico e prescrição",
    ativo: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    nome: "Prescrição de Exercícios",
    descricao: "Template para prescrição de atividade física",
    tipo: "PROCEDIMENTO",
    categoria: "Educação Física",
    conteudo: "Avaliação física, prescrição de exercícios personalizada",
    ativo: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    nome: "Relatório de Exames",
    descricao: "Template para relatórios de exames laboratoriais",
    tipo: "EXAME",
    categoria: "Laboratório",
    conteudo: "Interpretação de resultados, recomendações",
    ativo: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export default function ModeloProntuarioForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ModeloProntuarioFormValues>({
    resolver: zodResolver(modeloProntuarioSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      tipo: "CONSULTA",
      categoria: "",
      conteudo: "",
      ativo: true,
    },
    mode: "onChange",
  });

  // Carregar dados do modelo quando há ID na URL
  useEffect(() => {
    if (id) {
      console.log("Carregando modelo com ID:", id);
      setIsLoading(true);
      
      // Usar setTimeout para simular carregamento assíncrono
      const loadModelo = async () => {
        try {
          // Simular carregamento da API
          await new Promise(resolve => setTimeout(resolve, 500));
          const modelo = modelosMock.find(m => m.id === id);
          console.log("Modelo encontrado:", modelo);
          
          if (modelo) {
            // Garantir que todos os campos tenham valores válidos
            const formData = {
              nome: modelo.nome || "",
              descricao: modelo.descricao || "",
              tipo: (modelo.tipo as any) || "CONSULTA",
              categoria: modelo.categoria || "",
              conteudo: modelo.conteudo || "",
              ativo: Boolean(modelo.ativo),
            };
            
            console.log("Dados do formulário:", formData);
            form.reset(formData);
            console.log("Formulário resetado com dados do modelo");
          } else {
            console.error("Modelo não encontrado para ID:", id);
            toast.error("Modelo não encontrado");
            navigate("/prontuarios/modelos");
          }
        } catch (error) {
          console.error("Erro ao carregar modelo:", error);
          toast.error("Erro ao carregar dados do modelo");
        } finally {
          setIsLoading(false);
          console.log("Carregamento finalizado");
        }
      };
      
      loadModelo();
    } else {
      console.log("Nenhum ID fornecido, modo de criação");
      // Garantir que o formulário esteja limpo no modo de criação
      form.reset({
        nome: "",
        descricao: "",
        tipo: "CONSULTA",
        categoria: "",
        conteudo: "",
        ativo: true,
      });
    }
  }, [id, form, navigate]);

  async function onSubmit(data: ModeloProntuarioFormValues) {
    try {
      setIsSubmitting(true);
      
      // TODO: Implementar integração com API
      console.log("Dados do modelo:", data);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(id ? "Modelo atualizado com sucesso!" : "Modelo criado com sucesso!");
      navigate("/prontuarios/modelos");
    } catch (error) {
      console.error("Erro ao salvar modelo:", error);
      toast.error(id ? "Erro ao atualizar modelo" : "Erro ao criar modelo");
    } finally {
      setIsSubmitting(false);
    }
  }

  const getTipoIcon = (tipo: string) => {
    const tipoObj = tiposProntuario.find(t => t.value === tipo);
    return tipoObj ? tipoObj.icon : FileText;
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Carregando...</h1>
            <p className="text-muted-foreground">Aguarde enquanto carregamos os dados do modelo</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {id ? "Editar Modelo" : "Novo Modelo de Prontuário"}
          </h1>
          <p className="text-muted-foreground">
            {id ? "Atualize o modelo de prontuário" : "Crie um novo modelo de prontuário"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>
                Dados principais do modelo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Modelo *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Avaliação Nutricional Inicial" 
                          {...field} 
                          disabled={isLoading}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ""}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categorias.map((categoria) => (
                            <SelectItem key={categoria} value={categoria}>
                              {categoria}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Prontuário *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || "CONSULTA"}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposProntuario.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              <div className="flex items-center gap-2">
                                <tipo.icon className="h-4 w-4" />
                                <span>{tipo.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ativo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Modelo Ativo</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Modelos ativos podem ser utilizados na criação de prontuários
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={Boolean(field.value)}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                          aria-label="Toggle modelo ativo"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva brevemente o propósito deste modelo..."
                        className="min-h-[80px]"
                        {...field}
                        disabled={isLoading}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Conteúdo do Modelo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileEdit className="h-5 w-5" />
                Conteúdo do Modelo
              </CardTitle>
              <CardDescription>
                Template que será usado como base para criar prontuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="conteudo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo do Template *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Exemplo de template:

# Avaliação Nutricional

## Dados do Paciente
- Nome: [NOME_PACIENTE]
- Idade: [IDADE]
- Peso: [PESO] kg
- Altura: [ALTURA] cm
- IMC: [IMC]

## Anamnese Alimentar
- Refeições por dia: [NUMERO_REFEICOES]
- Horário das refeições: [HORARIOS]
- Preferências: [PREFERENCIAS]
- Restrições: [RESTRICOES]

## Avaliação Física
- Circunferência abdominal: [CIRCUNFERENCIA] cm
- Percentual de gordura: [PERCENTUAL_GORDURA]%

## Diagnóstico Nutricional
[DIAGNOSTICO]

## Prescrição
[PRESCRICAO]

## Observações
[OBSERVACOES]`}
                        className="min-h-[400px] font-mono text-sm"
                        {...field}
                        disabled={isLoading}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <div className="text-sm text-muted-foreground mt-2">
                      Use placeholders como [NOME_PACIENTE] para campos que serão preenchidos dinamicamente
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Preview do Modelo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Preview do Modelo
              </CardTitle>
              <CardDescription>
                Como o modelo aparecerá na lista
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {(() => {
                      try {
                        const tipo = form.watch("tipo") || "CONSULTA";
                        const IconComponent = getTipoIcon(tipo);
                        return React.createElement(IconComponent, { className: "h-5 w-5" });
                      } catch (error) {
                        console.error("Erro ao renderizar ícone:", error);
                        return <FileText className="h-5 w-5" />;
                      }
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{form.watch("nome") || "Nome do Modelo"}</h3>
                    <p className="text-sm text-muted-foreground">{form.watch("descricao") || "Descrição do modelo"}</p>
                  </div>
                  <Badge variant={form.watch("ativo") ? "default" : "secondary"}>
                    {form.watch("ativo") ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={(() => {
                    try {
                      const tipo = form.watch("tipo") || "CONSULTA";
                      const tipoObj = tiposProntuario.find(t => t.value === tipo);
                      return tipoObj?.color || "bg-gray-100 text-gray-800";
                    } catch (error) {
                      console.error("Erro ao obter cor do tipo:", error);
                      return "bg-gray-100 text-gray-800";
                    }
                  })()}>
                    {(() => {
                      try {
                        const tipo = form.watch("tipo") || "CONSULTA";
                        const tipoObj = tiposProntuario.find(t => t.value === tipo);
                        return tipoObj?.label || "Tipo";
                      } catch (error) {
                        console.error("Erro ao obter label do tipo:", error);
                        return "Tipo";
                      }
                    })()}
                  </Badge>
                  <Badge variant="outline">
                    {form.watch("categoria") || "Categoria"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/prontuarios/modelos")}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {id ? "Atualizar Modelo" : "Criar Modelo"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 
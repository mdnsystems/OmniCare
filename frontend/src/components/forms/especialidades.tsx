"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const especialidadeSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
});

type EspecialidadeFormValues = z.infer<typeof especialidadeSchema>;

// Dados temporários
const especialidadesMock = [
  {
    id: 1,
    nome: "Clínico Geral",
    descricao: "Atendimento geral e preventivo",
    status: "Ativo"
  },
  {
    id: 2,
    nome: "Pediatria",
    descricao: "Atendimento infantil",
    status: "Ativo"
  }
];

export default function EspecialidadesForm() {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const form = useForm<EspecialidadeFormValues>({
    resolver: zodResolver(especialidadeSchema),
    defaultValues: {
      nome: "",
      descricao: "",
    },
  });

  useEffect(() => {
    if (id) {
      // TODO: Substituir por chamada à API
      const especialidade = especialidadesMock.find((e) => e.id === parseInt(id));
      if (especialidade) {
        form.reset({
          nome: especialidade.nome,
          descricao: especialidade.descricao,
        });
      }
    }
  }, [id, form]);

  async function onSubmit(data: EspecialidadeFormValues) {
    try {
      // TODO: Implementar integração com API
      console.log(data);
      toast.success(id ? "Especialidade atualizada com sucesso!" : "Especialidade criada com sucesso!");
      navigate("/profissionais/especialidades");
    } catch (error) {
      toast.error(id ? "Erro ao atualizar especialidade" : "Erro ao criar especialidade");
    }
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{id ? "Editar Especialidade" : "Nova Especialidade"}</h1>
          <p className="text-muted-foreground">
            {id ? "Atualize os dados da especialidade" : "Preencha os dados da nova especialidade"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da especialidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite a descrição da especialidade"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
              <Button type="submit">{id ? "Atualizar" : "Salvar"}</Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
} 
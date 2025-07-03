import { z } from "zod";

export const modeloProntuarioSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  descricao: z.string().min(1, "Descrição é obrigatória").max(500, "Descrição muito longa"),
  tipo: z.enum(["CONSULTA", "RETORNO", "EXAME", "PROCEDIMENTO", "DOCUMENTO"], {
    required_error: "Tipo é obrigatório",
  }),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  conteudo: z.string().min(1, "Conteúdo é obrigatório").max(5000, "Conteúdo muito longo"),
  ativo: z.boolean().default(true),
});

export type ModeloProntuarioFormValues = z.infer<typeof modeloProntuarioSchema>; 
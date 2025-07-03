import { z } from "zod";

export const especialidadeSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome deve ter no máximo 100 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres").max(500, "Descrição deve ter no máximo 500 caracteres"),
  tipoClinica: z.enum(["MEDICA", "NUTRICIONAL", "ODONTOLOGICA", "PSICOLOGICA", "FISIOTERAPICA", "ESTETICA", "VETERINARIA"], {
    required_error: "Tipo de clínica é obrigatório",
  }),
});

export type EspecialidadeFormValues = z.infer<typeof especialidadeSchema>; 
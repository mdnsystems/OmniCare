import { z } from "zod";

export const prontuarioSchema = z.object({
  pacienteId: z.string().min(1, "Paciente é obrigatório"),
  profissionalId: z.string().min(1, "Profissional é obrigatório"),
  data: z.date({
    required_error: "Data é obrigatória",
  }),
  tipo: z.enum(["CONSULTA", "RETORNO", "EXAME", "PROCEDIMENTO", "DOCUMENTO"], {
    required_error: "Tipo é obrigatório",
  }),
  descricao: z.string().min(1, "Descrição é obrigatória").max(1000, "Descrição muito longa"),
  diagnostico: z.string().optional(),
  prescricao: z.string().optional(),
  observacoes: z.string().optional(),
});

export type ProntuarioFormValues = z.infer<typeof prontuarioSchema>; 
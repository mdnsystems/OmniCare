import { z } from 'zod';

export const especialidadeSchema = z.object({
  nome: z.string().min(3),
  descricao: z.string().min(5),
});

export type EspecialidadeInput = z.infer<typeof especialidadeSchema>; 
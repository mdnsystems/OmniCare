import { z } from 'zod';

export const exameSchema = z.object({
  prontuarioId: z.string().uuid(),
  tipo: z.string(),
  data: z.string(),
  resultado: z.string(),
  observacoes: z.string().optional(),
  arquivo: z.string().optional(),
});

export type ExameInput = z.infer<typeof exameSchema>; 
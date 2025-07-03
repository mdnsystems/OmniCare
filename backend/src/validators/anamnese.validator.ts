import { z } from 'zod';

export const anamneseSchema = z.object({
  pacienteId: z.string().uuid(),
  profissionalId: z.string().uuid(),
  prontuarioId: z.string().uuid(),
  data: z.string(),
  templateId: z.string().optional(),
  campos: z.record(z.any()).optional(),
});

export type AnamneseInput = z.infer<typeof anamneseSchema>; 
import { z } from 'zod';
import { TipoProntuario } from '../types/enums';

export const prontuarioSchema = z.object({
  pacienteId: z.string().uuid(),
  profissionalId: z.string().uuid(),
  data: z.string(),
  tipo: z.nativeEnum(TipoProntuario),
  descricao: z.string(),
  diagnostico: z.string().optional(),
  prescricao: z.string().optional(),
  observacoes: z.string().optional(),
});

export type ProntuarioInput = z.infer<typeof prontuarioSchema>; 
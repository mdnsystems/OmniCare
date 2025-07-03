import { z } from 'zod';
import { TipoAgendamento, StatusAgendamento } from '../types/enums';

export const agendamentoSchema = z.object({
  pacienteId: z.string().uuid(),
  profissionalId: z.string().uuid(),
  data: z.string(),
  horaInicio: z.string(),
  horaFim: z.string(),
  tipo: z.nativeEnum(TipoAgendamento),
  status: z.nativeEnum(StatusAgendamento).optional().default(StatusAgendamento.AGENDADO),
  observacoes: z.string().optional(),
});

export type AgendamentoInput = z.infer<typeof agendamentoSchema>; 
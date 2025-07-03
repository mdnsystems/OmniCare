import { z } from 'zod';
import { TipoAgendamento, StatusAgendamento } from '../types/enums';
export declare const agendamentoSchema: z.ZodObject<{
    pacienteId: z.ZodString;
    profissionalId: z.ZodString;
    data: z.ZodString;
    horaInicio: z.ZodString;
    horaFim: z.ZodString;
    tipo: z.ZodNativeEnum<typeof TipoAgendamento>;
    status: z.ZodDefault<z.ZodOptional<z.ZodNativeEnum<typeof StatusAgendamento>>>;
    observacoes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tipo: TipoAgendamento;
    pacienteId: string;
    profissionalId: string;
    data: string;
    horaInicio: string;
    horaFim: string;
    status: StatusAgendamento;
    observacoes?: string | undefined;
}, {
    tipo: TipoAgendamento;
    pacienteId: string;
    profissionalId: string;
    data: string;
    horaInicio: string;
    horaFim: string;
    status?: StatusAgendamento | undefined;
    observacoes?: string | undefined;
}>;
export type AgendamentoInput = z.infer<typeof agendamentoSchema>;

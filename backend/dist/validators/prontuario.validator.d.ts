import { z } from 'zod';
import { TipoProntuario } from '../types/enums';
export declare const prontuarioSchema: z.ZodObject<{
    pacienteId: z.ZodString;
    profissionalId: z.ZodString;
    data: z.ZodString;
    tipo: z.ZodNativeEnum<typeof TipoProntuario>;
    descricao: z.ZodString;
    diagnostico: z.ZodOptional<z.ZodString>;
    prescricao: z.ZodOptional<z.ZodString>;
    observacoes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tipo: TipoProntuario;
    pacienteId: string;
    profissionalId: string;
    data: string;
    descricao: string;
    observacoes?: string | undefined;
    diagnostico?: string | undefined;
    prescricao?: string | undefined;
}, {
    tipo: TipoProntuario;
    pacienteId: string;
    profissionalId: string;
    data: string;
    descricao: string;
    observacoes?: string | undefined;
    diagnostico?: string | undefined;
    prescricao?: string | undefined;
}>;
export type ProntuarioInput = z.infer<typeof prontuarioSchema>;

import { z } from 'zod';
export declare const exameSchema: z.ZodObject<{
    prontuarioId: z.ZodString;
    tipo: z.ZodString;
    data: z.ZodString;
    resultado: z.ZodString;
    observacoes: z.ZodOptional<z.ZodString>;
    arquivo: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tipo: string;
    data: string;
    prontuarioId: string;
    resultado: string;
    observacoes?: string | undefined;
    arquivo?: string | undefined;
}, {
    tipo: string;
    data: string;
    prontuarioId: string;
    resultado: string;
    observacoes?: string | undefined;
    arquivo?: string | undefined;
}>;
export type ExameInput = z.infer<typeof exameSchema>;

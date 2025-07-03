import { z } from 'zod';
export declare const especialidadeSchema: z.ZodObject<{
    nome: z.ZodString;
    descricao: z.ZodString;
}, "strip", z.ZodTypeAny, {
    nome: string;
    descricao: string;
}, {
    nome: string;
    descricao: string;
}>;
export type EspecialidadeInput = z.infer<typeof especialidadeSchema>;

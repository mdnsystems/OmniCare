import { z } from 'zod';
import { TipoClinica } from '../../types/enums';
export declare const CreateClinicaSchema: z.ZodObject<{
    nome: z.ZodString;
    tipo: z.ZodNativeEnum<typeof TipoClinica>;
    logo: z.ZodOptional<z.ZodString>;
    corPrimaria: z.ZodOptional<z.ZodString>;
    corSecundaria: z.ZodOptional<z.ZodString>;
    tema: z.ZodOptional<z.ZodEnum<["light", "dark"]>>;
}, "strip", z.ZodTypeAny, {
    nome: string;
    tipo: TipoClinica;
    logo?: string | undefined;
    corPrimaria?: string | undefined;
    corSecundaria?: string | undefined;
    tema?: "light" | "dark" | undefined;
}, {
    nome: string;
    tipo: TipoClinica;
    logo?: string | undefined;
    corPrimaria?: string | undefined;
    corSecundaria?: string | undefined;
    tema?: "light" | "dark" | undefined;
}>;
export declare const UpdateClinicaSchema: z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    tipo: z.ZodOptional<z.ZodNativeEnum<typeof TipoClinica>>;
    logo: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    corPrimaria: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    corSecundaria: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tema: z.ZodOptional<z.ZodOptional<z.ZodEnum<["light", "dark"]>>>;
}, "strip", z.ZodTypeAny, {
    nome?: string | undefined;
    tipo?: TipoClinica | undefined;
    logo?: string | undefined;
    corPrimaria?: string | undefined;
    corSecundaria?: string | undefined;
    tema?: "light" | "dark" | undefined;
}, {
    nome?: string | undefined;
    tipo?: TipoClinica | undefined;
    logo?: string | undefined;
    corPrimaria?: string | undefined;
    corSecundaria?: string | undefined;
    tema?: "light" | "dark" | undefined;
}>;
export declare const ClinicaFiltersSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    tipo: z.ZodOptional<z.ZodNativeEnum<typeof TipoClinica>>;
    ativo: z.ZodOptional<z.ZodBoolean>;
    sortBy: z.ZodOptional<z.ZodEnum<["nome", "tipo", "createdAt", "updatedAt"]>>;
    sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    tipo?: TipoClinica | undefined;
    ativo?: boolean | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: "nome" | "tipo" | "createdAt" | "updatedAt" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}, {
    search?: string | undefined;
    tipo?: TipoClinica | undefined;
    ativo?: boolean | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: "nome" | "tipo" | "createdAt" | "updatedAt" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export declare const ConfiguracoesSchema: z.ZodObject<{
    corPrimaria: z.ZodOptional<z.ZodString>;
    corSecundaria: z.ZodOptional<z.ZodString>;
    tema: z.ZodOptional<z.ZodEnum<["light", "dark"]>>;
    logo: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    logo?: string | undefined;
    corPrimaria?: string | undefined;
    corSecundaria?: string | undefined;
    tema?: "light" | "dark" | undefined;
}, {
    logo?: string | undefined;
    corPrimaria?: string | undefined;
    corSecundaria?: string | undefined;
    tema?: "light" | "dark" | undefined;
}>;
export type CreateClinicaInput = z.infer<typeof CreateClinicaSchema>;
export type UpdateClinicaInput = z.infer<typeof UpdateClinicaSchema>;
export type ClinicaFilters = z.infer<typeof ClinicaFiltersSchema>;
export type ConfiguracoesInput = z.infer<typeof ConfiguracoesSchema>;
export declare class ClinicaValidator {
    /**
     * Valida dados para criação de clínica
     */
    static validateCreate(data: unknown): CreateClinicaInput;
    /**
     * Valida dados para atualização de clínica
     */
    static validateUpdate(data: unknown): UpdateClinicaInput;
    /**
     * Valida filtros de busca
     */
    static validateFilters(data: unknown): ClinicaFilters;
    /**
     * Valida configurações
     */
    static validateConfiguracoes(data: unknown): ConfiguracoesInput;
    /**
     * Valida CNPJ
     */
    static validateCNPJ(cnpj: string): boolean;
    /**
     * Valida CEP
     */
    static validateCEP(cep: string): boolean;
    /**
     * Valida telefone
     */
    static validateTelefone(telefone: string): boolean;
}

import { z } from 'zod';
import { RoleUsuario } from '../../types/enums';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodEffects<z.ZodString, string, string>;
    senha: z.ZodEffects<z.ZodString, string, string>;
    tenantId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    senha: string;
    tenantId?: string | undefined;
}, {
    email: string;
    senha: string;
    tenantId?: string | undefined;
}>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodEffects<z.ZodString, string, string>;
    senha: z.ZodEffects<z.ZodString, string, string>;
    role: z.ZodNativeEnum<typeof RoleUsuario>;
    tenantId: z.ZodString;
    profissionalId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    email: string;
    senha: string;
    role: RoleUsuario;
    profissionalId?: string | undefined;
}, {
    tenantId: string;
    email: string;
    senha: string;
    role: RoleUsuario;
    profissionalId?: string | undefined;
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const changePasswordSchema: z.ZodEffects<z.ZodObject<{
    senhaAtual: z.ZodString;
    novaSenha: z.ZodEffects<z.ZodString, string, string>;
    confirmarNovaSenha: z.ZodString;
}, "strip", z.ZodTypeAny, {
    senhaAtual: string;
    novaSenha: string;
    confirmarNovaSenha: string;
}, {
    senhaAtual: string;
    novaSenha: string;
    confirmarNovaSenha: string;
}>, {
    senhaAtual: string;
    novaSenha: string;
    confirmarNovaSenha: string;
}, {
    senhaAtual: string;
    novaSenha: string;
    confirmarNovaSenha: string;
}>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const resetPasswordSchema: z.ZodEffects<z.ZodObject<{
    token: z.ZodString;
    novaSenha: z.ZodEffects<z.ZodString, string, string>;
    confirmarNovaSenha: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
    novaSenha: string;
    confirmarNovaSenha: string;
}, {
    token: string;
    novaSenha: string;
    confirmarNovaSenha: string;
}>, {
    token: string;
    novaSenha: string;
    confirmarNovaSenha: string;
}, {
    token: string;
    novaSenha: string;
    confirmarNovaSenha: string;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export declare class AuthValidator {
    /**
     * Valida dados de login
     */
    static validateLogin(data: unknown): LoginInput;
    /**
     * Valida dados de registro
     */
    static validateRegister(data: unknown): RegisterInput;
    /**
     * Valida refresh token
     */
    static validateRefreshToken(data: unknown): RefreshTokenInput;
    /**
     * Valida alteração de senha
     */
    static validateChangePassword(data: unknown): ChangePasswordInput;
    /**
     * Valida recuperação de senha
     */
    static validateForgotPassword(data: unknown): ForgotPasswordInput;
    /**
     * Valida reset de senha
     */
    static validateResetPassword(data: unknown): ResetPasswordInput;
    /**
     * Valida força da senha
     */
    static validatePasswordStrength(senha: string): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Valida email
     */
    static validateEmail(email: string): boolean;
    /**
     * Sanitiza dados de entrada
     */
    static sanitizeInput(data: Record<string, any>): Record<string, any>;
}

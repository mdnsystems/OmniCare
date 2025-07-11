// =============================================================================
// VALIDAÇÕES - MÓDULO DE AUTENTICAÇÃO
// =============================================================================
// 
// Validações Zod para operações de autenticação
// Garante integridade e segurança dos dados de entrada
//
// =============================================================================

import { z } from 'zod';
import { RoleUsuario } from '../../types/enums';

// =============================================================================
// SCHEMAS DE VALIDAÇÃO
// =============================================================================

// Função para validar força da senha
const validatePasswordStrength = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
};

// Função para validar email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 100;
};

// Schema para login
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email é obrigatório')
    .refine(validateEmail, 'Email inválido'),
  senha: z.string()
    .min(1, 'Senha é obrigatória')
    .refine(validatePasswordStrength, 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número'),
  tenantId: z.string().optional(),
});

// Schema para registro
export const registerSchema = z.object({
  email: z.string()
    .min(1, 'Email é obrigatório')
    .refine(validateEmail, 'Email inválido'),
  senha: z.string()
    .min(1, 'Senha é obrigatória')
    .refine(validatePasswordStrength, 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número'),
  role: z.nativeEnum(RoleUsuario),
  tenantId: z.string().uuid('TenantId deve ser um UUID válido'),
  profissionalId: z.string().uuid('ProfissionalId deve ser um UUID válido').optional(),
});

// Schema para refresh token
export const refreshTokenSchema = z.object({
  refreshToken: z.string()
    .min(1, 'Refresh token é obrigatório'),
});

// Schema para alteração de senha
export const changePasswordSchema = z.object({
  senhaAtual: z.string()
    .min(1, 'Senha atual é obrigatória'),
  novaSenha: z.string()
    .min(1, 'Nova senha é obrigatória')
    .refine(validatePasswordStrength, 'Nova senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número'),
  confirmarNovaSenha: z.string()
    .min(1, 'Confirmação da nova senha é obrigatória'),
}).refine((data) => data.novaSenha === data.confirmarNovaSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarNovaSenha'],
});

// Schema para recuperação de senha
export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email é obrigatório')
    .refine(validateEmail, 'Email inválido'),
});

// Schema para reset de senha
export const resetPasswordSchema = z.object({
  token: z.string()
    .min(1, 'Token é obrigatório'),
  novaSenha: z.string()
    .min(1, 'Nova senha é obrigatória')
    .refine(validatePasswordStrength, 'Nova senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número'),
  confirmarNovaSenha: z.string()
    .min(1, 'Confirmação da nova senha é obrigatória'),
}).refine((data) => data.novaSenha === data.confirmarNovaSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarNovaSenha'],
});

// =============================================================================
// TIPOS INFERIDOS
// =============================================================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// =============================================================================
// VALIDADORES
// =============================================================================

export class AuthValidator {
  /**
   * Valida dados de login
   */
  static validateLogin(data: unknown): LoginInput {
    return loginSchema.parse(data);
  }

  /**
   * Valida dados de registro
   */
  static validateRegister(data: unknown): RegisterInput {
    return registerSchema.parse(data);
  }

  /**
   * Valida refresh token
   */
  static validateRefreshToken(data: unknown): RefreshTokenInput {
    return refreshTokenSchema.parse(data);
  }

  /**
   * Valida alteração de senha
   */
  static validateChangePassword(data: unknown): ChangePasswordInput {
    return changePasswordSchema.parse(data);
  }

  /**
   * Valida recuperação de senha
   */
  static validateForgotPassword(data: unknown): ForgotPasswordInput {
    return forgotPasswordSchema.parse(data);
  }

  /**
   * Valida reset de senha
   */
  static validateResetPassword(data: unknown): ResetPasswordInput {
    return resetPasswordSchema.parse(data);
  }

  /**
   * Valida força da senha
   */
  static validatePasswordStrength(senha: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (senha.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (senha.length < 8) {
      errors.push('Senha deve ter pelo menos 8 caracteres para maior segurança');
    }

    if (!/[A-Z]/.test(senha)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(senha)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }

    if (!/\d/.test(senha)) {
      errors.push('Senha deve conter pelo menos um número');
    }

    // Removida validação de caracteres especiais para compatibilidade
    // if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
    //   errors.push('Senha deve conter pelo menos um caractere especial');
    // }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valida email
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sanitiza dados de entrada
   */
  static sanitizeInput(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        // Remove espaços em branco no início e fim
        sanitized[key] = value.trim();
        
        // Converte email para minúsculas
        if (key === 'email') {
          sanitized[key] = sanitized[key].toLowerCase();
        }
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
} 
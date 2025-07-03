"use strict";
// =============================================================================
// VALIDAÇÕES - MÓDULO DE AUTENTICAÇÃO
// =============================================================================
// 
// Validações Zod para operações de autenticação
// Garante integridade e segurança dos dados de entrada
//
// =============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidator = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.changePasswordSchema = exports.refreshTokenSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../types/enums");
// =============================================================================
// SCHEMAS DE VALIDAÇÃO
// =============================================================================
// Função para validar força da senha
const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
};
// Função para validar email
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 100;
};
// Schema para login
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string()
        .min(1, 'Email é obrigatório')
        .refine(validateEmail, 'Email inválido'),
    senha: zod_1.z.string()
        .min(1, 'Senha é obrigatória')
        .refine(validatePasswordStrength, 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número'),
    tenantId: zod_1.z.string().optional(),
});
// Schema para registro
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string()
        .min(1, 'Email é obrigatório')
        .refine(validateEmail, 'Email inválido'),
    senha: zod_1.z.string()
        .min(1, 'Senha é obrigatória')
        .refine(validatePasswordStrength, 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número'),
    role: zod_1.z.nativeEnum(enums_1.RoleUsuario),
    tenantId: zod_1.z.string().uuid('TenantId deve ser um UUID válido'),
    profissionalId: zod_1.z.string().uuid('ProfissionalId deve ser um UUID válido').optional(),
});
// Schema para refresh token
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string()
        .min(1, 'Refresh token é obrigatório'),
});
// Schema para alteração de senha
exports.changePasswordSchema = zod_1.z.object({
    senhaAtual: zod_1.z.string()
        .min(1, 'Senha atual é obrigatória'),
    novaSenha: zod_1.z.string()
        .min(1, 'Nova senha é obrigatória')
        .refine(validatePasswordStrength, 'Nova senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número'),
    confirmarNovaSenha: zod_1.z.string()
        .min(1, 'Confirmação da nova senha é obrigatória'),
}).refine((data) => data.novaSenha === data.confirmarNovaSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarNovaSenha'],
});
// Schema para recuperação de senha
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string()
        .min(1, 'Email é obrigatório')
        .refine(validateEmail, 'Email inválido'),
});
// Schema para reset de senha
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string()
        .min(1, 'Token é obrigatório'),
    novaSenha: zod_1.z.string()
        .min(1, 'Nova senha é obrigatória')
        .refine(validatePasswordStrength, 'Nova senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número'),
    confirmarNovaSenha: zod_1.z.string()
        .min(1, 'Confirmação da nova senha é obrigatória'),
}).refine((data) => data.novaSenha === data.confirmarNovaSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarNovaSenha'],
});
// =============================================================================
// VALIDADORES
// =============================================================================
class AuthValidator {
    /**
     * Valida dados de login
     */
    static validateLogin(data) {
        return exports.loginSchema.parse(data);
    }
    /**
     * Valida dados de registro
     */
    static validateRegister(data) {
        return exports.registerSchema.parse(data);
    }
    /**
     * Valida refresh token
     */
    static validateRefreshToken(data) {
        return exports.refreshTokenSchema.parse(data);
    }
    /**
     * Valida alteração de senha
     */
    static validateChangePassword(data) {
        return exports.changePasswordSchema.parse(data);
    }
    /**
     * Valida recuperação de senha
     */
    static validateForgotPassword(data) {
        return exports.forgotPasswordSchema.parse(data);
    }
    /**
     * Valida reset de senha
     */
    static validateResetPassword(data) {
        return exports.resetPasswordSchema.parse(data);
    }
    /**
     * Valida força da senha
     */
    static validatePasswordStrength(senha) {
        const errors = [];
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
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
            errors.push('Senha deve conter pelo menos um caractere especial');
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    /**
     * Valida email
     */
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    /**
     * Sanitiza dados de entrada
     */
    static sanitizeInput(data) {
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                // Remove espaços em branco no início e fim
                sanitized[key] = value.trim();
                // Converte email para minúsculas
                if (key === 'email') {
                    sanitized[key] = sanitized[key].toLowerCase();
                }
            }
            else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
}
exports.AuthValidator = AuthValidator;
//# sourceMappingURL=validation.js.map
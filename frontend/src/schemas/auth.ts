import * as z from 'zod';

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

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .refine(validateEmail, 'Email inválido'),
  senha: z
    .string()
    .min(1, 'Senha é obrigatória')
    .refine(validatePasswordStrength, 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número'),
});

export const changePasswordSchema = z.object({
  senhaAtual: z
    .string()
    .min(1, 'Senha atual é obrigatória'),
  novaSenha: z
    .string()
    .min(1, 'Nova senha é obrigatória')
    .refine(validatePasswordStrength, 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número'),
  confirmarNovaSenha: z
    .string()
    .min(1, 'Confirmação da nova senha é obrigatória'),
}).refine((data) => data.novaSenha === data.confirmarNovaSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarNovaSenha'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>; 
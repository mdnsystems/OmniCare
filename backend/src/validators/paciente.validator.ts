import { z } from 'zod';

// Função para validar CPF
const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

// Função para validar telefone brasileiro
const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

// Função para validar CEP brasileiro
const validateCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
};

export const pacienteSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  dataNascimento: z.string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 0 && age <= 120;
    }, 'Data de nascimento inválida'),
  
  cpf: z.string()
    .refine(validateCPF, 'CPF inválido'),
  
  telefone: z.string()
    .refine(validatePhone, 'Telefone inválido'),
  
  email: z.string()
    .email('Email inválido')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  
  endereco: z.string()
    .min(5, 'Endereço deve ter pelo menos 5 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres'),
  
  numero: z.string()
    .min(1, 'Número é obrigatório')
    .max(10, 'Número deve ter no máximo 10 caracteres'),
  
  complemento: z.string()
    .max(100, 'Complemento deve ter no máximo 100 caracteres')
    .optional(),
  
  bairro: z.string()
    .min(2, 'Bairro deve ter pelo menos 2 caracteres')
    .max(100, 'Bairro deve ter no máximo 100 caracteres'),
  
  cep: z.string()
    .refine(validateCEP, 'CEP inválido'),
  
  cidade: z.string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres'),
  
  estado: z.string()
    .length(2, 'Estado deve ter exatamente 2 caracteres')
    .regex(/^[A-Z]{2}$/, 'Estado deve ser a sigla em maiúsculas'),
  
  pais: z.string()
    .min(2, 'País deve ter pelo menos 2 caracteres')
    .max(50, 'País deve ter no máximo 50 caracteres'),
  
  convenioNome: z.string()
    .min(2, 'Nome do convênio deve ter pelo menos 2 caracteres')
    .max(100, 'Nome do convênio deve ter no máximo 100 caracteres'),
  
  convenioNumero: z.string()
    .min(1, 'Número do convênio é obrigatório')
    .max(50, 'Número do convênio deve ter no máximo 50 caracteres'),
  
  convenioPlano: z.string()
    .min(2, 'Plano do convênio deve ter pelo menos 2 caracteres')
    .max(100, 'Plano do convênio deve ter no máximo 100 caracteres'),
  
  convenioValidade: z.string()
    .refine((date) => {
      const validityDate = new Date(date);
      const today = new Date();
      return validityDate >= today;
    }, 'Data de validade do convênio deve ser futura'),
  
  profissionalId: z.string()
    .uuid('ID do profissional deve ser um UUID válido'),
});

export type PacienteInput = z.infer<typeof pacienteSchema>; 
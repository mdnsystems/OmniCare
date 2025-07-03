import * as z from "zod";

export const pacienteSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  dataNascimento: z.date({
    required_error: "Data de nascimento é obrigatória",
  }),
  cpf: z.string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF deve ter no máximo 14 caracteres")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato 000.000.000-00"),
  telefone: z.string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone deve estar no formato (00) 00000-0000"),
  email: z.string().email("Email inválido"),
  
  // Endereço
  endereco: z.string().min(3, "Endereço deve ter pelo menos 3 caracteres"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres"),
  cep: z.string()
    .min(8, "CEP deve ter 8 dígitos")
    .regex(/^\d{5}-\d{3}$/, "CEP deve estar no formato 00000-000"),
  cidade: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  estado: z.string().length(2, "Estado deve ter 2 caracteres"),
  pais: z.string().min(2, "País deve ter pelo menos 2 caracteres"),
  
  // Convênio
  convenioNome: z.string().min(2, "Nome do convênio deve ter pelo menos 2 caracteres"),
  convenioNumero: z.string().min(1, "Número do convênio é obrigatório"),
  convenioPlano: z.string().min(2, "Plano do convênio deve ter pelo menos 2 caracteres"),
  convenioValidade: z.date({
    required_error: "Data de validade do convênio é obrigatória",
  }),
  
  // Profissional responsável
  profissionalId: z.string().min(1, "Profissional responsável é obrigatório"),
});

export type PacienteFormValues = z.infer<typeof pacienteSchema>;

// Schema para validação de CPF
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, "");
  
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

// Função para formatar CPF
export const formatCPF = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");
  return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

// Função para formatar telefone
export const formatPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");
  if (cleanValue.length <= 10) {
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
};

// Função para formatar CEP
export const formatCEP = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");
  return cleanValue.replace(/(\d{5})(\d{3})/, "$1-$2");
}; 
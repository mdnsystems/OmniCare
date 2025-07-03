import * as z from "zod";

export const profissionalSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone deve estar no formato (00) 00000-0000"),
  dataNascimento: z.date({
    required_error: "Data de nascimento é obrigatória",
  }).or(z.null()),
  cpf: z.string().optional(),
  crm: z.string().optional(),
  especialidadeId: z.string().min(1, "Especialidade é obrigatória"),
  
  // Endereço
  endereco: z.object({
    cep: z.string()
      .min(8, "CEP deve ter 8 dígitos")
      .regex(/^\d{5}-\d{3}$/, "CEP deve estar no formato 00000-000"),
    logradouro: z.string().min(3, "Logradouro deve ter pelo menos 3 caracteres"),
    numero: z.string().min(1, "Número é obrigatório"),
    complemento: z.string().optional(),
    bairro: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres"),
    cidade: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
    estado: z.string().length(2, "Estado deve ter 2 caracteres"),
  }),
  
  formacao: z.string().optional(),
  experiencia: z.string().optional(),
  observacoes: z.string().optional(),
  
  // Horários de trabalho
  horarios: z.object({
    segunda: z.object({ inicio: z.string(), fim: z.string() }),
    terca: z.object({ inicio: z.string(), fim: z.string() }),
    quarta: z.object({ inicio: z.string(), fim: z.string() }),
    quinta: z.object({ inicio: z.string(), fim: z.string() }),
    sexta: z.object({ inicio: z.string(), fim: z.string() }),
    sabado: z.object({ inicio: z.string(), fim: z.string() }),
    domingo: z.object({ inicio: z.string(), fim: z.string() }),
  }),
  
  status: z.enum(["ATIVO", "INATIVO", "FERIAS", "LICENCA"], {
    required_error: "Status é obrigatório",
  }),
});

export type ProfissionalFormValues = z.infer<typeof profissionalSchema>;

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
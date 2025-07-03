import { z } from 'zod';
import { ProfissionalStatus } from '../types/enums';

export const profissionalSchema = z.object({
  nome: z.string().min(3),
  especialidadeId: z.string().uuid(),
  registro: z.string(),
  crm: z.string(),
  email: z.string().email(),
  telefone: z.string(),
  sexo: z.string(),
  dataNascimento: z.string(),
  dataContratacao: z.string(),
  status: z.nativeEnum(ProfissionalStatus),
  rua: z.string(),
  numero: z.string(),
  complemento: z.string().optional(),
  bairro: z.string(),
  cidade: z.string(),
  estado: z.string().length(2),
  cep: z.string(),
  horarioInicio: z.string(),
  horarioFim: z.string(),
  intervalo: z.string(),
  diasTrabalho: z.array(z.string()),
});

export type ProfissionalInput = z.infer<typeof profissionalSchema>; 
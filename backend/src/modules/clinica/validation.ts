// =============================================================================
// VALIDAÇÕES - MÓDULO DE CLÍNICAS
// =============================================================================
// 
// Validações Zod para operações de clínicas
// Garante integridade e consistência dos dados
//
// =============================================================================

import { z } from 'zod';
import { TipoClinica } from '../../types/enums';

// =============================================================================
// SCHEMAS DE VALIDAÇÃO
// =============================================================================

// Schema para criação de clínica
export const CreateClinicaSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  tipo: z.nativeEnum(TipoClinica),
  logo: z.string().url('URL do logo inválida').optional(),
  corPrimaria: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor primária deve ser um código hexadecimal válido').optional(),
  corSecundaria: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor secundária deve ser um código hexadecimal válido').optional(),
  tema: z.enum(['light', 'dark']).optional(),
});

// Schema para atualização de clínica
export const UpdateClinicaSchema = CreateClinicaSchema.partial();

// Schema para filtros de busca
export const ClinicaFiltersSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  tipo: z.nativeEnum(TipoClinica).optional(),
  ativo: z.boolean().optional(),
  sortBy: z.enum(['nome', 'tipo', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Schema para configurações
export const ConfiguracoesSchema = z.object({
  corPrimaria: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor primária deve ser um código hexadecimal válido').optional(),
  corSecundaria: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor secundária deve ser um código hexadecimal válido').optional(),
  tema: z.enum(['light', 'dark']).optional(),
  logo: z.string().url('URL do logo inválida').optional(),
});

// =============================================================================
// TIPOS INFERIDOS
// =============================================================================

export type CreateClinicaInput = z.infer<typeof CreateClinicaSchema>;
export type UpdateClinicaInput = z.infer<typeof UpdateClinicaSchema>;
export type ClinicaFilters = z.infer<typeof ClinicaFiltersSchema>;
export type ConfiguracoesInput = z.infer<typeof ConfiguracoesSchema>;

// =============================================================================
// VALIDADORES
// =============================================================================

export class ClinicaValidator {
  /**
   * Valida dados para criação de clínica
   */
  static validateCreate(data: unknown): CreateClinicaInput {
    return CreateClinicaSchema.parse(data);
  }

  /**
   * Valida dados para atualização de clínica
   */
  static validateUpdate(data: unknown): UpdateClinicaInput {
    return UpdateClinicaSchema.parse(data);
  }

  /**
   * Valida filtros de busca
   */
  static validateFilters(data: unknown): ClinicaFilters {
    return ClinicaFiltersSchema.parse(data);
  }

  /**
   * Valida configurações
   */
  static validateConfiguracoes(data: unknown): ConfiguracoesInput {
    return ConfiguracoesSchema.parse(data);
  }

  /**
   * Valida CNPJ
   */
  static validateCNPJ(cnpj: string): boolean {
    // Remove caracteres não numéricos
    const cnpjLimpo = cnpj.replace(/\D/g, '');

    // Verifica se tem 14 dígitos
    if (cnpjLimpo.length !== 14) {
      return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpjLimpo)) {
      return false;
    }

    // Validação dos dígitos verificadores
    let soma = 0;
    let peso = 2;

    // Primeiro dígito verificador
    for (let i = 11; i >= 0; i--) {
      soma += parseInt(cnpjLimpo.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }

    let digito = 11 - (soma % 11);
    if (digito > 9) digito = 0;

    if (parseInt(cnpjLimpo.charAt(12)) !== digito) {
      return false;
    }

    // Segundo dígito verificador
    soma = 0;
    peso = 2;

    for (let i = 12; i >= 0; i--) {
      soma += parseInt(cnpjLimpo.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }

    digito = 11 - (soma % 11);
    if (digito > 9) digito = 0;

    return parseInt(cnpjLimpo.charAt(13)) === digito;
  }

  /**
   * Valida CEP
   */
  static validateCEP(cep: string): boolean {
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.length === 8;
  }

  /**
   * Valida telefone
   */
  static validateTelefone(telefone: string): boolean {
    const telefoneLimpo = telefone.replace(/\D/g, '');
    return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
  }
} 
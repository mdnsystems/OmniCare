"use strict";
// =============================================================================
// VALIDAÇÕES - MÓDULO DE CLÍNICAS
// =============================================================================
// 
// Validações Zod para operações de clínicas
// Garante integridade e consistência dos dados
//
// =============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicaValidator = exports.ConfiguracoesSchema = exports.ClinicaFiltersSchema = exports.UpdateClinicaSchema = exports.CreateClinicaSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../types/enums");
// =============================================================================
// SCHEMAS DE VALIDAÇÃO
// =============================================================================
// Schema para criação de clínica
exports.CreateClinicaSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
    tipo: zod_1.z.nativeEnum(enums_1.TipoClinica),
    logo: zod_1.z.string().url('URL do logo inválida').optional(),
    corPrimaria: zod_1.z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor primária deve ser um código hexadecimal válido').optional(),
    corSecundaria: zod_1.z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor secundária deve ser um código hexadecimal válido').optional(),
    tema: zod_1.z.enum(['light', 'dark']).optional(),
});
// Schema para atualização de clínica
exports.UpdateClinicaSchema = exports.CreateClinicaSchema.partial();
// Schema para filtros de busca
exports.ClinicaFiltersSchema = zod_1.z.object({
    page: zod_1.z.number().min(1).optional(),
    limit: zod_1.z.number().min(1).max(100).optional(),
    search: zod_1.z.string().optional(),
    tipo: zod_1.z.nativeEnum(enums_1.TipoClinica).optional(),
    ativo: zod_1.z.boolean().optional(),
    sortBy: zod_1.z.enum(['nome', 'tipo', 'createdAt', 'updatedAt']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
});
// Schema para configurações
exports.ConfiguracoesSchema = zod_1.z.object({
    corPrimaria: zod_1.z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor primária deve ser um código hexadecimal válido').optional(),
    corSecundaria: zod_1.z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor secundária deve ser um código hexadecimal válido').optional(),
    tema: zod_1.z.enum(['light', 'dark']).optional(),
    logo: zod_1.z.string().url('URL do logo inválida').optional(),
});
// =============================================================================
// VALIDADORES
// =============================================================================
class ClinicaValidator {
    /**
     * Valida dados para criação de clínica
     */
    static validateCreate(data) {
        return exports.CreateClinicaSchema.parse(data);
    }
    /**
     * Valida dados para atualização de clínica
     */
    static validateUpdate(data) {
        return exports.UpdateClinicaSchema.parse(data);
    }
    /**
     * Valida filtros de busca
     */
    static validateFilters(data) {
        return exports.ClinicaFiltersSchema.parse(data);
    }
    /**
     * Valida configurações
     */
    static validateConfiguracoes(data) {
        return exports.ConfiguracoesSchema.parse(data);
    }
    /**
     * Valida CNPJ
     */
    static validateCNPJ(cnpj) {
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
        if (digito > 9)
            digito = 0;
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
        if (digito > 9)
            digito = 0;
        return parseInt(cnpjLimpo.charAt(13)) === digito;
    }
    /**
     * Valida CEP
     */
    static validateCEP(cep) {
        const cepLimpo = cep.replace(/\D/g, '');
        return cepLimpo.length === 8;
    }
    /**
     * Valida telefone
     */
    static validateTelefone(telefone) {
        const telefoneLimpo = telefone.replace(/\D/g, '');
        return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
    }
}
exports.ClinicaValidator = ClinicaValidator;
//# sourceMappingURL=validation.js.map
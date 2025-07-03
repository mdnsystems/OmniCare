"use strict";
// =============================================================================
// UTILITÁRIOS DE TENANT - SWIFT CLINIC API
// =============================================================================
// 
// Utilitários para gerenciamento de tenant IDs
// Geração de IDs únicos e validações
//
// =============================================================================
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantUtils = void 0;
const database_1 = require("../config/database");
class TenantUtils {
    /**
     * Gera um tenant ID único baseado no nome da clínica
     */
    static generateTenantId(nome) {
        // Remove acentos e caracteres especiais
        const nomeNormalizado = nome
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .trim();
        // Gera um sufixo único com timestamp
        const timestamp = Date.now().toString(36);
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        return `${nomeNormalizado}-${timestamp}-${randomSuffix}`;
    }
    /**
     * Verifica se um tenant ID já existe
     */
    static isTenantIdUnique(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingClinica = yield database_1.prisma.clinica.findUnique({
                where: { tenantId },
                select: { id: true },
            });
            return !existingClinica;
        });
    }
    /**
     * Gera um tenant ID único garantindo que não existe no banco
     */
    static generateUniqueTenantId(nome) {
        return __awaiter(this, void 0, void 0, function* () {
            let tenantId;
            let attempts = 0;
            const maxAttempts = 10;
            do {
                tenantId = this.generateTenantId(nome);
                attempts++;
                if (attempts > maxAttempts) {
                    throw new Error('Não foi possível gerar um tenant ID único após várias tentativas');
                }
            } while (!(yield this.isTenantIdUnique(tenantId)));
            return tenantId;
        });
    }
    /**
     * Valida formato de um tenant ID
     */
    static validateTenantId(tenantId) {
        // Deve ter pelo menos 10 caracteres e no máximo 100
        if (tenantId.length < 10 || tenantId.length > 100) {
            return false;
        }
        // Deve conter apenas letras minúsculas, números e hífens
        const validFormat = /^[a-z0-9-]+$/.test(tenantId);
        if (!validFormat) {
            return false;
        }
        // Não deve começar ou terminar com hífen
        if (tenantId.startsWith('-') || tenantId.endsWith('-')) {
            return false;
        }
        // Não deve ter hífens consecutivos
        if (tenantId.includes('--')) {
            return false;
        }
        return true;
    }
}
exports.TenantUtils = TenantUtils;
//# sourceMappingURL=tenant.js.map
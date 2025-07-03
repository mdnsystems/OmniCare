// =============================================================================
// UTILITÁRIOS DE TENANT - SWIFT CLINIC API
// =============================================================================
// 
// Utilitários para gerenciamento de tenant IDs
// Geração de IDs únicos e validações
//
// =============================================================================

import { prisma } from '../config/database';

export class TenantUtils {
  /**
   * Gera um tenant ID único baseado no nome da clínica
   */
  static generateTenantId(nome: string): string {
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
  static async isTenantIdUnique(tenantId: string): Promise<boolean> {
    const existingClinica = await prisma.clinica.findUnique({
      where: { tenantId },
      select: { id: true },
    });

    return !existingClinica;
  }

  /**
   * Gera um tenant ID único garantindo que não existe no banco
   */
  static async generateUniqueTenantId(nome: string): Promise<string> {
    let tenantId: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      tenantId = this.generateTenantId(nome);
      attempts++;

      if (attempts > maxAttempts) {
        throw new Error('Não foi possível gerar um tenant ID único após várias tentativas');
      }
    } while (!(await this.isTenantIdUnique(tenantId)));

    return tenantId;
  }

  /**
   * Valida formato de um tenant ID
   */
  static validateTenantId(tenantId: string): boolean {
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
// =============================================================================
// CONFIGURAÇÃO DO BANCO DE DADOS - SWIFT CLINIC API
// =============================================================================
// 
// Configuração centralizada do Prisma Client
// Implementa singleton pattern para conexão com o banco
// Otimizado para performance com connection pooling
//
// =============================================================================

import { PrismaClient } from '../../generated/prisma';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Configuração simplificada do Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' 
      ? ['error', 'warn']
      : ['query', 'error', 'warn'],
  });
};

// Em desenvolvimento, reutiliza a instância para evitar múltiplas conexões
const globalForPrisma = globalThis as unknown as {
  __prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.__prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}

export default prisma; 
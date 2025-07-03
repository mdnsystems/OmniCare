"use strict";
// =============================================================================
// CONFIGURAÇÃO DO BANCO DE DADOS - SWIFT CLINIC API
// =============================================================================
// 
// Configuração centralizada do Prisma Client
// Implementa singleton pattern para conexão com o banco
// Otimizado para performance com connection pooling
//
// =============================================================================
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const prisma_1 = require("../../generated/prisma");
// Configuração simplificada do Prisma Client
const prismaClientSingleton = () => {
    return new prisma_1.PrismaClient({
        log: process.env.NODE_ENV === 'production'
            ? ['error', 'warn']
            : ['query', 'error', 'warn'],
    });
};
// Em desenvolvimento, reutiliza a instância para evitar múltiplas conexões
const globalForPrisma = globalThis;
exports.prisma = (_a = globalForPrisma.__prisma) !== null && _a !== void 0 ? _a : prismaClientSingleton();
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.__prisma = exports.prisma;
}
exports.default = exports.prisma;
//# sourceMappingURL=database.js.map
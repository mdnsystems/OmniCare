#!/usr/bin/env node

/**
 * Script para gerar secrets seguros para JWT
 * 
 * Uso:
 * node scripts/generate-secrets.js
 * 
 * Este script gera secrets aleatórios e seguros para uso em produção
 */

const crypto = require('crypto');

console.log('🔐 Gerando secrets seguros para JWT...\n');

// Gerar JWT_SECRET (mínimo 32 caracteres)
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET=' + jwtSecret);

// Gerar JWT_REFRESH_SECRET (mínimo 32 caracteres)
const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_REFRESH_SECRET=' + jwtRefreshSecret);

// Gerar outros secrets úteis
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('SESSION_SECRET=' + sessionSecret);

const apiKey = crypto.randomBytes(32).toString('hex');
console.log('API_KEY=' + apiKey);

console.log('\n✅ Secrets gerados com sucesso!');
console.log('\n📝 Instruções:');
console.log('1. Copie estes valores para seu arquivo .env');
console.log('2. Nunca compartilhe ou commite estes secrets');
console.log('3. Use valores diferentes para cada ambiente (dev, staging, prod)');
console.log('4. Rotacione os secrets periodicamente em produção');
console.log('\n⚠️  IMPORTANTE: Estes secrets são únicos e seguros. Guarde-os com segurança!'); 
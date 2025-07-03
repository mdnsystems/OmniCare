// =============================================================================
// UTILIDADES JWT - SWIFT CLINIC API
// =============================================================================
// 
// Funções para geração, validação e decodificação de tokens JWT
// Implementa autenticação segura com expiração e refresh tokens
//
// =============================================================================

import { sign, verify, decode, Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { JwtPayload, RoleUsuario } from '../types/enums';

// Validação rigorosa de secrets obrigatórios
const validateSecrets = () => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error('JWT_SECRET deve ser configurado com pelo menos 32 caracteres');
  }
  
  if (!jwtRefreshSecret || jwtRefreshSecret.length < 32) {
    throw new Error('JWT_REFRESH_SECRET deve ser configurado com pelo menos 32 caracteres');
  }
  
  // Verificar se não são secrets padrão
  const defaultSecrets = [
    'swift-clinic-secret-key-2024',
    'swift-clinic-refresh-secret-2024',
    'default-secret',
    'secret',
    'key'
  ];
  
  if (defaultSecrets.includes(jwtSecret) || defaultSecrets.includes(jwtRefreshSecret)) {
    throw new Error('JWT_SECRET e JWT_REFRESH_SECRET devem ser valores únicos e seguros');
  }
  
  return { jwtSecret, jwtRefreshSecret };
};

const { jwtSecret, jwtRefreshSecret } = validateSecrets();

const JWT_SECRET: Secret = jwtSecret;
const JWT_REFRESH_SECRET: Secret = jwtRefreshSecret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

/**
 * Converte uma string de tempo para o formato aceito pelo JWT
 * Aceita formatos como: '1h', '7d', '3600s', '86400' (segundos)
 */
const parseExpirationTime = (timeString: string): string | number => {
  // Se for apenas números, assume que são segundos
  if (/^\d+$/.test(timeString)) {
    return parseInt(timeString);
  }
  
  // Se já tem unidade (h, d, s, etc.), retorna como string
  // Valida se é um formato aceito pelo JWT
  if (/^\d+[dhms]$/.test(timeString)) {
    return timeString;
  }
  
  // Fallback para formato padrão
  return '1h';
};

// =============================================================================
// GERAÇÃO DE TOKENS
// =============================================================================

export const generateAccessToken = (payload: JwtPayload): string => {
  const expirationTime = parseExpirationTime(JWT_EXPIRES_IN);
  const options: SignOptions = {
    expiresIn: typeof expirationTime === 'number' ? expirationTime : (expirationTime as any),
    issuer: 'swift-clinic-api',
    audience: 'swift-clinic-users',
    algorithm: 'HS256'
  };

  return sign(payload, JWT_SECRET, options);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  const expirationTime = parseExpirationTime(JWT_REFRESH_EXPIRES_IN);
  const options: SignOptions = {
    expiresIn: typeof expirationTime === 'number' ? expirationTime : (expirationTime as any),
    issuer: 'swift-clinic-api',
    audience: 'swift-clinic-users',
    algorithm: 'HS256'
  };

  return sign(payload, JWT_REFRESH_SECRET, options);
};

// =============================================================================
// GERAÇÃO DE TOKENS COMBINADOS
// =============================================================================

export const generateTokens = (
  userId: string,
  tenantId: string,
  role: RoleUsuario,
  email: string
) => {
  const payload: JwtPayload = {
    userId,
    tenantId,
    role,
    email,
    iat: Math.floor(Date.now() / 1000)
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    token: accessToken,
    refreshToken,
    expiresIn: 3600, // 1 hora em segundos
    refreshExpiresIn: 604800 // 7 dias em segundos
  };
};

// =============================================================================
// VALIDAÇÃO DE TOKENS
// =============================================================================

export const verifyAccessToken = (token: string): JwtPayload => {
  const options: VerifyOptions = {
    issuer: 'swift-clinic-api',
    audience: 'swift-clinic-users',
    algorithms: ['HS256']
  };

  return verify(token, JWT_SECRET, options) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const options: VerifyOptions = {
    issuer: 'swift-clinic-api',
    audience: 'swift-clinic-users',
    algorithms: ['HS256']
  };

  return verify(token, JWT_REFRESH_SECRET, options) as JwtPayload;
};

// =============================================================================
// DECODIFICAÇÃO DE TOKENS
// =============================================================================

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return decode(token) as JwtPayload;
  } catch (error) {
    return null;
  }
};

// =============================================================================
// UTILIDADES DE AUTORIZAÇÃO
// =============================================================================

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const getTokenExpirationTime = (token: string): Date | null => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

export const extractTokenFromHeader = (authHeader: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove "Bearer " do início
};

// =============================================================================
// GERAÇÃO DE TOKENS ESPECÍFICOS POR ROLE
// =============================================================================

export const generateSuperAdminToken = (userId: string, tenantId: string): string => {
  const payload: JwtPayload = {
    userId,
    tenantId,
    role: RoleUsuario.SUPER_ADMIN,
    email: '',
    iat: Math.floor(Date.now() / 1000)
  };

  return generateAccessToken(payload);
};

export const generateAdminToken = (userId: string, tenantId: string, email: string): string => {
  const payload: JwtPayload = {
    userId,
    tenantId,
    role: RoleUsuario.ADMIN,
    email,
    iat: Math.floor(Date.now() / 1000)
  };

  return generateAccessToken(payload);
};

export const generateProfissionalToken = (userId: string, tenantId: string, email: string): string => {
  const payload: JwtPayload = {
    userId,
    tenantId,
    role: RoleUsuario.PROFISSIONAL,
    email,
    iat: Math.floor(Date.now() / 1000)
  };

  return generateAccessToken(payload);
};

export const generateRecepcionistaToken = (userId: string, tenantId: string, email: string): string => {
  const payload: JwtPayload = {
    userId,
    tenantId,
    role: RoleUsuario.RECEPCIONISTA,
    email,
    iat: Math.floor(Date.now() / 1000)
  };

  return generateAccessToken(payload);
};

// =============================================================================
// UTILIDADES DE SEGURANÇA
// =============================================================================

/**
 * Gera um token seguro para operações críticas
 */
export const generateSecureToken = (length: number = 32): string => {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Valida se um token tem formato válido
 */
export const isValidTokenFormat = (token: string): boolean => {
  // Verifica se o token tem formato JWT válido (3 partes separadas por ponto)
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  isTokenExpired,
  getTokenExpirationTime,
  extractTokenFromHeader,
  generateSecureToken,
  isValidTokenFormat
}; 
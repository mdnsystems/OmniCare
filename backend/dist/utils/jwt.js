"use strict";
// =============================================================================
// UTILIDADES JWT - SWIFT CLINIC API
// =============================================================================
// 
// Funções para geração, validação e decodificação de tokens JWT
// Implementa autenticação segura com expiração e refresh tokens
//
// =============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidTokenFormat = exports.generateSecureToken = exports.generateRecepcionistaToken = exports.generateProfissionalToken = exports.generateAdminToken = exports.generateSuperAdminToken = exports.extractTokenFromHeader = exports.getTokenExpirationTime = exports.isTokenExpired = exports.decodeToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateTokens = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const enums_1 = require("../types/enums");
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
const JWT_SECRET = jwtSecret;
const JWT_REFRESH_SECRET = jwtRefreshSecret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================
/**
 * Converte uma string de tempo para o formato aceito pelo JWT
 * Aceita formatos como: '1h', '7d', '3600s', '86400' (segundos)
 */
const parseExpirationTime = (timeString) => {
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
const generateAccessToken = (payload) => {
    const expirationTime = parseExpirationTime(JWT_EXPIRES_IN);
    const options = {
        expiresIn: typeof expirationTime === 'number' ? expirationTime : expirationTime,
        issuer: 'swift-clinic-api',
        audience: 'swift-clinic-users',
        algorithm: 'HS256'
    };
    return (0, jsonwebtoken_1.sign)(payload, JWT_SECRET, options);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    const expirationTime = parseExpirationTime(JWT_REFRESH_EXPIRES_IN);
    const options = {
        expiresIn: typeof expirationTime === 'number' ? expirationTime : expirationTime,
        issuer: 'swift-clinic-api',
        audience: 'swift-clinic-users',
        algorithm: 'HS256'
    };
    return (0, jsonwebtoken_1.sign)(payload, JWT_REFRESH_SECRET, options);
};
exports.generateRefreshToken = generateRefreshToken;
// =============================================================================
// GERAÇÃO DE TOKENS COMBINADOS
// =============================================================================
const generateTokens = (userId, tenantId, role, email) => {
    const payload = {
        userId,
        tenantId,
        role,
        email,
        iat: Math.floor(Date.now() / 1000)
    };
    const accessToken = (0, exports.generateAccessToken)(payload);
    const refreshToken = (0, exports.generateRefreshToken)(payload);
    return {
        token: accessToken,
        refreshToken,
        expiresIn: 3600, // 1 hora em segundos
        refreshExpiresIn: 604800 // 7 dias em segundos
    };
};
exports.generateTokens = generateTokens;
// =============================================================================
// VALIDAÇÃO DE TOKENS
// =============================================================================
const verifyAccessToken = (token) => {
    const options = {
        issuer: 'swift-clinic-api',
        audience: 'swift-clinic-users',
        algorithms: ['HS256']
    };
    return (0, jsonwebtoken_1.verify)(token, JWT_SECRET, options);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    const options = {
        issuer: 'swift-clinic-api',
        audience: 'swift-clinic-users',
        algorithms: ['HS256']
    };
    return (0, jsonwebtoken_1.verify)(token, JWT_REFRESH_SECRET, options);
};
exports.verifyRefreshToken = verifyRefreshToken;
// =============================================================================
// DECODIFICAÇÃO DE TOKENS
// =============================================================================
const decodeToken = (token) => {
    try {
        return (0, jsonwebtoken_1.decode)(token);
    }
    catch (error) {
        return null;
    }
};
exports.decodeToken = decodeToken;
// =============================================================================
// UTILIDADES DE AUTORIZAÇÃO
// =============================================================================
const isTokenExpired = (token) => {
    try {
        const decoded = (0, exports.decodeToken)(token);
        if (!decoded || !decoded.exp)
            return true;
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    }
    catch (error) {
        return true;
    }
};
exports.isTokenExpired = isTokenExpired;
const getTokenExpirationTime = (token) => {
    try {
        const decoded = (0, exports.decodeToken)(token);
        if (!decoded || !decoded.exp)
            return null;
        return new Date(decoded.exp * 1000);
    }
    catch (error) {
        return null;
    }
};
exports.getTokenExpirationTime = getTokenExpirationTime;
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7); // Remove "Bearer " do início
};
exports.extractTokenFromHeader = extractTokenFromHeader;
// =============================================================================
// GERAÇÃO DE TOKENS ESPECÍFICOS POR ROLE
// =============================================================================
const generateSuperAdminToken = (userId, tenantId) => {
    const payload = {
        userId,
        tenantId,
        role: enums_1.RoleUsuario.SUPER_ADMIN,
        email: '',
        iat: Math.floor(Date.now() / 1000)
    };
    return (0, exports.generateAccessToken)(payload);
};
exports.generateSuperAdminToken = generateSuperAdminToken;
const generateAdminToken = (userId, tenantId, email) => {
    const payload = {
        userId,
        tenantId,
        role: enums_1.RoleUsuario.ADMIN,
        email,
        iat: Math.floor(Date.now() / 1000)
    };
    return (0, exports.generateAccessToken)(payload);
};
exports.generateAdminToken = generateAdminToken;
const generateProfissionalToken = (userId, tenantId, email) => {
    const payload = {
        userId,
        tenantId,
        role: enums_1.RoleUsuario.PROFISSIONAL,
        email,
        iat: Math.floor(Date.now() / 1000)
    };
    return (0, exports.generateAccessToken)(payload);
};
exports.generateProfissionalToken = generateProfissionalToken;
const generateRecepcionistaToken = (userId, tenantId, email) => {
    const payload = {
        userId,
        tenantId,
        role: enums_1.RoleUsuario.RECEPCIONISTA,
        email,
        iat: Math.floor(Date.now() / 1000)
    };
    return (0, exports.generateAccessToken)(payload);
};
exports.generateRecepcionistaToken = generateRecepcionistaToken;
// =============================================================================
// UTILIDADES DE SEGURANÇA
// =============================================================================
/**
 * Gera um token seguro para operações críticas
 */
const generateSecureToken = (length = 32) => {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex');
};
exports.generateSecureToken = generateSecureToken;
/**
 * Valida se um token tem formato válido
 */
const isValidTokenFormat = (token) => {
    // Verifica se o token tem formato JWT válido (3 partes separadas por ponto)
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
};
exports.isValidTokenFormat = isValidTokenFormat;
exports.default = {
    generateAccessToken: exports.generateAccessToken,
    generateRefreshToken: exports.generateRefreshToken,
    generateTokens: exports.generateTokens,
    verifyAccessToken: exports.verifyAccessToken,
    verifyRefreshToken: exports.verifyRefreshToken,
    decodeToken: exports.decodeToken,
    isTokenExpired: exports.isTokenExpired,
    getTokenExpirationTime: exports.getTokenExpirationTime,
    extractTokenFromHeader: exports.extractTokenFromHeader,
    generateSecureToken: exports.generateSecureToken,
    isValidTokenFormat: exports.isValidTokenFormat
};
//# sourceMappingURL=jwt.js.map
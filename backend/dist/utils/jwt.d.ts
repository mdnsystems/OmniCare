import { JwtPayload, RoleUsuario } from '../types/enums';
export declare const generateAccessToken: (payload: JwtPayload) => string;
export declare const generateRefreshToken: (payload: JwtPayload) => string;
export declare const generateTokens: (userId: string, tenantId: string, role: RoleUsuario, email: string) => {
    token: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
};
export declare const verifyAccessToken: (token: string) => JwtPayload;
export declare const verifyRefreshToken: (token: string) => JwtPayload;
export declare const decodeToken: (token: string) => JwtPayload | null;
export declare const isTokenExpired: (token: string) => boolean;
export declare const getTokenExpirationTime: (token: string) => Date | null;
export declare const extractTokenFromHeader: (authHeader: string) => string | null;
export declare const generateSuperAdminToken: (userId: string, tenantId: string) => string;
export declare const generateAdminToken: (userId: string, tenantId: string, email: string) => string;
export declare const generateProfissionalToken: (userId: string, tenantId: string, email: string) => string;
export declare const generateRecepcionistaToken: (userId: string, tenantId: string, email: string) => string;
/**
 * Gera um token seguro para operações críticas
 */
export declare const generateSecureToken: (length?: number) => string;
/**
 * Valida se um token tem formato válido
 */
export declare const isValidTokenFormat: (token: string) => boolean;
declare const _default: {
    generateAccessToken: (payload: JwtPayload) => string;
    generateRefreshToken: (payload: JwtPayload) => string;
    generateTokens: (userId: string, tenantId: string, role: RoleUsuario, email: string) => {
        token: string;
        refreshToken: string;
        expiresIn: number;
        refreshExpiresIn: number;
    };
    verifyAccessToken: (token: string) => JwtPayload;
    verifyRefreshToken: (token: string) => JwtPayload;
    decodeToken: (token: string) => JwtPayload | null;
    isTokenExpired: (token: string) => boolean;
    getTokenExpirationTime: (token: string) => Date | null;
    extractTokenFromHeader: (authHeader: string) => string | null;
    generateSecureToken: (length?: number) => string;
    isValidTokenFormat: (token: string) => boolean;
};
export default _default;

"use strict";
// =============================================================================
// MIDDLEWARE DE INJEÇÃO DE TENANT - SWIFT CLINIC API
// =============================================================================
// 
// Middleware responsável por extrair o tenantId do token JWT
// e injetá-lo na requisição para todas as operações subsequentes
//
// =============================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = void 0;
const jwt_1 = __importDefault(require("../utils/jwt"));
class TenantMiddleware {
    /**
     * Middleware principal de injeção de tenant
     * Extrai o token JWT, valida e injeta o tenantId na requisição
     */
    static injectTenant(req, res, next) {
        var _a;
        try {
            // Extrai o token do header Authorization ou do cookie
            const authHeader = req.headers.authorization;
            const cookieToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
            let token = null;
            // Prioriza o header Authorization, depois o cookie
            if (authHeader) {
                token = jwt_1.default.extractTokenFromHeader(authHeader);
            }
            else if (cookieToken) {
                token = cookieToken;
            }
            if (!token) {
                console.log('🔑 [TenantMiddleware] Token não fornecido para rota:', req.path);
                res.status(401).json({
                    success: false,
                    error: 'Token de autenticação não fornecido',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            // Valida formato do token
            if (!jwt_1.default.isValidTokenFormat(token)) {
                console.log('🔑 [TenantMiddleware] Formato de token inválido para rota:', req.path);
                res.status(401).json({
                    success: false,
                    error: 'Formato de token inválido',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            // Verifica e decodifica o token
            const decoded = jwt_1.default.verifyAccessToken(token);
            console.log('🔑 [TenantMiddleware] Token válido para usuário:', decoded.email, 'tenant:', decoded.tenantId);
            // Injeta o usuário e tenantId na requisição
            req.user = decoded;
            req.tenantId = decoded.tenantId;
            next();
        }
        catch (error) {
            console.error('🔑 [TenantMiddleware] Erro no middleware de tenant:', error);
            res.status(401).json({
                success: false,
                error: 'Token inválido ou expirado',
                timestamp: new Date().toISOString(),
            });
            return;
        }
    }
    /**
     * Middleware opcional para rotas que podem ou não ter autenticação
     * Não falha se não houver token, apenas injeta se existir
     */
    static optionalTenant(req, res, next) {
        var _a;
        try {
            const authHeader = req.headers.authorization;
            const cookieToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
            let token = null;
            // Prioriza o header Authorization, depois o cookie
            if (authHeader) {
                token = jwt_1.default.extractTokenFromHeader(authHeader);
            }
            else if (cookieToken) {
                token = cookieToken;
            }
            if (token && jwt_1.default.isValidTokenFormat(token)) {
                const decoded = jwt_1.default.verifyAccessToken(token);
                req.user = decoded;
                req.tenantId = decoded.tenantId;
                console.log('🔑 [TenantMiddleware] Token opcional válido para usuário:', decoded.email);
            }
            next();
        }
        catch (error) {
            // Em caso de erro, continua sem autenticação
            console.warn('🔑 [TenantMiddleware] Token inválido no middleware opcional');
            next();
        }
    }
    /**
     * Middleware para verificar se o usuário tem permissão para acessar o tenant
     * Útil para operações cross-tenant ou validações específicas
     */
    static validateTenantAccess(allowedTenants) {
        return (req, res, next) => {
            const userTenantId = req.tenantId;
            if (!userTenantId) {
                res.status(401).json({
                    success: false,
                    error: 'Tenant não identificado',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            // Se não há restrições de tenant, permite acesso
            if (!allowedTenants || allowedTenants.length === 0) {
                return next();
            }
            // Verifica se o tenant do usuário está na lista de permitidos
            if (!allowedTenants.includes(userTenantId)) {
                res.status(403).json({
                    success: false,
                    error: 'Acesso negado para este tenant',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            next();
        };
    }
    /**
     * Middleware para extrair tenantId de parâmetros da URL
     * Útil para rotas que recebem tenantId como parâmetro
     */
    static extractTenantFromParams(req, res, next) {
        const tenantIdFromParams = req.params.tenantId || req.query.tenantId;
        if (tenantIdFromParams) {
            req.tenantId = tenantIdFromParams;
        }
        next();
    }
    /**
     * Middleware para validar se o tenantId está presente
     * Falha se não houver tenantId na requisição
     */
    static requireTenant(req, res, next) {
        if (!req.tenantId) {
            res.status(400).json({
                success: false,
                error: 'TenantId é obrigatório para esta operação',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        next();
    }
}
exports.TenantMiddleware = TenantMiddleware;
exports.default = TenantMiddleware;
//# sourceMappingURL=injectTenant.js.map
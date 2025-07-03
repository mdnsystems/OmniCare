"use strict";
// =============================================================================
// MIDDLEWARE DE AUTORIZAÇÃO - SWIFT CLINIC API
// =============================================================================
// 
// Middleware responsável por verificar permissões baseadas em roles
// Implementa controle de acesso granular para diferentes operações
//
// =============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationMiddleware = void 0;
const enums_1 = require("../types/enums");
class AuthorizationMiddleware {
    /**
     * Middleware para verificar se o usuário tem uma role específica
     */
    static requireRole(requiredRole) {
        return (req, res, next) => {
            const user = req.user;
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'Usuário não autenticado',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            if (user.role !== requiredRole) {
                res.status(403).json({
                    success: false,
                    error: `Acesso negado. Role requerida: ${requiredRole}`,
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            next();
        };
    }
    /**
     * Middleware para verificar se o usuário tem uma das roles permitidas
     */
    static requireAnyRole(allowedRoles) {
        return (req, res, next) => {
            const user = req.user;
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'Usuário não autenticado',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            if (!allowedRoles.includes(user.role)) {
                res.status(403).json({
                    success: false,
                    error: `Acesso negado. Roles permitidas: ${allowedRoles.join(', ')}`,
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            next();
        };
    }
    /**
     * Middleware para verificar se o usuário tem permissão de administrador
     * Permite SUPER_ADMIN e ADMIN
     */
    static requireAdmin(req, res, next) {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Usuário não autenticado',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        if (user.role !== enums_1.RoleUsuario.SUPER_ADMIN && user.role !== enums_1.RoleUsuario.ADMIN) {
            res.status(403).json({
                success: false,
                error: 'Acesso negado. Permissão de administrador requerida',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        next();
    }
    /**
     * Middleware para verificar se o usuário é SUPER_ADMIN
     * Acesso exclusivo para operações críticas do sistema
     */
    static requireSuperAdmin(req, res, next) {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Usuário não autenticado',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        if (user.role !== enums_1.RoleUsuario.SUPER_ADMIN) {
            res.status(403).json({
                success: false,
                error: 'Acesso negado. Permissão de super administrador requerida',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        next();
    }
    /**
     * Middleware para verificar se o usuário pode acessar recursos de outros usuários
     * Permite que usuários acessem seus próprios recursos ou que admins acessem qualquer recurso
     */
    static canAccessUserResource(targetUserId) {
        return (req, res, next) => {
            const user = req.user;
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'Usuário não autenticado',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            // SUPER_ADMIN e ADMIN podem acessar qualquer recurso
            if (user.role === enums_1.RoleUsuario.SUPER_ADMIN || user.role === enums_1.RoleUsuario.ADMIN) {
                next();
                return;
            }
            // Outros usuários só podem acessar seus próprios recursos
            if (user.userId !== targetUserId) {
                res.status(403).json({
                    success: false,
                    error: 'Acesso negado. Você só pode acessar seus próprios recursos',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            next();
        };
    }
    /**
     * Middleware para verificar se o usuário pode gerenciar profissionais
     * Apenas ADMIN e PROFISSIONAL podem gerenciar profissionais
     */
    static canManageProfessionals(req, res, next) {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Usuário não autenticado',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        // Inclui RECEPCIONISTA como permitido, se fizer sentido para sua regra de negócio
        const allowedRoles = [enums_1.RoleUsuario.SUPER_ADMIN, enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA];
        if (!allowedRoles.includes(user.role)) {
            res.status(403).json({
                success: false,
                error: 'Acesso negado. Permissão para gerenciar profissionais requerida',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        next();
    }
    /**
     * Middleware para verificar se o usuário pode acessar dados financeiros
     * Apenas ADMIN e SUPER_ADMIN podem acessar dados financeiros
     */
    static canAccessFinancialData(req, res, next) {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Usuário não autenticado',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        if (user.role !== enums_1.RoleUsuario.SUPER_ADMIN && user.role !== enums_1.RoleUsuario.ADMIN) {
            res.status(403).json({
                success: false,
                error: 'Acesso negado. Permissão para dados financeiros requerida',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        next();
    }
    /**
     * Middleware para verificar se o usuário pode acessar relatórios
     * ADMIN, SUPER_ADMIN e PROFISSIONAL podem acessar relatórios
     */
    static canAccessReports(req, res, next) {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Usuário não autenticado',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        const allowedRoles = [enums_1.RoleUsuario.SUPER_ADMIN, enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL];
        if (!allowedRoles.includes(user.role)) {
            res.status(403).json({
                success: false,
                error: 'Acesso negado. Permissão para relatórios requerida',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        next();
    }
}
exports.AuthorizationMiddleware = AuthorizationMiddleware;
exports.default = AuthorizationMiddleware;
//# sourceMappingURL=authorization.js.map
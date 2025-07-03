import { Request, Response, NextFunction } from 'express';
import { RoleUsuario } from '../types/enums';
export declare class AuthorizationMiddleware {
    /**
     * Middleware para verificar se o usuário tem uma role específica
     */
    static requireRole(requiredRole: RoleUsuario): (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Middleware para verificar se o usuário tem uma das roles permitidas
     */
    static requireAnyRole(allowedRoles: RoleUsuario[]): (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Middleware para verificar se o usuário tem permissão de administrador
     * Permite SUPER_ADMIN e ADMIN
     */
    static requireAdmin(req: Request, res: Response, next: NextFunction): void;
    /**
     * Middleware para verificar se o usuário é SUPER_ADMIN
     * Acesso exclusivo para operações críticas do sistema
     */
    static requireSuperAdmin(req: Request, res: Response, next: NextFunction): void;
    /**
     * Middleware para verificar se o usuário pode acessar recursos de outros usuários
     * Permite que usuários acessem seus próprios recursos ou que admins acessem qualquer recurso
     */
    static canAccessUserResource(targetUserId: string): (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Middleware para verificar se o usuário pode gerenciar profissionais
     * Apenas ADMIN e PROFISSIONAL podem gerenciar profissionais
     */
    static canManageProfessionals(req: Request, res: Response, next: NextFunction): void;
    /**
     * Middleware para verificar se o usuário pode acessar dados financeiros
     * Apenas ADMIN e SUPER_ADMIN podem acessar dados financeiros
     */
    static canAccessFinancialData(req: Request, res: Response, next: NextFunction): void;
    /**
     * Middleware para verificar se o usuário pode acessar relatórios
     * ADMIN, SUPER_ADMIN e PROFISSIONAL podem acessar relatórios
     */
    static canAccessReports(req: Request, res: Response, next: NextFunction): void;
}
export default AuthorizationMiddleware;

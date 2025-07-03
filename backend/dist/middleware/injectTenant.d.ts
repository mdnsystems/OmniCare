import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../types/enums';
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
            tenantId?: string;
        }
    }
}
export declare class TenantMiddleware {
    /**
     * Middleware principal de injeção de tenant
     * Extrai o token JWT, valida e injeta o tenantId na requisição
     */
    static injectTenant(req: Request, res: Response, next: NextFunction): void;
    /**
     * Middleware opcional para rotas que podem ou não ter autenticação
     * Não falha se não houver token, apenas injeta se existir
     */
    static optionalTenant(req: Request, res: Response, next: NextFunction): void;
    /**
     * Middleware para verificar se o usuário tem permissão para acessar o tenant
     * Útil para operações cross-tenant ou validações específicas
     */
    static validateTenantAccess(allowedTenants?: string[]): (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Middleware para extrair tenantId de parâmetros da URL
     * Útil para rotas que recebem tenantId como parâmetro
     */
    static extractTenantFromParams(req: Request, res: Response, next: NextFunction): void;
    /**
     * Middleware para validar se o tenantId está presente
     * Falha se não houver tenantId na requisição
     */
    static requireTenant(req: Request, res: Response, next: NextFunction): void;
}
export default TenantMiddleware;

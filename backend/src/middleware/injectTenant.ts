// =============================================================================
// MIDDLEWARE DE INJEÇÃO DE TENANT - SWIFT CLINIC API
// =============================================================================
// 
// Middleware responsável por extrair o tenantId do token JWT
// e injetá-lo na requisição para todas as operações subsequentes
//
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import JwtUtils from '../utils/jwt';
import { JwtPayload } from '../types/enums';

// Extensão da interface Request para incluir user e tenantId
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      tenantId?: string;
    }
  }
}

export class TenantMiddleware {
  /**
   * Middleware principal de injeção de tenant
   * Extrai o token JWT, valida e injeta o tenantId na requisição
   */
  static injectTenant(req: Request, res: Response, next: NextFunction): void {
    try {
      // Extrai o token do header Authorization ou do cookie
      const authHeader = req.headers.authorization;
      const cookieToken = req.cookies?.accessToken;
      
      let token = null;
      
      // Prioriza o header Authorization, depois o cookie
      if (authHeader) {
        token = JwtUtils.extractTokenFromHeader(authHeader);
      } else if (cookieToken) {
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
      if (!JwtUtils.isValidTokenFormat(token)) {
        console.log('🔑 [TenantMiddleware] Formato de token inválido para rota:', req.path);
        res.status(401).json({
          success: false,
          error: 'Formato de token inválido',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Verifica e decodifica o token
      const decoded = JwtUtils.verifyAccessToken(token);
      
      console.log('🔑 [TenantMiddleware] Token válido para usuário:', decoded.email, 'tenant:', decoded.tenantId);
      
      // Injeta o usuário e tenantId na requisição
      req.user = decoded;
      req.tenantId = decoded.tenantId;

      next();
    } catch (error) {
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
  static optionalTenant(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;
      const cookieToken = req.cookies?.accessToken;
      
      let token = null;
      
      // Prioriza o header Authorization, depois o cookie
      if (authHeader) {
        token = JwtUtils.extractTokenFromHeader(authHeader);
      } else if (cookieToken) {
        token = cookieToken;
      }

      if (token && JwtUtils.isValidTokenFormat(token)) {
        const decoded = JwtUtils.verifyAccessToken(token);
        req.user = decoded;
        req.tenantId = decoded.tenantId;
        console.log('🔑 [TenantMiddleware] Token opcional válido para usuário:', decoded.email);
      }

      next();
    } catch (error) {
      // Em caso de erro, continua sem autenticação
      console.warn('🔑 [TenantMiddleware] Token inválido no middleware opcional');
      next();
    }
  }

  /**
   * Middleware para verificar se o usuário tem permissão para acessar o tenant
   * Útil para operações cross-tenant ou validações específicas
   */
  static validateTenantAccess(allowedTenants?: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
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
  static extractTenantFromParams(req: Request, res: Response, next: NextFunction): void {
    const tenantIdFromParams = req.params.tenantId || req.query.tenantId as string;
    
    if (tenantIdFromParams) {
      req.tenantId = tenantIdFromParams;
    }

    next();
  }

  /**
   * Middleware para validar se o tenantId está presente
   * Falha se não houver tenantId na requisição
   */
  static requireTenant(req: Request, res: Response, next: NextFunction): void {
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

export default TenantMiddleware; 
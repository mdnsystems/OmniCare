// =============================================================================
// MIDDLEWARE DE AUTORIZAÇÃO - SWIFT CLINIC API
// =============================================================================
// 
// Middleware responsável por verificar permissões baseadas em roles
// Implementa controle de acesso granular para diferentes operações
//
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import { RoleUsuario } from '../types/enums';

export class AuthorizationMiddleware {
  /**
   * Middleware para verificar se o usuário tem uma role específica
   */
  static requireRole(requiredRole: RoleUsuario) {
    return (req: Request, res: Response, next: NextFunction): void => {
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
  static requireAnyRole(allowedRoles: RoleUsuario[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
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
  static requireAdmin(req: Request, res: Response, next: NextFunction): void {
    const user = req.user;
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (user.role !== RoleUsuario.SUPER_ADMIN && user.role !== RoleUsuario.ADMIN) {
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
  static requireSuperAdmin(req: Request, res: Response, next: NextFunction): void {
    const user = req.user;
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (user.role !== RoleUsuario.SUPER_ADMIN) {
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
  static canAccessUserResource(targetUserId: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
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
      if (user.role === RoleUsuario.SUPER_ADMIN || user.role === RoleUsuario.ADMIN) {
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
  static canManageProfessionals(req: Request, res: Response, next: NextFunction): void {
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
    const allowedRoles = [RoleUsuario.SUPER_ADMIN, RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA];
    
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
  static canAccessFinancialData(req: Request, res: Response, next: NextFunction): void {
    const user = req.user;
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (user.role !== RoleUsuario.SUPER_ADMIN && user.role !== RoleUsuario.ADMIN) {
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
  static canAccessReports(req: Request, res: Response, next: NextFunction): void {
    const user = req.user;
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const allowedRoles = [RoleUsuario.SUPER_ADMIN, RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL];
    
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

export default AuthorizationMiddleware; 
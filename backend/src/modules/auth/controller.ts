// =============================================================================
// CONTROLLER - MÓDULO DE AUTENTICAÇÃO
// =============================================================================
// 
// Controlador responsável por gerenciar as rotas de autenticação
// Implementa login, registro, refresh tokens e logout
//
// =============================================================================

import { Request, Response } from 'express';
import { AuthService } from './service';
import { AuthValidator } from './validation';

export class AuthController {
  /**
   * Realiza o login do usuário
   */
  static async login(req: Request, res: Response) {
    try {
      const validatedData = AuthValidator.validateLogin(req.body);
      const result = await AuthService.login(validatedData);

      // Configurar cookies seguros
      const isProduction = process.env.NODE_ENV === 'production';
      
      // Cookie para access token (httpOnly, secure em produção)
      res.cookie('accessToken', result.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 3600000, // 1 hora
        path: '/',
      });

      // Cookie para refresh token (httpOnly, secure em produção)
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 604800000, // 7 dias
        path: '/api/auth/refresh-token',
      });

      // Retornar dados do usuário (sem tokens)
      res.json({
        success: true,
        data: {
          usuario: result.usuario,
          expiresIn: result.expiresIn,
          refreshExpiresIn: result.refreshExpiresIn,
        },
        message: 'Login realizado com sucesso',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Registra um novo usuário
   */
  static async register(req: Request, res: Response) {
    try {
      const validatedData = AuthValidator.validateRegister(req.body);
      const result = await AuthService.register(validatedData);

      // Configurar cookies seguros
      const isProduction = process.env.NODE_ENV === 'production';
      
      res.cookie('accessToken', result.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 3600000, // 1 hora
        path: '/',
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 604800000, // 7 dias
        path: '/api/auth/refresh-token',
      });

      res.json({
        success: true,
        data: {
          usuario: result.usuario,
          expiresIn: result.expiresIn,
          refreshExpiresIn: result.refreshExpiresIn,
        },
        message: 'Usuário registrado com sucesso',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Renova o token de acesso
   */
  static async refreshToken(req: Request, res: Response) {
    try {
      // Tentar obter refresh token do cookie primeiro, depois do body
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token não fornecido',
          timestamp: new Date().toISOString(),
        });
      }

      const validatedData = { refreshToken };
      const result = await AuthService.refreshToken(validatedData);

      // Configurar novos cookies seguros
      const isProduction = process.env.NODE_ENV === 'production';
      
      res.cookie('accessToken', result.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 3600000, // 1 hora
        path: '/',
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 604800000, // 7 dias
        path: '/api/auth/refresh-token',
      });

      res.json({
        success: true,
        data: {
          usuario: result.usuario,
          expiresIn: result.expiresIn,
          refreshExpiresIn: result.refreshExpiresIn,
        },
        message: 'Token renovado com sucesso',
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Realiza o logout do usuário
   */
  static async logout(req: Request, res: Response) {
    try {
      // Limpar cookies
      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });

      res.json({
        success: true,
        message: 'Logout realizado com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Erro ao realizar logout',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Altera a senha do usuário
   */
  static async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado',
          timestamp: new Date().toISOString(),
        });
      }

      const validatedData = AuthValidator.validateChangePassword(req.body);
      await AuthService.changePassword(userId, validatedData);

      res.json({
        success: true,
        message: 'Senha alterada com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Solicita recuperação de senha
   */
  static async forgotPassword(req: Request, res: Response) {
    try {
      const validatedData = AuthValidator.validateForgotPassword(req.body);
      const result = await AuthService.forgotPassword(validatedData);

      res.json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Reseta a senha usando token
   */
  static async resetPassword(req: Request, res: Response) {
    try {
      const validatedData = AuthValidator.validateResetPassword(req.body);
      await AuthService.resetPassword(validatedData);

      res.json({
        success: true,
        message: 'Senha redefinida com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Verifica se um token é válido
   */
  static async verifyToken(req: Request, res: Response) {
    try {
      const token = req.cookies.accessToken || req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Token não fornecido',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await AuthService.verifyToken(token);

      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Busca o perfil do usuário
   */
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado',
          timestamp: new Date().toISOString(),
        });
      }

      const usuario = await AuthService.getProfile(userId);

      res.json({
        success: true,
        data: usuario,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export default AuthController; 
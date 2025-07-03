// =============================================================================
// ROTAS - MÓDULO DE AUTENTICAÇÃO
// =============================================================================
// 
// Definição das rotas de autenticação
// Implementa validação, autorização e tratamento de erros
//
// =============================================================================

import { Router } from 'express';
import AuthController from './controller';
import TenantMiddleware from '../../middleware/injectTenant';
import AuthorizationMiddleware from '../../middleware/authorization';
import ErrorHandler from '../../middleware/errorHandler';

const router = Router();

// Rotas públicas (não precisam de autenticação)
router.post('/login', ErrorHandler.catchAsync(AuthController.login));
router.post('/register', ErrorHandler.catchAsync(AuthController.register));
router.post('/refresh-token', ErrorHandler.catchAsync(AuthController.refreshToken));
router.post('/forgot-password', ErrorHandler.catchAsync(AuthController.forgotPassword));
router.post('/reset-password', ErrorHandler.catchAsync(AuthController.resetPassword));
router.post('/verify-token', ErrorHandler.catchAsync(AuthController.verifyToken));

// Rotas que precisam de autenticação
router.post('/logout', 
  TenantMiddleware.injectTenant,
  ErrorHandler.catchAsync(AuthController.logout)
);

router.get('/profile',
  TenantMiddleware.injectTenant,
  ErrorHandler.catchAsync(AuthController.getProfile)
);

router.put('/change-password',
  TenantMiddleware.injectTenant,
  ErrorHandler.catchAsync(AuthController.changePassword)
);

export default router; 
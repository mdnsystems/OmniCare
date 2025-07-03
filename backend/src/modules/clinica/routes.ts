// =============================================================================
// ROTAS - MÓDULO DE CLÍNICAS
// =============================================================================
// 
// Definição das rotas de clínicas
// Implementa validação, autorização e tratamento de erros
//
// =============================================================================

import { Router } from 'express';
import ClinicaController from './controller';
import TenantMiddleware from '../../middleware/injectTenant';
import AuthorizationMiddleware from '../../middleware/authorization';
import ErrorHandler from '../../middleware/errorHandler';
import { RoleUsuario } from '../../types/enums';

const router = Router();

// Rotas públicas (apenas para criação de clínicas)
router.post('/', ErrorHandler.catchAsync(ClinicaController.create));

// Rotas que precisam de autenticação
router.get('/',
  TenantMiddleware.optionalTenant,
  ErrorHandler.catchAsync(ClinicaController.findAll)
);

router.get('/:id',
  TenantMiddleware.optionalTenant,
  ErrorHandler.catchAsync(ClinicaController.findById)
);

router.get('/tenant/:tenantId',
  TenantMiddleware.optionalTenant,
  ErrorHandler.catchAsync(ClinicaController.findByTenantId)
);

// Rotas que precisam de autenticação e autorização de admin
router.put('/:id',
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAdmin,
  ErrorHandler.catchAsync(ClinicaController.update)
);

router.patch('/:id/toggle-status',
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAdmin,
  ErrorHandler.catchAsync(ClinicaController.toggleStatus)
);

router.delete('/:id',
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireSuperAdmin,
  ErrorHandler.catchAsync(ClinicaController.delete)
);

// Rotas de configuração de WhatsApp
router.post('/:tenantId/whatsapp',
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAdmin,
  ErrorHandler.catchAsync(ClinicaController.configureWhatsApp)
);

router.get('/:tenantId/whatsapp',
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAnyRole([
    RoleUsuario.SUPER_ADMIN,
    RoleUsuario.ADMIN,
    RoleUsuario.PROFISSIONAL,
    RoleUsuario.RECEPCIONISTA
  ]),
  ErrorHandler.catchAsync(ClinicaController.getWhatsAppConfig)
);

// Rotas de templates de mensagem
router.post('/:tenantId/templates',
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAdmin,
  ErrorHandler.catchAsync(ClinicaController.createMessageTemplate)
);

router.get('/:tenantId/templates',
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAnyRole([
    RoleUsuario.SUPER_ADMIN,
    RoleUsuario.ADMIN,
    RoleUsuario.PROFISSIONAL,
    RoleUsuario.RECEPCIONISTA
  ]),
  ErrorHandler.catchAsync(ClinicaController.listMessageTemplates)
);

router.put('/templates/:id',
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAdmin,
  ErrorHandler.catchAsync(ClinicaController.updateMessageTemplate)
);

router.delete('/templates/:id',
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAdmin,
  ErrorHandler.catchAsync(ClinicaController.deleteMessageTemplate)
);

// Rotas de estatísticas
router.get('/:tenantId/stats',
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAnyRole([
    RoleUsuario.SUPER_ADMIN,
    RoleUsuario.ADMIN,
    RoleUsuario.PROFISSIONAL,
    RoleUsuario.RECEPCIONISTA
  ]),
  ErrorHandler.catchAsync(ClinicaController.getStats)
);

export default router; 
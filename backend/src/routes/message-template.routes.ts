import { Router } from 'express';
import messageTemplateController from '../controllers/message-template.controller';

import { AuthorizationMiddleware } from '../middleware/authorization';
import { RoleUsuario } from '../types/enums';

const router = Router();

// Rotas para templates de mensagem - ADMIN e SUPER_ADMIN podem gerenciar
router.post('/', 
  AuthorizationMiddleware.requireAdmin,
  messageTemplateController.create
);

router.get('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  messageTemplateController.findAll
);

router.get('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  messageTemplateController.findById
);

router.put('/:id', 
  AuthorizationMiddleware.requireAdmin,
  messageTemplateController.update
);

router.delete('/:id', 
  AuthorizationMiddleware.requireAdmin,
  messageTemplateController.delete
);

// Templates por tipo
router.get('/tipo/:tipo', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  messageTemplateController.findByTipo
);

// Templates ativos
router.get('/ativos', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  messageTemplateController.findAtivos
);

// Ativar/desativar template
router.patch('/:id/ativar', 
  AuthorizationMiddleware.requireAdmin,
  messageTemplateController.ativar
);

router.patch('/:id/desativar', 
  AuthorizationMiddleware.requireAdmin,
  messageTemplateController.desativar
);

// Duplicar template
router.post('/:id/duplicar', 
  AuthorizationMiddleware.requireAdmin,
  messageTemplateController.duplicar
);

export default router; 
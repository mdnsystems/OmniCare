import { Router, Request, Response } from 'express';
import pacienteController from '../controllers/paciente.controller';
import { TenantMiddleware } from '../middleware/injectTenant';
import { AuthorizationMiddleware } from '../middleware/authorization';
import { RoleUsuario } from '../types/enums';

const router = Router();

// Aplicar middleware de tenant em todas as rotas
router.use(TenantMiddleware.injectTenant);

// Rotas para todas as roles autorizadas
router.post('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  pacienteController.create
);

router.get('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  pacienteController.findAll
);

router.get('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  pacienteController.findById
);

router.put('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  pacienteController.update
);

router.delete('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  pacienteController.delete
);

router.get('/:id/relations', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  pacienteController.checkRelations
);

export default router; 
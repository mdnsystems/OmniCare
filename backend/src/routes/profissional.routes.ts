import { Router, Request, Response } from 'express';
import profissionalController from '../controllers/profissional.controller';

import { AuthorizationMiddleware } from '../middleware/authorization';
import { RoleUsuario } from '../types/enums';

const router = Router();

// Rotas para ADMIN e PROFISSIONAL
router.post('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  profissionalController.create
);

router.get('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  profissionalController.findAll
);

// Rota para profissionais ativos (deve vir antes da rota /:id)
router.get('/ativos', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  profissionalController.findAtivos
);

router.get('/:id/relations', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  profissionalController.checkRelations
);

router.get('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  profissionalController.findById
);

router.put('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  profissionalController.update
);

router.delete('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN]),
  profissionalController.delete
);

export default router; 
import { Router, Request, Response } from 'express';
import exameController from '../controllers/exame.controller';

import { AuthorizationMiddleware } from '../middleware/authorization';
import { RoleUsuario } from '../types/enums';

const router = Router();

// Rotas para PROFISSIONAL e ADMIN
router.post('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  exameController.create
);

router.get('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  exameController.findAll
);

router.get('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  exameController.findById
);

router.put('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  exameController.update
);

router.delete('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  exameController.delete
);

export default router; 
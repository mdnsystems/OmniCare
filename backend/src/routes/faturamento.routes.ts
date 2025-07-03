import { Router } from 'express';
import faturamentoController from '../controllers/faturamento.controller';

import { AuthorizationMiddleware } from '../middleware/authorization';
import { RoleUsuario } from '../types/enums';

const router = Router();

// Rotas para faturamento - ADMIN, SUPER_ADMIN e PROFISSIONAL podem acessar
router.post('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  faturamentoController.create
);

router.get('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  faturamentoController.findAll
);

router.get('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  faturamentoController.findById
);

router.put('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  faturamentoController.update
);

router.delete('/:id', 
  AuthorizationMiddleware.requireAdmin,
  faturamentoController.delete
);

// Faturamentos por paciente
router.get('/paciente/:pacienteId', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  faturamentoController.findByPaciente
);

// Faturamentos por profissional
router.get('/profissional/:profissionalId', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  faturamentoController.findByProfissional
);

// Faturamentos por status
router.get('/status/:status', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  faturamentoController.findByStatus
);

// Faturamentos vencidos
router.get('/vencidos', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  faturamentoController.findVencidos
);

// Faturamentos a vencer
router.get('/a-vencer', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  faturamentoController.findAVencer
);

// Exportação de faturamentos
router.post('/exportar', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  faturamentoController.exportar
);

// Importação de faturamentos
router.post('/importar', 
  AuthorizationMiddleware.requireAdmin,
  faturamentoController.importar
);

export default router; 
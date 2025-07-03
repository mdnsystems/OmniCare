import { Router } from 'express';
import pagamentoController from '../controllers/pagamento.controller';

import { AuthorizationMiddleware } from '../middleware/authorization';
import { RoleUsuario } from '../types/enums';

const router = Router();

// Rotas para pagamentos - ADMIN, SUPER_ADMIN e PROFISSIONAL podem acessar
router.post('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  pagamentoController.create
);

router.get('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  pagamentoController.findAll
);

router.get('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  pagamentoController.findById
);

router.put('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  pagamentoController.update
);

router.delete('/:id', 
  AuthorizationMiddleware.requireAdmin,
  pagamentoController.delete
);

// Pagamentos por faturamento
router.get('/faturamento/:faturamentoId', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  pagamentoController.findByFaturamento
);

// Pagamentos por período
router.get('/periodo/:dataInicio/:dataFim', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  pagamentoController.findByPeriodo
);

// Pagamentos por forma de pagamento
router.get('/forma/:formaPagamento', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  pagamentoController.findByFormaPagamento
);

// Registrar pagamento
router.post('/registrar', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  pagamentoController.registrarPagamento
);

// Estornar pagamento
router.post('/:id/estornar', 
  AuthorizationMiddleware.requireAdmin,
  pagamentoController.estornarPagamento
);

export default router; 
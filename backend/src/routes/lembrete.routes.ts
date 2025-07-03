import { Router } from 'express';
import lembreteController from '../controllers/lembrete.controller';

import { AuthorizationMiddleware } from '../middleware/authorization';
import { RoleUsuario } from '../types/enums';

const router = Router();

// Rotas para notificações de lembretes (ADMIN apenas)
router.get('/notificacoes', 
  AuthorizationMiddleware.requireRole(RoleUsuario.ADMIN),
  lembreteController.getNotificacoes
);

router.put('/notificacoes/:id/marcar-lida', 
  AuthorizationMiddleware.requireRole(RoleUsuario.ADMIN),
  lembreteController.marcarNotificacaoComoLida
);

router.put('/notificacoes/marcar-todas-lidas', 
  AuthorizationMiddleware.requireRole(RoleUsuario.ADMIN),
  lembreteController.marcarTodasNotificacoesComoLidas
);

router.get('/notificacoes/estatisticas', 
  AuthorizationMiddleware.requireRole(RoleUsuario.ADMIN),
  lembreteController.getEstatisticasNotificacoes
);

// Rotas para envio de lembretes (SUPER_ADMIN apenas)
router.post('/enviar-lembrete', 
  AuthorizationMiddleware.requireRole(RoleUsuario.SUPER_ADMIN),
  lembreteController.enviarLembretePersonalizado
);

// Rotas CRUD básicas para lembretes
router.post('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  lembreteController.create
);

router.get('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  lembreteController.findAll
);

router.get('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  lembreteController.findById
);

router.put('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  lembreteController.update
);

router.delete('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  lembreteController.delete
);

// Rotas adicionais para busca e filtros
router.get('/periodo', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  lembreteController.findByPeriodo
);

router.get('/tipo/:tipo', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  lembreteController.findByTipo
);

router.get('/status/:status', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  lembreteController.findByStatus
);

router.get('/fatura/:faturaId', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  lembreteController.findByFatura
);

router.get('/search', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  lembreteController.search
);

router.get('/stats', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  lembreteController.getStats
);

export default router; 
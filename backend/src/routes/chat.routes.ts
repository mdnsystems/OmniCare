import { Router } from 'express';
import ChatController from '../controllers/chat.controller';
import { AuthorizationMiddleware } from '../middleware/authorization';
import { RoleUsuario } from '../types/enums';
import { TenantMiddleware } from '../middleware/injectTenant';

const router = Router();

// Aplicar middleware de tenant em todas as rotas
router.use(TenantMiddleware.injectTenant);

// Rotas de chat - todas as roles podem acessar
router.get('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.listarChats
);

// Rota para buscar chat geral
router.get('/geral', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.buscarChatGeral
);

// Rota específica para chat privado - DEVE vir antes da rota genérica /:id
router.get('/privado/:userId', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.buscarOuCriarChatPrivado
);

router.get('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.buscarChat
);

router.post('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.criarChat
);

router.put('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.atualizarChat
);

router.delete('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.deletarChat
);

router.post('/participantes', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.adicionarParticipante
);

router.delete('/participantes', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.removerParticipante
);

router.get('/:chatId/mensagens', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.listarMensagens
);

// Rotas adicionais para busca e filtros
router.get('/tipo/:tipo', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.buscarChatsPorTipo
);

router.get('/status/:status', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.buscarChatsPorStatus
);

router.get('/usuario/:usuarioId', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.buscarChatsPorUsuario
);

router.get('/search', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.buscarChats
);

router.patch('/:id/arquivar', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.arquivarChat
);

router.patch('/:id/fechar', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.fecharChat
);

router.patch('/:id/reativar', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.reativarChat
);

router.get('/stats', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  ChatController.getStats
);

export default router; 
// =============================================================================
// ROTAS - SUPER ADMIN
// =============================================================================
// 
// Rotas específicas para o SUPER_ADMIN
// Foco em gestão de clínicas e relatórios macro
//
// =============================================================================

import { Router } from 'express';
import { SuperAdminController } from '../controllers/super-admin.controller';
import AuthorizationMiddleware from '../middleware/authorization';
import ErrorHandler from '../middleware/errorHandler';
import { RoleUsuario } from '../types/enums';

const router = Router();

// =============================================================================
// MIDDLEWARE DE AUTORIZAÇÃO
// =============================================================================
// Todas as rotas requerem SUPER_ADMIN
router.use(AuthorizationMiddleware.requireRole(RoleUsuario.SUPER_ADMIN));

// =============================================================================
// GESTÃO DE CLÍNICAS
// =============================================================================

// Listar todas as clínicas cadastradas
router.get('/clinicas', 
  ErrorHandler.catchAsync(SuperAdminController.listarClinicas)
);

// Obter detalhes de uma clínica específica
router.get('/clinicas/:id', 
  ErrorHandler.catchAsync(SuperAdminController.obterDetalhesClinica)
);

// Ativar/desativar clínica
router.patch('/clinicas/:id/toggle-status', 
  ErrorHandler.catchAsync(SuperAdminController.toggleStatusClinica)
);

// Atualizar dados básicos da clínica
router.put('/clinicas/:id', 
  ErrorHandler.catchAsync(SuperAdminController.atualizarClinica)
);

// =============================================================================
// RELATÓRIOS MACRO
// =============================================================================

// Relatório de gestão de usuários e permissões
router.get('/relatorios/usuarios', 
  ErrorHandler.catchAsync(SuperAdminController.relatorioUsuarios)
);

// Relatório de monitoramento de atividades
router.get('/relatorios/atividades', 
  ErrorHandler.catchAsync(SuperAdminController.relatorioAtividades)
);

// Relatório de gestão de clínicas
router.get('/relatorios/gestao-clinicas', 
  ErrorHandler.catchAsync(SuperAdminController.relatorioGestaoClinicas)
);

// Relatório de chat e comunicação
router.get('/relatorios/chat', 
  ErrorHandler.catchAsync(SuperAdminController.relatorioChat)
);

export default router; 
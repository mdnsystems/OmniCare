import { Router, Request, Response } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { TenantMiddleware } from '../middleware/injectTenant';
import { AuthorizationMiddleware } from '../middleware/authorization';
import { RoleUsuario } from '../types/enums';

const router = Router();

// Aplicar middleware de tenant em todas as rotas
router.use(TenantMiddleware.injectTenant);

// Dashboard geral
router.get('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  dashboardController.getDashboard
);

// Estatísticas de agendamentos
router.get('/agendamentos', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  dashboardController.getEstatisticasAgendamentos
);

// Estatísticas financeiras
router.get('/financeiro', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN]),
  dashboardController.getEstatisticasFinanceiras
);

// Estatísticas de pacientes
router.get('/pacientes', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  dashboardController.getEstatisticasPacientes
);

// Estatísticas de profissionais
router.get('/profissionais', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN]),
  dashboardController.getEstatisticasProfissionais
);

// Estatísticas de prontuários
router.get('/prontuarios', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  dashboardController.getEstatisticasProntuarios
);

// Estatísticas de anamnese
router.get('/anamnese', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  dashboardController.getEstatisticasAnamnese
);

// Estatísticas de atividades
router.get('/atividades', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  dashboardController.getEstatisticasAtividades
);

// Evolução semanal
router.get('/evolucao-semanal',
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  dashboardController.getEvolucaoSemanal
);

export default router; 
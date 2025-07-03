import { Router } from 'express';
import relatorioController from '../controllers/relatorio.controller';

import { AuthorizationMiddleware } from '../middleware/authorization';
import { RoleUsuario } from '../types/enums';

const router = Router();

// Rotas para relatórios - ADMIN, SUPER_ADMIN e PROFISSIONAL podem acessar
router.post('/', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.create
);

router.get('/', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.findAll
);

router.get('/:id', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.findById
);

router.put('/:id', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.update
);

router.delete('/:id', 
  AuthorizationMiddleware.requireAdmin,
  relatorioController.delete
);

// Relatórios específicos
router.post('/consultas', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.gerarRelatorioConsultas
);

router.post('/faturamento', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.gerarRelatorioFaturamento
);

router.post('/desempenho', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.gerarRelatorioDesempenho
);

router.post('/receitas', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.gerarRelatorioReceitas
);

router.post('/profissionais', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.gerarRelatorioProfissionais
);

router.post('/prontuarios', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.gerarRelatorioProntuarios
);

router.post('/customizado', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.gerarRelatorioCustomizado
);

// Templates de relatório
router.get('/templates', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.getTemplates
);

router.get('/templates/:id', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.getTemplate
);

router.post('/templates', 
  AuthorizationMiddleware.requireAdmin,
  relatorioController.createTemplate
);

router.put('/templates/:id', 
  AuthorizationMiddleware.requireAdmin,
  relatorioController.updateTemplate
);

router.delete('/templates/:id', 
  AuthorizationMiddleware.requireAdmin,
  relatorioController.deleteTemplate
);

// Relatórios agendados
router.post('/agendados', 
  AuthorizationMiddleware.requireAdmin,
  relatorioController.agendarRelatorio
);

router.get('/agendados', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.getRelatoriosAgendados
);

router.put('/agendados/:id', 
  AuthorizationMiddleware.requireAdmin,
  relatorioController.updateRelatorioAgendado
);

router.delete('/agendados/:id', 
  AuthorizationMiddleware.requireAdmin,
  relatorioController.deleteRelatorioAgendado
);

// Histórico de relatórios
router.get('/historico', 
  AuthorizationMiddleware.canAccessReports,
  relatorioController.getHistorico
);

export default router; 
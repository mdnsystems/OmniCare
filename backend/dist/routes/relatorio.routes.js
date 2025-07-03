"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const relatorio_controller_1 = __importDefault(require("../controllers/relatorio.controller"));
const authorization_1 = require("../middleware/authorization");
const router = (0, express_1.Router)();
// Rotas para relatórios - ADMIN, SUPER_ADMIN e PROFISSIONAL podem acessar
router.post('/', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.create);
router.get('/', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.findAll);
router.get('/:id', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.findById);
router.put('/:id', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.update);
router.delete('/:id', authorization_1.AuthorizationMiddleware.requireAdmin, relatorio_controller_1.default.delete);
// Relatórios específicos
router.post('/consultas', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.gerarRelatorioConsultas);
router.post('/faturamento', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.gerarRelatorioFaturamento);
router.post('/desempenho', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.gerarRelatorioDesempenho);
router.post('/receitas', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.gerarRelatorioReceitas);
router.post('/profissionais', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.gerarRelatorioProfissionais);
router.post('/prontuarios', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.gerarRelatorioProntuarios);
router.post('/customizado', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.gerarRelatorioCustomizado);
// Templates de relatório
router.get('/templates', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.getTemplates);
router.get('/templates/:id', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.getTemplate);
router.post('/templates', authorization_1.AuthorizationMiddleware.requireAdmin, relatorio_controller_1.default.createTemplate);
router.put('/templates/:id', authorization_1.AuthorizationMiddleware.requireAdmin, relatorio_controller_1.default.updateTemplate);
router.delete('/templates/:id', authorization_1.AuthorizationMiddleware.requireAdmin, relatorio_controller_1.default.deleteTemplate);
// Relatórios agendados
router.post('/agendados', authorization_1.AuthorizationMiddleware.requireAdmin, relatorio_controller_1.default.agendarRelatorio);
router.get('/agendados', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.getRelatoriosAgendados);
router.put('/agendados/:id', authorization_1.AuthorizationMiddleware.requireAdmin, relatorio_controller_1.default.updateRelatorioAgendado);
router.delete('/agendados/:id', authorization_1.AuthorizationMiddleware.requireAdmin, relatorio_controller_1.default.deleteRelatorioAgendado);
// Histórico de relatórios
router.get('/historico', authorization_1.AuthorizationMiddleware.canAccessReports, relatorio_controller_1.default.getHistorico);
exports.default = router;
//# sourceMappingURL=relatorio.routes.js.map
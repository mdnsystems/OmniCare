"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = __importDefault(require("../controllers/dashboard.controller"));
const injectTenant_1 = require("../middleware/injectTenant");
const authorization_1 = require("../middleware/authorization");
const enums_1 = require("../types/enums");
const router = (0, express_1.Router)();
// Aplicar middleware de tenant em todas as rotas
router.use(injectTenant_1.TenantMiddleware.injectTenant);
// Dashboard geral
router.get('/', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), dashboard_controller_1.default.getDashboard);
// Estatísticas de agendamentos
router.get('/agendamentos', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), dashboard_controller_1.default.getEstatisticasAgendamentos);
// Estatísticas financeiras
router.get('/financeiro', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN]), dashboard_controller_1.default.getEstatisticasFinanceiras);
// Estatísticas de pacientes
router.get('/pacientes', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), dashboard_controller_1.default.getEstatisticasPacientes);
// Estatísticas de profissionais
router.get('/profissionais', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN]), dashboard_controller_1.default.getEstatisticasProfissionais);
// Estatísticas de prontuários
router.get('/prontuarios', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), dashboard_controller_1.default.getEstatisticasProntuarios);
// Estatísticas de anamnese
router.get('/anamnese', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), dashboard_controller_1.default.getEstatisticasAnamnese);
// Estatísticas de atividades
router.get('/atividades', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), dashboard_controller_1.default.getEstatisticasAtividades);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map
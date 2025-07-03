"use strict";
// =============================================================================
// ROTAS - SUPER ADMIN
// =============================================================================
// 
// Rotas específicas para o SUPER_ADMIN
// Foco em gestão de clínicas e relatórios macro
//
// =============================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const super_admin_controller_1 = require("../controllers/super-admin.controller");
const authorization_1 = __importDefault(require("../middleware/authorization"));
const errorHandler_1 = __importDefault(require("../middleware/errorHandler"));
const enums_1 = require("../types/enums");
const router = (0, express_1.Router)();
// =============================================================================
// MIDDLEWARE DE AUTORIZAÇÃO
// =============================================================================
// Todas as rotas requerem SUPER_ADMIN
router.use(authorization_1.default.requireRole(enums_1.RoleUsuario.SUPER_ADMIN));
// =============================================================================
// GESTÃO DE CLÍNICAS
// =============================================================================
// Listar todas as clínicas cadastradas
router.get('/clinicas', errorHandler_1.default.catchAsync(super_admin_controller_1.SuperAdminController.listarClinicas));
// Obter detalhes de uma clínica específica
router.get('/clinicas/:id', errorHandler_1.default.catchAsync(super_admin_controller_1.SuperAdminController.obterDetalhesClinica));
// Ativar/desativar clínica
router.patch('/clinicas/:id/toggle-status', errorHandler_1.default.catchAsync(super_admin_controller_1.SuperAdminController.toggleStatusClinica));
// Atualizar dados básicos da clínica
router.put('/clinicas/:id', errorHandler_1.default.catchAsync(super_admin_controller_1.SuperAdminController.atualizarClinica));
// =============================================================================
// RELATÓRIOS MACRO
// =============================================================================
// Relatório de gestão de usuários e permissões
router.get('/relatorios/usuarios', errorHandler_1.default.catchAsync(super_admin_controller_1.SuperAdminController.relatorioUsuarios));
// Relatório de monitoramento de atividades
router.get('/relatorios/atividades', errorHandler_1.default.catchAsync(super_admin_controller_1.SuperAdminController.relatorioAtividades));
// Relatório de gestão de clínicas
router.get('/relatorios/gestao-clinicas', errorHandler_1.default.catchAsync(super_admin_controller_1.SuperAdminController.relatorioGestaoClinicas));
// Relatório de chat e comunicação
router.get('/relatorios/chat', errorHandler_1.default.catchAsync(super_admin_controller_1.SuperAdminController.relatorioChat));
exports.default = router;
//# sourceMappingURL=super-admin.routes.js.map
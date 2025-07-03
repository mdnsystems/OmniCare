"use strict";
// =============================================================================
// ROTAS - MÓDULO DE CLÍNICAS
// =============================================================================
// 
// Definição das rotas de clínicas
// Implementa validação, autorização e tratamento de erros
//
// =============================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const injectTenant_1 = __importDefault(require("../../middleware/injectTenant"));
const authorization_1 = __importDefault(require("../../middleware/authorization"));
const errorHandler_1 = __importDefault(require("../../middleware/errorHandler"));
const enums_1 = require("../../types/enums");
const router = (0, express_1.Router)();
// Rotas públicas (apenas para criação de clínicas)
router.post('/', errorHandler_1.default.catchAsync(controller_1.default.create));
// Rotas que precisam de autenticação
router.get('/', injectTenant_1.default.optionalTenant, errorHandler_1.default.catchAsync(controller_1.default.findAll));
router.get('/:id', injectTenant_1.default.optionalTenant, errorHandler_1.default.catchAsync(controller_1.default.findById));
router.get('/tenant/:tenantId', injectTenant_1.default.optionalTenant, errorHandler_1.default.catchAsync(controller_1.default.findByTenantId));
// Rotas que precisam de autenticação e autorização de admin
router.put('/:id', injectTenant_1.default.injectTenant, authorization_1.default.requireAdmin, errorHandler_1.default.catchAsync(controller_1.default.update));
router.patch('/:id/toggle-status', injectTenant_1.default.injectTenant, authorization_1.default.requireAdmin, errorHandler_1.default.catchAsync(controller_1.default.toggleStatus));
router.delete('/:id', injectTenant_1.default.injectTenant, authorization_1.default.requireSuperAdmin, errorHandler_1.default.catchAsync(controller_1.default.delete));
// Rotas de configuração de WhatsApp
router.post('/:tenantId/whatsapp', injectTenant_1.default.injectTenant, authorization_1.default.requireAdmin, errorHandler_1.default.catchAsync(controller_1.default.configureWhatsApp));
router.get('/:tenantId/whatsapp', injectTenant_1.default.injectTenant, authorization_1.default.requireAnyRole([
    enums_1.RoleUsuario.SUPER_ADMIN,
    enums_1.RoleUsuario.ADMIN,
    enums_1.RoleUsuario.PROFISSIONAL,
    enums_1.RoleUsuario.RECEPCIONISTA
]), errorHandler_1.default.catchAsync(controller_1.default.getWhatsAppConfig));
// Rotas de templates de mensagem
router.post('/:tenantId/templates', injectTenant_1.default.injectTenant, authorization_1.default.requireAdmin, errorHandler_1.default.catchAsync(controller_1.default.createMessageTemplate));
router.get('/:tenantId/templates', injectTenant_1.default.injectTenant, authorization_1.default.requireAnyRole([
    enums_1.RoleUsuario.SUPER_ADMIN,
    enums_1.RoleUsuario.ADMIN,
    enums_1.RoleUsuario.PROFISSIONAL,
    enums_1.RoleUsuario.RECEPCIONISTA
]), errorHandler_1.default.catchAsync(controller_1.default.listMessageTemplates));
router.put('/templates/:id', injectTenant_1.default.injectTenant, authorization_1.default.requireAdmin, errorHandler_1.default.catchAsync(controller_1.default.updateMessageTemplate));
router.delete('/templates/:id', injectTenant_1.default.injectTenant, authorization_1.default.requireAdmin, errorHandler_1.default.catchAsync(controller_1.default.deleteMessageTemplate));
// Rotas de estatísticas
router.get('/:tenantId/stats', injectTenant_1.default.injectTenant, authorization_1.default.requireAnyRole([
    enums_1.RoleUsuario.SUPER_ADMIN,
    enums_1.RoleUsuario.ADMIN,
    enums_1.RoleUsuario.PROFISSIONAL,
    enums_1.RoleUsuario.RECEPCIONISTA
]), errorHandler_1.default.catchAsync(controller_1.default.getStats));
exports.default = router;
//# sourceMappingURL=routes.js.map
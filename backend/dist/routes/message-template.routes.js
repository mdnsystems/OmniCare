"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_template_controller_1 = __importDefault(require("../controllers/message-template.controller"));
const authorization_1 = require("../middleware/authorization");
const enums_1 = require("../types/enums");
const router = (0, express_1.Router)();
// Rotas para templates de mensagem - ADMIN e SUPER_ADMIN podem gerenciar
router.post('/', authorization_1.AuthorizationMiddleware.requireAdmin, message_template_controller_1.default.create);
router.get('/', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), message_template_controller_1.default.findAll);
router.get('/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), message_template_controller_1.default.findById);
router.put('/:id', authorization_1.AuthorizationMiddleware.requireAdmin, message_template_controller_1.default.update);
router.delete('/:id', authorization_1.AuthorizationMiddleware.requireAdmin, message_template_controller_1.default.delete);
// Templates por tipo
router.get('/tipo/:tipo', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), message_template_controller_1.default.findByTipo);
// Templates ativos
router.get('/ativos', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), message_template_controller_1.default.findAtivos);
// Ativar/desativar template
router.patch('/:id/ativar', authorization_1.AuthorizationMiddleware.requireAdmin, message_template_controller_1.default.ativar);
router.patch('/:id/desativar', authorization_1.AuthorizationMiddleware.requireAdmin, message_template_controller_1.default.desativar);
// Duplicar template
router.post('/:id/duplicar', authorization_1.AuthorizationMiddleware.requireAdmin, message_template_controller_1.default.duplicar);
exports.default = router;
//# sourceMappingURL=message-template.routes.js.map
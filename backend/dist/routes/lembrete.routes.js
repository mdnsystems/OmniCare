"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lembrete_controller_1 = __importDefault(require("../controllers/lembrete.controller"));
const authorization_1 = require("../middleware/authorization");
const enums_1 = require("../types/enums");
const router = (0, express_1.Router)();
// Rotas para notificações de lembretes (ADMIN apenas)
router.get('/notificacoes', authorization_1.AuthorizationMiddleware.requireRole(enums_1.RoleUsuario.ADMIN), lembrete_controller_1.default.getNotificacoes);
router.put('/notificacoes/:id/marcar-lida', authorization_1.AuthorizationMiddleware.requireRole(enums_1.RoleUsuario.ADMIN), lembrete_controller_1.default.marcarNotificacaoComoLida);
router.put('/notificacoes/marcar-todas-lidas', authorization_1.AuthorizationMiddleware.requireRole(enums_1.RoleUsuario.ADMIN), lembrete_controller_1.default.marcarTodasNotificacoesComoLidas);
router.get('/notificacoes/estatisticas', authorization_1.AuthorizationMiddleware.requireRole(enums_1.RoleUsuario.ADMIN), lembrete_controller_1.default.getEstatisticasNotificacoes);
// Rotas para envio de lembretes (SUPER_ADMIN apenas)
router.post('/enviar-lembrete', authorization_1.AuthorizationMiddleware.requireRole(enums_1.RoleUsuario.SUPER_ADMIN), lembrete_controller_1.default.enviarLembretePersonalizado);
// Rotas CRUD básicas para lembretes
router.post('/', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), lembrete_controller_1.default.create);
router.get('/', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), lembrete_controller_1.default.findAll);
router.get('/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), lembrete_controller_1.default.findById);
router.put('/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), lembrete_controller_1.default.update);
router.delete('/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), lembrete_controller_1.default.delete);
exports.default = router;
//# sourceMappingURL=lembrete.routes.js.map
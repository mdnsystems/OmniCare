"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pagamento_controller_1 = __importDefault(require("../controllers/pagamento.controller"));
const authorization_1 = require("../middleware/authorization");
const enums_1 = require("../types/enums");
const router = (0, express_1.Router)();
// Rotas para pagamentos - ADMIN, SUPER_ADMIN e PROFISSIONAL podem acessar
router.post('/', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), pagamento_controller_1.default.create);
router.get('/', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), pagamento_controller_1.default.findAll);
router.get('/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), pagamento_controller_1.default.findById);
router.put('/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), pagamento_controller_1.default.update);
router.delete('/:id', authorization_1.AuthorizationMiddleware.requireAdmin, pagamento_controller_1.default.delete);
// Pagamentos por faturamento
router.get('/faturamento/:faturamentoId', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), pagamento_controller_1.default.findByFaturamento);
// Pagamentos por período
router.get('/periodo/:dataInicio/:dataFim', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), pagamento_controller_1.default.findByPeriodo);
// Pagamentos por forma de pagamento
router.get('/forma/:formaPagamento', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), pagamento_controller_1.default.findByFormaPagamento);
// Registrar pagamento
router.post('/registrar', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), pagamento_controller_1.default.registrarPagamento);
// Estornar pagamento
router.post('/:id/estornar', authorization_1.AuthorizationMiddleware.requireAdmin, pagamento_controller_1.default.estornarPagamento);
exports.default = router;
//# sourceMappingURL=pagamento.routes.js.map
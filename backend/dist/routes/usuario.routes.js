"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_controller_1 = __importDefault(require("../controllers/usuario.controller"));
const injectTenant_1 = require("../middleware/injectTenant");
const authorization_1 = require("../middleware/authorization");
const enums_1 = require("../types/enums");
const router = (0, express_1.Router)();
// Rotas públicas (não precisam de autenticação)
router.post('/login', usuario_controller_1.default.login);
// Rotas que precisam de autenticação
router.post('/registrar', injectTenant_1.TenantMiddleware.injectTenant, authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.SUPER_ADMIN]), usuario_controller_1.default.registrar);
router.get('/listar', injectTenant_1.TenantMiddleware.injectTenant, authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.SUPER_ADMIN]), usuario_controller_1.default.listar);
// Rota para listar usuários ativos (acessível a todos os usuários autenticados)
router.get('/ativos', injectTenant_1.TenantMiddleware.injectTenant, authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.SUPER_ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), usuario_controller_1.default.listarAtivos);
router.get('/:id', injectTenant_1.TenantMiddleware.injectTenant, authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.SUPER_ADMIN]), usuario_controller_1.default.buscarPorId);
router.put('/:id/atualizar', injectTenant_1.TenantMiddleware.injectTenant, authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.SUPER_ADMIN]), usuario_controller_1.default.atualizar);
router.put('/:id/alterar-senha', injectTenant_1.TenantMiddleware.injectTenant, authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.SUPER_ADMIN]), usuario_controller_1.default.alterarSenha);
router.delete('/:id/desativar', injectTenant_1.TenantMiddleware.injectTenant, authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.SUPER_ADMIN]), usuario_controller_1.default.desativar);
exports.default = router;
//# sourceMappingURL=usuario.routes.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mensagem_controller_1 = __importDefault(require("../controllers/mensagem.controller"));
const authorization_1 = require("../middleware/authorization");
const enums_1 = require("../types/enums");
const router = (0, express_1.Router)();
// Rotas para todas as roles autorizadas
router.post('/', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), mensagem_controller_1.default.create);
router.get('/', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), mensagem_controller_1.default.findAll);
router.get('/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), mensagem_controller_1.default.findById);
router.put('/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), mensagem_controller_1.default.update);
router.delete('/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), mensagem_controller_1.default.delete);
exports.default = router;
//# sourceMappingURL=mensagem.routes.js.map
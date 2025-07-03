"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faturamento_controller_1 = __importDefault(require("../controllers/faturamento.controller"));
const authorization_1 = require("../middleware/authorization");
const enums_1 = require("../types/enums");
const router = (0, express_1.Router)();
// Rotas para faturamento - ADMIN, SUPER_ADMIN e PROFISSIONAL podem acessar
router.post('/', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), faturamento_controller_1.default.create);
router.get('/', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), faturamento_controller_1.default.findAll);
router.get('/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), faturamento_controller_1.default.findById);
router.put('/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), faturamento_controller_1.default.update);
router.delete('/:id', authorization_1.AuthorizationMiddleware.requireAdmin, faturamento_controller_1.default.delete);
// Faturamentos por paciente
router.get('/paciente/:pacienteId', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), faturamento_controller_1.default.findByPaciente);
// Faturamentos por profissional
router.get('/profissional/:profissionalId', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), faturamento_controller_1.default.findByProfissional);
// Faturamentos por status
router.get('/status/:status', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), faturamento_controller_1.default.findByStatus);
// Faturamentos vencidos
router.get('/vencidos', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), faturamento_controller_1.default.findVencidos);
// Faturamentos a vencer
router.get('/a-vencer', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), faturamento_controller_1.default.findAVencer);
// Exportação de faturamentos
router.post('/exportar', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), faturamento_controller_1.default.exportar);
// Importação de faturamentos
router.post('/importar', authorization_1.AuthorizationMiddleware.requireAdmin, faturamento_controller_1.default.importar);
exports.default = router;
//# sourceMappingURL=faturamento.routes.js.map
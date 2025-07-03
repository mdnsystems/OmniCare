"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agendamento_controller_1 = __importDefault(require("../controllers/agendamento.controller"));
const injectTenant_1 = require("../middleware/injectTenant");
const authorization_1 = require("../middleware/authorization");
const enums_1 = require("../types/enums");
const router = (0, express_1.Router)();
// Aplicar middleware de tenant em todas as rotas
router.use(injectTenant_1.TenantMiddleware.injectTenant);
// Rotas para todas as roles autorizadas
router.post('/', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.create);
router.get('/', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.findAll);
router.get('/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield agendamento_controller_1.default.findById(req, res);
}));
router.put('/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.update);
router.delete('/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), agendamento_controller_1.default.delete);
// Endpoints específicos de agendamentos
router.put('/:id/confirmar', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.confirmar);
router.put('/:id/cancelar', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.cancelar);
router.put('/:id/remarcar', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.remarcar);
router.put('/:id/realizar', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), agendamento_controller_1.default.realizar);
// Agendamentos por data
router.get('/data/:data', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.findByData);
// Agendamentos por profissional
router.get('/profissional/:profissionalId', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.findByProfissional);
// Agendamentos por paciente
router.get('/paciente/:pacienteId', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.findByPaciente);
// Agendamentos de hoje
router.get('/hoje', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.findHoje);
// Agendamentos da semana
router.get('/semana', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.findSemana);
// Agendamentos do mês
router.get('/mes', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.findMes);
// Confirmação via link
router.post('/confirmar-via-link', agendamento_controller_1.default.confirmarViaLink);
// Cancelamento via link
router.post('/cancelar-via-link', agendamento_controller_1.default.cancelarViaLink);
// Verificar disponibilidade
router.post('/verificar-disponibilidade', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.verificarDisponibilidade);
// Horários disponíveis
router.get('/horarios-disponiveis/:profissionalId', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.getHorariosDisponiveis);
// Estatísticas
router.get('/estatisticas', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), agendamento_controller_1.default.getEstatisticas);
// Enviar lembrete
router.post('/enviar-lembrete/:id', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL, enums_1.RoleUsuario.RECEPCIONISTA]), agendamento_controller_1.default.enviarLembrete);
// Importar agendamentos
router.post('/importar', authorization_1.AuthorizationMiddleware.requireAdmin, agendamento_controller_1.default.importar);
// Exportar agendamentos
router.get('/exportar', authorization_1.AuthorizationMiddleware.requireAnyRole([enums_1.RoleUsuario.ADMIN, enums_1.RoleUsuario.PROFISSIONAL]), agendamento_controller_1.default.exportar);
exports.default = router;
//# sourceMappingURL=agendamento.routes.js.map
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
const agendamento_service_1 = __importDefault(require("../services/agendamento.service"));
exports.default = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                const agendamentoData = Object.assign(Object.assign({}, req.body), { tenantId });
                const agendamento = yield agendamento_service_1.default.create(agendamentoData);
                res.status(201).json({
                    success: true,
                    data: agendamento,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, profissionalId } = req.query;
                const tenantId = req.tenantId;
                console.log('🔍 [AgendamentoController] findAll - Parâmetros recebidos:', {
                    data,
                    profissionalId,
                    tenantId
                });
                let agendamentos;
                // Se tem data e profissional, usa findByProfissional
                if (data && profissionalId && profissionalId !== 'TODOS') {
                    console.log('🔍 [AgendamentoController] Usando findByProfissional');
                    agendamentos = yield agendamento_service_1.default.findByProfissional(profissionalId, data, tenantId);
                }
                // Se tem apenas data, usa findByData
                else if (data) {
                    console.log('🔍 [AgendamentoController] Usando findByData');
                    agendamentos = yield agendamento_service_1.default.findByData(data, tenantId);
                }
                // Se não tem filtros, retorna todos
                else {
                    console.log('🔍 [AgendamentoController] Usando findAll');
                    agendamentos = yield agendamento_service_1.default.findAll(tenantId);
                }
                console.log('🔍 [AgendamentoController] Agendamentos encontrados:', (agendamentos === null || agendamentos === void 0 ? void 0 : agendamentos.length) || 0);
                res.json({
                    success: true,
                    data: agendamentos || [],
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                console.error('❌ [AgendamentoController] Erro no findAll:', error);
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                const agendamento = yield agendamento_service_1.default.findById(req.params.id, tenantId);
                if (!agendamento) {
                    return res.status(404).json({
                        success: false,
                        error: 'Agendamento não encontrado',
                        timestamp: new Date().toISOString(),
                    });
                }
                res.json({
                    success: true,
                    data: agendamento,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                const agendamento = yield agendamento_service_1.default.update(req.params.id, req.body, tenantId);
                res.json({
                    success: true,
                    data: agendamento,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                yield agendamento_service_1.default.delete(req.params.id, tenantId);
                res.status(204).send();
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    // Endpoints específicos
    confirmar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                const agendamento = yield agendamento_service_1.default.confirmar(req.params.id, tenantId);
                res.json({
                    success: true,
                    data: agendamento,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    cancelar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { motivo } = req.body;
                const tenantId = req.tenantId;
                const agendamento = yield agendamento_service_1.default.cancelar(req.params.id, motivo, tenantId);
                res.json({
                    success: true,
                    data: agendamento,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    remarcar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { novaData, novaHoraInicio, novaHoraFim } = req.body;
                const tenantId = req.tenantId;
                const agendamento = yield agendamento_service_1.default.remarcar(req.params.id, novaData, novaHoraInicio, novaHoraFim, tenantId);
                res.json({
                    success: true,
                    data: agendamento,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    realizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                const agendamento = yield agendamento_service_1.default.realizar(req.params.id, tenantId);
                res.json({
                    success: true,
                    data: agendamento,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findByData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                const agendamentos = yield agendamento_service_1.default.findByData(req.params.data, tenantId);
                res.json({
                    success: true,
                    data: agendamentos || [],
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findByProfissional(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = req.query;
                const tenantId = req.tenantId;
                const agendamentos = yield agendamento_service_1.default.findByProfissional(req.params.profissionalId, data, tenantId);
                res.json({
                    success: true,
                    data: agendamentos || [],
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findByPaciente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                const agendamentos = yield agendamento_service_1.default.findByPaciente(req.params.pacienteId, tenantId);
                res.json({
                    success: true,
                    data: agendamentos || [],
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findHoje(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                const agendamentos = yield agendamento_service_1.default.findHoje(tenantId);
                res.json({
                    success: true,
                    data: agendamentos || [],
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findSemana(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dataInicio } = req.query;
                const tenantId = req.tenantId;
                const agendamentos = yield agendamento_service_1.default.findSemana(dataInicio, tenantId);
                res.json({
                    success: true,
                    data: agendamentos || [],
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findMes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ano, mes } = req.query;
                const tenantId = req.tenantId;
                const agendamentos = yield agendamento_service_1.default.findMes(ano ? parseInt(ano) : undefined, mes ? parseInt(mes) : undefined, tenantId);
                res.json({
                    success: true,
                    data: agendamentos || [],
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    confirmarViaLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.body;
                const agendamento = yield agendamento_service_1.default.confirmarViaLink(token);
                res.json({
                    success: true,
                    data: agendamento,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    cancelarViaLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.body;
                const agendamento = yield agendamento_service_1.default.cancelarViaLink(token);
                res.json({
                    success: true,
                    data: agendamento,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    verificarDisponibilidade(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { profissionalId, data, horaInicio, horaFim, excludeId } = req.body;
                const tenantId = req.tenantId;
                const resultado = yield agendamento_service_1.default.verificarDisponibilidade(profissionalId, data, horaInicio, horaFim, excludeId, tenantId);
                res.json({
                    success: true,
                    data: resultado,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    getHorariosDisponiveis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = req.query;
                const tenantId = req.tenantId;
                const horarios = yield agendamento_service_1.default.getHorariosDisponiveis(req.params.profissionalId, data, tenantId);
                res.json({
                    success: true,
                    data: horarios || [],
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    getEstatisticas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { periodo } = req.query;
                const tenantId = req.tenantId;
                const estatisticas = yield agendamento_service_1.default.getEstatisticas(periodo ? JSON.parse(periodo) : undefined, tenantId);
                res.json({
                    success: true,
                    data: estatisticas,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    enviarLembrete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                yield agendamento_service_1.default.enviarLembrete(req.params.id, tenantId);
                res.json({
                    success: true,
                    message: 'Lembrete enviado com sucesso',
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    importar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                const resultado = yield agendamento_service_1.default.importar(req.body, tenantId);
                res.json({
                    success: true,
                    data: resultado,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    exportar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                const resultado = yield agendamento_service_1.default.exportar(req.query, tenantId);
                res.json({
                    success: true,
                    data: resultado,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
};
//# sourceMappingURL=agendamento.controller.js.map
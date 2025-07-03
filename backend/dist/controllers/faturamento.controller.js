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
const faturamento_service_1 = __importDefault(require("../services/faturamento.service"));
exports.default = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const faturamento = yield faturamento_service_1.default.create(req.body);
                res.status(201).json({
                    success: true,
                    data: faturamento,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, pacienteId, profissionalId, tipo, status, dataInicio, dataFim, dataVencimentoInicio, dataVencimentoFim } = req.query;
                const faturamentos = yield faturamento_service_1.default.findAll({
                    page: Number(page),
                    limit: Number(limit),
                    pacienteId: pacienteId,
                    profissionalId: profissionalId,
                    tipo: tipo,
                    status: status,
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    dataVencimentoInicio: dataVencimentoInicio,
                    dataVencimentoFim: dataVencimentoFim,
                });
                res.json({
                    success: true,
                    data: faturamentos,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const faturamento = yield faturamento_service_1.default.findById(id);
                if (!faturamento) {
                    return res.status(404).json({
                        success: false,
                        error: 'Faturamento não encontrado',
                        timestamp: new Date().toISOString(),
                    });
                }
                res.json({
                    success: true,
                    data: faturamento,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const faturamento = yield faturamento_service_1.default.update(id, req.body);
                res.json({
                    success: true,
                    data: faturamento,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield faturamento_service_1.default.delete(id);
                res.json({
                    success: true,
                    message: 'Faturamento excluído com sucesso',
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findByPaciente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pacienteId } = req.params;
                const faturamentos = yield faturamento_service_1.default.findByPaciente(pacienteId);
                res.json({
                    success: true,
                    data: faturamentos,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findByProfissional(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { profissionalId } = req.params;
                const faturamentos = yield faturamento_service_1.default.findByProfissional(profissionalId);
                res.json({
                    success: true,
                    data: faturamentos,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findByStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status } = req.params;
                const faturamentos = yield faturamento_service_1.default.findByStatus(status);
                res.json({
                    success: true,
                    data: faturamentos,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findVencidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const faturamentos = yield faturamento_service_1.default.findVencidos();
                res.json({
                    success: true,
                    data: faturamentos,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findAVencer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dias = 7 } = req.query;
                const faturamentos = yield faturamento_service_1.default.findAVencer(Number(dias));
                res.json({
                    success: true,
                    data: faturamentos,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    exportar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filtros, formato = 'xlsx' } = req.body;
                const arquivo = yield faturamento_service_1.default.exportar(filtros, formato);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=faturamentos.xlsx');
                res.send(arquivo);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    importar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file;
                if (!file) {
                    return res.status(400).json({
                        success: false,
                        error: 'Arquivo não fornecido',
                        timestamp: new Date().toISOString(),
                    });
                }
                const resultado = yield faturamento_service_1.default.importar(file);
                res.json({
                    success: true,
                    data: resultado,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
};
//# sourceMappingURL=faturamento.controller.js.map
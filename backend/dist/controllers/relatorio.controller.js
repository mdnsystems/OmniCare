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
const relatorio_service_1 = __importDefault(require("../services/relatorio.service"));
exports.default = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const relatorio = yield relatorio_service_1.default.create(req.body);
                res.status(201).json({
                    success: true,
                    data: relatorio,
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
                const { page = 1, limit = 10, tipo, status } = req.query;
                const relatorios = yield relatorio_service_1.default.findAll({
                    page: Number(page),
                    limit: Number(limit),
                    tipo: tipo,
                    status: status,
                });
                res.json({
                    success: true,
                    data: relatorios,
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
                const relatorio = yield relatorio_service_1.default.findById(id);
                if (!relatorio) {
                    return res.status(404).json({
                        success: false,
                        error: 'Relatório não encontrado',
                        timestamp: new Date().toISOString(),
                    });
                }
                res.json({
                    success: true,
                    data: relatorio,
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
                const relatorio = yield relatorio_service_1.default.update(id, req.body);
                res.json({
                    success: true,
                    data: relatorio,
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
                yield relatorio_service_1.default.delete(id);
                res.json({
                    success: true,
                    message: 'Relatório excluído com sucesso',
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
    // Relatórios específicos
    gerarRelatorioConsultas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { periodo, filtros } = req.body;
                const relatorio = yield relatorio_service_1.default.gerarRelatorioConsultas(periodo, filtros);
                res.json({
                    success: true,
                    data: relatorio,
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
    gerarRelatorioFaturamento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { periodo, filtros } = req.body;
                const relatorio = yield relatorio_service_1.default.gerarRelatorioFaturamento(periodo, filtros);
                res.json({
                    success: true,
                    data: relatorio,
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
    gerarRelatorioDesempenho(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { periodo, filtros } = req.body;
                const relatorio = yield relatorio_service_1.default.gerarRelatorioDesempenho(periodo, filtros);
                res.json({
                    success: true,
                    data: relatorio,
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
    gerarRelatorioReceitas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { periodo, filtros } = req.body;
                const relatorio = yield relatorio_service_1.default.gerarRelatorioReceitas(periodo, filtros);
                res.json({
                    success: true,
                    data: relatorio,
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
    gerarRelatorioProfissionais(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filtros } = req.body;
                const relatorio = yield relatorio_service_1.default.gerarRelatorioProfissionais(filtros);
                res.json({
                    success: true,
                    data: relatorio,
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
    gerarRelatorioProntuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { periodo, filtros } = req.body;
                const relatorio = yield relatorio_service_1.default.gerarRelatorioProntuarios(periodo, filtros);
                res.json({
                    success: true,
                    data: relatorio,
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
    gerarRelatorioCustomizado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { configuracao } = req.body;
                const relatorio = yield relatorio_service_1.default.gerarRelatorioCustomizado(configuracao);
                res.json({
                    success: true,
                    data: relatorio,
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
    // Templates de relatório
    getTemplates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const templates = yield relatorio_service_1.default.getTemplates();
                res.json({
                    success: true,
                    data: templates,
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
    getTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const template = yield relatorio_service_1.default.getTemplate(id);
                if (!template) {
                    return res.status(404).json({
                        success: false,
                        error: 'Template não encontrado',
                        timestamp: new Date().toISOString(),
                    });
                }
                res.json({
                    success: true,
                    data: template,
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
    createTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const template = yield relatorio_service_1.default.createTemplate(req.body);
                res.status(201).json({
                    success: true,
                    data: template,
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
    updateTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const template = yield relatorio_service_1.default.updateTemplate(id, req.body);
                res.json({
                    success: true,
                    data: template,
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
    deleteTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield relatorio_service_1.default.deleteTemplate(id);
                res.json({
                    success: true,
                    message: 'Template excluído com sucesso',
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
    // Relatórios agendados
    agendarRelatorio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const agendamento = yield relatorio_service_1.default.agendarRelatorio(req.body);
                res.status(201).json({
                    success: true,
                    data: agendamento,
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
    getRelatoriosAgendados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const agendamentos = yield relatorio_service_1.default.getRelatoriosAgendados();
                res.json({
                    success: true,
                    data: agendamentos,
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
    updateRelatorioAgendado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const agendamento = yield relatorio_service_1.default.updateRelatorioAgendado(id, req.body);
                res.json({
                    success: true,
                    data: agendamento,
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
    deleteRelatorioAgendado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield relatorio_service_1.default.deleteRelatorioAgendado(id);
                res.json({
                    success: true,
                    message: 'Relatório agendado excluído com sucesso',
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
    // Histórico de relatórios
    getHistorico(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tipo, dataInicio, dataFim, status } = req.query;
                const historico = yield relatorio_service_1.default.getHistorico({
                    tipo: tipo,
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    status: status,
                });
                res.json({
                    success: true,
                    data: historico,
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
//# sourceMappingURL=relatorio.controller.js.map
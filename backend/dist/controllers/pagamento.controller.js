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
const pagamento_service_1 = __importDefault(require("../services/pagamento.service"));
exports.default = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pagamento = yield pagamento_service_1.default.create(Object.assign(Object.assign({}, req.body), { tenantId: req.tenantId }));
                res.status(201).json({
                    success: true,
                    data: pagamento,
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
                const { page = 1, limit = 10, faturamentoId, dataInicio, dataFim, formaPagamento } = req.query;
                const pagamentos = yield pagamento_service_1.default.findAll({
                    tenantId: req.tenantId,
                    faturamentoId: faturamentoId,
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    formaPagamento: formaPagamento,
                });
                res.json({
                    success: true,
                    data: pagamentos,
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
                const pagamento = yield pagamento_service_1.default.findById(id);
                if (!pagamento) {
                    return res.status(404).json({
                        success: false,
                        error: 'Pagamento não encontrado',
                        timestamp: new Date().toISOString(),
                    });
                }
                res.json({
                    success: true,
                    data: pagamento,
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
                const pagamento = yield pagamento_service_1.default.update(id, req.body);
                res.json({
                    success: true,
                    data: pagamento,
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
                yield pagamento_service_1.default.delete(id);
                res.json({
                    success: true,
                    message: 'Pagamento excluído com sucesso',
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
    findByFaturamento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { faturamentoId } = req.params;
                const pagamentos = yield pagamento_service_1.default.findByFaturamento(faturamentoId);
                res.json({
                    success: true,
                    data: pagamentos,
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
    findByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dataInicio, dataFim } = req.params;
                const pagamentos = yield pagamento_service_1.default.findByPeriodo(dataInicio, dataFim);
                res.json({
                    success: true,
                    data: pagamentos,
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
    findByFormaPagamento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { formaPagamento } = req.params;
                const pagamentos = yield pagamento_service_1.default.findByFormaPagamento(formaPagamento);
                res.json({
                    success: true,
                    data: pagamentos,
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
    registrarPagamento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { faturamentoId, valor, formaPagamento, comprovante, observacoes } = req.body;
                const pagamento = yield pagamento_service_1.default.registrarPagamento({
                    tenantId: req.tenantId,
                    faturamentoId,
                    valor,
                    formaPagamento,
                    comprovante,
                    observacoes,
                });
                res.status(201).json({
                    success: true,
                    data: pagamento,
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
    estornarPagamento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { motivo } = req.body;
                const estorno = yield pagamento_service_1.default.estornarPagamento(id, motivo, req.tenantId);
                res.json({
                    success: true,
                    data: estorno,
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
//# sourceMappingURL=pagamento.controller.js.map
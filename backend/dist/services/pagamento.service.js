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
const prisma_1 = __importDefault(require("./prisma"));
class PagamentoService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createData = Object.assign({}, data);
            if (data.valor)
                createData.valor = Number(data.valor);
            if (data.dataPagamento)
                createData.dataPagamento = new Date(data.dataPagamento);
            return yield prisma_1.default.pagamento.create({
                data: createData,
                include: {
                    faturamento: {
                        include: {
                            paciente: true,
                            profissional: true,
                        },
                    },
                },
            });
        });
    }
    static findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            const where = {};
            if (filters.tenantId) {
                where.tenantId = filters.tenantId;
            }
            if (filters.faturamentoId) {
                where.faturamentoId = filters.faturamentoId;
            }
            if (filters.dataInicio && filters.dataFim) {
                where.dataPagamento = {
                    gte: new Date(filters.dataInicio),
                    lte: new Date(filters.dataFim),
                };
            }
            if (filters.formaPagamento) {
                where.formaPagamento = filters.formaPagamento;
            }
            return yield prisma_1.default.pagamento.findMany({
                where,
                orderBy: { dataPagamento: 'desc' },
                include: {
                    faturamento: {
                        include: {
                            paciente: true,
                            profissional: true,
                        },
                    },
                },
            });
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.pagamento.findUnique({
                where: { id },
                include: {
                    faturamento: {
                        include: {
                            paciente: true,
                            profissional: true,
                        },
                    },
                },
            });
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = Object.assign({}, data);
            if (data.valor)
                updateData.valor = Number(data.valor);
            if (data.dataPagamento)
                updateData.dataPagamento = new Date(data.dataPagamento);
            return yield prisma_1.default.pagamento.update({
                where: { id },
                data: updateData,
                include: {
                    faturamento: {
                        include: {
                            paciente: true,
                            profissional: true,
                        },
                    },
                },
            });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.pagamento.delete({
                where: { id },
            });
        });
    }
    static findByFaturamento(faturamentoId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.pagamento.findMany({
                where: { faturamentoId },
                orderBy: { dataPagamento: 'desc' },
                include: {
                    faturamento: {
                        include: {
                            paciente: true,
                            profissional: true,
                        },
                    },
                },
            });
        });
    }
    static findByPeriodo(dataInicio, dataFim) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.pagamento.findMany({
                where: {
                    dataPagamento: {
                        gte: new Date(dataInicio),
                        lte: new Date(dataFim),
                    },
                },
                orderBy: { dataPagamento: 'desc' },
                include: {
                    faturamento: {
                        include: {
                            paciente: true,
                            profissional: true,
                        },
                    },
                },
            });
        });
    }
    static findByFormaPagamento(formaPagamento) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.pagamento.findMany({
                where: { formaPagamento },
                orderBy: { dataPagamento: 'desc' },
                include: {
                    faturamento: {
                        include: {
                            paciente: true,
                            profissional: true,
                        },
                    },
                },
            });
        });
    }
    static registrarPagamento(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Usar transação para garantir consistência
            return yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Criar o pagamento
                const pagamento = yield tx.pagamento.create({
                    data: {
                        tenantId: data.tenantId,
                        faturamentoId: data.faturamentoId,
                        valor: Number(data.valor),
                        formaPagamento: data.formaPagamento,
                        dataPagamento: new Date(),
                        comprovante: data.comprovante,
                        observacoes: data.observacoes,
                    },
                    include: {
                        faturamento: {
                            include: {
                                paciente: true,
                                profissional: true,
                            },
                        },
                    },
                });
                // Atualizar o status do faturamento
                const faturamento = yield tx.faturamento.findUnique({
                    where: { id: data.faturamentoId },
                });
                if (faturamento) {
                    const valorPago = Number(faturamento.valorPago || 0) + Number(data.valor);
                    const novoStatus = valorPago >= Number(faturamento.valorFinal) ? 'PAGO' : 'PARCIAL';
                    yield tx.faturamento.update({
                        where: { id: data.faturamentoId },
                        data: {
                            valorPago,
                            status: novoStatus,
                            dataPagamento: novoStatus === 'PAGO' ? new Date() : faturamento.dataPagamento,
                        },
                    });
                }
                return pagamento;
            }));
        });
    }
    static estornarPagamento(id, motivo, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Usar transação para garantir consistência
            return yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const pagamento = yield tx.pagamento.findUnique({
                    where: { id },
                    include: {
                        faturamento: true,
                    },
                });
                if (!pagamento) {
                    throw new Error('Pagamento não encontrado');
                }
                // Criar registro de estorno
                const estorno = yield tx.pagamento.create({
                    data: {
                        tenantId,
                        faturamentoId: pagamento.faturamentoId,
                        valor: -Number(pagamento.valor), // Valor negativo para estorno
                        formaPagamento: pagamento.formaPagamento,
                        dataPagamento: new Date(),
                        observacoes: `Estorno: ${motivo}`,
                    },
                    include: {
                        faturamento: {
                            include: {
                                paciente: true,
                                profissional: true,
                            },
                        },
                    },
                });
                // Atualizar o status do faturamento
                const faturamento = yield tx.faturamento.findUnique({
                    where: { id: pagamento.faturamentoId },
                });
                if (faturamento) {
                    const valorPago = Number(faturamento.valorPago || 0) - Number(pagamento.valor);
                    const novoStatus = valorPago <= 0 ? 'PENDENTE' : 'PARCIAL';
                    yield tx.faturamento.update({
                        where: { id: pagamento.faturamentoId },
                        data: {
                            valorPago: Math.max(0, valorPago),
                            status: novoStatus,
                            dataPagamento: novoStatus === 'PENDENTE' ? null : faturamento.dataPagamento,
                        },
                    });
                }
                return estorno;
            }));
        });
    }
}
exports.default = PagamentoService;
//# sourceMappingURL=pagamento.service.js.map
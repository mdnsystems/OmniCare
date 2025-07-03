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
class FaturamentoService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createData = Object.assign({}, data);
            if (data.valor)
                createData.valor = Number(data.valor);
            if (data.desconto !== undefined)
                createData.desconto = Number(data.desconto);
            if (data.valorFinal)
                createData.valorFinal = Number(data.valorFinal);
            if (data.camposPersonalizados)
                createData.camposPersonalizados = data.camposPersonalizados;
            return yield prisma_1.default.faturamento.create({
                data: createData,
                include: {
                    paciente: true,
                    profissional: true,
                    agendamento: true,
                    prontuario: true,
                },
            });
        });
    }
    static findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            const { page = 1, limit = 10, pacienteId, profissionalId, tipo, status, dataInicio, dataFim, dataVencimentoInicio, dataVencimentoFim } = filters;
            const skip = (page - 1) * limit;
            const where = {};
            if (pacienteId)
                where.pacienteId = pacienteId;
            if (profissionalId)
                where.profissionalId = profissionalId;
            if (tipo)
                where.tipo = tipo;
            if (status)
                where.status = status;
            if (dataInicio || dataFim) {
                where.dataCriacao = {};
                if (dataInicio)
                    where.dataCriacao.gte = new Date(dataInicio);
                if (dataFim)
                    where.dataCriacao.lte = new Date(dataFim);
            }
            if (dataVencimentoInicio || dataVencimentoFim) {
                where.dataVencimento = {};
                if (dataVencimentoInicio)
                    where.dataVencimento.gte = new Date(dataVencimentoInicio);
                if (dataVencimentoFim)
                    where.dataVencimento.lte = new Date(dataVencimentoFim);
            }
            const [faturamentos, total] = yield Promise.all([
                prisma_1.default.faturamento.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { dataVencimento: 'desc' },
                    include: {
                        paciente: true,
                        profissional: true,
                        agendamento: true,
                        prontuario: true,
                    },
                }),
                prisma_1.default.faturamento.count({ where }),
            ]);
            return {
                data: faturamentos,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.faturamento.findUnique({
                where: { id },
                include: {
                    paciente: true,
                    profissional: true,
                    agendamento: true,
                    prontuario: true,
                },
            });
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = Object.assign({}, data);
            if (data.valor)
                updateData.valor = Number(data.valor);
            if (data.desconto !== undefined)
                updateData.desconto = Number(data.desconto);
            if (data.valorFinal)
                updateData.valorFinal = Number(data.valorFinal);
            if (data.camposPersonalizados)
                updateData.camposPersonalizados = data.camposPersonalizados;
            return yield prisma_1.default.faturamento.update({
                where: { id },
                data: updateData,
                include: {
                    paciente: true,
                    profissional: true,
                    agendamento: true,
                    prontuario: true,
                },
            });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.faturamento.delete({
                where: { id },
            });
        });
    }
    static findByPaciente(pacienteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.faturamento.findMany({
                where: { pacienteId },
                orderBy: { dataVencimento: 'desc' },
                include: {
                    paciente: true,
                    profissional: true,
                    agendamento: true,
                    prontuario: true,
                },
            });
        });
    }
    static findByProfissional(profissionalId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.faturamento.findMany({
                where: { profissionalId },
                orderBy: { dataVencimento: 'desc' },
                include: {
                    paciente: true,
                    profissional: true,
                    agendamento: true,
                    prontuario: true,
                },
            });
        });
    }
    static findByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.faturamento.findMany({
                where: { status: status },
                orderBy: { dataVencimento: 'desc' },
                include: {
                    paciente: true,
                    profissional: true,
                    agendamento: true,
                    prontuario: true,
                },
            });
        });
    }
    static findVencidos() {
        return __awaiter(this, void 0, void 0, function* () {
            const hoje = new Date();
            return yield prisma_1.default.faturamento.findMany({
                where: {
                    dataVencimento: {
                        lt: hoje,
                    },
                    status: {
                        not: 'PAGO',
                    },
                },
                orderBy: { dataVencimento: 'asc' },
                include: {
                    paciente: true,
                    profissional: true,
                    agendamento: true,
                    prontuario: true,
                },
            });
        });
    }
    static findAVencer() {
        return __awaiter(this, arguments, void 0, function* (dias = 7) {
            const hoje = new Date();
            const dataLimite = new Date(hoje.getTime() + dias * 24 * 60 * 60 * 1000);
            return yield prisma_1.default.faturamento.findMany({
                where: {
                    dataVencimento: {
                        gte: hoje,
                        lte: dataLimite,
                    },
                    status: {
                        not: 'PAGO',
                    },
                },
                orderBy: { dataVencimento: 'asc' },
                include: {
                    paciente: true,
                    profissional: true,
                    agendamento: true,
                    prontuario: true,
                },
            });
        });
    }
    static exportar() {
        return __awaiter(this, arguments, void 0, function* (filtros = {}, formato = 'xlsx') {
            // Implementação básica - pode ser expandida com bibliotecas como xlsx
            const faturamentos = yield this.findAll(Object.assign(Object.assign({}, filtros), { limit: 1000 }));
            // Mock de exportação
            const dados = faturamentos.data.map(fat => {
                var _a, _b;
                return ({
                    id: fat.id,
                    paciente: (_a = fat.paciente) === null || _a === void 0 ? void 0 : _a.nome,
                    profissional: (_b = fat.profissional) === null || _b === void 0 ? void 0 : _b.nome,
                    tipo: fat.tipo,
                    valor: fat.valor,
                    desconto: fat.desconto,
                    valorFinal: fat.valorFinal,
                    status: fat.status,
                    dataVencimento: fat.dataVencimento,
                    dataPagamento: fat.dataPagamento,
                });
            });
            return Buffer.from(JSON.stringify(dados));
        });
    }
    static importar(file) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementação básica - pode ser expandida com validação e processamento
            const dados = JSON.parse(file.buffer.toString());
            const resultados = {
                sucessos: 0,
                erros: [],
            };
            for (const item of dados) {
                try {
                    yield this.create(item);
                    resultados.sucessos++;
                }
                catch (error) {
                    resultados.erros.push(`Erro ao importar item ${item.id}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
                }
            }
            return resultados;
        });
    }
}
exports.default = FaturamentoService;
//# sourceMappingURL=faturamento.service.js.map
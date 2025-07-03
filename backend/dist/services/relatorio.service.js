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
class RelatorioService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.relatorioEspecialidade.create({
                data: Object.assign(Object.assign({}, data), { tenantId: data.tenantId }),
            });
        });
    }
    static findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            const { page = 1, limit = 10, tipo, status } = filters;
            const skip = (page - 1) * limit;
            const where = {};
            if (tipo)
                where.tipo = tipo;
            if (status)
                where.status = status;
            const [relatorios, total] = yield Promise.all([
                prisma_1.default.relatorioEspecialidade.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                }),
                prisma_1.default.relatorioEspecialidade.count({ where }),
            ]);
            return {
                data: relatorios,
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
            return yield prisma_1.default.relatorioEspecialidade.findUnique({
                where: { id },
            });
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.relatorioEspecialidade.update({
                where: { id },
                data,
            });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.relatorioEspecialidade.delete({
                where: { id },
            });
        });
    }
    // Relatórios específicos
    static gerarRelatorioConsultas(periodo_1) {
        return __awaiter(this, arguments, void 0, function* (periodo, filtros = {}) {
            const { inicio, fim } = periodo;
            const { profissionalId, especialidadeId, status, tipo } = filtros;
            const where = {
                dataHora: {
                    gte: new Date(inicio),
                    lte: new Date(fim),
                },
            };
            if (profissionalId)
                where.profissionalId = profissionalId;
            if (especialidadeId)
                where.profissional = { especialidadeId };
            if (status)
                where.status = status;
            if (tipo)
                where.tipo = tipo;
            const agendamentos = yield prisma_1.default.agendamento.findMany({
                where,
                include: {
                    paciente: true,
                    profissional: {
                        include: {
                            especialidade: true,
                        },
                    },
                },
            });
            return {
                tipo: 'consultas',
                periodo,
                filtros,
                totalConsultas: agendamentos.length,
                dados: agendamentos,
            };
        });
    }
    static gerarRelatorioFaturamento(periodo_1) {
        return __awaiter(this, arguments, void 0, function* (periodo, filtros = {}) {
            const { inicio, fim } = periodo;
            const { profissionalId, tipo, status, formaPagamento } = filtros;
            const where = {
                dataVencimento: {
                    gte: new Date(inicio),
                    lte: new Date(fim),
                },
            };
            if (profissionalId)
                where.profissionalId = profissionalId;
            if (tipo)
                where.tipo = tipo;
            if (status)
                where.status = status;
            if (formaPagamento)
                where.formaPagamento = formaPagamento;
            const faturamentos = yield prisma_1.default.faturamento.findMany({
                where,
                include: {
                    paciente: true,
                    profissional: true,
                },
            });
            const totalFaturado = faturamentos.reduce((sum, fat) => sum + Number(fat.valor), 0);
            const totalPago = faturamentos
                .filter((fat) => fat.status === 'PAGO')
                .reduce((sum, fat) => sum + Number(fat.valor), 0);
            return {
                tipo: 'faturamento',
                periodo,
                filtros,
                totalFaturado,
                totalPago,
                totalFaturamentos: faturamentos.length,
                dados: faturamentos,
            };
        });
    }
    static gerarRelatorioDesempenho(periodo_1) {
        return __awaiter(this, arguments, void 0, function* (periodo, filtros = {}) {
            const { inicio, fim } = periodo;
            const { profissionalId, especialidadeId, tipo } = filtros;
            const where = {
                dataHora: {
                    gte: new Date(inicio),
                    lte: new Date(fim),
                },
            };
            if (profissionalId)
                where.profissionalId = profissionalId;
            if (especialidadeId)
                where.profissional = { especialidadeId };
            if (tipo)
                where.tipo = tipo;
            const agendamentos = yield prisma_1.default.agendamento.findMany({
                where,
                include: {
                    profissional: {
                        include: {
                            especialidade: true,
                        },
                    },
                },
            });
            // Agrupar por profissional
            const desempenhoPorProfissional = agendamentos.reduce((acc, agendamento) => {
                const profId = agendamento.profissionalId;
                if (!acc[profId]) {
                    acc[profId] = {
                        profissional: agendamento.profissional,
                        totalConsultas: 0,
                        consultasRealizadas: 0,
                        consultasCanceladas: 0,
                    };
                }
                acc[profId].totalConsultas++;
                if (agendamento.status === 'REALIZADO') {
                    acc[profId].consultasRealizadas++;
                }
                else if (agendamento.status === 'CANCELADO') {
                    acc[profId].consultasCanceladas++;
                }
                return acc;
            }, {});
            return {
                tipo: 'desempenho',
                periodo,
                filtros,
                dados: Object.values(desempenhoPorProfissional),
            };
        });
    }
    static gerarRelatorioReceitas(periodo_1) {
        return __awaiter(this, arguments, void 0, function* (periodo, filtros = {}) {
            const { inicio, fim } = periodo;
            const { profissionalId, tipo, formaPagamento } = filtros;
            const where = {
                dataPagamento: {
                    gte: new Date(inicio),
                    lte: new Date(fim),
                },
                status: 'PAGO',
            };
            if (profissionalId)
                where.profissionalId = profissionalId;
            if (tipo)
                where.tipo = tipo;
            if (formaPagamento)
                where.formaPagamento = formaPagamento;
            const faturamentos = yield prisma_1.default.faturamento.findMany({
                where,
                include: {
                    paciente: true,
                    profissional: true,
                },
            });
            const totalReceitas = faturamentos.reduce((sum, fat) => sum + Number(fat.valor), 0);
            return {
                tipo: 'receitas',
                periodo,
                filtros,
                totalReceitas,
                totalFaturamentos: faturamentos.length,
                dados: faturamentos,
            };
        });
    }
    static gerarRelatorioProfissionais() {
        return __awaiter(this, arguments, void 0, function* (filtros = {}) {
            const { especialidadeId, status, dataContratacaoInicio, dataContratacaoFim } = filtros;
            const where = {};
            if (especialidadeId)
                where.especialidadeId = especialidadeId;
            if (status)
                where.status = status;
            if (dataContratacaoInicio || dataContratacaoFim) {
                where.dataContratacao = {};
                if (dataContratacaoInicio)
                    where.dataContratacao.gte = new Date(dataContratacaoInicio);
                if (dataContratacaoFim)
                    where.dataContratacao.lte = new Date(dataContratacaoFim);
            }
            const profissionais = yield prisma_1.default.profissional.findMany({
                where,
                include: {
                    especialidade: true,
                    agendamentos: true,
                },
            });
            return {
                tipo: 'profissionais',
                filtros,
                totalProfissionais: profissionais.length,
                dados: profissionais,
            };
        });
    }
    static gerarRelatorioProntuarios(periodo_1) {
        return __awaiter(this, arguments, void 0, function* (periodo, filtros = {}) {
            const { inicio, fim } = periodo;
            const { profissionalId, pacienteId, tipo } = filtros;
            const where = {
                dataCriacao: {
                    gte: new Date(inicio),
                    lte: new Date(fim),
                },
            };
            if (profissionalId)
                where.profissionalId = profissionalId;
            if (pacienteId)
                where.pacienteId = pacienteId;
            if (tipo)
                where.tipo = tipo;
            const prontuarios = yield prisma_1.default.prontuario.findMany({
                where,
                include: {
                    paciente: true,
                    profissional: true,
                },
            });
            return {
                tipo: 'prontuarios',
                periodo,
                filtros,
                totalProntuarios: prontuarios.length,
                dados: prontuarios,
            };
        });
    }
    static gerarRelatorioCustomizado(configuracao) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementação básica - pode ser expandida conforme necessário
            return {
                tipo: 'customizado',
                configuracao,
                dados: [],
                message: 'Relatório customizado gerado com sucesso',
            };
        });
    }
    // Templates de relatório
    static getTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.relatorioEspecialidade.findMany({
                where: { ativo: true },
            });
        });
    }
    static getTemplate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.relatorioEspecialidade.findUnique({
                where: { id },
            });
        });
    }
    static createTemplate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.relatorioEspecialidade.create({
                data: Object.assign(Object.assign({}, data), { tenantId: data.tenantId }),
            });
        });
    }
    static updateTemplate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.relatorioEspecialidade.update({
                where: { id },
                data,
            });
        });
    }
    static deleteTemplate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.relatorioEspecialidade.delete({
                where: { id },
            });
        });
    }
    // Relatórios agendados
    static agendarRelatorio(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementação básica - pode ser expandida com sistema de agendamento
            return Object.assign(Object.assign({ id: 'agendamento-' + Date.now() }, data), { status: 'ativo', createdAt: new Date() });
        });
    }
    static getRelatoriosAgendados() {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementação básica - pode ser expandida com banco de dados
            return [];
        });
    }
    static updateRelatorioAgendado(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementação básica
            return Object.assign(Object.assign({ id }, data), { status: 'ativo', createdAt: new Date(), updatedAt: new Date() });
        });
    }
    static deleteRelatorioAgendado(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementação básica
            return { success: true };
        });
    }
    // Histórico de relatórios
    static getHistorico() {
        return __awaiter(this, arguments, void 0, function* (filtros = {}) {
            const { tipo, dataInicio, dataFim, status } = filtros;
            const where = {};
            if (tipo)
                where.tipo = tipo;
            if (status)
                where.status = status;
            if (dataInicio || dataFim) {
                where.createdAt = {};
                if (dataInicio)
                    where.createdAt.gte = new Date(dataInicio);
                if (dataFim)
                    where.createdAt.lte = new Date(dataFim);
            }
            return yield prisma_1.default.relatorioEspecialidade.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            });
        });
    }
}
exports.default = RelatorioService;
//# sourceMappingURL=relatorio.service.js.map
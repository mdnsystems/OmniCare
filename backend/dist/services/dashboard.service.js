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
const enums_1 = require("../types/enums");
exports.default = {
    getDashboard(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const hoje = new Date();
            const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            // Estatísticas de agendamentos
            const agendamentosHoje = yield prisma_1.default.agendamento.count({
                where: {
                    tenantId,
                    data: {
                        gte: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()),
                        lt: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1)
                    }
                }
            });
            const agendamentosMes = yield prisma_1.default.agendamento.count({
                where: {
                    tenantId,
                    data: {
                        gte: inicioMes,
                        lte: fimMes
                    }
                }
            });
            const agendamentosRealizados = yield prisma_1.default.agendamento.count({
                where: {
                    tenantId,
                    status: enums_1.StatusAgendamento.REALIZADO,
                    data: {
                        gte: inicioMes,
                        lte: fimMes
                    }
                }
            });
            const agendamentosCancelados = yield prisma_1.default.agendamento.count({
                where: {
                    tenantId,
                    status: enums_1.StatusAgendamento.CANCELADO,
                    data: {
                        gte: inicioMes,
                        lte: fimMes
                    }
                }
            });
            // Estatísticas financeiras
            const faturamentosMes = yield prisma_1.default.faturamento.findMany({
                where: {
                    tenantId,
                    createdAt: {
                        gte: inicioMes,
                        lte: fimMes
                    }
                }
            });
            const receitaTotal = faturamentosMes.reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
            const receitaPaga = faturamentosMes
                .filter(fat => fat.status === enums_1.StatusFaturamento.PAGO)
                .reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
            const receitaPendente = faturamentosMes
                .filter(fat => fat.status === enums_1.StatusFaturamento.PENDENTE)
                .reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
            // Estatísticas de pacientes
            const totalPacientes = yield prisma_1.default.paciente.count({ where: { tenantId } });
            const pacientesNovosMes = yield prisma_1.default.paciente.count({
                where: {
                    tenantId,
                    createdAt: {
                        gte: inicioMes,
                        lte: fimMes
                    }
                }
            });
            // Estatísticas de profissionais
            const totalProfissionais = yield prisma_1.default.profissional.count({ where: { tenantId } });
            const profissionaisAtivos = yield prisma_1.default.profissional.count({
                where: {
                    tenantId,
                    status: 'ATIVO'
                }
            });
            // Estatísticas de prontuários
            const prontuariosMes = yield prisma_1.default.prontuario.count({
                where: {
                    tenantId,
                    createdAt: {
                        gte: inicioMes,
                        lte: fimMes
                    }
                }
            });
            // Estatísticas de anamnese
            const anamnesesMes = yield prisma_1.default.anamnese.count({
                where: {
                    tenantId,
                    createdAt: {
                        gte: inicioMes,
                        lte: fimMes
                    }
                }
            });
            return {
                agendamentos: {
                    hoje: agendamentosHoje,
                    mes: agendamentosMes,
                    realizados: agendamentosRealizados,
                    cancelados: agendamentosCancelados,
                    taxaSucesso: agendamentosMes > 0 ? (agendamentosRealizados / agendamentosMes) * 100 : 0
                },
                financeiro: {
                    receitaTotal,
                    receitaPaga,
                    receitaPendente,
                    mediaTicket: agendamentosRealizados > 0 ? receitaTotal / agendamentosRealizados : 0
                },
                pacientes: {
                    total: totalPacientes,
                    novosMes: pacientesNovosMes
                },
                profissionais: {
                    total: totalProfissionais,
                    ativos: profissionaisAtivos
                },
                prontuarios: {
                    mes: prontuariosMes
                },
                anamnese: {
                    mes: anamnesesMes
                }
            };
        });
    },
    getEstatisticasAgendamentos(tenantId, periodo) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { tenantId };
            if (periodo) {
                where.data = {
                    gte: new Date(periodo.inicio),
                    lte: new Date(periodo.fim)
                };
            }
            const agendamentos = yield prisma_1.default.agendamento.findMany({
                where,
                include: {
                    paciente: true,
                    profissional: true
                }
            });
            const total = agendamentos.length;
            const realizados = agendamentos.filter(a => a.status === enums_1.StatusAgendamento.REALIZADO).length;
            const cancelados = agendamentos.filter(a => a.status === enums_1.StatusAgendamento.CANCELADO).length;
            const confirmados = agendamentos.filter(a => a.status === enums_1.StatusAgendamento.CONFIRMADO).length;
            const pendentes = agendamentos.filter(a => a.status === enums_1.StatusAgendamento.PENDENTE).length;
            const porTipo = {
                CONSULTA: agendamentos.filter(a => a.tipo === enums_1.TipoAgendamento.CONSULTA).length,
                RETORNO: agendamentos.filter(a => a.tipo === enums_1.TipoAgendamento.RETORNO).length,
                EXAME: agendamentos.filter(a => a.tipo === enums_1.TipoAgendamento.EXAME).length,
                PROCEDIMENTO: agendamentos.filter(a => a.tipo === enums_1.TipoAgendamento.PROCEDIMENTO).length
            };
            const porProfissional = yield prisma_1.default.agendamento.groupBy({
                by: ['profissionalId'],
                where,
                _count: {
                    id: true
                }
            });
            return {
                total,
                realizados,
                cancelados,
                confirmados,
                pendentes,
                taxaSucesso: total > 0 ? (realizados / total) * 100 : 0,
                taxaCancelamento: total > 0 ? (cancelados / total) * 100 : 0,
                porTipo,
                porProfissional: porProfissional.length
            };
        });
    },
    getEstatisticasFinanceiras(tenantId, periodo) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { tenantId };
            if (periodo) {
                where.createdAt = {
                    gte: new Date(periodo.inicio),
                    lte: new Date(periodo.fim)
                };
            }
            const faturamentos = yield prisma_1.default.faturamento.findMany({
                where,
                include: {
                    paciente: true,
                    profissional: true
                }
            });
            const total = faturamentos.length;
            const receitaTotal = faturamentos.reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
            const receitaPaga = faturamentos
                .filter(fat => fat.status === enums_1.StatusFaturamento.PAGO)
                .reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
            const receitaPendente = faturamentos
                .filter(fat => fat.status === enums_1.StatusFaturamento.PENDENTE)
                .reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
            const receitaVencida = faturamentos
                .filter(fat => fat.status === enums_1.StatusFaturamento.VENCIDO)
                .reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
            const porFormaPagamento = {
                DINHEIRO: faturamentos.filter(fat => fat.formaPagamento === enums_1.FormaPagamento.DINHEIRO).length,
                CARTAO_CREDITO: faturamentos.filter(fat => fat.formaPagamento === enums_1.FormaPagamento.CARTAO_CREDITO).length,
                CARTAO_DEBITO: faturamentos.filter(fat => fat.formaPagamento === enums_1.FormaPagamento.CARTAO_DEBITO).length,
                PIX: faturamentos.filter(fat => fat.formaPagamento === enums_1.FormaPagamento.PIX).length,
                TRANSFERENCIA: faturamentos.filter(fat => fat.formaPagamento === enums_1.FormaPagamento.TRANSFERENCIA).length
            };
            return {
                total,
                receitaTotal,
                receitaPaga,
                receitaPendente,
                receitaVencida,
                taxaConversao: total > 0 ? (receitaPaga / receitaTotal) * 100 : 0,
                mediaTicket: total > 0 ? receitaTotal / total : 0,
                porFormaPagamento
            };
        });
    },
    getEstatisticasPacientes(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield prisma_1.default.paciente.count({ where: { tenantId } });
            const hoje = new Date();
            const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            const novosMes = yield prisma_1.default.paciente.count({
                where: {
                    tenantId,
                    createdAt: {
                        gte: inicioMes,
                        lte: fimMes
                    }
                }
            });
            const comAgendamentos = yield prisma_1.default.paciente.count({
                where: {
                    tenantId,
                    agendamentos: {
                        some: {}
                    }
                }
            });
            return {
                total,
                novosMes,
                comAgendamentos,
                taxaRetencao: total > 0 ? (comAgendamentos / total) * 100 : 0
            };
        });
    },
    getEstatisticasProfissionais(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield prisma_1.default.profissional.count({ where: { tenantId } });
            const ativos = yield prisma_1.default.profissional.count({
                where: {
                    tenantId,
                    status: 'ATIVO'
                }
            });
            const comAgendamentos = yield prisma_1.default.profissional.count({
                where: {
                    tenantId,
                    agendamentos: {
                        some: {}
                    }
                }
            });
            return {
                total,
                ativos,
                comAgendamentos,
                taxaAtividade: total > 0 ? (ativos / total) * 100 : 0
            };
        });
    },
    getEstatisticasProntuarios(tenantId, periodo) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { tenantId };
            if (periodo) {
                where.createdAt = {
                    gte: new Date(periodo.inicio),
                    lte: new Date(periodo.fim)
                };
            }
            const total = yield prisma_1.default.prontuario.count({ where });
            const porTipo = yield prisma_1.default.prontuario.groupBy({
                by: ['tipo'],
                where,
                _count: {
                    id: true
                }
            });
            return {
                total,
                porTipo: porTipo.reduce((acc, item) => {
                    acc[item.tipo] = item._count.id;
                    return acc;
                }, {})
            };
        });
    },
    getEstatisticasAnamnese(tenantId, periodo) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { tenantId };
            if (periodo) {
                where.createdAt = {
                    gte: new Date(periodo.inicio),
                    lte: new Date(periodo.fim)
                };
            }
            const total = yield prisma_1.default.anamnese.count({ where });
            const pacientesComAnamnese = yield prisma_1.default.paciente.count({
                where: {
                    tenantId,
                    anamneses: {
                        some: {}
                    }
                }
            });
            const totalPacientes = yield prisma_1.default.paciente.count({ where: { tenantId } });
            return {
                total,
                pacientesComAnamnese,
                totalPacientes,
                taxaCobertura: totalPacientes > 0 ? (pacientesComAnamnese / totalPacientes) * 100 : 0
            };
        });
    },
    getEstatisticasAtividades(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const hoje = new Date();
            const inicioSemana = new Date(hoje);
            inicioSemana.setDate(hoje.getDate() - 7);
            // Agendamentos da semana
            const agendamentosSemana = yield prisma_1.default.agendamento.count({
                where: {
                    tenantId,
                    data: {
                        gte: inicioSemana,
                        lte: hoje
                    }
                }
            });
            const agendamentosRealizadosSemana = yield prisma_1.default.agendamento.count({
                where: {
                    tenantId,
                    status: enums_1.StatusAgendamento.REALIZADO,
                    data: {
                        gte: inicioSemana,
                        lte: hoje
                    }
                }
            });
            // Prontuários da semana
            const prontuariosSemana = yield prisma_1.default.prontuario.count({
                where: {
                    tenantId,
                    createdAt: {
                        gte: inicioSemana,
                        lte: hoje
                    }
                }
            });
            // Anamnese da semana
            const anamneseSemana = yield prisma_1.default.anamnese.count({
                where: {
                    tenantId,
                    createdAt: {
                        gte: inicioSemana,
                        lte: hoje
                    }
                }
            });
            // Faturamentos da semana
            const faturamentosSemana = yield prisma_1.default.faturamento.findMany({
                where: {
                    tenantId,
                    createdAt: {
                        gte: inicioSemana,
                        lte: hoje
                    }
                }
            });
            const receitaSemana = faturamentosSemana.reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
            return {
                agendamentosSemana,
                agendamentosRealizadosSemana,
                prontuariosSemana,
                anamneseSemana,
                receitaSemana,
                taxaSucesso: agendamentosSemana > 0 ? (agendamentosRealizadosSemana / agendamentosSemana) * 100 : 0
            };
        });
    }
};
//# sourceMappingURL=dashboard.service.js.map
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
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const agendamentoData = Object.assign(Object.assign({}, data), { data: new Date(data.data), tipo: data.tipo, status: data.status });
            return prisma_1.default.agendamento.create({ data: agendamentoData });
        });
    },
    findAll(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.agendamento.findMany({
                where: tenantId ? { tenantId } : undefined,
                include: {
                    paciente: true,
                    profissional: true
                }
            });
        });
    },
    findById(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.agendamento.findUnique({
                where: Object.assign({ id }, (tenantId && { tenantId })),
                include: {
                    paciente: true,
                    profissional: true
                }
            });
        });
    },
    update(id, data, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const agendamentoData = Object.assign(Object.assign({}, data), { data: new Date(data.data), tipo: data.tipo, status: data.status });
            return prisma_1.default.agendamento.update({
                where: Object.assign({ id }, (tenantId && { tenantId })),
                data: agendamentoData,
                include: {
                    paciente: true,
                    profissional: true
                }
            });
        });
    },
    delete(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.agendamento.delete({
                where: Object.assign({ id }, (tenantId && { tenantId }))
            });
        });
    },
    // Métodos específicos de agendamento
    confirmar(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.agendamento.update({
                where: Object.assign({ id }, (tenantId && { tenantId })),
                data: { status: enums_1.StatusAgendamento.CONFIRMADO },
                include: {
                    paciente: true,
                    profissional: true
                }
            });
        });
    },
    cancelar(id, motivo, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.agendamento.update({
                where: Object.assign({ id }, (tenantId && { tenantId })),
                data: {
                    status: enums_1.StatusAgendamento.CANCELADO,
                    observacoes: motivo
                },
                include: {
                    paciente: true,
                    profissional: true
                }
            });
        });
    },
    remarcar(id, novaData, novaHoraInicio, novaHoraFim, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.agendamento.update({
                where: Object.assign({ id }, (tenantId && { tenantId })),
                data: {
                    data: new Date(novaData),
                    horaInicio: novaHoraInicio,
                    horaFim: novaHoraFim
                },
                include: {
                    paciente: true,
                    profissional: true
                }
            });
        });
    },
    realizar(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.agendamento.update({
                where: Object.assign({ id }, (tenantId && { tenantId })),
                data: { status: enums_1.StatusAgendamento.REALIZADO },
                include: {
                    paciente: true,
                    profissional: true
                }
            });
        });
    },
    findByData(data, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataInicio = new Date(data);
            const dataFim = new Date(data);
            dataFim.setDate(dataFim.getDate() + 1);
            return prisma_1.default.agendamento.findMany({
                where: {
                    tenantId: tenantId || undefined,
                    data: {
                        gte: dataInicio,
                        lt: dataFim
                    }
                },
                include: {
                    paciente: true,
                    profissional: true
                }
            });
        });
    },
    findByProfissional(profissionalId, data, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = Object.assign({ profissionalId }, (tenantId && { tenantId }));
            if (data) {
                const dataInicio = new Date(data);
                const dataFim = new Date(data);
                dataFim.setDate(dataFim.getDate() + 1);
                where.data = {
                    gte: dataInicio,
                    lt: dataFim
                };
            }
            return prisma_1.default.agendamento.findMany({
                where,
                include: {
                    paciente: true,
                    profissional: true
                }
            });
        });
    },
    findByPaciente(pacienteId, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.agendamento.findMany({
                where: Object.assign({ pacienteId }, (tenantId && { tenantId })),
                include: {
                    paciente: true,
                    profissional: true
                }
            });
        });
    },
    findHoje(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const hoje = new Date();
            const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
            const dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
            return prisma_1.default.agendamento.findMany({
                where: {
                    tenantId: tenantId || undefined,
                    data: {
                        gte: dataInicio,
                        lt: dataFim
                    }
                },
                include: {
                    paciente: true,
                    profissional: true
                }
            });
        });
    },
    findSemana(dataInicio, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const inicio = dataInicio ? new Date(dataInicio) : new Date();
            const fim = new Date(inicio);
            fim.setDate(fim.getDate() + 7);
            return prisma_1.default.agendamento.findMany({
                where: {
                    tenantId: tenantId || undefined,
                    data: {
                        gte: inicio,
                        lt: fim
                    }
                },
                include: {
                    paciente: true,
                    profissional: true
                }
            });
        });
    },
    findMes(ano, mes, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataAtual = new Date();
            const anoFiltro = ano || dataAtual.getFullYear();
            const mesFiltro = mes !== undefined ? mes : dataAtual.getMonth();
            const inicio = new Date(anoFiltro, mesFiltro, 1);
            const fim = new Date(anoFiltro, mesFiltro + 1, 0);
            return prisma_1.default.agendamento.findMany({
                where: {
                    tenantId: tenantId || undefined,
                    data: {
                        gte: inicio,
                        lte: fim
                    }
                },
                include: {
                    paciente: true,
                    profissional: true
                }
            });
        });
    },
    confirmarViaLink(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementar lógica de confirmação via link
            // Por enquanto, retorna null
            return null;
        });
    },
    cancelarViaLink(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementar lógica de cancelamento via link
            // Por enquanto, retorna null
            return null;
        });
    },
    verificarDisponibilidade(profissionalId, data, horaInicio, horaFim, excludeId, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataAgendamento = new Date(data);
            const dataInicio = new Date(data);
            const dataFim = new Date(data);
            dataFim.setDate(dataFim.getDate() + 1);
            const agendamentosExistentes = yield prisma_1.default.agendamento.findMany({
                where: Object.assign({ profissionalId, tenantId: tenantId || undefined, data: {
                        gte: dataInicio,
                        lt: dataFim
                    } }, (excludeId && { id: { not: excludeId } }))
            });
            // Verificar sobreposição de horários
            const conflitos = agendamentosExistentes.filter(agendamento => {
                const inicioExistente = agendamento.horaInicio;
                const fimExistente = agendamento.horaFim;
                return ((horaInicio >= inicioExistente && horaInicio < fimExistente) ||
                    (horaFim > inicioExistente && horaFim <= fimExistente) ||
                    (horaInicio <= inicioExistente && horaFim >= fimExistente));
            });
            return {
                disponivel: conflitos.length === 0,
                conflitos: conflitos
            };
        });
    },
    getHorariosDisponiveis(profissionalId, data, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataAgendamento = new Date(data);
            const dataInicio = new Date(data);
            const dataFim = new Date(data);
            dataFim.setDate(dataFim.getDate() + 1);
            const agendamentosExistentes = yield prisma_1.default.agendamento.findMany({
                where: {
                    profissionalId,
                    tenantId: tenantId || undefined,
                    data: {
                        gte: dataInicio,
                        lt: dataFim
                    }
                }
            });
            // Horários padrão (8h às 18h)
            const horariosDisponiveis = [];
            const horariosOcupados = agendamentosExistentes.map(a => ({
                inicio: a.horaInicio,
                fim: a.horaFim
            }));
            // Gerar horários de 30 em 30 minutos
            for (let hora = 8; hora < 18; hora++) {
                for (let minuto = 0; minuto < 60; minuto += 30) {
                    const horarioInicio = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
                    const horarioFim = minuto === 30 ?
                        `${(hora + 1).toString().padStart(2, '0')}:00` :
                        `${hora.toString().padStart(2, '0')}:30`;
                    const conflito = horariosOcupados.some(ocupado => (horarioInicio >= ocupado.inicio && horarioInicio < ocupado.fim) ||
                        (horarioFim > ocupado.inicio && horarioFim <= ocupado.fim));
                    if (!conflito) {
                        horariosDisponiveis.push({
                            inicio: horarioInicio,
                            fim: horarioFim
                        });
                    }
                }
            }
            return horariosDisponiveis;
        });
    },
    getEstatisticas(periodo, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = Object.assign({}, (tenantId && { tenantId }));
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
    enviarLembrete(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementar lógica de envio de lembrete
            // Por enquanto, apenas retorna sucesso
            return { message: 'Lembrete enviado com sucesso' };
        });
    },
    importar(data, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementar lógica de importação
            // Por enquanto, apenas retorna sucesso
            return { message: 'Importação realizada com sucesso', quantidade: data.length };
        });
    },
    exportar(filters, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementar lógica de exportação
            // Por enquanto, apenas retorna dados básicos
            const agendamentos = yield this.findAll(tenantId);
            return Buffer.from(JSON.stringify(agendamentos));
        });
    }
};
//# sourceMappingURL=agendamento.service.js.map
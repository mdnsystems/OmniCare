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
exports.ClinicaService = void 0;
const prisma_1 = __importDefault(require("./prisma"));
class ClinicaService {
    static criarClinica(dados) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o tenant já existe
            const clinicaExistente = yield prisma_1.default.clinica.findUnique({
                where: { tenantId: dados.tenantId }
            });
            if (clinicaExistente) {
                throw new Error('Clínica com este Tenant ID já existe.');
            }
            return yield prisma_1.default.clinica.create({
                data: {
                    tenantId: dados.tenantId,
                    nome: dados.nome,
                    tipo: dados.tipo,
                    logo: dados.logo,
                    corPrimaria: dados.corPrimaria || '#2563eb',
                    corSecundaria: dados.corSecundaria || '#1e40af',
                    tema: dados.tema || 'light',
                    ativo: true
                }
            });
        });
    }
    static buscarClinicaPorTenantId(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const clinica = yield prisma_1.default.clinica.findUnique({
                where: { tenantId },
                include: {
                    _count: {
                        select: {
                            usuarios: true,
                            Profissional: true,
                            Paciente: true,
                            Agendamento: true
                        }
                    }
                }
            });
            if (!clinica) {
                throw new Error('Clínica não encontrada.');
            }
            return clinica;
        });
    }
    static listarClinicas() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.clinica.findMany({
                include: {
                    _count: {
                        select: {
                            usuarios: true,
                            Profissional: true,
                            Paciente: true,
                            Agendamento: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        });
    }
    static atualizarClinica(tenantId, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            const clinica = yield prisma_1.default.clinica.findUnique({
                where: { tenantId }
            });
            if (!clinica) {
                throw new Error('Clínica não encontrada.');
            }
            return yield prisma_1.default.clinica.update({
                where: { tenantId },
                data: dados
            });
        });
    }
    static desativarClinica(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const clinica = yield prisma_1.default.clinica.findUnique({
                where: { tenantId }
            });
            if (!clinica) {
                throw new Error('Clínica não encontrada.');
            }
            return yield prisma_1.default.clinica.update({
                where: { tenantId },
                data: { ativo: false }
            });
        });
    }
    static ativarClinica(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const clinica = yield prisma_1.default.clinica.findUnique({
                where: { tenantId }
            });
            if (!clinica) {
                throw new Error('Clínica não encontrada.');
            }
            return yield prisma_1.default.clinica.update({
                where: { tenantId },
                data: { ativo: true }
            });
        });
    }
    static obterEstatisticasClinica(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const clinica = yield prisma_1.default.clinica.findUnique({
                where: { tenantId },
                include: {
                    _count: {
                        select: {
                            usuarios: true,
                            Profissional: true,
                            Paciente: true,
                            Agendamento: true,
                            Prontuario: true,
                            Anamnese: true,
                            Exame: true
                        }
                    }
                }
            });
            if (!clinica) {
                throw new Error('Clínica não encontrada.');
            }
            // Estatísticas de agendamentos por status
            const agendamentosPorStatus = yield prisma_1.default.agendamento.groupBy({
                by: ['status'],
                where: { tenantId },
                _count: { status: true }
            });
            // Estatísticas de agendamentos por tipo
            const agendamentosPorTipo = yield prisma_1.default.agendamento.groupBy({
                by: ['tipo'],
                where: { tenantId },
                _count: { tipo: true }
            });
            // Agendamentos do mês atual
            const inicioMes = new Date();
            inicioMes.setDate(1);
            inicioMes.setHours(0, 0, 0, 0);
            const agendamentosMes = yield prisma_1.default.agendamento.count({
                where: {
                    tenantId,
                    data: {
                        gte: inicioMes
                    }
                }
            });
            return {
                clinica: {
                    id: clinica.id,
                    nome: clinica.nome,
                    tipo: clinica.tipo,
                    ativo: clinica.ativo,
                    createdAt: clinica.createdAt
                },
                estatisticas: {
                    totalUsuarios: clinica._count.usuarios,
                    totalProfissionais: clinica._count.Profissional,
                    totalPacientes: clinica._count.Paciente,
                    totalAgendamentos: clinica._count.Agendamento,
                    totalProntuarios: clinica._count.Prontuario,
                    totalAnamneses: clinica._count.Anamnese,
                    totalExames: clinica._count.Exame,
                    agendamentosMes: agendamentosMes,
                    agendamentosPorStatus,
                    agendamentosPorTipo
                }
            };
        });
    }
    static configurarWhatsApp(tenantId, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const clinica = yield prisma_1.default.clinica.findUnique({
                where: { tenantId }
            });
            if (!clinica) {
                throw new Error('Clínica não encontrada.');
            }
            return yield prisma_1.default.clinicaWhatsAppConfig.upsert({
                where: { tenantId },
                update: {
                    zApiInstanceId: config.zApiInstanceId,
                    zApiToken: config.zApiToken,
                    numeroWhatsApp: config.numeroWhatsApp,
                    mensagensAtivas: config.mensagensAtivas,
                    horarioEnvioLembrete: config.horarioEnvioLembrete,
                    diasAntecedenciaLembrete: config.diasAntecedenciaLembrete || 1,
                    ativo: true
                },
                create: {
                    tenantId,
                    zApiInstanceId: config.zApiInstanceId,
                    zApiToken: config.zApiToken,
                    numeroWhatsApp: config.numeroWhatsApp,
                    mensagensAtivas: config.mensagensAtivas,
                    horarioEnvioLembrete: config.horarioEnvioLembrete,
                    diasAntecedenciaLembrete: config.diasAntecedenciaLembrete || 1,
                    ativo: true
                }
            });
        });
    }
    static obterConfiguracaoWhatsApp(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield prisma_1.default.clinicaWhatsAppConfig.findUnique({
                where: { tenantId }
            });
            if (!config) {
                throw new Error('Configuração do WhatsApp não encontrada.');
            }
            return config;
        });
    }
}
exports.ClinicaService = ClinicaService;
//# sourceMappingURL=clinica.service.js.map
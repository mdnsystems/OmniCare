"use strict";
// =============================================================================
// SERVICE - MÓDULO DE CLÍNICAS
// =============================================================================
// 
// Lógica de negócio para gerenciamento de clínicas
// Implementa CRUD, configurações e validações
//
// =============================================================================
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicaService = void 0;
const database_1 = require("../../config/database");
const tenant_1 = require("../../utils/tenant");
class ClinicaService {
    /**
     * Cria uma nova clínica
     */
    static create(data, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nome, tipo, logo, corPrimaria, corSecundaria, tema, } = data;
            // Gera um tenantId único se não fornecido
            const finalTenantId = tenantId || (yield tenant_1.TenantUtils.generateUniqueTenantId(nome));
            // Cria a clínica
            const clinica = yield database_1.prisma.clinica.create({
                data: {
                    nome,
                    tipo,
                    logo,
                    corPrimaria,
                    corSecundaria,
                    tema,
                    ativo: true,
                    tenantId: finalTenantId,
                },
            });
            return clinica;
        });
    }
    /**
     * Busca todas as clínicas com filtros
     */
    static findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            const { page = 1, limit = 10, search, tipo, ativo, sortBy = 'nome', sortOrder = 'asc', } = filters;
            const skip = (page - 1) * limit;
            // Constrói os filtros
            const where = {};
            if (search) {
                where.OR = [
                    { nome: { contains: search, mode: 'insensitive' } },
                ];
            }
            if (tipo) {
                where.tipo = tipo;
            }
            if (ativo !== undefined) {
                where.ativo = ativo;
            }
            // Busca as clínicas
            const [clinicas, total] = yield Promise.all([
                database_1.prisma.clinica.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { [sortBy]: sortOrder },
                    include: {
                        _count: {
                            select: {
                                usuarios: true,
                                Paciente: true,
                                Profissional: true,
                                Agendamento: true,
                            },
                        },
                    },
                }),
                database_1.prisma.clinica.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                clinicas,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            };
        });
    }
    /**
     * Busca uma clínica por ID
     */
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const clinica = yield database_1.prisma.clinica.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            usuarios: true,
                            Paciente: true,
                            Profissional: true,
                            Agendamento: true,
                            Prontuario: true,
                            Exame: true,
                            Anamnese: true,
                            Mensagem: true,
                        },
                    },
                    especialidades: {
                        select: {
                            id: true,
                            nome: true,
                            descricao: true,
                            ativo: true,
                        },
                    },
                },
            });
            if (!clinica) {
                throw new Error('Clínica não encontrada');
            }
            return clinica;
        });
    }
    /**
     * Busca uma clínica por tenant ID
     */
    static findByTenantId(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const clinica = yield database_1.prisma.clinica.findUnique({
                where: { tenantId },
                include: {
                    _count: {
                        select: {
                            usuarios: true,
                            Paciente: true,
                            Profissional: true,
                            Agendamento: true,
                            Prontuario: true,
                            Exame: true,
                            Anamnese: true,
                            Mensagem: true,
                        },
                    },
                    especialidades: {
                        where: { ativo: true },
                        select: {
                            id: true,
                            nome: true,
                            descricao: true,
                        },
                    },
                },
            });
            if (!clinica) {
                throw new Error('Clínica não encontrada');
            }
            return clinica;
        });
    }
    /**
     * Atualiza uma clínica
     */
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verifica se a clínica existe
            const clinicaExistente = yield database_1.prisma.clinica.findUnique({
                where: { id },
            });
            if (!clinicaExistente) {
                throw new Error('Clínica não encontrada');
            }
            // Atualiza a clínica
            const clinica = yield database_1.prisma.clinica.update({
                where: { id },
                data,
            });
            return clinica;
        });
    }
    /**
     * Ativa/desativa uma clínica
     */
    static toggleStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verifica se a clínica existe
            const clinica = yield database_1.prisma.clinica.findUnique({
                where: { id },
            });
            if (!clinica) {
                throw new Error('Clínica não encontrada');
            }
            // Atualiza o status
            const clinicaAtualizada = yield database_1.prisma.clinica.update({
                where: { id },
                data: { ativo: !clinica.ativo },
            });
            return clinicaAtualizada;
        });
    }
    /**
     * Remove uma clínica
     */
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verifica se a clínica existe
            const clinica = yield database_1.prisma.clinica.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            usuarios: true,
                            Paciente: true,
                            Profissional: true,
                            Agendamento: true,
                        },
                    },
                },
            });
            if (!clinica) {
                throw new Error('Clínica não encontrada');
            }
            // Verifica se há dados relacionados
            if (clinica._count.usuarios > 0 ||
                clinica._count.Paciente > 0 ||
                clinica._count.Profissional > 0 ||
                clinica._count.Agendamento > 0) {
                throw new Error('Não é possível remover a clínica pois há dados relacionados');
            }
            // Remove a clínica
            yield database_1.prisma.clinica.delete({
                where: { id },
            });
            return { message: 'Clínica removida com sucesso' };
        });
    }
    /**
     * Busca estatísticas da clínica
     */
    static getStats(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [totalUsuarios, totalPacientes, totalProfissionais, totalAgendamentos, agendamentosHoje, agendamentosSemana, agendamentosMes, prontuarios, exames, anamneses,] = yield Promise.all([
                database_1.prisma.usuario.count({ where: { tenantId } }),
                database_1.prisma.paciente.count({ where: { tenantId } }),
                database_1.prisma.profissional.count({ where: { tenantId } }),
                database_1.prisma.agendamento.count({ where: { tenantId } }),
                database_1.prisma.agendamento.count({
                    where: {
                        tenantId,
                        data: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0)),
                            lt: new Date(new Date().setHours(23, 59, 59, 999)),
                        },
                    },
                }),
                database_1.prisma.agendamento.count({
                    where: {
                        tenantId,
                        data: {
                            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                        },
                    },
                }),
                database_1.prisma.agendamento.count({
                    where: {
                        tenantId,
                        data: {
                            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        },
                    },
                }),
                database_1.prisma.prontuario.count({ where: { tenantId } }),
                database_1.prisma.exame.count({ where: { tenantId } }),
                database_1.prisma.anamnese.count({ where: { tenantId } }),
            ]);
            return {
                usuarios: totalUsuarios,
                pacientes: totalPacientes,
                profissionais: totalProfissionais,
                agendamentos: {
                    total: totalAgendamentos,
                    hoje: agendamentosHoje,
                    semana: agendamentosSemana,
                    mes: agendamentosMes,
                },
                documentos: {
                    prontuarios,
                    exames,
                    anamneses,
                },
            };
        });
    }
    /**
     * Busca configurações da clínica
     */
    static getConfiguracoes(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const clinica = yield database_1.prisma.clinica.findUnique({
                where: { tenantId },
                select: {
                    corPrimaria: true,
                    corSecundaria: true,
                    tema: true,
                    logo: true,
                },
            });
            if (!clinica) {
                throw new Error('Clínica não encontrada');
            }
            return clinica;
        });
    }
    /**
     * Atualiza configurações da clínica
     */
    static updateConfiguracoes(tenantId, configuracoes) {
        return __awaiter(this, void 0, void 0, function* () {
            const clinica = yield database_1.prisma.clinica.update({
                where: { tenantId },
                data: {
                    corPrimaria: configuracoes.corPrimaria,
                    corSecundaria: configuracoes.corSecundaria,
                    tema: configuracoes.tema,
                    logo: configuracoes.logo,
                },
            });
            return clinica;
        });
    }
}
exports.ClinicaService = ClinicaService;
exports.default = ClinicaService;
//# sourceMappingURL=service.js.map
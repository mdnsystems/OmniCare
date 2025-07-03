"use strict";
// =============================================================================
// CONTROLLER - SUPER ADMIN
// =============================================================================
// 
// Controlador específico para operações do SUPER_ADMIN
// Foco em gestão de clínicas e relatórios macro
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminController = void 0;
const prisma_1 = __importDefault(require("../services/prisma"));
class SuperAdminController {
    /**
     * Lista todas as clínicas cadastradas (visão macro)
     */
    static listarClinicas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clinicas = yield prisma_1.default.clinica.findMany({
                    select: {
                        id: true,
                        nome: true,
                        tipo: true,
                        ativo: true,
                        tenantId: true,
                        createdAt: true,
                        updatedAt: true,
                        // Contadores básicos
                        _count: {
                            select: {
                                usuarios: true,
                                Profissional: true,
                                Paciente: true,
                                Agendamento: {
                                    where: {
                                        createdAt: {
                                            gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
                                        }
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                return res.status(200).json({
                    success: true,
                    data: clinicas,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao listar clínicas',
                    details: error instanceof Error ? error.message : 'Erro desconhecido',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Obtém detalhes de uma clínica específica
     */
    static obterDetalhesClinica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({
                        success: false,
                        error: 'ID da clínica é obrigatório',
                        timestamp: new Date().toISOString(),
                    });
                }
                const clinica = yield prisma_1.default.clinica.findUnique({
                    where: { id },
                    select: {
                        id: true,
                        nome: true,
                        tipo: true,
                        ativo: true,
                        tenantId: true,
                        createdAt: true,
                        updatedAt: true,
                        // Estatísticas básicas
                        _count: {
                            select: {
                                usuarios: true,
                                Profissional: true,
                                Paciente: true,
                                Agendamento: true,
                                Prontuario: true,
                                Faturamento: true
                            }
                        }
                    }
                });
                if (!clinica) {
                    return res.status(404).json({
                        success: false,
                        error: 'Clínica não encontrada',
                        timestamp: new Date().toISOString(),
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: clinica,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao obter detalhes da clínica',
                    details: error instanceof Error ? error.message : 'Erro desconhecido',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Relatório de gestão de usuários e permissões
     */
    static relatorioUsuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clinicaId } = req.query;
                const whereClause = clinicaId ? { tenantId: clinicaId } : {};
                const usuarios = yield prisma_1.default.usuario.findMany({
                    where: whereClause,
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        ativo: true,
                        createdAt: true,
                        clinica: {
                            select: {
                                id: true,
                                nome: true,
                                tenantId: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                // Agrupar usuários por clínica
                const usuariosPorClinica = usuarios.reduce((acc, usuario) => {
                    var _a;
                    const clinicaNome = ((_a = usuario.clinica) === null || _a === void 0 ? void 0 : _a.nome) || 'Sem clínica';
                    if (!acc[clinicaNome]) {
                        acc[clinicaNome] = {
                            clinica: usuario.clinica,
                            usuarios: [],
                            total: 0,
                            ativos: 0,
                            inativos: 0
                        };
                    }
                    acc[clinicaNome].usuarios.push(usuario);
                    acc[clinicaNome].total++;
                    if (usuario.ativo) {
                        acc[clinicaNome].ativos++;
                    }
                    else {
                        acc[clinicaNome].inativos++;
                    }
                    return acc;
                }, {});
                // Estatísticas gerais
                const estatisticas = {
                    totalUsuarios: usuarios.length,
                    totalAtivos: usuarios.filter((u) => u.ativo).length,
                    totalInativos: usuarios.filter((u) => !u.ativo).length,
                    porRole: {
                        ADMIN: usuarios.filter((u) => u.role === 'ADMIN').length,
                        PROFISSIONAL: usuarios.filter((u) => u.role === 'PROFISSIONAL').length,
                        RECEPCIONISTA: usuarios.filter((u) => u.role === 'RECEPCIONISTA').length,
                        SUPER_ADMIN: usuarios.filter((u) => u.role === 'SUPER_ADMIN').length
                    }
                };
                return res.status(200).json({
                    success: true,
                    data: {
                        usuarios: usuariosPorClinica,
                        estatisticas
                    },
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao gerar relatório de usuários',
                    details: error instanceof Error ? error.message : 'Erro desconhecido',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Relatório de atividades recentes
     */
    static relatorioAtividades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dias = 30 } = req.query;
                const dataInicio = new Date();
                dataInicio.setDate(dataInicio.getDate() - Number(dias));
                // Usuários ativos recentemente (baseado na criação)
                const usuariosRecentes = yield prisma_1.default.usuario.findMany({
                    where: {
                        createdAt: {
                            gte: dataInicio
                        }
                    },
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        createdAt: true,
                        clinica: {
                            select: {
                                nome: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                // Agendamentos recentes
                const agendamentosRecentes = yield prisma_1.default.agendamento.findMany({
                    where: {
                        createdAt: {
                            gte: dataInicio
                        }
                    },
                    select: {
                        id: true,
                        data: true,
                        status: true,
                        createdAt: true,
                        clinica: {
                            select: {
                                nome: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                // Faturamentos recentes
                const faturamentosRecentes = yield prisma_1.default.faturamento.findMany({
                    where: {
                        createdAt: {
                            gte: dataInicio
                        }
                    },
                    select: {
                        id: true,
                        valor: true,
                        status: true,
                        createdAt: true,
                        clinica: {
                            select: {
                                nome: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                return res.status(200).json({
                    success: true,
                    data: {
                        periodo: {
                            inicio: dataInicio.toISOString(),
                            fim: new Date().toISOString(),
                            dias: Number(dias)
                        },
                        usuarios: {
                            total: usuariosRecentes.length,
                            dados: usuariosRecentes
                        },
                        agendamentos: {
                            total: agendamentosRecentes.length,
                            dados: agendamentosRecentes
                        },
                        faturamentos: {
                            total: faturamentosRecentes.length,
                            dados: faturamentosRecentes
                        }
                    },
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao gerar relatório de atividades',
                    details: error instanceof Error ? error.message : 'Erro desconhecido',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Relatório de gestão de clínicas
     */
    static relatorioGestaoClinicas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clinicas = yield prisma_1.default.clinica.findMany({
                    select: {
                        id: true,
                        nome: true,
                        tipo: true,
                        ativo: true,
                        createdAt: true,
                        updatedAt: true,
                        _count: {
                            select: {
                                usuarios: true,
                                Paciente: true,
                                Agendamento: true,
                                Faturamento: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                const estatisticas = {
                    total: clinicas.length,
                    ativas: clinicas.filter((c) => c.ativo).length,
                    inativas: clinicas.filter((c) => !c.ativo).length,
                    porTipo: {
                        MEDICA: clinicas.filter((c) => c.tipo === 'MEDICA').length,
                        ODONTOLOGICA: clinicas.filter((c) => c.tipo === 'ODONTOLOGICA').length,
                        PSICOLOGICA: clinicas.filter((c) => c.tipo === 'PSICOLOGICA').length,
                        FISIOTERAPIA: clinicas.filter((c) => c.tipo === 'FISIOTERAPIA').length,
                        NUTRICIONAL: clinicas.filter((c) => c.tipo === 'NUTRICIONAL').length
                    }
                };
                return res.status(200).json({
                    success: true,
                    data: {
                        clinicas,
                        estatisticas
                    },
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao gerar relatório de gestão de clínicas',
                    details: error instanceof Error ? error.message : 'Erro desconhecido',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Relatório de chat e mensagens
     */
    static relatorioChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dias = 30 } = req.query;
                const dataInicio = new Date();
                dataInicio.setDate(dataInicio.getDate() - Number(dias));
                // Mensagens recentes
                const mensagensRecentes = yield prisma_1.default.mensagem.findMany({
                    where: {
                        timestamp: {
                            gte: dataInicio
                        }
                    },
                    select: {
                        id: true,
                        content: true,
                        timestamp: true,
                        senderName: true,
                        senderRole: true,
                        clinica: {
                            select: {
                                nome: true
                            }
                        }
                    },
                    orderBy: {
                        timestamp: 'desc'
                    }
                });
                // Chats ativos
                const chatsAtivos = yield prisma_1.default.chat.findMany({
                    where: {
                        ativo: true
                    },
                    select: {
                        id: true,
                        tipo: true,
                        nome: true,
                        createdAt: true,
                        _count: {
                            select: {
                                mensagens: true
                            }
                        },
                        clinica: {
                            select: {
                                nome: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                return res.status(200).json({
                    success: true,
                    data: {
                        periodo: {
                            inicio: dataInicio.toISOString(),
                            fim: new Date().toISOString(),
                            dias: Number(dias)
                        },
                        mensagens: {
                            total: mensagensRecentes.length,
                            dados: mensagensRecentes
                        },
                        chats: {
                            total: chatsAtivos.length,
                            dados: chatsAtivos
                        }
                    },
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao gerar relatório de chat',
                    details: error instanceof Error ? error.message : 'Erro desconhecido',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Ativar/Desativar clínica
     */
    static toggleStatusClinica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { ativo } = req.body;
                if (typeof ativo !== 'boolean') {
                    return res.status(400).json({
                        success: false,
                        error: 'Campo "ativo" deve ser um boolean',
                        timestamp: new Date().toISOString(),
                    });
                }
                const clinica = yield prisma_1.default.clinica.findUnique({
                    where: { id }
                });
                if (!clinica) {
                    return res.status(404).json({
                        success: false,
                        error: 'Clínica não encontrada',
                        timestamp: new Date().toISOString(),
                    });
                }
                const clinicaAtualizada = yield prisma_1.default.clinica.update({
                    where: { id },
                    data: { ativo },
                    select: {
                        id: true,
                        nome: true,
                        ativo: true,
                        updatedAt: true
                    }
                });
                return res.status(200).json({
                    success: true,
                    data: clinicaAtualizada,
                    message: `Clínica ${ativo ? 'ativada' : 'desativada'} com sucesso`,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao atualizar status da clínica',
                    details: error instanceof Error ? error.message : 'Erro desconhecido',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Atualizar dados da clínica
     */
    static atualizarClinica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, tipo, ativo } = req.body;
                const clinica = yield prisma_1.default.clinica.findUnique({
                    where: { id }
                });
                if (!clinica) {
                    return res.status(404).json({
                        success: false,
                        error: 'Clínica não encontrada',
                        timestamp: new Date().toISOString(),
                    });
                }
                const dadosAtualizacao = {};
                if (nome !== undefined)
                    dadosAtualizacao.nome = nome;
                if (tipo !== undefined)
                    dadosAtualizacao.tipo = tipo;
                if (ativo !== undefined)
                    dadosAtualizacao.ativo = ativo;
                const clinicaAtualizada = yield prisma_1.default.clinica.update({
                    where: { id },
                    data: dadosAtualizacao,
                    select: {
                        id: true,
                        nome: true,
                        tipo: true,
                        ativo: true,
                        updatedAt: true
                    }
                });
                return res.status(200).json({
                    success: true,
                    data: clinicaAtualizada,
                    message: 'Clínica atualizada com sucesso',
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao atualizar clínica',
                    details: error instanceof Error ? error.message : 'Erro desconhecido',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
}
exports.SuperAdminController = SuperAdminController;
//# sourceMappingURL=super-admin.controller.js.map
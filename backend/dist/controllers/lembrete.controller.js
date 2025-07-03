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
const prisma_1 = __importDefault(require("../services/prisma"));
exports.default = {
    // Buscar notificações de lembretes para o tenant atual
    getNotificacoes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                // Buscar lembretes da clínica atual
                const lembretes = yield prisma_1.default.lembreteClinica.findMany({
                    where: {
                        fatura: {
                            tenantId: tenantId
                        }
                    },
                    include: {
                        fatura: {
                            include: {
                                clinica: {
                                    select: {
                                        nome: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        dataEnvio: 'desc'
                    }
                });
                // Transformar para o formato esperado pelo frontend
                const notificacoes = lembretes.map((lembrete) => ({
                    id: lembrete.id,
                    faturaId: lembrete.faturaId,
                    tipo: lembrete.tipo,
                    mensagem: lembrete.mensagem,
                    destinatario: lembrete.destinatario,
                    dataEnvio: lembrete.dataEnvio.toISOString(),
                    status: lembrete.status,
                    lida: false, // Por enquanto, todos os lembretes são considerados não lidos
                    fatura: {
                        numeroFatura: lembrete.fatura.numeroFatura,
                        valor: Number(lembrete.fatura.valor),
                        dataVencimento: lembrete.fatura.dataVencimento.toISOString(),
                        clinica: {
                            nome: lembrete.fatura.clinica.nome
                        }
                    }
                }));
                res.json({
                    success: true,
                    data: notificacoes
                });
            }
            catch (error) {
                console.error('Erro ao buscar notificações:', error);
                res.status(500).json({
                    success: false,
                    message: 'Erro interno do servidor'
                });
            }
        });
    },
    // Marcar notificação como lida
    marcarNotificacaoComoLida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const tenantId = req.tenantId;
                // Verificar se o lembrete pertence ao tenant atual
                const lembrete = yield prisma_1.default.lembreteClinica.findFirst({
                    where: {
                        id: id,
                        fatura: {
                            tenantId: tenantId
                        }
                    }
                });
                if (!lembrete) {
                    return res.status(404).json({
                        success: false,
                        message: 'Lembrete não encontrado'
                    });
                }
                // Atualizar status para lido
                yield prisma_1.default.lembreteClinica.update({
                    where: { id: id },
                    data: { status: 'LIDO' }
                });
                res.json({
                    success: true,
                    message: 'Notificação marcada como lida'
                });
            }
            catch (error) {
                console.error('Erro ao marcar notificação como lida:', error);
                res.status(500).json({
                    success: false,
                    message: 'Erro interno do servidor'
                });
            }
        });
    },
    // Marcar todas as notificações como lidas
    marcarTodasNotificacoesComoLidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                // Buscar todos os lembretes não lidos do tenant
                const lembretesNaoLidos = yield prisma_1.default.lembreteClinica.findMany({
                    where: {
                        fatura: {
                            tenantId: tenantId
                        },
                        status: {
                            not: 'LIDO'
                        }
                    }
                });
                // Marcar todos como lidos
                if (lembretesNaoLidos.length > 0) {
                    yield prisma_1.default.lembreteClinica.updateMany({
                        where: {
                            fatura: {
                                tenantId: tenantId
                            },
                            status: {
                                not: 'LIDO'
                            }
                        },
                        data: { status: 'LIDO' }
                    });
                }
                res.json({
                    success: true,
                    message: `${lembretesNaoLidos.length} notificações marcadas como lidas`
                });
            }
            catch (error) {
                console.error('Erro ao marcar todas as notificações como lidas:', error);
                res.status(500).json({
                    success: false,
                    message: 'Erro interno do servidor'
                });
            }
        });
    },
    // Enviar lembrete personalizado (para SUPER_ADMIN)
    enviarLembretePersonalizado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { faturaId, tipo, mensagem, destinatario } = req.body;
                const tenantId = req.tenantId;
                // Verificar se a fatura existe e pertence ao tenant
                const fatura = yield prisma_1.default.faturaClinica.findFirst({
                    where: {
                        id: faturaId,
                        tenantId: tenantId
                    }
                });
                if (!fatura) {
                    return res.status(404).json({
                        success: false,
                        message: 'Fatura não encontrada'
                    });
                }
                // Criar o lembrete
                const lembrete = yield prisma_1.default.lembreteClinica.create({
                    data: {
                        faturaId: faturaId,
                        tipo: tipo,
                        mensagem: mensagem,
                        destinatario: destinatario,
                        status: 'ENVIADO'
                    }
                });
                res.json({
                    success: true,
                    data: lembrete,
                    message: 'Lembrete enviado com sucesso'
                });
            }
            catch (error) {
                console.error('Erro ao enviar lembrete:', error);
                res.status(500).json({
                    success: false,
                    message: 'Erro interno do servidor'
                });
            }
        });
    },
    // Buscar estatísticas de lembretes
    getEstatisticasNotificacoes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                const [totalLembretes, lembretesEnviados, lembretesLidos, lembretesPendentes] = yield Promise.all([
                    prisma_1.default.lembreteClinica.count({
                        where: {
                            fatura: {
                                tenantId: tenantId
                            }
                        }
                    }),
                    prisma_1.default.lembreteClinica.count({
                        where: {
                            fatura: {
                                tenantId: tenantId
                            },
                            status: 'ENVIADO'
                        }
                    }),
                    prisma_1.default.lembreteClinica.count({
                        where: {
                            fatura: {
                                tenantId: tenantId
                            },
                            status: 'LIDO'
                        }
                    }),
                    prisma_1.default.lembreteClinica.count({
                        where: {
                            fatura: {
                                tenantId: tenantId
                            },
                            status: {
                                in: ['ENVIADO', 'ENTREGUE']
                            }
                        }
                    })
                ]);
                res.json({
                    success: true,
                    data: {
                        total: totalLembretes,
                        enviados: lembretesEnviados,
                        lidos: lembretesLidos,
                        pendentes: lembretesPendentes
                    }
                });
            }
            catch (error) {
                console.error('Erro ao buscar estatísticas:', error);
                res.status(500).json({
                    success: false,
                    message: 'Erro interno do servidor'
                });
            }
        });
    },
    // Métodos CRUD básicos
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                const data = Object.assign(Object.assign({}, req.body), { tenantId });
                const lembrete = yield prisma_1.default.lembreteClinica.create({
                    data
                });
                res.status(201).json({
                    success: true,
                    data: lembrete
                });
            }
            catch (error) {
                console.error('Erro ao criar lembrete:', error);
                res.status(400).json({
                    success: false,
                    message: 'Erro ao criar lembrete'
                });
            }
        });
    },
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId;
                const lembretes = yield prisma_1.default.lembreteClinica.findMany({
                    where: {
                        fatura: {
                            tenantId: tenantId
                        }
                    },
                    include: {
                        fatura: true
                    },
                    orderBy: {
                        dataEnvio: 'desc'
                    }
                });
                res.json({
                    success: true,
                    data: lembretes
                });
            }
            catch (error) {
                console.error('Erro ao buscar lembretes:', error);
                res.status(500).json({
                    success: false,
                    message: 'Erro interno do servidor'
                });
            }
        });
    },
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const tenantId = req.tenantId;
                const lembrete = yield prisma_1.default.lembreteClinica.findFirst({
                    where: {
                        id: id,
                        fatura: {
                            tenantId: tenantId
                        }
                    },
                    include: {
                        fatura: true
                    }
                });
                if (!lembrete) {
                    return res.status(404).json({
                        success: false,
                        message: 'Lembrete não encontrado'
                    });
                }
                res.json({
                    success: true,
                    data: lembrete
                });
            }
            catch (error) {
                console.error('Erro ao buscar lembrete:', error);
                res.status(500).json({
                    success: false,
                    message: 'Erro interno do servidor'
                });
            }
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const tenantId = req.tenantId;
                // Verificar se o lembrete pertence ao tenant
                const lembreteExistente = yield prisma_1.default.lembreteClinica.findFirst({
                    where: {
                        id: id,
                        fatura: {
                            tenantId: tenantId
                        }
                    }
                });
                if (!lembreteExistente) {
                    return res.status(404).json({
                        success: false,
                        message: 'Lembrete não encontrado'
                    });
                }
                const lembrete = yield prisma_1.default.lembreteClinica.update({
                    where: { id: id },
                    data: req.body
                });
                res.json({
                    success: true,
                    data: lembrete
                });
            }
            catch (error) {
                console.error('Erro ao atualizar lembrete:', error);
                res.status(400).json({
                    success: false,
                    message: 'Erro ao atualizar lembrete'
                });
            }
        });
    },
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const tenantId = req.tenantId;
                // Verificar se o lembrete pertence ao tenant
                const lembrete = yield prisma_1.default.lembreteClinica.findFirst({
                    where: {
                        id: id,
                        fatura: {
                            tenantId: tenantId
                        }
                    }
                });
                if (!lembrete) {
                    return res.status(404).json({
                        success: false,
                        message: 'Lembrete não encontrado'
                    });
                }
                yield prisma_1.default.lembreteClinica.delete({
                    where: { id: id }
                });
                res.status(204).send();
            }
            catch (error) {
                console.error('Erro ao deletar lembrete:', error);
                res.status(400).json({
                    success: false,
                    message: 'Erro ao deletar lembrete'
                });
            }
        });
    }
};
//# sourceMappingURL=lembrete.controller.js.map
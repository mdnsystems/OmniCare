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
Object.defineProperty(exports, "__esModule", { value: true });
const clinica_service_1 = require("../services/clinica.service");
const enums_1 = require("../types/enums");
exports.default = {
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, nome, tipo, logo, corPrimaria, corSecundaria, tema } = req.body;
            if (!tenantId || !nome || !tipo) {
                res.status(400).json({
                    success: false,
                    error: 'Tenant ID, nome e tipo são obrigatórios.',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            if (!Object.values(enums_1.TipoClinica).includes(tipo)) {
                res.status(400).json({
                    success: false,
                    error: 'Tipo de clínica inválido.',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            try {
                const clinica = yield clinica_service_1.ClinicaService.criarClinica({
                    tenantId,
                    nome,
                    tipo: tipo,
                    logo,
                    corPrimaria,
                    corSecundaria,
                    tema
                });
                res.status(201).json({
                    success: true,
                    data: clinica,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes('já existe')) {
                        res.status(409).json({
                            success: false,
                            error: error.message,
                            timestamp: new Date().toISOString(),
                        });
                    }
                    else {
                        res.status(500).json({
                            success: false,
                            error: 'Erro ao criar clínica.',
                            details: error.message,
                            timestamp: new Date().toISOString(),
                        });
                    }
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Erro ao criar clínica.',
                        timestamp: new Date().toISOString(),
                    });
                }
            }
        });
    },
    buscarPorTenantId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.params;
            try {
                const clinica = yield clinica_service_1.ClinicaService.buscarClinicaPorTenantId(tenantId);
                res.json({
                    success: true,
                    data: clinica,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Clínica não encontrada.') {
                    res.status(404).json({
                        success: false,
                        error: error.message,
                        timestamp: new Date().toISOString(),
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Erro ao buscar clínica.',
                        details: error instanceof Error ? error.message : 'Erro desconhecido',
                        timestamp: new Date().toISOString(),
                    });
                }
            }
        });
    },
    listar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clinicas = yield clinica_service_1.ClinicaService.listarClinicas();
                res.json({
                    success: true,
                    data: clinicas || [],
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Erro ao listar clínicas.',
                    details: error instanceof Error ? error.message : 'Erro desconhecido',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    atualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.params;
            const dados = req.body;
            try {
                const clinica = yield clinica_service_1.ClinicaService.atualizarClinica(tenantId, dados);
                res.json({
                    success: true,
                    data: clinica,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Clínica não encontrada.') {
                    res.status(404).json({
                        success: false,
                        error: error.message,
                        timestamp: new Date().toISOString(),
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Erro ao atualizar clínica.',
                        details: error instanceof Error ? error.message : 'Erro desconhecido',
                        timestamp: new Date().toISOString(),
                    });
                }
            }
        });
    },
    desativar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.params;
            try {
                const clinica = yield clinica_service_1.ClinicaService.desativarClinica(tenantId);
                res.json({
                    success: true,
                    message: 'Clínica desativada com sucesso.',
                    data: clinica,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Clínica não encontrada.') {
                    res.status(404).json({
                        success: false,
                        error: error.message,
                        timestamp: new Date().toISOString(),
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Erro ao desativar clínica.',
                        details: error instanceof Error ? error.message : 'Erro desconhecido',
                        timestamp: new Date().toISOString(),
                    });
                }
            }
        });
    },
    ativar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.params;
            try {
                const clinica = yield clinica_service_1.ClinicaService.ativarClinica(tenantId);
                res.json({
                    success: true,
                    message: 'Clínica ativada com sucesso.',
                    data: clinica,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Clínica não encontrada.') {
                    res.status(404).json({
                        success: false,
                        error: error.message,
                        timestamp: new Date().toISOString(),
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Erro ao ativar clínica.',
                        details: error instanceof Error ? error.message : 'Erro desconhecido',
                        timestamp: new Date().toISOString(),
                    });
                }
            }
        });
    },
    obterEstatisticas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.params;
            try {
                const estatisticas = yield clinica_service_1.ClinicaService.obterEstatisticasClinica(tenantId);
                res.json({
                    success: true,
                    data: estatisticas,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Clínica não encontrada.') {
                    res.status(404).json({
                        success: false,
                        error: error.message,
                        timestamp: new Date().toISOString(),
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Erro ao obter estatísticas.',
                        details: error instanceof Error ? error.message : 'Erro desconhecido',
                        timestamp: new Date().toISOString(),
                    });
                }
            }
        });
    },
    configurarWhatsApp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.params;
            const config = req.body;
            if (!config.zApiInstanceId || !config.zApiToken || !config.numeroWhatsApp) {
                res.status(400).json({
                    success: false,
                    error: 'zApiInstanceId, zApiToken e numeroWhatsApp são obrigatórios.',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            try {
                const whatsappConfig = yield clinica_service_1.ClinicaService.configurarWhatsApp(tenantId, config);
                res.json({
                    success: true,
                    message: 'Configuração do WhatsApp salva com sucesso.',
                    data: whatsappConfig,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Clínica não encontrada.') {
                    res.status(404).json({
                        success: false,
                        error: error.message,
                        timestamp: new Date().toISOString(),
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Erro ao configurar WhatsApp.',
                        details: error instanceof Error ? error.message : 'Erro desconhecido',
                        timestamp: new Date().toISOString(),
                    });
                }
            }
        });
    },
    obterConfiguracaoWhatsApp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.params;
            try {
                const config = yield clinica_service_1.ClinicaService.obterConfiguracaoWhatsApp(tenantId);
                res.json({
                    success: true,
                    data: config,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Configuração do WhatsApp não encontrada.') {
                    res.status(404).json({
                        success: false,
                        error: error.message,
                        timestamp: new Date().toISOString(),
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Erro ao obter configuração do WhatsApp.',
                        details: error instanceof Error ? error.message : 'Erro desconhecido',
                        timestamp: new Date().toISOString(),
                    });
                }
            }
        });
    }
};
//# sourceMappingURL=clinica.controller.js.map
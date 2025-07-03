"use strict";
// =============================================================================
// CONTROLLER - MÓDULO DE CLÍNICAS
// =============================================================================
// 
// Controlador para operações de clínicas
// Gerencia requests e responses da API
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
exports.ClinicaController = void 0;
const service_1 = __importDefault(require("./service"));
const validation_1 = require("./validation");
class ClinicaController {
    /**
     * Cria uma nova clínica
     */
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Valida os dados de entrada
                const dadosValidados = validation_1.ClinicaValidator.validateCreate(req.body);
                // Executa a criação passando o tenantId se disponível
                const resultado = yield service_1.default.create(dadosValidados, req.tenantId);
                return res.status(201).json({
                    success: true,
                    data: resultado,
                    message: 'Clínica criada com sucesso',
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Lista todas as clínicas
     */
    static findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Valida os filtros
                const filtros = validation_1.ClinicaValidator.validateFilters(req.query);
                // Executa a busca
                const resultado = yield service_1.default.findAll(filtros);
                return res.status(200).json({
                    success: true,
                    data: resultado.clinicas,
                    pagination: resultado.pagination,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Busca uma clínica por ID
     */
    static findById(req, res) {
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
                // Executa a busca
                const resultado = yield service_1.default.findById(id);
                return res.status(200).json({
                    success: true,
                    data: resultado,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Busca uma clínica por tenant ID
     */
    static findByTenantId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId } = req.params;
                if (!tenantId) {
                    return res.status(400).json({
                        success: false,
                        error: 'Tenant ID é obrigatório',
                        timestamp: new Date().toISOString(),
                    });
                }
                // Executa a busca
                const resultado = yield service_1.default.findByTenantId(tenantId);
                return res.status(200).json({
                    success: true,
                    data: resultado,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                // Se a clínica não foi encontrada, retorna 404
                if (error instanceof Error && error.message === 'Clínica não encontrada') {
                    return res.status(404).json({
                        success: false,
                        error: error.message,
                        timestamp: new Date().toISOString(),
                    });
                }
                return res.status(400).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Atualiza uma clínica
     */
    static update(req, res) {
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
                // Valida os dados de entrada
                const dadosValidados = validation_1.ClinicaValidator.validateUpdate(req.body);
                // Executa a atualização
                const resultado = yield service_1.default.update(id, dadosValidados);
                return res.status(200).json({
                    success: true,
                    data: resultado,
                    message: 'Clínica atualizada com sucesso',
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Ativa/desativa uma clínica
     */
    static toggleStatus(req, res) {
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
                // Executa a alteração de status
                const resultado = yield service_1.default.toggleStatus(id);
                return res.status(200).json({
                    success: true,
                    data: resultado,
                    message: `Clínica ${resultado.ativo ? 'ativada' : 'desativada'} com sucesso`,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Remove uma clínica
     */
    static delete(req, res) {
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
                // Executa a remoção
                const resultado = yield service_1.default.delete(id);
                return res.status(200).json({
                    success: true,
                    data: resultado,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Busca estatísticas da clínica
     */
    static getStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId } = req.params;
                if (!tenantId) {
                    return res.status(400).json({
                        success: false,
                        error: 'Tenant ID é obrigatório',
                        timestamp: new Date().toISOString(),
                    });
                }
                // Executa a busca das estatísticas
                const resultado = yield service_1.default.getStats(tenantId);
                return res.status(200).json({
                    success: true,
                    data: resultado,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Busca configurações da clínica
     */
    static getConfiguracoes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId } = req.params;
                if (!tenantId) {
                    return res.status(400).json({
                        success: false,
                        error: 'Tenant ID é obrigatório',
                        timestamp: new Date().toISOString(),
                    });
                }
                // Executa a busca das configurações
                const resultado = yield service_1.default.getConfiguracoes(tenantId);
                return res.status(200).json({
                    success: true,
                    data: resultado,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Atualiza configurações da clínica
     */
    static updateConfiguracoes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId } = req.params;
                if (!tenantId) {
                    return res.status(400).json({
                        success: false,
                        error: 'Tenant ID é obrigatório',
                        timestamp: new Date().toISOString(),
                    });
                }
                // Valida as configurações
                const configuracoes = validation_1.ClinicaValidator.validateConfiguracoes(req.body);
                // Executa a atualização das configurações
                const resultado = yield service_1.default.updateConfiguracoes(tenantId, configuracoes);
                return res.status(200).json({
                    success: true,
                    data: resultado,
                    message: 'Configurações atualizadas com sucesso',
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Configura integração com WhatsApp (stub)
     */
    static configureWhatsApp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(501).json({
                success: false,
                error: 'configureWhatsApp não implementado',
                timestamp: new Date().toISOString(),
            });
        });
    }
    /**
     * Obtém configuração do WhatsApp (stub)
     */
    static getWhatsAppConfig(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(501).json({
                success: false,
                error: 'getWhatsAppConfig não implementado',
                timestamp: new Date().toISOString(),
            });
        });
    }
    /**
     * Cria template de mensagem (stub)
     */
    static createMessageTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(501).json({
                success: false,
                error: 'createMessageTemplate não implementado',
                timestamp: new Date().toISOString(),
            });
        });
    }
    /**
     * Lista templates de mensagem (stub)
     */
    static listMessageTemplates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(501).json({
                success: false,
                error: 'listMessageTemplates não implementado',
                timestamp: new Date().toISOString(),
            });
        });
    }
    /**
     * Atualiza template de mensagem (stub)
     */
    static updateMessageTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(501).json({
                success: false,
                error: 'updateMessageTemplate não implementado',
                timestamp: new Date().toISOString(),
            });
        });
    }
    /**
     * Deleta template de mensagem (stub)
     */
    static deleteMessageTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(501).json({
                success: false,
                error: 'deleteMessageTemplate não implementado',
                timestamp: new Date().toISOString(),
            });
        });
    }
}
exports.ClinicaController = ClinicaController;
exports.default = ClinicaController;
//# sourceMappingURL=controller.js.map
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
const message_template_service_1 = __importDefault(require("../services/message-template.service"));
exports.default = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const template = yield message_template_service_1.default.create(req.body);
                res.status(201).json({
                    success: true,
                    data: template,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, tipo, ativo } = req.query;
                const templates = yield message_template_service_1.default.findAll({
                    page: Number(page),
                    limit: Number(limit),
                    tipo: tipo,
                    ativo: ativo === 'true',
                });
                res.json({
                    success: true,
                    data: templates,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const template = yield message_template_service_1.default.findById(id);
                if (!template) {
                    return res.status(404).json({
                        success: false,
                        error: 'Template não encontrado',
                        timestamp: new Date().toISOString(),
                    });
                }
                res.json({
                    success: true,
                    data: template,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const template = yield message_template_service_1.default.update(id, req.body);
                res.json({
                    success: true,
                    data: template,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield message_template_service_1.default.delete(id);
                res.json({
                    success: true,
                    message: 'Template excluído com sucesso',
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findByTipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tipo } = req.params;
                const templates = yield message_template_service_1.default.findByTipo(tipo);
                res.json({
                    success: true,
                    data: templates,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findAtivos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const templates = yield message_template_service_1.default.findAtivos();
                res.json({
                    success: true,
                    data: templates,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    ativar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const template = yield message_template_service_1.default.ativar(id);
                res.json({
                    success: true,
                    data: template,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    desativar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const template = yield message_template_service_1.default.desativar(id);
                res.json({
                    success: true,
                    data: template,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    duplicar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome } = req.body;
                const template = yield message_template_service_1.default.duplicar(id, nome);
                res.status(201).json({
                    success: true,
                    data: template,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
};
//# sourceMappingURL=message-template.controller.js.map
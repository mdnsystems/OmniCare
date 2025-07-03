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
const paciente_service_1 = __importDefault(require("../services/paciente.service"));
exports.default = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId || 'default-tenant';
                const data = Object.assign(Object.assign({}, req.body), { tenantId });
                const paciente = yield paciente_service_1.default.create(data);
                res.status(201).json({
                    success: true,
                    data: paciente,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId || 'default-tenant';
                // Extrair filtros da query string
                const filters = {
                    nome: req.query.nome,
                    cpf: req.query.cpf,
                    email: req.query.email,
                    profissionalId: req.query.profissionalId,
                    page: req.query.page ? parseInt(req.query.page) : 1,
                    limit: req.query.limit ? parseInt(req.query.limit) : 10,
                };
                const result = yield paciente_service_1.default.findAll(filters, tenantId);
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId || 'default-tenant';
                const paciente = yield paciente_service_1.default.findById(req.params.id, tenantId);
                if (!paciente)
                    return res.status(404).json({
                        success: false,
                        error: 'Paciente não encontrado',
                        timestamp: new Date().toISOString(),
                    });
                res.json({
                    success: true,
                    data: paciente,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId || 'default-tenant';
                const paciente = yield paciente_service_1.default.update(req.params.id, req.body, tenantId);
                res.json({
                    success: true,
                    data: paciente,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId || 'default-tenant';
                const cascade = req.query.cascade === 'true';
                if (cascade) {
                    yield paciente_service_1.default.deleteWithCascade(req.params.id, tenantId);
                }
                else {
                    yield paciente_service_1.default.delete(req.params.id, tenantId);
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    checkRelations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId || 'default-tenant';
                const relations = yield paciente_service_1.default.checkRelations(req.params.id, tenantId);
                res.json({
                    success: true,
                    data: relations,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
};
//# sourceMappingURL=paciente.controller.js.map
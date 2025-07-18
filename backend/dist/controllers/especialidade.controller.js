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
const especialidade_service_1 = __importDefault(require("../services/especialidade.service"));
const enums_1 = require("../types/enums");
exports.default = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId || 'default-tenant';
                const data = Object.assign(Object.assign({}, req.body), { tenantId, tipoClinica: enums_1.TipoClinica.MEDICA, configuracoes: {} });
                const especialidade = yield especialidade_service_1.default.create(data);
                res.status(201).json({
                    success: true,
                    data: especialidade,
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
                const especialidades = yield especialidade_service_1.default.findAll();
                res.json({
                    success: true,
                    data: especialidades || [],
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
                const especialidade = yield especialidade_service_1.default.findById(req.params.id);
                if (!especialidade)
                    return res.status(404).json({
                        success: false,
                        error: 'Especialidade não encontrada',
                        timestamp: new Date().toISOString(),
                    });
                res.json({
                    success: true,
                    data: especialidade,
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
                const especialidade = yield especialidade_service_1.default.update(req.params.id, req.body);
                res.json({
                    success: true,
                    data: especialidade,
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
                yield especialidade_service_1.default.delete(req.params.id);
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
};
//# sourceMappingURL=especialidade.controller.js.map
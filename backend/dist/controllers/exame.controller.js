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
const exame_service_1 = __importDefault(require("../services/exame.service"));
exports.default = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenantId = req.tenantId || 'default-tenant';
                const data = Object.assign(Object.assign({}, req.body), { tenantId, arquivos: req.body.arquivo ? [req.body.arquivo] : [] });
                const exame = yield exame_service_1.default.create(data);
                res.status(201).json({
                    success: true,
                    data: exame,
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
                const exames = yield exame_service_1.default.findAll();
                res.json({
                    success: true,
                    data: exames || [],
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
                const exame = yield exame_service_1.default.findById(req.params.id);
                if (!exame)
                    return res.status(404).json({
                        success: false,
                        error: 'Exame não encontrado',
                        timestamp: new Date().toISOString(),
                    });
                res.json({
                    success: true,
                    data: exame,
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
                const exame = yield exame_service_1.default.update(req.params.id, req.body);
                res.json({
                    success: true,
                    data: exame,
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
                yield exame_service_1.default.delete(req.params.id);
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
//# sourceMappingURL=exame.controller.js.map
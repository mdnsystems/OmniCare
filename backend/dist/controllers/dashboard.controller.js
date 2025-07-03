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
const dashboard_service_1 = __importDefault(require("../services/dashboard.service"));
exports.default = {
    getDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId } = req;
                const dashboard = yield dashboard_service_1.default.getDashboard(tenantId);
                res.json({
                    success: true,
                    data: dashboard,
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
    getEstatisticasAgendamentos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId } = req;
                const { periodo } = req.query;
                const estatisticas = yield dashboard_service_1.default.getEstatisticasAgendamentos(tenantId, periodo ? JSON.parse(periodo) : undefined);
                res.json({
                    success: true,
                    data: estatisticas,
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
    getEstatisticasFinanceiras(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId } = req;
                const { periodo } = req.query;
                const estatisticas = yield dashboard_service_1.default.getEstatisticasFinanceiras(tenantId, periodo ? JSON.parse(periodo) : undefined);
                res.json({
                    success: true,
                    data: estatisticas,
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
    getEstatisticasPacientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId } = req;
                const estatisticas = yield dashboard_service_1.default.getEstatisticasPacientes(tenantId);
                res.json({
                    success: true,
                    data: estatisticas,
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
    getEstatisticasProfissionais(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId } = req;
                const estatisticas = yield dashboard_service_1.default.getEstatisticasProfissionais(tenantId);
                res.json({
                    success: true,
                    data: estatisticas,
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
    getEstatisticasProntuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId } = req;
                const { periodo } = req.query;
                const estatisticas = yield dashboard_service_1.default.getEstatisticasProntuarios(tenantId, periodo ? JSON.parse(periodo) : undefined);
                res.json({
                    success: true,
                    data: estatisticas,
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
    getEstatisticasAnamnese(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId } = req;
                const { periodo } = req.query;
                const estatisticas = yield dashboard_service_1.default.getEstatisticasAnamnese(tenantId, periodo ? JSON.parse(periodo) : undefined);
                res.json({
                    success: true,
                    data: estatisticas,
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
    getEstatisticasAtividades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId } = req;
                const estatisticas = yield dashboard_service_1.default.getEstatisticasAtividades(tenantId);
                res.json({
                    success: true,
                    data: estatisticas,
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
    }
};
//# sourceMappingURL=dashboard.controller.js.map
"use strict";
// =============================================================================
// ROTAS - MÓDULO DE AUTENTICAÇÃO
// =============================================================================
// 
// Definição das rotas de autenticação
// Implementa validação, autorização e tratamento de erros
//
// =============================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const injectTenant_1 = __importDefault(require("../../middleware/injectTenant"));
const errorHandler_1 = __importDefault(require("../../middleware/errorHandler"));
const router = (0, express_1.Router)();
// Rotas públicas (não precisam de autenticação)
router.post('/login', errorHandler_1.default.catchAsync(controller_1.default.login));
router.post('/register', errorHandler_1.default.catchAsync(controller_1.default.register));
router.post('/refresh-token', errorHandler_1.default.catchAsync(controller_1.default.refreshToken));
router.post('/forgot-password', errorHandler_1.default.catchAsync(controller_1.default.forgotPassword));
router.post('/reset-password', errorHandler_1.default.catchAsync(controller_1.default.resetPassword));
router.post('/verify-token', errorHandler_1.default.catchAsync(controller_1.default.verifyToken));
// Rotas que precisam de autenticação
router.post('/logout', injectTenant_1.default.injectTenant, errorHandler_1.default.catchAsync(controller_1.default.logout));
router.get('/profile', injectTenant_1.default.injectTenant, errorHandler_1.default.catchAsync(controller_1.default.getProfile));
router.put('/change-password', injectTenant_1.default.injectTenant, errorHandler_1.default.catchAsync(controller_1.default.changePassword));
exports.default = router;
//# sourceMappingURL=routes.js.map
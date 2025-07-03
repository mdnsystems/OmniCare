"use strict";
// =============================================================================
// CONTROLLER - MÓDULO DE AUTENTICAÇÃO
// =============================================================================
// 
// Controlador responsável por gerenciar as rotas de autenticação
// Implementa login, registro, refresh tokens e logout
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const service_1 = require("./service");
const validation_1 = require("./validation");
class AuthController {
    /**
     * Realiza o login do usuário
     */
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = validation_1.AuthValidator.validateLogin(req.body);
                const result = yield service_1.AuthService.login(validatedData);
                // Configurar cookies seguros
                const isProduction = process.env.NODE_ENV === 'production';
                // Cookie para access token (httpOnly, secure em produção)
                res.cookie('accessToken', result.token, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: 'strict',
                    maxAge: 3600000, // 1 hora
                    path: '/',
                });
                // Cookie para refresh token (httpOnly, secure em produção)
                res.cookie('refreshToken', result.refreshToken, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: 'strict',
                    maxAge: 604800000, // 7 dias
                    path: '/api/auth/refresh-token',
                });
                // Retornar dados do usuário (sem tokens)
                res.json({
                    success: true,
                    data: {
                        usuario: result.usuario,
                        expiresIn: result.expiresIn,
                        refreshExpiresIn: result.refreshExpiresIn,
                    },
                    message: 'Login realizado com sucesso',
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
    }
    /**
     * Registra um novo usuário
     */
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = validation_1.AuthValidator.validateRegister(req.body);
                const result = yield service_1.AuthService.register(validatedData);
                // Configurar cookies seguros
                const isProduction = process.env.NODE_ENV === 'production';
                res.cookie('accessToken', result.token, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: 'strict',
                    maxAge: 3600000, // 1 hora
                    path: '/',
                });
                res.cookie('refreshToken', result.refreshToken, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: 'strict',
                    maxAge: 604800000, // 7 dias
                    path: '/api/auth/refresh-token',
                });
                res.json({
                    success: true,
                    data: {
                        usuario: result.usuario,
                        expiresIn: result.expiresIn,
                        refreshExpiresIn: result.refreshExpiresIn,
                    },
                    message: 'Usuário registrado com sucesso',
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
    }
    /**
     * Renova o token de acesso
     */
    static refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Tentar obter refresh token do cookie primeiro, depois do body
                const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
                if (!refreshToken) {
                    return res.status(401).json({
                        success: false,
                        error: 'Refresh token não fornecido',
                        timestamp: new Date().toISOString(),
                    });
                }
                const validatedData = { refreshToken };
                const result = yield service_1.AuthService.refreshToken(validatedData);
                // Configurar novos cookies seguros
                const isProduction = process.env.NODE_ENV === 'production';
                res.cookie('accessToken', result.token, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: 'strict',
                    maxAge: 3600000, // 1 hora
                    path: '/',
                });
                res.cookie('refreshToken', result.refreshToken, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: 'strict',
                    maxAge: 604800000, // 7 dias
                    path: '/api/auth/refresh-token',
                });
                res.json({
                    success: true,
                    data: {
                        usuario: result.usuario,
                        expiresIn: result.expiresIn,
                        refreshExpiresIn: result.refreshExpiresIn,
                    },
                    message: 'Token renovado com sucesso',
                });
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Realiza o logout do usuário
     */
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Limpar cookies
                res.clearCookie('accessToken', { path: '/' });
                res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
                res.json({
                    success: true,
                    message: 'Logout realizado com sucesso',
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Erro ao realizar logout',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Altera a senha do usuário
     */
    static changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        error: 'Usuário não autenticado',
                        timestamp: new Date().toISOString(),
                    });
                }
                const validatedData = validation_1.AuthValidator.validateChangePassword(req.body);
                yield service_1.AuthService.changePassword(userId, validatedData);
                res.json({
                    success: true,
                    message: 'Senha alterada com sucesso',
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
    }
    /**
     * Solicita recuperação de senha
     */
    static forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = validation_1.AuthValidator.validateForgotPassword(req.body);
                const result = yield service_1.AuthService.forgotPassword(validatedData);
                res.json({
                    success: true,
                    message: result.message,
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
    }
    /**
     * Reseta a senha usando token
     */
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = validation_1.AuthValidator.validateResetPassword(req.body);
                yield service_1.AuthService.resetPassword(validatedData);
                res.json({
                    success: true,
                    message: 'Senha redefinida com sucesso',
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
    }
    /**
     * Verifica se um token é válido
     */
    static verifyToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = req.cookies.accessToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
                if (!token) {
                    return res.status(401).json({
                        success: false,
                        error: 'Token não fornecido',
                        timestamp: new Date().toISOString(),
                    });
                }
                const result = yield service_1.AuthService.verifyToken(token);
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
    /**
     * Busca o perfil do usuário
     */
    static getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        error: 'Usuário não autenticado',
                        timestamp: new Date().toISOString(),
                    });
                }
                const usuario = yield service_1.AuthService.getProfile(userId);
                res.json({
                    success: true,
                    data: usuario,
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
    }
}
exports.AuthController = AuthController;
exports.default = AuthController;
//# sourceMappingURL=controller.js.map
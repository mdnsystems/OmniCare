"use strict";
// =============================================================================
// MIDDLEWARE DE TRATAMENTO DE ERROS - SWIFT CLINIC API
// =============================================================================
// 
// Middleware responsável por tratar erros de forma consistente
// Padroniza as respostas de erro da API
//
// =============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandler {
    /**
     * Middleware para capturar erros assíncronos
     */
    static catchAsync(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }
    /**
     * Middleware para rotas não encontradas
     */
    static notFound(req, res) {
        res.status(404).json({
            success: false,
            error: 'Rota não encontrada',
            message: `A rota ${req.method} ${req.originalUrl} não foi encontrada`,
            timestamp: new Date().toISOString(),
        });
    }
    /**
     * Middleware de tratamento de erros global
     */
    static handleError(err, req, res, next) {
        console.error('Erro na aplicação:', err);
        // Se a resposta já foi enviada, não fazer nada
        if (res.headersSent) {
            return next(err);
        }
        // Erros de validação do Zod
        if (err.name === 'ZodError') {
            res.status(400).json({
                success: false,
                error: 'Erro de validação',
                message: 'Dados fornecidos são inválidos',
                details: err.errors,
                timestamp: new Date().toISOString(),
            });
            return;
        }
        // Erros do Prisma
        if (err.code === 'P2002') {
            res.status(409).json({
                success: false,
                error: 'Conflito de dados',
                message: 'Já existe um registro com esses dados',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        if (err.code === 'P2025') {
            res.status(404).json({
                success: false,
                error: 'Registro não encontrado',
                message: 'O registro solicitado não foi encontrado',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        // Erros de autenticação JWT
        if (err.name === 'JsonWebTokenError') {
            res.status(401).json({
                success: false,
                error: 'Token inválido',
                message: 'O token de autenticação é inválido',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                error: 'Token expirado',
                message: 'O token de autenticação expirou',
                timestamp: new Date().toISOString(),
            });
            return;
        }
        // Erros de validação do bcrypt
        if (err.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                error: 'Erro de validação',
                message: err.message,
                timestamp: new Date().toISOString(),
            });
            return;
        }
        // Erros de negócio personalizados
        if (err.statusCode) {
            res.status(err.statusCode).json({
                success: false,
                error: err.error || 'Erro de negócio',
                message: err.message,
                timestamp: new Date().toISOString(),
            });
            return;
        }
        // Erro genérico para produção
        const isDevelopment = process.env.NODE_ENV === 'development';
        res.status(500).json(Object.assign(Object.assign({ success: false, error: 'Erro interno do servidor', message: isDevelopment ? err.message : 'Ocorreu um erro interno no servidor' }, (isDevelopment && { stack: err.stack })), { timestamp: new Date().toISOString() }));
    }
    /**
     * Middleware para capturar erros não tratados
     */
    static handleUncaughtException(err) {
        console.error('Erro não tratado:', err);
        process.exit(1);
    }
    /**
     * Middleware para capturar promessas rejeitadas não tratadas
     */
    static handleUnhandledRejection(reason, promise) {
        console.error('Promessa rejeitada não tratada:', reason);
        process.exit(1);
    }
}
exports.default = ErrorHandler;
//# sourceMappingURL=errorHandler.js.map
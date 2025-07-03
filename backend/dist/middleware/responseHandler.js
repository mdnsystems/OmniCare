"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuccessResponse = exports.createErrorResponse = exports.responseHandler = void 0;
// Middleware para padronizar respostas da API
const responseHandler = (req, res, next) => {
    // Salvar a função original de res.json
    const originalJson = res.json;
    // Sobrescrever res.json para garantir formato padrão
    res.json = function (data) {
        // Se já tem o formato padrão, retornar como está
        if (data && typeof data === 'object' && 'success' in data) {
            return originalJson.call(this, data);
        }
        // Se é um array, garantir que não seja null/undefined
        if (Array.isArray(data)) {
            return originalJson.call(this, {
                success: true,
                data: data || [],
                timestamp: new Date().toISOString(),
            });
        }
        // Se é um objeto simples (não array), assumir que é um item único
        if (data && typeof data === 'object') {
            return originalJson.call(this, {
                success: true,
                data: data,
                timestamp: new Date().toISOString(),
            });
        }
        // Para outros tipos de dados
        return originalJson.call(this, {
            success: true,
            data: data,
            timestamp: new Date().toISOString(),
        });
    };
    next();
};
exports.responseHandler = responseHandler;
// Função helper para criar respostas de erro padronizadas
const createErrorResponse = (statusCode, message, error) => {
    return {
        success: false,
        error: message,
        details: error instanceof Error ? error.message : error,
        timestamp: new Date().toISOString(),
    };
};
exports.createErrorResponse = createErrorResponse;
// Função helper para criar respostas de sucesso padronizadas
const createSuccessResponse = (data) => {
    return {
        success: true,
        data: data,
        timestamp: new Date().toISOString(),
    };
};
exports.createSuccessResponse = createSuccessResponse;
//# sourceMappingURL=responseHandler.js.map
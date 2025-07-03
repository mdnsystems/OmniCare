import { Request, Response, NextFunction } from 'express';

// Middleware para padronizar respostas da API
export const responseHandler = (req: Request, res: Response, next: NextFunction) => {
  // Salvar a função original de res.json
  const originalJson = res.json;

  // Sobrescrever res.json para garantir formato padrão
  res.json = function(data: any) {
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

// Função helper para criar respostas de erro padronizadas
export const createErrorResponse = (statusCode: number, message: string, error?: any) => {
  return {
    success: false,
    error: message,
    details: error instanceof Error ? error.message : error,
    timestamp: new Date().toISOString(),
  };
};

// Função helper para criar respostas de sucesso padronizadas
export const createSuccessResponse = (data: any) => {
  return {
    success: true,
    data: data,
    timestamp: new Date().toISOString(),
  };
}; 
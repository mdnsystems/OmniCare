import { Request, Response, NextFunction } from 'express';
export default class ErrorHandler {
    /**
     * Middleware para capturar erros assíncronos
     */
    static catchAsync(fn: Function): (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Middleware para rotas não encontradas
     */
    static notFound(req: Request, res: Response): void;
    /**
     * Middleware de tratamento de erros global
     */
    static handleError(err: any, req: Request, res: Response, next: NextFunction): void;
    /**
     * Middleware para capturar erros não tratados
     */
    static handleUncaughtException(err: Error): void;
    /**
     * Middleware para capturar promessas rejeitadas não tratadas
     */
    static handleUnhandledRejection(reason: any, promise: Promise<any>): void;
}

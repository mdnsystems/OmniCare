import { Request, Response } from 'express';
declare const _default: {
    create(req: Request, res: Response): Promise<void>;
    findAll(req: Request, res: Response): Promise<void>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    findByFaturamento(req: Request, res: Response): Promise<void>;
    findByPeriodo(req: Request, res: Response): Promise<void>;
    findByFormaPagamento(req: Request, res: Response): Promise<void>;
    registrarPagamento(req: Request, res: Response): Promise<void>;
    estornarPagamento(req: Request, res: Response): Promise<void>;
};
export default _default;

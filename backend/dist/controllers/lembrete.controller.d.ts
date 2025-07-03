import { Request, Response } from 'express';
declare const _default: {
    getNotificacoes(req: Request, res: Response): Promise<void>;
    marcarNotificacaoComoLida(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    marcarTodasNotificacoesComoLidas(req: Request, res: Response): Promise<void>;
    enviarLembretePersonalizado(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getEstatisticasNotificacoes(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    findAll(req: Request, res: Response): Promise<void>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
export default _default;

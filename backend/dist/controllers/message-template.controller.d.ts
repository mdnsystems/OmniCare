import { Request, Response } from 'express';
declare const _default: {
    create(req: Request, res: Response): Promise<void>;
    findAll(req: Request, res: Response): Promise<void>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    findByTipo(req: Request, res: Response): Promise<void>;
    findAtivos(req: Request, res: Response): Promise<void>;
    ativar(req: Request, res: Response): Promise<void>;
    desativar(req: Request, res: Response): Promise<void>;
    duplicar(req: Request, res: Response): Promise<void>;
};
export default _default;

import { Request, Response } from 'express';
import { ExameInput } from '../validators/exame.validator';
declare const _default: {
    create(req: Request<{}, {}, ExameInput>, res: Response): Promise<void>;
    findAll(req: Request, res: Response): Promise<void>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request<{
        id: string;
    }, {}, ExameInput>, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
};
export default _default;

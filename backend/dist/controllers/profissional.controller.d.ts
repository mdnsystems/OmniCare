import { Request, Response } from 'express';
import { ProfissionalInput } from '../validators/profissional.validator';
declare const _default: {
    create(req: Request<{}, {}, ProfissionalInput>, res: Response): Promise<void>;
    findAll(req: Request, res: Response): Promise<void>;
    findAtivos(req: Request, res: Response): Promise<void>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request<{
        id: string;
    }, {}, ProfissionalInput>, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
};
export default _default;

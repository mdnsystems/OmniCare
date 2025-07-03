import { Request, Response } from 'express';
import { EspecialidadeInput } from '../validators/especialidade.validator';
declare const _default: {
    create(req: Request<{}, {}, EspecialidadeInput>, res: Response): Promise<void>;
    findAll(req: Request, res: Response): Promise<void>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request<{
        id: string;
    }, {}, EspecialidadeInput>, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
};
export default _default;

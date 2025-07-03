import { Request, Response } from 'express';
import { PacienteInput } from '../validators/paciente.validator';
declare const _default: {
    create(req: Request<{}, {}, PacienteInput>, res: Response): Promise<void>;
    findAll(req: Request, res: Response): Promise<void>;
    findById(req: Request<{
        id: string;
    }>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    delete(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    checkRelations(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
};
export default _default;

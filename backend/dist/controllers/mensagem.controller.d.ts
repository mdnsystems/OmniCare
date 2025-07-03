import { Request, Response } from 'express';
import { MensagemInput } from '../validators/mensagem.validator';
declare const _default: {
    create(req: Request<{}, {}, MensagemInput>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    findAll(req: Request, res: Response): Promise<void>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request<{
        id: string;
    }, {}, Partial<MensagemInput>>, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
};
export default _default;

import { Request, Response } from 'express';
declare const _default: {
    create(req: Request, res: Response): Promise<void>;
    findAll(req: Request, res: Response): Promise<void>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    findByPaciente(req: Request, res: Response): Promise<void>;
    findByProfissional(req: Request, res: Response): Promise<void>;
    findByStatus(req: Request, res: Response): Promise<void>;
    findVencidos(req: Request, res: Response): Promise<void>;
    findAVencer(req: Request, res: Response): Promise<void>;
    exportar(req: Request, res: Response): Promise<void>;
    importar(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
export default _default;

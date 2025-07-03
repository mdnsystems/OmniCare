import { Request, Response } from 'express';
export default class FileController {
    static uploadFile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static downloadFile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteFile(req: Request, res: Response): Promise<void>;
    static listarArquivos(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static buscarArquivo(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}

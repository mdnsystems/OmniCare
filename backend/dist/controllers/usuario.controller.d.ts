import { Request, Response } from 'express';
declare const _default: {
    registrar(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    listar(req: Request, res: Response): Promise<void>;
    listarAtivos(req: Request, res: Response): Promise<void>;
    buscarPorId(req: Request, res: Response): Promise<void>;
    atualizar(req: Request, res: Response): Promise<void>;
    alterarSenha(req: Request, res: Response): Promise<void>;
    desativar(req: Request, res: Response): Promise<void>;
};
export default _default;

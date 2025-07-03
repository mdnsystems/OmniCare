import { Request, Response } from 'express';
declare const _default: {
    criar(req: Request, res: Response): Promise<void>;
    buscarPorTenantId(req: Request, res: Response): Promise<void>;
    listar(req: Request, res: Response): Promise<void>;
    atualizar(req: Request, res: Response): Promise<void>;
    desativar(req: Request, res: Response): Promise<void>;
    ativar(req: Request, res: Response): Promise<void>;
    obterEstatisticas(req: Request, res: Response): Promise<void>;
    configurarWhatsApp(req: Request, res: Response): Promise<void>;
    obterConfiguracaoWhatsApp(req: Request, res: Response): Promise<void>;
};
export default _default;

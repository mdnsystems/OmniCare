import { Request, Response } from 'express';
declare const _default: {
    create(req: Request, res: Response): Promise<void>;
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
    confirmar(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    cancelar(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    remarcar(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    realizar(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    findByData(req: Request<{
        data: string;
    }>, res: Response): Promise<void>;
    findByProfissional(req: Request<{
        profissionalId: string;
    }>, res: Response): Promise<void>;
    findByPaciente(req: Request<{
        pacienteId: string;
    }>, res: Response): Promise<void>;
    findHoje(req: Request, res: Response): Promise<void>;
    findSemana(req: Request, res: Response): Promise<void>;
    findMes(req: Request, res: Response): Promise<void>;
    confirmarViaLink(req: Request, res: Response): Promise<void>;
    cancelarViaLink(req: Request, res: Response): Promise<void>;
    verificarDisponibilidade(req: Request, res: Response): Promise<void>;
    getHorariosDisponiveis(req: Request<{
        profissionalId: string;
    }>, res: Response): Promise<void>;
    getEstatisticas(req: Request, res: Response): Promise<void>;
    enviarLembrete(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    importar(req: Request, res: Response): Promise<void>;
    exportar(req: Request, res: Response): Promise<void>;
};
export default _default;

import { Request, Response } from 'express';
export declare class SuperAdminController {
    /**
     * Lista todas as clínicas cadastradas (visão macro)
     */
    static listarClinicas(req: Request, res: Response): Promise<Response>;
    /**
     * Obtém detalhes de uma clínica específica
     */
    static obterDetalhesClinica(req: Request, res: Response): Promise<Response>;
    /**
     * Relatório de gestão de usuários e permissões
     */
    static relatorioUsuarios(req: Request, res: Response): Promise<Response>;
    /**
     * Relatório de atividades recentes
     */
    static relatorioAtividades(req: Request, res: Response): Promise<Response>;
    /**
     * Relatório de gestão de clínicas
     */
    static relatorioGestaoClinicas(req: Request, res: Response): Promise<Response>;
    /**
     * Relatório de chat e mensagens
     */
    static relatorioChat(req: Request, res: Response): Promise<Response>;
    /**
     * Ativar/Desativar clínica
     */
    static toggleStatusClinica(req: Request, res: Response): Promise<Response>;
    /**
     * Atualizar dados da clínica
     */
    static atualizarClinica(req: Request, res: Response): Promise<Response>;
}

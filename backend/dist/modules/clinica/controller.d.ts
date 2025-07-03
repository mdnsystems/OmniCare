import { Request, Response } from 'express';
export declare class ClinicaController {
    /**
     * Cria uma nova clínica
     */
    static create(req: Request, res: Response): Promise<Response>;
    /**
     * Lista todas as clínicas
     */
    static findAll(req: Request, res: Response): Promise<Response>;
    /**
     * Busca uma clínica por ID
     */
    static findById(req: Request, res: Response): Promise<Response>;
    /**
     * Busca uma clínica por tenant ID
     */
    static findByTenantId(req: Request, res: Response): Promise<Response>;
    /**
     * Atualiza uma clínica
     */
    static update(req: Request, res: Response): Promise<Response>;
    /**
     * Ativa/desativa uma clínica
     */
    static toggleStatus(req: Request, res: Response): Promise<Response>;
    /**
     * Remove uma clínica
     */
    static delete(req: Request, res: Response): Promise<Response>;
    /**
     * Busca estatísticas da clínica
     */
    static getStats(req: Request, res: Response): Promise<Response>;
    /**
     * Busca configurações da clínica
     */
    static getConfiguracoes(req: Request, res: Response): Promise<Response>;
    /**
     * Atualiza configurações da clínica
     */
    static updateConfiguracoes(req: Request, res: Response): Promise<Response>;
    /**
     * Configura integração com WhatsApp (stub)
     */
    static configureWhatsApp(req: Request, res: Response): Promise<Response>;
    /**
     * Obtém configuração do WhatsApp (stub)
     */
    static getWhatsAppConfig(req: Request, res: Response): Promise<Response>;
    /**
     * Cria template de mensagem (stub)
     */
    static createMessageTemplate(req: Request, res: Response): Promise<Response>;
    /**
     * Lista templates de mensagem (stub)
     */
    static listMessageTemplates(req: Request, res: Response): Promise<Response>;
    /**
     * Atualiza template de mensagem (stub)
     */
    static updateMessageTemplate(req: Request, res: Response): Promise<Response>;
    /**
     * Deleta template de mensagem (stub)
     */
    static deleteMessageTemplate(req: Request, res: Response): Promise<Response>;
}
export default ClinicaController;

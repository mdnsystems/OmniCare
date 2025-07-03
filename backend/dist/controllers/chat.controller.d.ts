import { Request, Response } from 'express';
export default class ChatController {
    static listarChats(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static buscarChat(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static criarChat(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static atualizarChat(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deletarChat(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static adicionarParticipante(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static removerParticipante(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static listarMensagens(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static buscarChatGeral(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static buscarOuCriarChatPrivado(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}

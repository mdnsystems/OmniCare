import { Request, Response } from 'express';
export declare class AuthController {
    /**
     * Realiza o login do usuário
     */
    static login(req: Request, res: Response): Promise<void>;
    /**
     * Registra um novo usuário
     */
    static register(req: Request, res: Response): Promise<void>;
    /**
     * Renova o token de acesso
     */
    static refreshToken(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Realiza o logout do usuário
     */
    static logout(req: Request, res: Response): Promise<void>;
    /**
     * Altera a senha do usuário
     */
    static changePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Solicita recuperação de senha
     */
    static forgotPassword(req: Request, res: Response): Promise<void>;
    /**
     * Reseta a senha usando token
     */
    static resetPassword(req: Request, res: Response): Promise<void>;
    /**
     * Verifica se um token é válido
     */
    static verifyToken(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Busca o perfil do usuário
     */
    static getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export default AuthController;

import { LoginInput, RegisterInput, RefreshTokenInput, ChangePasswordInput, ForgotPasswordInput, ResetPasswordInput } from './validation';
export declare class AuthService {
    /**
     * Realiza o login do usuário
     */
    static login(data: LoginInput): Promise<{
        token: string;
        refreshToken: string;
        expiresIn: number;
        refreshExpiresIn: number;
        usuario: {
            clinica: {
                id: string;
                nome: string;
                tipo: import("generated/prisma").$Enums.TipoClinica;
                ativo: boolean;
            };
            profissional: {
                id: string;
                nome: string;
                especialidade: {
                    id: string;
                    nome: string;
                };
            } | null;
            id: string;
            tenantId: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            profissionalId: string | null;
            email: string;
            role: import("generated/prisma").$Enums.RoleUsuario;
        };
    }>;
    /**
     * Registra um novo usuário
     */
    static register(data: RegisterInput): Promise<{
        token: string;
        refreshToken: string;
        expiresIn: number;
        refreshExpiresIn: number;
        usuario: {
            clinica: {
                id: string;
                nome: string;
                tipo: import("generated/prisma").$Enums.TipoClinica;
            };
            profissional: {
                id: string;
                nome: string;
                especialidade: {
                    id: string;
                    nome: string;
                };
            } | null;
            id: string;
            tenantId: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            profissionalId: string | null;
            email: string;
            role: import("generated/prisma").$Enums.RoleUsuario;
        };
    }>;
    /**
     * Renova o token de acesso usando refresh token
     */
    static refreshToken(data: RefreshTokenInput): Promise<{
        token: string;
        refreshToken: string;
        expiresIn: number;
        refreshExpiresIn: number;
        usuario: {
            clinica: {
                id: string;
                nome: string;
                tipo: import("generated/prisma").$Enums.TipoClinica;
                ativo: boolean;
            };
            id: string;
            tenantId: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            profissionalId: string | null;
            email: string;
            role: import("generated/prisma").$Enums.RoleUsuario;
        };
    }>;
    /**
     * Altera a senha do usuário
     */
    static changePassword(userId: string, data: ChangePasswordInput): Promise<{
        message: string;
    }>;
    /**
     * Solicita recuperação de senha
     */
    static forgotPassword(data: ForgotPasswordInput): Promise<{
        message: string;
    }>;
    /**
     * Reseta a senha usando token
     */
    static resetPassword(data: ResetPasswordInput): Promise<void>;
    /**
     * Verifica se um token é válido
     */
    static verifyToken(token: string): Promise<{
        valid: boolean;
        usuario: {
            clinica: {
                id: string;
                nome: string;
                tipo: import("generated/prisma").$Enums.TipoClinica;
                ativo: boolean;
            };
            profissional: {
                id: string;
                nome: string;
                especialidade: {
                    id: string;
                    nome: string;
                };
            } | null;
            id: string;
            tenantId: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            profissionalId: string | null;
            email: string;
            role: import("generated/prisma").$Enums.RoleUsuario;
        };
        error?: undefined;
    } | {
        valid: boolean;
        error: string;
        usuario?: undefined;
    }>;
    /**
     * Busca o perfil do usuário
     */
    static getProfile(userId: string): Promise<{
        clinica: {
            id: string;
            nome: string;
            tipo: import("generated/prisma").$Enums.TipoClinica;
            ativo: boolean;
        };
        profissional: {
            id: string;
            nome: string;
            especialidade: {
                id: string;
                nome: string;
            };
        } | null;
        id: string;
        tenantId: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        profissionalId: string | null;
        email: string;
        role: import("generated/prisma").$Enums.RoleUsuario;
    }>;
}
export default AuthService;

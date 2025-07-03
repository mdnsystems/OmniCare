import { RoleUsuario } from '../types/enums';
export declare class UsuarioService {
    static criarUsuario(tenantId: string, email: string, senha: string, role: RoleUsuario, profissionalId?: string): Promise<{
        id: string;
        email: string;
        role: import("generated/prisma").$Enums.RoleUsuario;
        ativo: boolean;
        clinica: {
            id: string;
            nome: string;
            tipo: import("generated/prisma").$Enums.TipoClinica;
            corPrimaria: string;
            corSecundaria: string;
            tema: string;
        };
        profissional: {
            id: string;
            nome: string;
            especialidade: {
                id: string;
                nome: string;
            };
        } | null;
    }>;
    static autenticarUsuario(tenantId: string, email: string, senha: string): Promise<{
        token: string;
        usuario: {
            id: string;
            email: string;
            role: import("generated/prisma").$Enums.RoleUsuario;
            ativo: true;
            clinica: {
                id: string;
                nome: string;
                tipo: import("generated/prisma").$Enums.TipoClinica;
                corPrimaria: string;
                corSecundaria: string;
                tema: string;
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
        };
    }>;
    static listarUsuarios(tenantId: string): Promise<{
        id: string;
        ativo: boolean;
        createdAt: Date;
        email: string;
        profissional: {
            id: string;
            nome: string;
            especialidade: {
                id: string;
                nome: string;
            };
        } | null;
        role: import("generated/prisma").$Enums.RoleUsuario;
    }[]>;
    static listarUsuariosAtivos(tenantId: string): Promise<{
        id: string;
        ativo: boolean;
        createdAt: Date;
        email: string;
        profissional: {
            id: string;
            nome: string;
            especialidade: {
                id: string;
                nome: string;
            };
        } | null;
        role: import("generated/prisma").$Enums.RoleUsuario;
    }[]>;
    static buscarUsuarioPorId(tenantId: string, id: string): Promise<{
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
    } & {
        id: string;
        tenantId: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        profissionalId: string | null;
        email: string;
        senha: string;
        role: import("generated/prisma").$Enums.RoleUsuario;
    }>;
    static atualizarUsuario(tenantId: string, id: string, dados: {
        email?: string;
        role?: RoleUsuario;
        profissionalId?: string;
        ativo?: boolean;
    }): Promise<{
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
    } & {
        id: string;
        tenantId: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        profissionalId: string | null;
        email: string;
        senha: string;
        role: import("generated/prisma").$Enums.RoleUsuario;
    }>;
    static alterarSenha(tenantId: string, id: string, senhaAtual: string, novaSenha: string): Promise<{
        id: string;
        ativo: boolean;
        email: string;
        role: import("generated/prisma").$Enums.RoleUsuario;
    }>;
    static desativarUsuario(tenantId: string, id: string): Promise<{
        id: string;
        ativo: boolean;
        email: string;
        role: import("generated/prisma").$Enums.RoleUsuario;
    }>;
}

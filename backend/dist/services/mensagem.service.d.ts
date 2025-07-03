import { MensagemInput } from '../validators/mensagem.validator';
declare const _default: {
    create(data: MensagemInput & {
        tenantId: string;
    }): Promise<{
        arquivos: ({
            arquivo: {
                id: string;
                tenantId: string;
                nome: string;
                tipo: import("generated/prisma").$Enums.TipoArquivo;
                createdAt: Date;
                chatId: string;
                nomeOriginal: string;
                tamanho: number;
                url: string;
                mimeType: string;
                uploadadoPor: string;
            };
        } & {
            id: string;
            createdAt: Date;
            mensagemId: string;
            arquivoId: string;
        })[];
        sender: {
            id: string;
            tenantId: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            profissionalId: string | null;
            email: string;
            senha: string;
            role: import("generated/prisma").$Enums.RoleUsuario;
        };
    } & {
        id: string;
        tenantId: string;
        chatId: string;
        senderId: string;
        senderName: string;
        senderRole: import("generated/prisma").$Enums.RoleUsuario;
        content: string;
        timestamp: Date;
        editada: boolean;
        editadaEm: Date | null;
        usuarioId: string | null;
    }>;
    findAll(tenantId?: string): Promise<({
        arquivos: ({
            arquivo: {
                id: string;
                tenantId: string;
                nome: string;
                tipo: import("generated/prisma").$Enums.TipoArquivo;
                createdAt: Date;
                chatId: string;
                nomeOriginal: string;
                tamanho: number;
                url: string;
                mimeType: string;
                uploadadoPor: string;
            };
        } & {
            id: string;
            createdAt: Date;
            mensagemId: string;
            arquivoId: string;
        })[];
        sender: {
            id: string;
            tenantId: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            profissionalId: string | null;
            email: string;
            senha: string;
            role: import("generated/prisma").$Enums.RoleUsuario;
        };
    } & {
        id: string;
        tenantId: string;
        chatId: string;
        senderId: string;
        senderName: string;
        senderRole: import("generated/prisma").$Enums.RoleUsuario;
        content: string;
        timestamp: Date;
        editada: boolean;
        editadaEm: Date | null;
        usuarioId: string | null;
    })[]>;
    findById(id: string, tenantId?: string): Promise<({
        arquivos: ({
            arquivo: {
                id: string;
                tenantId: string;
                nome: string;
                tipo: import("generated/prisma").$Enums.TipoArquivo;
                createdAt: Date;
                chatId: string;
                nomeOriginal: string;
                tamanho: number;
                url: string;
                mimeType: string;
                uploadadoPor: string;
            };
        } & {
            id: string;
            createdAt: Date;
            mensagemId: string;
            arquivoId: string;
        })[];
        sender: {
            id: string;
            tenantId: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            profissionalId: string | null;
            email: string;
            senha: string;
            role: import("generated/prisma").$Enums.RoleUsuario;
        };
    } & {
        id: string;
        tenantId: string;
        chatId: string;
        senderId: string;
        senderName: string;
        senderRole: import("generated/prisma").$Enums.RoleUsuario;
        content: string;
        timestamp: Date;
        editada: boolean;
        editadaEm: Date | null;
        usuarioId: string | null;
    }) | null>;
    update(id: string, data: Partial<MensagemInput>, tenantId?: string): Promise<{
        arquivos: ({
            arquivo: {
                id: string;
                tenantId: string;
                nome: string;
                tipo: import("generated/prisma").$Enums.TipoArquivo;
                createdAt: Date;
                chatId: string;
                nomeOriginal: string;
                tamanho: number;
                url: string;
                mimeType: string;
                uploadadoPor: string;
            };
        } & {
            id: string;
            createdAt: Date;
            mensagemId: string;
            arquivoId: string;
        })[];
        sender: {
            id: string;
            tenantId: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            profissionalId: string | null;
            email: string;
            senha: string;
            role: import("generated/prisma").$Enums.RoleUsuario;
        };
    } & {
        id: string;
        tenantId: string;
        chatId: string;
        senderId: string;
        senderName: string;
        senderRole: import("generated/prisma").$Enums.RoleUsuario;
        content: string;
        timestamp: Date;
        editada: boolean;
        editadaEm: Date | null;
        usuarioId: string | null;
    }>;
    delete(id: string, tenantId?: string): Promise<{
        id: string;
        tenantId: string;
        chatId: string;
        senderId: string;
        senderName: string;
        senderRole: import("generated/prisma").$Enums.RoleUsuario;
        content: string;
        timestamp: Date;
        editada: boolean;
        editadaEm: Date | null;
        usuarioId: string | null;
    }>;
    findBySender(senderId: string, tenantId?: string): Promise<({
        arquivos: ({
            arquivo: {
                id: string;
                tenantId: string;
                nome: string;
                tipo: import("generated/prisma").$Enums.TipoArquivo;
                createdAt: Date;
                chatId: string;
                nomeOriginal: string;
                tamanho: number;
                url: string;
                mimeType: string;
                uploadadoPor: string;
            };
        } & {
            id: string;
            createdAt: Date;
            mensagemId: string;
            arquivoId: string;
        })[];
        sender: {
            id: string;
            tenantId: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            profissionalId: string | null;
            email: string;
            senha: string;
            role: import("generated/prisma").$Enums.RoleUsuario;
        };
    } & {
        id: string;
        tenantId: string;
        chatId: string;
        senderId: string;
        senderName: string;
        senderRole: import("generated/prisma").$Enums.RoleUsuario;
        content: string;
        timestamp: Date;
        editada: boolean;
        editadaEm: Date | null;
        usuarioId: string | null;
    })[]>;
    findByTenant(tenantId: string): Promise<({
        arquivos: ({
            arquivo: {
                id: string;
                tenantId: string;
                nome: string;
                tipo: import("generated/prisma").$Enums.TipoArquivo;
                createdAt: Date;
                chatId: string;
                nomeOriginal: string;
                tamanho: number;
                url: string;
                mimeType: string;
                uploadadoPor: string;
            };
        } & {
            id: string;
            createdAt: Date;
            mensagemId: string;
            arquivoId: string;
        })[];
        sender: {
            id: string;
            tenantId: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            profissionalId: string | null;
            email: string;
            senha: string;
            role: import("generated/prisma").$Enums.RoleUsuario;
        };
    } & {
        id: string;
        tenantId: string;
        chatId: string;
        senderId: string;
        senderName: string;
        senderRole: import("generated/prisma").$Enums.RoleUsuario;
        content: string;
        timestamp: Date;
        editada: boolean;
        editadaEm: Date | null;
        usuarioId: string | null;
    })[]>;
};
export default _default;

import { ExameInput } from '../validators/exame.validator';
declare const _default: {
    create(data: ExameInput & {
        tenantId: string;
        arquivos: any;
    }): Promise<{
        id: string;
        tenantId: string;
        tipo: string;
        createdAt: Date;
        updatedAt: Date;
        data: Date;
        observacoes: string | null;
        prontuarioId: string;
        resultado: string;
        arquivos: import("generated/prisma/runtime/library").JsonValue;
    }>;
    findAll(tenantId?: string): Promise<({
        prontuario: {
            id: string;
            tenantId: string;
            tipo: import("generated/prisma").$Enums.TipoProntuario;
            createdAt: Date;
            updatedAt: Date;
            pacienteId: string;
            profissionalId: string;
            data: Date;
            observacoes: string | null;
            camposPersonalizados: import("generated/prisma/runtime/library").JsonValue | null;
            descricao: string;
            diagnostico: string | null;
            prescricao: string | null;
        };
    } & {
        id: string;
        tenantId: string;
        tipo: string;
        createdAt: Date;
        updatedAt: Date;
        data: Date;
        observacoes: string | null;
        prontuarioId: string;
        resultado: string;
        arquivos: import("generated/prisma/runtime/library").JsonValue;
    })[]>;
    findById(id: string, tenantId?: string): Promise<({
        prontuario: {
            id: string;
            tenantId: string;
            tipo: import("generated/prisma").$Enums.TipoProntuario;
            createdAt: Date;
            updatedAt: Date;
            pacienteId: string;
            profissionalId: string;
            data: Date;
            observacoes: string | null;
            camposPersonalizados: import("generated/prisma/runtime/library").JsonValue | null;
            descricao: string;
            diagnostico: string | null;
            prescricao: string | null;
        };
    } & {
        id: string;
        tenantId: string;
        tipo: string;
        createdAt: Date;
        updatedAt: Date;
        data: Date;
        observacoes: string | null;
        prontuarioId: string;
        resultado: string;
        arquivos: import("generated/prisma/runtime/library").JsonValue;
    }) | null>;
    update(id: string, data: ExameInput & {
        tenantId?: string;
        arquivos?: any;
    }, tenantId?: string): Promise<{
        prontuario: {
            id: string;
            tenantId: string;
            tipo: import("generated/prisma").$Enums.TipoProntuario;
            createdAt: Date;
            updatedAt: Date;
            pacienteId: string;
            profissionalId: string;
            data: Date;
            observacoes: string | null;
            camposPersonalizados: import("generated/prisma/runtime/library").JsonValue | null;
            descricao: string;
            diagnostico: string | null;
            prescricao: string | null;
        };
    } & {
        id: string;
        tenantId: string;
        tipo: string;
        createdAt: Date;
        updatedAt: Date;
        data: Date;
        observacoes: string | null;
        prontuarioId: string;
        resultado: string;
        arquivos: import("generated/prisma/runtime/library").JsonValue;
    }>;
    delete(id: string, tenantId?: string): Promise<{
        id: string;
        tenantId: string;
        tipo: string;
        createdAt: Date;
        updatedAt: Date;
        data: Date;
        observacoes: string | null;
        prontuarioId: string;
        resultado: string;
        arquivos: import("generated/prisma/runtime/library").JsonValue;
    }>;
};
export default _default;

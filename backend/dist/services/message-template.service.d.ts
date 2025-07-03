export default class MessageTemplateService {
    static create(data: any): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        template: string;
        variaveis: string[];
    }>;
    static findAll(filters?: any): Promise<{
        data: {
            id: string;
            tenantId: string;
            nome: string;
            tipo: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            template: string;
            variaveis: string[];
        }[];
        pagination: {
            page: any;
            limit: any;
            total: number;
            pages: number;
        };
    }>;
    static findById(id: string): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        template: string;
        variaveis: string[];
    } | null>;
    static update(id: string, data: any): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        template: string;
        variaveis: string[];
    }>;
    static delete(id: string): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        template: string;
        variaveis: string[];
    }>;
    static findByTipo(tipo: string): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        template: string;
        variaveis: string[];
    }[]>;
    static findAtivos(): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        template: string;
        variaveis: string[];
    }[]>;
    static ativar(id: string): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        template: string;
        variaveis: string[];
    }>;
    static desativar(id: string): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        template: string;
        variaveis: string[];
    }>;
    static duplicar(id: string, nome: string): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        template: string;
        variaveis: string[];
    }>;
    static processarTemplate(template: string, variaveis: Record<string, any>): string;
    static validarTemplate(template: string, variaveis: string[]): {
        valido: boolean;
        erros: string[];
    };
}

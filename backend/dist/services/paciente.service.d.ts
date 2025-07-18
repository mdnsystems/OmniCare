import { PacienteInput } from '../validators/paciente.validator';
interface PacienteFilters {
    nome?: string;
    cpf?: string;
    email?: string;
    profissionalId?: string;
    page?: number;
    limit?: number;
}
interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
        nextPage?: number;
        prevPage?: number;
    };
}
declare const _default: {
    create(data: PacienteInput & {
        tenantId: string;
    }): Promise<{
        endereco: {
            rua: string;
            numero: string;
            complemento: string | null;
            bairro: string;
            cidade: string;
            estado: string;
            cep: string;
            pais: string;
        };
        convenio: {
            nome: string | null;
            numero: string | null;
            plano: string | null;
            validade: Date | null;
        };
        profissional: {
            id: string;
            tenantId: string;
            nome: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("generated/prisma").$Enums.ProfissionalStatus;
            dataNascimento: Date;
            telefone: string;
            email: string;
            numero: string;
            complemento: string | null;
            bairro: string;
            cep: string;
            cidade: string;
            estado: string;
            especialidadeId: string;
            registro: string;
            crm: string | null;
            sexo: string;
            dataContratacao: Date;
            rua: string;
            horarioInicio: string;
            horarioFim: string;
            intervalo: string;
            diasTrabalho: string[];
        };
        id: string;
        tenantId: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        profissionalId: string;
        camposPersonalizados: import("generated/prisma/runtime/library").JsonValue | null;
        dataNascimento: Date;
        cpf: string;
        telefone: string;
        email: string;
        numero: string;
        complemento: string | null;
        bairro: string;
        cep: string;
        cidade: string;
        estado: string;
        pais: string;
        convenioNome: string | null;
        convenioNumero: string | null;
        convenioPlano: string | null;
        convenioValidade: Date | null;
    }>;
    findAll(filters?: PacienteFilters, tenantId?: string): Promise<PaginatedResult<any>>;
    findById(id: string, tenantId?: string): Promise<{
        endereco: {
            rua: string;
            numero: string;
            complemento: string | null;
            bairro: string;
            cidade: string;
            estado: string;
            cep: string;
            pais: string;
        };
        convenio: {
            nome: string | null;
            numero: string | null;
            plano: string | null;
            validade: Date | null;
        };
        profissional: {
            id: string;
            tenantId: string;
            nome: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("generated/prisma").$Enums.ProfissionalStatus;
            dataNascimento: Date;
            telefone: string;
            email: string;
            numero: string;
            complemento: string | null;
            bairro: string;
            cep: string;
            cidade: string;
            estado: string;
            especialidadeId: string;
            registro: string;
            crm: string | null;
            sexo: string;
            dataContratacao: Date;
            rua: string;
            horarioInicio: string;
            horarioFim: string;
            intervalo: string;
            diasTrabalho: string[];
        };
        id: string;
        tenantId: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        profissionalId: string;
        camposPersonalizados: import("generated/prisma/runtime/library").JsonValue | null;
        dataNascimento: Date;
        cpf: string;
        telefone: string;
        email: string;
        numero: string;
        complemento: string | null;
        bairro: string;
        cep: string;
        cidade: string;
        estado: string;
        pais: string;
        convenioNome: string | null;
        convenioNumero: string | null;
        convenioPlano: string | null;
        convenioValidade: Date | null;
    } | null>;
    update(id: string, data: PacienteInput & {
        tenantId?: string;
    }, tenantId?: string): Promise<{
        endereco: {
            rua: string;
            numero: string;
            complemento: string | null;
            bairro: string;
            cidade: string;
            estado: string;
            cep: string;
            pais: string;
        };
        convenio: {
            nome: string | null;
            numero: string | null;
            plano: string | null;
            validade: Date | null;
        };
        profissional: {
            id: string;
            tenantId: string;
            nome: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("generated/prisma").$Enums.ProfissionalStatus;
            dataNascimento: Date;
            telefone: string;
            email: string;
            numero: string;
            complemento: string | null;
            bairro: string;
            cep: string;
            cidade: string;
            estado: string;
            especialidadeId: string;
            registro: string;
            crm: string | null;
            sexo: string;
            dataContratacao: Date;
            rua: string;
            horarioInicio: string;
            horarioFim: string;
            intervalo: string;
            diasTrabalho: string[];
        };
        id: string;
        tenantId: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        profissionalId: string;
        camposPersonalizados: import("generated/prisma/runtime/library").JsonValue | null;
        dataNascimento: Date;
        cpf: string;
        telefone: string;
        email: string;
        numero: string;
        complemento: string | null;
        bairro: string;
        cep: string;
        cidade: string;
        estado: string;
        pais: string;
        convenioNome: string | null;
        convenioNumero: string | null;
        convenioPlano: string | null;
        convenioValidade: Date | null;
    }>;
    delete(id: string, tenantId?: string): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        profissionalId: string;
        camposPersonalizados: import("generated/prisma/runtime/library").JsonValue | null;
        dataNascimento: Date;
        cpf: string;
        telefone: string;
        email: string;
        endereco: string;
        numero: string;
        complemento: string | null;
        bairro: string;
        cep: string;
        cidade: string;
        estado: string;
        pais: string;
        convenioNome: string | null;
        convenioNumero: string | null;
        convenioPlano: string | null;
        convenioValidade: Date | null;
    }>;
    deleteWithCascade(id: string, tenantId?: string): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        profissionalId: string;
        camposPersonalizados: import("generated/prisma/runtime/library").JsonValue | null;
        dataNascimento: Date;
        cpf: string;
        telefone: string;
        email: string;
        endereco: string;
        numero: string;
        complemento: string | null;
        bairro: string;
        cep: string;
        cidade: string;
        estado: string;
        pais: string;
        convenioNome: string | null;
        convenioNumero: string | null;
        convenioPlano: string | null;
        convenioValidade: Date | null;
    }>;
    checkRelations(id: string, tenantId?: string): Promise<{
        hasRelations: boolean;
        relations: {
            agendamentos: number;
            prontuarios: number;
            anamneses: number;
            faturamentos: number;
        };
    }>;
};
export default _default;

import { CreateClinicaInput, UpdateClinicaInput, ClinicaFilters } from './validation';
export declare class ClinicaService {
    /**
     * Cria uma nova clínica
     */
    static create(data: CreateClinicaInput, tenantId?: string): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: import("generated/prisma").$Enums.TipoClinica;
        logo: string | null;
        corPrimaria: string;
        corSecundaria: string;
        tema: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Busca todas as clínicas com filtros
     */
    static findAll(filters?: ClinicaFilters): Promise<{
        clinicas: ({
            _count: {
                Agendamento: number;
                Paciente: number;
                Profissional: number;
                usuarios: number;
            };
        } & {
            id: string;
            tenantId: string;
            nome: string;
            tipo: import("generated/prisma").$Enums.TipoClinica;
            logo: string | null;
            corPrimaria: string;
            corSecundaria: string;
            tema: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Busca uma clínica por ID
     */
    static findById(id: string): Promise<{
        _count: {
            Agendamento: number;
            Anamnese: number;
            Exame: number;
            Paciente: number;
            Profissional: number;
            Prontuario: number;
            Mensagem: number;
            usuarios: number;
        };
        especialidades: {
            id: string;
            nome: string;
            ativo: boolean;
            descricao: string;
        }[];
    } & {
        id: string;
        tenantId: string;
        nome: string;
        tipo: import("generated/prisma").$Enums.TipoClinica;
        logo: string | null;
        corPrimaria: string;
        corSecundaria: string;
        tema: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Busca uma clínica por tenant ID
     */
    static findByTenantId(tenantId: string): Promise<{
        _count: {
            Agendamento: number;
            Anamnese: number;
            Exame: number;
            Paciente: number;
            Profissional: number;
            Prontuario: number;
            Mensagem: number;
            usuarios: number;
        };
        especialidades: {
            id: string;
            nome: string;
            descricao: string;
        }[];
    } & {
        id: string;
        tenantId: string;
        nome: string;
        tipo: import("generated/prisma").$Enums.TipoClinica;
        logo: string | null;
        corPrimaria: string;
        corSecundaria: string;
        tema: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Atualiza uma clínica
     */
    static update(id: string, data: UpdateClinicaInput): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: import("generated/prisma").$Enums.TipoClinica;
        logo: string | null;
        corPrimaria: string;
        corSecundaria: string;
        tema: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Ativa/desativa uma clínica
     */
    static toggleStatus(id: string): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: import("generated/prisma").$Enums.TipoClinica;
        logo: string | null;
        corPrimaria: string;
        corSecundaria: string;
        tema: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Remove uma clínica
     */
    static delete(id: string): Promise<{
        message: string;
    }>;
    /**
     * Busca estatísticas da clínica
     */
    static getStats(tenantId: string): Promise<{
        usuarios: number;
        pacientes: number;
        profissionais: number;
        agendamentos: {
            total: number;
            hoje: number;
            semana: number;
            mes: number;
        };
        documentos: {
            prontuarios: number;
            exames: number;
            anamneses: number;
        };
    }>;
    /**
     * Busca configurações da clínica
     */
    static getConfiguracoes(tenantId: string): Promise<{
        logo: string | null;
        corPrimaria: string;
        corSecundaria: string;
        tema: string;
    }>;
    /**
     * Atualiza configurações da clínica
     */
    static updateConfiguracoes(tenantId: string, configuracoes: Record<string, any>): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: import("generated/prisma").$Enums.TipoClinica;
        logo: string | null;
        corPrimaria: string;
        corSecundaria: string;
        tema: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export default ClinicaService;

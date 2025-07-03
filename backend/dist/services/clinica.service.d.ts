import { TipoClinica } from '../types/enums';
export declare class ClinicaService {
    static criarClinica(dados: {
        tenantId: string;
        nome: string;
        tipo: TipoClinica;
        logo?: string;
        corPrimaria?: string;
        corSecundaria?: string;
        tema?: string;
    }): Promise<{
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
    static buscarClinicaPorTenantId(tenantId: string): Promise<{
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
    }>;
    static listarClinicas(): Promise<({
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
    })[]>;
    static atualizarClinica(tenantId: string, dados: {
        nome?: string;
        tipo?: TipoClinica;
        logo?: string;
        corPrimaria?: string;
        corSecundaria?: string;
        tema?: string;
        ativo?: boolean;
    }): Promise<{
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
    static desativarClinica(tenantId: string): Promise<{
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
    static ativarClinica(tenantId: string): Promise<{
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
    static obterEstatisticasClinica(tenantId: string): Promise<{
        clinica: {
            id: string;
            nome: string;
            tipo: import("generated/prisma").$Enums.TipoClinica;
            ativo: boolean;
            createdAt: Date;
        };
        estatisticas: {
            totalUsuarios: number;
            totalProfissionais: number;
            totalPacientes: number;
            totalAgendamentos: number;
            totalProntuarios: number;
            totalAnamneses: number;
            totalExames: number;
            agendamentosMes: number;
            agendamentosPorStatus: (import("generated/prisma").Prisma.PickEnumerable<import("generated/prisma").Prisma.AgendamentoGroupByOutputType, "status"[]> & {
                _count: {
                    status: number;
                };
            })[];
            agendamentosPorTipo: (import("generated/prisma").Prisma.PickEnumerable<import("generated/prisma").Prisma.AgendamentoGroupByOutputType, "tipo"[]> & {
                _count: {
                    tipo: number;
                };
            })[];
        };
    }>;
    static configurarWhatsApp(tenantId: string, config: {
        zApiInstanceId: string;
        zApiToken: string;
        numeroWhatsApp: string;
        mensagensAtivas: any;
        horarioEnvioLembrete: string;
        diasAntecedenciaLembrete?: number;
    }): Promise<{
        id: string;
        tenantId: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        zApiInstanceId: string;
        zApiToken: string;
        numeroWhatsApp: string;
        mensagensAtivas: import("generated/prisma/runtime/library").JsonValue;
        horarioEnvioLembrete: string;
        diasAntecedenciaLembrete: number;
    }>;
    static obterConfiguracaoWhatsApp(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        zApiInstanceId: string;
        zApiToken: string;
        numeroWhatsApp: string;
        mensagensAtivas: import("generated/prisma/runtime/library").JsonValue;
        horarioEnvioLembrete: string;
        diasAntecedenciaLembrete: number;
    }>;
}

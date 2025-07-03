import { Prisma } from '../../generated/prisma';
interface Periodo {
    inicio: string | Date;
    fim: string | Date;
}
interface FiltrosConsultas {
    profissionalId?: string;
    especialidadeId?: string;
    status?: string;
    tipo?: string;
}
interface FiltrosFaturamento {
    profissionalId?: string;
    tipo?: string;
    status?: string;
    formaPagamento?: string;
}
interface FiltrosDesempenho {
    profissionalId?: string;
    especialidadeId?: string;
    tipo?: string;
}
interface FiltrosReceitas {
    profissionalId?: string;
    tipo?: string;
    formaPagamento?: string;
}
interface FiltrosProfissionais {
    especialidadeId?: string;
    status?: string;
    dataContratacaoInicio?: string | Date;
    dataContratacaoFim?: string | Date;
}
interface DesempenhoProfissional {
    profissional: any;
    totalConsultas: number;
    consultasRealizadas: number;
    consultasCanceladas: number;
}
interface FiltrosProntuarios {
    profissionalId?: string;
    pacienteId?: string;
    tipo?: string;
}
interface ConfiguracaoRelatorio {
    tipo: string;
    filtros: any;
    formato: string;
    agendamento?: any;
}
interface RelatorioAgendado {
    id: string;
    tipo: string;
    filtros: any;
    agendamento: any;
    status: string;
    createdAt: Date;
}
interface FiltrosHistorico {
    tipo?: string;
    dataInicio?: string | Date;
    dataFim?: string | Date;
    status?: string;
}
export default class RelatorioService {
    static create(data: any): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        descricao: string;
        tipoClinica: import("../../generated/prisma").$Enums.TipoClinica;
        parametros: Prisma.JsonValue;
        template: string;
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
            descricao: string;
            tipoClinica: import("../../generated/prisma").$Enums.TipoClinica;
            parametros: Prisma.JsonValue;
            template: string;
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
        descricao: string;
        tipoClinica: import("../../generated/prisma").$Enums.TipoClinica;
        parametros: Prisma.JsonValue;
        template: string;
    } | null>;
    static update(id: string, data: any): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        descricao: string;
        tipoClinica: import("../../generated/prisma").$Enums.TipoClinica;
        parametros: Prisma.JsonValue;
        template: string;
    }>;
    static delete(id: string): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        descricao: string;
        tipoClinica: import("../../generated/prisma").$Enums.TipoClinica;
        parametros: Prisma.JsonValue;
        template: string;
    }>;
    static gerarRelatorioConsultas(periodo: Periodo, filtros?: FiltrosConsultas): Promise<{
        tipo: string;
        periodo: Periodo;
        filtros: FiltrosConsultas;
        totalConsultas: number;
        dados: ({
            paciente: {
                id: string;
                tenantId: string;
                nome: string;
                createdAt: Date;
                updatedAt: Date;
                profissionalId: string;
                camposPersonalizados: Prisma.JsonValue | null;
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
            };
            profissional: {
                especialidade: {
                    id: string;
                    tenantId: string;
                    nome: string;
                    ativo: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    descricao: string;
                    tipoClinica: import("../../generated/prisma").$Enums.TipoClinica;
                    configuracoes: Prisma.JsonValue;
                };
            } & {
                id: string;
                tenantId: string;
                nome: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("../../generated/prisma").$Enums.ProfissionalStatus;
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
        } & {
            id: string;
            tenantId: string;
            tipo: import("../../generated/prisma").$Enums.TipoAgendamento;
            createdAt: Date;
            updatedAt: Date;
            pacienteId: string;
            profissionalId: string;
            data: Date;
            horaInicio: string;
            horaFim: string;
            status: import("../../generated/prisma").$Enums.StatusAgendamento;
            observacoes: string | null;
            camposPersonalizados: Prisma.JsonValue | null;
        })[];
    }>;
    static gerarRelatorioFaturamento(periodo: Periodo, filtros?: FiltrosFaturamento): Promise<{
        tipo: string;
        periodo: Periodo;
        filtros: FiltrosFaturamento;
        totalFaturado: number;
        totalPago: number;
        totalFaturamentos: number;
        dados: ({
            paciente: {
                id: string;
                tenantId: string;
                nome: string;
                createdAt: Date;
                updatedAt: Date;
                profissionalId: string;
                camposPersonalizados: Prisma.JsonValue | null;
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
            };
            profissional: {
                id: string;
                tenantId: string;
                nome: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("../../generated/prisma").$Enums.ProfissionalStatus;
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
        } & {
            id: string;
            tenantId: string;
            tipo: import("../../generated/prisma").$Enums.TipoFaturamento;
            createdAt: Date;
            updatedAt: Date;
            pacienteId: string;
            profissionalId: string;
            status: import("../../generated/prisma").$Enums.StatusFaturamento;
            observacoes: string | null;
            camposPersonalizados: Prisma.JsonValue;
            prontuarioId: string | null;
            agendamentoId: string | null;
            valor: Prisma.Decimal;
            desconto: Prisma.Decimal;
            valorFinal: Prisma.Decimal;
            valorPago: Prisma.Decimal;
            formaPagamento: import("../../generated/prisma").$Enums.FormaPagamento;
            dataVencimento: Date;
            dataPagamento: Date | null;
        })[];
    }>;
    static gerarRelatorioDesempenho(periodo: Periodo, filtros?: FiltrosDesempenho): Promise<{
        tipo: string;
        periodo: Periodo;
        filtros: FiltrosDesempenho;
        dados: DesempenhoProfissional[];
    }>;
    static gerarRelatorioReceitas(periodo: Periodo, filtros?: FiltrosReceitas): Promise<{
        tipo: string;
        periodo: Periodo;
        filtros: FiltrosReceitas;
        totalReceitas: number;
        totalFaturamentos: number;
        dados: ({
            paciente: {
                id: string;
                tenantId: string;
                nome: string;
                createdAt: Date;
                updatedAt: Date;
                profissionalId: string;
                camposPersonalizados: Prisma.JsonValue | null;
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
            };
            profissional: {
                id: string;
                tenantId: string;
                nome: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("../../generated/prisma").$Enums.ProfissionalStatus;
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
        } & {
            id: string;
            tenantId: string;
            tipo: import("../../generated/prisma").$Enums.TipoFaturamento;
            createdAt: Date;
            updatedAt: Date;
            pacienteId: string;
            profissionalId: string;
            status: import("../../generated/prisma").$Enums.StatusFaturamento;
            observacoes: string | null;
            camposPersonalizados: Prisma.JsonValue;
            prontuarioId: string | null;
            agendamentoId: string | null;
            valor: Prisma.Decimal;
            desconto: Prisma.Decimal;
            valorFinal: Prisma.Decimal;
            valorPago: Prisma.Decimal;
            formaPagamento: import("../../generated/prisma").$Enums.FormaPagamento;
            dataVencimento: Date;
            dataPagamento: Date | null;
        })[];
    }>;
    static gerarRelatorioProfissionais(filtros?: FiltrosProfissionais): Promise<{
        tipo: string;
        filtros: FiltrosProfissionais;
        totalProfissionais: number;
        dados: ({
            especialidade: {
                id: string;
                tenantId: string;
                nome: string;
                ativo: boolean;
                createdAt: Date;
                updatedAt: Date;
                descricao: string;
                tipoClinica: import("../../generated/prisma").$Enums.TipoClinica;
                configuracoes: Prisma.JsonValue;
            };
            agendamentos: {
                id: string;
                tenantId: string;
                tipo: import("../../generated/prisma").$Enums.TipoAgendamento;
                createdAt: Date;
                updatedAt: Date;
                pacienteId: string;
                profissionalId: string;
                data: Date;
                horaInicio: string;
                horaFim: string;
                status: import("../../generated/prisma").$Enums.StatusAgendamento;
                observacoes: string | null;
                camposPersonalizados: Prisma.JsonValue | null;
            }[];
        } & {
            id: string;
            tenantId: string;
            nome: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("../../generated/prisma").$Enums.ProfissionalStatus;
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
        })[];
    }>;
    static gerarRelatorioProntuarios(periodo: Periodo, filtros?: FiltrosProntuarios): Promise<{
        tipo: string;
        periodo: Periodo;
        filtros: FiltrosProntuarios;
        totalProntuarios: number;
        dados: ({
            paciente: {
                id: string;
                tenantId: string;
                nome: string;
                createdAt: Date;
                updatedAt: Date;
                profissionalId: string;
                camposPersonalizados: Prisma.JsonValue | null;
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
            };
            profissional: {
                id: string;
                tenantId: string;
                nome: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("../../generated/prisma").$Enums.ProfissionalStatus;
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
        } & {
            id: string;
            tenantId: string;
            tipo: import("../../generated/prisma").$Enums.TipoProntuario;
            createdAt: Date;
            updatedAt: Date;
            pacienteId: string;
            profissionalId: string;
            data: Date;
            observacoes: string | null;
            camposPersonalizados: Prisma.JsonValue | null;
            descricao: string;
            diagnostico: string | null;
            prescricao: string | null;
        })[];
    }>;
    static gerarRelatorioCustomizado(configuracao: ConfiguracaoRelatorio): Promise<{
        tipo: string;
        configuracao: ConfiguracaoRelatorio;
        dados: never[];
        message: string;
    }>;
    static getTemplates(): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        descricao: string;
        tipoClinica: import("../../generated/prisma").$Enums.TipoClinica;
        parametros: Prisma.JsonValue;
        template: string;
    }[]>;
    static getTemplate(id: string): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        descricao: string;
        tipoClinica: import("../../generated/prisma").$Enums.TipoClinica;
        parametros: Prisma.JsonValue;
        template: string;
    } | null>;
    static createTemplate(data: any): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        descricao: string;
        tipoClinica: import("../../generated/prisma").$Enums.TipoClinica;
        parametros: Prisma.JsonValue;
        template: string;
    }>;
    static updateTemplate(id: string, data: any): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        descricao: string;
        tipoClinica: import("../../generated/prisma").$Enums.TipoClinica;
        parametros: Prisma.JsonValue;
        template: string;
    }>;
    static deleteTemplate(id: string): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        descricao: string;
        tipoClinica: import("../../generated/prisma").$Enums.TipoClinica;
        parametros: Prisma.JsonValue;
        template: string;
    }>;
    static agendarRelatorio(data: any): Promise<RelatorioAgendado>;
    static getRelatoriosAgendados(): Promise<RelatorioAgendado[]>;
    static updateRelatorioAgendado(id: string, data: any): Promise<RelatorioAgendado>;
    static deleteRelatorioAgendado(id: string): Promise<{
        success: boolean;
    }>;
    static getHistorico(filtros?: FiltrosHistorico): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        descricao: string;
        tipoClinica: import("../../generated/prisma").$Enums.TipoClinica;
        parametros: Prisma.JsonValue;
        template: string;
    }[]>;
}
export {};

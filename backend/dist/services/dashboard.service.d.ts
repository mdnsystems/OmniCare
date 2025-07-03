declare const _default: {
    getDashboard(tenantId: string): Promise<{
        agendamentos: {
            hoje: number;
            mes: number;
            realizados: number;
            cancelados: number;
            taxaSucesso: number;
        };
        financeiro: {
            receitaTotal: number;
            receitaPaga: number;
            receitaPendente: number;
            mediaTicket: number;
        };
        pacientes: {
            total: number;
            novosMes: number;
        };
        profissionais: {
            total: number;
            ativos: number;
        };
        prontuarios: {
            mes: number;
        };
        anamnese: {
            mes: number;
        };
    }>;
    getEstatisticasAgendamentos(tenantId: string, periodo?: {
        inicio: string;
        fim: string;
    }): Promise<{
        total: number;
        realizados: number;
        cancelados: number;
        confirmados: number;
        pendentes: number;
        taxaSucesso: number;
        taxaCancelamento: number;
        porTipo: {
            CONSULTA: number;
            RETORNO: number;
            EXAME: number;
            PROCEDIMENTO: number;
        };
        porProfissional: number;
    }>;
    getEstatisticasFinanceiras(tenantId: string, periodo?: {
        inicio: string;
        fim: string;
    }): Promise<{
        total: number;
        receitaTotal: number;
        receitaPaga: number;
        receitaPendente: number;
        receitaVencida: number;
        taxaConversao: number;
        mediaTicket: number;
        porFormaPagamento: {
            DINHEIRO: number;
            CARTAO_CREDITO: number;
            CARTAO_DEBITO: number;
            PIX: number;
            TRANSFERENCIA: number;
        };
    }>;
    getEstatisticasPacientes(tenantId: string): Promise<{
        total: number;
        novosMes: number;
        comAgendamentos: number;
        taxaRetencao: number;
    }>;
    getEstatisticasProfissionais(tenantId: string): Promise<{
        total: number;
        ativos: number;
        comAgendamentos: number;
        taxaAtividade: number;
    }>;
    getEstatisticasProntuarios(tenantId: string, periodo?: {
        inicio: string;
        fim: string;
    }): Promise<{
        total: number;
        porTipo: Record<string, number>;
    }>;
    getEstatisticasAnamnese(tenantId: string, periodo?: {
        inicio: string;
        fim: string;
    }): Promise<{
        total: number;
        pacientesComAnamnese: number;
        totalPacientes: number;
        taxaCobertura: number;
    }>;
    getEstatisticasAtividades(tenantId: string): Promise<{
        agendamentosSemana: number;
        agendamentosRealizadosSemana: number;
        prontuariosSemana: number;
        anamneseSemana: number;
        receitaSemana: number;
        taxaSucesso: number;
    }>;
};
export default _default;

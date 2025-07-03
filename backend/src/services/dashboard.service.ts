import prisma from './prisma';
import { StatusAgendamento, TipoAgendamento, StatusFaturamento, FormaPagamento } from '../types/enums';

export default {
  async getDashboard(tenantId: string) {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    // Estatísticas de agendamentos
    const agendamentosHoje = await prisma.agendamento.count({
      where: {
        tenantId,
        data: {
          gte: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()),
          lt: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1)
        }
      }
    });

    const agendamentosMes = await prisma.agendamento.count({
      where: {
        tenantId,
        data: {
          gte: inicioMes,
          lte: fimMes
        }
      }
    });

    const agendamentosRealizados = await prisma.agendamento.count({
      where: {
        tenantId,
        status: StatusAgendamento.REALIZADO,
        data: {
          gte: inicioMes,
          lte: fimMes
        }
      }
    });

    const agendamentosCancelados = await prisma.agendamento.count({
      where: {
        tenantId,
        status: StatusAgendamento.CANCELADO,
        data: {
          gte: inicioMes,
          lte: fimMes
        }
      }
    });

    // Estatísticas financeiras
    const faturamentosMes = await prisma.faturamento.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: inicioMes,
          lte: fimMes
        }
      }
    });

    const receitaTotal = faturamentosMes.reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
    const receitaPaga = faturamentosMes
      .filter(fat => fat.status === StatusFaturamento.PAGO)
      .reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
    const receitaPendente = faturamentosMes
      .filter(fat => fat.status === StatusFaturamento.PENDENTE)
      .reduce((acc, fat) => acc + Number(fat.valorFinal), 0);

    // Estatísticas de pacientes
    const totalPacientes = await prisma.paciente.count({ where: { tenantId } });
    const pacientesNovosMes = await prisma.paciente.count({
      where: {
        tenantId,
        createdAt: {
          gte: inicioMes,
          lte: fimMes
        }
      }
    });

    // Estatísticas de profissionais
    const totalProfissionais = await prisma.profissional.count({ where: { tenantId } });
    const profissionaisAtivos = await prisma.profissional.count({
      where: {
        tenantId,
        status: 'ATIVO'
      }
    });

    // Estatísticas de prontuários
    const prontuariosMes = await prisma.prontuario.count({
      where: {
        tenantId,
        createdAt: {
          gte: inicioMes,
          lte: fimMes
        }
      }
    });

    // Estatísticas de anamnese
    const anamnesesMes = await prisma.anamnese.count({
      where: {
        tenantId,
        createdAt: {
          gte: inicioMes,
          lte: fimMes
        }
      }
    });

    return {
      agendamentos: {
        hoje: agendamentosHoje,
        mes: agendamentosMes,
        realizados: agendamentosRealizados,
        cancelados: agendamentosCancelados,
        taxaSucesso: agendamentosMes > 0 ? (agendamentosRealizados / agendamentosMes) * 100 : 0
      },
      financeiro: {
        receitaTotal,
        receitaPaga,
        receitaPendente,
        mediaTicket: agendamentosRealizados > 0 ? receitaTotal / agendamentosRealizados : 0
      },
      pacientes: {
        total: totalPacientes,
        novosMes: pacientesNovosMes
      },
      profissionais: {
        total: totalProfissionais,
        ativos: profissionaisAtivos
      },
      prontuarios: {
        mes: prontuariosMes
      },
      anamnese: {
        mes: anamnesesMes
      }
    };
  },

  async getEstatisticasAgendamentos(tenantId: string, periodo?: { inicio: string; fim: string }) {
    const where: any = { tenantId };
    
    if (periodo) {
      where.data = {
        gte: new Date(periodo.inicio),
        lte: new Date(periodo.fim)
      };
    }

    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: {
        paciente: true,
        profissional: true
      }
    });

    const total = agendamentos.length;
    const realizados = agendamentos.filter(a => a.status === StatusAgendamento.REALIZADO).length;
    const cancelados = agendamentos.filter(a => a.status === StatusAgendamento.CANCELADO).length;
    const confirmados = agendamentos.filter(a => a.status === StatusAgendamento.CONFIRMADO).length;
    const pendentes = agendamentos.filter(a => a.status === StatusAgendamento.PENDENTE).length;

    const porTipo = {
      CONSULTA: agendamentos.filter(a => a.tipo === TipoAgendamento.CONSULTA).length,
      RETORNO: agendamentos.filter(a => a.tipo === TipoAgendamento.RETORNO).length,
      EXAME: agendamentos.filter(a => a.tipo === TipoAgendamento.EXAME).length,
      PROCEDIMENTO: agendamentos.filter(a => a.tipo === TipoAgendamento.PROCEDIMENTO).length
    };

    const porProfissional = await prisma.agendamento.groupBy({
      by: ['profissionalId'],
      where,
      _count: {
        id: true
      }
    });

    return {
      total,
      realizados,
      cancelados,
      confirmados,
      pendentes,
      taxaSucesso: total > 0 ? (realizados / total) * 100 : 0,
      taxaCancelamento: total > 0 ? (cancelados / total) * 100 : 0,
      porTipo,
      porProfissional: porProfissional.length
    };
  },

  async getEstatisticasFinanceiras(tenantId: string, periodo?: { inicio: string; fim: string }) {
    const where: any = { tenantId };
    
    if (periodo) {
      where.createdAt = {
        gte: new Date(periodo.inicio),
        lte: new Date(periodo.fim)
      };
    }

    const faturamentos = await prisma.faturamento.findMany({
      where,
      include: {
        paciente: true,
        profissional: true
      }
    });

    const total = faturamentos.length;
    const receitaTotal = faturamentos.reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
    const receitaPaga = faturamentos
      .filter(fat => fat.status === StatusFaturamento.PAGO)
      .reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
    const receitaPendente = faturamentos
      .filter(fat => fat.status === StatusFaturamento.PENDENTE)
      .reduce((acc, fat) => acc + Number(fat.valorFinal), 0);
    const receitaVencida = faturamentos
      .filter(fat => fat.status === StatusFaturamento.VENCIDO)
      .reduce((acc, fat) => acc + Number(fat.valorFinal), 0);

    const porFormaPagamento = {
      DINHEIRO: faturamentos.filter(fat => fat.formaPagamento === FormaPagamento.DINHEIRO).length,
      CARTAO_CREDITO: faturamentos.filter(fat => fat.formaPagamento === FormaPagamento.CARTAO_CREDITO).length,
      CARTAO_DEBITO: faturamentos.filter(fat => fat.formaPagamento === FormaPagamento.CARTAO_DEBITO).length,
      PIX: faturamentos.filter(fat => fat.formaPagamento === FormaPagamento.PIX).length,
      TRANSFERENCIA: faturamentos.filter(fat => fat.formaPagamento === FormaPagamento.TRANSFERENCIA).length
    };

    return {
      total,
      receitaTotal,
      receitaPaga,
      receitaPendente,
      receitaVencida,
      taxaConversao: total > 0 ? (receitaPaga / receitaTotal) * 100 : 0,
      mediaTicket: total > 0 ? receitaTotal / total : 0,
      porFormaPagamento
    };
  },

  async getEstatisticasPacientes(tenantId: string) {
    const total = await prisma.paciente.count({ where: { tenantId } });
    
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const novosMes = await prisma.paciente.count({
      where: {
        tenantId,
        createdAt: {
          gte: inicioMes,
          lte: fimMes
        }
      }
    });

    const comAgendamentos = await prisma.paciente.count({
      where: {
        tenantId,
        agendamentos: {
          some: {}
        }
      }
    });

    return {
      total,
      novosMes,
      comAgendamentos,
      taxaRetencao: total > 0 ? (comAgendamentos / total) * 100 : 0
    };
  },

  async getEstatisticasProfissionais(tenantId: string) {
    const total = await prisma.profissional.count({ where: { tenantId } });
    const ativos = await prisma.profissional.count({
      where: {
        tenantId,
        status: 'ATIVO'
      }
    });

    const comAgendamentos = await prisma.profissional.count({
      where: {
        tenantId,
        agendamentos: {
          some: {}
        }
      }
    });

    return {
      total,
      ativos,
      comAgendamentos,
      taxaAtividade: total > 0 ? (ativos / total) * 100 : 0
    };
  },

  async getEstatisticasProntuarios(tenantId: string, periodo?: { inicio: string; fim: string }) {
    const where: any = { tenantId };
    
    if (periodo) {
      where.createdAt = {
        gte: new Date(periodo.inicio),
        lte: new Date(periodo.fim)
      };
    }

    const total = await prisma.prontuario.count({ where });

    const porTipo = await prisma.prontuario.groupBy({
      by: ['tipo'],
      where,
      _count: {
        id: true
      }
    });

    return {
      total,
      porTipo: porTipo.reduce((acc, item) => {
        acc[item.tipo] = item._count.id;
        return acc;
      }, {} as Record<string, number>)
    };
  },

  async getEstatisticasAnamnese(tenantId: string, periodo?: { inicio: string; fim: string }) {
    const where: any = { tenantId };
    
    if (periodo) {
      where.createdAt = {
        gte: new Date(periodo.inicio),
        lte: new Date(periodo.fim)
      };
    }

    const total = await prisma.anamnese.count({ where });

    const pacientesComAnamnese = await prisma.paciente.count({
      where: {
        tenantId,
        anamneses: {
          some: {}
        }
      }
    });

    const totalPacientes = await prisma.paciente.count({ where: { tenantId } });

    return {
      total,
      pacientesComAnamnese,
      totalPacientes,
      taxaCobertura: totalPacientes > 0 ? (pacientesComAnamnese / totalPacientes) * 100 : 0
    };
  },

  async getEstatisticasAtividades(tenantId: string) {
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - 7);

    // Agendamentos da semana
    const agendamentosSemana = await prisma.agendamento.count({
      where: {
        tenantId,
        data: {
          gte: inicioSemana,
          lte: hoje
        }
      }
    });

    const agendamentosRealizadosSemana = await prisma.agendamento.count({
      where: {
        tenantId,
        status: StatusAgendamento.REALIZADO,
        data: {
          gte: inicioSemana,
          lte: hoje
        }
      }
    });

    // Prontuários da semana
    const prontuariosSemana = await prisma.prontuario.count({
      where: {
        tenantId,
        createdAt: {
          gte: inicioSemana,
          lte: hoje
        }
      }
    });

    // Anamnese da semana
    const anamneseSemana = await prisma.anamnese.count({
      where: {
        tenantId,
        createdAt: {
          gte: inicioSemana,
          lte: hoje
        }
      }
    });

    // Faturamentos da semana
    const faturamentosSemana = await prisma.faturamento.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: inicioSemana,
          lte: hoje
        }
      }
    });

    const receitaSemana = faturamentosSemana.reduce((acc, fat) => acc + Number(fat.valorFinal), 0);

    return {
      agendamentosSemana,
      agendamentosRealizadosSemana,
      prontuariosSemana,
      anamneseSemana,
      receitaSemana,
      taxaSucesso: agendamentosSemana > 0 ? (agendamentosRealizadosSemana / agendamentosSemana) * 100 : 0
    };
  }
}; 
import prisma from './prisma';
import { Prisma } from '../../generated/prisma';

// Tipos para os relatórios
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
  static async create(data: any) {
    return await prisma.relatorioEspecialidade.create({
      data: {
        ...data,
        tenantId: data.tenantId,
      },
    });
  }

  static async findAll(filters: any = {}) {
    const { page = 1, limit = 10, tipo, status } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (tipo) where.tipo = tipo;
    if (status) where.status = status;

    const [relatorios, total] = await Promise.all([
      prisma.relatorioEspecialidade.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.relatorioEspecialidade.count({ where }),
    ]);

    return {
      data: relatorios,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id: string) {
    return await prisma.relatorioEspecialidade.findUnique({
      where: { id },
    });
  }

  static async update(id: string, data: any) {
    return await prisma.relatorioEspecialidade.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return await prisma.relatorioEspecialidade.delete({
      where: { id },
    });
  }

  // Relatórios específicos
  static async gerarRelatorioConsultas(periodo: Periodo, filtros: FiltrosConsultas = {}) {
    const { inicio, fim } = periodo;
    const { profissionalId, especialidadeId, status, tipo } = filtros;

    const where: any = {
      dataHora: {
        gte: new Date(inicio),
        lte: new Date(fim),
      },
    };

    if (profissionalId) where.profissionalId = profissionalId;
    if (especialidadeId) where.profissional = { especialidadeId };
    if (status) where.status = status;
    if (tipo) where.tipo = tipo;

    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: {
        paciente: true,
        profissional: {
          include: {
            especialidade: true,
          },
        },
      },
    });

    return {
      tipo: 'consultas',
      periodo,
      filtros,
      totalConsultas: agendamentos.length,
      dados: agendamentos,
    };
  }

  static async gerarRelatorioFaturamento(periodo: Periodo, filtros: FiltrosFaturamento = {}) {
    const { inicio, fim } = periodo;
    const { profissionalId, tipo, status, formaPagamento } = filtros;

    const where: any = {
      dataVencimento: {
        gte: new Date(inicio),
        lte: new Date(fim),
      },
    };

    if (profissionalId) where.profissionalId = profissionalId;
    if (tipo) where.tipo = tipo;
    if (status) where.status = status;
    if (formaPagamento) where.formaPagamento = formaPagamento;

    const faturamentos = await prisma.faturamento.findMany({
      where,
      include: {
        paciente: true,
        profissional: true,
      },
    });

    const totalFaturado = faturamentos.reduce((sum: number, fat: any) => sum + Number(fat.valor), 0);
    const totalPago = faturamentos
      .filter((fat: any) => fat.status === 'PAGO')
      .reduce((sum: number, fat: any) => sum + Number(fat.valor), 0);

    return {
      tipo: 'faturamento',
      periodo,
      filtros,
      totalFaturado,
      totalPago,
      totalFaturamentos: faturamentos.length,
      dados: faturamentos,
    };
  }

  static async gerarRelatorioDesempenho(periodo: Periodo, filtros: FiltrosDesempenho = {}) {
    const { inicio, fim } = periodo;
    const { profissionalId, especialidadeId, tipo } = filtros;

    const where: any = {
      dataHora: {
        gte: new Date(inicio),
        lte: new Date(fim),
      },
    };

    if (profissionalId) where.profissionalId = profissionalId;
    if (especialidadeId) where.profissional = { especialidadeId };
    if (tipo) where.tipo = tipo;

    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: {
        profissional: {
          include: {
            especialidade: true,
          },
        },
      },
    });

    // Agrupar por profissional
    const desempenhoPorProfissional = agendamentos.reduce((acc: Record<string, DesempenhoProfissional>, agendamento: any) => {
      const profId = agendamento.profissionalId;
      if (!acc[profId]) {
        acc[profId] = {
          profissional: agendamento.profissional,
          totalConsultas: 0,
          consultasRealizadas: 0,
          consultasCanceladas: 0,
        };
      }
      acc[profId].totalConsultas++;
      if (agendamento.status === 'REALIZADO') {
        acc[profId].consultasRealizadas++;
      } else if (agendamento.status === 'CANCELADO') {
        acc[profId].consultasCanceladas++;
      }
      return acc;
    }, {});

    return {
      tipo: 'desempenho',
      periodo,
      filtros,
      dados: Object.values(desempenhoPorProfissional),
    };
  }

  static async gerarRelatorioReceitas(periodo: Periodo, filtros: FiltrosReceitas = {}) {
    const { inicio, fim } = periodo;
    const { profissionalId, tipo, formaPagamento } = filtros;

    const where: any = {
      dataPagamento: {
        gte: new Date(inicio),
        lte: new Date(fim),
      },
      status: 'PAGO',
    };

    if (profissionalId) where.profissionalId = profissionalId;
    if (tipo) where.tipo = tipo;
    if (formaPagamento) where.formaPagamento = formaPagamento;

    const faturamentos = await prisma.faturamento.findMany({
      where,
      include: {
        paciente: true,
        profissional: true,
      },
    });

    const totalReceitas = faturamentos.reduce((sum: number, fat: any) => sum + Number(fat.valor), 0);

    return {
      tipo: 'receitas',
      periodo,
      filtros,
      totalReceitas,
      totalFaturamentos: faturamentos.length,
      dados: faturamentos,
    };
  }

  static async gerarRelatorioProfissionais(filtros: FiltrosProfissionais = {}) {
    const { especialidadeId, status, dataContratacaoInicio, dataContratacaoFim } = filtros;

    const where: any = {};
    if (especialidadeId) where.especialidadeId = especialidadeId;
    if (status) where.status = status;
    if (dataContratacaoInicio || dataContratacaoFim) {
      where.dataContratacao = {};
      if (dataContratacaoInicio) where.dataContratacao.gte = new Date(dataContratacaoInicio);
      if (dataContratacaoFim) where.dataContratacao.lte = new Date(dataContratacaoFim);
    }

    const profissionais = await prisma.profissional.findMany({
      where,
      include: {
        especialidade: true,
        agendamentos: true,
      },
    });

    return {
      tipo: 'profissionais',
      filtros,
      totalProfissionais: profissionais.length,
      dados: profissionais,
    };
  }

  static async gerarRelatorioProntuarios(periodo: Periodo, filtros: FiltrosProntuarios = {}) {
    const { inicio, fim } = periodo;
    const { profissionalId, pacienteId, tipo } = filtros;

    const where: any = {
      dataCriacao: {
        gte: new Date(inicio),
        lte: new Date(fim),
      },
    };

    if (profissionalId) where.profissionalId = profissionalId;
    if (pacienteId) where.pacienteId = pacienteId;
    if (tipo) where.tipo = tipo;

    const prontuarios = await prisma.prontuario.findMany({
      where,
      include: {
        paciente: true,
        profissional: true,
      },
    });

    return {
      tipo: 'prontuarios',
      periodo,
      filtros,
      totalProntuarios: prontuarios.length,
      dados: prontuarios,
    };
  }

  static async gerarRelatorioCustomizado(configuracao: ConfiguracaoRelatorio) {
    // Implementação básica - pode ser expandida conforme necessário
    return {
      tipo: 'customizado',
      configuracao,
      dados: [],
      message: 'Relatório customizado gerado com sucesso',
    };
  }

  // Templates de relatório
  static async getTemplates() {
    return await prisma.relatorioEspecialidade.findMany({
      where: { ativo: true },
    });
  }

  static async getTemplate(id: string) {
    return await prisma.relatorioEspecialidade.findUnique({
      where: { id },
    });
  }

  static async createTemplate(data: any) {
    return await prisma.relatorioEspecialidade.create({
      data: {
        ...data,
        tenantId: data.tenantId,
      },
    });
  }

  static async updateTemplate(id: string, data: any) {
    return await prisma.relatorioEspecialidade.update({
      where: { id },
      data,
    });
  }

  static async deleteTemplate(id: string) {
    return await prisma.relatorioEspecialidade.delete({
      where: { id },
    });
  }

  // Relatórios agendados
  static async agendarRelatorio(data: any): Promise<RelatorioAgendado> {
    // Implementação básica - pode ser expandida com sistema de agendamento
    return {
      id: 'agendamento-' + Date.now(),
      ...data,
      status: 'ativo',
      createdAt: new Date(),
    };
  }

  static async getRelatoriosAgendados(): Promise<RelatorioAgendado[]> {
    // Implementação básica - pode ser expandida com banco de dados
    return [];
  }

  static async updateRelatorioAgendado(id: string, data: any): Promise<RelatorioAgendado> {
    // Implementação básica
    return {
      id,
      ...data,
      status: 'ativo',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static async deleteRelatorioAgendado(id: string): Promise<{ success: boolean }> {
    // Implementação básica
    return { success: true };
  }

  // Histórico de relatórios
  static async getHistorico(filtros: FiltrosHistorico = {}) {
    const { tipo, dataInicio, dataFim, status } = filtros;

    const where: any = {};
    if (tipo) where.tipo = tipo;
    if (status) where.status = status;
    if (dataInicio || dataFim) {
      where.createdAt = {};
      if (dataInicio) where.createdAt.gte = new Date(dataInicio);
      if (dataFim) where.createdAt.lte = new Date(dataFim);
    }

    return await prisma.relatorioEspecialidade.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
} 
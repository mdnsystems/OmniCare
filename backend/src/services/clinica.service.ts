import prisma from './prisma';
import { TipoClinica } from '../types/enums';

export class ClinicaService {
  static async criarClinica(dados: {
    tenantId: string;
    nome: string;
    tipo: TipoClinica;
    logo?: string;
    corPrimaria?: string;
    corSecundaria?: string;
    tema?: string;
  }) {
    // Verificar se o tenant já existe
    const clinicaExistente = await prisma.clinica.findUnique({
      where: { tenantId: dados.tenantId }
    });

    if (clinicaExistente) {
      throw new Error('Clínica com este Tenant ID já existe.');
    }

    return await prisma.clinica.create({
      data: {
        tenantId: dados.tenantId,
        nome: dados.nome,
        tipo: dados.tipo,
        logo: dados.logo,
        corPrimaria: dados.corPrimaria || '#2563eb',
        corSecundaria: dados.corSecundaria || '#1e40af',
        tema: dados.tema || 'light',
        ativo: true
      }
    });
  }

  static async buscarClinicaPorTenantId(tenantId: string) {
    const clinica = await prisma.clinica.findUnique({
      where: { tenantId },
      include: {
        _count: {
          select: {
            usuarios: true,
            Profissional: true,
            Paciente: true,
            Agendamento: true
          }
        }
      }
    });

    if (!clinica) {
      throw new Error('Clínica não encontrada.');
    }

    return clinica;
  }

  static async listarClinicas() {
    return await prisma.clinica.findMany({
      include: {
        _count: {
          select: {
            usuarios: true,
            Profissional: true,
            Paciente: true,
            Agendamento: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async atualizarClinica(tenantId: string, dados: {
    nome?: string;
    tipo?: TipoClinica;
    logo?: string;
    corPrimaria?: string;
    corSecundaria?: string;
    tema?: string;
    ativo?: boolean;
  }) {
    const clinica = await prisma.clinica.findUnique({
      where: { tenantId }
    });

    if (!clinica) {
      throw new Error('Clínica não encontrada.');
    }

    return await prisma.clinica.update({
      where: { tenantId },
      data: dados
    });
  }

  static async desativarClinica(tenantId: string) {
    const clinica = await prisma.clinica.findUnique({
      where: { tenantId }
    });

    if (!clinica) {
      throw new Error('Clínica não encontrada.');
    }

    return await prisma.clinica.update({
      where: { tenantId },
      data: { ativo: false }
    });
  }

  static async ativarClinica(tenantId: string) {
    const clinica = await prisma.clinica.findUnique({
      where: { tenantId }
    });

    if (!clinica) {
      throw new Error('Clínica não encontrada.');
    }

    return await prisma.clinica.update({
      where: { tenantId },
      data: { ativo: true }
    });
  }

  static async obterEstatisticasClinica(tenantId: string) {
    const clinica = await prisma.clinica.findUnique({
      where: { tenantId },
      include: {
        _count: {
          select: {
            usuarios: true,
            Profissional: true,
            Paciente: true,
            Agendamento: true,
            Prontuario: true,
            Anamnese: true,
            Exame: true
          }
        }
      }
    });

    if (!clinica) {
      throw new Error('Clínica não encontrada.');
    }

    // Estatísticas de agendamentos por status
    const agendamentosPorStatus = await prisma.agendamento.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: { status: true }
    });

    // Estatísticas de agendamentos por tipo
    const agendamentosPorTipo = await prisma.agendamento.groupBy({
      by: ['tipo'],
      where: { tenantId },
      _count: { tipo: true }
    });

    // Agendamentos do mês atual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const agendamentosMes = await prisma.agendamento.count({
      where: {
        tenantId,
        data: {
          gte: inicioMes
        }
      }
    });

    return {
      clinica: {
        id: clinica.id,
        nome: clinica.nome,
        tipo: clinica.tipo,
        ativo: clinica.ativo,
        createdAt: clinica.createdAt
      },
      estatisticas: {
        totalUsuarios: clinica._count.usuarios,
        totalProfissionais: clinica._count.Profissional,
        totalPacientes: clinica._count.Paciente,
        totalAgendamentos: clinica._count.Agendamento,
        totalProntuarios: clinica._count.Prontuario,
        totalAnamneses: clinica._count.Anamnese,
        totalExames: clinica._count.Exame,
        agendamentosMes: agendamentosMes,
        agendamentosPorStatus,
        agendamentosPorTipo
      }
    };
  }

  static async configurarWhatsApp(tenantId: string, config: {
    zApiInstanceId: string;
    zApiToken: string;
    numeroWhatsApp: string;
    mensagensAtivas: any;
    horarioEnvioLembrete: string;
    diasAntecedenciaLembrete?: number;
  }) {
    const clinica = await prisma.clinica.findUnique({
      where: { tenantId }
    });

    if (!clinica) {
      throw new Error('Clínica não encontrada.');
    }

    return await prisma.clinicaWhatsAppConfig.upsert({
      where: { tenantId },
      update: {
        zApiInstanceId: config.zApiInstanceId,
        zApiToken: config.zApiToken,
        numeroWhatsApp: config.numeroWhatsApp,
        mensagensAtivas: config.mensagensAtivas,
        horarioEnvioLembrete: config.horarioEnvioLembrete,
        diasAntecedenciaLembrete: config.diasAntecedenciaLembrete || 1,
        ativo: true
      },
      create: {
        tenantId,
        zApiInstanceId: config.zApiInstanceId,
        zApiToken: config.zApiToken,
        numeroWhatsApp: config.numeroWhatsApp,
        mensagensAtivas: config.mensagensAtivas,
        horarioEnvioLembrete: config.horarioEnvioLembrete,
        diasAntecedenciaLembrete: config.diasAntecedenciaLembrete || 1,
        ativo: true
      }
    });
  }

  static async obterConfiguracaoWhatsApp(tenantId: string) {
    const config = await prisma.clinicaWhatsAppConfig.findUnique({
      where: { tenantId }
    });

    if (!config) {
      throw new Error('Configuração do WhatsApp não encontrada.');
    }

    return config;
  }
} 
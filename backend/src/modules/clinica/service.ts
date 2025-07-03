// =============================================================================
// SERVICE - MÓDULO DE CLÍNICAS
// =============================================================================
// 
// Lógica de negócio para gerenciamento de clínicas
// Implementa CRUD, configurações e validações
//
// =============================================================================

import { prisma } from '../../config/database';
import { TipoClinica } from '../../types/enums';
import { TenantUtils } from '../../utils/tenant';
import {
  CreateClinicaInput,
  UpdateClinicaInput,
  ClinicaFilters,
} from './validation';

export class ClinicaService {
  /**
   * Cria uma nova clínica
   */
  static async create(data: CreateClinicaInput, tenantId?: string) {
    const {
      nome,
      tipo,
      logo,
      corPrimaria,
      corSecundaria,
      tema,
    } = data;

    // Gera um tenantId único se não fornecido
    const finalTenantId = tenantId || await TenantUtils.generateUniqueTenantId(nome);

    // Cria a clínica
    const clinica = await prisma.clinica.create({
      data: {
        nome,
        tipo,
        logo,
        corPrimaria,
        corSecundaria,
        tema,
        ativo: true,
        tenantId: finalTenantId,
      },
    });

    return clinica;
  }

  /**
   * Busca todas as clínicas com filtros
   */
  static async findAll(filters: ClinicaFilters = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      tipo,
      ativo,
      sortBy = 'nome',
      sortOrder = 'asc',
    } = filters;

    const skip = (page - 1) * limit;

    // Constrói os filtros
    const where: any = {};

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tipo) {
      where.tipo = tipo;
    }

    if (ativo !== undefined) {
      where.ativo = ativo;
    }

    // Busca as clínicas
    const [clinicas, total] = await Promise.all([
      prisma.clinica.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              usuarios: true,
              Paciente: true,
              Profissional: true,
              Agendamento: true,
            },
          },
        },
      }),
      prisma.clinica.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      clinicas,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Busca uma clínica por ID
   */
  static async findById(id: string) {
    const clinica = await prisma.clinica.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            usuarios: true,
            Paciente: true,
            Profissional: true,
            Agendamento: true,
            Prontuario: true,
            Exame: true,
            Anamnese: true,
            Mensagem: true,
          },
        },
        especialidades: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            ativo: true,
          },
        },
      },
    });

    if (!clinica) {
      throw new Error('Clínica não encontrada');
    }

    return clinica;
  }

  /**
   * Busca uma clínica por tenant ID
   */
  static async findByTenantId(tenantId: string) {
    const clinica = await prisma.clinica.findUnique({
      where: { tenantId },
      include: {
        _count: {
          select: {
            usuarios: true,
            Paciente: true,
            Profissional: true,
            Agendamento: true,
            Prontuario: true,
            Exame: true,
            Anamnese: true,
            Mensagem: true,
          },
        },
        especialidades: {
          where: { ativo: true },
          select: {
            id: true,
            nome: true,
            descricao: true,
          },
        },
      },
    });

    if (!clinica) {
      throw new Error('Clínica não encontrada');
    }

    return clinica;
  }

  /**
   * Atualiza uma clínica
   */
  static async update(id: string, data: UpdateClinicaInput) {
    // Verifica se a clínica existe
    const clinicaExistente = await prisma.clinica.findUnique({
      where: { id },
    });

    if (!clinicaExistente) {
      throw new Error('Clínica não encontrada');
    }

    // Atualiza a clínica
    const clinica = await prisma.clinica.update({
      where: { id },
      data,
    });

    return clinica;
  }

  /**
   * Ativa/desativa uma clínica
   */
  static async toggleStatus(id: string) {
    // Verifica se a clínica existe
    const clinica = await prisma.clinica.findUnique({
      where: { id },
    });

    if (!clinica) {
      throw new Error('Clínica não encontrada');
    }

    // Atualiza o status
    const clinicaAtualizada = await prisma.clinica.update({
      where: { id },
      data: { ativo: !clinica.ativo },
    });

    return clinicaAtualizada;
  }

  /**
   * Remove uma clínica
   */
  static async delete(id: string) {
    // Verifica se a clínica existe
    const clinica = await prisma.clinica.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            usuarios: true,
            Paciente: true,
            Profissional: true,
            Agendamento: true,
          },
        },
      },
    });

    if (!clinica) {
      throw new Error('Clínica não encontrada');
    }

    // Verifica se há dados relacionados
    if (
      clinica._count.usuarios > 0 ||
      clinica._count.Paciente > 0 ||
      clinica._count.Profissional > 0 ||
      clinica._count.Agendamento > 0
    ) {
      throw new Error(
        'Não é possível remover a clínica pois há dados relacionados'
      );
    }

    // Remove a clínica
    await prisma.clinica.delete({
      where: { id },
    });

    return { message: 'Clínica removida com sucesso' };
  }

  /**
   * Busca estatísticas da clínica
   */
  static async getStats(tenantId: string) {
    const [
      totalUsuarios,
      totalPacientes,
      totalProfissionais,
      totalAgendamentos,
      agendamentosHoje,
      agendamentosSemana,
      agendamentosMes,
      prontuarios,
      exames,
      anamneses,
    ] = await Promise.all([
      prisma.usuario.count({ where: { tenantId } }),
      prisma.paciente.count({ where: { tenantId } }),
      prisma.profissional.count({ where: { tenantId } }),
      prisma.agendamento.count({ where: { tenantId } }),
      prisma.agendamento.count({
        where: {
          tenantId,
          data: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      prisma.agendamento.count({
        where: {
          tenantId,
          data: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      }),
      prisma.agendamento.count({
        where: {
          tenantId,
          data: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.prontuario.count({ where: { tenantId } }),
      prisma.exame.count({ where: { tenantId } }),
      prisma.anamnese.count({ where: { tenantId } }),
    ]);

    return {
      usuarios: totalUsuarios,
      pacientes: totalPacientes,
      profissionais: totalProfissionais,
      agendamentos: {
        total: totalAgendamentos,
        hoje: agendamentosHoje,
        semana: agendamentosSemana,
        mes: agendamentosMes,
      },
      documentos: {
        prontuarios,
        exames,
        anamneses,
      },
    };
  }

  /**
   * Busca configurações da clínica
   */
  static async getConfiguracoes(tenantId: string) {
    const clinica = await prisma.clinica.findUnique({
      where: { tenantId },
      select: {
        corPrimaria: true,
        corSecundaria: true,
        tema: true,
        logo: true,
      },
    });

    if (!clinica) {
      throw new Error('Clínica não encontrada');
    }

    return clinica;
  }

  /**
   * Atualiza configurações da clínica
   */
  static async updateConfiguracoes(
    tenantId: string,
    configuracoes: Record<string, any>
  ) {
    const clinica = await prisma.clinica.update({
      where: { tenantId },
      data: {
        corPrimaria: configuracoes.corPrimaria,
        corSecundaria: configuracoes.corSecundaria,
        tema: configuracoes.tema,
        logo: configuracoes.logo,
      },
    });

    return clinica;
  }
}

export default ClinicaService; 
import prisma from './prisma';
import { ProfissionalInput } from '../validators/profissional.validator';
import { ProfissionalStatus } from '../types/enums';

interface ProfissionalFilters {
  nome?: string;
  especialidadeId?: string;
  status?: ProfissionalStatus;
  email?: string;
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

export default {
  async create(data: ProfissionalInput & { tenantId: string }) {
    const profissionalData = {
      ...data,
      dataNascimento: new Date(data.dataNascimento),
      dataContratacao: new Date(data.dataContratacao),
      status: data.status as ProfissionalStatus
    };
    return prisma.profissional.create({ data: profissionalData });
  },

  async findAll(filters?: ProfissionalFilters, tenantId?: string): Promise<PaginatedResult<any>> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    // Construir where clause
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (filters?.nome) where.nome = { contains: filters.nome, mode: 'insensitive' };
    if (filters?.especialidadeId) where.especialidadeId = filters.especialidadeId;
    if (filters?.status) where.status = filters.status;
    if (filters?.email) where.email = { contains: filters.email, mode: 'insensitive' };

    // Buscar dados com paginação
    const [data, total] = await Promise.all([
      prisma.profissional.findMany({
        where,
        include: {
          especialidade: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.profissional.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
        nextPage: hasNext ? page + 1 : undefined,
        prevPage: hasPrev ? page - 1 : undefined,
      }
    };
  },

  async findAtivos(tenantId?: string) {
    return prisma.profissional.findMany({
      where: {
        ...(tenantId && { tenantId }),
        status: ProfissionalStatus.ATIVO
      },
      include: {
        especialidade: true
      }
    });
  },

  async findById(id: string, tenantId?: string) {
    return prisma.profissional.findUnique({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      include: {
        especialidade: true
      }
    });
  },

  async update(id: string, data: ProfissionalInput & { tenantId?: string }, tenantId?: string) {
    const profissionalData = {
      ...data,
      dataNascimento: new Date(data.dataNascimento),
      dataContratacao: new Date(data.dataContratacao),
      status: data.status as ProfissionalStatus
    };
    
    return prisma.profissional.update({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      data: profissionalData,
      include: {
        especialidade: true
      }
    });
  },

  async delete(id: string, tenantId?: string) {
    return prisma.profissional.delete({ 
      where: { 
        id,
        ...(tenantId && { tenantId })
      }
    });
  },

  async checkRelations(id: string, tenantId?: string) {
    const [pacientes, agendamentos, prontuarios, anamneses, faturamentos, usuarios] = await Promise.all([
      prisma.paciente.count({
        where: {
          profissionalId: id,
          ...(tenantId && { tenantId })
        }
      }),
      prisma.agendamento.count({
        where: {
          profissionalId: id,
          ...(tenantId && { tenantId })
        }
      }),
      prisma.prontuario.count({
        where: {
          profissionalId: id,
          ...(tenantId && { tenantId })
        }
      }),
      prisma.anamnese.count({
        where: {
          profissionalId: id,
          ...(tenantId && { tenantId })
        }
      }),
      prisma.faturamento.count({
        where: {
          profissionalId: id,
          ...(tenantId && { tenantId })
        }
      }),
      prisma.usuario.count({
        where: {
          profissionalId: id,
          ...(tenantId && { tenantId })
        }
      })
    ]);

    const totalRelations = pacientes + agendamentos + prontuarios + anamneses + faturamentos + usuarios;

    return {
      hasRelations: totalRelations > 0,
      relationsCount: totalRelations,
      relations: {
        pacientes,
        agendamentos,
        prontuarios,
        anamneses,
        faturamentos,
        usuarios
      }
    };
  }
}; 
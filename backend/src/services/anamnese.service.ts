import prisma from './prisma';
import { AnamneseInput } from '../validators/anamnese.validator';

export default {
  async create(data: AnamneseInput & { tenantId: string; templateId: string; campos: any }) {
    const anamneseData = {
      ...data,
      data: new Date(data.data),
      templateId: data.templateId,
      campos: data.campos
    };
    return prisma.anamnese.create({ data: anamneseData });
  },

  async findAll(tenantId?: string) {
    return prisma.anamnese.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: {
        paciente: true,
        profissional: true,
        prontuario: true
      }
    });
  },

  async findAllWithFilters(filters: any, tenantId?: string) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    // Construir where clause
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    
    if (filters?.pacienteNome) {
      where.paciente = {
        nome: { contains: filters.pacienteNome, mode: 'insensitive' }
      };
    }
    
    if (filters?.pacienteId) where.pacienteId = filters.pacienteId;
    if (filters?.profissionalId) where.profissionalId = filters.profissionalId;
    
    if (filters?.dataInicio || filters?.dataFim) {
      where.data = {};
      if (filters?.dataInicio) where.data.gte = new Date(filters.dataInicio);
      if (filters?.dataFim) {
        const dataFim = new Date(filters.dataFim);
        dataFim.setDate(dataFim.getDate() + 1);
        where.data.lt = dataFim;
      }
    }

    // Buscar dados com paginação
    const [data, total] = await Promise.all([
      prisma.anamnese.findMany({
        where,
        include: {
          paciente: true,
          profissional: {
            include: {
              especialidade: true
            }
          },
          prontuario: true
        },
        skip,
        take: limit,
        orderBy: { data: 'desc' }
      }),
      prisma.anamnese.count({ where })
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

  async findById(id: string, tenantId?: string) {
    return prisma.anamnese.findUnique({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      include: {
        paciente: true,
        profissional: true,
        prontuario: true
      }
    });
  },

  async update(id: string, data: AnamneseInput & { tenantId?: string; templateId?: string; campos?: any }, tenantId?: string) {
    const anamneseData = {
      ...data,
      data: new Date(data.data),
      ...(data.templateId && { templateId: data.templateId }),
      ...(data.campos && { campos: data.campos })
    };
    
    return prisma.anamnese.update({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      data: anamneseData,
      include: {
        paciente: true,
        profissional: true,
        prontuario: true
      }
    });
  },

  async delete(id: string, tenantId?: string) {
    return prisma.anamnese.delete({ 
      where: { 
        id,
        ...(tenantId && { tenantId })
      }
    });
  },

  async checkRelations(id: string, tenantId?: string) {
    // Primeiro, buscar a anamnese para obter o prontuarioId
    const anamnese = await prisma.anamnese.findUnique({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      select: { prontuarioId: true }
    });

    if (!anamnese) {
      return {
        hasRelations: false,
        relations: {
          prontuario: 0,
          exames: 0,
          faturamentos: 0
        }
      };
    }

    const [exames, faturamentos] = await Promise.all([
      prisma.exame.count({
        where: {
          prontuarioId: anamnese.prontuarioId,
          ...(tenantId && { tenantId })
        }
      }),
      prisma.faturamento.count({
        where: {
          prontuarioId: anamnese.prontuarioId,
          ...(tenantId && { tenantId })
        }
      })
    ]);

    return {
      hasRelations: exames > 0 || faturamentos > 0,
      relations: {
        prontuario: 1, // Sempre 1 pois anamnese tem relação 1:1 com prontuário
        exames,
        faturamentos
      }
    };
  }
}; 
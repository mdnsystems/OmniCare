import prisma from './prisma';
import { ExameInput } from '../validators/exame.validator';

export default {
  async create(data: ExameInput & { tenantId: string; arquivos: any }) {
    const exameData = {
      ...data,
      data: new Date(data.data),
      arquivos: data.arquivos
    };
    return prisma.exame.create({ data: exameData });
  },

  async findAll(tenantId?: string) {
    return prisma.exame.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: {
        prontuario: {
          include: {
            paciente: true,
            profissional: {
              include: {
                especialidade: true
              }
            }
          }
        }
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
      where.prontuario = {
        paciente: {
          nome: { contains: filters.pacienteNome, mode: 'insensitive' }
        }
      };
    }
    
    if (filters?.prontuarioId) where.prontuarioId = filters.prontuarioId;
    if (filters?.tipo) where.tipo = filters.tipo;
    
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
      prisma.exame.findMany({
        where,
        include: {
          prontuario: {
            include: {
              paciente: true,
              profissional: {
                include: {
                  especialidade: true
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { data: 'desc' }
      }),
      prisma.exame.count({ where })
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
    return prisma.exame.findUnique({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      include: {
        prontuario: true
      }
    });
  },

  async update(id: string, data: ExameInput & { tenantId?: string; arquivos?: any }, tenantId?: string) {
    const exameData = {
      ...data,
      data: new Date(data.data),
      ...(data.arquivos && { arquivos: data.arquivos })
    };
    
    return prisma.exame.update({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      data: exameData,
      include: {
        prontuario: true
      }
    });
  },

  async delete(id: string, tenantId?: string) {
    return prisma.exame.delete({ 
      where: { 
        id,
        ...(tenantId && { tenantId })
      }
    });
  }
}; 
import prisma from './prisma';
import { PacienteInput } from '../validators/paciente.validator';

interface PacienteFilters {
  nome?: string;
  cpf?: string;
  email?: string;
  profissionalId?: string;
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
  async create(data: PacienteInput & { tenantId: string }) {
    const pacienteData = {
      ...data,
      dataNascimento: new Date(data.dataNascimento),
      convenioValidade: data.convenioValidade ? new Date(data.convenioValidade) : null
    };
    
    const paciente = await prisma.paciente.create({ 
      data: pacienteData,
      include: {
        profissional: true
      }
    });

    // Retornar dados no formato correto (campos individuais)
    return {
      ...paciente,
      endereco: paciente.endereco,
      numero: paciente.numero,
      complemento: paciente.complemento,
      bairro: paciente.bairro,
      cidade: paciente.cidade,
      estado: paciente.estado,
      cep: paciente.cep,
      pais: paciente.pais,
      convenioNome: paciente.convenioNome,
      convenioNumero: paciente.convenioNumero,
      convenioPlano: paciente.convenioPlano,
      convenioValidade: paciente.convenioValidade,
    };
  },

  async findAll(filters?: PacienteFilters, tenantId?: string): Promise<PaginatedResult<any>> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    // Construir where clause
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (filters?.nome) where.nome = { contains: filters.nome, mode: 'insensitive' };
    if (filters?.cpf) where.cpf = { contains: filters.cpf };
    if (filters?.email) where.email = { contains: filters.email, mode: 'insensitive' };
    if (filters?.profissionalId) where.profissionalId = filters.profissionalId;

    // Buscar dados com paginação
    const [rawData, total] = await Promise.all([
      prisma.paciente.findMany({
        where,
        include: {
          profissional: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.paciente.count({ where })
    ]);

    // Retornar dados no formato correto (campos individuais)
    const data = rawData.map(paciente => ({
      ...paciente,
      endereco: paciente.endereco,
      numero: paciente.numero,
      complemento: paciente.complemento,
      bairro: paciente.bairro,
      cidade: paciente.cidade,
      estado: paciente.estado,
      cep: paciente.cep,
      pais: paciente.pais,
      convenioNome: paciente.convenioNome,
      convenioNumero: paciente.convenioNumero,
      convenioPlano: paciente.convenioPlano,
      convenioValidade: paciente.convenioValidade,
    }));

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
    const paciente = await prisma.paciente.findUnique({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      include: {
        profissional: true
      }
    });

    if (!paciente) return null;

    // Retornar dados no formato correto (campos individuais)
    return {
      ...paciente,
      endereco: paciente.endereco,
      numero: paciente.numero,
      complemento: paciente.complemento,
      bairro: paciente.bairro,
      cidade: paciente.cidade,
      estado: paciente.estado,
      cep: paciente.cep,
      pais: paciente.pais,
      convenioNome: paciente.convenioNome,
      convenioNumero: paciente.convenioNumero,
      convenioPlano: paciente.convenioPlano,
      convenioValidade: paciente.convenioValidade,
    };
  },

  async update(id: string, data: PacienteInput & { tenantId?: string }, tenantId?: string) {
    const pacienteData = {
      ...data,
      dataNascimento: new Date(data.dataNascimento),
      convenioValidade: data.convenioValidade ? new Date(data.convenioValidade) : null
    };
    
    const paciente = await prisma.paciente.update({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      data: pacienteData,
      include: {
        profissional: true
      }
    });

    // Retornar dados no formato correto (campos individuais)
    return {
      ...paciente,
      endereco: paciente.endereco,
      numero: paciente.numero,
      complemento: paciente.complemento,
      bairro: paciente.bairro,
      cidade: paciente.cidade,
      estado: paciente.estado,
      cep: paciente.cep,
      pais: paciente.pais,
      convenioNome: paciente.convenioNome,
      convenioNumero: paciente.convenioNumero,
      convenioPlano: paciente.convenioPlano,
      convenioValidade: paciente.convenioValidade,
    };
  },

  async delete(id: string, tenantId?: string) {
    // Verificar se existem registros relacionados antes de deletar
    const [agendamentos, prontuarios, anamneses, faturamentos] = await Promise.all([
      prisma.agendamento.findMany({
        where: { 
          pacienteId: id,
          ...(tenantId && { tenantId })
        }
      }),
      prisma.prontuario.findMany({
        where: { 
          pacienteId: id,
          ...(tenantId && { tenantId })
        }
      }),
      prisma.anamnese.findMany({
        where: { 
          pacienteId: id,
          ...(tenantId && { tenantId })
        }
      }),
      prisma.faturamento.findMany({
        where: { 
          pacienteId: id,
          ...(tenantId && { tenantId })
        }
      })
    ]);

    // Se existem registros relacionados, retornar erro
    if (agendamentos.length > 0 || prontuarios.length > 0 || anamneses.length > 0 || faturamentos.length > 0) {
      throw new Error(`Não é possível deletar o paciente. Existem registros relacionados:
        - Agendamentos: ${agendamentos.length}
        - Prontuários: ${prontuarios.length}
        - Anamneses: ${anamneses.length}
        - Faturamentos: ${faturamentos.length}
        
        Para deletar o paciente, primeiro remova todos os registros relacionados.`);
    }

    return prisma.paciente.delete({ 
      where: { 
        id,
        ...(tenantId && { tenantId })
      }
    });
  },

  async deleteWithCascade(id: string, tenantId?: string) {
    return prisma.$transaction(async (tx) => {
      // Deletar pagamentos relacionados aos faturamentos do paciente
      const faturamentos = await tx.faturamento.findMany({
        where: { 
          pacienteId: id,
          ...(tenantId && { tenantId })
        },
        select: { id: true }
      });

      if (faturamentos.length > 0) {
        await tx.pagamento.deleteMany({
          where: {
            faturamentoId: { in: faturamentos.map(f => f.id) },
            ...(tenantId && { tenantId })
          }
        });
      }

      // Deletar faturamentos do paciente
      await tx.faturamento.deleteMany({
        where: { 
          pacienteId: id,
          ...(tenantId && { tenantId })
        }
      });

      // Deletar exames relacionados aos prontuários do paciente
      const prontuarios = await tx.prontuario.findMany({
        where: { 
          pacienteId: id,
          ...(tenantId && { tenantId })
        },
        select: { id: true }
      });

      if (prontuarios.length > 0) {
        await tx.exame.deleteMany({
          where: {
            prontuarioId: { in: prontuarios.map(p => p.id) },
            ...(tenantId && { tenantId })
          }
        });
      }

      // Deletar anamneses do paciente
      await tx.anamnese.deleteMany({
        where: { 
          pacienteId: id,
          ...(tenantId && { tenantId })
        }
      });

      // Deletar prontuários do paciente
      await tx.prontuario.deleteMany({
        where: { 
          pacienteId: id,
          ...(tenantId && { tenantId })
        }
      });

      // Deletar agendamentos do paciente
      await tx.agendamento.deleteMany({
        where: { 
          pacienteId: id,
          ...(tenantId && { tenantId })
        }
      });

      // Finalmente, deletar o paciente
      return tx.paciente.delete({ 
        where: { 
          id,
          ...(tenantId && { tenantId })
        }
      });
    });
  },

  async checkRelations(id: string, tenantId?: string) {
    const [agendamentos, prontuarios, anamneses, faturamentos] = await Promise.all([
      prisma.agendamento.count({
        where: { 
          pacienteId: id,
          ...(tenantId && { tenantId })
        }
      }),
      prisma.prontuario.count({
        where: { 
          pacienteId: id,
          ...(tenantId && { tenantId })
        }
      }),
      prisma.anamnese.count({
        where: { 
          pacienteId: id,
          ...(tenantId && { tenantId })
        }
      }),
      prisma.faturamento.count({
        where: { 
          pacienteId: id,
          ...(tenantId && { tenantId })
        }
      })
    ]);

    return {
      hasRelations: agendamentos > 0 || prontuarios > 0 || anamneses > 0 || faturamentos > 0,
      relations: {
        agendamentos,
        prontuarios,
        anamneses,
        faturamentos
      }
    };
  }
}; 
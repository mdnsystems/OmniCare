import prisma from './prisma';
import { ProntuarioInput } from '../validators/prontuario.validator';
import { TipoProntuario } from '../types/enums';
import { PrismaClient } from '../../generated/prisma';

export default {
  async create(data: ProntuarioInput & { tenantId: string }) {
    const prontuarioData = {
      ...data,
      data: new Date(data.data),
      tipo: data.tipo as TipoProntuario
    };
    return prisma.prontuario.create({ data: prontuarioData });
  },

  async findAll(tenantId?: string) {
    return prisma.prontuario.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: {
        paciente: true,
        profissional: true,
        anamnese: true,
        exames: true
      }
    });
  },

  async findById(id: string, tenantId?: string) {
    return prisma.prontuario.findUnique({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      include: {
        paciente: true,
        profissional: true,
        anamnese: true,
        exames: true
      }
    });
  },

  async update(id: string, data: ProntuarioInput & { tenantId?: string }, tenantId?: string) {
    const prontuarioData = {
      ...data,
      data: new Date(data.data),
      tipo: data.tipo as TipoProntuario
    };
    
    return prisma.prontuario.update({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      data: prontuarioData,
      include: {
        paciente: true,
        profissional: true,
        anamnese: true,
        exames: true
      }
    });
  },

  async delete(id: string, tenantId?: string) {
    return prisma.prontuario.delete({ 
      where: { 
        id,
        ...(tenantId && { tenantId })
      }
    });
  }
}; 
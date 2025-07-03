import prisma from './prisma';
import { EspecialidadeInput } from '../validators/especialidade.validator';
import { TipoClinica } from '../types/enums';

export default {
  async create(data: EspecialidadeInput & { tenantId: string; tipoClinica: TipoClinica; configuracoes: any }) {
    const especialidadeData = {
      ...data,
      tipoClinica: data.tipoClinica,
      configuracoes: data.configuracoes
    };
    return prisma.especialidade.create({ data: especialidadeData });
  },

  async findAll(tenantId?: string) {
    return prisma.especialidade.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: {
        profissionais: true
      }
    });
  },

  async findById(id: string, tenantId?: string) {
    return prisma.especialidade.findUnique({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      include: {
        profissionais: true
      }
    });
  },

  async update(id: string, data: EspecialidadeInput & { tenantId?: string; tipoClinica?: TipoClinica; configuracoes?: any }, tenantId?: string) {
    const especialidadeData = {
      ...data,
      ...(data.tipoClinica && { tipoClinica: data.tipoClinica }),
      ...(data.configuracoes && { configuracoes: data.configuracoes })
    };
    
    return prisma.especialidade.update({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      data: especialidadeData,
      include: {
        profissionais: true
      }
    });
  },

  async delete(id: string, tenantId?: string) {
    // Verificar se há profissionais usando esta especialidade
    const especialidadeComProfissionais = await prisma.especialidade.findUnique({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      include: {
        profissionais: true
      }
    });

    if (!especialidadeComProfissionais) {
      throw new Error('Especialidade não encontrada');
    }

    if (especialidadeComProfissionais.profissionais.length > 0) {
      throw new Error(`Não é possível excluir esta especialidade. Ela está sendo usada por ${especialidadeComProfissionais.profissionais.length} profissional(is).`);
    }

    return prisma.especialidade.delete({ 
      where: { 
        id,
        ...(tenantId && { tenantId })
      }
    });
  }
}; 
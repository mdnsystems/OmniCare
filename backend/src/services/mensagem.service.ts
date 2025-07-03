import prisma from './prisma';
import { MensagemInput } from '../validators/mensagem.validator';
import { RoleUsuario } from '../types/enums';

export default {
  async create(data: MensagemInput & { tenantId: string }) {
    const { arquivos, ...mensagemData } = data;
    
    const createData = {
      ...mensagemData,
      timestamp: new Date(data.timestamp || new Date()),
      senderRole: data.senderRole as RoleUsuario,
      // Se houver arquivos, criar a relação
      ...(arquivos && arquivos.length > 0 && {
        arquivos: {
          create: arquivos.map(arquivoId => ({
            arquivoId
          }))
        }
      })
    };

    return prisma.mensagem.create({ 
      data: createData,
      include: {
        sender: true,
        arquivos: {
          include: {
            arquivo: true
          }
        }
      }
    });
  },

  async findAll(tenantId?: string) {
    return prisma.mensagem.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: {
        sender: true,
        arquivos: {
          include: {
            arquivo: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
  },

  async findById(id: string, tenantId?: string) {
    return prisma.mensagem.findUnique({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      include: {
        sender: true,
        arquivos: {
          include: {
            arquivo: true
          }
        }
      }
    });
  },

  async update(id: string, data: Partial<MensagemInput>, tenantId?: string) {
    const { arquivos, ...updateData } = data;
    
    const mensagemData: any = {
      ...updateData,
      ...(data.timestamp && { timestamp: new Date(data.timestamp) }),
      ...(data.senderRole && { senderRole: data.senderRole as RoleUsuario })
    };

    // Se houver arquivos, atualizar a relação
    if (arquivos) {
      // Primeiro deletar arquivos existentes
      await prisma.arquivoMensagem.deleteMany({
        where: { mensagemId: id }
      });
      
      // Depois criar os novos
      if (arquivos.length > 0) {
        mensagemData.arquivos = {
          create: arquivos.map(arquivoId => ({
            arquivoId
          }))
        };
      }
    }

    return prisma.mensagem.update({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      data: mensagemData,
      include: {
        sender: true,
        arquivos: {
          include: {
            arquivo: true
          }
        }
      }
    });
  },

  async delete(id: string, tenantId?: string) {
    return prisma.mensagem.delete({
      where: { 
        id,
        ...(tenantId && { tenantId })
      }
    });
  },

  async findBySender(senderId: string, tenantId?: string) {
    return prisma.mensagem.findMany({
      where: {
        senderId,
        ...(tenantId && { tenantId })
      },
      include: {
        sender: true,
        arquivos: {
          include: {
            arquivo: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
  },

  async findByTenant(tenantId: string) {
    return prisma.mensagem.findMany({
      where: { tenantId },
      include: {
        sender: true,
        arquivos: {
          include: {
            arquivo: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
  }
}; 
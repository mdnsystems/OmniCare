import { FormaPagamento } from '../../generated/prisma';
import prisma from './prisma';

export default class PagamentoService {
  static async create(data: any) {
    const createData: any = { ...data };
    if (data.valor) createData.valor = Number(data.valor);
    if (data.dataPagamento) createData.dataPagamento = new Date(data.dataPagamento);

    return await prisma.pagamento.create({
      data: createData,
      include: {
        faturamento: {
          include: {
            paciente: true,
            profissional: true,
          },
        },
      },
    });
  }

  static async findAll(filters: any = {}) {
    const where: any = {};

    if (filters.tenantId) {
      where.tenantId = filters.tenantId;
    }

    if (filters.faturamentoId) {
      where.faturamentoId = filters.faturamentoId;
    }

    if (filters.dataInicio && filters.dataFim) {
      where.dataPagamento = {
        gte: new Date(filters.dataInicio),
        lte: new Date(filters.dataFim),
      };
    }

    if (filters.formaPagamento) {
      where.formaPagamento = filters.formaPagamento as FormaPagamento;
    }

    return await prisma.pagamento.findMany({
      where,
      orderBy: { dataPagamento: 'desc' },
      include: {
        faturamento: {
          include: {
            paciente: true,
            profissional: true,
          },
        },
      },
    });
  }

  static async findById(id: string) {
    return await prisma.pagamento.findUnique({
      where: { id },
      include: {
        faturamento: {
          include: {
            paciente: true,
            profissional: true,
          },
        },
      },
    });
  }

  static async update(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.valor) updateData.valor = Number(data.valor);
    if (data.dataPagamento) updateData.dataPagamento = new Date(data.dataPagamento);

    return await prisma.pagamento.update({
      where: { id },
      data: updateData,
      include: {
        faturamento: {
          include: {
            paciente: true,
            profissional: true,
          },
        },
      },
    });
  }

  static async delete(id: string) {
    return await prisma.pagamento.delete({
      where: { id },
    });
  }

  static async findByFaturamento(faturamentoId: string) {
    return await prisma.pagamento.findMany({
      where: { faturamentoId },
      orderBy: { dataPagamento: 'desc' },
      include: {
        faturamento: {
          include: {
            paciente: true,
            profissional: true,
          },
        },
      },
    });
  }

  static async findByPeriodo(dataInicio: string, dataFim: string) {
    return await prisma.pagamento.findMany({
      where: {
        dataPagamento: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        },
      },
      orderBy: { dataPagamento: 'desc' },
      include: {
        faturamento: {
          include: {
            paciente: true,
            profissional: true,
          },
        },
      },
    });
  }

  static async findByFormaPagamento(formaPagamento: FormaPagamento) {
    return await prisma.pagamento.findMany({
      where: { formaPagamento },
      orderBy: { dataPagamento: 'desc' },
      include: {
        faturamento: {
          include: {
            paciente: true,
            profissional: true,
          },
        },
      },
    });
  }

  static async registrarPagamento(data: {
    tenantId: string;
    faturamentoId: string;
    valor: number;
    formaPagamento: FormaPagamento;
    comprovante?: string;
    observacoes?: string;
  }) {
    // Usar transação para garantir consistência
    return await prisma.$transaction(async (tx) => {
      // Criar o pagamento
      const pagamento = await tx.pagamento.create({
        data: {
          tenantId: data.tenantId,
          faturamentoId: data.faturamentoId,
          valor: Number(data.valor),
          formaPagamento: data.formaPagamento,
          dataPagamento: new Date(),
          comprovante: data.comprovante,
          observacoes: data.observacoes,
        },
        include: {
          faturamento: {
            include: {
              paciente: true,
              profissional: true,
            },
          },
        },
      });

      // Atualizar o status do faturamento
      const faturamento = await tx.faturamento.findUnique({
        where: { id: data.faturamentoId },
      });

      if (faturamento) {
        const valorPago = Number(faturamento.valorPago || 0) + Number(data.valor);
        const novoStatus = valorPago >= Number(faturamento.valorFinal) ? 'PAGO' : 'PARCIAL';

        await tx.faturamento.update({
          where: { id: data.faturamentoId },
          data: {
            valorPago,
            status: novoStatus,
            dataPagamento: novoStatus === 'PAGO' ? new Date() : faturamento.dataPagamento,
          },
        });
      }

      return pagamento;
    });
  }

  static async estornarPagamento(id: string, motivo: string, tenantId: string) {
    // Usar transação para garantir consistência
    return await prisma.$transaction(async (tx) => {
      const pagamento = await tx.pagamento.findUnique({
        where: { id },
        include: {
          faturamento: true,
        },
      });

      if (!pagamento) {
        throw new Error('Pagamento não encontrado');
      }

      // Criar registro de estorno
      const estorno = await tx.pagamento.create({
        data: {
          tenantId,
          faturamentoId: pagamento.faturamentoId,
          valor: -Number(pagamento.valor), // Valor negativo para estorno
          formaPagamento: pagamento.formaPagamento,
          dataPagamento: new Date(),
          observacoes: `Estorno: ${motivo}`,
        },
        include: {
          faturamento: {
            include: {
              paciente: true,
              profissional: true,
            },
          },
        },
      });

      // Atualizar o status do faturamento
      const faturamento = await tx.faturamento.findUnique({
        where: { id: pagamento.faturamentoId },
      });

      if (faturamento) {
        const valorPago = Number(faturamento.valorPago || 0) - Number(pagamento.valor);
        const novoStatus = valorPago <= 0 ? 'PENDENTE' : 'PARCIAL';

        await tx.faturamento.update({
          where: { id: pagamento.faturamentoId },
          data: {
            valorPago: Math.max(0, valorPago),
            status: novoStatus,
            dataPagamento: novoStatus === 'PENDENTE' ? null : faturamento.dataPagamento,
          },
        });
      }

      return estorno;
    });
  }
} 
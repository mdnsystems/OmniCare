import prisma from './prisma';
import { StatusFaturamento } from '../types/statusFaturamento.enum';

export default class FaturamentoService {
  static async create(data: any) {
    const createData: any = { ...data };
    if (data.valor) createData.valor = Number(data.valor);
    if (data.desconto !== undefined) createData.desconto = Number(data.desconto);
    if (data.valorFinal) createData.valorFinal = Number(data.valorFinal);
    if (data.camposPersonalizados) createData.camposPersonalizados = data.camposPersonalizados;

    return await prisma.faturamento.create({
      data: createData,
      include: {
        paciente: true,
        profissional: true,
        agendamento: true,
        prontuario: true,
      },
    });
  }

  static async findAll(filters: any = {}) {
    const { page = 1, limit = 10, pacienteId, profissionalId, tipo, status, dataInicio, dataFim, dataVencimentoInicio, dataVencimentoFim } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (pacienteId) where.pacienteId = pacienteId;
    if (profissionalId) where.profissionalId = profissionalId;
    if (tipo) where.tipo = tipo;
    if (status) where.status = status;
    if (dataInicio || dataFim) {
      where.dataCriacao = {};
      if (dataInicio) where.dataCriacao.gte = new Date(dataInicio);
      if (dataFim) where.dataCriacao.lte = new Date(dataFim);
    }
    if (dataVencimentoInicio || dataVencimentoFim) {
      where.dataVencimento = {};
      if (dataVencimentoInicio) where.dataVencimento.gte = new Date(dataVencimentoInicio);
      if (dataVencimentoFim) where.dataVencimento.lte = new Date(dataVencimentoFim);
    }

    const [faturamentos, total] = await Promise.all([
      prisma.faturamento.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dataVencimento: 'desc' },
        include: {
          paciente: true,
          profissional: true,
          agendamento: true,
          prontuario: true,
        },
      }),
      prisma.faturamento.count({ where }),
    ]);

    return {
      data: faturamentos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id: string) {
    return await prisma.faturamento.findUnique({
      where: { id },
      include: {
        paciente: true,
        profissional: true,
        agendamento: true,
        prontuario: true,
      },
    });
  }

  static async update(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.valor) updateData.valor = Number(data.valor);
    if (data.desconto !== undefined) updateData.desconto = Number(data.desconto);
    if (data.valorFinal) updateData.valorFinal = Number(data.valorFinal);
    if (data.camposPersonalizados) updateData.camposPersonalizados = data.camposPersonalizados;

    return await prisma.faturamento.update({
      where: { id },
      data: updateData,
      include: {
        paciente: true,
        profissional: true,
        agendamento: true,
        prontuario: true,
      },
    });
  }

  static async delete(id: string) {
    return await prisma.faturamento.delete({
      where: { id },
    });
  }

  static async findByPaciente(pacienteId: string) {
    return await prisma.faturamento.findMany({
      where: { pacienteId },
      orderBy: { dataVencimento: 'desc' },
      include: {
        paciente: true,
        profissional: true,
        agendamento: true,
        prontuario: true,
      },
    });
  }

  static async findByProfissional(profissionalId: string) {
    return await prisma.faturamento.findMany({
      where: { profissionalId },
      orderBy: { dataVencimento: 'desc' },
      include: {
        paciente: true,
        profissional: true,
        agendamento: true,
        prontuario: true,
      },
    });
  }

  static async findByStatus(status: string) {
    return await prisma.faturamento.findMany({
      where: { status: status as any },
      orderBy: { dataVencimento: 'desc' },
      include: {
        paciente: true,
        profissional: true,
        agendamento: true,
        prontuario: true,
      },
    });
  }

  static async findVencidos() {
    const hoje = new Date();
    return await prisma.faturamento.findMany({
      where: {
        dataVencimento: {
          lt: hoje,
        },
        status: {
          not: 'PAGO' as any,
        },
      },
      orderBy: { dataVencimento: 'asc' },
      include: {
        paciente: true,
        profissional: true,
        agendamento: true,
        prontuario: true,
      },
    });
  }

  static async findAVencer(dias: number = 7) {
    const hoje = new Date();
    const dataLimite = new Date(hoje.getTime() + dias * 24 * 60 * 60 * 1000);

    return await prisma.faturamento.findMany({
      where: {
        dataVencimento: {
          gte: hoje,
          lte: dataLimite,
        },
        status: {
          not: 'PAGO' as any,
        },
      },
      orderBy: { dataVencimento: 'asc' },
      include: {
        paciente: true,
        profissional: true,
        agendamento: true,
        prontuario: true,
      },
    });
  }

  static async exportar(filtros: any = {}, formato: string = 'xlsx') {
    // Implementação básica - pode ser expandida com bibliotecas como xlsx
    const faturamentos = await this.findAll({ ...filtros, limit: 1000 });
    
    // Mock de exportação
    const dados = faturamentos.data.map(fat => ({
      id: fat.id,
      paciente: fat.paciente?.nome,
      profissional: fat.profissional?.nome,
      tipo: fat.tipo,
      valor: fat.valor,
      desconto: fat.desconto,
      valorFinal: fat.valorFinal,
      status: fat.status,
      dataVencimento: fat.dataVencimento,
      dataPagamento: fat.dataPagamento,
    }));

    return Buffer.from(JSON.stringify(dados));
  }

  static async importar(file: any) {
    // Implementação básica - pode ser expandida com validação e processamento
    const dados = JSON.parse(file.buffer.toString());
    
    const resultados = {
      sucessos: 0,
      erros: [] as string[],
    };

    for (const item of dados) {
      try {
        await this.create(item);
        resultados.sucessos++;
      } catch (error) {
        resultados.erros.push(`Erro ao importar item ${item.id}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    return resultados;
  }
} 
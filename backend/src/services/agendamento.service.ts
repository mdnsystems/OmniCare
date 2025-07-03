import prisma from './prisma';
import { AgendamentoInput } from '../validators/agendamento.validator';
import { TipoAgendamento, StatusAgendamento } from '../types/enums';

export default {
  async create(data: AgendamentoInput & { tenantId: string }) {
    const agendamentoData = {
      ...data,
      data: new Date(data.data),
      tipo: data.tipo as TipoAgendamento,
      status: data.status as StatusAgendamento
    };
    return prisma.agendamento.create({ data: agendamentoData });
  },

  async findAll(tenantId?: string) {
    return prisma.agendamento.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: {
        paciente: true,
        profissional: true
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
    if (filters?.tipo) where.tipo = filters.tipo;
    if (filters?.status) where.status = filters.status;
    
    if (filters?.data) {
      const dataInicio = new Date(filters.data);
      const dataFim = new Date(filters.data);
      dataFim.setDate(dataFim.getDate() + 1);
      where.data = {
        gte: dataInicio,
        lt: dataFim
      };
    } else if (filters?.dataInicio || filters?.dataFim) {
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
      prisma.agendamento.findMany({
        where,
        include: {
          paciente: true,
          profissional: {
            include: {
              especialidade: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { data: 'asc' }
      }),
      prisma.agendamento.count({ where })
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
    return prisma.agendamento.findUnique({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      include: {
        paciente: true,
        profissional: true
      }
    });
  },

  async update(id: string, data: AgendamentoInput & { tenantId?: string }, tenantId?: string) {
    const agendamentoData = {
      ...data,
      data: new Date(data.data),
      tipo: data.tipo as TipoAgendamento,
      status: data.status as StatusAgendamento
    };
    
    return prisma.agendamento.update({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      data: agendamentoData,
      include: {
        paciente: true,
        profissional: true
      }
    });
  },

  async delete(id: string, tenantId?: string) {
    return prisma.agendamento.delete({ 
      where: { 
        id,
        ...(tenantId && { tenantId })
      }
    });
  },

  // Métodos específicos de agendamento
  async confirmar(id: string, tenantId?: string) {
    return prisma.agendamento.update({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      data: { status: StatusAgendamento.CONFIRMADO },
      include: {
        paciente: true,
        profissional: true
      }
    });
  },

  async cancelar(id: string, motivo: string, tenantId?: string) {
    return prisma.agendamento.update({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      data: { 
        status: StatusAgendamento.CANCELADO,
        observacoes: motivo
      },
      include: {
        paciente: true,
        profissional: true
      }
    });
  },

  async remarcar(id: string, novaData: string, novaHoraInicio: string, novaHoraFim: string, tenantId?: string) {
    return prisma.agendamento.update({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      data: { 
        data: new Date(novaData),
        horaInicio: novaHoraInicio,
        horaFim: novaHoraFim
      },
      include: {
        paciente: true,
        profissional: true
      }
    });
  },

  async realizar(id: string, tenantId?: string) {
    return prisma.agendamento.update({
      where: { 
        id,
        ...(tenantId && { tenantId })
      },
      data: { status: StatusAgendamento.REALIZADO },
      include: {
        paciente: true,
        profissional: true
      }
    });
  },

  async findByData(data: string, tenantId?: string) {
    const dataInicio = new Date(data);
    const dataFim = new Date(data);
    dataFim.setDate(dataFim.getDate() + 1);

    return prisma.agendamento.findMany({
      where: {
        tenantId: tenantId || undefined,
        data: {
          gte: dataInicio,
          lt: dataFim
        }
      },
      include: {
        paciente: true,
        profissional: true
      }
    });
  },

  async findByProfissional(profissionalId: string, data?: string, tenantId?: string) {
    const where: any = {
      profissionalId,
      ...(tenantId && { tenantId })
    };

    if (data) {
      const dataInicio = new Date(data);
      const dataFim = new Date(data);
      dataFim.setDate(dataFim.getDate() + 1);
      where.data = {
        gte: dataInicio,
        lt: dataFim
      };
    }

    return prisma.agendamento.findMany({
      where,
      include: {
        paciente: true,
        profissional: true
      }
    });
  },

  async findByPaciente(pacienteId: string, tenantId?: string) {
    return prisma.agendamento.findMany({
      where: {
        pacienteId,
        ...(tenantId && { tenantId })
      },
      include: {
        paciente: true,
        profissional: true
      }
    });
  },

  async findHoje(tenantId?: string) {
    const hoje = new Date();
    const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);

    return prisma.agendamento.findMany({
      where: {
        tenantId: tenantId || undefined,
        data: {
          gte: dataInicio,
          lt: dataFim
        }
      },
      include: {
        paciente: true,
        profissional: true
      }
    });
  },

  async findSemana(dataInicio?: string, tenantId?: string) {
    const inicio = dataInicio ? new Date(dataInicio) : new Date();
    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + 7);

    return prisma.agendamento.findMany({
      where: {
        tenantId: tenantId || undefined,
        data: {
          gte: inicio,
          lt: fim
        }
      },
      include: {
        paciente: true,
        profissional: true
      }
    });
  },

  async findMes(ano?: number, mes?: number, tenantId?: string) {
    const dataAtual = new Date();
    const anoFiltro = ano || dataAtual.getFullYear();
    const mesFiltro = mes !== undefined ? mes : dataAtual.getMonth();
    
    const inicio = new Date(anoFiltro, mesFiltro, 1);
    const fim = new Date(anoFiltro, mesFiltro + 1, 0);

    return prisma.agendamento.findMany({
      where: {
        tenantId: tenantId || undefined,
        data: {
          gte: inicio,
          lte: fim
        }
      },
      include: {
        paciente: true,
        profissional: true
      }
    });
  },

  async confirmarViaLink(token: string) {
    // Implementar lógica de confirmação via link
    // Por enquanto, retorna null
    return null;
  },

  async cancelarViaLink(token: string) {
    // Implementar lógica de cancelamento via link
    // Por enquanto, retorna null
    return null;
  },

  async verificarDisponibilidade(profissionalId: string, data: string, horaInicio: string, horaFim: string, excludeId?: string, tenantId?: string) {
    const dataAgendamento = new Date(data);
    const dataInicio = new Date(data);
    const dataFim = new Date(data);
    dataFim.setDate(dataFim.getDate() + 1);

    const agendamentosExistentes = await prisma.agendamento.findMany({
      where: {
        profissionalId,
        tenantId: tenantId || undefined,
        data: {
          gte: dataInicio,
          lt: dataFim
        },
        ...(excludeId && { id: { not: excludeId } })
      }
    });

    // Verificar sobreposição de horários
    const conflitos = agendamentosExistentes.filter(agendamento => {
      const inicioExistente = agendamento.horaInicio;
      const fimExistente = agendamento.horaFim;
      
      return (
        (horaInicio >= inicioExistente && horaInicio < fimExistente) ||
        (horaFim > inicioExistente && horaFim <= fimExistente) ||
        (horaInicio <= inicioExistente && horaFim >= fimExistente)
      );
    });

    return {
      disponivel: conflitos.length === 0,
      conflitos: conflitos
    };
  },

  async getHorariosDisponiveis(profissionalId: string, data: string, tenantId?: string) {
    const dataAgendamento = new Date(data);
    const dataInicio = new Date(data);
    const dataFim = new Date(data);
    dataFim.setDate(dataFim.getDate() + 1);

    const agendamentosExistentes = await prisma.agendamento.findMany({
      where: {
        profissionalId,
        tenantId: tenantId || undefined,
        data: {
          gte: dataInicio,
          lt: dataFim
        }
      }
    });

    // Horários padrão (8h às 18h)
    const horariosDisponiveis = [];
    const horariosOcupados = agendamentosExistentes.map(a => ({
      inicio: a.horaInicio,
      fim: a.horaFim
    }));

    // Gerar horários de 30 em 30 minutos
    for (let hora = 8; hora < 18; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const horarioInicio = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        const horarioFim = minuto === 30 ? 
          `${(hora + 1).toString().padStart(2, '0')}:00` : 
          `${hora.toString().padStart(2, '0')}:30`;

        const conflito = horariosOcupados.some(ocupado => 
          (horarioInicio >= ocupado.inicio && horarioInicio < ocupado.fim) ||
          (horarioFim > ocupado.inicio && horarioFim <= ocupado.fim)
        );

        if (!conflito) {
          horariosDisponiveis.push({
            inicio: horarioInicio,
            fim: horarioFim
          });
        }
      }
    }

    return horariosDisponiveis;
  },

  async getEstatisticas(periodo?: { inicio: string; fim: string }, tenantId?: string) {
    const where: any = {
      ...(tenantId && { tenantId })
    };

    if (periodo) {
      where.data = {
        gte: new Date(periodo.inicio),
        lte: new Date(periodo.fim)
      };
    }

    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: {
        paciente: true,
        profissional: true
      }
    });

    const total = agendamentos.length;
    const realizados = agendamentos.filter(a => a.status === StatusAgendamento.REALIZADO).length;
    const cancelados = agendamentos.filter(a => a.status === StatusAgendamento.CANCELADO).length;
    const confirmados = agendamentos.filter(a => a.status === StatusAgendamento.CONFIRMADO).length;
    const pendentes = agendamentos.filter(a => a.status === StatusAgendamento.PENDENTE).length;

    const porTipo = {
      CONSULTA: agendamentos.filter(a => a.tipo === TipoAgendamento.CONSULTA).length,
      RETORNO: agendamentos.filter(a => a.tipo === TipoAgendamento.RETORNO).length,
      EXAME: agendamentos.filter(a => a.tipo === TipoAgendamento.EXAME).length,
      PROCEDIMENTO: agendamentos.filter(a => a.tipo === TipoAgendamento.PROCEDIMENTO).length
    };

    const porProfissional = await prisma.agendamento.groupBy({
      by: ['profissionalId'],
      where,
      _count: {
        id: true
      }
    });

    return {
      total,
      realizados,
      cancelados,
      confirmados,
      pendentes,
      taxaSucesso: total > 0 ? (realizados / total) * 100 : 0,
      taxaCancelamento: total > 0 ? (cancelados / total) * 100 : 0,
      porTipo,
      porProfissional: porProfissional.length
    };
  },

  async enviarLembrete(id: string, tenantId?: string) {
    // Implementar lógica de envio de lembrete
    // Por enquanto, apenas retorna sucesso
    return { message: 'Lembrete enviado com sucesso' };
  },

  async importar(data: any[], tenantId?: string) {
    // Implementar lógica de importação
    // Por enquanto, apenas retorna sucesso
    return { message: 'Importação realizada com sucesso', quantidade: data.length };
  },

  async exportar(filters?: any, tenantId?: string) {
    // Implementar lógica de exportação
    // Por enquanto, apenas retorna dados básicos
    const agendamentos = await this.findAll(tenantId);
    return Buffer.from(JSON.stringify(agendamentos));
  }
}; 
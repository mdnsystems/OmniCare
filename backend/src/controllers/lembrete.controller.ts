import { Request, Response } from 'express';
import prisma from '../services/prisma';

export default {
  // Buscar notificações de lembretes para o tenant atual
  async getNotificacoes(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      
      // Buscar lembretes da clínica atual
      const lembretes = await prisma.lembreteClinica.findMany({
        where: {
          fatura: {
            tenantId: tenantId
          }
        },
        include: {
          fatura: {
            include: {
              clinica: {
                select: {
                  id: true,
                  nome: true,
                  tipo: true
                }
              }
            }
          }
        },
        orderBy: {
          dataEnvio: 'desc'
        }
      });

      // Transformar para o formato esperado pelo frontend
      const notificacoes = lembretes.map((lembrete: any) => ({
        id: lembrete.id,
        faturaId: lembrete.faturaId,
        tipo: lembrete.tipo,
        mensagem: lembrete.mensagem,
        destinatario: lembrete.destinatario,
        dataEnvio: lembrete.dataEnvio.toISOString(),
        status: lembrete.status,
        lida: false, // Por enquanto, todos os lembretes são considerados não lidos
        fatura: {
          numeroFatura: lembrete.fatura.numeroFatura,
          valor: Number(lembrete.fatura.valor),
          dataVencimento: lembrete.fatura.dataVencimento.toISOString(),
          clinica: {
            nome: lembrete.fatura.clinica.nome
          }
        }
      }));

      res.json({
        success: true,
        data: notificacoes
      });
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Marcar notificação como lida
  async marcarNotificacaoComoLida(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId;

      // Verificar se o lembrete pertence ao tenant atual
      const lembrete = await prisma.lembreteClinica.findFirst({
        where: {
          id: id,
          fatura: {
            tenantId: tenantId
          }
        }
      });

      if (!lembrete) {
        return res.status(404).json({
          success: false,
          message: 'Lembrete não encontrado'
        });
      }

      // Atualizar status para lido
      await prisma.lembreteClinica.update({
        where: { id: id },
        data: { status: 'LIDO' }
      });

      res.json({
        success: true,
        message: 'Notificação marcada como lida'
      });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Marcar todas as notificações como lidas
  async marcarTodasNotificacoesComoLidas(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;

      // Buscar todos os lembretes não lidos do tenant
      const lembretesNaoLidos = await prisma.lembreteClinica.findMany({
        where: {
          fatura: {
            tenantId: tenantId
          },
          status: {
            not: 'LIDO'
          }
        }
      });

      // Marcar todos como lidos
      if (lembretesNaoLidos.length > 0) {
        await prisma.lembreteClinica.updateMany({
          where: {
            fatura: {
              tenantId: tenantId
            },
            status: {
              not: 'LIDO'
            }
          },
          data: { status: 'LIDO' }
        });
      }

      res.json({
        success: true,
        message: `${lembretesNaoLidos.length} notificações marcadas como lidas`
      });
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Enviar lembrete personalizado (para SUPER_ADMIN)
  async enviarLembretePersonalizado(req: Request, res: Response) {
    try {
      const { faturaId, tipo, mensagem, destinatario } = req.body;
      const tenantId = req.tenantId;

      // Verificar se a fatura existe e pertence ao tenant
      const fatura = await prisma.faturaClinica.findFirst({
        where: {
          id: faturaId,
          tenantId: tenantId
        }
      });

      if (!fatura) {
        return res.status(404).json({
          success: false,
          message: 'Fatura não encontrada'
        });
      }

      // Criar o lembrete
      const lembrete = await prisma.lembreteClinica.create({
        data: {
          faturaId: faturaId,
          tipo: tipo,
          mensagem: mensagem,
          destinatario: destinatario,
          status: 'ENVIADO'
        }
      });

      res.json({
        success: true,
        data: lembrete,
        message: 'Lembrete enviado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao enviar lembrete:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Buscar estatísticas de lembretes
  async getEstatisticasNotificacoes(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;

      const [
        totalLembretes,
        lembretesEnviados,
        lembretesLidos,
        lembretesPendentes
      ] = await Promise.all([
        prisma.lembreteClinica.count({
          where: {
            fatura: {
              tenantId: tenantId
            }
          }
        }),
        prisma.lembreteClinica.count({
          where: {
            fatura: {
              tenantId: tenantId
            },
            status: 'ENVIADO'
          }
        }),
        prisma.lembreteClinica.count({
          where: {
            fatura: {
              tenantId: tenantId
            },
            status: 'LIDO'
          }
        }),
        prisma.lembreteClinica.count({
          where: {
            fatura: {
              tenantId: tenantId
            },
            status: {
              in: ['ENVIADO', 'ENTREGUE']
            }
          }
        })
      ]);

      res.json({
        success: true,
        data: {
          total: totalLembretes,
          enviados: lembretesEnviados,
          lidos: lembretesLidos,
          pendentes: lembretesPendentes
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Métodos CRUD básicos
  async create(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const data = {
        ...req.body,
        tenantId
      };
      
      const lembrete = await prisma.lembreteClinica.create({
        data
      });
      
      res.status(201).json({
        success: true,
        data: lembrete
      });
    } catch (error) {
      console.error('Erro ao criar lembrete:', error);
      res.status(400).json({
        success: false,
        message: 'Erro ao criar lembrete'
      });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const {
        page = 1,
        limit = 10,
        sortBy = 'dataEnvio',
        sortOrder = 'desc',
        tipo,
        status,
        destinatario,
        dataInicio,
        dataFim,
        faturaId
      } = req.query;

      const pageNumber = parseInt(page as string);
      const limitNumber = parseInt(limit as string);
      const skip = (pageNumber - 1) * limitNumber;

      // Construir filtros
      const where: any = {
        fatura: {
          tenantId: tenantId
        }
      };

      if (tipo) {
        where.tipo = tipo;
      }

      if (status) {
        where.status = status;
      }

      if (destinatario) {
        where.destinatario = {
          contains: destinatario as string,
          mode: 'insensitive'
        };
      }

      if (faturaId) {
        where.faturaId = faturaId;
      }

      if (dataInicio || dataFim) {
        where.dataEnvio = {};
        if (dataInicio) {
          where.dataEnvio.gte = new Date(dataInicio as string);
        }
        if (dataFim) {
          where.dataEnvio.lte = new Date(dataFim as string);
        }
      }

      // Buscar total de registros
      const total = await prisma.lembreteClinica.count({ where });

      // Buscar lembretes com paginação
      const lembretes = await prisma.lembreteClinica.findMany({
        where,
        include: {
          fatura: {
            include: {
              clinica: {
                select: {
                  id: true,
                  nome: true,
                  tipo: true
                }
              }
            }
          }
        },
        orderBy: {
          [sortBy as string]: sortOrder
        },
        skip,
        take: limitNumber
      });

      const totalPages = Math.ceil(total / limitNumber);

      res.json({
        success: true,
        data: lembretes,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages,
          hasNext: pageNumber < totalPages,
          hasPrev: pageNumber > 1
        }
      });
    } catch (error) {
      console.error('Erro ao buscar lembretes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId;

      const lembrete = await prisma.lembreteClinica.findFirst({
        where: {
          id: id,
          fatura: {
            tenantId: tenantId
          }
        },
        include: {
          fatura: true
        }
      });

      if (!lembrete) {
        return res.status(404).json({
          success: false,
          message: 'Lembrete não encontrado'
        });
      }

      res.json({
        success: true,
        data: lembrete
      });
    } catch (error) {
      console.error('Erro ao buscar lembrete:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId;

      // Verificar se o lembrete pertence ao tenant
      const lembreteExistente = await prisma.lembreteClinica.findFirst({
        where: {
          id: id,
          fatura: {
            tenantId: tenantId
          }
        }
      });

      if (!lembreteExistente) {
        return res.status(404).json({
          success: false,
          message: 'Lembrete não encontrado'
        });
      }

      const lembrete = await prisma.lembreteClinica.update({
        where: { id: id },
        data: req.body
      });

      res.json({
        success: true,
        data: lembrete
      });
    } catch (error) {
      console.error('Erro ao atualizar lembrete:', error);
      res.status(400).json({
        success: false,
        message: 'Erro ao atualizar lembrete'
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId;

      // Verificar se o lembrete pertence ao tenant
      const lembrete = await prisma.lembreteClinica.findFirst({
        where: {
          id: id,
          fatura: {
            tenantId: tenantId
          }
        }
      });

      if (!lembrete) {
        return res.status(404).json({
          success: false,
          message: 'Lembrete não encontrado'
        });
      }

      await prisma.lembreteClinica.delete({
        where: { id: id }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar lembrete:', error);
      res.status(400).json({
        success: false,
        message: 'Erro ao deletar lembrete'
      });
    }
  },

  // Buscar lembretes por período
  async findByPeriodo(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { dataInicio, dataFim } = req.query;

      if (!dataInicio || !dataFim) {
        return res.status(400).json({
          success: false,
          message: 'Data início e data fim são obrigatórias'
        });
      }

      const lembretes = await prisma.lembreteClinica.findMany({
        where: {
          fatura: {
            tenantId: tenantId
          },
          dataEnvio: {
            gte: new Date(dataInicio as string),
            lte: new Date(dataFim as string)
          }
        },
        include: {
          fatura: {
            include: {
              clinica: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          }
        },
        orderBy: {
          dataEnvio: 'desc'
        }
      });

      res.json({
        success: true,
        data: lembretes
      });
    } catch (error) {
      console.error('Erro ao buscar lembretes por período:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Buscar lembretes por tipo
  async findByTipo(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { tipo } = req.params;

      const lembretes = await prisma.lembreteClinica.findMany({
        where: {
          fatura: {
            tenantId: tenantId
          },
          tipo: tipo as any
        },
        include: {
          fatura: {
            include: {
              clinica: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          }
        },
        orderBy: {
          dataEnvio: 'desc'
        }
      });

      res.json({
        success: true,
        data: lembretes
      });
    } catch (error) {
      console.error('Erro ao buscar lembretes por tipo:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Buscar lembretes por status
  async findByStatus(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { status } = req.params;

      const lembretes = await prisma.lembreteClinica.findMany({
        where: {
          fatura: {
            tenantId: tenantId
          },
          status: status as any
        },
        include: {
          fatura: {
            include: {
              clinica: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          }
        },
        orderBy: {
          dataEnvio: 'desc'
        }
      });

      res.json({
        success: true,
        data: lembretes
      });
    } catch (error) {
      console.error('Erro ao buscar lembretes por status:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Buscar lembretes por fatura
  async findByFatura(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { faturaId } = req.params;

      const lembretes = await prisma.lembreteClinica.findMany({
        where: {
          faturaId: faturaId,
          fatura: {
            tenantId: tenantId
          }
        },
        include: {
          fatura: {
            include: {
              clinica: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          }
        },
        orderBy: {
          dataEnvio: 'desc'
        }
      });

      res.json({
        success: true,
        data: lembretes
      });
    } catch (error) {
      console.error('Erro ao buscar lembretes por fatura:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Buscar lembretes (search)
  async search(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { q, limit = 10 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Termo de busca é obrigatório'
        });
      }

      const lembretes = await prisma.lembreteClinica.findMany({
        where: {
          fatura: {
            tenantId: tenantId
          },
          OR: [
            {
              mensagem: {
                contains: q as string,
                mode: 'insensitive'
              }
            },
            {
              destinatario: {
                contains: q as string,
                mode: 'insensitive'
              }
            },
            {
              fatura: {
                clinica: {
                  nome: {
                    contains: q as string,
                    mode: 'insensitive'
                  }
                }
              }
            }
          ]
        },
        include: {
          fatura: {
            include: {
              clinica: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          }
        },
        orderBy: {
          dataEnvio: 'desc'
        },
        take: parseInt(limit as string)
      });

      res.json({
        success: true,
        data: lembretes
      });
    } catch (error) {
      console.error('Erro ao buscar lembretes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Estatísticas de lembretes
  async getStats(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { inicio, fim } = req.query;

      const where: any = {
        fatura: {
          tenantId: tenantId
        }
      };

      if (inicio && fim) {
        where.dataEnvio = {
          gte: new Date(inicio as string),
          lte: new Date(fim as string)
        };
      }

      // Total de lembretes
      const totalLembretes = await prisma.lembreteClinica.count({ where });

      // Lembretes por status
      const lembretesPorStatus = await prisma.lembreteClinica.groupBy({
        by: ['status'],
        where,
        _count: {
          status: true
        }
      });

      // Lembretes por tipo
      const lembretesPorTipo = await prisma.lembreteClinica.groupBy({
        by: ['tipo'],
        where,
        _count: {
          tipo: true
        }
      });

      // Converter para formato esperado pelo frontend
      const statusCount = lembretesPorStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>);

      const tipoCount = lembretesPorTipo.reduce((acc, item) => {
        acc[item.tipo] = item._count.tipo;
        return acc;
      }, {} as Record<string, number>);

      // Calcular média por dia (últimos 30 dias se não especificado período)
      const dataInicio = inicio ? new Date(inicio as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dataFim = fim ? new Date(fim as string) : new Date();
      const dias = Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
      
      const lembretesPeriodo = await prisma.lembreteClinica.count({
        where: {
          fatura: {
            tenantId: tenantId
          },
          dataEnvio: {
            gte: dataInicio,
            lte: dataFim
          }
        }
      });

      const mediaLembretesPorDia = dias > 0 ? lembretesPeriodo / dias : 0;

      // Calcular crescimento mensal (comparar com mês anterior)
      const mesAtual = new Date();
      const mesAnterior = new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1, 1);
      const inicioMesAtual = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);

      const lembretesMesAtual = await prisma.lembreteClinica.count({
        where: {
          fatura: {
            tenantId: tenantId
          },
          dataEnvio: {
            gte: inicioMesAtual,
            lte: mesAtual
          }
        }
      });

      const lembretesMesAnterior = await prisma.lembreteClinica.count({
        where: {
          fatura: {
            tenantId: tenantId
          },
          dataEnvio: {
            gte: mesAnterior,
            lt: inicioMesAtual
          }
        }
      });

      const crescimentoMensal = lembretesMesAnterior > 0 
        ? ((lembretesMesAtual - lembretesMesAnterior) / lembretesMesAnterior) * 100 
        : 0;

      res.json({
        success: true,
        data: {
          totalLembretes,
          lembretesPorStatus: statusCount,
          lembretesPorTipo: tipoCount,
          mediaLembretesPorDia,
          crescimentoMensal
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}; 
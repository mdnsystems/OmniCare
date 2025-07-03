// =============================================================================
// CONTROLLER - SUPER ADMIN
// =============================================================================
// 
// Controlador específico para operações do SUPER_ADMIN
// Foco em gestão de clínicas e relatórios macro
//
// =============================================================================

import { Request, Response } from 'express';
import prisma from '../services/prisma';
import { RoleUsuario } from '../types/enums';

// Tipos para o relatório de usuários
interface UsuarioRelatorio {
  id: string;
  email: string;
  role: RoleUsuario;
  ativo: boolean;
  createdAt: Date;
  clinica: {
    id: string;
    nome: string;
    tenantId: string;
  } | null;
}

interface ClinicaRelatorio {
  id: string;
  nome: string;
  tipo: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    usuarios: number;
    Paciente: number;
    Agendamento: number;
    Faturamento: number;
  };
}

export class SuperAdminController {
  /**
   * Lista todas as clínicas cadastradas (visão macro)
   */
  static async listarClinicas(req: Request, res: Response): Promise<Response> {
    try {
      const clinicas = await prisma.clinica.findMany({
        select: {
          id: true,
          nome: true,
          tipo: true,
          ativo: true,
          tenantId: true,
          createdAt: true,
          updatedAt: true,
          // Contadores básicos
          _count: {
            select: {
              usuarios: true,
              Profissional: true,
              Paciente: true,
              Agendamento: {
                where: {
                  createdAt: {
                    gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
                  }
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return res.status(200).json({
        success: true,
        data: clinicas,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao listar clínicas',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Obtém detalhes de uma clínica específica
   */
  static async obterDetalhesClinica(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID da clínica é obrigatório',
          timestamp: new Date().toISOString(),
        });
      }

      const clinica = await prisma.clinica.findUnique({
        where: { id },
        select: {
          id: true,
          nome: true,
          tipo: true,
          ativo: true,
          tenantId: true,
          createdAt: true,
          updatedAt: true,
          // Estatísticas básicas
          _count: {
            select: {
              usuarios: true,
              Profissional: true,
              Paciente: true,
              Agendamento: true,
              Prontuario: true,
              Faturamento: true
            }
          }
        }
      });

      if (!clinica) {
        return res.status(404).json({
          success: false,
          error: 'Clínica não encontrada',
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        success: true,
        data: clinica,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao obter detalhes da clínica',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Relatório de gestão de usuários e permissões
   */
  static async relatorioUsuarios(req: Request, res: Response): Promise<Response> {
    try {
      const { clinicaId } = req.query;

      const whereClause = clinicaId ? { tenantId: clinicaId as string } : {};

      const usuarios = await prisma.usuario.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          role: true,
          ativo: true,
          createdAt: true,
          clinica: {
            select: {
              id: true,
              nome: true,
              tenantId: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Agrupar usuários por clínica
      const usuariosPorClinica = usuarios.reduce((acc: Record<string, any>, usuario: any) => {
        const clinicaNome = usuario.clinica?.nome || 'Sem clínica';
        if (!acc[clinicaNome]) {
          acc[clinicaNome] = {
            clinica: usuario.clinica,
            usuarios: [],
            total: 0,
            ativos: 0,
            inativos: 0
          };
        }
        acc[clinicaNome].usuarios.push(usuario);
        acc[clinicaNome].total++;
        if (usuario.ativo) {
          acc[clinicaNome].ativos++;
        } else {
          acc[clinicaNome].inativos++;
        }
        return acc;
      }, {});

      // Estatísticas gerais
      const estatisticas = {
        totalUsuarios: usuarios.length,
        totalAtivos: usuarios.filter((u: any) => u.ativo).length,
        totalInativos: usuarios.filter((u: any) => !u.ativo).length,
        porRole: {
          ADMIN: usuarios.filter((u: any) => u.role === 'ADMIN').length,
          PROFISSIONAL: usuarios.filter((u: any) => u.role === 'PROFISSIONAL').length,
          RECEPCIONISTA: usuarios.filter((u: any) => u.role === 'RECEPCIONISTA').length,
          SUPER_ADMIN: usuarios.filter((u: any) => u.role === 'SUPER_ADMIN').length
        }
      };

      return res.status(200).json({
        success: true,
        data: {
          usuarios: usuariosPorClinica,
          estatisticas
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao gerar relatório de usuários',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Relatório de atividades recentes
   */
  static async relatorioAtividades(req: Request, res: Response): Promise<Response> {
    try {
      const { dias = 30 } = req.query;
      const dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() - Number(dias));

      // Usuários ativos recentemente (baseado na criação)
      const usuariosRecentes = await prisma.usuario.findMany({
        where: {
          createdAt: {
            gte: dataInicio
          }
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          clinica: {
            select: {
              nome: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Agendamentos recentes
      const agendamentosRecentes = await prisma.agendamento.findMany({
        where: {
          createdAt: {
            gte: dataInicio
          }
        },
        select: {
          id: true,
          data: true,
          status: true,
          createdAt: true,
          clinica: {
            select: {
              nome: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Faturamentos recentes
      const faturamentosRecentes = await prisma.faturamento.findMany({
        where: {
          createdAt: {
            gte: dataInicio
          }
        },
        select: {
          id: true,
          valor: true,
          status: true,
          createdAt: true,
          clinica: {
            select: {
              nome: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return res.status(200).json({
        success: true,
        data: {
          periodo: {
            inicio: dataInicio.toISOString(),
            fim: new Date().toISOString(),
            dias: Number(dias)
          },
          usuarios: {
            total: usuariosRecentes.length,
            dados: usuariosRecentes
          },
          agendamentos: {
            total: agendamentosRecentes.length,
            dados: agendamentosRecentes
          },
          faturamentos: {
            total: faturamentosRecentes.length,
            dados: faturamentosRecentes
          }
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao gerar relatório de atividades',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Relatório de gestão de clínicas
   */
  static async relatorioGestaoClinicas(req: Request, res: Response): Promise<Response> {
    try {
      const clinicas = await prisma.clinica.findMany({
        select: {
          id: true,
          nome: true,
          tipo: true,
          ativo: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              usuarios: true,
              Paciente: true,
              Agendamento: true,
              Faturamento: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const estatisticas = {
        total: clinicas.length,
        ativas: clinicas.filter((c: any) => c.ativo).length,
        inativas: clinicas.filter((c: any) => !c.ativo).length,
        porTipo: {
          MEDICA: clinicas.filter((c: any) => c.tipo === 'MEDICA').length,
          ODONTOLOGICA: clinicas.filter((c: any) => c.tipo === 'ODONTOLOGICA').length,
          PSICOLOGICA: clinicas.filter((c: any) => c.tipo === 'PSICOLOGICA').length,
          FISIOTERAPIA: clinicas.filter((c: any) => c.tipo === 'FISIOTERAPIA').length,
          NUTRICIONAL: clinicas.filter((c: any) => c.tipo === 'NUTRICIONAL').length
        }
      };

      return res.status(200).json({
        success: true,
        data: {
          clinicas,
          estatisticas
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao gerar relatório de gestão de clínicas',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Relatório de chat e mensagens
   */
  static async relatorioChat(req: Request, res: Response): Promise<Response> {
    try {
      const { dias = 30 } = req.query;
      const dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() - Number(dias));

      // Mensagens recentes
      const mensagensRecentes = await prisma.mensagem.findMany({
        where: {
          timestamp: {
            gte: dataInicio
          }
        },
        select: {
          id: true,
          content: true,
          timestamp: true,
          senderName: true,
          senderRole: true,
          clinica: {
            select: {
              nome: true
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      // Chats ativos
      const chatsAtivos = await prisma.chat.findMany({
        where: {
          ativo: true
        },
        select: {
          id: true,
          tipo: true,
          nome: true,
          createdAt: true,
          _count: {
            select: {
              mensagens: true
            }
          },
          clinica: {
            select: {
              nome: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return res.status(200).json({
        success: true,
        data: {
          periodo: {
            inicio: dataInicio.toISOString(),
            fim: new Date().toISOString(),
            dias: Number(dias)
          },
          mensagens: {
            total: mensagensRecentes.length,
            dados: mensagensRecentes
          },
          chats: {
            total: chatsAtivos.length,
            dados: chatsAtivos
          }
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao gerar relatório de chat',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Ativar/Desativar clínica
   */
  static async toggleStatusClinica(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { ativo } = req.body;

      if (typeof ativo !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'Campo "ativo" deve ser um boolean',
          timestamp: new Date().toISOString(),
        });
      }

      const clinica = await prisma.clinica.findUnique({
        where: { id }
      });

      if (!clinica) {
        return res.status(404).json({
          success: false,
          error: 'Clínica não encontrada',
          timestamp: new Date().toISOString(),
        });
      }

      const clinicaAtualizada = await prisma.clinica.update({
        where: { id },
        data: { ativo },
        select: {
          id: true,
          nome: true,
          ativo: true,
          updatedAt: true
        }
      });

      return res.status(200).json({
        success: true,
        data: clinicaAtualizada,
        message: `Clínica ${ativo ? 'ativada' : 'desativada'} com sucesso`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao atualizar status da clínica',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Atualizar dados da clínica
   */
  static async atualizarClinica(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { nome, tipo, ativo } = req.body;

      const clinica = await prisma.clinica.findUnique({
        where: { id }
      });

      if (!clinica) {
        return res.status(404).json({
          success: false,
          error: 'Clínica não encontrada',
          timestamp: new Date().toISOString(),
        });
      }

      const dadosAtualizacao: any = {};
      if (nome !== undefined) dadosAtualizacao.nome = nome;
      if (tipo !== undefined) dadosAtualizacao.tipo = tipo;
      if (ativo !== undefined) dadosAtualizacao.ativo = ativo;

      const clinicaAtualizada = await prisma.clinica.update({
        where: { id },
        data: dadosAtualizacao,
        select: {
          id: true,
          nome: true,
          tipo: true,
          ativo: true,
          updatedAt: true
        }
      });

      return res.status(200).json({
        success: true,
        data: clinicaAtualizada,
        message: 'Clínica atualizada com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao atualizar clínica',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      });
    }
  }
} 
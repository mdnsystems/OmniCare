import { Request, Response } from 'express';
import RelatorioService from '../services/relatorio.service';

export default {
  async create(req: Request, res: Response) {
    try {
      const relatorio = await RelatorioService.create(req.body);
      res.status(201).json({
        success: true,
        data: relatorio,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, tipo, status } = req.query;
      const relatorios = await RelatorioService.findAll({
        page: Number(page),
        limit: Number(limit),
        tipo: tipo as string,
        status: status as string,
      });
      res.json({
        success: true,
        data: relatorios,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const relatorio = await RelatorioService.findById(id);
      if (!relatorio) {
        return res.status(404).json({
          success: false,
          error: 'Relatório não encontrado',
          timestamp: new Date().toISOString(),
        });
      }
      res.json({
        success: true,
        data: relatorio,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const relatorio = await RelatorioService.update(id, req.body);
      res.json({
        success: true,
        data: relatorio,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await RelatorioService.delete(id);
      res.json({
        success: true,
        message: 'Relatório excluído com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  // Relatórios específicos
  async gerarRelatorioConsultas(req: Request, res: Response) {
    try {
      const { periodo, filtros } = req.body;
      const relatorio = await RelatorioService.gerarRelatorioConsultas(periodo, filtros);
      res.json({
        success: true,
        data: relatorio,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async gerarRelatorioFaturamento(req: Request, res: Response) {
    try {
      const { periodo, filtros } = req.body;
      const relatorio = await RelatorioService.gerarRelatorioFaturamento(periodo, filtros);
      res.json({
        success: true,
        data: relatorio,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async gerarRelatorioDesempenho(req: Request, res: Response) {
    try {
      const { periodo, filtros } = req.body;
      const relatorio = await RelatorioService.gerarRelatorioDesempenho(periodo, filtros);
      res.json({
        success: true,
        data: relatorio,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async gerarRelatorioReceitas(req: Request, res: Response) {
    try {
      const { periodo, filtros } = req.body;
      const relatorio = await RelatorioService.gerarRelatorioReceitas(periodo, filtros);
      res.json({
        success: true,
        data: relatorio,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async gerarRelatorioProfissionais(req: Request, res: Response) {
    try {
      const { filtros } = req.body;
      const relatorio = await RelatorioService.gerarRelatorioProfissionais(filtros);
      res.json({
        success: true,
        data: relatorio,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async gerarRelatorioProntuarios(req: Request, res: Response) {
    try {
      const { periodo, filtros } = req.body;
      const relatorio = await RelatorioService.gerarRelatorioProntuarios(periodo, filtros);
      res.json({
        success: true,
        data: relatorio,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async gerarRelatorioCustomizado(req: Request, res: Response) {
    try {
      const { configuracao } = req.body;
      const relatorio = await RelatorioService.gerarRelatorioCustomizado(configuracao);
      res.json({
        success: true,
        data: relatorio,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  // Templates de relatório
  async getTemplates(req: Request, res: Response) {
    try {
      const templates = await RelatorioService.getTemplates();
      res.json({
        success: true,
        data: templates,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async getTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const template = await RelatorioService.getTemplate(id);
      if (!template) {
        return res.status(404).json({
          success: false,
          error: 'Template não encontrado',
          timestamp: new Date().toISOString(),
        });
      }
      res.json({
        success: true,
        data: template,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async createTemplate(req: Request, res: Response) {
    try {
      const template = await RelatorioService.createTemplate(req.body);
      res.status(201).json({
        success: true,
        data: template,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async updateTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const template = await RelatorioService.updateTemplate(id, req.body);
      res.json({
        success: true,
        data: template,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async deleteTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await RelatorioService.deleteTemplate(id);
      res.json({
        success: true,
        message: 'Template excluído com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  // Relatórios agendados
  async agendarRelatorio(req: Request, res: Response) {
    try {
      const agendamento = await RelatorioService.agendarRelatorio(req.body);
      res.status(201).json({
        success: true,
        data: agendamento,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async getRelatoriosAgendados(req: Request, res: Response) {
    try {
      const agendamentos = await RelatorioService.getRelatoriosAgendados();
      res.json({
        success: true,
        data: agendamentos,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async updateRelatorioAgendado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const agendamento = await RelatorioService.updateRelatorioAgendado(id, req.body);
      res.json({
        success: true,
        data: agendamento,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async deleteRelatorioAgendado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await RelatorioService.deleteRelatorioAgendado(id);
      res.json({
        success: true,
        message: 'Relatório agendado excluído com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  // Histórico de relatórios
  async getHistorico(req: Request, res: Response) {
    try {
      const { tipo, dataInicio, dataFim, status } = req.query;
      const historico = await RelatorioService.getHistorico({
        tipo: tipo as string,
        dataInicio: dataInicio as string,
        dataFim: dataFim as string,
        status: status as string,
      });
      res.json({
        success: true,
        data: historico,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },
}; 
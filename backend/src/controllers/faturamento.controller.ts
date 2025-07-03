import { Request, Response } from 'express';
import FaturamentoService from '../services/faturamento.service';

export default {
  async create(req: Request, res: Response) {
    try {
      const faturamento = await FaturamentoService.create(req.body);
      res.status(201).json({
        success: true,
        data: faturamento,
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
      const { page = 1, limit = 10, pacienteId, profissionalId, tipo, status, dataInicio, dataFim, dataVencimentoInicio, dataVencimentoFim } = req.query;
      const faturamentos = await FaturamentoService.findAll({
        page: Number(page),
        limit: Number(limit),
        pacienteId: pacienteId as string,
        profissionalId: profissionalId as string,
        tipo: tipo as string,
        status: status as string,
        dataInicio: dataInicio as string,
        dataFim: dataFim as string,
        dataVencimentoInicio: dataVencimentoInicio as string,
        dataVencimentoFim: dataVencimentoFim as string,
      });
      res.json({
        success: true,
        data: faturamentos,
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
      const faturamento = await FaturamentoService.findById(id);
      if (!faturamento) {
        return res.status(404).json({
          success: false,
          error: 'Faturamento não encontrado',
          timestamp: new Date().toISOString(),
        });
      }
      res.json({
        success: true,
        data: faturamento,
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
      const faturamento = await FaturamentoService.update(id, req.body);
      res.json({
        success: true,
        data: faturamento,
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
      await FaturamentoService.delete(id);
      res.json({
        success: true,
        message: 'Faturamento excluído com sucesso',
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

  async findByPaciente(req: Request, res: Response) {
    try {
      const { pacienteId } = req.params;
      const faturamentos = await FaturamentoService.findByPaciente(pacienteId);
      res.json({
        success: true,
        data: faturamentos,
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

  async findByProfissional(req: Request, res: Response) {
    try {
      const { profissionalId } = req.params;
      const faturamentos = await FaturamentoService.findByProfissional(profissionalId);
      res.json({
        success: true,
        data: faturamentos,
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

  async findByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const faturamentos = await FaturamentoService.findByStatus(status);
      res.json({
        success: true,
        data: faturamentos,
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

  async findVencidos(req: Request, res: Response) {
    try {
      const faturamentos = await FaturamentoService.findVencidos();
      res.json({
        success: true,
        data: faturamentos,
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

  async findAVencer(req: Request, res: Response) {
    try {
      const { dias = 7 } = req.query;
      const faturamentos = await FaturamentoService.findAVencer(Number(dias));
      res.json({
        success: true,
        data: faturamentos,
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

  async exportar(req: Request, res: Response) {
    try {
      const { filtros, formato = 'xlsx' } = req.body;
      const arquivo = await FaturamentoService.exportar(filtros, formato);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=faturamentos.xlsx');
      res.send(arquivo);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async importar(req: Request, res: Response) {
    try {
      const file = (req as any).file;
      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'Arquivo não fornecido',
          timestamp: new Date().toISOString(),
        });
      }

      const resultado = await FaturamentoService.importar(file);
      res.json({
        success: true,
        data: resultado,
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
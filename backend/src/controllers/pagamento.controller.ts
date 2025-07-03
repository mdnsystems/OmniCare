import { Request, Response } from 'express';
import PagamentoService from '../services/pagamento.service';

export default {
  async create(req: Request, res: Response) {
    try {
      const pagamento = await PagamentoService.create({
        ...req.body,
        tenantId: req.tenantId,
      });
      res.status(201).json({
        success: true,
        data: pagamento,
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
      const { page = 1, limit = 10, faturamentoId, dataInicio, dataFim, formaPagamento } = req.query;
      const pagamentos = await PagamentoService.findAll({
        tenantId: req.tenantId,
        faturamentoId: faturamentoId as string,
        dataInicio: dataInicio as string,
        dataFim: dataFim as string,
        formaPagamento: formaPagamento as any,
      });
      res.json({
        success: true,
        data: pagamentos,
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
      const pagamento = await PagamentoService.findById(id);
      if (!pagamento) {
        return res.status(404).json({
          success: false,
          error: 'Pagamento não encontrado',
          timestamp: new Date().toISOString(),
        });
      }
      res.json({
        success: true,
        data: pagamento,
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
      const pagamento = await PagamentoService.update(id, req.body);
      res.json({
        success: true,
        data: pagamento,
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
      await PagamentoService.delete(id);
      res.json({
        success: true,
        message: 'Pagamento excluído com sucesso',
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

  async findByFaturamento(req: Request, res: Response) {
    try {
      const { faturamentoId } = req.params;
      const pagamentos = await PagamentoService.findByFaturamento(faturamentoId);
      res.json({
        success: true,
        data: pagamentos,
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

  async findByPeriodo(req: Request, res: Response) {
    try {
      const { dataInicio, dataFim } = req.params;
      const pagamentos = await PagamentoService.findByPeriodo(dataInicio, dataFim);
      res.json({
        success: true,
        data: pagamentos,
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

  async findByFormaPagamento(req: Request, res: Response) {
    try {
      const { formaPagamento } = req.params;
      const pagamentos = await PagamentoService.findByFormaPagamento(formaPagamento as any);
      res.json({
        success: true,
        data: pagamentos,
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

  async registrarPagamento(req: Request, res: Response) {
    try {
      const { faturamentoId, valor, formaPagamento, comprovante, observacoes } = req.body;
      const pagamento = await PagamentoService.registrarPagamento({
        tenantId: req.tenantId!,
        faturamentoId,
        valor,
        formaPagamento,
        comprovante,
        observacoes,
      });
      res.status(201).json({
        success: true,
        data: pagamento,
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

  async estornarPagamento(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { motivo } = req.body;
      const estorno = await PagamentoService.estornarPagamento(id, motivo, req.tenantId!);
      res.json({
        success: true,
        data: estorno,
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
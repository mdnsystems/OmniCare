import { Request, Response } from 'express';
import dashboardService from '../services/dashboard.service';

export default {
  async getDashboard(req: Request, res: Response) {
    try {
      const { tenantId } = req as any;
      const dashboard = await dashboardService.getDashboard(tenantId);
      res.json({
        success: true,
        data: dashboard,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },

  async getEstatisticasAgendamentos(req: Request, res: Response) {
    try {
      const { tenantId } = req as any;
      const { periodo } = req.query;
      const estatisticas = await dashboardService.getEstatisticasAgendamentos(
        tenantId,
        periodo ? JSON.parse(periodo as string) : undefined
      );
      res.json({
        success: true,
        data: estatisticas,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },

  async getEstatisticasFinanceiras(req: Request, res: Response) {
    try {
      const { tenantId } = req as any;
      const { periodo } = req.query;
      const estatisticas = await dashboardService.getEstatisticasFinanceiras(
        tenantId,
        periodo ? JSON.parse(periodo as string) : undefined
      );
      res.json({
        success: true,
        data: estatisticas,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },

  async getEstatisticasPacientes(req: Request, res: Response) {
    try {
      const { tenantId } = req as any;
      const estatisticas = await dashboardService.getEstatisticasPacientes(tenantId);
      res.json({
        success: true,
        data: estatisticas,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },

  async getEstatisticasProfissionais(req: Request, res: Response) {
    try {
      const { tenantId } = req as any;
      const estatisticas = await dashboardService.getEstatisticasProfissionais(tenantId);
      res.json({
        success: true,
        data: estatisticas,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },

  async getEstatisticasProntuarios(req: Request, res: Response) {
    try {
      const { tenantId } = req as any;
      const { periodo } = req.query;
      const estatisticas = await dashboardService.getEstatisticasProntuarios(
        tenantId,
        periodo ? JSON.parse(periodo as string) : undefined
      );
      res.json({
        success: true,
        data: estatisticas,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },

  async getEstatisticasAnamnese(req: Request, res: Response) {
    try {
      const { tenantId } = req as any;
      const { periodo } = req.query;
      const estatisticas = await dashboardService.getEstatisticasAnamnese(
        tenantId,
        periodo ? JSON.parse(periodo as string) : undefined
      );
      res.json({
        success: true,
        data: estatisticas,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },

  async getEstatisticasAtividades(req: Request, res: Response) {
    try {
      const { tenantId } = req as any;
      const estatisticas = await dashboardService.getEstatisticasAtividades(tenantId);
      res.json({
        success: true,
        data: estatisticas,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },

  async getEvolucaoSemanal(req: Request, res: Response) {
    try {
      const { tenantId } = req as any;
      const evolucao = await dashboardService.getEvolucaoSemanal(tenantId);
      res.json({
        success: true,
        data: evolucao,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}; 
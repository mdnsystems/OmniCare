import { Request, Response } from 'express';
import MessageTemplateService from '../services/message-template.service';

export default {
  async create(req: Request, res: Response) {
    try {
      const template = await MessageTemplateService.create(req.body);
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

  async findAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, tipo, ativo } = req.query;
      const templates = await MessageTemplateService.findAll({
        page: Number(page),
        limit: Number(limit),
        tipo: tipo as string,
        ativo: ativo === 'true',
      });
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

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const template = await MessageTemplateService.findById(id);
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

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const template = await MessageTemplateService.update(id, req.body);
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

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await MessageTemplateService.delete(id);
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

  async findByTipo(req: Request, res: Response) {
    try {
      const { tipo } = req.params;
      const templates = await MessageTemplateService.findByTipo(tipo);
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

  async findAtivos(req: Request, res: Response) {
    try {
      const templates = await MessageTemplateService.findAtivos();
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

  async ativar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const template = await MessageTemplateService.ativar(id);
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

  async desativar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const template = await MessageTemplateService.desativar(id);
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

  async duplicar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome } = req.body;
      const template = await MessageTemplateService.duplicar(id, nome);
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
}; 
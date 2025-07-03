import { Request, Response } from 'express';
import profissionalService from '../services/profissional.service';
import { ProfissionalInput } from '../validators/profissional.validator';
import { ProfissionalStatus } from '../types/enums';

export default {
  async create(req: Request<{}, {}, ProfissionalInput>, res: Response) {
    try {
      const tenantId = req.tenantId || 'default-tenant';
      const data = {
        ...req.body,
        tenantId
      };
      const profissional = await profissionalService.create(data);
      res.status(201).json({
        success: true,
        data: profissional,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(400).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
  async findAll(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId || 'default-tenant';
      
      // Extrair filtros da query string
      const statusParam = req.query.status as string;
      const validStatuses = Object.values(ProfissionalStatus);
      
      const filters = {
        nome: req.query.nome as string,
        especialidadeId: req.query.especialidadeId as string,
        status: statusParam && validStatuses.includes(statusParam as ProfissionalStatus) 
          ? (statusParam as ProfissionalStatus) 
          : undefined,
        email: req.query.email as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };

      const result = await profissionalService.findAll(filters, tenantId);
      res.json({
        success: true,
        data: result,
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
  async findAtivos(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const profissionais = await profissionalService.findAtivos(tenantId);
      res.json({
        success: true,
        data: profissionais || [],
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
  async findById(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const profissional = await profissionalService.findById(req.params.id, tenantId);
      if (!profissional) return res.status(404).json({ 
        success: false,
        error: 'Profissional não encontrado',
        timestamp: new Date().toISOString(),
      });
      res.json({
        success: true,
        data: profissional,
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
  async update(req: Request<{ id: string }, {}, ProfissionalInput>, res: Response) {
    try {
      const tenantId = req.tenantId;
      const profissional = await profissionalService.update(req.params.id, req.body, tenantId);
      res.json({
        success: true,
        data: profissional,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(400).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
  async delete(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      await profissionalService.delete(req.params.id, tenantId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
  async checkRelations(req: Request<{ id: string }>, res: Response) {
    try {
      const tenantId = req.tenantId || 'default-tenant';
      const relations = await profissionalService.checkRelations(req.params.id, tenantId);
      
      res.json({
        success: true,
        data: relations,
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
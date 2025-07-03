import { Request, Response } from 'express';
import pacienteService from '../services/paciente.service';
import { PacienteInput } from '../validators/paciente.validator';

export default {
  async create(req: Request<{}, {}, PacienteInput>, res: Response) {
    try {
      const tenantId = req.tenantId || 'default-tenant';
      const data = {
        ...req.body,
        tenantId
      };
      const paciente = await pacienteService.create(data);
      res.status(201).json({
        success: true,
        data: paciente,
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
      const filters = {
        nome: req.query.nome as string,
        cpf: req.query.cpf as string,
        email: req.query.email as string,
        profissionalId: req.query.profissionalId as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };

      const result = await pacienteService.findAll(filters, tenantId);
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
  async findById(req: Request<{ id: string }>, res: Response) {
    try {
      const tenantId = req.tenantId || 'default-tenant';
      const paciente = await pacienteService.findById(req.params.id, tenantId);
      if (!paciente) return res.status(404).json({ 
        success: false,
        error: 'Paciente não encontrado',
        timestamp: new Date().toISOString(),
      });
      res.json({
        success: true,
        data: paciente,
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
  async update(req: Request<{ id: string }>, res: Response) {
    try {
      const tenantId = req.tenantId || 'default-tenant';
      const paciente = await pacienteService.update(req.params.id, req.body, tenantId);
      res.json({
        success: true,
        data: paciente,
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
  async delete(req: Request<{ id: string }>, res: Response) {
    try {
      const tenantId = req.tenantId || 'default-tenant';
      const cascade = req.query.cascade === 'true';
      
      if (cascade) {
        await pacienteService.deleteWithCascade(req.params.id, tenantId);
      } else {
        await pacienteService.delete(req.params.id, tenantId);
      }
      
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
      const relations = await pacienteService.checkRelations(req.params.id, tenantId);
      
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
  },
}; 
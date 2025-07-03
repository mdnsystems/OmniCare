import { Request, Response } from 'express';
import prontuarioService from '../services/prontuario.service';
import { ProntuarioInput } from '../validators/prontuario.validator';

export default {
  async create(req: Request, res: Response) {
    try {
      const prontuario = await prontuarioService.create({
        ...req.body,
        tenantId: req.tenantId!
      });
      res.status(201).json({
        success: true,
        data: prontuario,
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
      const prontuarios = await prontuarioService.findAll(req.tenantId);
      res.json({
        success: true,
        data: prontuarios || [],
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
      const prontuario = await prontuarioService.findById(req.params.id, req.tenantId);
      if (!prontuario) {
        return res.status(404).json({ 
          success: false,
          error: 'Prontuário não encontrado',
          timestamp: new Date().toISOString(),
        });
      }
      res.json({
        success: true,
        data: prontuario,
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
      const prontuario = await prontuarioService.update(req.params.id, req.body, req.tenantId);
      res.json({
        success: true,
        data: prontuario,
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
      await prontuarioService.delete(req.params.id, req.tenantId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}; 
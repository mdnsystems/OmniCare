import { Request, Response } from 'express';
import especialidadeService from '../services/especialidade.service';
import { EspecialidadeInput } from '../validators/especialidade.validator';
import { TipoClinica } from '../types/enums';

export default {
  async create(req: Request<{}, {}, EspecialidadeInput>, res: Response) {
    try {
      const tenantId = req.tenantId || 'default-tenant';
      const data = {
        ...req.body,
        tenantId,
        tipoClinica: TipoClinica.MEDICA,
        configuracoes: {}
      };
      const especialidade = await especialidadeService.create(data);
      res.status(201).json({
        success: true,
        data: especialidade,
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
      const especialidades = await especialidadeService.findAll();
      res.json({
        success: true,
        data: especialidades || [],
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
      const especialidade = await especialidadeService.findById(req.params.id);
      if (!especialidade) return res.status(404).json({ 
        success: false,
        error: 'Especialidade não encontrada',
        timestamp: new Date().toISOString(),
      });
      res.json({
        success: true,
        data: especialidade,
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
  async update(req: Request<{ id: string }, {}, EspecialidadeInput>, res: Response) {
    try {
      const especialidade = await especialidadeService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: especialidade,
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
      await especialidadeService.delete(req.params.id, req.tenantId);
      res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao deletar especialidade:', error);
      
      if (error.message.includes('não encontrada')) {
        res.status(404).json({ 
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      } else if (error.message.includes('sendo usada')) {
        res.status(409).json({ 
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(400).json({ 
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    }
  },
}; 
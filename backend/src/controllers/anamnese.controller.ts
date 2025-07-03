import { Request, Response } from 'express';
import anamneseService from '../services/anamnese.service';

export default {
  async create(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const anamnese = await anamneseService.create({ ...req.body, tenantId });
      res.status(201).json({
        success: true,
        data: anamnese,
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
      const { 
        pacienteNome, 
        pacienteId,
        profissionalId,
        dataInicio,
        dataFim,
        page,
        limit
      } = req.query;
      const tenantId = (req as any).tenantId;

      console.log('🔍 [AnamneseController] findAll - Parâmetros recebidos:', {
        pacienteNome,
        pacienteId,
        profissionalId,
        dataInicio,
        dataFim,
        page,
        limit,
        tenantId
      });

      // Construir filtros
      const filters = {
        pacienteNome: pacienteNome as string,
        pacienteId: pacienteId as string,
        profissionalId: profissionalId as string,
        dataInicio: dataInicio as string,
        dataFim: dataFim as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      // Sempre usar o método com filtros para manter consistência na resposta
      console.log('🔍 [AnamneseController] Usando findAll com filtros');
      const result = await anamneseService.findAllWithFilters(filters, tenantId);
      
      console.log('🔍 [AnamneseController] Anamneses encontradas:', result.data?.length || 0);

      return res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('❌ [AnamneseController] Erro no findAll:', error);
      res.status(500).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
  async findById(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const anamnese = await anamneseService.findById(req.params.id, tenantId);
      if (!anamnese) return res.status(404).json({ 
        success: false,
        error: 'Anamnese não encontrada',
        timestamp: new Date().toISOString(),
      });
      res.json({
        success: true,
        data: anamnese,
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
  async update(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const anamnese = await anamneseService.update(req.params.id, req.body, tenantId);
      res.json({
        success: true,
        data: anamnese,
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
      const tenantId = (req as any).tenantId;
      await anamneseService.delete(req.params.id, tenantId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
  async checkRelations(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const relations = await anamneseService.checkRelations(req.params.id, tenantId);
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
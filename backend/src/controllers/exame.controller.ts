import { Request, Response } from 'express';
import exameService from '../services/exame.service';
import { ExameInput } from '../validators/exame.validator';

export default {
  async create(req: Request<{}, {}, ExameInput>, res: Response) {
    try {
      const tenantId = req.tenantId || 'default-tenant';
      const data = {
        ...req.body,
        tenantId,
        arquivos: req.body.arquivo ? [req.body.arquivo] : []
      };
      const exame = await exameService.create(data);
      res.status(201).json({
        success: true,
        data: exame,
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
        prontuarioId,
        tipo,
        dataInicio,
        dataFim,
        page,
        limit
      } = req.query;
      const tenantId = (req as any).tenantId;

      console.log('🔍 [ExameController] findAll - Parâmetros recebidos:', {
        pacienteNome,
        prontuarioId,
        tipo,
        dataInicio,
        dataFim,
        page,
        limit,
        tenantId
      });

      // Construir filtros
      const filters = {
        pacienteNome: pacienteNome as string,
        prontuarioId: prontuarioId as string,
        tipo: tipo as string,
        dataInicio: dataInicio as string,
        dataFim: dataFim as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      // Se tem filtros específicos, usar método com filtros
      if (pacienteNome || prontuarioId || tipo || dataInicio || dataFim || page || limit) {
        console.log('🔍 [ExameController] Usando findAll com filtros');
        const result = await exameService.findAllWithFilters(filters, tenantId);
        return res.json({
          success: true,
          data: result.data,
          pagination: result.pagination,
          timestamp: new Date().toISOString(),
        });
      }

      // Se não tem filtros, retorna todos
      console.log('🔍 [ExameController] Usando findAll');
      const exames = await exameService.findAll(tenantId);

      console.log('🔍 [ExameController] Exames encontrados:', exames?.length || 0);

      res.json({
        success: true,
        data: exames || [],
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('❌ [ExameController] Erro no findAll:', error);
      res.status(500).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
  async findById(req: Request, res: Response) {
    try {
      const exame = await exameService.findById(req.params.id);
      if (!exame) return res.status(404).json({ 
        success: false,
        error: 'Exame não encontrado',
        timestamp: new Date().toISOString(),
      });
      res.json({
        success: true,
        data: exame,
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
  async update(req: Request<{ id: string }, {}, ExameInput>, res: Response) {
    try {
      const exame = await exameService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: exame,
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
      await exameService.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
}; 
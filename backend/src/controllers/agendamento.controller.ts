import { Request, Response } from 'express';
import agendamentoService from '../services/agendamento.service';
import { AgendamentoInput } from '../validators/agendamento.validator';

export default {
  async create(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const agendamentoData = {
        ...req.body,
        tenantId
      };
      const agendamento = await agendamentoService.create(agendamentoData);
      res.status(201).json({
        success: true,
        data: agendamento,
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
        data, 
        profissionalId, 
        pacienteNome, 
        pacienteId,
        tipo,
        status,
        dataInicio,
        dataFim,
        page,
        limit
      } = req.query;
      const tenantId = (req as any).tenantId;

      console.log('🔍 [AgendamentoController] findAll - Parâmetros recebidos:', {
        data,
        profissionalId,
        pacienteNome,
        pacienteId,
        tipo,
        status,
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
        data: data as string,
        dataInicio: dataInicio as string,
        dataFim: dataFim as string,
        tipo: tipo as string,
        status: status as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      // Se tem filtros específicos, usar método com filtros
      if (pacienteNome || pacienteId || tipo || status || dataInicio || dataFim || page || limit) {
        console.log('🔍 [AgendamentoController] Usando findAll com filtros');
        const result = await agendamentoService.findAllWithFilters(filters, tenantId);
        return res.json({
          success: true,
          data: result.data,
          pagination: result.pagination,
          timestamp: new Date().toISOString(),
        });
      }

      let agendamentos;

      // Se tem data e profissional, usa findByProfissional
      if (data && profissionalId && profissionalId !== 'TODOS') {
        console.log('🔍 [AgendamentoController] Usando findByProfissional');
        agendamentos = await agendamentoService.findByProfissional(
          profissionalId as string, 
          data as string,
          tenantId
        );
      }
      // Se tem apenas data, usa findByData
      else if (data) {
        console.log('🔍 [AgendamentoController] Usando findByData');
        agendamentos = await agendamentoService.findByData(data as string, tenantId);
      }
      // Se não tem filtros, retorna todos
      else {
        console.log('🔍 [AgendamentoController] Usando findAll');
        agendamentos = await agendamentoService.findAll(tenantId);
      }

      console.log('🔍 [AgendamentoController] Agendamentos encontrados:', agendamentos?.length || 0);

      res.json({
        success: true,
        data: agendamentos || [],
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('❌ [AgendamentoController] Erro no findAll:', error);
      res.status(500).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },

  async findById(req: Request<{ id: string }>, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const agendamento = await agendamentoService.findById(req.params.id, tenantId);
      if (!agendamento) {
        return res.status(404).json({ 
          success: false,
          error: 'Agendamento não encontrado',
          timestamp: new Date().toISOString(),
        });
      }
      res.json({
        success: true,
        data: agendamento,
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
      const tenantId = (req as any).tenantId;
      const agendamento = await agendamentoService.update(req.params.id, req.body, tenantId);
      res.json({
        success: true,
        data: agendamento,
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
      const tenantId = (req as any).tenantId;
      await agendamentoService.delete(req.params.id, tenantId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // Endpoints específicos
  async confirmar(req: Request<{ id: string }>, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const agendamento = await agendamentoService.confirmar(req.params.id, tenantId);
      res.json({
        success: true,
        data: agendamento,
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

  async cancelar(req: Request<{ id: string }>, res: Response) {
    try {
      const { motivo } = req.body;
      const tenantId = (req as any).tenantId;
      const agendamento = await agendamentoService.cancelar(req.params.id, motivo, tenantId);
      res.json({
        success: true,
        data: agendamento,
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

  async remarcar(req: Request<{ id: string }>, res: Response) {
    try {
      const { novaData, novaHoraInicio, novaHoraFim } = req.body;
      const tenantId = (req as any).tenantId;
      const agendamento = await agendamentoService.remarcar(
        req.params.id, 
        novaData, 
        novaHoraInicio, 
        novaHoraFim,
        tenantId
      );
      res.json({
        success: true,
        data: agendamento,
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

  async realizar(req: Request<{ id: string }>, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const agendamento = await agendamentoService.realizar(req.params.id, tenantId);
      res.json({
        success: true,
        data: agendamento,
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

  async findByData(req: Request<{ data: string }>, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const agendamentos = await agendamentoService.findByData(req.params.data, tenantId);
      res.json({
        success: true,
        data: agendamentos || [],
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

  async findByProfissional(req: Request<{ profissionalId: string }>, res: Response) {
    try {
      const { data } = req.query;
      const tenantId = (req as any).tenantId;
      const agendamentos = await agendamentoService.findByProfissional(
        req.params.profissionalId, 
        data as string,
        tenantId
      );
      res.json({
        success: true,
        data: agendamentos || [],
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

  async findByPaciente(req: Request<{ pacienteId: string }>, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const agendamentos = await agendamentoService.findByPaciente(req.params.pacienteId, tenantId);
      res.json({
        success: true,
        data: agendamentos || [],
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

  async findHoje(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const agendamentos = await agendamentoService.findHoje(tenantId);
      res.json({
        success: true,
        data: agendamentos || [],
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

  async findSemana(req: Request, res: Response) {
    try {
      const { dataInicio } = req.query;
      const tenantId = (req as any).tenantId;
      const agendamentos = await agendamentoService.findSemana(dataInicio as string, tenantId);
      res.json({
        success: true,
        data: agendamentos || [],
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

  async findMes(req: Request, res: Response) {
    try {
      const { ano, mes } = req.query;
      const tenantId = (req as any).tenantId;
      const agendamentos = await agendamentoService.findMes(
        ano ? parseInt(ano as string) : undefined,
        mes ? parseInt(mes as string) : undefined,
        tenantId
      );
      res.json({
        success: true,
        data: agendamentos || [],
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

  async confirmarViaLink(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const agendamento = await agendamentoService.confirmarViaLink(token);
      res.json({
        success: true,
        data: agendamento,
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

  async cancelarViaLink(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const agendamento = await agendamentoService.cancelarViaLink(token);
      res.json({
        success: true,
        data: agendamento,
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

  async verificarDisponibilidade(req: Request, res: Response) {
    try {
      const { profissionalId, data, horaInicio, horaFim, excludeId } = req.body;
      const tenantId = (req as any).tenantId;
      const resultado = await agendamentoService.verificarDisponibilidade(
        profissionalId, 
        data, 
        horaInicio, 
        horaFim, 
        excludeId,
        tenantId
      );
      res.json({
        success: true,
        data: resultado,
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

  async getHorariosDisponiveis(req: Request<{ profissionalId: string }>, res: Response) {
    try {
      const { data } = req.query;
      const tenantId = (req as any).tenantId;
      const horarios = await agendamentoService.getHorariosDisponiveis(
        req.params.profissionalId,
        data as string,
        tenantId
      );
      res.json({
        success: true,
        data: horarios || [],
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

  async getEstatisticas(req: Request, res: Response) {
    try {
      const { periodo } = req.query;
      const tenantId = (req as any).tenantId;
      const estatisticas = await agendamentoService.getEstatisticas(
        periodo ? JSON.parse(periodo as string) : undefined,
        tenantId
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

  async enviarLembrete(req: Request<{ id: string }>, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      await agendamentoService.enviarLembrete(req.params.id, tenantId);
      res.json({ 
        success: true,
        message: 'Lembrete enviado com sucesso',
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

  async importar(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const resultado = await agendamentoService.importar(req.body, tenantId);
      res.json({
        success: true,
        data: resultado,
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

  async exportar(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const resultado = await agendamentoService.exportar(req.query, tenantId);
      res.json({
        success: true,
        data: resultado,
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
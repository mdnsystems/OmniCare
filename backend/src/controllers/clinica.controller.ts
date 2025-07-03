import { Request, Response } from 'express';
import { ClinicaService } from '../services/clinica.service';
import { TipoClinica } from '../types/enums';

export default {
  async criar(req: Request, res: Response) {
    const { tenantId, nome, tipo, logo, corPrimaria, corSecundaria, tema } = req.body;

    if (!tenantId || !nome || !tipo) {
      res.status(400).json({
        success: false,
        error: 'Tenant ID, nome e tipo são obrigatórios.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!Object.values(TipoClinica).includes(tipo as TipoClinica)) {
      res.status(400).json({
        success: false,
        error: 'Tipo de clínica inválido.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const clinica = await ClinicaService.criarClinica({
        tenantId,
        nome,
        tipo: tipo as TipoClinica,
        logo,
        corPrimaria,
        corSecundaria,
        tema
      });
      res.status(201).json({
        success: true,
        data: clinica,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('já existe')) {
          res.status(409).json({ 
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
          });
        } else {
          res.status(500).json({ 
            success: false,
            error: 'Erro ao criar clínica.',
            details: error.message,
            timestamp: new Date().toISOString(),
          });
        }
      } else {
        res.status(500).json({ 
          success: false,
          error: 'Erro ao criar clínica.',
          timestamp: new Date().toISOString(),
        });
      }
    }
  },

  async buscarPorTenantId(req: Request, res: Response) {
    const { tenantId } = req.params;

    try {
      const clinica = await ClinicaService.buscarClinicaPorTenantId(tenantId);
      res.json({
        success: true,
        data: clinica,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Clínica não encontrada.') {
        res.status(404).json({ 
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Erro ao buscar clínica.',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
          timestamp: new Date().toISOString(),
        });
      }
    }
  },

  async listar(req: Request, res: Response) {
    try {
      const clinicas = await ClinicaService.listarClinicas();
      res.json({
        success: true,
        data: clinicas || [],
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao listar clínicas.',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async atualizar(req: Request, res: Response) {
    const { tenantId } = req.params;
    const dados = req.body;

    try {
      const clinica = await ClinicaService.atualizarClinica(tenantId, dados);
      res.json({
        success: true,
        data: clinica,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Clínica não encontrada.') {
        res.status(404).json({ 
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Erro ao atualizar clínica.',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
          timestamp: new Date().toISOString(),
        });
      }
    }
  },

  async desativar(req: Request, res: Response) {
    const { tenantId } = req.params;

    try {
      const clinica = await ClinicaService.desativarClinica(tenantId);
      res.json({ 
        success: true,
        message: 'Clínica desativada com sucesso.',
        data: clinica,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Clínica não encontrada.') {
        res.status(404).json({ 
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Erro ao desativar clínica.',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
          timestamp: new Date().toISOString(),
        });
      }
    }
  },

  async ativar(req: Request, res: Response) {
    const { tenantId } = req.params;

    try {
      const clinica = await ClinicaService.ativarClinica(tenantId);
      res.json({ 
        success: true,
        message: 'Clínica ativada com sucesso.',
        data: clinica,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Clínica não encontrada.') {
        res.status(404).json({ 
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Erro ao ativar clínica.',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
          timestamp: new Date().toISOString(),
        });
      }
    }
  },

  async obterEstatisticas(req: Request, res: Response) {
    const { tenantId } = req.params;

    try {
      const estatisticas = await ClinicaService.obterEstatisticasClinica(tenantId);
      res.json({
        success: true,
        data: estatisticas,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Clínica não encontrada.') {
        res.status(404).json({ 
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Erro ao obter estatísticas.',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
          timestamp: new Date().toISOString(),
        });
      }
    }
  },

  async configurarWhatsApp(req: Request, res: Response) {
    const { tenantId } = req.params;
    const config = req.body;

    if (!config.zApiInstanceId || !config.zApiToken || !config.numeroWhatsApp) {
      res.status(400).json({
        success: false,
        error: 'zApiInstanceId, zApiToken e numeroWhatsApp são obrigatórios.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const whatsappConfig = await ClinicaService.configurarWhatsApp(tenantId, config);
      res.json({ 
        success: true,
        message: 'Configuração do WhatsApp salva com sucesso.',
        data: whatsappConfig,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Clínica não encontrada.') {
        res.status(404).json({ 
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Erro ao configurar WhatsApp.',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
          timestamp: new Date().toISOString(),
        });
      }
    }
  },

  async obterConfiguracaoWhatsApp(req: Request, res: Response) {
    const { tenantId } = req.params;

    try {
      const config = await ClinicaService.obterConfiguracaoWhatsApp(tenantId);
      res.json({
        success: true,
        data: config,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Configuração do WhatsApp não encontrada.') {
        res.status(404).json({ 
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Erro ao obter configuração do WhatsApp.',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
          timestamp: new Date().toISOString(),
        });
      }
    }
  }
}; 
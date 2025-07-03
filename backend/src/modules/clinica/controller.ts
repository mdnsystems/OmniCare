// =============================================================================
// CONTROLLER - MÓDULO DE CLÍNICAS
// =============================================================================
// 
// Controlador para operações de clínicas
// Gerencia requests e responses da API
//
// =============================================================================

import { Request, Response } from 'express';
import ClinicaService from './service';
import { ClinicaValidator } from './validation';

export class ClinicaController {
  /**
   * Cria uma nova clínica
   */
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      // Valida os dados de entrada
      const dadosValidados = ClinicaValidator.validateCreate(req.body);

      // Executa a criação passando o tenantId se disponível
      const resultado = await ClinicaService.create(dadosValidados, req.tenantId);

      return res.status(201).json({
        success: true,
        data: resultado,
        message: 'Clínica criada com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Lista todas as clínicas
   */
  static async findAll(req: Request, res: Response): Promise<Response> {
    try {
      // Valida os filtros
      const filtros = ClinicaValidator.validateFilters(req.query);

      // Executa a busca
      const resultado = await ClinicaService.findAll(filtros);

      return res.status(200).json({
        success: true,
        data: resultado.clinicas,
        pagination: resultado.pagination,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Busca uma clínica por ID
   */
  static async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID da clínica é obrigatório',
          timestamp: new Date().toISOString(),
        });
      }

      // Executa a busca
      const resultado = await ClinicaService.findById(id);

      return res.status(200).json({
        success: true,
        data: resultado,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Busca uma clínica por tenant ID
   */
  static async findByTenantId(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId } = req.params;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          error: 'Tenant ID é obrigatório',
          timestamp: new Date().toISOString(),
        });
      }

      // Executa a busca
      const resultado = await ClinicaService.findByTenantId(tenantId);

      return res.status(200).json({
        success: true,
        data: resultado,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Se a clínica não foi encontrada, retorna 404
      if (error instanceof Error && error.message === 'Clínica não encontrada') {
        return res.status(404).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
      
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Atualiza uma clínica
   */
  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID da clínica é obrigatório',
          timestamp: new Date().toISOString(),
        });
      }

      // Valida os dados de entrada
      const dadosValidados = ClinicaValidator.validateUpdate(req.body);

      // Executa a atualização
      const resultado = await ClinicaService.update(id, dadosValidados);

      return res.status(200).json({
        success: true,
        data: resultado,
        message: 'Clínica atualizada com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Ativa/desativa uma clínica
   */
  static async toggleStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID da clínica é obrigatório',
          timestamp: new Date().toISOString(),
        });
      }

      // Executa a alteração de status
      const resultado = await ClinicaService.toggleStatus(id);

      return res.status(200).json({
        success: true,
        data: resultado,
        message: `Clínica ${resultado.ativo ? 'ativada' : 'desativada'} com sucesso`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Remove uma clínica
   */
  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID da clínica é obrigatório',
          timestamp: new Date().toISOString(),
        });
      }

      // Executa a remoção
      const resultado = await ClinicaService.delete(id);

      return res.status(200).json({
        success: true,
        data: resultado,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Busca estatísticas da clínica
   */
  static async getStats(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId } = req.params;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          error: 'Tenant ID é obrigatório',
          timestamp: new Date().toISOString(),
        });
      }

      // Executa a busca das estatísticas
      const resultado = await ClinicaService.getStats(tenantId);

      return res.status(200).json({
        success: true,
        data: resultado,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Busca configurações da clínica
   */
  static async getConfiguracoes(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId } = req.params;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          error: 'Tenant ID é obrigatório',
          timestamp: new Date().toISOString(),
        });
      }

      // Executa a busca das configurações
      const resultado = await ClinicaService.getConfiguracoes(tenantId);

      return res.status(200).json({
        success: true,
        data: resultado,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Atualiza configurações da clínica
   */
  static async updateConfiguracoes(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId } = req.params;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          error: 'Tenant ID é obrigatório',
          timestamp: new Date().toISOString(),
        });
      }

      // Valida as configurações
      const configuracoes = ClinicaValidator.validateConfiguracoes(req.body);

      // Executa a atualização das configurações
      const resultado = await ClinicaService.updateConfiguracoes(tenantId, configuracoes);

      return res.status(200).json({
        success: true,
        data: resultado,
        message: 'Configurações atualizadas com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Configura integração com WhatsApp (stub)
   */
  static async configureWhatsApp(req: Request, res: Response): Promise<Response> {
    return res.status(501).json({
      success: false,
      error: 'configureWhatsApp não implementado',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Obtém configuração do WhatsApp (stub)
   */
  static async getWhatsAppConfig(req: Request, res: Response): Promise<Response> {
    return res.status(501).json({
      success: false,
      error: 'getWhatsAppConfig não implementado',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Cria template de mensagem (stub)
   */
  static async createMessageTemplate(req: Request, res: Response): Promise<Response> {
    return res.status(501).json({
      success: false,
      error: 'createMessageTemplate não implementado',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Lista templates de mensagem (stub)
   */
  static async listMessageTemplates(req: Request, res: Response): Promise<Response> {
    return res.status(501).json({
      success: false,
      error: 'listMessageTemplates não implementado',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Atualiza template de mensagem (stub)
   */
  static async updateMessageTemplate(req: Request, res: Response): Promise<Response> {
    return res.status(501).json({
      success: false,
      error: 'updateMessageTemplate não implementado',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Deleta template de mensagem (stub)
   */
  static async deleteMessageTemplate(req: Request, res: Response): Promise<Response> {
    return res.status(501).json({
      success: false,
      error: 'deleteMessageTemplate não implementado',
      timestamp: new Date().toISOString(),
    });
  }
}

export default ClinicaController; 
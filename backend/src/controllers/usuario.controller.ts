import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioRegistro, UsuarioLogin } from '../types/usuario.types';
import { RoleUsuario } from '../types/enums';

export default {
  async registrar(req: Request, res: Response) {
    const { email, senha, role, profissionalId } = req.body as UsuarioRegistro & { profissionalId?: string };
    const tenantId = req.tenantId;

    if (!tenantId) {
      res.status(400).json({ 
        message: 'Tenant ID é obrigatório. Use o header x-tenant-id.' 
      });
      return;
    }

    if (!email || !senha || !role) {
      res.status(400).json({ 
        message: 'Email, senha e role são obrigatórios.' 
      });
      return;
    }

    if (!Object.values(RoleUsuario).includes(role as RoleUsuario)) {
      res.status(400).json({ 
        message: 'Role inválida. Valores permitidos: SUPER_ADMIN, ADMIN, PROFISSIONAL, RECEPCIONISTA' 
      });
      return;
    }

    try {
      const usuario = await UsuarioService.criarUsuario(
        tenantId,
        email, 
        senha, 
        role as RoleUsuario,
        profissionalId
      );
      res.status(201).json(usuario);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('já cadastrado')) {
          res.status(409).json({ message: error.message });
        } else if (error.message.includes('não encontrada') || error.message.includes('não encontrado')) {
          res.status(404).json({ message: error.message });
        } else if (error.message.includes('inativa')) {
          res.status(403).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Erro ao registrar usuário.', error: error.message });
        }
      } else {
        res.status(500).json({ message: 'Erro ao registrar usuário.' });
      }
    }
  },

  async login(req: Request, res: Response) {
    const { email, senha, tenantId } = req.body as UsuarioLogin & { tenantId: string };

    if (!tenantId) {
      res.status(400).json({ 
        message: 'Tenant ID é obrigatório.' 
      });
      return;
    }

    if (!email || !senha) {
      res.status(400).json({ 
        message: 'Email e senha são obrigatórios.' 
      });
      return;
    }

    try {
      const resultado = await UsuarioService.autenticarUsuario(tenantId, email, senha);
      res.json(resultado);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Credenciais inválidas.') {
          res.status(401).json({ message: error.message });
        } else if (error.message.includes('inativo') || error.message.includes('inativa')) {
          res.status(403).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Erro ao fazer login.', error: error.message });
        }
      } else {
        res.status(500).json({ message: 'Erro ao fazer login.' });
      }
    }
  },

  async listar(req: Request, res: Response) {
    const tenantId = req.tenantId;

    if (!tenantId) {
      res.status(400).json({ 
        success: false,
        message: 'Tenant ID é obrigatório. Use o header x-tenant-id.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const usuarios = await UsuarioService.listarUsuarios(tenantId);
      res.json({
        success: true,
        data: usuarios || [],
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erro ao listar usuários.',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async listarAtivos(req: Request, res: Response) {
    const tenantId = req.tenantId;

    if (!tenantId) {
      res.status(400).json({ 
        success: false,
        message: 'Tenant ID é obrigatório. Use o header x-tenant-id.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const usuarios = await UsuarioService.listarUsuariosAtivos(tenantId);
      res.json({
        success: true,
        data: usuarios || [],
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erro ao listar usuários ativos.',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      });
    }
  },

  async buscarPorId(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.tenantId;

    if (!tenantId) {
      res.status(400).json({ 
        success: false,
        message: 'Tenant ID é obrigatório. Use o header x-tenant-id.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const usuario = await UsuarioService.buscarUsuarioPorId(tenantId, id);
      res.json({
        success: true,
        data: usuario,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Usuário não encontrado.') {
        res.status(404).json({ 
          success: false,
          message: error.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(500).json({ 
          success: false,
          message: 'Erro ao buscar usuário.',
          error: error instanceof Error ? error.message : 'Erro desconhecido',
          timestamp: new Date().toISOString(),
        });
      }
    }
  },

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const dados = req.body;
    const tenantId = req.tenantId;

    if (!tenantId) {
      res.status(400).json({ 
        message: 'Tenant ID é obrigatório. Use o header x-tenant-id.' 
      });
      return;
    }

    try {
      const usuario = await UsuarioService.atualizarUsuario(tenantId, id, dados);
      res.json(usuario);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Usuário não encontrado.') {
          res.status(404).json({ message: error.message });
        } else if (error.message.includes('já está em uso')) {
          res.status(409).json({ message: error.message });
        } else if (error.message.includes('não encontrado')) {
          res.status(404).json({ message: error.message });
        } else {
          res.status(500).json({ 
            message: 'Erro ao atualizar usuário.',
            error: error.message
          });
        }
      } else {
        res.status(500).json({ message: 'Erro ao atualizar usuário.' });
      }
    }
  },

  async alterarSenha(req: Request, res: Response) {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;
    const tenantId = req.tenantId;

    if (!tenantId) {
      res.status(400).json({ 
        message: 'Tenant ID é obrigatório. Use o header x-tenant-id.' 
      });
      return;
    }

    if (!senhaAtual || !novaSenha) {
      res.status(400).json({ 
        message: 'Senha atual e nova senha são obrigatórias.' 
      });
      return;
    }

    try {
      const usuario = await UsuarioService.alterarSenha(tenantId, id, senhaAtual, novaSenha);
      res.json({ message: 'Senha alterada com sucesso.', usuario });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Usuário não encontrado.') {
          res.status(404).json({ message: error.message });
        } else if (error.message === 'Senha atual incorreta.') {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ 
            message: 'Erro ao alterar senha.',
            error: error.message
          });
        }
      } else {
        res.status(500).json({ message: 'Erro ao alterar senha.' });
      }
    }
  },

  async desativar(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.tenantId;

    if (!tenantId) {
      res.status(400).json({ 
        message: 'Tenant ID é obrigatório. Use o header x-tenant-id.' 
      });
      return;
    }

    try {
      const usuario = await UsuarioService.desativarUsuario(tenantId, id);
      res.json({ message: 'Usuário desativado com sucesso.', usuario });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Usuário não encontrado.') {
          res.status(404).json({ message: error.message });
        } else {
          res.status(500).json({ 
            message: 'Erro ao desativar usuário.',
            error: error.message
          });
        }
      } else {
        res.status(500).json({ message: 'Erro ao desativar usuário.' });
      }
    }
  }
}; 
// =============================================================================
// SERVICE - MÓDULO DE AUTENTICAÇÃO
// =============================================================================
// 
// Lógica de negócio para autenticação e autorização
// Implementa login, registro, refresh tokens e validações
//
// =============================================================================

import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database';
import JwtUtils from '../../utils/jwt';
import { RoleUsuario } from '../../types/enums';
import config from '../../config/environment';
import {
  LoginInput,
  RegisterInput,
  RefreshTokenInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './validation';

export class AuthService {
  /**
   * Realiza o login do usuário
   */
  static async login(data: LoginInput) {
    const { email, senha, tenantId } = data;

    // Busca o usuário pelo email
    const usuario = await prisma.usuario.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        ...(tenantId && { tenantId }),
      },
      include: {
        clinica: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            ativo: true,
          },
        },
        profissional: {
          select: {
            id: true,
            nome: true,
            especialidade: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    if (!usuario) {
      throw new Error('Email ou senha inválidos');
    }

    // Verifica se o usuário está ativo
    if (!usuario.ativo) {
      throw new Error('Usuário inativo');
    }

    // Verifica se a clínica está ativa
    if (!usuario.clinica.ativo) {
      throw new Error('Clínica inativa');
    }

    // Verifica a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('Email ou senha inválidos');
    }

    // Gera os tokens
    const tokens = JwtUtils.generateTokens(
      usuario.id,
      usuario.tenantId,
      usuario.role as RoleUsuario,
      usuario.email
    );

    // Remove a senha do retorno
    const { senha: _, ...usuarioSemSenha } = usuario;

    return {
      usuario: usuarioSemSenha,
      ...tokens,
    };
  }

  /**
   * Registra um novo usuário
   */
  static async register(data: RegisterInput) {
    const { email, senha, role, tenantId, profissionalId } = data;

    // Verifica se a clínica existe e está ativa
    const clinica = await prisma.clinica.findUnique({
      where: { tenantId },
      select: { id: true, ativo: true },
    });

    if (!clinica) {
      throw new Error('Clínica não encontrada');
    }

    if (!clinica.ativo) {
      throw new Error('Clínica inativa');
    }

    // Verifica se o email já existe no tenant
    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        tenantId,
      },
    });

    if (usuarioExistente) {
      throw new Error('Email já cadastrado nesta clínica');
    }

    // Se for profissional, verifica se o profissionalId existe
    if (role === RoleUsuario.PROFISSIONAL && profissionalId) {
      const profissional = await prisma.profissional.findFirst({
        where: {
          id: profissionalId,
          tenantId,
        },
      });

      if (!profissional) {
        throw new Error('Profissional não encontrado');
      }
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, config.security.bcryptRounds);

    // Cria o usuário
    const usuario = await prisma.usuario.create({
      data: {
        email: email.toLowerCase().trim(),
        senha: senhaCriptografada,
        role,
        tenantId,
        profissionalId: role === RoleUsuario.PROFISSIONAL ? profissionalId : null,
      },
      include: {
        clinica: {
          select: {
            id: true,
            nome: true,
            tipo: true,
          },
        },
        profissional: {
          select: {
            id: true,
            nome: true,
            especialidade: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    // Gera os tokens
    const tokens = JwtUtils.generateTokens(
      usuario.id,
      usuario.tenantId,
      usuario.role as RoleUsuario,
      usuario.email
    );

    // Remove a senha do retorno
    const { senha: _, ...usuarioSemSenha } = usuario;

    return {
      usuario: usuarioSemSenha,
      ...tokens,
    };
  }

  /**
   * Renova o token de acesso usando refresh token
   */
  static async refreshToken(data: RefreshTokenInput) {
    const { refreshToken } = data;

    try {
      // Verifica o refresh token
      const decoded = JwtUtils.verifyRefreshToken(refreshToken);

      // Busca o usuário
      const usuario = await prisma.usuario.findUnique({
        where: { id: decoded.userId },
        include: {
          clinica: {
            select: {
              id: true,
              nome: true,
              tipo: true,
              ativo: true,
            },
          },
        },
      });

      if (!usuario || !usuario.ativo || !usuario.clinica.ativo) {
        throw new Error('Usuário ou clínica inativo');
      }

      // Gera novos tokens
      const tokens = JwtUtils.generateTokens(
        usuario.id,
        usuario.tenantId,
        usuario.role as RoleUsuario,
        usuario.email
      );

      // Remove a senha do retorno
      const { senha: _, ...usuarioSemSenha } = usuario;

      return {
        usuario: usuarioSemSenha,
        ...tokens,
      };
    } catch (error) {
      throw new Error('Refresh token inválido ou expirado');
    }
  }

  /**
   * Altera a senha do usuário
   */
  static async changePassword(userId: string, data: ChangePasswordInput) {
    const { senhaAtual, novaSenha } = data;

    // Busca o usuário
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Verifica a senha atual
    const senhaAtualValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaAtualValida) {
      throw new Error('Senha atual incorreta');
    }

    // Verifica se a nova senha é diferente da atual
    const novaSenhaIgual = await bcrypt.compare(novaSenha, usuario.senha);
    if (novaSenhaIgual) {
      throw new Error('A nova senha deve ser diferente da senha atual');
    }

    // Criptografa a nova senha
    const novaSenhaCriptografada = await bcrypt.hash(novaSenha, config.security.bcryptRounds);

    // Atualiza a senha
    await prisma.usuario.update({
      where: { id: userId },
      data: { senha: novaSenhaCriptografada },
    });

    return { message: 'Senha alterada com sucesso' };
  }

  /**
   * Solicita recuperação de senha
   */
  static async forgotPassword(data: ForgotPasswordInput) {
    const { email } = data;

    // Busca o usuário pelo email
    const usuario = await prisma.usuario.findFirst({
      where: {
        email: email.toLowerCase().trim(),
      },
      include: {
        clinica: {
          select: {
            id: true,
            nome: true,
            ativo: true,
          },
        },
      },
    });

    if (!usuario || !usuario.ativo || !usuario.clinica.ativo) {
      // Não revela se o email existe ou não
      return { message: 'Se o email existir, você receberá instruções de recuperação' };
    }

    // TODO: Implementar lógica de reset de senha
    // Por enquanto, apenas retorna mensagem de sucesso
    return { 
      message: 'Se o email existir, você receberá instruções de recuperação'
    };
  }

  /**
   * Reseta a senha usando token
   */
  static async resetPassword(data: ResetPasswordInput) {
    const { token, novaSenha } = data;

    // TODO: Implementar verificação de token e reset de senha
    // Por enquanto, retorna erro informando que a funcionalidade não está implementada
    throw new Error('Funcionalidade de reset de senha não implementada');
  }

  /**
   * Verifica se um token é válido
   */
  static async verifyToken(token: string) {
    try {
      const decoded = JwtUtils.verifyAccessToken(token);

      const usuario = await prisma.usuario.findUnique({
        where: { id: decoded.userId },
        include: {
          clinica: {
            select: {
              id: true,
              nome: true,
              tipo: true,
              ativo: true,
            },
          },
          profissional: {
            select: {
              id: true,
              nome: true,
              especialidade: {
                select: {
                  id: true,
                  nome: true,
                },
              },
            },
          },
        },
      });

      if (!usuario || !usuario.ativo || !usuario.clinica.ativo) {
        throw new Error('Usuário ou clínica inativo');
      }

      // Remove a senha do retorno
      const { senha: _, ...usuarioSemSenha } = usuario;

      return {
        valid: true,
        usuario: usuarioSemSenha,
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Token inválido ou expirado',
      };
    }
  }

  /**
   * Busca o perfil do usuário
   */
  static async getProfile(userId: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        clinica: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            ativo: true,
          },
        },
        profissional: {
          select: {
            id: true,
            nome: true,
            especialidade: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Remove a senha do retorno
    const { senha: _, ...usuarioSemSenha } = usuario;

    return usuarioSemSenha;
  }
}

export default AuthService; 
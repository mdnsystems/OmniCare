import prisma from './prisma';
import { RoleUsuario } from '../types/enums';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export class UsuarioService {
  static async criarUsuario(
    tenantId: string,
    email: string, 
    senha: string, 
    role: RoleUsuario,
    profissionalId?: string
  ) {
    // Verificar se a clínica existe
    const clinica = await prisma.clinica.findUnique({
      where: { tenantId },
      select: { id: true, ativo: true }
    });

    if (!clinica) {
      throw new Error('Clínica não encontrada.');
    }

    if (!clinica.ativo) {
      throw new Error('Clínica inativa.');
    }

    // Verificar se o usuário já existe na clínica
    const usuarioExistente = await prisma.usuario.findFirst({
      where: { 
        tenantId,
        email 
      }
    });

    if (usuarioExistente) {
      throw new Error('Usuário já cadastrado nesta clínica.');
    }

    // Se profissionalId foi fornecido, verificar se existe
    if (profissionalId) {
      const profissional = await prisma.profissional.findFirst({
        where: { 
          id: profissionalId,
          tenantId 
        }
      });

      if (!profissional) {
        throw new Error('Profissional não encontrado.');
      }
    }

    const hash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: { 
        tenantId,
        email, 
        senha: hash, 
        role,
        profissionalId 
      },
      include: {
        clinica: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            corPrimaria: true,
            corSecundaria: true,
            tema: true
          }
        },
        profissional: {
          select: {
            id: true,
            nome: true,
            especialidade: {
              select: {
                id: true,
                nome: true
              }
            }
          }
        }
      }
    });

    return {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
      ativo: usuario.ativo,
      clinica: usuario.clinica,
      profissional: usuario.profissional
    };
  }

  static async autenticarUsuario(tenantId: string, email: string, senha: string) {
    const usuario = await prisma.usuario.findFirst({
      where: { 
        tenantId,
        email 
      },
      include: {
        clinica: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            corPrimaria: true,
            corSecundaria: true,
            tema: true,
            ativo: true
          }
        },
        profissional: {
          select: {
            id: true,
            nome: true,
            especialidade: {
              select: {
                id: true,
                nome: true
              }
            }
          }
        }
      }
    });

    if (!usuario) {
      throw new Error('Credenciais inválidas.');
    }

    if (!usuario.ativo) {
      throw new Error('Usuário inativo.');
    }

    if (!usuario.clinica.ativo) {
      throw new Error('Clínica inativa.');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('Credenciais inválidas.');
    }

    const token = jwt.sign(
      { 
        id: usuario.id, 
        role: usuario.role,
        tenantId: usuario.tenantId,
        profissionalId: usuario.profissionalId
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role,
        ativo: usuario.ativo,
        clinica: usuario.clinica,
        profissional: usuario.profissional
      }
    };
  }

  static async listarUsuarios(tenantId: string) {
    return await prisma.usuario.findMany({
      where: { 
        tenantId,
        ativo: true 
      },
      select: {
        id: true,
        email: true,
        role: true,
        ativo: true,
        createdAt: true,
        profissional: {
          select: {
            id: true,
            nome: true,
            especialidade: {
              select: {
                id: true,
                nome: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async listarUsuariosAtivos(tenantId: string) {
    return await prisma.usuario.findMany({
      where: { 
        tenantId,
        ativo: true 
      },
      select: {
        id: true,
        email: true,
        role: true,
        ativo: true,
        createdAt: true,
        profissional: {
          select: {
            id: true,
            nome: true,
            especialidade: {
              select: {
                id: true,
                nome: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async buscarUsuarioPorId(tenantId: string, id: string) {
    const usuario = await prisma.usuario.findFirst({
      where: { 
        id,
        tenantId 
      },
      include: {
        clinica: {
          select: {
            id: true,
            nome: true,
            tipo: true
          }
        },
        profissional: {
          select: {
            id: true,
            nome: true,
            especialidade: {
              select: {
                id: true,
                nome: true
              }
            }
          }
        }
      }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    return usuario;
  }

  static async atualizarUsuario(
    tenantId: string,
    id: string,
    dados: {
      email?: string;
      role?: RoleUsuario;
      profissionalId?: string;
      ativo?: boolean;
    }
  ) {
    const usuario = await prisma.usuario.findFirst({
      where: { 
        id,
        tenantId 
      }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    // Se email foi alterado, verificar se já existe
    if (dados.email && dados.email !== usuario.email) {
      const emailExistente = await prisma.usuario.findFirst({
        where: { 
          tenantId,
          email: dados.email 
        }
      });

      if (emailExistente) {
        throw new Error('Email já está em uso.');
      }
    }

    // Se profissionalId foi fornecido, verificar se existe
    if (dados.profissionalId) {
      const profissional = await prisma.profissional.findFirst({
        where: { 
          id: dados.profissionalId,
          tenantId 
        }
      });

      if (!profissional) {
        throw new Error('Profissional não encontrado.');
      }
    }

    return await prisma.usuario.update({
      where: { id },
      data: dados,
      include: {
        clinica: {
          select: {
            id: true,
            nome: true,
            tipo: true
          }
        },
        profissional: {
          select: {
            id: true,
            nome: true,
            especialidade: {
              select: {
                id: true,
                nome: true
              }
            }
          }
        }
      }
    });
  }

  static async alterarSenha(
    tenantId: string,
    id: string,
    senhaAtual: string,
    novaSenha: string
  ) {
    const usuario = await prisma.usuario.findFirst({
      where: { 
        id,
        tenantId 
      }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) {
      throw new Error('Senha atual incorreta.');
    }

    const hash = await bcrypt.hash(novaSenha, 10);
    
    return await prisma.usuario.update({
      where: { id },
      data: { senha: hash },
      select: {
        id: true,
        email: true,
        role: true,
        ativo: true
      }
    });
  }

  static async desativarUsuario(tenantId: string, id: string) {
    const usuario = await prisma.usuario.findFirst({
      where: { 
        id,
        tenantId 
      }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    return await prisma.usuario.update({
      where: { id },
      data: { ativo: false },
      select: {
        id: true,
        email: true,
        role: true,
        ativo: true
      }
    });
  }
} 
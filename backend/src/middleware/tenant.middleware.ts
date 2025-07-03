import { Request, Response, NextFunction } from 'express';
import prisma from '../services/prisma';

// Extend Request interface to include tenantId
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

export const tenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extrair tenant_id do header, query ou body
    const tenantId = 
      req.headers['x-tenant-id'] as string ||
      req.query.tenantId as string ||
      req.body.tenantId as string;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Tenant ID é obrigatório',
        message: 'O header x-tenant-id, query parameter tenantId ou body tenantId deve ser fornecido'
      });
    }

    // Validar se a clínica existe e está ativa
    const clinica = await prisma.clinica.findUnique({
      where: { tenantId },
      select: { id: true, ativo: true }
    });

    if (!clinica) {
      return res.status(404).json({
        error: 'Clínica não encontrada',
        message: `Clínica com tenant ID ${tenantId} não foi encontrada`
      });
    }

    if (!clinica.ativo) {
      return res.status(403).json({
        error: 'Clínica inativa',
        message: 'Esta clínica está inativa e não pode acessar o sistema'
      });
    }

    // Adicionar tenantId à requisição
    req.tenantId = tenantId;
    next();
  } catch (error) {
    console.error('Erro no middleware de tenant:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao processar tenant ID'
    });
  }
};

// Middleware opcional para rotas que não precisam de tenant
export const optionalTenantMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tenantId = 
    req.headers['x-tenant-id'] as string ||
    req.query.tenantId as string ||
    req.body.tenantId as string;

  if (tenantId) {
    req.tenantId = tenantId;
  }
  
  next();
}; 
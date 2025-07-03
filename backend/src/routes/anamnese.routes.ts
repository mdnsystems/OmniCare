import { Router, Request, Response } from 'express';
import anamneseController from '../controllers/anamnese.controller';
import { anamneseSchema } from '../validators/anamnese.validator';
import { AuthorizationMiddleware } from '../middleware/authorization';
import { RoleUsuario } from '../types/enums';

const router = Router();

// Middleware de validação
const validateAnamnese = (req: Request, res: Response, next: Function) => {
  try {
    anamneseSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: 'Dados inválidos: ' + error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

// Rotas para PROFISSIONAL e ADMIN
router.post('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  validateAnamnese,
  anamneseController.create
);

router.get('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  anamneseController.findAll
);

router.get('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  async (req: Request<{ id: string }>, res: Response) => {
    await anamneseController.findById(req, res);
  }
);

router.put('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  validateAnamnese,
  anamneseController.update
);

router.delete('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  anamneseController.delete
);

router.get('/:id/relations', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  anamneseController.checkRelations
);

export default router; 
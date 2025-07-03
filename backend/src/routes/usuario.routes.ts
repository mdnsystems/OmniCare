import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller';
import { TenantMiddleware } from '../middleware/injectTenant';
import { AuthorizationMiddleware } from '../middleware/authorization';
import { RoleUsuario } from '../types/enums';

const router = Router();

// Rotas públicas (não precisam de autenticação)
router.post('/login', UsuarioController.login);

// Rotas que precisam de autenticação
router.post('/registrar', 
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.SUPER_ADMIN]),
  UsuarioController.registrar
);

router.get('/listar', 
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.SUPER_ADMIN]),
  UsuarioController.listar
);

// Rota para listar usuários ativos (acessível a todos os usuários autenticados)
router.get('/ativos', 
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.SUPER_ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  UsuarioController.listarAtivos
);

router.get('/:id', 
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.SUPER_ADMIN]),
  UsuarioController.buscarPorId
);

router.put('/:id/atualizar', 
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.SUPER_ADMIN]),
  UsuarioController.atualizar
);

router.put('/:id/alterar-senha', 
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.SUPER_ADMIN]),
  UsuarioController.alterarSenha
);

router.delete('/:id/desativar', 
  TenantMiddleware.injectTenant,
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.SUPER_ADMIN]),
  UsuarioController.desativar
);

export default router; 
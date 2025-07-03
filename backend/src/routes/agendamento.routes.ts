import { Router, Request, Response } from 'express';
import agendamentoController from '../controllers/agendamento.controller';
import { TenantMiddleware } from '../middleware/injectTenant';
import { AuthorizationMiddleware } from '../middleware/authorization';
import { RoleUsuario } from '../types/enums';

const router = Router();

// Aplicar middleware de tenant em todas as rotas
router.use(TenantMiddleware.injectTenant);

// Rotas para todas as roles autorizadas
router.post('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.create
);

router.get('/', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.findAll
);

router.get('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  async (req: Request<{ id: string }>, res: Response) => {
    await agendamentoController.findById(req, res);
  }
);

router.put('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.update
);

router.delete('/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  agendamentoController.delete
);

// Endpoints específicos de agendamentos
router.put('/:id/confirmar', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.confirmar
);

router.put('/:id/cancelar', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.cancelar
);

router.put('/:id/remarcar', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.remarcar
);

router.put('/:id/realizar', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  agendamentoController.realizar
);

// Agendamentos por data
router.get('/data/:data', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.findByData
);

// Agendamentos por profissional
router.get('/profissional/:profissionalId', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.findByProfissional
);

// Agendamentos por paciente
router.get('/paciente/:pacienteId', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.findByPaciente
);

// Agendamentos de hoje
router.get('/hoje', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.findHoje
);

// Agendamentos da semana
router.get('/semana', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.findSemana
);

// Agendamentos do mês
router.get('/mes', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.findMes
);

// Confirmação via link
router.post('/confirmar-via-link', 
  agendamentoController.confirmarViaLink
);

// Cancelamento via link
router.post('/cancelar-via-link', 
  agendamentoController.cancelarViaLink
);

// Verificar disponibilidade
router.post('/verificar-disponibilidade', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.verificarDisponibilidade
);

// Horários disponíveis
router.get('/horarios-disponiveis/:profissionalId', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.getHorariosDisponiveis
);

// Estatísticas
router.get('/estatisticas', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  agendamentoController.getEstatisticas
);

// Enviar lembrete
router.post('/enviar-lembrete/:id', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL, RoleUsuario.RECEPCIONISTA]),
  agendamentoController.enviarLembrete
);

// Importar agendamentos
router.post('/importar', 
  AuthorizationMiddleware.requireAdmin,
  agendamentoController.importar
);

// Exportar agendamentos
router.get('/exportar', 
  AuthorizationMiddleware.requireAnyRole([RoleUsuario.ADMIN, RoleUsuario.PROFISSIONAL]),
  agendamentoController.exportar
);

export default router; 
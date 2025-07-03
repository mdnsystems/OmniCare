import { Router } from 'express';
import ClinicaController from '../controllers/clinica.controller';

const router = Router();

// Rotas públicas (não precisam de tenant)
router.post('/criar', ClinicaController.criar);
router.get('/listar', ClinicaController.listar);
router.get('/:tenantId', ClinicaController.buscarPorTenantId);

// Rotas administrativas
router.put('/:tenantId/atualizar', ClinicaController.atualizar);
router.put('/:tenantId/ativar', ClinicaController.ativar);
router.put('/:tenantId/desativar', ClinicaController.desativar);
router.get('/:tenantId/estatisticas', ClinicaController.obterEstatisticas);

// Rotas de configuração do WhatsApp
router.post('/:tenantId/whatsapp/configurar', ClinicaController.configurarWhatsApp);
router.get('/:tenantId/whatsapp/configuracao', ClinicaController.obterConfiguracaoWhatsApp);

export default router; 
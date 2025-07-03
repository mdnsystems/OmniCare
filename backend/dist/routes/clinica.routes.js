"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clinica_controller_1 = __importDefault(require("../controllers/clinica.controller"));
const router = (0, express_1.Router)();
// Rotas públicas (não precisam de tenant)
router.post('/criar', clinica_controller_1.default.criar);
router.get('/listar', clinica_controller_1.default.listar);
router.get('/:tenantId', clinica_controller_1.default.buscarPorTenantId);
// Rotas administrativas
router.put('/:tenantId/atualizar', clinica_controller_1.default.atualizar);
router.put('/:tenantId/ativar', clinica_controller_1.default.ativar);
router.put('/:tenantId/desativar', clinica_controller_1.default.desativar);
router.get('/:tenantId/estatisticas', clinica_controller_1.default.obterEstatisticas);
// Rotas de configuração do WhatsApp
router.post('/:tenantId/whatsapp/configurar', clinica_controller_1.default.configurarWhatsApp);
router.get('/:tenantId/whatsapp/configuracao', clinica_controller_1.default.obterConfiguracaoWhatsApp);
exports.default = router;
//# sourceMappingURL=clinica.routes.js.map
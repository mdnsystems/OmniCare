"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalTenantMiddleware = exports.tenantMiddleware = void 0;
const prisma_1 = __importDefault(require("../services/prisma"));
const tenantMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extrair tenant_id do header, query ou body
        const tenantId = req.headers['x-tenant-id'] ||
            req.query.tenantId ||
            req.body.tenantId;
        if (!tenantId) {
            return res.status(400).json({
                error: 'Tenant ID é obrigatório',
                message: 'O header x-tenant-id, query parameter tenantId ou body tenantId deve ser fornecido'
            });
        }
        // Validar se a clínica existe e está ativa
        const clinica = yield prisma_1.default.clinica.findUnique({
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
    }
    catch (error) {
        console.error('Erro no middleware de tenant:', error);
        return res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Erro ao processar tenant ID'
        });
    }
});
exports.tenantMiddleware = tenantMiddleware;
// Middleware opcional para rotas que não precisam de tenant
const optionalTenantMiddleware = (req, res, next) => {
    const tenantId = req.headers['x-tenant-id'] ||
        req.query.tenantId ||
        req.body.tenantId;
    if (tenantId) {
        req.tenantId = tenantId;
    }
    next();
};
exports.optionalTenantMiddleware = optionalTenantMiddleware;
//# sourceMappingURL=tenant.middleware.js.map
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
const prisma_1 = __importDefault(require("./prisma"));
class MessageTemplateService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.messageTemplate.create({
                data: Object.assign(Object.assign({}, data), { tenantId: data.tenantId, variaveis: data.variaveis || [] }),
            });
        });
    }
    static findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            const { page = 1, limit = 10, tipo, ativo } = filters;
            const skip = (page - 1) * limit;
            const where = {};
            if (tipo)
                where.tipo = tipo;
            if (ativo !== undefined)
                where.ativo = ativo;
            const [templates, total] = yield Promise.all([
                prisma_1.default.messageTemplate.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                }),
                prisma_1.default.messageTemplate.count({ where }),
            ]);
            return {
                data: templates,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.messageTemplate.findUnique({
                where: { id },
            });
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = Object.assign({}, data);
            if (data.variaveis)
                updateData.variaveis = data.variaveis;
            return yield prisma_1.default.messageTemplate.update({
                where: { id },
                data: updateData,
            });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.messageTemplate.delete({
                where: { id },
            });
        });
    }
    static findByTipo(tipo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.messageTemplate.findMany({
                where: { tipo, ativo: true },
                orderBy: { nome: 'asc' },
            });
        });
    }
    static findAtivos() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.messageTemplate.findMany({
                where: { ativo: true },
                orderBy: { tipo: 'asc', nome: 'asc' },
            });
        });
    }
    static ativar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.messageTemplate.update({
                where: { id },
                data: { ativo: true },
            });
        });
    }
    static desativar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.messageTemplate.update({
                where: { id },
                data: { ativo: false },
            });
        });
    }
    static duplicar(id, nome) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield prisma_1.default.messageTemplate.findUnique({
                where: { id },
            });
            if (!template) {
                throw new Error('Template não encontrado');
            }
            return yield prisma_1.default.messageTemplate.create({
                data: {
                    tenantId: template.tenantId,
                    nome,
                    tipo: template.tipo,
                    template: template.template,
                    variaveis: template.variaveis,
                    ativo: false, // Duplicado começa desativado
                },
            });
        });
    }
    // Método para processar template com variáveis
    static processarTemplate(template, variaveis) {
        let resultado = template;
        // Substituir variáveis no formato {{variavel}}
        for (const [chave, valor] of Object.entries(variaveis)) {
            const regex = new RegExp(`{{${chave}}}`, 'g');
            resultado = resultado.replace(regex, String(valor));
        }
        return resultado;
    }
    // Método para validar template
    static validarTemplate(template, variaveis) {
        const erros = [];
        // Verificar se há variáveis não definidas
        const variaveisNoTemplate = template.match(/{{([^}]+)}}/g) || [];
        const variaveisDefinidas = new Set(variaveis);
        for (const variavel of variaveisNoTemplate) {
            const nomeVariavel = variavel.replace(/[{}]/g, '');
            if (!variaveisDefinidas.has(nomeVariavel)) {
                erros.push(`Variável "${nomeVariavel}" não está definida`);
            }
        }
        // Verificar se há variáveis definidas mas não usadas
        for (const variavel of variaveis) {
            if (!template.includes(`{{${variavel}}}`)) {
                erros.push(`Variável "${variavel}" está definida mas não é usada no template`);
            }
        }
        return {
            valido: erros.length === 0,
            erros,
        };
    }
}
exports.default = MessageTemplateService;
//# sourceMappingURL=message-template.service.js.map
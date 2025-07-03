"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profissionalSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
exports.profissionalSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3),
    especialidadeId: zod_1.z.string().uuid(),
    registro: zod_1.z.string(),
    crm: zod_1.z.string(),
    email: zod_1.z.string().email(),
    telefone: zod_1.z.string(),
    sexo: zod_1.z.string(),
    dataNascimento: zod_1.z.string(),
    dataContratacao: zod_1.z.string(),
    status: zod_1.z.nativeEnum(enums_1.ProfissionalStatus),
    rua: zod_1.z.string(),
    numero: zod_1.z.string(),
    complemento: zod_1.z.string().optional(),
    bairro: zod_1.z.string(),
    cidade: zod_1.z.string(),
    estado: zod_1.z.string().length(2),
    cep: zod_1.z.string(),
    horarioInicio: zod_1.z.string(),
    horarioFim: zod_1.z.string(),
    intervalo: zod_1.z.string(),
    diasTrabalho: zod_1.z.array(zod_1.z.string()),
});
//# sourceMappingURL=profissional.validator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prontuarioSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
exports.prontuarioSchema = zod_1.z.object({
    pacienteId: zod_1.z.string().uuid(),
    profissionalId: zod_1.z.string().uuid(),
    data: zod_1.z.string(),
    tipo: zod_1.z.nativeEnum(enums_1.TipoProntuario),
    descricao: zod_1.z.string(),
    diagnostico: zod_1.z.string().optional(),
    prescricao: zod_1.z.string().optional(),
    observacoes: zod_1.z.string().optional(),
});
//# sourceMappingURL=prontuario.validator.js.map
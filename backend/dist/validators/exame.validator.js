"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exameSchema = void 0;
const zod_1 = require("zod");
exports.exameSchema = zod_1.z.object({
    prontuarioId: zod_1.z.string().uuid(),
    tipo: zod_1.z.string(),
    data: zod_1.z.string(),
    resultado: zod_1.z.string(),
    observacoes: zod_1.z.string().optional(),
    arquivo: zod_1.z.string().optional(),
});
//# sourceMappingURL=exame.validator.js.map
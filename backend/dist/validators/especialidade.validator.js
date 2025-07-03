"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.especialidadeSchema = void 0;
const zod_1 = require("zod");
exports.especialidadeSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3),
    descricao: zod_1.z.string().min(5),
});
//# sourceMappingURL=especialidade.validator.js.map
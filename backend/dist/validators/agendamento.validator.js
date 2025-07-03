"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agendamentoSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
exports.agendamentoSchema = zod_1.z.object({
    pacienteId: zod_1.z.string().uuid(),
    profissionalId: zod_1.z.string().uuid(),
    data: zod_1.z.string(),
    horaInicio: zod_1.z.string(),
    horaFim: zod_1.z.string(),
    tipo: zod_1.z.nativeEnum(enums_1.TipoAgendamento),
    status: zod_1.z.nativeEnum(enums_1.StatusAgendamento).optional().default(enums_1.StatusAgendamento.AGENDADO),
    observacoes: zod_1.z.string().optional(),
});
//# sourceMappingURL=agendamento.validator.js.map
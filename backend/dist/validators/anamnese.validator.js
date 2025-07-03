"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anamneseSchema = void 0;
const zod_1 = require("zod");
exports.anamneseSchema = zod_1.z.object({
    pacienteId: zod_1.z.string().uuid(),
    profissionalId: zod_1.z.string().uuid(),
    prontuarioId: zod_1.z.string().uuid(),
    data: zod_1.z.string(),
    altura: zod_1.z.number().optional(),
    peso: zod_1.z.number().optional(),
    imc: zod_1.z.number().optional(),
    circunferenciaAbdominal: zod_1.z.number().optional(),
    historicoFamiliar: zod_1.z.string().optional(),
    alergias: zod_1.z.string().optional(),
    medicacoes: zod_1.z.string().optional(),
    cirurgias: zod_1.z.string().optional(),
    atividadeFisica: zod_1.z.string().optional(),
    tabagismo: zod_1.z.string().optional(),
    alcoolismo: zod_1.z.string().optional(),
    sono: zod_1.z.string().optional(),
    estresse: zod_1.z.string().optional(),
    suplementos: zod_1.z.string().optional(),
    refeicoesPorDia: zod_1.z.number().optional(),
    horarioRefeicoes: zod_1.z.string().optional(),
    preferencias: zod_1.z.string().optional(),
    restricoes: zod_1.z.string().optional(),
    consumoAgua: zod_1.z.string().optional(),
    outrosLiquidos: zod_1.z.string().optional(),
    memoria: zod_1.z.string().optional(),
    concentracao: zod_1.z.string().optional(),
    humor: zod_1.z.string().optional(),
    qualidadeSono: zod_1.z.string().optional(),
});
//# sourceMappingURL=anamnese.validator.js.map
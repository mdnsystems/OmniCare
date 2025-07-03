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
const enums_1 = require("../types/enums");
exports.default = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const profissionalData = Object.assign(Object.assign({}, data), { dataNascimento: new Date(data.dataNascimento), dataContratacao: new Date(data.dataContratacao), status: data.status });
            return prisma_1.default.profissional.create({ data: profissionalData });
        });
    },
    findAll(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.profissional.findMany({
                where: tenantId ? { tenantId } : undefined,
                include: {
                    especialidade: true
                }
            });
        });
    },
    findAtivos(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.profissional.findMany({
                where: Object.assign(Object.assign({}, (tenantId && { tenantId })), { status: enums_1.ProfissionalStatus.ATIVO }),
                include: {
                    especialidade: true
                }
            });
        });
    },
    findById(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.profissional.findUnique({
                where: Object.assign({ id }, (tenantId && { tenantId })),
                include: {
                    especialidade: true
                }
            });
        });
    },
    update(id, data, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profissionalData = Object.assign(Object.assign({}, data), { dataNascimento: new Date(data.dataNascimento), dataContratacao: new Date(data.dataContratacao), status: data.status });
            return prisma_1.default.profissional.update({
                where: Object.assign({ id }, (tenantId && { tenantId })),
                data: profissionalData,
                include: {
                    especialidade: true
                }
            });
        });
    },
    delete(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.profissional.delete({
                where: Object.assign({ id }, (tenantId && { tenantId }))
            });
        });
    }
};
//# sourceMappingURL=profissional.service.js.map
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
exports.default = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const exameData = Object.assign(Object.assign({}, data), { data: new Date(data.data), arquivos: data.arquivos });
            return prisma_1.default.exame.create({ data: exameData });
        });
    },
    findAll(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.exame.findMany({
                where: tenantId ? { tenantId } : undefined,
                include: {
                    prontuario: true
                }
            });
        });
    },
    findById(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.exame.findUnique({
                where: Object.assign({ id }, (tenantId && { tenantId })),
                include: {
                    prontuario: true
                }
            });
        });
    },
    update(id, data, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const exameData = Object.assign(Object.assign(Object.assign({}, data), { data: new Date(data.data) }), (data.arquivos && { arquivos: data.arquivos }));
            return prisma_1.default.exame.update({
                where: Object.assign({ id }, (tenantId && { tenantId })),
                data: exameData,
                include: {
                    prontuario: true
                }
            });
        });
    },
    delete(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.exame.delete({
                where: Object.assign({ id }, (tenantId && { tenantId }))
            });
        });
    }
};
//# sourceMappingURL=exame.service.js.map
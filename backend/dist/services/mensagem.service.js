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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
exports.default = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { arquivos } = data, mensagemData = __rest(data, ["arquivos"]);
            const createData = Object.assign(Object.assign(Object.assign({}, mensagemData), { timestamp: new Date(data.timestamp || new Date()), senderRole: data.senderRole }), (arquivos && arquivos.length > 0 && {
                arquivos: {
                    create: arquivos.map(arquivoId => ({
                        arquivoId
                    }))
                }
            }));
            return prisma_1.default.mensagem.create({
                data: createData,
                include: {
                    sender: true,
                    arquivos: {
                        include: {
                            arquivo: true
                        }
                    }
                }
            });
        });
    },
    findAll(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.mensagem.findMany({
                where: tenantId ? { tenantId } : undefined,
                include: {
                    sender: true,
                    arquivos: {
                        include: {
                            arquivo: true
                        }
                    }
                },
                orderBy: {
                    timestamp: 'desc'
                }
            });
        });
    },
    findById(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.mensagem.findUnique({
                where: Object.assign({ id }, (tenantId && { tenantId })),
                include: {
                    sender: true,
                    arquivos: {
                        include: {
                            arquivo: true
                        }
                    }
                }
            });
        });
    },
    update(id, data, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { arquivos } = data, updateData = __rest(data, ["arquivos"]);
            const mensagemData = Object.assign(Object.assign(Object.assign({}, updateData), (data.timestamp && { timestamp: new Date(data.timestamp) })), (data.senderRole && { senderRole: data.senderRole }));
            // Se houver arquivos, atualizar a relação
            if (arquivos) {
                // Primeiro deletar arquivos existentes
                yield prisma_1.default.arquivoMensagem.deleteMany({
                    where: { mensagemId: id }
                });
                // Depois criar os novos
                if (arquivos.length > 0) {
                    mensagemData.arquivos = {
                        create: arquivos.map(arquivoId => ({
                            arquivoId
                        }))
                    };
                }
            }
            return prisma_1.default.mensagem.update({
                where: Object.assign({ id }, (tenantId && { tenantId })),
                data: mensagemData,
                include: {
                    sender: true,
                    arquivos: {
                        include: {
                            arquivo: true
                        }
                    }
                }
            });
        });
    },
    delete(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.mensagem.delete({
                where: Object.assign({ id }, (tenantId && { tenantId }))
            });
        });
    },
    findBySender(senderId, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.mensagem.findMany({
                where: Object.assign({ senderId }, (tenantId && { tenantId })),
                include: {
                    sender: true,
                    arquivos: {
                        include: {
                            arquivo: true
                        }
                    }
                },
                orderBy: {
                    timestamp: 'desc'
                }
            });
        });
    },
    findByTenant(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.mensagem.findMany({
                where: { tenantId },
                include: {
                    sender: true,
                    arquivos: {
                        include: {
                            arquivo: true
                        }
                    }
                },
                orderBy: {
                    timestamp: 'desc'
                }
            });
        });
    }
};
//# sourceMappingURL=mensagem.service.js.map
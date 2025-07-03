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
            const pacienteData = Object.assign(Object.assign({}, data), { dataNascimento: new Date(data.dataNascimento), convenioValidade: data.convenioValidade ? new Date(data.convenioValidade) : null });
            const paciente = yield prisma_1.default.paciente.create({
                data: pacienteData,
                include: {
                    profissional: true
                }
            });
            // Mapear dados para o formato esperado pelo frontend (mesmo formato dos outros métodos)
            return Object.assign(Object.assign({}, paciente), { endereco: {
                    rua: paciente.endereco,
                    numero: paciente.numero,
                    complemento: paciente.complemento,
                    bairro: paciente.bairro,
                    cidade: paciente.cidade,
                    estado: paciente.estado,
                    cep: paciente.cep,
                    pais: paciente.pais,
                }, convenio: {
                    nome: paciente.convenioNome,
                    numero: paciente.convenioNumero,
                    plano: paciente.convenioPlano,
                    validade: paciente.convenioValidade,
                } });
        });
    },
    findAll(filters, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = (filters === null || filters === void 0 ? void 0 : filters.page) || 1;
            const limit = (filters === null || filters === void 0 ? void 0 : filters.limit) || 10;
            const skip = (page - 1) * limit;
            // Construir where clause
            const where = {};
            if (tenantId)
                where.tenantId = tenantId;
            if (filters === null || filters === void 0 ? void 0 : filters.nome)
                where.nome = { contains: filters.nome, mode: 'insensitive' };
            if (filters === null || filters === void 0 ? void 0 : filters.cpf)
                where.cpf = { contains: filters.cpf };
            if (filters === null || filters === void 0 ? void 0 : filters.email)
                where.email = { contains: filters.email, mode: 'insensitive' };
            if (filters === null || filters === void 0 ? void 0 : filters.profissionalId)
                where.profissionalId = filters.profissionalId;
            // Buscar dados com paginação
            const [rawData, total] = yield Promise.all([
                prisma_1.default.paciente.findMany({
                    where,
                    include: {
                        profissional: true
                    },
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                }),
                prisma_1.default.paciente.count({ where })
            ]);
            // Mapear dados para o formato esperado pelo frontend
            const data = rawData.map(paciente => (Object.assign(Object.assign({}, paciente), { endereco: {
                    rua: paciente.endereco,
                    numero: paciente.numero,
                    complemento: paciente.complemento,
                    bairro: paciente.bairro,
                    cidade: paciente.cidade,
                    estado: paciente.estado,
                    cep: paciente.cep,
                    pais: paciente.pais,
                }, convenio: {
                    nome: paciente.convenioNome,
                    numero: paciente.convenioNumero,
                    plano: paciente.convenioPlano,
                    validade: paciente.convenioValidade,
                } })));
            const totalPages = Math.ceil(total / limit);
            const hasNext = page < totalPages;
            const hasPrev = page > 1;
            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext,
                    hasPrev,
                    nextPage: hasNext ? page + 1 : undefined,
                    prevPage: hasPrev ? page - 1 : undefined,
                }
            };
        });
    },
    findById(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const paciente = yield prisma_1.default.paciente.findUnique({
                where: Object.assign({ id }, (tenantId && { tenantId })),
                include: {
                    profissional: true
                }
            });
            if (!paciente)
                return null;
            // Mapear dados para o formato esperado pelo frontend
            return Object.assign(Object.assign({}, paciente), { endereco: {
                    rua: paciente.endereco,
                    numero: paciente.numero,
                    complemento: paciente.complemento,
                    bairro: paciente.bairro,
                    cidade: paciente.cidade,
                    estado: paciente.estado,
                    cep: paciente.cep,
                    pais: paciente.pais,
                }, convenio: {
                    nome: paciente.convenioNome,
                    numero: paciente.convenioNumero,
                    plano: paciente.convenioPlano,
                    validade: paciente.convenioValidade,
                } });
        });
    },
    update(id, data, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pacienteData = Object.assign(Object.assign({}, data), { dataNascimento: new Date(data.dataNascimento), convenioValidade: data.convenioValidade ? new Date(data.convenioValidade) : null });
            const paciente = yield prisma_1.default.paciente.update({
                where: Object.assign({ id }, (tenantId && { tenantId })),
                data: pacienteData,
                include: {
                    profissional: true
                }
            });
            // Mapear dados para o formato esperado pelo frontend (mesmo formato do findById)
            return Object.assign(Object.assign({}, paciente), { endereco: {
                    rua: paciente.endereco,
                    numero: paciente.numero,
                    complemento: paciente.complemento,
                    bairro: paciente.bairro,
                    cidade: paciente.cidade,
                    estado: paciente.estado,
                    cep: paciente.cep,
                    pais: paciente.pais,
                }, convenio: {
                    nome: paciente.convenioNome,
                    numero: paciente.convenioNumero,
                    plano: paciente.convenioPlano,
                    validade: paciente.convenioValidade,
                } });
        });
    },
    delete(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se existem registros relacionados antes de deletar
            const [agendamentos, prontuarios, anamneses, faturamentos] = yield Promise.all([
                prisma_1.default.agendamento.findMany({
                    where: Object.assign({ pacienteId: id }, (tenantId && { tenantId }))
                }),
                prisma_1.default.prontuario.findMany({
                    where: Object.assign({ pacienteId: id }, (tenantId && { tenantId }))
                }),
                prisma_1.default.anamnese.findMany({
                    where: Object.assign({ pacienteId: id }, (tenantId && { tenantId }))
                }),
                prisma_1.default.faturamento.findMany({
                    where: Object.assign({ pacienteId: id }, (tenantId && { tenantId }))
                })
            ]);
            // Se existem registros relacionados, retornar erro
            if (agendamentos.length > 0 || prontuarios.length > 0 || anamneses.length > 0 || faturamentos.length > 0) {
                throw new Error(`Não é possível deletar o paciente. Existem registros relacionados:
        - Agendamentos: ${agendamentos.length}
        - Prontuários: ${prontuarios.length}
        - Anamneses: ${anamneses.length}
        - Faturamentos: ${faturamentos.length}
        
        Para deletar o paciente, primeiro remova todos os registros relacionados.`);
            }
            return prisma_1.default.paciente.delete({
                where: Object.assign({ id }, (tenantId && { tenantId }))
            });
        });
    },
    deleteWithCascade(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Deletar pagamentos relacionados aos faturamentos do paciente
                const faturamentos = yield tx.faturamento.findMany({
                    where: Object.assign({ pacienteId: id }, (tenantId && { tenantId })),
                    select: { id: true }
                });
                if (faturamentos.length > 0) {
                    yield tx.pagamento.deleteMany({
                        where: Object.assign({ faturamentoId: { in: faturamentos.map(f => f.id) } }, (tenantId && { tenantId }))
                    });
                }
                // Deletar faturamentos do paciente
                yield tx.faturamento.deleteMany({
                    where: Object.assign({ pacienteId: id }, (tenantId && { tenantId }))
                });
                // Deletar exames relacionados aos prontuários do paciente
                const prontuarios = yield tx.prontuario.findMany({
                    where: Object.assign({ pacienteId: id }, (tenantId && { tenantId })),
                    select: { id: true }
                });
                if (prontuarios.length > 0) {
                    yield tx.exame.deleteMany({
                        where: Object.assign({ prontuarioId: { in: prontuarios.map(p => p.id) } }, (tenantId && { tenantId }))
                    });
                }
                // Deletar anamneses do paciente
                yield tx.anamnese.deleteMany({
                    where: Object.assign({ pacienteId: id }, (tenantId && { tenantId }))
                });
                // Deletar prontuários do paciente
                yield tx.prontuario.deleteMany({
                    where: Object.assign({ pacienteId: id }, (tenantId && { tenantId }))
                });
                // Deletar agendamentos do paciente
                yield tx.agendamento.deleteMany({
                    where: Object.assign({ pacienteId: id }, (tenantId && { tenantId }))
                });
                // Finalmente, deletar o paciente
                return tx.paciente.delete({
                    where: Object.assign({ id }, (tenantId && { tenantId }))
                });
            }));
        });
    },
    checkRelations(id, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [agendamentos, prontuarios, anamneses, faturamentos] = yield Promise.all([
                prisma_1.default.agendamento.count({
                    where: Object.assign({ pacienteId: id }, (tenantId && { tenantId }))
                }),
                prisma_1.default.prontuario.count({
                    where: Object.assign({ pacienteId: id }, (tenantId && { tenantId }))
                }),
                prisma_1.default.anamnese.count({
                    where: Object.assign({ pacienteId: id }, (tenantId && { tenantId }))
                }),
                prisma_1.default.faturamento.count({
                    where: Object.assign({ pacienteId: id }, (tenantId && { tenantId }))
                })
            ]);
            return {
                hasRelations: agendamentos > 0 || prontuarios > 0 || anamneses > 0 || faturamentos > 0,
                relations: {
                    agendamentos,
                    prontuarios,
                    anamneses,
                    faturamentos
                }
            };
        });
    }
};
//# sourceMappingURL=paciente.service.js.map
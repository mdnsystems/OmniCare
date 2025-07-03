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
exports.UsuarioService = void 0;
const prisma_1 = __importDefault(require("./prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
class UsuarioService {
    static criarUsuario(tenantId, email, senha, role, profissionalId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se a clínica existe
            const clinica = yield prisma_1.default.clinica.findUnique({
                where: { tenantId },
                select: { id: true, ativo: true }
            });
            if (!clinica) {
                throw new Error('Clínica não encontrada.');
            }
            if (!clinica.ativo) {
                throw new Error('Clínica inativa.');
            }
            // Verificar se o usuário já existe na clínica
            const usuarioExistente = yield prisma_1.default.usuario.findFirst({
                where: {
                    tenantId,
                    email
                }
            });
            if (usuarioExistente) {
                throw new Error('Usuário já cadastrado nesta clínica.');
            }
            // Se profissionalId foi fornecido, verificar se existe
            if (profissionalId) {
                const profissional = yield prisma_1.default.profissional.findFirst({
                    where: {
                        id: profissionalId,
                        tenantId
                    }
                });
                if (!profissional) {
                    throw new Error('Profissional não encontrado.');
                }
            }
            const hash = yield bcryptjs_1.default.hash(senha, 10);
            const usuario = yield prisma_1.default.usuario.create({
                data: {
                    tenantId,
                    email,
                    senha: hash,
                    role,
                    profissionalId
                },
                include: {
                    clinica: {
                        select: {
                            id: true,
                            nome: true,
                            tipo: true,
                            corPrimaria: true,
                            corSecundaria: true,
                            tema: true
                        }
                    },
                    profissional: {
                        select: {
                            id: true,
                            nome: true,
                            especialidade: {
                                select: {
                                    id: true,
                                    nome: true
                                }
                            }
                        }
                    }
                }
            });
            return {
                id: usuario.id,
                email: usuario.email,
                role: usuario.role,
                ativo: usuario.ativo,
                clinica: usuario.clinica,
                profissional: usuario.profissional
            };
        });
    }
    static autenticarUsuario(tenantId, email, senha) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield prisma_1.default.usuario.findFirst({
                where: {
                    tenantId,
                    email
                },
                include: {
                    clinica: {
                        select: {
                            id: true,
                            nome: true,
                            tipo: true,
                            corPrimaria: true,
                            corSecundaria: true,
                            tema: true,
                            ativo: true
                        }
                    },
                    profissional: {
                        select: {
                            id: true,
                            nome: true,
                            especialidade: {
                                select: {
                                    id: true,
                                    nome: true
                                }
                            }
                        }
                    }
                }
            });
            if (!usuario) {
                throw new Error('Credenciais inválidas.');
            }
            if (!usuario.ativo) {
                throw new Error('Usuário inativo.');
            }
            if (!usuario.clinica.ativo) {
                throw new Error('Clínica inativa.');
            }
            const senhaValida = yield bcryptjs_1.default.compare(senha, usuario.senha);
            if (!senhaValida) {
                throw new Error('Credenciais inválidas.');
            }
            const token = jsonwebtoken_1.default.sign({
                id: usuario.id,
                role: usuario.role,
                tenantId: usuario.tenantId,
                profissionalId: usuario.profissionalId
            }, JWT_SECRET, { expiresIn: '1d' });
            return {
                token,
                usuario: {
                    id: usuario.id,
                    email: usuario.email,
                    role: usuario.role,
                    ativo: usuario.ativo,
                    clinica: usuario.clinica,
                    profissional: usuario.profissional
                }
            };
        });
    }
    static listarUsuarios(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.usuario.findMany({
                where: {
                    tenantId,
                    ativo: true
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    ativo: true,
                    createdAt: true,
                    profissional: {
                        select: {
                            id: true,
                            nome: true,
                            especialidade: {
                                select: {
                                    id: true,
                                    nome: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        });
    }
    static listarUsuariosAtivos(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.usuario.findMany({
                where: {
                    tenantId,
                    ativo: true
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    ativo: true,
                    createdAt: true,
                    profissional: {
                        select: {
                            id: true,
                            nome: true,
                            especialidade: {
                                select: {
                                    id: true,
                                    nome: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        });
    }
    static buscarUsuarioPorId(tenantId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield prisma_1.default.usuario.findFirst({
                where: {
                    id,
                    tenantId
                },
                include: {
                    clinica: {
                        select: {
                            id: true,
                            nome: true,
                            tipo: true
                        }
                    },
                    profissional: {
                        select: {
                            id: true,
                            nome: true,
                            especialidade: {
                                select: {
                                    id: true,
                                    nome: true
                                }
                            }
                        }
                    }
                }
            });
            if (!usuario) {
                throw new Error('Usuário não encontrado.');
            }
            return usuario;
        });
    }
    static atualizarUsuario(tenantId, id, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield prisma_1.default.usuario.findFirst({
                where: {
                    id,
                    tenantId
                }
            });
            if (!usuario) {
                throw new Error('Usuário não encontrado.');
            }
            // Se email foi alterado, verificar se já existe
            if (dados.email && dados.email !== usuario.email) {
                const emailExistente = yield prisma_1.default.usuario.findFirst({
                    where: {
                        tenantId,
                        email: dados.email
                    }
                });
                if (emailExistente) {
                    throw new Error('Email já está em uso.');
                }
            }
            // Se profissionalId foi fornecido, verificar se existe
            if (dados.profissionalId) {
                const profissional = yield prisma_1.default.profissional.findFirst({
                    where: {
                        id: dados.profissionalId,
                        tenantId
                    }
                });
                if (!profissional) {
                    throw new Error('Profissional não encontrado.');
                }
            }
            return yield prisma_1.default.usuario.update({
                where: { id },
                data: dados,
                include: {
                    clinica: {
                        select: {
                            id: true,
                            nome: true,
                            tipo: true
                        }
                    },
                    profissional: {
                        select: {
                            id: true,
                            nome: true,
                            especialidade: {
                                select: {
                                    id: true,
                                    nome: true
                                }
                            }
                        }
                    }
                }
            });
        });
    }
    static alterarSenha(tenantId, id, senhaAtual, novaSenha) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield prisma_1.default.usuario.findFirst({
                where: {
                    id,
                    tenantId
                }
            });
            if (!usuario) {
                throw new Error('Usuário não encontrado.');
            }
            const senhaValida = yield bcryptjs_1.default.compare(senhaAtual, usuario.senha);
            if (!senhaValida) {
                throw new Error('Senha atual incorreta.');
            }
            const hash = yield bcryptjs_1.default.hash(novaSenha, 10);
            return yield prisma_1.default.usuario.update({
                where: { id },
                data: { senha: hash },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    ativo: true
                }
            });
        });
    }
    static desativarUsuario(tenantId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield prisma_1.default.usuario.findFirst({
                where: {
                    id,
                    tenantId
                }
            });
            if (!usuario) {
                throw new Error('Usuário não encontrado.');
            }
            return yield prisma_1.default.usuario.update({
                where: { id },
                data: { ativo: false },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    ativo: true
                }
            });
        });
    }
}
exports.UsuarioService = UsuarioService;
//# sourceMappingURL=usuario.service.js.map
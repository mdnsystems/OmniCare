"use strict";
// =============================================================================
// SERVICE - MÓDULO DE AUTENTICAÇÃO
// =============================================================================
// 
// Lógica de negócio para autenticação e autorização
// Implementa login, registro, refresh tokens e validações
//
// =============================================================================
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
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../../config/database");
const jwt_1 = __importDefault(require("../../utils/jwt"));
const enums_1 = require("../../types/enums");
const environment_1 = __importDefault(require("../../config/environment"));
class AuthService {
    /**
     * Realiza o login do usuário
     */
    static login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, senha, tenantId } = data;
            // Busca o usuário pelo email
            const usuario = yield database_1.prisma.usuario.findFirst({
                where: Object.assign({ email: email.toLowerCase().trim() }, (tenantId && { tenantId })),
                include: {
                    clinica: {
                        select: {
                            id: true,
                            nome: true,
                            tipo: true,
                            ativo: true,
                        },
                    },
                    profissional: {
                        select: {
                            id: true,
                            nome: true,
                            especialidade: {
                                select: {
                                    id: true,
                                    nome: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!usuario) {
                throw new Error('Email ou senha inválidos');
            }
            // Verifica se o usuário está ativo
            if (!usuario.ativo) {
                throw new Error('Usuário inativo');
            }
            // Verifica se a clínica está ativa
            if (!usuario.clinica.ativo) {
                throw new Error('Clínica inativa');
            }
            // Verifica a senha
            const senhaValida = yield bcryptjs_1.default.compare(senha, usuario.senha);
            if (!senhaValida) {
                throw new Error('Email ou senha inválidos');
            }
            // Gera os tokens
            const tokens = jwt_1.default.generateTokens(usuario.id, usuario.tenantId, usuario.role, usuario.email);
            // Remove a senha do retorno
            const { senha: _ } = usuario, usuarioSemSenha = __rest(usuario, ["senha"]);
            return Object.assign({ usuario: usuarioSemSenha }, tokens);
        });
    }
    /**
     * Registra um novo usuário
     */
    static register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, senha, role, tenantId, profissionalId } = data;
            // Verifica se a clínica existe e está ativa
            const clinica = yield database_1.prisma.clinica.findUnique({
                where: { tenantId },
                select: { id: true, ativo: true },
            });
            if (!clinica) {
                throw new Error('Clínica não encontrada');
            }
            if (!clinica.ativo) {
                throw new Error('Clínica inativa');
            }
            // Verifica se o email já existe no tenant
            const usuarioExistente = yield database_1.prisma.usuario.findFirst({
                where: {
                    email: email.toLowerCase().trim(),
                    tenantId,
                },
            });
            if (usuarioExistente) {
                throw new Error('Email já cadastrado nesta clínica');
            }
            // Se for profissional, verifica se o profissionalId existe
            if (role === enums_1.RoleUsuario.PROFISSIONAL && profissionalId) {
                const profissional = yield database_1.prisma.profissional.findFirst({
                    where: {
                        id: profissionalId,
                        tenantId,
                    },
                });
                if (!profissional) {
                    throw new Error('Profissional não encontrado');
                }
            }
            // Criptografa a senha
            const senhaCriptografada = yield bcryptjs_1.default.hash(senha, environment_1.default.security.bcryptRounds);
            // Cria o usuário
            const usuario = yield database_1.prisma.usuario.create({
                data: {
                    email: email.toLowerCase().trim(),
                    senha: senhaCriptografada,
                    role,
                    tenantId,
                    profissionalId: role === enums_1.RoleUsuario.PROFISSIONAL ? profissionalId : null,
                },
                include: {
                    clinica: {
                        select: {
                            id: true,
                            nome: true,
                            tipo: true,
                        },
                    },
                    profissional: {
                        select: {
                            id: true,
                            nome: true,
                            especialidade: {
                                select: {
                                    id: true,
                                    nome: true,
                                },
                            },
                        },
                    },
                },
            });
            // Gera os tokens
            const tokens = jwt_1.default.generateTokens(usuario.id, usuario.tenantId, usuario.role, usuario.email);
            // Remove a senha do retorno
            const { senha: _ } = usuario, usuarioSemSenha = __rest(usuario, ["senha"]);
            return Object.assign({ usuario: usuarioSemSenha }, tokens);
        });
    }
    /**
     * Renova o token de acesso usando refresh token
     */
    static refreshToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = data;
            try {
                // Verifica o refresh token
                const decoded = jwt_1.default.verifyRefreshToken(refreshToken);
                // Busca o usuário
                const usuario = yield database_1.prisma.usuario.findUnique({
                    where: { id: decoded.userId },
                    include: {
                        clinica: {
                            select: {
                                id: true,
                                nome: true,
                                tipo: true,
                                ativo: true,
                            },
                        },
                    },
                });
                if (!usuario || !usuario.ativo || !usuario.clinica.ativo) {
                    throw new Error('Usuário ou clínica inativo');
                }
                // Gera novos tokens
                const tokens = jwt_1.default.generateTokens(usuario.id, usuario.tenantId, usuario.role, usuario.email);
                // Remove a senha do retorno
                const { senha: _ } = usuario, usuarioSemSenha = __rest(usuario, ["senha"]);
                return Object.assign({ usuario: usuarioSemSenha }, tokens);
            }
            catch (error) {
                throw new Error('Refresh token inválido ou expirado');
            }
        });
    }
    /**
     * Altera a senha do usuário
     */
    static changePassword(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senhaAtual, novaSenha } = data;
            // Busca o usuário
            const usuario = yield database_1.prisma.usuario.findUnique({
                where: { id: userId },
            });
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
            // Verifica a senha atual
            const senhaAtualValida = yield bcryptjs_1.default.compare(senhaAtual, usuario.senha);
            if (!senhaAtualValida) {
                throw new Error('Senha atual incorreta');
            }
            // Verifica se a nova senha é diferente da atual
            const novaSenhaIgual = yield bcryptjs_1.default.compare(novaSenha, usuario.senha);
            if (novaSenhaIgual) {
                throw new Error('A nova senha deve ser diferente da senha atual');
            }
            // Criptografa a nova senha
            const novaSenhaCriptografada = yield bcryptjs_1.default.hash(novaSenha, environment_1.default.security.bcryptRounds);
            // Atualiza a senha
            yield database_1.prisma.usuario.update({
                where: { id: userId },
                data: { senha: novaSenhaCriptografada },
            });
            return { message: 'Senha alterada com sucesso' };
        });
    }
    /**
     * Solicita recuperação de senha
     */
    static forgotPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = data;
            // Busca o usuário pelo email
            const usuario = yield database_1.prisma.usuario.findFirst({
                where: {
                    email: email.toLowerCase().trim(),
                },
                include: {
                    clinica: {
                        select: {
                            id: true,
                            nome: true,
                            ativo: true,
                        },
                    },
                },
            });
            if (!usuario || !usuario.ativo || !usuario.clinica.ativo) {
                // Não revela se o email existe ou não
                return { message: 'Se o email existir, você receberá instruções de recuperação' };
            }
            // TODO: Implementar lógica de reset de senha
            // Por enquanto, apenas retorna mensagem de sucesso
            return {
                message: 'Se o email existir, você receberá instruções de recuperação'
            };
        });
    }
    /**
     * Reseta a senha usando token
     */
    static resetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, novaSenha } = data;
            // TODO: Implementar verificação de token e reset de senha
            // Por enquanto, retorna erro informando que a funcionalidade não está implementada
            throw new Error('Funcionalidade de reset de senha não implementada');
        });
    }
    /**
     * Verifica se um token é válido
     */
    static verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jwt_1.default.verifyAccessToken(token);
                const usuario = yield database_1.prisma.usuario.findUnique({
                    where: { id: decoded.userId },
                    include: {
                        clinica: {
                            select: {
                                id: true,
                                nome: true,
                                tipo: true,
                                ativo: true,
                            },
                        },
                        profissional: {
                            select: {
                                id: true,
                                nome: true,
                                especialidade: {
                                    select: {
                                        id: true,
                                        nome: true,
                                    },
                                },
                            },
                        },
                    },
                });
                if (!usuario || !usuario.ativo || !usuario.clinica.ativo) {
                    throw new Error('Usuário ou clínica inativo');
                }
                // Remove a senha do retorno
                const { senha: _ } = usuario, usuarioSemSenha = __rest(usuario, ["senha"]);
                return {
                    valid: true,
                    usuario: usuarioSemSenha,
                };
            }
            catch (error) {
                return {
                    valid: false,
                    error: 'Token inválido ou expirado',
                };
            }
        });
    }
    /**
     * Busca o perfil do usuário
     */
    static getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield database_1.prisma.usuario.findUnique({
                where: { id: userId },
                include: {
                    clinica: {
                        select: {
                            id: true,
                            nome: true,
                            tipo: true,
                            ativo: true,
                        },
                    },
                    profissional: {
                        select: {
                            id: true,
                            nome: true,
                            especialidade: {
                                select: {
                                    id: true,
                                    nome: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
            // Remove a senha do retorno
            const { senha: _ } = usuario, usuarioSemSenha = __rest(usuario, ["senha"]);
            return usuarioSemSenha;
        });
    }
}
exports.AuthService = AuthService;
exports.default = AuthService;
//# sourceMappingURL=service.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
const usuario_service_1 = require("../services/usuario.service");
const enums_1 = require("../types/enums");
exports.default = {
    registrar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, senha, role, profissionalId } = req.body;
            const tenantId = req.tenantId;
            if (!tenantId) {
                res.status(400).json({
                    message: 'Tenant ID é obrigatório. Use o header x-tenant-id.'
                });
                return;
            }
            if (!email || !senha || !role) {
                res.status(400).json({
                    message: 'Email, senha e role são obrigatórios.'
                });
                return;
            }
            if (!Object.values(enums_1.RoleUsuario).includes(role)) {
                res.status(400).json({
                    message: 'Role inválida. Valores permitidos: SUPER_ADMIN, ADMIN, PROFISSIONAL, RECEPCIONISTA'
                });
                return;
            }
            try {
                const usuario = yield usuario_service_1.UsuarioService.criarUsuario(tenantId, email, senha, role, profissionalId);
                res.status(201).json(usuario);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes('já cadastrado')) {
                        res.status(409).json({ message: error.message });
                    }
                    else if (error.message.includes('não encontrada') || error.message.includes('não encontrado')) {
                        res.status(404).json({ message: error.message });
                    }
                    else if (error.message.includes('inativa')) {
                        res.status(403).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: 'Erro ao registrar usuário.', error: error.message });
                    }
                }
                else {
                    res.status(500).json({ message: 'Erro ao registrar usuário.' });
                }
            }
        });
    },
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, senha, tenantId } = req.body;
            if (!tenantId) {
                res.status(400).json({
                    message: 'Tenant ID é obrigatório.'
                });
                return;
            }
            if (!email || !senha) {
                res.status(400).json({
                    message: 'Email e senha são obrigatórios.'
                });
                return;
            }
            try {
                const resultado = yield usuario_service_1.UsuarioService.autenticarUsuario(tenantId, email, senha);
                res.json(resultado);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === 'Credenciais inválidas.') {
                        res.status(401).json({ message: error.message });
                    }
                    else if (error.message.includes('inativo') || error.message.includes('inativa')) {
                        res.status(403).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: 'Erro ao fazer login.', error: error.message });
                    }
                }
                else {
                    res.status(500).json({ message: 'Erro ao fazer login.' });
                }
            }
        });
    },
    listar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.tenantId;
            if (!tenantId) {
                res.status(400).json({
                    success: false,
                    message: 'Tenant ID é obrigatório. Use o header x-tenant-id.',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            try {
                const usuarios = yield usuario_service_1.UsuarioService.listarUsuarios(tenantId);
                res.json({
                    success: true,
                    data: usuarios || [],
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Erro ao listar usuários.',
                    error: error instanceof Error ? error.message : 'Erro desconhecido',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    listarAtivos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.tenantId;
            if (!tenantId) {
                res.status(400).json({
                    success: false,
                    message: 'Tenant ID é obrigatório. Use o header x-tenant-id.',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            try {
                const usuarios = yield usuario_service_1.UsuarioService.listarUsuariosAtivos(tenantId);
                res.json({
                    success: true,
                    data: usuarios || [],
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Erro ao listar usuários ativos.',
                    error: error instanceof Error ? error.message : 'Erro desconhecido',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    },
    buscarPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const tenantId = req.tenantId;
            if (!tenantId) {
                res.status(400).json({
                    success: false,
                    message: 'Tenant ID é obrigatório. Use o header x-tenant-id.',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            try {
                const usuario = yield usuario_service_1.UsuarioService.buscarUsuarioPorId(tenantId, id);
                res.json({
                    success: true,
                    data: usuario,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Usuário não encontrado.') {
                    res.status(404).json({
                        success: false,
                        message: error.message,
                        timestamp: new Date().toISOString(),
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Erro ao buscar usuário.',
                        error: error instanceof Error ? error.message : 'Erro desconhecido',
                        timestamp: new Date().toISOString(),
                    });
                }
            }
        });
    },
    atualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const dados = req.body;
            const tenantId = req.tenantId;
            if (!tenantId) {
                res.status(400).json({
                    message: 'Tenant ID é obrigatório. Use o header x-tenant-id.'
                });
                return;
            }
            try {
                const usuario = yield usuario_service_1.UsuarioService.atualizarUsuario(tenantId, id, dados);
                res.json(usuario);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === 'Usuário não encontrado.') {
                        res.status(404).json({ message: error.message });
                    }
                    else if (error.message.includes('já está em uso')) {
                        res.status(409).json({ message: error.message });
                    }
                    else if (error.message.includes('não encontrado')) {
                        res.status(404).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({
                            message: 'Erro ao atualizar usuário.',
                            error: error.message
                        });
                    }
                }
                else {
                    res.status(500).json({ message: 'Erro ao atualizar usuário.' });
                }
            }
        });
    },
    alterarSenha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { senhaAtual, novaSenha } = req.body;
            const tenantId = req.tenantId;
            if (!tenantId) {
                res.status(400).json({
                    message: 'Tenant ID é obrigatório. Use o header x-tenant-id.'
                });
                return;
            }
            if (!senhaAtual || !novaSenha) {
                res.status(400).json({
                    message: 'Senha atual e nova senha são obrigatórias.'
                });
                return;
            }
            try {
                const usuario = yield usuario_service_1.UsuarioService.alterarSenha(tenantId, id, senhaAtual, novaSenha);
                res.json({ message: 'Senha alterada com sucesso.', usuario });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === 'Usuário não encontrado.') {
                        res.status(404).json({ message: error.message });
                    }
                    else if (error.message === 'Senha atual incorreta.') {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({
                            message: 'Erro ao alterar senha.',
                            error: error.message
                        });
                    }
                }
                else {
                    res.status(500).json({ message: 'Erro ao alterar senha.' });
                }
            }
        });
    },
    desativar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const tenantId = req.tenantId;
            if (!tenantId) {
                res.status(400).json({
                    message: 'Tenant ID é obrigatório. Use o header x-tenant-id.'
                });
                return;
            }
            try {
                const usuario = yield usuario_service_1.UsuarioService.desativarUsuario(tenantId, id);
                res.json({ message: 'Usuário desativado com sucesso.', usuario });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === 'Usuário não encontrado.') {
                        res.status(404).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({
                            message: 'Erro ao desativar usuário.',
                            error: error.message
                        });
                    }
                }
                else {
                    res.status(500).json({ message: 'Erro ao desativar usuário.' });
                }
            }
        });
    }
};
//# sourceMappingURL=usuario.controller.js.map
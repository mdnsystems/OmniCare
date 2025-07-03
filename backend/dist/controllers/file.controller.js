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
const file_upload_service_1 = require("../services/file-upload.service");
const prisma_1 = __importDefault(require("../services/prisma"));
class FileController {
    // Upload de arquivo
    static uploadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId, userId } = req;
                const { chatId } = req.body;
                if (!req.file) {
                    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
                }
                // Verificar se o usuário é participante do chat
                const participante = yield prisma_1.default.chatParticipante.findUnique({
                    where: {
                        chatId_userId: {
                            chatId,
                            userId
                        }
                    }
                });
                if (!participante) {
                    return res.status(403).json({ error: 'Você não é participante deste chat' });
                }
                const arquivo = yield file_upload_service_1.FileUploadService.uploadFile(req.file, tenantId, chatId, userId);
                res.status(201).json(arquivo);
            }
            catch (error) {
                console.error('Erro no upload do arquivo:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    // Download de arquivo
    static downloadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { arquivoId } = req.params;
                const { tenantId, userId } = req;
                const arquivo = yield prisma_1.default.arquivoChat.findUnique({
                    where: { id: arquivoId }
                });
                if (!arquivo || arquivo.tenantId !== tenantId) {
                    return res.status(404).json({ error: 'Arquivo não encontrado' });
                }
                // Verificar se o usuário é participante do chat
                const participante = yield prisma_1.default.chatParticipante.findUnique({
                    where: {
                        chatId_userId: {
                            chatId: arquivo.chatId,
                            userId
                        }
                    }
                });
                if (!participante) {
                    return res.status(403).json({ error: 'Acesso negado' });
                }
                const fileData = yield file_upload_service_1.FileUploadService.getFile(arquivoId);
                res.setHeader('Content-Type', arquivo.mimeType);
                res.setHeader('Content-Disposition', `attachment; filename="${arquivo.nomeOriginal}"`);
                fileData.stream.pipe(res);
            }
            catch (error) {
                console.error('Erro ao baixar arquivo:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    // Deletar arquivo
    static deleteFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { arquivoId } = req.params;
                const { userId } = req;
                yield file_upload_service_1.FileUploadService.deleteFile(arquivoId, userId);
                res.json({ message: 'Arquivo deletado com sucesso' });
            }
            catch (error) {
                console.error('Erro ao deletar arquivo:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    // Listar arquivos do chat
    static listarArquivos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId } = req.params;
                const { tenantId, userId } = req;
                const { page = 1, limit = 20 } = req.query;
                // Verificar se o usuário é participante do chat
                const participante = yield prisma_1.default.chatParticipante.findUnique({
                    where: {
                        chatId_userId: {
                            chatId,
                            userId
                        }
                    }
                });
                if (!participante) {
                    return res.status(403).json({ error: 'Você não é participante deste chat' });
                }
                const offset = (Number(page) - 1) * Number(limit);
                const arquivos = yield prisma_1.default.arquivoChat.findMany({
                    where: {
                        chatId,
                        tenantId
                    },
                    include: {
                        uploader: {
                            select: {
                                id: true,
                                email: true,
                                role: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    skip: offset,
                    take: Number(limit)
                });
                const total = yield prisma_1.default.arquivoChat.count({
                    where: {
                        chatId,
                        tenantId
                    }
                });
                const arquivosFormatados = arquivos.map(arquivo => ({
                    id: arquivo.id,
                    nome: arquivo.nome,
                    nomeOriginal: arquivo.nomeOriginal,
                    tipo: arquivo.tipo,
                    tamanho: arquivo.tamanho,
                    url: arquivo.url,
                    mimeType: arquivo.mimeType,
                    uploadadoPor: arquivo.uploadadoPor,
                    createdAt: arquivo.createdAt,
                    uploader: arquivo.uploader,
                    tamanhoFormatado: file_upload_service_1.FileUploadService.formatFileSize(arquivo.tamanho),
                    icone: file_upload_service_1.FileUploadService.getFileIcon(arquivo.tipo)
                }));
                res.json({
                    arquivos: arquivosFormatados,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        pages: Math.ceil(total / Number(limit))
                    }
                });
            }
            catch (error) {
                console.error('Erro ao listar arquivos:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    // Buscar arquivo por ID
    static buscarArquivo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { arquivoId } = req.params;
                const { tenantId, userId } = req;
                const arquivo = yield prisma_1.default.arquivoChat.findUnique({
                    where: { id: arquivoId },
                    include: {
                        uploader: {
                            select: {
                                id: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                });
                if (!arquivo || arquivo.tenantId !== tenantId) {
                    return res.status(404).json({ error: 'Arquivo não encontrado' });
                }
                // Verificar se o usuário é participante do chat
                const participante = yield prisma_1.default.chatParticipante.findUnique({
                    where: {
                        chatId_userId: {
                            chatId: arquivo.chatId,
                            userId
                        }
                    }
                });
                if (!participante) {
                    return res.status(403).json({ error: 'Acesso negado' });
                }
                const arquivoFormatado = {
                    id: arquivo.id,
                    nome: arquivo.nome,
                    nomeOriginal: arquivo.nomeOriginal,
                    tipo: arquivo.tipo,
                    tamanho: arquivo.tamanho,
                    url: arquivo.url,
                    mimeType: arquivo.mimeType,
                    uploadadoPor: arquivo.uploadadoPor,
                    createdAt: arquivo.createdAt,
                    uploader: arquivo.uploader,
                    tamanhoFormatado: file_upload_service_1.FileUploadService.formatFileSize(arquivo.tamanho),
                    icone: file_upload_service_1.FileUploadService.getFileIcon(arquivo.tipo)
                };
                res.json(arquivoFormatado);
            }
            catch (error) {
                console.error('Erro ao buscar arquivo:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
}
exports.default = FileController;
//# sourceMappingURL=file.controller.js.map
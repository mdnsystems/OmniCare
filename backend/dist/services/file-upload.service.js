"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.FileUploadService = void 0;
const prisma_1 = __importDefault(require("./prisma"));
const enums_1 = require("../types/enums");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
class FileUploadService {
    static uploadFile(file, tenantId, chatId, uploadadoPor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validar tamanho do arquivo
                if (file.size > this.MAX_FILE_SIZE) {
                    throw new Error('Arquivo muito grande. Tamanho máximo: 10MB');
                }
                // Determinar tipo do arquivo
                const tipo = this.getFileType(file.mimetype);
                if (!tipo) {
                    throw new Error('Tipo de arquivo não suportado');
                }
                // Criar diretório se não existir
                const uploadPath = path.join(process.cwd(), this.UPLOAD_DIR, tenantId);
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                // Gerar nome único para o arquivo
                const fileExtension = path.extname(file.originalname);
                const fileName = `${(0, uuid_1.v4)()}${fileExtension}`;
                const filePath = path.join(uploadPath, fileName);
                // Salvar arquivo
                fs.writeFileSync(filePath, file.buffer);
                // Salvar no banco de dados
                const arquivo = yield prisma_1.default.arquivoChat.create({
                    data: {
                        tenantId,
                        chatId,
                        nome: fileName,
                        nomeOriginal: file.originalname,
                        tipo,
                        tamanho: file.size,
                        url: `/uploads/${tenantId}/${fileName}`,
                        mimeType: file.mimetype,
                        uploadadoPor,
                    },
                });
                return arquivo;
            }
            catch (error) {
                console.error('Erro no upload do arquivo:', error);
                throw error;
            }
        });
    }
    static deleteFile(arquivoId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const arquivo = yield prisma_1.default.arquivoChat.findUnique({
                    where: { id: arquivoId },
                });
                if (!arquivo) {
                    throw new Error('Arquivo não encontrado');
                }
                // Verificar se o usuário pode deletar o arquivo
                if (arquivo.uploadadoPor !== userId) {
                    throw new Error('Sem permissão para deletar este arquivo');
                }
                // Deletar arquivo físico
                const filePath = path.join(process.cwd(), this.UPLOAD_DIR, arquivo.tenantId, arquivo.nome);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                // Deletar do banco de dados
                yield prisma_1.default.arquivoChat.delete({
                    where: { id: arquivoId },
                });
                return { success: true };
            }
            catch (error) {
                console.error('Erro ao deletar arquivo:', error);
                throw error;
            }
        });
    }
    static getFile(arquivoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const arquivo = yield prisma_1.default.arquivoChat.findUnique({
                    where: { id: arquivoId },
                });
                if (!arquivo) {
                    throw new Error('Arquivo não encontrado');
                }
                const filePath = path.join(process.cwd(), this.UPLOAD_DIR, arquivo.tenantId, arquivo.nome);
                if (!fs.existsSync(filePath)) {
                    throw new Error('Arquivo não encontrado no sistema de arquivos');
                }
                return {
                    arquivo,
                    filePath,
                    stream: fs.createReadStream(filePath),
                };
            }
            catch (error) {
                console.error('Erro ao buscar arquivo:', error);
                throw error;
            }
        });
    }
    static getFileType(mimeType) {
        for (const [tipo, mimeTypes] of Object.entries(this.ALLOWED_MIME_TYPES)) {
            if (mimeTypes.includes(mimeType)) {
                return tipo;
            }
        }
        return null;
    }
    static getFileIcon(tipo) {
        switch (tipo) {
            case enums_1.TipoArquivo.IMAGEM:
                return '🖼️';
            case enums_1.TipoArquivo.DOCUMENTO:
                return '📄';
            case enums_1.TipoArquivo.AUDIO:
                return '🎵';
            case enums_1.TipoArquivo.VIDEO:
                return '🎥';
            default:
                return '📎';
        }
    }
    static formatFileSize(bytes) {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
exports.FileUploadService = FileUploadService;
FileUploadService.UPLOAD_DIR = 'uploads';
FileUploadService.MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
FileUploadService.ALLOWED_MIME_TYPES = {
    IMAGEM: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTO: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
    VIDEO: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
};
//# sourceMappingURL=file-upload.service.js.map
import { TipoArquivo } from '../types/enums';
import * as fs from 'fs';
export declare class FileUploadService {
    private static readonly UPLOAD_DIR;
    private static readonly MAX_FILE_SIZE;
    private static readonly ALLOWED_MIME_TYPES;
    static uploadFile(file: any, tenantId: string, chatId: string, uploadadoPor: string): Promise<{
        id: string;
        tenantId: string;
        nome: string;
        tipo: import("generated/prisma").$Enums.TipoArquivo;
        createdAt: Date;
        chatId: string;
        nomeOriginal: string;
        tamanho: number;
        url: string;
        mimeType: string;
        uploadadoPor: string;
    }>;
    static deleteFile(arquivoId: string, userId: string): Promise<{
        success: boolean;
    }>;
    static getFile(arquivoId: string): Promise<{
        arquivo: {
            id: string;
            tenantId: string;
            nome: string;
            tipo: import("generated/prisma").$Enums.TipoArquivo;
            createdAt: Date;
            chatId: string;
            nomeOriginal: string;
            tamanho: number;
            url: string;
            mimeType: string;
            uploadadoPor: string;
        };
        filePath: string;
        stream: fs.ReadStream;
    }>;
    private static getFileType;
    static getFileIcon(tipo: TipoArquivo): string;
    static formatFileSize(bytes: number): string;
}

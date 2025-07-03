import prisma from './prisma';
import { TipoArquivo } from '../types/enums';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class FileUploadService {
  private static readonly UPLOAD_DIR = 'uploads';
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_MIME_TYPES = {
    IMAGEM: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTO: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
    VIDEO: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
  };

  static async uploadFile(
    file: any,
    tenantId: string,
    chatId: string,
    uploadadoPor: string
  ) {
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
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadPath, fileName);

      // Salvar arquivo
      fs.writeFileSync(filePath, file.buffer);

      // Salvar no banco de dados
      const arquivo = await prisma.arquivoChat.create({
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
    } catch (error) {
      console.error('Erro no upload do arquivo:', error);
      throw error;
    }
  }

  static async deleteFile(arquivoId: string, userId: string) {
    try {
      const arquivo = await prisma.arquivoChat.findUnique({
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
      await prisma.arquivoChat.delete({
        where: { id: arquivoId },
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      throw error;
    }
  }

  static async getFile(arquivoId: string) {
    try {
      const arquivo = await prisma.arquivoChat.findUnique({
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
    } catch (error) {
      console.error('Erro ao buscar arquivo:', error);
      throw error;
    }
  }

  private static getFileType(mimeType: string): TipoArquivo | null {
    for (const [tipo, mimeTypes] of Object.entries(this.ALLOWED_MIME_TYPES)) {
      if (mimeTypes.includes(mimeType)) {
        return tipo as TipoArquivo;
      }
    }
    return null;
  }

  static getFileIcon(tipo: TipoArquivo): string {
    switch (tipo) {
      case TipoArquivo.IMAGEM:
        return '🖼️';
      case TipoArquivo.DOCUMENTO:
        return '📄';
      case TipoArquivo.AUDIO:
        return '🎵';
      case TipoArquivo.VIDEO:
        return '🎥';
      default:
        return '📎';
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
} 
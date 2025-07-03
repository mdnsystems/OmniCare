import { Request, Response } from 'express';
import { FileUploadService } from '../services/file-upload.service';
import prisma from '../services/prisma';
import * as fs from 'fs';
import * as path from 'path';

export default class FileController {
  // Upload de arquivo
  static async uploadFile(req: Request, res: Response) {
    try {
      const { tenantId, userId } = req as any;
      const { chatId } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      // Verificar se o usuário é participante do chat
      const participante = await prisma.chatParticipante.findUnique({
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

      const arquivo = await FileUploadService.uploadFile(
        req.file,
        tenantId,
        chatId,
        userId
      );

      res.status(201).json(arquivo);
    } catch (error) {
      console.error('Erro no upload do arquivo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Download de arquivo
  static async downloadFile(req: Request, res: Response) {
    try {
      const { arquivoId } = req.params;
      const { tenantId, userId } = req as any;

      const arquivo = await prisma.arquivoChat.findUnique({
        where: { id: arquivoId }
      });

      if (!arquivo || arquivo.tenantId !== tenantId) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }

      // Verificar se o usuário é participante do chat
      const participante = await prisma.chatParticipante.findUnique({
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

      const fileData = await FileUploadService.getFile(arquivoId);

      res.setHeader('Content-Type', arquivo.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${arquivo.nomeOriginal}"`);
      
      fileData.stream.pipe(res);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Deletar arquivo
  static async deleteFile(req: Request, res: Response) {
    try {
      const { arquivoId } = req.params;
      const { userId } = req as any;

      await FileUploadService.deleteFile(arquivoId, userId);

      res.json({ message: 'Arquivo deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Listar arquivos do chat
  static async listarArquivos(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const { tenantId, userId } = req as any;
      const { page = 1, limit = 20 } = req.query;

      // Verificar se o usuário é participante do chat
      const participante = await prisma.chatParticipante.findUnique({
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

      const arquivos = await prisma.arquivoChat.findMany({
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

      const total = await prisma.arquivoChat.count({
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
        tamanhoFormatado: FileUploadService.formatFileSize(arquivo.tamanho),
        icone: FileUploadService.getFileIcon(arquivo.tipo as any)
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
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Buscar arquivo por ID
  static async buscarArquivo(req: Request, res: Response) {
    try {
      const { arquivoId } = req.params;
      const { tenantId, userId } = req as any;

      const arquivo = await prisma.arquivoChat.findUnique({
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
      const participante = await prisma.chatParticipante.findUnique({
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
        tamanhoFormatado: FileUploadService.formatFileSize(arquivo.tamanho),
        icone: FileUploadService.getFileIcon(arquivo.tipo as any)
      };

      res.json(arquivoFormatado);
    } catch (error) {
      console.error('Erro ao buscar arquivo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 
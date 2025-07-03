import { Request, Response } from 'express';
import mensagemService from '../services/mensagem.service';
import { MensagemInput } from '../validators/mensagem.validator';

export default {
  async create(req: Request<{}, {}, MensagemInput>, res: Response) {
    try {
      const tenantId = req.tenantId || 'default-tenant';
      
      // Extrair dados do usuário autenticado
      const user = req.user;
      if (!user) {
        return res.status(401).json({ 
          success: false,
          error: 'Usuário não autenticado',
          timestamp: new Date().toISOString(),
        });
      }

      const data = {
        ...req.body,
        senderId: user.userId,
        senderName: user.nome || user.email,
        senderRole: user.role,
        tenantId
      };
      
      const mensagem = await mensagemService.create(data);
      res.status(201).json({
        success: true,
        data: mensagem,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(400).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
  
  async findAll(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const mensagens = await mensagemService.findAll(tenantId);
      res.json({
        success: true,
        data: mensagens || [],
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
  
  async findById(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const mensagem = await mensagemService.findById(req.params.id, tenantId);
      if (!mensagem) return res.status(404).json({ 
        success: false,
        error: 'Mensagem não encontrada',
        timestamp: new Date().toISOString(),
      });
      res.json({
        success: true,
        data: mensagem,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
  
  async update(req: Request<{ id: string }, {}, Partial<MensagemInput>>, res: Response) {
    try {
      const tenantId = req.tenantId;
      const mensagem = await mensagemService.update(req.params.id, req.body, tenantId);
      res.json({
        success: true,
        data: mensagem,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(400).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
  
  async delete(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      await mensagemService.delete(req.params.id, tenantId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
}; 
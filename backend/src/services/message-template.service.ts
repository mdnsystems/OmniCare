import prisma from './prisma';

export default class MessageTemplateService {
  static async create(data: any) {
    return await prisma.messageTemplate.create({
      data: {
        ...data,
        tenantId: data.tenantId,
        variaveis: data.variaveis || [],
      },
    });
  }

  static async findAll(filters: any = {}) {
    const { page = 1, limit = 10, tipo, ativo } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (tipo) where.tipo = tipo;
    if (ativo !== undefined) where.ativo = ativo;

    const [templates, total] = await Promise.all([
      prisma.messageTemplate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.messageTemplate.count({ where }),
    ]);

    return {
      data: templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id: string) {
    return await prisma.messageTemplate.findUnique({
      where: { id },
    });
  }

  static async update(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.variaveis) updateData.variaveis = data.variaveis;

    return await prisma.messageTemplate.update({
      where: { id },
      data: updateData,
    });
  }

  static async delete(id: string) {
    return await prisma.messageTemplate.delete({
      where: { id },
    });
  }

  static async findByTipo(tipo: string) {
    return await prisma.messageTemplate.findMany({
      where: { tipo, ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  static async findAtivos() {
    return await prisma.messageTemplate.findMany({
      where: { ativo: true },
      orderBy: { tipo: 'asc', nome: 'asc' },
    });
  }

  static async ativar(id: string) {
    return await prisma.messageTemplate.update({
      where: { id },
      data: { ativo: true },
    });
  }

  static async desativar(id: string) {
    return await prisma.messageTemplate.update({
      where: { id },
      data: { ativo: false },
    });
  }

  static async duplicar(id: string, nome: string) {
    const template = await prisma.messageTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new Error('Template não encontrado');
    }

    return await prisma.messageTemplate.create({
      data: {
        tenantId: template.tenantId,
        nome,
        tipo: template.tipo,
        template: template.template,
        variaveis: template.variaveis,
        ativo: false, // Duplicado começa desativado
      },
    });
  }

  // Método para processar template com variáveis
  static processarTemplate(template: string, variaveis: Record<string, any>): string {
    let resultado = template;
    
    // Substituir variáveis no formato {{variavel}}
    for (const [chave, valor] of Object.entries(variaveis)) {
      const regex = new RegExp(`{{${chave}}}`, 'g');
      resultado = resultado.replace(regex, String(valor));
    }
    
    return resultado;
  }

  // Método para validar template
  static validarTemplate(template: string, variaveis: string[]): { valido: boolean; erros: string[] } {
    const erros: string[] = [];
    
    // Verificar se há variáveis não definidas
    const variaveisNoTemplate = template.match(/{{([^}]+)}}/g) || [];
    const variaveisDefinidas = new Set(variaveis);
    
    for (const variavel of variaveisNoTemplate) {
      const nomeVariavel = variavel.replace(/[{}]/g, '');
      if (!variaveisDefinidas.has(nomeVariavel)) {
        erros.push(`Variável "${nomeVariavel}" não está definida`);
      }
    }
    
    // Verificar se há variáveis definidas mas não usadas
    for (const variavel of variaveis) {
      if (!template.includes(`{{${variavel}}}`)) {
        erros.push(`Variável "${variavel}" está definida mas não é usada no template`);
      }
    }
    
    return {
      valido: erros.length === 0,
      erros,
    };
  }
} 
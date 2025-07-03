import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ZApiConfig {
  instanceId: string;
  token: string;
  baseUrl: string;
}

interface ZApiMessage {
  phone: string;
  message: string;
  linkPreview?: boolean;
}

interface ZApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

interface ClinicaWhatsAppConfig {
  id: string;
  clinicaId: string;
  zApiInstanceId: string;
  zApiToken: string;
  numeroWhatsApp: string;
  mensagensAtivas: {
    agendamento: boolean;
    lembrete: boolean;
    confirmacao: boolean;
    cancelamento: boolean;
  };
  templates: WhatsAppTemplate[];
  horarioEnvioLembrete: string;
  diasAntecedenciaLembrete: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WhatsAppTemplate {
  id: string;
  nome: string;
  tipo: string;
  template: string;
  variaveis: string[];
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AgendamentoMessage {
  paciente: {
    nome: string;
    telefone: string;
  };
  profissional: {
    nome: string;
  };
  clinica: {
    nome: string;
  };
  data: string;
  horaInicio: string;
  horaFim: string;
}

interface ConfirmacaoLink {
  agendamentoId: string;
  token: string;
  expiresAt: string;
}

class ZApiService {
  private config: ZApiConfig | null = null;
  private clinicaConfig: ClinicaWhatsAppConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  private async loadConfig() {
    try {
      // Buscar configuração da clínica via API
      const response = await fetch('/clinica/whatsapp-config');
      if (response.ok) {
        this.clinicaConfig = await response.json();
        this.config = {
          instanceId: this.clinicaConfig.zApiInstanceId,
          token: this.clinicaConfig.zApiToken,
          baseUrl: 'https://api.z-api.io'
        };
      } else {
        throw new Error('Configuração não encontrada');
      }
    } catch (error) {
      console.error('Erro ao carregar configuração Z-API:', error);
      // Em caso de erro, usar variáveis de ambiente como fallback
      this.config = {
        instanceId: import.meta.env.VITE_ZAPI_INSTANCE_ID || '',
        token: import.meta.env.VITE_ZAPI_TOKEN || '',
        baseUrl: 'https://api.z-api.io'
      };
    }
  }

  private async sendMessage(message: ZApiMessage): Promise<ZApiResponse> {
    if (!this.config) {
      throw new Error('Configuração Z-API não encontrada');
    }

    if (!this.config.instanceId || !this.config.token) {
      throw new Error('Credenciais Z-API não configuradas');
    }

    try {
      const url = `${this.config.baseUrl}/instances/${this.config.instanceId}/token/${this.config.token}/send-messages`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: message.phone,
          message: message.message,
          linkPreview: message.linkPreview || false
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        message: 'Mensagem enviada com sucesso',
        data
      };
    } catch (error) {
      console.error('Erro ao enviar mensagem via Z-API:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Adiciona código do país se não existir
    if (cleanPhone.length === 11 && cleanPhone.startsWith('11')) {
      return '55' + cleanPhone;
    }
    
    if (cleanPhone.length === 10) {
      return '5511' + cleanPhone;
    }
    
    return cleanPhone;
  }

  private generateConfirmationLink(agendamentoId: string): ConfirmacaoLink {
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    return {
      agendamentoId,
      token,
      expiresAt: expiresAt.toISOString()
    };
  }

  private generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  private replaceTemplateVariables(template: string, variables: Record<string, string>): string {
    let message = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      message = message.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return message;
  }

  public async sendAgendamentoMessage(agendamentoData: AgendamentoMessage): Promise<ZApiResponse> {
    if (!this.clinicaConfig?.mensagensAtivas.agendamento) {
      return {
        success: false,
        error: 'Mensagens de agendamento desativadas para esta clínica'
      };
    }

    const template = this.clinicaConfig.templates.find(t => t.tipo === 'agendamento' && t.ativo);
    if (!template) {
      return {
        success: false,
        error: 'Template de agendamento não encontrado'
      };
    }

    const dataFormatada = format(parseISO(agendamentoData.data), "dd/MM/yyyy", { locale: ptBR });
    
    const variables = {
      nome_paciente: agendamentoData.paciente.nome,
      nome_clinica: agendamentoData.clinica.nome,
      data_consulta: dataFormatada,
      hora_consulta: agendamentoData.horaInicio,
      nome_profissional: agendamentoData.profissional.nome
    };

    const message = this.replaceTemplateVariables(template.template, variables);
    const phone = this.formatPhoneNumber(agendamentoData.paciente.telefone);

    return this.sendMessage({
      phone,
      message,
      linkPreview: false
    });
  }

  public async sendLembreteMessage(agendamentoData: AgendamentoMessage): Promise<ZApiResponse> {
    if (!this.clinicaConfig?.mensagensAtivas.lembrete) {
      return {
        success: false,
        error: 'Mensagens de lembrete desativadas para esta clínica'
      };
    }

    const template = this.clinicaConfig.templates.find(t => t.tipo === 'lembrete' && t.ativo);
    if (!template) {
      return {
        success: false,
        error: 'Template de lembrete não encontrado'
      };
    }

    const dataFormatada = format(parseISO(agendamentoData.data), "dd/MM/yyyy", { locale: ptBR });
    const confirmacaoLink = this.generateConfirmationLink('agendamento-id');
    
    const variables = {
      nome_paciente: agendamentoData.paciente.nome,
      data_consulta: dataFormatada,
      hora_consulta: agendamentoData.horaInicio,
      nome_profissional: agendamentoData.profissional.nome,
      nome_clinica: agendamentoData.clinica.nome,
      link_confirmacao: `https://clinica.com/confirmar/${confirmacaoLink.token}`
    };

    const message = this.replaceTemplateVariables(template.template, variables);
    const phone = this.formatPhoneNumber(agendamentoData.paciente.telefone);

    return this.sendMessage({
      phone,
      message,
      linkPreview: true
    });
  }

  public async sendCancelamentoMessage(agendamentoData: AgendamentoMessage): Promise<ZApiResponse> {
    if (!this.clinicaConfig?.mensagensAtivas.cancelamento) {
      return {
        success: false,
        error: 'Mensagens de cancelamento desativadas para esta clínica'
      };
    }

    const template = this.clinicaConfig.templates.find(t => t.tipo === 'cancelamento' && t.ativo);
    if (!template) {
      return {
        success: false,
        error: 'Template de cancelamento não encontrado'
      };
    }

    const dataFormatada = format(parseISO(agendamentoData.data), "dd/MM/yyyy", { locale: ptBR });
    
    const variables = {
      nome_paciente: agendamentoData.paciente.nome,
      nome_clinica: agendamentoData.clinica.nome,
      data_consulta: dataFormatada,
      hora_consulta: agendamentoData.horaInicio,
      nome_profissional: agendamentoData.profissional.nome
    };

    const message = this.replaceTemplateVariables(template.template, variables);
    const phone = this.formatPhoneNumber(agendamentoData.paciente.telefone);

    return this.sendMessage({
      phone,
      message,
      linkPreview: false
    });
  }

  public scheduleLembreteMessage(agendamentoData: AgendamentoMessage): void {
    if (!this.clinicaConfig?.mensagensAtivas.lembrete) {
      return;
    }

    const dataAgendamento = parseISO(agendamentoData.data);
    const horarioLembrete = this.clinicaConfig.horarioEnvioLembrete;
    const diasAntecedencia = this.clinicaConfig.diasAntecedenciaLembrete;

    // Calcular data do lembrete
    const dataLembrete = new Date(dataAgendamento);
    dataLembrete.setDate(dataLembrete.getDate() - diasAntecedencia);
    
    const [hora, minuto] = horarioLembrete.split(':');
    dataLembrete.setHours(parseInt(hora), parseInt(minuto), 0, 0);

    const agora = new Date();
    const tempoParaLembrete = dataLembrete.getTime() - agora.getTime();

    if (tempoParaLembrete > 0) {
      setTimeout(async () => {
        await this.sendLembreteMessage(agendamentoData);
      }, tempoParaLembrete);
    }
  }

  public getClinicaConfig(): ClinicaWhatsAppConfig | null {
    return this.clinicaConfig;
  }

  public updateClinicaConfig(config: ClinicaWhatsAppConfig): void {
    this.clinicaConfig = config;
    this.config = {
      instanceId: config.zApiInstanceId,
      token: config.zApiToken,
      baseUrl: 'https://api.z-api.io'
    };
  }
}

export const zApiService = new ZApiService(); 
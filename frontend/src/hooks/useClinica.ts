import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as clinicaService from '@/services/clinica.service';
import { Clinica, ConfiguracaoClinica, TipoClinica } from '@/types/api';
import { createQueryKey } from '@/services/api';

// Hook para obter dados da clínica atual
export const useClinica = () => {
  return useQuery({
    queryKey: createQueryKey('clinica'),
    queryFn: () => clinicaService.getClinica(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para obter configurações da clínica
export const useConfiguracaoClinica = () => {
  return useQuery({
    queryKey: createQueryKey('clinica', 'configuracao'),
    queryFn: () => clinicaService.getConfiguracaoClinica(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para atualizar configurações da clínica
export const useUpdateConfiguracaoClinica = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ConfiguracaoClinica>) => 
      clinicaService.updateConfiguracaoClinica(data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clinica'] });
      queryClient.invalidateQueries({ queryKey: ['clinica', 'configuracao'] });
      
      // Atualizar cache
      queryClient.setQueryData(
        createQueryKey('clinica', 'configuracao'),
        data
      );
      
      toast.success('Configurações atualizadas com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar configurações');
    }
  });
};

// Hook para obter estatísticas da clínica
export const useClinicaStats = (periodoInicio?: string, periodoFim?: string) => {
  return useQuery({
    queryKey: createQueryKey('clinica', 'stats', { periodoInicio, periodoFim }),
    queryFn: () => clinicaService.getClinicaStats(periodoInicio, periodoFim),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter dashboard da clínica
export const useClinicaDashboard = () => {
  return useQuery({
    queryKey: createQueryKey('clinica', 'dashboard'),
    queryFn: () => clinicaService.getClinicaDashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obter tipos de clínica disponíveis
export const useTiposClinica = () => {
  return useQuery({
    queryKey: createQueryKey('clinica', 'tipos'),
    queryFn: () => clinicaService.getTiposClinica(),
    staleTime: 60 * 60 * 1000, // 1 hora (dados estáticos)
  });
};

// Hook para validar configuração da clínica
export const useValidarConfiguracaoClinica = () => {
  return useMutation({
    mutationFn: (configuracao: Partial<ConfiguracaoClinica>) => 
      clinicaService.validarConfiguracaoClinica(configuracao),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao validar configuração');
    }
  });
};

// Hook para testar conectividade da clínica
export const useTestarConectividadeClinica = () => {
  return useMutation({
    mutationFn: () => clinicaService.testarConectividadeClinica(),
    onSuccess: () => {
      toast.success('Conectividade testada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao testar conectividade');
    }
  });
};

// Hook para obter logs da clínica
export const useClinicaLogs = (tipo?: string, nivel?: string, dataInicio?: string, dataFim?: string) => {
  return useQuery({
    queryKey: createQueryKey('clinica', 'logs', { tipo, nivel, dataInicio, dataFim }),
    queryFn: () => clinicaService.getClinicaLogs(tipo, nivel, dataInicio, dataFim),
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

// Hook para limpar logs da clínica
export const useLimparLogsClinica = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dataInicio?: string) => clinicaService.limparLogsClinica(dataInicio),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clinica', 'logs'] });
      
      toast.success('Logs limpos com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao limpar logs');
    }
  });
};

// Hook para obter backup da clínica
export const useBackupClinica = () => {
  return useMutation({
    mutationFn: () => clinicaService.getBackupClinica(),
    onSuccess: (data) => {
      // Criar download do arquivo
      const blob = new Blob([data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_clinica_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Backup gerado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao gerar backup');
    }
  });
};

// Hook para restaurar backup da clínica
export const useRestaurarBackupClinica = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => clinicaService.restaurarBackupClinica(file),
    onSuccess: () => {
      // Invalidar todas as queries
      queryClient.clear();
      
      toast.success('Backup restaurado com sucesso!');
      
      // Recarregar a página para aplicar as mudanças
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao restaurar backup');
    }
  });
};

// Hook para obter informações do sistema
export const useSistemaInfo = () => {
  return useQuery({
    queryKey: createQueryKey('clinica', 'sistema'),
    queryFn: () => clinicaService.getSistemaInfo(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter atualizações disponíveis
export const useAtualizacoesDisponiveis = () => {
  return useQuery({
    queryKey: createQueryKey('clinica', 'atualizacoes'),
    queryFn: () => clinicaService.getAtualizacoesDisponiveis(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

// Hook para instalar atualização
export const useInstalarAtualizacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (versao: string) => clinicaService.instalarAtualizacao(versao),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clinica', 'sistema'] });
      queryClient.invalidateQueries({ queryKey: ['clinica', 'atualizacoes'] });
      
      toast.success('Atualização instalada com sucesso!');
      
      // Recarregar a página após a atualização
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao instalar atualização');
    }
  });
};

// Hook para obter configurações de email
export const useConfiguracaoEmail = () => {
  return useQuery({
    queryKey: createQueryKey('clinica', 'email'),
    queryFn: () => clinicaService.getConfiguracaoEmail(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para atualizar configurações de email
export const useUpdateConfiguracaoEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (configuracao: any) => clinicaService.updateConfiguracaoEmail(configuracao),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clinica', 'email'] });
      
      toast.success('Configurações de email atualizadas com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar configurações de email');
    }
  });
};

// Hook para testar configuração de email
export const useTestarEmail = () => {
  return useMutation({
    mutationFn: (email: string) => clinicaService.testarEmail(email),
    onSuccess: () => {
      toast.success('Email de teste enviado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao enviar email de teste');
    }
  });
};

// Hook para obter configurações de SMS
export const useConfiguracaoSMS = () => {
  return useQuery({
    queryKey: createQueryKey('clinica', 'sms'),
    queryFn: () => clinicaService.getConfiguracaoSMS(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para atualizar configurações de SMS
export const useUpdateConfiguracaoSMS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (configuracao: any) => clinicaService.updateConfiguracaoSMS(configuracao),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clinica', 'sms'] });
      
      toast.success('Configurações de SMS atualizadas com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar configurações de SMS');
    }
  });
};

// Hook para testar configuração de SMS
export const useTestarSMS = () => {
  return useMutation({
    mutationFn: (telefone: string) => clinicaService.testarSMS(telefone),
    onSuccess: () => {
      toast.success('SMS de teste enviado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao enviar SMS de teste');
    }
  });
};

// Hook para obter configurações de WhatsApp
export const useConfiguracaoWhatsApp = () => {
  return useQuery({
    queryKey: createQueryKey('clinica', 'whatsapp'),
    queryFn: () => clinicaService.getConfiguracaoWhatsApp(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para atualizar configurações de WhatsApp
export const useUpdateConfiguracaoWhatsApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (configuracao: any) => clinicaService.updateConfiguracaoWhatsApp(configuracao),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clinica', 'whatsapp'] });
      
      toast.success('Configurações de WhatsApp atualizadas com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar configurações de WhatsApp');
    }
  });
};

// Hook para testar configuração de WhatsApp
export const useTestarWhatsApp = () => {
  return useMutation({
    mutationFn: (telefone: string) => clinicaService.testarWhatsApp(telefone),
    onSuccess: () => {
      toast.success('Mensagem de WhatsApp de teste enviada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao enviar mensagem de WhatsApp de teste');
    }
  });
};

// Hook para obter configurações de impressão
export const useConfiguracaoImpressao = () => {
  return useQuery({
    queryKey: createQueryKey('clinica', 'impressao'),
    queryFn: () => clinicaService.getConfiguracaoImpressao(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para atualizar configurações de impressão
export const useUpdateConfiguracaoImpressao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (configuracao: any) => clinicaService.updateConfiguracaoImpressao(configuracao),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clinica', 'impressao'] });
      
      toast.success('Configurações de impressão atualizadas com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar configurações de impressão');
    }
  });
};

// Hook para obter configurações de segurança
export const useConfiguracaoSeguranca = () => {
  return useQuery({
    queryKey: createQueryKey('clinica', 'seguranca'),
    queryFn: () => clinicaService.getConfiguracaoSeguranca(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para atualizar configurações de segurança
export const useUpdateConfiguracaoSeguranca = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (configuracao: any) => clinicaService.updateConfiguracaoSeguranca(configuracao),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clinica', 'seguranca'] });
      
      toast.success('Configurações de segurança atualizadas com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar configurações de segurança');
    }
  });
}; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getRelatorios, 
  getRelatorioById, 
  gerarRelatorio, 
  downloadRelatorio, 
  deletarRelatorio,
  getRelatoriosAgendados,
  agendarRelatorio,
  atualizarRelatorioAgendado,
  deletarRelatorioAgendado,
  ativarRelatorioAgendado,
  desativarRelatorioAgendado,
  getTemplatesRelatorio,
  criarTemplate,
  atualizarTemplate,
  deletarTemplate,
  RelatorioData,
  RelatorioFiltros,
  RelatorioAgendado,
  TemplateRelatorio
} from '../services/relatorio.service';

// Hook para buscar relatórios
export const useRelatorios = (filtros?: RelatorioFiltros) => {
  return useQuery({
    queryKey: ['relatorios', filtros],
    queryFn: () => getRelatorios(filtros),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar relatório específico
export const useRelatorio = (id: string) => {
  return useQuery({
    queryKey: ['relatorio', id],
    queryFn: () => getRelatorioById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para gerar relatório
export const useGerarRelatorio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ tipo, filtros }: { tipo: string; filtros: RelatorioFiltros }) => 
      gerarRelatorio(tipo, filtros),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorios'] });
      toast.success('Relatório gerado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao gerar relatório: ' + error.message);
    },
  });
};

// Hook para download de relatório
export const useDownloadRelatorio = () => {
  return useMutation({
    mutationFn: ({ id, formato }: { id: string; formato: string }) => 
      downloadRelatorio(id, formato),
    onSuccess: (blob, { id, formato }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${id}.${formato.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download iniciado!');
    },
    onError: (error: any) => {
      toast.error('Erro ao fazer download: ' + error.message);
    },
  });
};

// Hook para deletar relatório
export const useDeletarRelatorio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletarRelatorio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorios'] });
      toast.success('Relatório excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao excluir relatório: ' + error.message);
    },
  });
};

// Hook para relatórios agendados
export const useRelatoriosAgendados = () => {
  return useQuery({
    queryKey: ['relatorios-agendados'],
    queryFn: getRelatoriosAgendados,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para agendar relatório
export const useAgendarRelatorio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: agendarRelatorio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorios-agendados'] });
      toast.success('Relatório agendado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao agendar relatório: ' + error.message);
    },
  });
};

// Hook para atualizar relatório agendado
export const useAtualizarRelatorioAgendado = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, relatorio }: { id: string; relatorio: Partial<RelatorioAgendado> }) => 
      atualizarRelatorioAgendado(id, relatorio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorios-agendados'] });
      toast.success('Relatório agendado atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar relatório agendado: ' + error.message);
    },
  });
};

// Hook para deletar relatório agendado
export const useDeletarRelatorioAgendado = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletarRelatorioAgendado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorios-agendados'] });
      toast.success('Relatório agendado excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao excluir relatório agendado: ' + error.message);
    },
  });
};

// Hook para ativar relatório agendado
export const useAtivarRelatorioAgendado = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ativarRelatorioAgendado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorios-agendados'] });
      toast.success('Relatório agendado ativado!');
    },
    onError: (error: any) => {
      toast.error('Erro ao ativar relatório agendado: ' + error.message);
    },
  });
};

// Hook para desativar relatório agendado
export const useDesativarRelatorioAgendado = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: desativarRelatorioAgendado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorios-agendados'] });
      toast.success('Relatório agendado desativado!');
    },
    onError: (error: any) => {
      toast.error('Erro ao desativar relatório agendado: ' + error.message);
    },
  });
};

// Hook para templates de relatório
export const useTemplatesRelatorio = () => {
  return useQuery({
    queryKey: ['templates-relatorio'],
    queryFn: getTemplatesRelatorio,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para criar template
export const useCriarTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: criarTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates-relatorio'] });
      toast.success('Template criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar template: ' + error.message);
    },
  });
};

// Hook para atualizar template
export const useAtualizarTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, template }: { id: string; template: Partial<TemplateRelatorio> }) => 
      atualizarTemplate(id, template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates-relatorio'] });
      toast.success('Template atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar template: ' + error.message);
    },
  });
};

// Hook para deletar template
export const useDeletarTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletarTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates-relatorio'] });
      toast.success('Template excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao excluir template: ' + error.message);
    },
  });
}; 
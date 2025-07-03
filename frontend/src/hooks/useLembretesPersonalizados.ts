import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { FaturaClinica, TipoLembrete } from '@/types/api';
import { toast } from '@/components/ui/use-toast';
import { enviarLembreteClinica } from '@/services/fatura-clinica.service';

interface LembretePersonalizado {
  faturaId: string;
  tipo: TipoLembrete;
  mensagem: string;
  destinatario: string;
  assunto?: string;
}

interface TemplateLembrete {
  id: string;
  nome: string;
  tipo: TipoLembrete;
  assunto: string;
  mensagem: string;
  variaveis: string[];
}

export function useLembretesPersonalizados() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [faturaSelecionada, setFaturaSelecionada] = useState<FaturaClinica | null>(null);

  // Templates de lembretes pré-definidos
  const templatesLembretes: TemplateLembrete[] = [
    {
      id: 'notificacao-3-dias',
      nome: 'Notificação 3 dias',
      tipo: TipoLembrete.NOTIFICACAO_3_DIAS,
      assunto: 'Lembrete de Pagamento',
      mensagem: `Olá {nome_clinica},

Sua fatura {numero_fatura} venceu há {dias_atraso} dias.

Valor: {valor_fatura}
Vencimento: {data_vencimento}

Por favor, regularize seu pagamento para evitar interrupções no serviço.

Atenciosamente,
Equipe OmniCare`,
      variaveis: ['nome_clinica', 'numero_fatura', 'dias_atraso', 'valor_fatura', 'data_vencimento']
    },
    {
      id: 'aviso-5-dias',
      nome: 'Aviso 5 dias',
      tipo: TipoLembrete.AVISO_5_DIAS,
      assunto: 'AVISO: Pagamento em Atraso',
      mensagem: `Olá {nome_clinica},

ATENÇÃO: Sua fatura {numero_fatura} está em atraso há {dias_atraso} dias.

Valor: {valor_fatura}
Vencimento: {data_vencimento}

Esta é uma notificação importante. Caso o pagamento não seja realizado, poderão ser aplicadas restrições ao sistema.

Atenciosamente,
Equipe OmniCare`,
      variaveis: ['nome_clinica', 'numero_fatura', 'dias_atraso', 'valor_fatura', 'data_vencimento']
    },
    {
      id: 'restricao-7-dias',
      nome: 'Restrição 7 dias',
      tipo: TipoLembrete.RESTRICAO_7_DIAS,
      assunto: 'URGENTE: Restrições Aplicadas',
      mensagem: `Olá {nome_clinica},

URGENTE: Sua fatura {numero_fatura} está em atraso há {dias_atraso} dias.

Valor: {valor_fatura}
Vencimento: {data_vencimento}

Restrições foram aplicadas ao sistema devido ao não pagamento.

Para evitar a interrupção total dos serviços, realize o pagamento URGENTEMENTE.

Entre em contato conosco imediatamente se houver alguma dificuldade.

Atenciosamente,
Equipe OmniCare`,
      variaveis: ['nome_clinica', 'numero_fatura', 'dias_atraso', 'valor_fatura', 'data_vencimento']
    },
    {
      id: 'bloqueio-10-dias',
      nome: 'Bloqueio 10 dias',
      tipo: TipoLembrete.BLOQUEIO_10_DIAS,
      assunto: 'BLOQUEIO TOTAL: Sistema inacessível',
      mensagem: `Olá {nome_clinica},

BLOQUEIO TOTAL ATIVADO: Sua fatura {numero_fatura} está em atraso há {dias_atraso} dias.

Valor: {valor_fatura}
Vencimento: {data_vencimento}

O acesso ao sistema foi completamente bloqueado devido ao não pagamento.

Para reativar o acesso, realize o pagamento imediatamente e entre em contato conosco.

Atenciosamente,
Equipe OmniCare`,
      variaveis: ['nome_clinica', 'numero_fatura', 'dias_atraso', 'valor_fatura', 'data_vencimento']
    },
    {
      id: 'personalizado',
      nome: 'Lembrete Personalizado',
      tipo: TipoLembrete.PERSONALIZADO,
      assunto: 'Lembrete Personalizado',
      mensagem: `Olá {nome_clinica},

{mensagem_personalizada}

Atenciosamente,
Equipe OmniCare`,
      variaveis: ['nome_clinica', 'mensagem_personalizada']
    }
  ];

  // Enviar lembrete
  const enviarLembrete = useMutation({
    mutationFn: async (dados: LembretePersonalizado) => {
      return await enviarLembreteClinica({
        faturaId: dados.faturaId,
        tipo: dados.tipo,
        mensagem: dados.mensagem,
        destinatario: dados.destinatario
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faturas-clinica'] });
      queryClient.invalidateQueries({ queryKey: ['controle-financeiro'] });
      toast({
        title: "📧 Lembrete enviado",
        description: "Lembrete enviado com sucesso para a clínica.",
      });
      setIsDialogOpen(false);
      setFaturaSelecionada(null);
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erro ao enviar lembrete",
        description: error.response?.data?.message || "Erro inesperado",
        variant: "destructive",
      });
    },
  });

  // Enviar lembretes em lote
  const enviarLembretesLote = useMutation({
    mutationFn: async (faturas: FaturaClinica[]) => {
      const lembretes = faturas.map(fatura => {
        const diasAtraso = calcularDiasAtraso(fatura.dataVencimento);
        const template = selecionarTemplateAutomatico(diasAtraso);
        
        return {
          faturaId: fatura.id,
          tipo: template.tipo,
          mensagem: processarTemplate(template, fatura),
          destinatario: fatura.clinica?.nome || 'Administrador da Clínica'
        };
      });

      const promises = lembretes.map(lembrete => 
        enviarLembreteClinica(lembrete)
      );

      return Promise.all(promises);
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ['faturas-clinica'] });
      queryClient.invalidateQueries({ queryKey: ['controle-financeiro'] });
      toast({
        title: "📧 Lembretes enviados",
        description: `${results.length} lembretes foram enviados com sucesso.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erro ao enviar lembretes",
        description: error.response?.data?.message || "Erro inesperado",
        variant: "destructive",
      });
    },
  });

  // Calcular dias de atraso
  const calcularDiasAtraso = useCallback((dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = hoje.getTime() - vencimento.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, []);

  // Selecionar template automático baseado nos dias de atraso
  const selecionarTemplateAutomatico = useCallback((diasAtraso: number): TemplateLembrete => {
    if (diasAtraso >= 10) {
      return templatesLembretes.find(t => t.tipo === TipoLembrete.BLOQUEIO_10_DIAS) || templatesLembretes[0];
    } else if (diasAtraso >= 7) {
      return templatesLembretes.find(t => t.tipo === TipoLembrete.RESTRICAO_7_DIAS) || templatesLembretes[0];
    } else if (diasAtraso >= 5) {
      return templatesLembretes.find(t => t.tipo === TipoLembrete.AVISO_5_DIAS) || templatesLembretes[0];
    } else if (diasAtraso >= 3) {
      return templatesLembretes.find(t => t.tipo === TipoLembrete.NOTIFICACAO_3_DIAS) || templatesLembretes[0];
    }
    return templatesLembretes[0];
  }, []);

  // Processar template com dados da fatura
  const processarTemplate = useCallback((template: TemplateLembrete, fatura: FaturaClinica): string => {
    const diasAtraso = calcularDiasAtraso(fatura.dataVencimento);
    const valorFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(fatura.valor);

    let mensagem = template.mensagem;
    
    // Substituir variáveis
    mensagem = mensagem.replace('{nome_clinica}', fatura.clinica?.nome || 'Clínica');
    mensagem = mensagem.replace('{numero_fatura}', fatura.numeroFatura);
    mensagem = mensagem.replace('{dias_atraso}', diasAtraso.toString());
    mensagem = mensagem.replace('{valor_fatura}', valorFormatado);
    mensagem = mensagem.replace('{data_vencimento}', new Date(fatura.dataVencimento).toLocaleDateString('pt-BR'));

    return mensagem;
  }, [calcularDiasAtraso]);

  // Abrir dialog para enviar lembrete personalizado
  const abrirDialogLembrete = useCallback((fatura: FaturaClinica) => {
    setFaturaSelecionada(fatura);
    setIsDialogOpen(true);
  }, []);

  // Enviar lembrete personalizado
  const enviarLembretePersonalizado = useCallback(async (dados: {
    tipo: TipoLembrete;
    mensagem: string;
    assunto?: string;
  }) => {
    if (!faturaSelecionada) return;

    const lembrete: LembretePersonalizado = {
      faturaId: faturaSelecionada.id,
      tipo: dados.tipo,
      mensagem: dados.mensagem,
      destinatario: faturaSelecionada.clinica?.nome || 'Administrador da Clínica',
      assunto: dados.assunto
    };

    await enviarLembrete.mutateAsync(lembrete);
  }, [faturaSelecionada, enviarLembrete]);

  return {
    // Estados
    isDialogOpen,
    faturaSelecionada,
    
    // Dados
    templatesLembretes,
    
    // Mutations
    enviarLembrete,
    enviarLembretesLote,
    
    // Funções
    calcularDiasAtraso,
    selecionarTemplateAutomatico,
    processarTemplate,
    abrirDialogLembrete,
    enviarLembretePersonalizado,
    
    // Controles do dialog
    setIsDialogOpen,
    setFaturaSelecionada
  };
} 
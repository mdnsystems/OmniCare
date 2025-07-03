import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { 
  PainelFinanceiroData, 
  FaturaClinica, 
  StatusFatura, 
  NivelBloqueio,
  CriarFaturaClinica,
  RegistrarPagamentoClinica,
  EnviarLembreteClinica,
  AplicarBloqueioClinica,
  RegrasBloqueio
} from '@/types/api';
import { toast } from '@/components/ui/use-toast';
import {
  getFaturasClinica,
  getPainelFinanceiro,
  createFaturaClinica,
  registrarPagamentoClinica,
  enviarLembreteClinica,
  aplicarBloqueioClinica,
  updateStatusFaturaClinica,
  aplicarRegrasAutomaticas as aplicarRegrasAutomaticasService,
  gerarNumeroFatura as gerarNumeroFaturaService
} from '@/services/fatura-clinica.service';

// Configurações padrão das regras de bloqueio
const REGRAS_BLOQUEIO_PADRAO: RegrasBloqueio = {
  diasNotificacao: 3,
  diasAvisoTopo: 5,
  diasRestricao: 7,
  diasBloqueioTotal: 10,
  ativo: true
};

export function useControleFinanceiro() {
  const queryClient = useQueryClient();

  // Buscar dados do painel financeiro
  const { data: painelData, isLoading, error } = useQuery<PainelFinanceiroData>({
    queryKey: ['controle-financeiro'],
    queryFn: async () => {
      return await getPainelFinanceiro();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Buscar faturas com filtros
  const buscarFaturas = useQuery({
    queryKey: ['faturas-clinica'],
    queryFn: async () => {
      return await getFaturasClinica();
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  // Criar nova fatura
  const criarFatura = useMutation({
    mutationFn: async (dados: CriarFaturaClinica) => {
      return await createFaturaClinica(dados);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['controle-financeiro'] });
      queryClient.invalidateQueries({ queryKey: ['faturas-clinica'] });
      toast({
        title: "✅ Fatura criada",
        description: "Fatura criada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erro ao criar fatura",
        description: error.response?.data?.message || "Erro inesperado",
        variant: "destructive",
      });
    },
  });

  // Registrar pagamento
  const registrarPagamento = useMutation({
    mutationFn: async (dados: RegistrarPagamentoClinica) => {
      return await registrarPagamentoClinica(dados);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['controle-financeiro'] });
      queryClient.invalidateQueries({ queryKey: ['faturas-clinica'] });
      toast({
        title: "✅ Pagamento registrado",
        description: "Pagamento registrado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erro ao registrar pagamento",
        description: error.response?.data?.message || "Erro inesperado",
        variant: "destructive",
      });
    },
  });

  // Enviar lembrete
  const enviarLembrete = useMutation({
    mutationFn: async (dados: EnviarLembreteClinica) => {
      return await enviarLembreteClinica(dados);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faturas-clinica'] });
      toast({
        title: "📧 Lembrete enviado",
        description: "Lembrete enviado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erro ao enviar lembrete",
        description: error.response?.data?.message || "Erro inesperado",
        variant: "destructive",
      });
    },
  });

  // Aplicar bloqueio
  const aplicarBloqueio = useMutation({
    mutationFn: async (dados: AplicarBloqueioClinica) => {
      return await aplicarBloqueioClinica(dados);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['controle-financeiro'] });
      queryClient.invalidateQueries({ queryKey: ['faturas-clinica'] });
      toast({
        title: "🔒 Bloqueio aplicado",
        description: "Bloqueio aplicado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erro ao aplicar bloqueio",
        description: error.response?.data?.message || "Erro inesperado",
        variant: "destructive",
      });
    },
  });

  // Atualizar status da fatura
  const atualizarStatusFatura = useMutation({
    mutationFn: async ({ faturaId, status }: { faturaId: string; status: StatusFatura }) => {
      return await updateStatusFaturaClinica(faturaId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['controle-financeiro'] });
      queryClient.invalidateQueries({ queryKey: ['faturas-clinica'] });
      toast({
        title: "✅ Status atualizado",
        description: "Status da fatura atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erro ao atualizar status",
        description: error.response?.data?.message || "Erro inesperado",
        variant: "destructive",
      });
    },
  });

  // Aplicar regras automáticas de bloqueio
  const aplicarRegrasAutomaticas = useCallback(async () => {
    try {
      const result = await aplicarRegrasAutomaticasService();
      queryClient.invalidateQueries({ queryKey: ['controle-financeiro'] });
      queryClient.invalidateQueries({ queryKey: ['faturas-clinica'] });
      
      const { faturasAtualizadas } = result;
      if (faturasAtualizadas > 0) {
        toast({
          title: "🔄 Regras aplicadas",
          description: `${faturasAtualizadas} faturas foram atualizadas automaticamente.`,
        });
      }
      
      return result;
    } catch (error: any) {
      toast({
        title: "❌ Erro ao aplicar regras",
        description: error.response?.data?.message || "Erro inesperado",
        variant: "destructive",
      });
      throw error;
    }
  }, [queryClient]);

  // Calcular nível de bloqueio baseado nos dias de atraso
  const calcularNivelBloqueio = useCallback((diasAtraso: number): NivelBloqueio => {
    if (diasAtraso >= REGRAS_BLOQUEIO_PADRAO.diasBloqueioTotal) {
      return NivelBloqueio.BLOQUEIO_TOTAL;
    } else if (diasAtraso >= REGRAS_BLOQUEIO_PADRAO.diasRestricao) {
      return NivelBloqueio.RESTRICAO_FUNCIONALIDADES;
    } else if (diasAtraso >= REGRAS_BLOQUEIO_PADRAO.diasAvisoTopo) {
      return NivelBloqueio.AVISO_TOPO;
    } else if (diasAtraso >= REGRAS_BLOQUEIO_PADRAO.diasNotificacao) {
      return NivelBloqueio.NOTIFICACAO;
    }
    return NivelBloqueio.SEM_BLOQUEIO;
  }, []);

  // Gerar número de fatura único
  const gerarNumeroFatura = useCallback(async () => {
    try {
      const result = await gerarNumeroFaturaService();
      return result.numeroFatura;
    } catch (error) {
      // Fallback para geração local em caso de erro
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return `FAT-${timestamp}-${random}`;
    }
  }, []);

  // Formatar valor monetário
  const formatarValor = useCallback((valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }, []);

  // Calcular dias de atraso
  const calcularDiasAtraso = useCallback((dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = hoje.getTime() - vencimento.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, []);

  return {
    // Dados
    painelData,
    faturas: buscarFaturas.data?.data || [],
    
    // Estados
    isLoading: isLoading || buscarFaturas.isLoading,
    error: error || buscarFaturas.error,
    
    // Mutations
    criarFatura,
    registrarPagamento,
    enviarLembrete,
    aplicarBloqueio,
    atualizarStatusFatura,
    
    // Funções
    aplicarRegrasAutomaticas,
    calcularNivelBloqueio,
    gerarNumeroFatura,
    formatarValor,
    calcularDiasAtraso,
    
    // Configurações
    regrasBloqueio: REGRAS_BLOQUEIO_PADRAO,
  };
} 
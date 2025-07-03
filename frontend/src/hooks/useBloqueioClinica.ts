import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getFaturasClinicaByTenant } from '@/services/fatura-clinica.service';
import { 
  FaturaClinica, 
  NivelBloqueio, 
  StatusFatura,
  Clinica 
} from '@/types/api';

interface StatusBloqueioClinica {
  faturas: FaturaClinica[];
  nivelBloqueioAtual: NivelBloqueio;
  faturasEmAtraso: FaturaClinica[];
  faturasComBloqueioTotal: FaturaClinica[];
  faturasComRestricao: FaturaClinica[];
  totalEmAtraso: number;
  diasAtrasoMaximo: number;
  clinica?: Clinica;
}

export function useBloqueioClinica() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [statusBloqueio, setStatusBloqueio] = useState<StatusBloqueioClinica>({
    faturas: [],
    nivelBloqueioAtual: NivelBloqueio.SEM_BLOQUEIO,
    faturasEmAtraso: [],
    faturasComBloqueioTotal: [],
    faturasComRestricao: [],
    totalEmAtraso: 0,
    diasAtrasoMaximo: 0
  });

  // Limpar cache ao montar o hook
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['faturas-clinica-atual'] });
    queryClient.invalidateQueries({ queryKey: ['faturas-clinica'] });
    queryClient.invalidateQueries({ queryKey: ['bloqueio-clinica'] });
    queryClient.invalidateQueries({ queryKey: ['notificacoes-lembretes'] });
  }, [queryClient]);

  // Buscar faturas da clínica atual (apenas para usuários não SUPER_ADMIN)
  const { data: faturasClinica, isLoading, error } = useQuery({
    queryKey: ['faturas-clinica-atual', user?.tenantId],
    queryFn: async () => {
      // Se não há tenantId, retornar array vazio
      if (!user?.tenantId) {
        console.log('⚠️ Nenhum tenantId encontrado, retornando array vazio');
        return [];
      }
      
      // Se é SUPER_ADMIN, não precisa verificar faturas da própria clínica
      if (user?.role === 'SUPER_ADMIN') {
        console.log('⚠️ Usuário SUPER_ADMIN, não verificando faturas da clínica');
        return [];
      }
      
      console.log('🔍 Buscando faturas para usuário:', {
        tenantId: user.tenantId,
        role: user.role,
        email: user.email
      });
      
      try {
        const faturas = await getFaturasClinicaByTenant(user.tenantId);
        console.log('✅ Faturas encontradas:', faturas.length);
        return faturas;
      } catch (error) {
        console.error('❌ Erro ao buscar faturas:', error);
        // Em caso de erro, retornar array vazio para não quebrar a aplicação
        return [];
      }
    },
    enabled: !!user?.tenantId,
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: (failureCount, error) => {
      // Não tentar novamente em caso de erro 404 (rota não encontrada)
      if (error?.response?.status === 404) {
        console.log('⚠️ Erro 404 - rota não encontrada, não tentando novamente');
        return false;
      }
      // Tentar até 3 vezes para outros erros
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Calcular dias de atraso
  const calcularDiasAtraso = useCallback((dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = hoje.getTime() - vencimento.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, []);

  // Calcular nível de bloqueio baseado nos dias de atraso
  const calcularNivelBloqueio = useCallback((diasAtraso: number): NivelBloqueio => {
    if (diasAtraso >= 10) {
      return NivelBloqueio.BLOQUEIO_TOTAL;
    } else if (diasAtraso >= 7) {
      return NivelBloqueio.RESTRICAO_FUNCIONALIDADES;
    } else if (diasAtraso >= 5) {
      return NivelBloqueio.AVISO_TOPO;
    } else if (diasAtraso >= 3) {
      return NivelBloqueio.NOTIFICACAO;
    }
    return NivelBloqueio.SEM_BLOQUEIO;
  }, []);

  // Analisar status de bloqueio
  const analisarStatusBloqueio = useCallback((faturas: FaturaClinica[]) => {
    const faturasEmAtraso = faturas.filter(fatura => {
      const diasAtraso = calcularDiasAtraso(fatura.dataVencimento);
      return fatura.status === StatusFatura.VENCIDO || diasAtraso > 0;
    });

    const faturasComBloqueioTotal = faturas.filter(fatura => 
      fatura.nivelBloqueio === NivelBloqueio.BLOQUEIO_TOTAL
    );

    const faturasComRestricao = faturas.filter(fatura => 
      fatura.nivelBloqueio === NivelBloqueio.RESTRICAO_FUNCIONALIDADES
    );

    const totalEmAtraso = faturasEmAtraso.reduce((total, fatura) => total + fatura.valor, 0);
    
    const diasAtrasoMaximo = faturasEmAtraso.length > 0 
      ? Math.max(...faturasEmAtraso.map(fatura => calcularDiasAtraso(fatura.dataVencimento)))
      : 0;

    // Determinar o nível de bloqueio atual (mais crítico)
    let nivelBloqueioAtual = NivelBloqueio.SEM_BLOQUEIO;
    
    if (faturasComBloqueioTotal.length > 0) {
      nivelBloqueioAtual = NivelBloqueio.BLOQUEIO_TOTAL;
    } else if (faturasComRestricao.length > 0) {
      nivelBloqueioAtual = NivelBloqueio.RESTRICAO_FUNCIONALIDADES;
    } else if (faturasEmAtraso.length > 0) {
      nivelBloqueioAtual = calcularNivelBloqueio(diasAtrasoMaximo);
    }

    return {
      faturas,
      nivelBloqueioAtual,
      faturasEmAtraso,
      faturasComBloqueioTotal,
      faturasComRestricao,
      totalEmAtraso,
      diasAtrasoMaximo
    };
  }, [calcularDiasAtraso, calcularNivelBloqueio]);

  // Atualizar status quando as faturas mudarem
  useEffect(() => {
    if (faturasClinica) {
      const status = analisarStatusBloqueio(faturasClinica);
      setStatusBloqueio(status);
    }
  }, [faturasClinica, analisarStatusBloqueio]);

  // Invalidar cache quando necessário
  const invalidarCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['faturas-clinica-atual'] });
    queryClient.invalidateQueries({ queryKey: ['faturas-clinica'] });
    queryClient.invalidateQueries({ queryKey: ['controle-financeiro'] });
  }, [queryClient]);

  // Verificar se deve mostrar bloqueio total
  const deveMostrarBloqueioTotal = statusBloqueio.nivelBloqueioAtual === NivelBloqueio.BLOQUEIO_TOTAL;

  // Verificar se deve aplicar restrições
  const deveAplicarRestricoes = [
    NivelBloqueio.RESTRICAO_FUNCIONALIDADES,
    NivelBloqueio.BLOQUEIO_TOTAL
  ].includes(statusBloqueio.nivelBloqueioAtual);

  return {
    // Dados
    ...statusBloqueio,
    
    // Estados
    isLoading,
    error,
    
    // Verificações
    deveMostrarBloqueioTotal,
    deveAplicarRestricoes,
    
    // Funções
    calcularDiasAtraso,
    calcularNivelBloqueio,
    invalidarCache
  };
} 
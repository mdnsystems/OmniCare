import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { 
  Faturamento, 
  Pagamento, 
  TipoFaturamento, 
  StatusFaturamento, 
  FormaPagamento 
} from '@/types/api'

interface FinanceiroData {
  faturamentos: Faturamento[]
  pagamentos: Pagamento[]
  resumo: {
    receitaTotal: number
    receitaPaga: number
    receitaPendente: number
    receitaVencida: number
    mediaTicket: number
    taxaConversao: number
    crescimentoMensal: number
  }
}

interface UseFinanceiroOptions {
  periodoInicio?: string
  periodoFim?: string
  status?: StatusFaturamento
  tipo?: TipoFaturamento
  formaPagamento?: FormaPagamento
}

// Hook para buscar faturamentos
export function useFaturamentos(options: UseFinanceiroOptions = {}) {
  const { data, isLoading, error } = useQuery<Faturamento[]>({
    queryKey: ['faturamentos', options],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (options.periodoInicio) params.append('periodoInicio', options.periodoInicio)
      if (options.periodoFim) params.append('periodoFim', options.periodoFim)
      if (options.status) params.append('status', options.status)
      if (options.tipo) params.append('tipo', options.tipo)

      const response = await api.get(`/faturamento?${params.toString()}`)
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  return {
    data: data || [],
    isLoading,
    error: error?.message
  }
}

// Hook para buscar pagamentos
export function usePagamentos(options: UseFinanceiroOptions = {}) {
  const { data, isLoading, error } = useQuery<Pagamento[]>({
    queryKey: ['pagamentos', options],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (options.periodoInicio) params.append('periodoInicio', options.periodoInicio)
      if (options.periodoFim) params.append('periodoFim', options.periodoFim)
      if (options.formaPagamento) params.append('formaPagamento', options.formaPagamento)

      const response = await api.get(`/pagamento?${params.toString()}`)
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  return {
    data: data || [],
    isLoading,
    error: error?.message
  }
}

export function useFinanceiro(options: UseFinanceiroOptions = {}) {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Buscar dados financeiros
  const { data: financeiroData, isLoading, error: queryError } = useQuery<FinanceiroData>({
    queryKey: ['financeiro', options],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (options.periodoInicio) params.append('periodoInicio', options.periodoInicio)
      if (options.periodoFim) params.append('periodoFim', options.periodoFim)
      if (options.status) params.append('status', options.status)
      if (options.tipo) params.append('tipo', options.tipo)
      if (options.formaPagamento) params.append('formaPagamento', options.formaPagamento)

      const response = await api.get(`/financeiro?${params.toString()}`)
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  // Criar faturamento
  const criarFaturamento = useMutation({
    mutationFn: async (faturamento: Omit<Faturamento, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post('/financeiro/faturamento', faturamento)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeiro'] })
    },
  })

  // Registrar pagamento
  const registrarPagamento = useMutation({
    mutationFn: async (pagamento: Omit<Pagamento, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post('/financeiro/pagamento', pagamento)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeiro'] })
    },
  })

  // Atualizar faturamento
  const atualizarFaturamento = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Faturamento> }) => {
      const response = await api.put(`/financeiro/faturamento/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeiro'] })
    },
  })

  // Deletar faturamento
  const deletarFaturamento = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/financeiro/faturamento/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeiro'] })
    },
  })

  // Exportar relatório
  const exportarRelatorio = useMutation({
    mutationFn: async (tipo: 'faturamento' | 'pagamentos', formato: 'pdf' | 'excel' | 'csv' = 'pdf') => {
      const response = await api.get(`/financeiro/exportar/${tipo}`, {
        params: { formato },
        responseType: 'blob'
      })
      return response.data
    },
  })

  return {
    // Dados
    data: financeiroData,
    
    // Estados
    loading: isLoading || loading,
    error: error || queryError?.message,
    
    // Mutations
    criarFaturamento,
    registrarPagamento,
    atualizarFaturamento,
    deletarFaturamento,
    exportarRelatorio,
    
    // Funções auxiliares
    refetch: () => queryClient.invalidateQueries({ queryKey: ['financeiro'] })
  }
} 
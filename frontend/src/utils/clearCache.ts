/**
 * Função para limpar cache e localStorage relacionado ao modal antigo de faturas
 */
export function clearModalCache() {
  // Limpar localStorage relacionado ao modal antigo
  const keysToRemove = [
    'modal-dismissed',
    'fatura-atraso-dismissed',
    'aviso-bloqueio-dismissed',
    'modal-shown',
    'fatura-notification-dismissed'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  // Limpar cache do React Query relacionado a faturas
  if (window.__REACT_QUERY_CACHE__) {
    const queryClient = window.__REACT_QUERY_CACHE__;
    queryClient.invalidateQueries({ queryKey: ['faturas-clinica'] });
    queryClient.invalidateQueries({ queryKey: ['bloqueio-clinica'] });
    queryClient.invalidateQueries({ queryKey: ['notificacoes-lembretes'] });
  }

  console.log('Cache limpo com sucesso');
}

// Declaração global para o cache do React Query
declare global {
  interface Window {
    __REACT_QUERY_CACHE__?: any;
  }
} 
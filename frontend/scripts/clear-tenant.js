// Script para limpar o tenant incorreto do localStorage
console.log('🧹 Limpando tenant incorreto do localStorage...');

// Remover o tenant incorreto
localStorage.removeItem('tenantId');

// Definir o tenant correto
localStorage.setItem('tenantId', 'tenant-001');

console.log('✅ Tenant corrigido para: tenant-001');
console.log('🔄 Recarregue a página para aplicar as mudanças'); 
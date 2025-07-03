// Script para testar o frontend e verificar problemas de autenticação
console.log('🔍 Testando configuração do frontend...');

// Verificar se o localStorage tem os dados necessários
console.log('📋 Dados no localStorage:');
console.log('user:', localStorage.getItem('user'));
console.log('tenantId:', localStorage.getItem('tenantId'));
console.log('userInfo:', localStorage.getItem('userInfo'));

// Verificar se há cookies
console.log('🍪 Cookies:', document.cookie);

// Verificar se a API está acessível
fetch('http://localhost:8080/api/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ API Health Check:', data);
  })
  .catch(error => {
    console.error('❌ Erro no Health Check:', error);
  });

// Verificar se há dados de anamnese (se estiver logado)
const user = localStorage.getItem('user');
const tenantId = localStorage.getItem('tenantId');

if (user && tenantId) {
  console.log('🔐 Usuário logado detectado');
  
  fetch('http://localhost:8080/api/anamneses', {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-tenant-id': tenantId
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('📊 Dados de anamnese:', data);
    if (data.success && data.data) {
      console.log('✅ Anamneses encontradas:', data.data.length);
      if (data.data.length > 0) {
        console.log('📋 Primeira anamnese:', data.data[0]);
      }
    } else {
      console.log('❌ Nenhuma anamnese encontrada ou erro na resposta');
    }
  })
  .catch(error => {
    console.error('❌ Erro ao buscar anamneses:', error);
  });
} else {
  console.log('❌ Usuário não está logado');
  console.log('💡 Execute o login primeiro para testar a API');
} 
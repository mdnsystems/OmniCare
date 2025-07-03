// Script de teste para verificar o login
const API_URL = 'http://localhost:8080/api';

async function testLogin() {
  try {
    console.log('🧪 [TestLogin] Iniciando teste de login...');
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': 'clinica-teste-123'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: 'admin@teste.com',
        senha: '12345678'
      })
    });

    console.log('🧪 [TestLogin] Status da resposta:', response.status);
    console.log('🧪 [TestLogin] Headers da resposta:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('🧪 [TestLogin] Dados da resposta:', data);

    if (data.success) {
      console.log('✅ [TestLogin] Login bem-sucedido!');
      console.log('🧪 [TestLogin] Usuário:', data.data.usuario);
      console.log('🧪 [TestLogin] Cookies recebidos:', document.cookie);
    } else {
      console.log('❌ [TestLogin] Login falhou:', data.error);
    }

  } catch (error) {
    console.error('❌ [TestLogin] Erro no teste:', error);
  }
}

// Executar o teste se estiver no navegador
if (typeof window !== 'undefined') {
  window.testLogin = testLogin;
  console.log('🧪 [TestLogin] Script carregado. Execute testLogin() no console para testar.');
}

export { testLogin }; 
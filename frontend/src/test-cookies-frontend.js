// Script para testar cookies no frontend
const API_URL = 'http://localhost:8080/api';

async function testCookiesFrontend() {
  try {
    console.log('🍪 [TestCookiesFrontend] Testando cookies no frontend...');
    
    // Primeiro, fazer login para obter cookies
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': 'tenant-001'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: 'admin@clinica.com',
        senha: '@DLe200320'
      })
    });

    console.log('🍪 [TestCookiesFrontend] Status do login:', loginResponse.status);
    console.log('🍪 [TestCookiesFrontend] Cookies recebidos:', document.cookie);

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.error('❌ [TestCookiesFrontend] Erro no login:', errorData);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ [TestCookiesFrontend] Login bem-sucedido:', loginData);

    // Aguardar um pouco para os cookies serem definidos
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Testar uma requisição autenticada
    const testResponse = await fetch(`${API_URL}/dashboard`, {
      method: 'GET',
      headers: {
        'x-tenant-id': 'tenant-001'
      },
      credentials: 'include'
    });

    console.log('🍪 [TestCookiesFrontend] Status da requisição autenticada:', testResponse.status);
    console.log('🍪 [TestCookiesFrontend] Cookies enviados:', document.cookie);

    if (!testResponse.ok) {
      const errorData = await testResponse.json();
      console.error('❌ [TestCookiesFrontend] Erro na requisição autenticada:', errorData);
      return;
    }

    const testData = await testResponse.json();
    console.log('✅ [TestCookiesFrontend] Requisição autenticada bem-sucedida:', testData);

  } catch (error) {
    console.error('❌ [TestCookiesFrontend] Erro:', error);
  }
}

// Executar o teste se estiver no navegador
if (typeof window !== 'undefined') {
  window.testCookiesFrontend = testCookiesFrontend;
  console.log('🍪 [TestCookiesFrontend] Script carregado. Execute testCookiesFrontend() no console para testar.');
}

export { testCookiesFrontend }; 
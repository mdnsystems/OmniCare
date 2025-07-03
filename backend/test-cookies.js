const axios = require('axios');

async function testCookies() {
  try {
    console.log('🍪 [TestCookies] Testando envio de cookies...');
    
    // Primeiro, fazer login para obter cookies
    const loginResponse = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'admin@clinica.com',
      senha: '@DLe200320'
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': 'tenant-001'
      }
    });

    console.log('✅ [TestCookies] Login bem-sucedido');
    console.log('🍪 [TestCookies] Cookies recebidos:', loginResponse.headers['set-cookie']);

    // Extrair cookies da resposta
    const cookies = loginResponse.headers['set-cookie'];
    if (!cookies) {
      console.log('❌ [TestCookies] Nenhum cookie recebido');
      return;
    }

    // Criar string de cookies para enviar nas próximas requisições
    const cookieString = cookies.map(cookie => cookie.split(';')[0]).join('; ');
    console.log('🍪 [TestCookies] Cookie string:', cookieString);

    // Testar uma requisição autenticada
    const testResponse = await axios.get('http://localhost:8080/api/dashboard', {
      headers: {
        'Cookie': cookieString,
        'x-tenant-id': 'tenant-001'
      },
      withCredentials: true
    });

    console.log('✅ [TestCookies] Requisição autenticada bem-sucedida');
    console.log('📊 [TestCookies] Dados recebidos:', testResponse.data);

  } catch (error) {
    console.error('❌ [TestCookies] Erro:', error.response?.data || error.message);
    console.error('📊 [TestCookies] Status:', error.response?.status);
    console.error('🍪 [TestCookies] Cookies enviados:', error.config?.headers?.Cookie);
  }
}

testCookies(); 
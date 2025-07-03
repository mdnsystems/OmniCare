const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔍 Testando login do usuário ADMIN...');
    
    const loginResponse = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'admin@clinica.com',
      senha: 'senha123',
      tenantId: 'tenant-001'
    });

    console.log('✅ Login bem-sucedido!');
    console.log('📋 Resposta do login:', JSON.stringify(loginResponse.data, null, 2));
    
    const { accessToken } = loginResponse.data.data;
    
    console.log('\n🔍 Testando requisição para dashboard com o token...');
    
    const dashboardResponse = await axios.get('http://localhost:8080/api/dashboard', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('✅ Dashboard acessado com sucesso!');
    console.log('📋 Resposta do dashboard:', JSON.stringify(dashboardResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

testLogin(); 
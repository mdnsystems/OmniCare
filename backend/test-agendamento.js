const axios = require('axios');

async function testAgendamento() {
  try {
    // Primeiro, fazer login para obter o token
    const loginResponse = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'admin@clinica.com',
      senha: '123456'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('Token obtido:', token ? 'Sim' : 'Não');

    // Testar criação de agendamento
    const agendamentoData = {
      pacienteId: "fc83efbc-1520-413c-b80c-d62e353f5f5c",
      profissionalId: "bdbdefac-c550-462c-b5f9-b71c02366740",
      data: "2025-06-25T00:00:00",
      horaInicio: "11:30",
      horaFim: "12:00",
      tipo: "CONSULTA",
      observacoes: "Primeira consulta."
    };

    const response = await axios.post('http://localhost:8080/api/agendamentos', agendamentoData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Agendamento criado com sucesso:', response.data);
  } catch (error) {
    console.error('❌ Erro ao criar agendamento:', error.response?.data || error.message);
  }
}

testAgendamento(); 
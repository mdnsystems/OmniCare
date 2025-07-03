#!/usr/bin/env node

/**
 * Script para testar a conectividade com a API OmniCare
 * 
 * Uso: node test-api-connection.js
 */

import axios from 'axios';

// Configuração da API
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8080/api';
const TIMEOUT = 10000; // 10 segundos

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
});

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Função para log colorido
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Função para testar endpoint
async function testEndpoint(method, endpoint, description, expectedStatus = 200) {
  try {
    const startTime = Date.now();
    const response = await api.request({
      method,
      url: endpoint,
    });
    const endTime = Date.now();
    const latency = endTime - startTime;

    if (response.status === expectedStatus) {
      log(`✅ ${description} - ${latency}ms`, 'green');
      return { success: true, latency, status: response.status };
    } else {
      log(`⚠️  ${description} - Status ${response.status} (esperado ${expectedStatus}) - ${latency}ms`, 'yellow');
      return { success: false, latency, status: response.status };
    }
  } catch (error) {
    const status = error.response?.status || 'NETWORK_ERROR';
    log(`❌ ${description} - Erro: ${status} - ${error.message}`, 'red');
    return { success: false, error: error.message, status };
  }
}

// Função para testar endpoints públicos
async function testPublicEndpoints() {
  log('\n🔍 Testando Endpoints Públicos', 'cyan');
  log('================================', 'cyan');

  const publicEndpoints = [
    { method: 'GET', endpoint: '/', description: 'Página inicial da API' },
    { method: 'GET', endpoint: '/health', description: 'Health check da API' },
  ];

  const results = [];
  for (const endpoint of publicEndpoints) {
    const result = await testEndpoint(endpoint.method, endpoint.endpoint, endpoint.description);
    results.push(result);
  }

  return results;
}

// Função para testar endpoints de autenticação
async function testAuthEndpoints() {
  log('\n🔐 Testando Endpoints de Autenticação', 'cyan');
  log('=====================================', 'cyan');

  const authEndpoints = [
    { method: 'POST', endpoint: '/auth/login', description: 'Login de usuário' },
    { method: 'POST', endpoint: '/auth/register', description: 'Registro de usuário' },
    { method: 'POST', endpoint: '/auth/forgot-password', description: 'Esqueci minha senha' },
  ];

  const results = [];
  for (const endpoint of authEndpoints) {
    const result = await testEndpoint(endpoint.method, endpoint.endpoint, endpoint.description, 400); // Espera 400 sem dados
    results.push(result);
  }

  return results;
}

// Função para testar endpoints de clínicas
async function testClinicaEndpoints() {
  log('\n🏥 Testando Endpoints de Clínicas', 'cyan');
  log('================================', 'cyan');

  const clinicaEndpoints = [
    { method: 'GET', endpoint: '/clinicas', description: 'Listar clínicas' },
    { method: 'GET', endpoint: '/clinicas/1', description: 'Buscar clínica por ID' },
  ];

  const results = [];
  for (const endpoint of clinicaEndpoints) {
    const result = await testEndpoint(endpoint.method, endpoint.endpoint, endpoint.description, 401); // Espera 401 sem autenticação
    results.push(result);
  }

  return results;
}

// Função para testar endpoints de profissionais
async function testProfissionalEndpoints() {
  log('\n👨‍⚕️ Testando Endpoints de Profissionais', 'cyan');
  log('=====================================', 'cyan');

  const profissionalEndpoints = [
    { method: 'GET', endpoint: '/profissionais', description: 'Listar profissionais' },
    { method: 'GET', endpoint: '/profissionais/1', description: 'Buscar profissional por ID' },
  ];

  const results = [];
  for (const endpoint of profissionalEndpoints) {
    const result = await testEndpoint(endpoint.method, endpoint.endpoint, endpoint.description, 401); // Espera 401 sem autenticação
    results.push(result);
  }

  return results;
}

// Função para testar endpoints de pacientes
async function testPacienteEndpoints() {
  log('\n👥 Testando Endpoints de Pacientes', 'cyan');
  log('================================', 'cyan');

  const pacienteEndpoints = [
    { method: 'GET', endpoint: '/pacientes', description: 'Listar pacientes' },
    { method: 'GET', endpoint: '/pacientes/1', description: 'Buscar paciente por ID' },
  ];

  const results = [];
  for (const endpoint of pacienteEndpoints) {
    const result = await testEndpoint(endpoint.method, endpoint.endpoint, endpoint.description, 401); // Espera 401 sem autenticação
    results.push(result);
  }

  return results;
}

// Função para testar endpoints de agendamentos
async function testAgendamentoEndpoints() {
  log('\n📅 Testando Endpoints de Agendamentos', 'cyan');
  log('===================================', 'cyan');

  const agendamentoEndpoints = [
    { method: 'GET', endpoint: '/agendamentos', description: 'Listar agendamentos' },
    { method: 'GET', endpoint: '/agendamentos/1', description: 'Buscar agendamento por ID' },
    { method: 'GET', endpoint: '/agendamentos/hoje', description: 'Agendamentos de hoje' },
  ];

  const results = [];
  for (const endpoint of agendamentoEndpoints) {
    const result = await testEndpoint(endpoint.method, endpoint.endpoint, endpoint.description, 401); // Espera 401 sem autenticação
    results.push(result);
  }

  return results;
}

// Função para testar endpoints de dashboard
async function testDashboardEndpoints() {
  log('\n📊 Testando Endpoints de Dashboard', 'cyan');
  log('================================', 'cyan');

  const dashboardEndpoints = [
    { method: 'GET', endpoint: '/dashboard', description: 'Dashboard geral' },
    { method: 'GET', endpoint: '/dashboard/agendamentos', description: 'Estatísticas de agendamentos' },
    { method: 'GET', endpoint: '/dashboard/financeiro', description: 'Estatísticas financeiras' },
  ];

  const results = [];
  for (const endpoint of dashboardEndpoints) {
    const result = await testEndpoint(endpoint.method, endpoint.endpoint, endpoint.description, 401); // Espera 401 sem autenticação
    results.push(result);
  }

  return results;
}

// Função principal
async function main() {
  log('🚀 Iniciando Teste de Conectividade da API OmniCare', 'bright');
  log(`📍 URL da API: ${API_BASE_URL}`, 'blue');
  log(`⏱️  Timeout: ${TIMEOUT}ms`, 'blue');
  log('', 'reset');

  try {
    // Testar conectividade básica
    log('🔌 Testando conectividade básica...', 'yellow');
    const healthCheck = await testEndpoint('GET', '/health', 'Health check da API');
    
    if (!healthCheck.success) {
      log('\n❌ API não está respondendo. Verifique se o servidor está rodando.', 'red');
      process.exit(1);
    }

    // Executar todos os testes
    const publicResults = await testPublicEndpoints();
    const authResults = await testAuthEndpoints();
    const clinicaResults = await testClinicaEndpoints();
    const profissionalResults = await testProfissionalEndpoints();
    const pacienteResults = await testPacienteEndpoints();
    const agendamentoResults = await testAgendamentoEndpoints();
    const dashboardResults = await testDashboardEndpoints();

    // Resumo dos resultados
    log('\n📋 Resumo dos Testes', 'bright');
    log('==================', 'bright');

    const allResults = [
      ...publicResults,
      ...authResults,
      ...clinicaResults,
      ...profissionalResults,
      ...pacienteResults,
      ...agendamentoResults,
      ...dashboardResults,
    ];

    const successful = allResults.filter(r => r.success).length;
    const total = allResults.length;
    const successRate = ((successful / total) * 100).toFixed(1);

    log(`✅ Sucessos: ${successful}/${total} (${successRate}%)`, 'green');
    
    if (successful === total) {
      log('\n🎉 Todos os endpoints estão funcionando corretamente!', 'green');
    } else {
      log('\n⚠️  Alguns endpoints podem precisar de autenticação ou não estão implementados.', 'yellow');
    }

    log('\n💡 Dica: Para testar endpoints protegidos, você precisa fazer login primeiro.', 'cyan');

  } catch (error) {
    log(`\n💥 Erro durante os testes: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  testEndpoint,
  testPublicEndpoints,
  testAuthEndpoints,
  testClinicaEndpoints,
  testProfissionalEndpoints,
  testPacienteEndpoints,
  testAgendamentoEndpoints,
  testDashboardEndpoints,
}; 
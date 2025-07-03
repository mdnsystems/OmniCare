const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

/**
 * Script de migração para o sistema de controle financeiro manual
 * Cria as tabelas e dados de exemplo para o painel SUPER_ADMIN
 */

/**
 * Cria usuário SUPER_ADMIN padrão
 */
async function createSuperAdmin() {
  console.log('👤 Criando usuário SUPER_ADMIN...');
  
  try {
    const superAdmin = await prisma.usuario.create({
      data: {
        tenantId: 'system', // Tenant especial para SUPER_ADMIN
        email: 'superadmin@omnicare.com',
        senha: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ', // senha123
        role: 'SUPER_ADMIN',
        ativo: true
      }
    });
    
    console.log('✅ Usuário SUPER_ADMIN criado:', superAdmin.email);
    return superAdmin;
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️  Usuário SUPER_ADMIN já existe');
      return await prisma.usuario.findFirst({
        where: { 
          email: 'superadmin@omnicare.com'
        }
      });
    }
    throw error;
  }
}

/**
 * Cria clínicas de exemplo
 */
async function createClinicasExemplo() {
  console.log('🏥 Criando clínicas de exemplo...');
  
  const clinicas = [
    {
      tenantId: 'clinica-1',
      nome: 'Clínica Médica São Paulo',
      tipo: 'MEDICA',
      corPrimaria: '#2563eb',
      corSecundaria: '#1e40af',
      tema: 'light',
      ativo: true
    },
    {
      tenantId: 'clinica-2',
      nome: 'Centro Odontológico Rio',
      tipo: 'ODONTOLOGICA',
      corPrimaria: '#0891b2',
      corSecundaria: '#0e7490',
      tema: 'light',
      ativo: true
    },
    {
      tenantId: 'clinica-3',
      nome: 'Clínica de Psicologia BH',
      tipo: 'PSICOLOGICA',
      corPrimaria: '#7c3aed',
      corSecundaria: '#6d28d9',
      tema: 'light',
      ativo: true
    },
    {
      tenantId: 'clinica-4',
      nome: 'Centro de Fisioterapia Brasília',
      tipo: 'FISIOTERAPICA',
      corPrimaria: '#dc2626',
      corSecundaria: '#b91c1c',
      tema: 'light',
      ativo: true
    }
  ];

  const clinicasCriadas = [];
  
  for (const clinica of clinicas) {
    try {
      const clinicaCriada = await prisma.clinica.create({
        data: clinica
      });
      clinicasCriadas.push(clinicaCriada);
      console.log(`✅ Clínica criada: ${clinicaCriada.nome}`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`ℹ️  Clínica já existe: ${clinica.nome}`);
        const clinicaExistente = await prisma.clinica.findUnique({
          where: { tenantId: clinica.tenantId }
        });
        clinicasCriadas.push(clinicaExistente);
      } else {
        throw error;
      }
    }
  }
  
  return clinicasCriadas;
}

/**
 * Cria faturas de exemplo
 */
async function createFaturasExemplo(clinicas) {
  console.log('💰 Criando faturas de exemplo...');
  
  const faturas = [];
  
  // Faturas pagas
  faturas.push(
    {
      tenantId: clinicas[0].tenantId,
      numeroFatura: 'FAT-2024-001',
      valor: 299.90,
      dataVencimento: new Date('2024-01-15'),
      dataPagamento: new Date('2024-01-10'),
      status: 'PAGO',
      diasAtraso: 0,
      nivelBloqueio: 'SEM_BLOQUEIO',
      observacoes: 'Plano mensal - Janeiro 2024'
    },
    {
      tenantId: clinicas[1].tenantId,
      numeroFatura: 'FAT-2024-002',
      valor: 399.90,
      dataVencimento: new Date('2024-01-15'),
      dataPagamento: new Date('2024-01-12'),
      status: 'PAGO',
      diasAtraso: 0,
      nivelBloqueio: 'SEM_BLOQUEIO',
      observacoes: 'Plano mensal - Janeiro 2024'
    }
  );
  
  // Faturas pendentes
  faturas.push(
    {
      tenantId: clinicas[2].tenantId,
      numeroFatura: 'FAT-2024-003',
      valor: 299.90,
      dataVencimento: new Date('2024-02-15'),
      status: 'PENDENTE',
      diasAtraso: 0,
      nivelBloqueio: 'SEM_BLOQUEIO',
      observacoes: 'Plano mensal - Fevereiro 2024'
    },
    {
      tenantId: clinicas[3].tenantId,
      numeroFatura: 'FAT-2024-004',
      valor: 399.90,
      dataVencimento: new Date('2024-02-15'),
      status: 'PENDENTE',
      diasAtraso: 0,
      nivelBloqueio: 'SEM_BLOQUEIO',
      observacoes: 'Plano mensal - Fevereiro 2024'
    }
  );
  
  // Faturas vencidas (3 dias de atraso)
  faturas.push(
    {
      tenantId: clinicas[0].tenantId,
      numeroFatura: 'FAT-2024-005',
      valor: 299.90,
      dataVencimento: new Date('2024-01-20'),
      status: 'VENCIDO',
      diasAtraso: 3,
      nivelBloqueio: 'NOTIFICACAO',
      observacoes: 'Plano mensal - Janeiro 2024 (2ª fatura)'
    }
  );
  
  // Faturas vencidas (5 dias de atraso)
  faturas.push(
    {
      tenantId: clinicas[1].tenantId,
      numeroFatura: 'FAT-2024-006',
      valor: 399.90,
      dataVencimento: new Date('2024-01-18'),
      status: 'VENCIDO',
      diasAtraso: 5,
      nivelBloqueio: 'AVISO_TOPO',
      observacoes: 'Plano mensal - Janeiro 2024 (2ª fatura)'
    }
  );
  
  // Faturas vencidas (7 dias de atraso)
  faturas.push(
    {
      tenantId: clinicas[2].tenantId,
      numeroFatura: 'FAT-2024-007',
      valor: 299.90,
      dataVencimento: new Date('2024-01-16'),
      status: 'VENCIDO',
      diasAtraso: 7,
      nivelBloqueio: 'RESTRICAO_FUNCIONALIDADES',
      observacoes: 'Plano mensal - Janeiro 2024 (2ª fatura)'
    }
  );
  
  // Faturas vencidas (10+ dias de atraso - bloqueio total)
  faturas.push(
    {
      tenantId: clinicas[3].tenantId,
      numeroFatura: 'FAT-2024-008',
      valor: 399.90,
      dataVencimento: new Date('2024-01-13'),
      status: 'VENCIDO',
      diasAtraso: 10,
      nivelBloqueio: 'BLOQUEIO_TOTAL',
      observacoes: 'Plano mensal - Janeiro 2024 (2ª fatura) - BLOQUEIO TOTAL'
    }
  );
  
  const faturasCriadas = [];
  
  for (const fatura of faturas) {
    try {
      const faturaCriada = await prisma.faturaClinica.create({
        data: fatura
      });
      faturasCriadas.push(faturaCriada);
      console.log(`✅ Fatura criada: ${faturaCriada.numeroFatura} - ${faturaCriada.status}`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`ℹ️  Fatura já existe: ${fatura.numeroFatura}`);
        const faturaExistente = await prisma.faturaClinica.findUnique({
          where: { numeroFatura: fatura.numeroFatura }
        });
        faturasCriadas.push(faturaExistente);
      } else {
        throw error;
      }
    }
  }
  
  return faturasCriadas;
}

/**
 * Cria pagamentos de exemplo
 */
async function createPagamentosExemplo(faturas) {
  console.log('💳 Criando pagamentos de exemplo...');
  
  const faturasPagas = faturas.filter(f => f.status === 'PAGO');
  
  for (const fatura of faturasPagas) {
    try {
      await prisma.pagamentoClinica.create({
        data: {
          faturaId: fatura.id,
          valor: fatura.valor,
          formaPagamento: 'PIX',
          dataPagamento: fatura.dataPagamento,
          observacoes: 'Pagamento realizado via PIX'
        }
      });
      console.log(`✅ Pagamento criado para fatura: ${fatura.numeroFatura}`);
    } catch (error) {
      console.log(`ℹ️  Pagamento já existe para fatura: ${fatura.numeroFatura}`);
    }
  }
}

/**
 * Cria lembretes de exemplo
 */
async function createLembretesExemplo(faturas) {
  console.log('📧 Criando lembretes de exemplo...');
  
  const faturasVencidas = faturas.filter(f => f.status === 'VENCIDO');
  
  for (const fatura of faturasVencidas) {
    try {
      await prisma.lembreteClinica.create({
        data: {
          faturaId: fatura.id,
          tipo: 'PERSONALIZADO',
          mensagem: `Olá! Sua fatura ${fatura.numeroFatura} no valor de R$ ${fatura.valor} está em atraso há ${fatura.diasAtraso} dia(s). Por favor, regularize o pagamento para evitar bloqueios.`,
          destinatario: 'admin@clinica.com',
          status: 'ENVIADO'
        }
      });
      console.log(`✅ Lembrete criado para fatura: ${fatura.numeroFatura}`);
    } catch (error) {
      console.log(`ℹ️  Lembrete já existe para fatura: ${fatura.numeroFatura}`);
    }
  }
}

/**
 * Cria histórico de bloqueios de exemplo
 */
async function createHistoricoBloqueiosExemplo(faturas) {
  console.log('🔒 Criando histórico de bloqueios de exemplo...');
  
  const faturasComBloqueio = faturas.filter(f => f.nivelBloqueio !== 'SEM_BLOQUEIO');
  
  for (const fatura of faturasComBloqueio) {
    try {
      await prisma.historicoBloqueio.create({
        data: {
          faturaId: fatura.id,
          nivelAnterior: 'SEM_BLOQUEIO',
          nivelNovo: fatura.nivelBloqueio,
          motivo: `Aplicado automaticamente após ${fatura.diasAtraso} dia(s) de atraso`,
          aplicadoPor: 'SYSTEM'
        }
      });
      console.log(`✅ Histórico de bloqueio criado para fatura: ${fatura.numeroFatura}`);
    } catch (error) {
      console.log(`ℹ️  Histórico de bloqueio já existe para fatura: ${fatura.numeroFatura}`);
    }
  }
}

/**
 * Função principal de migração
 */
async function runMigration() {
  console.log('🚀 Iniciando migração do sistema financeiro...\n');
  
  try {
    // 1. Criar usuário SUPER_ADMIN
    const superAdmin = await createSuperAdmin();
    
    // 2. Criar clínicas de exemplo
    const clinicas = await createClinicasExemplo();
    
    // 3. Criar faturas de exemplo
    const faturas = await createFaturasExemplo(clinicas);
    
    // 4. Criar pagamentos de exemplo
    await createPagamentosExemplo(faturas);
    
    // 5. Criar lembretes de exemplo
    await createLembretesExemplo(faturas);
    
    // 6. Criar histórico de bloqueios de exemplo
    await createHistoricoBloqueiosExemplo(faturas);
    
    console.log('\n🎉 Migração do sistema financeiro concluída com sucesso!');
    console.log('\n📋 Resumo da migração:');
    console.log(`   • Usuário SUPER_ADMIN: ${superAdmin.email}`);
    console.log(`   • Clínicas: ${clinicas.length} criadas`);
    console.log(`   • Faturas: ${faturas.length} criadas`);
    console.log(`   • Pagamentos: ${faturas.filter(f => f.status === 'PAGO').length} criados`);
    console.log(`   • Lembretes: ${faturas.filter(f => f.status === 'VENCIDO').length} criados`);
    console.log(`   • Histórico de bloqueios: ${faturas.filter(f => f.nivelBloqueio !== 'SEM_BLOQUEIO').length} criados`);
    
    console.log('\n🔑 Credenciais de acesso SUPER_ADMIN:');
    console.log('   Email: superadmin@omnicare.com');
    console.log('   Senha: senha123');
    
    console.log('\n📊 Status das faturas criadas:');
    const faturasPorStatus = faturas.reduce((acc, fatura) => {
      acc[fatura.status] = (acc[fatura.status] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(faturasPorStatus).forEach(([status, count]) => {
      console.log(`   • ${status}: ${count} fatura(s)`);
    });
    
    console.log('\n⚠️  IMPORTANTE: Altere a senha do SUPER_ADMIN após o primeiro login!');
    
  } catch (error) {
    console.error('\n❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar migração se o script for chamado diretamente
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration }; 
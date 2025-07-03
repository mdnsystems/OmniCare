const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Dados de exemplo para clínicas
const clinicasExemplo = [
  {
    tenantId: 'clinica-psicologia-001',
    nome: 'Clínica Psicológica Bem-Estar',
    tipo: 'PSICOLOGICA',
    corPrimaria: '#7c3aed',
    corSecundaria: '#6d28d9',
    tema: 'light',
    ativo: true
  },
  {
    tenantId: 'clinica-nutricao-002',
    nome: 'Centro de Nutrição Saudável',
    tipo: 'NUTRICIONAL',
    corPrimaria: '#059669',
    corSecundaria: '#047857',
    tema: 'light',
    ativo: true
  },
  {
    tenantId: 'clinica-fisioterapia-003',
    nome: 'Clínica de Fisioterapia Recuperar',
    tipo: 'FISIOTERAPICA',
    corPrimaria: '#dc2626',
    corSecundaria: '#b91c1c',
    tema: 'light',
    ativo: true
  },
  {
    tenantId: 'clinica-odontologia-004',
    nome: 'Clínica Odontológica Sorriso',
    tipo: 'ODONTOLOGICA',
    corPrimaria: '#0891b2',
    corSecundaria: '#0e7490',
    tema: 'light',
    ativo: true
  },
  {
    tenantId: 'clinica-estetica-005',
    nome: 'Centro de Estética Beleza Natural',
    tipo: 'ESTETICA',
    corPrimaria: '#ec4899',
    corSecundaria: '#db2777',
    tema: 'light',
    ativo: true
  }
];

// Dados de exemplo para faturas
const faturasExemplo = [
  // Fatura em dia
  {
    numeroFatura: 'FAT-2024-001',
    valor: 299.90,
    dataVencimento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias no futuro
    status: 'PENDENTE',
    diasAtraso: 0,
    nivelBloqueio: 'SEM_BLOQUEIO',
    observacoes: 'Fatura mensal - Plano Básico'
  },
  // Fatura com 3 dias de atraso (notificação)
  {
    numeroFatura: 'FAT-2024-002',
    valor: 199.90,
    dataVencimento: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    status: 'VENCIDO',
    diasAtraso: 3,
    nivelBloqueio: 'NOTIFICACAO',
    observacoes: 'Fatura mensal - Plano Básico'
  },
  // Fatura com 5 dias de atraso (aviso no topo)
  {
    numeroFatura: 'FAT-2024-003',
    valor: 399.90,
    dataVencimento: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
    status: 'VENCIDO',
    diasAtraso: 5,
    nivelBloqueio: 'AVISO_TOPO',
    observacoes: 'Fatura mensal - Plano Premium'
  },
  // Fatura com 7 dias de atraso (restrição)
  {
    numeroFatura: 'FAT-2024-004',
    valor: 499.90,
    dataVencimento: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
    status: 'VENCIDO',
    diasAtraso: 7,
    nivelBloqueio: 'RESTRICAO_FUNCIONALIDADES',
    observacoes: 'Fatura mensal - Plano Premium'
  },
  // Fatura com 10 dias de atraso (bloqueio total)
  {
    numeroFatura: 'FAT-2024-005',
    valor: 599.90,
    dataVencimento: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 dias atrás
    status: 'VENCIDO',
    diasAtraso: 10,
    nivelBloqueio: 'BLOQUEIO_TOTAL',
    observacoes: 'Fatura mensal - Plano Enterprise'
  },
  // Fatura paga
  {
    numeroFatura: 'FAT-2024-006',
    valor: 299.90,
    dataVencimento: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
    dataPagamento: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Paga há 1 dia
    status: 'PAGO',
    diasAtraso: 0,
    nivelBloqueio: 'SEM_BLOQUEIO',
    observacoes: 'Fatura mensal - Plano Básico'
  }
];

async function gerarDadosExemplo() {
  console.log('🚀 Iniciando geração de dados de exemplo...');

  try {
    // Criar clínicas
    console.log('📋 Criando clínicas...');
    for (const clinica of clinicasExemplo) {
      try {
        await prisma.clinica.create({
          data: clinica
        });
        console.log(`✅ Clínica criada: ${clinica.nome}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`ℹ️  Clínica já existe: ${clinica.nome}`);
        } else {
          console.error(`❌ Erro ao criar clínica ${clinica.nome}:`, error.message);
        }
      }
    }

    // Criar faturas para cada clínica
    console.log('💰 Criando faturas...');
    for (const clinica of clinicasExemplo) {
      for (let i = 0; i < faturasExemplo.length; i++) {
        const fatura = faturasExemplo[i];
        const numeroFatura = `${fatura.numeroFatura}-${clinica.tenantId.split('-')[2]}`;
        
        try {
          await prisma.faturaClinica.create({
            data: {
              tenantId: clinica.tenantId,
              numeroFatura,
              valor: fatura.valor,
              dataVencimento: fatura.dataVencimento,
              dataPagamento: fatura.dataPagamento,
              status: fatura.status,
              diasAtraso: fatura.diasAtraso,
              nivelBloqueio: fatura.nivelBloqueio,
              observacoes: fatura.observacoes
            }
          });
          console.log(`✅ Fatura criada: ${numeroFatura} para ${clinica.nome}`);
        } catch (error) {
          if (error.code === 'P2002') {
            console.log(`ℹ️  Fatura já existe: ${numeroFatura}`);
          } else {
            console.error(`❌ Erro ao criar fatura ${numeroFatura}:`, error.message);
          }
        }
      }
    }

    // Criar histórico de bloqueios
    console.log('🔒 Criando histórico de bloqueios...');
    const faturas = await prisma.faturaClinica.findMany({
      where: {
        nivelBloqueio: {
          not: 'SEM_BLOQUEIO'
        }
      }
    });

    for (const fatura of faturas) {
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
        if (error.code === 'P2002') {
          console.log(`ℹ️  Histórico de bloqueio já existe para fatura: ${fatura.numeroFatura}`);
        } else {
          console.error(`❌ Erro ao criar histórico de bloqueio:`, error.message);
        }
      }
    }

    // Criar lembretes
    console.log('📧 Criando lembretes...');
    const faturasVencidas = await prisma.faturaClinica.findMany({
      where: {
        status: 'VENCIDO'
      }
    });

    for (const fatura of faturasVencidas) {
      try {
        await prisma.lembreteClinica.create({
          data: {
            faturaId: fatura.id,
            tipo: 'NOTIFICACAO_3_DIAS',
            mensagem: `Lembrete: Sua fatura ${fatura.numeroFatura} está em atraso há ${fatura.diasAtraso} dias.`,
            destinatario: 'admin@clinica.com',
            status: 'ENVIADO'
          }
        });
        console.log(`✅ Lembrete criado para fatura: ${fatura.numeroFatura}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`ℹ️  Lembrete já existe para fatura: ${fatura.numeroFatura}`);
        } else {
          console.error(`❌ Erro ao criar lembrete:`, error.message);
        }
      }
    }

    console.log('🎉 Dados de exemplo gerados com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`- ${clinicasExemplo.length} clínicas criadas`);
    console.log(`- ${clinicasExemplo.length * faturasExemplo.length} faturas criadas`);
    console.log(`- ${faturas.length} históricos de bloqueio criados`);
    console.log(`- ${faturasVencidas.length} lembretes criados`);

  } catch (error) {
    console.error('❌ Erro ao gerar dados de exemplo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  gerarDadosExemplo();
}

module.exports = { gerarDadosExemplo }; 
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function gerarLembretesExemplo() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados');

    // Buscar clínicas existentes
    const clinicas = await prisma.clinica.findMany({
      take: 3
    });

    if (clinicas.length === 0) {
      console.log('❌ Nenhuma clínica encontrada. Execute primeiro o script de seed de clínicas.');
      return;
    }

    console.log(`📋 Encontradas ${clinicas.length} clínicas`);

    // Criar faturas de exemplo para cada clínica
    const faturas = [];
    for (const clinica of clinicas) {
      // Fatura em dia
      faturas.push(await prisma.faturaClinica.create({
        data: {
          tenantId: clinica.tenantId,
          numeroFatura: `FAT-${clinica.tenantId.slice(0, 8)}-001`,
          valor: 299.90,
          dataVencimento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias no futuro
          status: 'PENDENTE',
          diasAtraso: 0,
          nivelBloqueio: 'SEM_BLOQUEIO',
          observacoes: 'Fatura mensal - Plano Básico'
        }
      }));

      // Fatura com 3 dias de atraso
      faturas.push(await prisma.faturaClinica.create({
        data: {
          tenantId: clinica.tenantId,
          numeroFatura: `FAT-${clinica.tenantId.slice(0, 8)}-002`,
          valor: 199.90,
          dataVencimento: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
          status: 'VENCIDO',
          diasAtraso: 3,
          nivelBloqueio: 'NOTIFICACAO',
          observacoes: 'Fatura mensal - Plano Básico'
        }
      }));

      // Fatura com 5 dias de atraso
      faturas.push(await prisma.faturaClinica.create({
        data: {
          tenantId: clinica.tenantId,
          numeroFatura: `FAT-${clinica.tenantId.slice(0, 8)}-003`,
          valor: 399.90,
          dataVencimento: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
          status: 'VENCIDO',
          diasAtraso: 5,
          nivelBloqueio: 'AVISO_TOPO',
          observacoes: 'Fatura mensal - Plano Premium'
        }
      }));

      // Fatura com 7 dias de atraso
      faturas.push(await prisma.faturaClinica.create({
        data: {
          tenantId: clinica.tenantId,
          numeroFatura: `FAT-${clinica.tenantId.slice(0, 8)}-004`,
          valor: 499.90,
          dataVencimento: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
          status: 'VENCIDO',
          diasAtraso: 7,
          nivelBloqueio: 'RESTRICAO_FUNCIONALIDADES',
          observacoes: 'Fatura mensal - Plano Premium'
        }
      }));

      // Fatura com 10 dias de atraso
      faturas.push(await prisma.faturaClinica.create({
        data: {
          tenantId: clinica.tenantId,
          numeroFatura: `FAT-${clinica.tenantId.slice(0, 8)}-005`,
          valor: 599.90,
          dataVencimento: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 dias atrás
          status: 'VENCIDO',
          diasAtraso: 10,
          nivelBloqueio: 'BLOQUEIO_TOTAL',
          observacoes: 'Fatura mensal - Plano Enterprise'
        }
      }));
    }

    console.log(`💰 Criadas ${faturas.length} faturas de exemplo`);

    // Criar lembretes para faturas vencidas
    const faturasVencidas = faturas.filter(f => f.status === 'VENCIDO');
    const lembretes = [];

    for (const fatura of faturasVencidas) {
      // Lembrete automático baseado nos dias de atraso
      let tipoLembrete, mensagem;
      
      if (fatura.diasAtraso >= 10) {
        tipoLembrete = 'BLOQUEIO_10_DIAS';
        mensagem = `🚨 ATENÇÃO: Sua fatura ${fatura.numeroFatura} está em atraso há ${fatura.diasAtraso} dias. O sistema será bloqueado em breve.`;
      } else if (fatura.diasAtraso >= 7) {
        tipoLembrete = 'RESTRICAO_7_DIAS';
        mensagem = `⚠️ AVISO: Sua fatura ${fatura.numeroFatura} está em atraso há ${fatura.diasAtraso} dias. Algumas funcionalidades podem ser restringidas.`;
      } else if (fatura.diasAtraso >= 5) {
        tipoLembrete = 'AVISO_5_DIAS';
        mensagem = `📢 Aviso: Sua fatura ${fatura.numeroFatura} está em atraso há ${fatura.diasAtraso} dias.`;
      } else if (fatura.diasAtraso >= 3) {
        tipoLembrete = 'NOTIFICACAO_3_DIAS';
        mensagem = `📧 Lembrete: Sua fatura ${fatura.numeroFatura} está em atraso há ${fatura.diasAtraso} dias.`;
      } else {
        tipoLembrete = 'PERSONALIZADO';
        mensagem = `💳 Sua fatura ${fatura.numeroFatura} venceu há ${fatura.diasAtraso} dias.`;
      }

      lembretes.push(await prisma.lembreteClinica.create({
        data: {
          faturaId: fatura.id,
          tipo: tipoLembrete,
          mensagem: mensagem,
          destinatario: 'admin@clinica.com',
          status: 'ENVIADO'
        }
      }));

      // Criar histórico de bloqueio
      await prisma.historicoBloqueio.create({
        data: {
          faturaId: fatura.id,
          nivelAnterior: 'SEM_BLOQUEIO',
          nivelNovo: fatura.nivelBloqueio,
          motivo: `Aplicado automaticamente após ${fatura.diasAtraso} dia(s) de atraso`,
          aplicadoPor: 'SYSTEM'
        }
      });
    }

    console.log(`📧 Criados ${lembretes.length} lembretes de exemplo`);

    // Criar alguns lembretes personalizados
    const lembretesPersonalizados = [];
    for (let i = 0; i < 3; i++) {
      const fatura = faturasVencidas[i];
      if (fatura) {
        lembretesPersonalizados.push(await prisma.lembreteClinica.create({
          data: {
            faturaId: fatura.id,
            tipo: 'PERSONALIZADO',
            mensagem: `Olá! Este é um lembrete personalizado sobre sua fatura ${fatura.numeroFatura} no valor de R$ ${fatura.valor}. Por favor, regularize o pagamento para evitar interrupções no serviço.`,
            destinatario: 'admin@clinica.com',
            status: 'ENVIADO'
          }
        }));
      }
    }

    console.log(`✉️ Criados ${lembretesPersonalizados.length} lembretes personalizados`);

    console.log('\n🎉 Dados de exemplo gerados com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`   - ${clinicas.length} clínicas`);
    console.log(`   - ${faturas.length} faturas`);
    console.log(`   - ${faturasVencidas.length} faturas vencidas`);
    console.log(`   - ${lembretes.length + lembretesPersonalizados.length} lembretes`);
    console.log('\n🔗 Para testar:');
    console.log('   1. Inicie o frontend: npm run dev');
    console.log('   2. Faça login como ADMIN');
    console.log('   3. Verifique o botão de notificações no header');

  } catch (error) {
    console.error('❌ Erro ao gerar dados de exemplo:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Desconectado do banco de dados');
  }
}

// Executar o script
gerarLembretesExemplo(); 
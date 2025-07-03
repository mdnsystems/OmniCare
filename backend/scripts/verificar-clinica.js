const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function verificarClinica() {
  try {
    console.log('🔍 Verificando se existe clínica com tenant_id = "1"...');
    
    // Verifica se existe uma clínica com tenant_id = "1"
    const clinica = await prisma.clinica.findUnique({
      where: { tenantId: '1' },
      include: {
        _count: {
          select: {
            usuarios: true,
            Paciente: true,
            Profissional: true,
            Agendamento: true,
            Prontuario: true,
            Exame: true,
            Anamnese: true,
            Mensagem: true,
          },
        },
      },
    });

    if (clinica) {
      console.log('✅ Clínica encontrada:');
      console.log(`   ID: ${clinica.id}`);
      console.log(`   Nome: ${clinica.nome}`);
      console.log(`   Tenant ID: ${clinica.tenantId}`);
      console.log(`   Tipo: ${clinica.tipo}`);
      console.log(`   Ativo: ${clinica.ativo}`);
      console.log(`   Criada em: ${clinica.createdAt}`);
      console.log('\n📊 Estatísticas:');
      console.log(`   Usuários: ${clinica._count.usuarios}`);
      console.log(`   Pacientes: ${clinica._count.Paciente}`);
      console.log(`   Profissionais: ${clinica._count.Profissional}`);
      console.log(`   Agendamentos: ${clinica._count.Agendamento}`);
      console.log(`   Prontuários: ${clinica._count.Prontuario}`);
      console.log(`   Exames: ${clinica._count.Exame}`);
      console.log(`   Anamneses: ${clinica._count.Anamnese}`);
      console.log(`   Mensagens: ${clinica._count.Mensagem}`);
    } else {
      console.log('❌ Clínica com tenant_id = "1" não encontrada');
      console.log('🔄 Criando clínica de teste...');
      
      // Cria uma clínica de teste
      const novaClinica = await prisma.clinica.create({
        data: {
          tenantId: '1',
          nome: 'Clínica Teste',
          tipo: 'MEDICA',
          corPrimaria: '#2563eb',
          corSecundaria: '#1e40af',
          tema: 'light',
          ativo: true,
        },
        include: {
          _count: {
            select: {
              usuarios: true,
              Paciente: true,
              Profissional: true,
              Agendamento: true,
              Prontuario: true,
              Exame: true,
              Anamnese: true,
              Mensagem: true,
            },
          },
        },
      });
      
      console.log('✅ Clínica de teste criada com sucesso:');
      console.log(`   ID: ${novaClinica.id}`);
      console.log(`   Nome: ${novaClinica.nome}`);
      console.log(`   Tenant ID: ${novaClinica.tenantId}`);
      console.log(`   Tipo: ${novaClinica.tipo}`);
      console.log(`   Ativo: ${novaClinica.ativo}`);
    }

    // Lista todas as clínicas
    console.log('\n📋 Listando todas as clínicas:');
    const todasClinicas = await prisma.clinica.findMany({
      select: {
        id: true,
        nome: true,
        tenantId: true,
        tipo: true,
        ativo: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    todasClinicas.forEach((clinica, index) => {
      console.log(`   ${index + 1}. ${clinica.nome} (tenant: ${clinica.tenantId}) - ${clinica.ativo ? 'Ativo' : 'Inativo'}`);
    });

  } catch (error) {
    console.error('❌ Erro ao verificar clínica:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarClinica(); 
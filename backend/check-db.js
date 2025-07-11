const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function verificarBanco() {
  try {
    console.log('🔍 Verificando estado do banco de dados...\n');

    // Verificar clínicas
    const clinicas = await prisma.clinica.findMany({
      select: {
        id: true,
        nome: true,
        tenantId: true,
        tipo: true,
        ativo: true,
        createdAt: true,
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

    console.log('📋 CLÍNICAS:');
    if (clinicas.length === 0) {
      console.log('   ❌ Nenhuma clínica encontrada');
    } else {
      clinicas.forEach((clinica, index) => {
        console.log(`   ${index + 1}. ${clinica.nome} (tenant: ${clinica.tenantId})`);
        console.log(`      Tipo: ${clinica.tipo} | Ativo: ${clinica.ativo ? 'Sim' : 'Não'}`);
        console.log(`      Usuários: ${clinica._count.usuarios} | Pacientes: ${clinica._count.Paciente}`);
        console.log(`      Profissionais: ${clinica._count.Profissional} | Agendamentos: ${clinica._count.Agendamento}`);
        console.log(`      Prontuários: ${clinica._count.Prontuario} | Exames: ${clinica._count.Exame}`);
        console.log(`      Anamneses: ${clinica._count.Anamnese} | Mensagens: ${clinica._count.Mensagem}`);
        console.log('');
      });
    }

    // Verificar usuários (sem campo nome, apenas email)
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        ativo: true,
        profissional: {
          select: { nome: true }
        },
        clinica: {
          select: { nome: true }
        }
      },
      take: 5
    });

    console.log('👥 USUÁRIOS (primeiros 5):');
    if (usuarios.length === 0) {
      console.log('   ❌ Nenhum usuário encontrado');
    } else {
      usuarios.forEach((usuario, index) => {
        console.log(`   ${index + 1}. ${usuario.email}`);
        console.log(`      Role: ${usuario.role} | Ativo: ${usuario.ativo ? 'Sim' : 'Não'}`);
        console.log(`      Profissional: ${usuario.profissional?.nome || 'N/A'}`);
        console.log(`      Clínica: ${usuario.clinica?.nome || 'N/A'}`);
        console.log('');
      });
    }

    // Verificar pacientes
    const pacientes = await prisma.paciente.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        clinica: {
          select: { nome: true }
        }
      },
      take: 5
    });

    console.log('🏥 PACIENTES (primeiros 5):');
    if (pacientes.length === 0) {
      console.log('   ❌ Nenhum paciente encontrado');
    } else {
      pacientes.forEach((paciente, index) => {
        console.log(`   ${index + 1}. ${paciente.nome} (${paciente.email})`);
        console.log(`      Telefone: ${paciente.telefone || 'N/A'}`);
        console.log(`      Clínica: ${paciente.clinica?.nome || 'N/A'}`);
        console.log('');
      });
    }

    // Verificar profissionais
    const profissionais = await prisma.profissional.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        especialidade: {
          select: { nome: true }
        },
        clinica: {
          select: { nome: true }
        }
      },
      take: 5
    });

    console.log('👨‍⚕️ PROFISSIONAIS (primeiros 5):');
    if (profissionais.length === 0) {
      console.log('   ❌ Nenhum profissional encontrado');
    } else {
      profissionais.forEach((profissional, index) => {
        console.log(`   ${index + 1}. ${profissional.nome} (${profissional.email})`);
        console.log(`      Especialidade: ${profissional.especialidade?.nome || 'N/A'}`);
        console.log(`      Clínica: ${profissional.clinica?.nome || 'N/A'}`);
        console.log('');
      });
    }

    // Contadores gerais
    console.log('📊 CONTADORES GERAIS:');
    const counts = await Promise.all([
      prisma.clinica.count(),
      prisma.usuario.count(),
      prisma.paciente.count(),
      prisma.profissional.count(),
      prisma.agendamento.count(),
      prisma.prontuario.count(),
      prisma.exame.count(),
      prisma.anamnese.count(),
      prisma.mensagem.count(),
    ]);

    console.log(`   Clínicas: ${counts[0]}`);
    console.log(`   Usuários: ${counts[1]}`);
    console.log(`   Pacientes: ${counts[2]}`);
    console.log(`   Profissionais: ${counts[3]}`);
    console.log(`   Agendamentos: ${counts[4]}`);
    console.log(`   Prontuários: ${counts[5]}`);
    console.log(`   Exames: ${counts[6]}`);
    console.log(`   Anamneses: ${counts[7]}`);
    console.log(`   Mensagens: ${counts[8]}`);

  } catch (error) {
    console.error('❌ Erro ao verificar banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarBanco(); 
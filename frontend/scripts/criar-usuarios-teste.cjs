const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Dados de usuários de teste
const usuariosTeste = [
  {
    tenantId: 'clinica-psicologia-001',
    email: 'admin@omnicare.com',
    senha: 'admin123',
    role: 'SUPER_ADMIN',
    ativo: true
  },
  {
    tenantId: 'clinica-psicologia-001',
    email: 'profissional@omnicare.com',
    senha: 'prof123',
    role: 'PROFISSIONAL',
    ativo: true
  },
  {
    tenantId: 'clinica-psicologia-001',
    email: 'recepcionista@omnicare.com',
    senha: 'recep123',
    role: 'RECEPCIONISTA',
    ativo: true
  }
];

async function criarUsuariosTeste() {
  console.log('🚀 Iniciando criação de usuários de teste...');

  try {
    // Verificar se as clínicas existem
    const clinicas = await prisma.clinica.findMany({
      where: {
        tenantId: {
          in: usuariosTeste.map(u => u.tenantId)
        }
      }
    });

    if (clinicas.length === 0) {
      console.log('⚠️  Nenhuma clínica encontrada. Execute primeiro o script gerar-dados-exemplo.js');
      return;
    }

    // Criar usuários
    for (const usuario of usuariosTeste) {
      try {
        // Hash da senha
        const senhaHash = await bcrypt.hash(usuario.senha, 10);
        
        await prisma.usuario.create({
          data: {
            tenantId: usuario.tenantId,
            email: usuario.email,
            senha: senhaHash,
            role: usuario.role,
            ativo: usuario.ativo
          }
        });
        console.log(`✅ Usuário criado: ${usuario.email} (${usuario.role})`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`ℹ️  Usuário já existe: ${usuario.email}`);
        } else {
          console.error(`❌ Erro ao criar usuário ${usuario.email}:`, error.message);
        }
      }
    }

    console.log('🎉 Usuários de teste criados com sucesso!');
    console.log('\n📋 Credenciais de teste:');
    console.log('Admin: admin@omnicare.com / admin123');
    console.log('Profissional: profissional@omnicare.com / prof123');
    console.log('Recepcionista: recepcionista@omnicare.com / recep123');

  } catch (error) {
    console.error('❌ Erro ao criar usuários de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  criarUsuariosTeste();
}

module.exports = { criarUsuariosTeste }; 
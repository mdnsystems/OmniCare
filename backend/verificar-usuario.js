const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function verificarUsuario() {
  try {
    console.log('🔍 Verificando usuário no banco de dados...');
    
    // Verificar se o usuário existe
    const usuario = await prisma.usuario.findFirst({
      where: {
        email: 'admin@clinica.com'
      },
      include: {
        clinica: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            ativo: true,
            tenantId: true
          }
        }
      }
    });

    if (usuario) {
      console.log('✅ Usuário encontrado:');
      console.log('  - ID:', usuario.id);
      console.log('  - Email:', usuario.email);
      console.log('  - Role:', usuario.role);
      console.log('  - Ativo:', usuario.ativo);
      console.log('  - Tenant ID:', usuario.tenantId);
      console.log('  - Clínica:', usuario.clinica?.nome);
      console.log('  - Clínica Ativa:', usuario.clinica?.ativo);
    } else {
      console.log('❌ Usuário não encontrado');
      
      // Listar todos os usuários
      const usuarios = await prisma.usuario.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          ativo: true,
          tenantId: true
        }
      });
      
      console.log('📋 Usuários existentes:');
      usuarios.forEach(u => {
        console.log(`  - ${u.email} (${u.role}) - Ativo: ${u.ativo} - Tenant: ${u.tenantId}`);
      });
    }

    // Verificar clínicas
    const clinicas = await prisma.clinica.findMany({
      select: {
        id: true,
        nome: true,
        tenantId: true,
        ativo: true
      }
    });

    console.log('🏥 Clínicas existentes:');
    clinicas.forEach(c => {
      console.log(`  - ${c.nome} (${c.tenantId}) - Ativo: ${c.ativo}`);
    });

  } catch (error) {
    console.error('❌ Erro ao verificar usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarUsuario(); 
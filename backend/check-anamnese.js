const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAnamnese() {
  try {
    console.log('🔍 Verificando dados de anamnese...');
    
    const anamneses = await prisma.anamnese.findMany({
      include: {
        paciente: true,
        profissional: true
      }
    });
    
    console.log(`📊 Total de anamneses encontradas: ${anamneses.length}`);
    
    if (anamneses.length > 0) {
      console.log('📋 Primeiras 3 anamneses:');
      anamneses.slice(0, 3).forEach((anamnese, index) => {
        console.log(`\n${index + 1}. ID: ${anamnese.id}`);
        console.log(`   Paciente: ${anamnese.paciente?.nome || 'N/A'}`);
        console.log(`   Profissional: ${anamnese.profissional?.nome || 'N/A'}`);
        console.log(`   Data: ${anamnese.data}`);
        console.log(`   Tenant ID: ${anamnese.tenantId}`);
      });
    } else {
      console.log('❌ Nenhuma anamnese encontrada no banco de dados');
    }
    
    // Verificar se há pacientes
    const pacientes = await prisma.paciente.findMany();
    console.log(`\n👥 Total de pacientes: ${pacientes.length}`);
    
    // Verificar se há profissionais
    const profissionais = await prisma.profissional.findMany();
    console.log(`👨‍⚕️ Total de profissionais: ${profissionais.length}`);
    
  } catch (error) {
    console.error('❌ Erro ao verificar anamneses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAnamnese(); 
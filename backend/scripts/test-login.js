const bcrypt = require('bcryptjs');

// Dados de teste
const email = 'recepcionista1@clinica.com';
const senha = '@DLe200320';
const tenantId = 'tenant-001';
const hashArmazenada = '$2a$12$6F0fZlC5ZfB.gMLAanOXC.kVX.CGSuIwMcqoQbH1PztSDVsNSytQa';

async function testarLogin() {
  console.log('🧪 Testando login...');
  console.log('📧 Email:', email);
  console.log('🔑 Senha:', senha);
  console.log('🏥 Tenant ID:', tenantId);
  console.log('🔐 Hash armazenada:', hashArmazenada);
  
  try {
    // Testar se a senha corresponde à hash
    const senhaValida = await bcrypt.compare(senha, hashArmazenada);
    console.log('\n✅ Resultado da verificação:');
    console.log('🔍 Senha válida:', senhaValida ? '✅ SIM' : '❌ NÃO');
    
    if (senhaValida) {
      console.log('🎉 Login deve funcionar!');
    } else {
      console.log('❌ Login vai falhar - senha não corresponde à hash');
      
      // Gerar nova hash para a senha
      console.log('\n🔄 Gerando nova hash para a senha...');
      const novaHash = await bcrypt.hash(senha, 12);
      console.log('🔐 Nova hash:', novaHash);
      
      // Verificar se a nova hash funciona
      const novaHashValida = await bcrypt.compare(senha, novaHash);
      console.log('🔍 Nova hash válida:', novaHashValida ? '✅ SIM' : '❌ NÃO');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testarLogin(); 
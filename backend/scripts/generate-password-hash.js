const bcrypt = require('bcryptjs');

const senha = '@DLe200320';
const rounds = 12;

async function gerarHash() {
  try {
    console.log('🔐 Gerando hash para a senha:', senha);
    console.log('📊 Rounds de criptografia:', rounds);
    
    const hash = await bcrypt.hash(senha, rounds);
    
    console.log('\n✅ Hash gerada com sucesso!');
    console.log('📋 Hash:', hash);
    
    // Verificar se a hash está correta
    const senhaValida = await bcrypt.compare(senha, hash);
    console.log('🔍 Verificação da hash:', senhaValida ? '✅ VÁLIDA' : '❌ INVÁLIDA');
    
    // Verificar com a hash antiga do seed
    const hashAntiga = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uKGi';
    const senhaValidaAntiga = await bcrypt.compare(senha, hashAntiga);
    console.log('🔍 Verificação da hash antiga:', senhaValidaAntiga ? '✅ VÁLIDA' : '❌ INVÁLIDA');
    
    // Verificar com a nova hash fornecida
    const hashNova = '$2a$12$6F0fZlC5ZfB.gMLAanOXC.kVX.CGSuIwMcqoQbH1PztSDVsNSytQa';
    const senhaValidaNova = await bcrypt.compare(senha, hashNova);
    console.log('🔍 Verificação da hash nova:', senhaValidaNova ? '✅ VÁLIDA' : '❌ INVÁLIDA');
    
    console.log('\n📝 SQL para atualizar as senhas:');
    console.log(`UPDATE "usuarios" SET "senha" = '${hash}', "updatedAt" = NOW() WHERE "tenant_id" = 'tenant-001';`);
    
  } catch (error) {
    console.error('❌ Erro ao gerar hash:', error);
  }
}

gerarHash(); 
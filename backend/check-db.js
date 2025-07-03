const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'clinica.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Verificando dados no banco...');

// Verificar profissionais
db.all("SELECT * FROM Profissional", [], (err, rows) => {
  if (err) {
    console.error('❌ Erro ao buscar profissionais:', err);
  } else {
    console.log(`📊 Profissionais encontrados: ${rows.length}`);
    if (rows.length > 0) {
      console.log('📋 Dados dos profissionais:');
      rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.nome} (${row.email}) - Tenant: ${row.tenantId}`);
      });
    }
  }
  
  // Verificar clínicas
  db.all("SELECT * FROM Clinica", [], (err, rows) => {
    if (err) {
      console.error('❌ Erro ao buscar clínicas:', err);
    } else {
      console.log(`\n🏥 Clínicas encontradas: ${rows.length}`);
      if (rows.length > 0) {
        console.log('📋 Dados das clínicas:');
        rows.forEach((row, index) => {
          console.log(`${index + 1}. ${row.nome} - Tenant: ${row.tenantId} - Ativo: ${row.ativo}`);
        });
      }
    }
    
    db.close();
  });
}); 
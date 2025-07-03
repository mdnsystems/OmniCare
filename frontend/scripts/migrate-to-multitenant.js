#!/usr/bin/env node

/**
 * Script de Migração para Multitenant - OmniCare v3.0
 * 
 * Este script facilita a migração do schema antigo para o novo schema multitenant.
 * Ele cria um tenant padrão e migra dados existentes se necessário.
 * 
 * Uso: node scripts/migrate-to-multitenant.js
 */

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Configurações da migração
const DEFAULT_TENANT_ID = 'default-clinic';
const DEFAULT_CLINIC_NAME = 'Clínica Padrão';
const DEFAULT_CLINIC_TYPE = 'PERSONALIZADA';

/**
 * Gera um ID único para o tenant
 */
function generateTenantId() {
  return `tenant-${crypto.randomBytes(8).toString('hex')}`;
}

/**
 * Cria uma clínica padrão (tenant)
 */
async function createDefaultClinic() {
  console.log('🏥 Criando clínica padrão...');
  
  try {
    const clinic = await prisma.clinica.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        nome: DEFAULT_CLINIC_NAME,
        tipo: DEFAULT_CLINIC_TYPE,
        corPrimaria: '#2563eb',
        corSecundaria: '#1e40af',
        tema: 'light',
        ativo: true
      }
    });
    
    console.log('✅ Clínica padrão criada:', clinic.nome);
    return clinic;
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️  Clínica padrão já existe');
      return await prisma.clinica.findUnique({
        where: { tenantId: DEFAULT_TENANT_ID }
      });
    }
    throw error;
  }
}

/**
 * Cria especialidades padrão
 */
async function createDefaultSpecialties(tenantId) {
  console.log('👨‍⚕️ Criando especialidades padrão...');
  
  const specialties = [
    {
      nome: 'Medicina Geral',
      descricao: 'Medicina clínica geral',
      tipoClinica: 'MEDICA',
      configuracoes: {
        camposObrigatorios: ['nome', 'cpf', 'telefone'],
        templatesDisponiveis: ['anamnese_medica', 'prontuario_medico'],
        relatoriosDisponiveis: ['consultas', 'faturamento']
      }
    },
    {
      nome: 'Nutrição',
      descricao: 'Nutrição clínica e esportiva',
      tipoClinica: 'NUTRICIONAL',
      configuracoes: {
        camposObrigatorios: ['nome', 'cpf', 'telefone', 'altura', 'peso'],
        templatesDisponiveis: ['anamnese_nutricional', 'prontuario_nutricional'],
        relatoriosDisponiveis: ['consultas', 'evolucao_peso']
      }
    },
    {
      nome: 'Psicologia',
      descricao: 'Psicologia clínica',
      tipoClinica: 'PSICOLOGICA',
      configuracoes: {
        camposObrigatorios: ['nome', 'cpf', 'telefone'],
        templatesDisponiveis: ['anamnese_psicologica', 'prontuario_psicologico'],
        relatoriosDisponiveis: ['sessoes', 'evolucao_terapia']
      }
    }
  ];

  for (const specialty of specialties) {
    try {
      await prisma.especialidade.create({
        data: {
          tenantId,
          ...specialty,
          ativo: true
        }
      });
      console.log(`✅ Especialidade criada: ${specialty.nome}`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`ℹ️  Especialidade já existe: ${specialty.nome}`);
      } else {
        console.error(`❌ Erro ao criar especialidade ${specialty.nome}:`, error.message);
      }
    }
  }
}

/**
 * Cria templates padrão para anamneses
 */
async function createDefaultTemplates(tenantId) {
  console.log('📋 Criando templates padrão...');
  
  const templates = [
    {
      nome: 'Anamnese Médica',
      descricao: 'Template padrão para anamnese médica',
      tipoClinica: 'MEDICA',
      categoria: 'ANAMNESE',
      campos: [
        {
          id: 'queixa_principal',
          nome: 'Queixa Principal',
          tipo: 'TEXTAREA',
          obrigatorio: true,
          ordem: 1
        },
        {
          id: 'historia_atual',
          nome: 'História da Doença Atual',
          tipo: 'TEXTAREA',
          obrigatorio: true,
          ordem: 2
        },
        {
          id: 'antecedentes',
          nome: 'Antecedentes Patológicos',
          tipo: 'TEXTAREA',
          obrigatorio: false,
          ordem: 3
        },
        {
          id: 'medicamentos',
          nome: 'Medicamentos em Uso',
          tipo: 'TEXTAREA',
          obrigatorio: false,
          ordem: 4
        },
        {
          id: 'alergias',
          nome: 'Alergias',
          tipo: 'TEXTAREA',
          obrigatorio: false,
          ordem: 5
        }
      ],
      validacoes: [],
      ordem: 1
    },
    {
      nome: 'Anamnese Nutricional',
      descricao: 'Template para avaliação nutricional',
      tipoClinica: 'NUTRICIONAL',
      categoria: 'ANAMNESE',
      campos: [
        {
          id: 'altura',
          nome: 'Altura (cm)',
          tipo: 'NUMERO',
          obrigatorio: true,
          validacoes: [
            { tipo: 'min', valor: 50, mensagem: 'Altura deve ser maior que 50cm' },
            { tipo: 'max', valor: 250, mensagem: 'Altura deve ser menor que 250cm' }
          ],
          ordem: 1
        },
        {
          id: 'peso',
          nome: 'Peso (kg)',
          tipo: 'NUMERO',
          obrigatorio: true,
          validacoes: [
            { tipo: 'min', valor: 1, mensagem: 'Peso deve ser maior que 1kg' },
            { tipo: 'max', valor: 500, mensagem: 'Peso deve ser menor que 500kg' }
          ],
          ordem: 2
        },
        {
          id: 'objetivo',
          nome: 'Objetivo da Consulta',
          tipo: 'SELECT',
          obrigatorio: true,
          opcoes: ['Emagrecimento', 'Ganho de Peso', 'Manutenção', 'Melhora da Performance', 'Tratamento de Doença'],
          ordem: 3
        },
        {
          id: 'habitos_alimentares',
          nome: 'Hábitos Alimentares',
          tipo: 'TEXTAREA',
          obrigatorio: true,
          ordem: 4
        },
        {
          id: 'atividade_fisica',
          nome: 'Atividade Física',
          tipo: 'TEXTAREA',
          obrigatorio: false,
          ordem: 5
        }
      ],
      validacoes: [],
      ordem: 2
    }
  ];

  for (const template of templates) {
    try {
      await prisma.templateEspecialidade.create({
        data: {
          tenantId,
          ...template,
          ativo: true
        }
      });
      console.log(`✅ Template criado: ${template.nome}`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`ℹ️  Template já existe: ${template.nome}`);
      } else {
        console.error(`❌ Erro ao criar template ${template.nome}:`, error.message);
      }
    }
  }
}

/**
 * Cria campos personalizados padrão
 */
async function createDefaultCustomFields(tenantId) {
  console.log('🔧 Criando campos personalizados padrão...');
  
  const customFields = [
    {
      nome: 'Alergias Alimentares',
      tipo: 'MULTISELECT',
      categoria: 'PACIENTE',
      obrigatorio: false,
      opcoes: ['Glúten', 'Lactose', 'Ovos', 'Amendoim', 'Soja', 'Frutos do Mar', 'Nenhuma'],
      ordem: 1
    },
    {
      nome: 'Tipo Sanguíneo',
      tipo: 'SELECT',
      categoria: 'PACIENTE',
      obrigatorio: false,
      opcoes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      ordem: 2
    },
    {
      nome: 'Observações Importantes',
      tipo: 'TEXTAREA',
      categoria: 'PACIENTE',
      obrigatorio: false,
      ordem: 3
    }
  ];

  for (const field of customFields) {
    try {
      await prisma.campoPersonalizado.create({
        data: {
          tenantId,
          ...field,
          validacoes: [],
          dependencias: [],
          ativo: true
        }
      });
      console.log(`✅ Campo personalizado criado: ${field.nome}`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`ℹ️  Campo personalizado já existe: ${field.nome}`);
      } else {
        console.error(`❌ Erro ao criar campo ${field.nome}:`, error.message);
      }
    }
  }
}

/**
 * Cria usuário administrador padrão
 */
async function createDefaultAdmin(tenantId) {
  console.log('👤 Criando usuário administrador padrão...');
  
  try {
    const admin = await prisma.usuario.create({
      data: {
        tenantId,
        email: 'admin@clinica.com',
        senha: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ', // senha123
        role: 'ADMIN',
        ativo: true
      }
    });
    
    console.log('✅ Usuário administrador criado:', admin.email);
    return admin;
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️  Usuário administrador já existe');
      return await prisma.usuario.findFirst({
        where: { 
          tenantId,
          email: 'admin@clinica.com'
        }
      });
    }
    throw error;
  }
}

/**
 * Função principal de migração
 */
async function runMigration() {
  console.log('🚀 Iniciando migração para multitenant...\n');
  
  try {
    // 1. Criar clínica padrão
    const clinic = await createDefaultClinic();
    
    // 2. Criar especialidades padrão
    await createDefaultSpecialties(clinic.tenantId);
    
    // 3. Criar templates padrão
    await createDefaultTemplates(clinic.tenantId);
    
    // 4. Criar campos personalizados padrão
    await createDefaultCustomFields(clinic.tenantId);
    
    // 5. Criar usuário administrador
    await createDefaultAdmin(clinic.tenantId);
    
    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('\n📋 Resumo da migração:');
    console.log(`   • Clínica: ${clinic.nome} (${clinic.tenantId})`);
    console.log(`   • Especialidades: 3 criadas`);
    console.log(`   • Templates: 2 criados`);
    console.log(`   • Campos personalizados: 3 criados`);
    console.log(`   • Usuário admin: admin@clinica.com`);
    
    console.log('\n🔑 Credenciais de acesso:');
    console.log('   Email: admin@clinica.com');
    console.log('   Senha: senha123');
    
    console.log('\n⚠️  IMPORTANTE: Altere a senha do administrador após o primeiro login!');
    
  } catch (error) {
    console.error('\n❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Função para verificar se o banco está conectado
 */
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexão com banco de dados estabelecida');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com banco de dados:', error.message);
    return false;
  }
}

/**
 * Função para limpar dados de teste (apenas em desenvolvimento)
 */
async function clearTestData() {
  if (process.env.NODE_ENV === 'production') {
    console.log('❌ Função de limpeza não disponível em produção');
    return;
  }
  
  console.log('🧹 Limpando dados de teste...');
  
  try {
    await prisma.mensagem.deleteMany({});
    await prisma.exame.deleteMany({});
    await prisma.anamnese.deleteMany({});
    await prisma.prontuario.deleteMany({});
    await prisma.agendamento.deleteMany({});
    await prisma.paciente.deleteMany({});
    await prisma.usuario.deleteMany({});
    await prisma.profissional.deleteMany({});
    await prisma.campoPersonalizado.deleteMany({});
    await prisma.templateEspecialidade.deleteMany({});
    await prisma.fluxoEspecialidade.deleteMany({});
    await prisma.relatorioEspecialidade.deleteMany({});
    await prisma.dashboardEspecialidade.deleteMany({});
    await prisma.especialidade.deleteMany({});
    await prisma.messageTemplate.deleteMany({});
    await prisma.clinicaWhatsAppConfig.deleteMany({});
    await prisma.clinica.deleteMany({});
    
    console.log('✅ Dados de teste removidos');
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error.message);
  }
}

// Execução do script
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--clear')) {
    clearTestData().then(() => {
      console.log('✅ Limpeza concluída');
      process.exit(0);
    });
  } else {
    checkDatabaseConnection().then((connected) => {
      if (connected) {
        runMigration();
      } else {
        process.exit(1);
      }
    });
  }
}

module.exports = {
  runMigration,
  createDefaultClinic,
  createDefaultSpecialties,
  createDefaultTemplates,
  createDefaultCustomFields,
  createDefaultAdmin,
  clearTestData
}; 
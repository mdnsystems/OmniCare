const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function seedPacientes() {
  try {
    // Primeiro, vamos verificar se já existe uma clínica
    let clinica = await prisma.clinica.findFirst();
    
    if (!clinica) {
      // Criar uma clínica de teste
      clinica = await prisma.clinica.create({
        data: {
          tenantId: 'clinica-teste',
          nome: 'Clínica Teste',
          tipo: 'MEDICA',
          corPrimaria: '#2563eb',
          corSecundaria: '#1e40af',
          tema: 'light',
          ativo: true,
        }
      });
      console.log('Clínica criada:', clinica.nome);
    }

    // Criar uma especialidade
    let especialidade = await prisma.especialidade.findFirst({
      where: { tenantId: clinica.tenantId }
    });

    if (!especialidade) {
      especialidade = await prisma.especialidade.create({
        data: {
          tenantId: clinica.tenantId,
          nome: 'Clínico Geral',
          descricao: 'Especialidade em clínica geral',
          tipoClinica: 'MEDICA',
          configuracoes: {},
          ativo: true,
        }
      });
      console.log('Especialidade criada:', especialidade.nome);
    }

    // Criar um profissional
    let profissional = await prisma.profissional.findFirst({
      where: { tenantId: clinica.tenantId }
    });

    if (!profissional) {
      profissional = await prisma.profissional.create({
        data: {
          tenantId: clinica.tenantId,
          nome: 'Dr. João Silva',
          especialidadeId: especialidade.id,
          registro: 'CRM12345',
          crm: '12345',
          email: 'joao.silva@clinica.com',
          telefone: '(11) 99999-9999',
          sexo: 'M',
          dataNascimento: new Date('1980-01-01'),
          dataContratacao: new Date('2020-01-01'),
          status: 'ATIVO',
          rua: 'Rua das Flores',
          numero: '123',
          complemento: 'Sala 45',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567',
          horarioInicio: '08:00',
          horarioFim: '18:00',
          intervalo: '12:00-13:00',
          diasTrabalho: ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'],
        }
      });
      console.log('Profissional criado:', profissional.nome);
    }

    // Verificar se já existem pacientes
    const pacientesExistentes = await prisma.paciente.count({
      where: { tenantId: clinica.tenantId }
    });

    if (pacientesExistentes === 0) {
      // Criar pacientes de teste
      const pacientes = [
        {
          tenantId: clinica.tenantId,
          nome: 'Maria Santos',
          dataNascimento: new Date('1990-05-15'),
          cpf: '123.456.789-00',
          telefone: '(11) 99999-9999',
          email: 'maria@email.com',
          endereco: 'Rua das Flores',
          numero: '123',
          complemento: 'Apto 45',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          pais: 'Brasil',
          cep: '01234-567',
          convenioNome: 'Unimed',
          convenioNumero: '123456',
          convenioPlano: 'Premium',
          convenioValidade: new Date('2024-12-31'),
          profissionalId: profissional.id,
          camposPersonalizados: {},
        },
        {
          tenantId: clinica.tenantId,
          nome: 'João Oliveira',
          dataNascimento: new Date('1985-08-20'),
          cpf: '987.654.321-00',
          telefone: '(11) 88888-8888',
          email: 'joao@email.com',
          endereco: 'Av. Paulista',
          numero: '456',
          complemento: '',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP',
          pais: 'Brasil',
          cep: '01310-000',
          convenioNome: 'Amil',
          convenioNumero: '654321',
          convenioPlano: 'Standard',
          convenioValidade: new Date('2024-06-30'),
          profissionalId: profissional.id,
          camposPersonalizados: {},
        },
        {
          tenantId: clinica.tenantId,
          nome: 'Ana Costa',
          dataNascimento: new Date('1995-03-10'),
          cpf: '111.222.333-44',
          telefone: '(11) 77777-7777',
          email: 'ana@email.com',
          endereco: 'Rua Augusta',
          numero: '789',
          complemento: 'Loja 12',
          bairro: 'Consolação',
          cidade: 'São Paulo',
          estado: 'SP',
          pais: 'Brasil',
          cep: '01212-000',
          convenioNome: 'SulAmérica',
          convenioNumero: '789123',
          convenioPlano: 'Executivo',
          convenioValidade: new Date('2024-09-15'),
          profissionalId: profissional.id,
          camposPersonalizados: {},
        },
      ];

      for (const pacienteData of pacientes) {
        await prisma.paciente.create({
          data: pacienteData
        });
      }

      console.log(`${pacientes.length} pacientes criados com sucesso!`);
    } else {
      console.log(`Já existem ${pacientesExistentes} pacientes no banco.`);
    }

  } catch (error) {
    console.error('Erro ao criar dados de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedPacientes(); 
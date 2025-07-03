console.log('### Iniciando o script seed.ts ###');

import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';

// Declaração para o process global
declare const process: {
  exit: (code: number) => never;
};

const prisma = new PrismaClient();

// Função para calcular datas baseadas na data atual
function getDateFromToday(daysOffset: number): Date {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysOffset);
  return targetDate;
}

// Função para calcular datas de nascimento (anos atrás)
function getBirthDate(yearsAgo: number): Date {
  const today = new Date();
  const birthDate = new Date(today);
  birthDate.setFullYear(today.getFullYear() - yearsAgo);
  return birthDate;
}

// Dados para popular o banco
const especialidades = [
  { nome: 'Clínico Geral', descricao: 'Atendimento geral e preventivo' },
  { nome: 'Cardiologia', descricao: 'Especialidade do coração e sistema cardiovascular' },
  { nome: 'Dermatologia', descricao: 'Especialidade da pele e anexos' },
  { nome: 'Ginecologia', descricao: 'Saúde da mulher' },
  { nome: 'Ortopedia', descricao: 'Especialidade do sistema musculoesquelético' },
  { nome: 'Pediatria', descricao: 'Atendimento infantil' },
  { nome: 'Psicologia', descricao: 'Saúde mental e comportamento' },
  { nome: 'Nutrição', descricao: 'Nutrição e alimentação saudável' },
];

const profissionais = [
  {
    nome: 'Dr. João Silva',
    registro: 'CRM12345',
    crm: 'CRM12345',
    email: 'joao.silva@clinica.com',
    telefone: '11999999999',
    sexo: 'M',
    dataNascimento: getBirthDate(44),
    dataContratacao: getDateFromToday(-1460), // 4 anos atrás
    especialidade: 'Clínico Geral',
  },
  {
    nome: 'Dra. Maria Santos',
    registro: 'CRM67890',
    crm: 'CRM67890',
    email: 'maria.santos@clinica.com',
    telefone: '11988888888',
    sexo: 'F',
    dataNascimento: getBirthDate(39),
    dataContratacao: getDateFromToday(-1460), // 4 anos atrás
    especialidade: 'Cardiologia',
  },
  {
    nome: 'Dr. Carlos Oliveira',
    registro: 'CRM11111',
    crm: 'CRM11111',
    email: 'carlos.oliveira@clinica.com',
    telefone: '11977777777',
    sexo: 'M',
    dataNascimento: getBirthDate(49),
    dataContratacao: getDateFromToday(-1825), // 5 anos atrás
    especialidade: 'Dermatologia',
  },
  {
    nome: 'Dra. Ana Costa',
    registro: 'CRM22222',
    crm: 'CRM22222',
    email: 'ana.costa@clinica.com',
    telefone: '11966666666',
    sexo: 'F',
    dataNascimento: getBirthDate(42),
    dataContratacao: getDateFromToday(-1460), // 4 anos atrás
    especialidade: 'Ginecologia',
  },
  {
    nome: 'Dr. Pedro Lima',
    registro: 'CRM33333',
    crm: 'CRM33333',
    email: 'pedro.lima@clinica.com',
    telefone: '11955555555',
    sexo: 'M',
    dataNascimento: getBirthDate(46),
    dataContratacao: getDateFromToday(-1825), // 5 anos atrás
    especialidade: 'Ortopedia',
  },
  {
    nome: 'Dra. Fernanda Rocha',
    registro: 'CRM44444',
    crm: 'CRM44444',
    email: 'fernanda.rocha@clinica.com',
    telefone: '11944444444',
    sexo: 'F',
    dataNascimento: getBirthDate(37),
    dataContratacao: getDateFromToday(-1095), // 3 anos atrás
    especialidade: 'Pediatria',
  },
  {
    nome: 'Psic. Roberto Almeida',
    registro: 'CRP12345',
    crm: null,
    email: 'roberto.almeida@clinica.com',
    telefone: '11933333333',
    sexo: 'M',
    dataNascimento: getBirthDate(41),
    dataContratacao: getDateFromToday(-1460), // 4 anos atrás
    especialidade: 'Psicologia',
  },
  {
    nome: 'Nutr. Juliana Ferreira',
    registro: 'CRN12345',
    crm: null,
    email: 'juliana.ferreira@clinica.com',
    telefone: '11922222222',
    sexo: 'F',
    dataNascimento: getBirthDate(35),
    dataContratacao: getDateFromToday(-1095), // 3 anos atrás
    especialidade: 'Nutrição',
  },
];

const recepcionistas = [
  { email: 'recepcionista1@clinica.com', nome: 'Ana Paula Silva' },
  { email: 'recepcionista2@clinica.com', nome: 'Carlos Eduardo Santos' },
  { email: 'recepcionista3@clinica.com', nome: 'Mariana Costa' },
  { email: 'recepcionista4@clinica.com', nome: 'Ricardo Oliveira' },
];

const pacientes = [
  {
    nome: 'Maria Souza',
    dataNascimento: getBirthDate(34),
    cpf: '123.456.789-00',
    telefone: '11988888888',
    email: 'maria.souza@paciente.com',
    endereco: 'Av. Principal, 200',
    numero: '200',
    bairro: 'Bairro Novo',
    cep: '02000-000',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
  },
  {
    nome: 'José Pereira',
    dataNascimento: getBirthDate(39),
    cpf: '234.567.890-11',
    telefone: '11977777777',
    email: 'jose.pereira@paciente.com',
    endereco: 'Rua das Flores, 150',
    numero: '150',
    bairro: 'Centro',
    cep: '01000-000',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
  },
  {
    nome: 'Ana Beatriz Lima',
    dataNascimento: getBirthDate(29),
    cpf: '345.678.901-22',
    telefone: '11966666666',
    email: 'ana.lima@paciente.com',
    endereco: 'Rua do Comércio, 300',
    numero: '300',
    bairro: 'Vila Madalena',
    cep: '03000-000',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
  },
  {
    nome: 'Roberto Santos',
    dataNascimento: getBirthDate(46),
    cpf: '456.789.012-33',
    telefone: '11955555555',
    email: 'roberto.santos@paciente.com',
    endereco: 'Av. Paulista, 1000',
    numero: '1000',
    bairro: 'Bela Vista',
    cep: '04000-000',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
  },
  {
    nome: 'Fernanda Costa',
    dataNascimento: getBirthDate(32),
    cpf: '567.890.123-44',
    telefone: '11944444444',
    email: 'fernanda.costa@paciente.com',
    endereco: 'Rua Augusta, 500',
    numero: '500',
    bairro: 'Consolação',
    cep: '05000-000',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
  },
  {
    nome: 'Lucas Oliveira',
    dataNascimento: getBirthDate(37),
    cpf: '678.901.234-55',
    telefone: '11933333333',
    email: 'lucas.oliveira@paciente.com',
    endereco: 'Rua Oscar Freire, 200',
    numero: '200',
    bairro: 'Jardins',
    cep: '06000-000',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
  },
  {
    nome: 'Patrícia Silva',
    dataNascimento: getBirthDate(26),
    cpf: '789.012.345-66',
    telefone: '11922222222',
    email: 'patricia.silva@paciente.com',
    endereco: 'Rua Teodoro Sampaio, 800',
    numero: '800',
    bairro: 'Pinheiros',
    cep: '07000-000',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
  },
  {
    nome: 'Marcelo Rocha',
    dataNascimento: getBirthDate(44),
    cpf: '890.123.456-77',
    telefone: '11911111111',
    email: 'marcelo.rocha@paciente.com',
    endereco: 'Av. Brigadeiro Faria Lima, 1500',
    numero: '1500',
    bairro: 'Itaim Bibi',
    cep: '08000-000',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
  },
  {
    nome: 'Camila Ferreira',
    dataNascimento: getBirthDate(31),
    cpf: '901.234.567-88',
    telefone: '11900000000',
    email: 'camila.ferreira@paciente.com',
    endereco: 'Rua Haddock Lobo, 400',
    numero: '400',
    bairro: 'Cerqueira César',
    cep: '09000-000',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
  },
  {
    nome: 'Diego Almeida',
    dataNascimento: getBirthDate(35),
    cpf: '012.345.678-99',
    telefone: '11899999999',
    email: 'diego.almeida@paciente.com',
    endereco: 'Rua Pamplona, 600',
    numero: '600',
    bairro: 'Jardim Paulista',
    cep: '10000-000',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
  },
];

async function main() {
  console.log('Iniciando o processo de seed...');

  // Limpeza dos dados existentes (em ordem reversa das dependências)
  console.log('Limpando dados existentes...');
  
  await prisma.arquivoMensagem.deleteMany();
  await prisma.arquivoChat.deleteMany();
  await prisma.leituraMensagem.deleteMany();
  await prisma.mensagem.deleteMany();
  await prisma.chatParticipante.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.notificacao.deleteMany();
  await prisma.messageTemplate.deleteMany();
  await prisma.clinicaWhatsAppConfig.deleteMany();
  await prisma.pagamentoClinica.deleteMany();
  await prisma.lembreteClinica.deleteMany();
  await prisma.historicoBloqueio.deleteMany();
  await prisma.faturaClinica.deleteMany();
  await prisma.pagamento.deleteMany();
  await prisma.faturamento.deleteMany();
  await prisma.exame.deleteMany();
  await prisma.anamnese.deleteMany();
  await prisma.prontuario.deleteMany();
  await prisma.agendamento.deleteMany();
  await prisma.paciente.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.profissional.deleteMany();
  await prisma.especialidade.deleteMany();
  await prisma.templateEspecialidade.deleteMany();
  await prisma.campoPersonalizado.deleteMany();
  await prisma.fluxoEspecialidade.deleteMany();
  await prisma.relatorioEspecialidade.deleteMany();
  await prisma.dashboardEspecialidade.deleteMany();
  await prisma.clinica.deleteMany();
  
  console.log('Dados limpos com sucesso!');

  // Criação de uma clínica (tenant)
  const clinica = await prisma.clinica.create({
    data: {
      tenantId: 'tenant-001',
      nome: 'Clínica Exemplo',
      tipo: 'MEDICA',
      logo: 'https://via.placeholder.com/150',
      corPrimaria: '#2563eb',
      corSecundaria: '#1e40af',
      tema: 'light',
      ativo: true,
    },
  });
  console.log(`Clínica criada: ${clinica.nome} (Tenant ID: ${clinica.tenantId})`);

  // Criação de usuários ADMIN e SUPER_ADMIN
  const usuarioAdmin = await prisma.usuario.create({
    data: {
      tenantId: clinica.tenantId,
      email: 'admin@clinica.com',
      senha: await bcrypt.hash('@DLe200320', 12),
      role: 'ADMIN',
      ativo: true,
    },
  });
  console.log(`Usuário Admin criado: ${usuarioAdmin.email}`);

  const usuarioSuperAdmin = await prisma.usuario.create({
    data: {
      tenantId: clinica.tenantId,
      email: 'superadmin@clinica.com',
      senha: await bcrypt.hash('@DLe200320', 12),
      role: 'SUPER_ADMIN',
      ativo: true,
    },
  });
  console.log(`Usuário Super Admin criado: ${usuarioSuperAdmin.email}`);

  // Criação de recepcionistas
  const usuariosRecepcionistas: any[] = [];
  for (const recepcionista of recepcionistas) {
    const usuarioRecepcionista = await prisma.usuario.create({
      data: {
        tenantId: clinica.tenantId,
        email: recepcionista.email,
        senha: await bcrypt.hash('@DLe200320', 12),
        role: 'RECEPCIONISTA',
        ativo: true,
      },
    });
    usuariosRecepcionistas.push(usuarioRecepcionista);
    console.log(`Usuário Recepcionista criado: ${usuarioRecepcionista.email}`);
  }

  // Criação de especialidades
  const especialidadesCriadas: any[] = [];
  for (const especialidade of especialidades) {
    const especialidadeCriada = await prisma.especialidade.create({
      data: {
        tenantId: clinica.tenantId,
        nome: especialidade.nome,
        descricao: especialidade.descricao,
        tipoClinica: 'MEDICA',
        configuracoes: {},
        ativo: true,
      },
    });
    especialidadesCriadas.push(especialidadeCriada);
    console.log(`Especialidade criada: ${especialidadeCriada.nome}`);
  }

  // Criação de profissionais
  const profissionaisCriados: any[] = [];
  const usuariosProfissionais: any[] = [];
  
  for (const profissional of profissionais) {
    const especialidade = especialidadesCriadas.find(esp => esp.nome === profissional.especialidade);
    if (!especialidade) {
      console.log(`Especialidade não encontrada para ${profissional.nome}`);
      continue;
    }

    const profissionalCriado = await prisma.profissional.create({
      data: {
        tenantId: clinica.tenantId,
        nome: profissional.nome,
        especialidadeId: especialidade.id,
        registro: profissional.registro,
        crm: profissional.crm,
        email: profissional.email,
        telefone: profissional.telefone,
        sexo: profissional.sexo,
        dataNascimento: profissional.dataNascimento,
        dataContratacao: profissional.dataContratacao,
        status: 'ATIVO',
        rua: 'Rua Exemplo',
        numero: '100',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000',
        horarioInicio: '08:00',
        horarioFim: '18:00',
        intervalo: '12:00-13:00',
        diasTrabalho: ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'],
      },
    });
    profissionaisCriados.push(profissionalCriado);
    console.log(`Profissional criado: ${profissionalCriado.nome}`);

    // Criar usuário para o profissional
    const usuarioProfissional = await prisma.usuario.create({
      data: {
        tenantId: clinica.tenantId,
        email: profissional.email,
        senha: await bcrypt.hash('@DLe200320', 12),
        role: 'PROFISSIONAL',
        profissionalId: profissionalCriado.id,
        ativo: true,
      },
    });
    usuariosProfissionais.push(usuarioProfissional);
    console.log(`Usuário Profissional criado: ${usuarioProfissional.email}`);
  }

  // Criação de pacientes
  const pacientesCriados: any[] = [];
  for (let i = 0; i < pacientes.length; i++) {
    const paciente = pacientes[i];
    const profissional = profissionaisCriados[i % profissionaisCriados.length]; // Distribuir entre profissionais
    
    const pacienteCriado = await prisma.paciente.create({
      data: {
        tenantId: clinica.tenantId,
        nome: paciente.nome,
        dataNascimento: paciente.dataNascimento,
        cpf: paciente.cpf,
        telefone: paciente.telefone,
        email: paciente.email,
        endereco: paciente.endereco,
        numero: paciente.numero,
        bairro: paciente.bairro,
        cep: paciente.cep,
        cidade: paciente.cidade,
        estado: paciente.estado,
        pais: paciente.pais,
        profissionalId: profissional.id,
      },
    });
    pacientesCriados.push(pacienteCriado);
    console.log(`Paciente criado: ${pacienteCriado.nome}`);
  }

  // Criação de agendamentos (múltiplos por paciente)
  const agendamentosCriados: any[] = [];
  const datasAgendamento = [
    getDateFromToday(-30), getDateFromToday(-25), getDateFromToday(-20),
    getDateFromToday(-15), getDateFromToday(-10), getDateFromToday(-5),
    getDateFromToday(5), getDateFromToday(10), getDateFromToday(15),
    getDateFromToday(20), getDateFromToday(25), getDateFromToday(30),
  ];

  for (let i = 0; i < pacientesCriados.length; i++) {
    const paciente = pacientesCriados[i];
    const profissional = profissionaisCriados[i % profissionaisCriados.length];
    
    // Criar 2-4 agendamentos por paciente
    const numAgendamentos = 2 + (i % 3);
    
    for (let j = 0; j < numAgendamentos; j++) {
      const dataIndex = (i * numAgendamentos + j) % datasAgendamento.length;
      const data = datasAgendamento[dataIndex];
      const horaInicio = 8 + (j * 2); // 8h, 10h, 12h, 14h
      const horaFim = horaInicio + 1;
      
      const agendamento = await prisma.agendamento.create({
        data: {
          tenantId: clinica.tenantId,
          pacienteId: paciente.id,
          profissionalId: profissional.id,
          data: data,
          horaInicio: `${horaInicio.toString().padStart(2, '0')}:00`,
          horaFim: `${horaFim.toString().padStart(2, '0')}:00`,
          tipo: j === 0 ? 'CONSULTA' : 'RETORNO',
          status: j === 0 ? 'CONFIRMADO' : 'AGENDADO',
          observacoes: j === 0 ? 'Primeira consulta' : 'Retorno para avaliação',
        },
      });
      agendamentosCriados.push(agendamento);
      console.log(`Agendamento criado para ${paciente.nome} em ${data.toLocaleDateString()}`);
    }
  }

  // Criação de prontuários (um por agendamento confirmado)
  const prontuariosCriados: any[] = [];
  for (const agendamento of agendamentosCriados.filter(a => a.status === 'CONFIRMADO')) {
    const paciente = pacientesCriados.find(p => p.id === agendamento.pacienteId);
    const profissional = profissionaisCriados.find(p => p.id === agendamento.profissionalId);
    
    const prontuario = await prisma.prontuario.create({
      data: {
        tenantId: clinica.tenantId,
        pacienteId: agendamento.pacienteId,
        profissionalId: agendamento.profissionalId,
        data: agendamento.data,
        tipo: agendamento.tipo === 'CONSULTA' ? 'CONSULTA' : 'RETORNO',
        descricao: `Prontuário de ${agendamento.tipo.toLowerCase()} - ${paciente?.nome}`,
        diagnostico: 'Diagnóstico a ser definido',
        prescricao: 'Prescrição médica',
        observacoes: `Observações da consulta de ${agendamento.data.toLocaleDateString()}`,
      },
    });
    prontuariosCriados.push(prontuario);
    console.log(`Prontuário criado para ${paciente?.nome}`);
  }

  // Criação de anamneses (uma por prontuário)
  for (const prontuario of prontuariosCriados) {
    const paciente = pacientesCriados.find(p => p.id === prontuario.pacienteId);
    const profissional = profissionaisCriados.find(p => p.id === prontuario.profissionalId);
    
    const anamnese = await prisma.anamnese.create({
      data: {
        tenantId: clinica.tenantId,
        pacienteId: prontuario.pacienteId,
        profissionalId: prontuario.profissionalId,
        prontuarioId: prontuario.id,
        data: prontuario.data,
        templateId: 'template-anamnese-padrao',
        campos: {
          queixaPrincipal: 'Queixa principal do paciente',
          historiaAtual: 'História atual da doença',
          antecedentesPatologicos: 'Antecedentes patológicos',
          antecedentesGinecologicos: 'N/A',
          antecedentesCirurgicos: 'Nenhum',
          medicamentosEmUso: 'Medicamentos em uso',
          habitos: 'Hábitos de vida',
          antecedentesFamiliares: 'Antecedentes familiares',
          exameFisico: 'Exame físico realizado',
        },
      },
    });
    console.log(`Anamnese criada para ${paciente?.nome}`);
  }

  // Criação de exames (2-3 por prontuario)
  const tiposExames = [
    'Hemograma Completo',
    'Glicemia em Jejum',
    'Colesterol Total',
    'Triglicerídeos',
    'Creatinina',
    'TSH',
    'T4 Livre',
    'Vitamina D',
    'Ferritina',
    'Proteína C Reativa',
  ];

  for (const prontuario of prontuariosCriados) {
    const paciente = pacientesCriados.find(p => p.id === prontuario.pacienteId);
    const numExames = 2 + (Math.floor(Math.random() * 2)); // 2-3 exames
    
    for (let i = 0; i < numExames; i++) {
      const tipoExame = tiposExames[Math.floor(Math.random() * tiposExames.length)];
      const dataExame = new Date(prontuario.data);
      dataExame.setDate(dataExame.getDate() + 1 + i); // 1-2 dias após a consulta
      
      const exame = await prisma.exame.create({
        data: {
          tenantId: clinica.tenantId,
          prontuarioId: prontuario.id,
          tipo: tipoExame,
          data: dataExame,
          resultado: `Resultado do ${tipoExame} - Valores dentro dos parâmetros normais`,
          observacoes: `Exame ${tipoExame} realizado conforme solicitado`,
          arquivos: [`https://exemplo.com/exames/${tipoExame.toLowerCase().replace(' ', '-')}.pdf`],
        },
      });
      console.log(`Exame ${tipoExame} criado para ${paciente?.nome}`);
    }
  }

  // Criação de faturamento (um por agendamento)
  for (const agendamento of agendamentosCriados) {
    const paciente = pacientesCriados.find(p => p.id === agendamento.pacienteId);
    const profissional = profissionaisCriados.find(p => p.id === agendamento.profissionalId);
    const prontuario = prontuariosCriados.find(p => p.pacienteId === agendamento.pacienteId && p.data.getTime() === agendamento.data.getTime());
    
    const valor = agendamento.tipo === 'CONSULTA' ? 150.00 : 100.00;
    const status = Math.random() > 0.3 ? 'PENDENTE' : 'PAGO'; // 70% pendente, 30% pago
    
    const faturamento = await prisma.faturamento.create({
      data: {
        tenantId: clinica.tenantId,
        pacienteId: agendamento.pacienteId,
        profissionalId: agendamento.profissionalId,
        agendamentoId: agendamento.id,
        prontuarioId: prontuario?.id,
        tipo: agendamento.tipo === 'CONSULTA' ? 'CONSULTA' : 'RETORNO',
        valor: valor,
        desconto: 0.00,
        valorFinal: valor,
        valorPago: status === 'PAGO' ? valor : 0.00,
        formaPagamento: 'PIX',
        status: status,
        dataVencimento: new Date(agendamento.data.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 dias após
        dataPagamento: status === 'PAGO' ? new Date(agendamento.data.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
        observacoes: `Faturamento para ${agendamento.tipo.toLowerCase()} de ${paciente?.nome}`,
      },
    });
    console.log(`Faturamento criado para ${paciente?.nome} (Status: ${faturamento.status})`);
  }

  // Criação de faturas da clínica
  const faturasClinica: any[] = [];
  for (let i = 1; i <= 6; i++) {
    const dataVencimento = getDateFromToday(15 + (i * 30)); // Próximos 6 meses
    const faturaClinica = await prisma.faturaClinica.create({
      data: {
        tenantId: clinica.tenantId,
        numeroFatura: `FAT-2024-${i.toString().padStart(3, '0')}`,
        valor: 500.00 + (i * 50),
        dataVencimento: dataVencimento,
        status: i <= 3 ? 'PENDENTE' : 'PAGO',
        diasAtraso: i > 3 ? 0 : Math.floor(Math.random() * 10),
        nivelBloqueio: i > 3 ? 'SEM_BLOQUEIO' : 'NOTIFICACAO',
        observacoes: `Fatura mensal - ${dataVencimento.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
      },
    });
    faturasClinica.push(faturaClinica);
    console.log(`Fatura da Clínica criada: ${faturaClinica.numeroFatura}`);
  }

  // Criação de templates de especialidade
  const templateEspecialidade = await prisma.templateEspecialidade.create({
    data: {
      tenantId: clinica.tenantId,
      nome: 'Template Anamnese Clínico Geral',
      descricao: 'Template padrão para anamnese de clínico geral',
      tipoClinica: 'MEDICA',
      categoria: 'ANAMNESE',
      campos: {
        queixaPrincipal: { tipo: 'TEXTO', obrigatorio: true },
        historiaAtual: { tipo: 'TEXTAREA', obrigatorio: true },
        antecedentesPatologicos: { tipo: 'TEXTAREA', obrigatorio: false },
        medicamentosEmUso: { tipo: 'TEXTAREA', obrigatorio: false },
        habitos: { tipo: 'TEXTAREA', obrigatorio: false },
        antecedentesFamiliares: { tipo: 'TEXTAREA', obrigatorio: false },
        exameFisico: { tipo: 'TEXTAREA', obrigatorio: true },
      },
      validacoes: {},
      ativo: true,
      ordem: 1,
    },
  });
  console.log(`Template de Especialidade criado: ${templateEspecialidade.nome}`);

  // Criação de configuração WhatsApp
  const configWhatsApp = await prisma.clinicaWhatsAppConfig.create({
    data: {
      tenantId: clinica.tenantId,
      zApiInstanceId: 'instance-001',
      zApiToken: 'token-exemplo',
      numeroWhatsApp: '5511999999999',
      mensagensAtivas: {
        lembreteConsulta: true,
        confirmacaoConsulta: true,
        cancelamentoConsulta: true,
      },
      horarioEnvioLembrete: '08:00',
      diasAntecedenciaLembrete: 1,
      ativo: true,
    },
  });
  console.log(`Configuração de WhatsApp criada para ${clinica.nome}`);

  // Criação de chat
  const chat = await prisma.chat.create({
    data: {
      tenantId: clinica.tenantId,
      tipo: 'GERAL',
      nome: 'Chat Geral da Clínica',
      descricao: 'Chat para comunicação geral da equipe',
      criadoPor: usuarioAdmin.id,
      ativo: true,
    },
  });
  console.log(`Chat criado: ${chat.nome}`);

  // Adicionar participantes ao chat
  const todosUsuarios = [usuarioAdmin, ...usuariosRecepcionistas, ...usuariosProfissionais];
  for (const usuario of todosUsuarios) {
    await prisma.chatParticipante.create({
      data: {
        chatId: chat.id,
        userId: usuario.id,
        tenantId: clinica.tenantId,
        admin: usuario.role === 'ADMIN',
        ativo: true,
      },
    });
  }
  console.log(`${todosUsuarios.length} participantes adicionados ao chat`);

  console.log('\n=== RESUMO DO SEED ===');
  console.log(`Clínica: ${clinica.nome}`);
  console.log(`Especialidades criadas: ${especialidadesCriadas.length}`);
  console.log(`Profissionais criados: ${profissionaisCriados.length}`);
  console.log(`Recepcionistas criados: ${usuariosRecepcionistas.length}`);
  console.log(`Pacientes criados: ${pacientesCriados.length}`);
  console.log(`Agendamentos criados: ${agendamentosCriados.length}`);
  console.log(`Prontuários criados: ${prontuariosCriados.length}`);
  console.log(`Faturas da clínica criadas: ${faturasClinica.length}`);
  console.log('Seed completo concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    (process as any).exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Conexão com o banco de dados desconectada.');
  });

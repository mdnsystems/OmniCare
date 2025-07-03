"use strict";
// =============================================================================
// SCRIPT DE SEED - SWIFT CLINIC API
// =============================================================================
// 
// Popula o banco de dados com dados de teste
// Cria clínicas, usuários, especialidades e dados relacionados
//
// =============================================================================
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../generated/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const enums_1 = require("../types/enums");
const prisma = new prisma_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🌱 Iniciando seed do banco de dados...');
        // Limpar dados existentes
        yield prisma.mensagem.deleteMany();
        yield prisma.exame.deleteMany();
        yield prisma.anamnese.deleteMany();
        yield prisma.prontuario.deleteMany();
        yield prisma.agendamento.deleteMany();
        yield prisma.paciente.deleteMany();
        yield prisma.profissional.deleteMany();
        yield prisma.usuario.deleteMany();
        yield prisma.especialidade.deleteMany();
        yield prisma.clinica.deleteMany();
        console.log('✅ Dados antigos removidos');
        // Criar clínicas de teste
        const clinicas = yield Promise.all([
            prisma.clinica.create({
                data: {
                    tenantId: 'clinica-ortopedia-001',
                    nome: 'Clínica Ortopédica São José',
                    tipo: enums_1.TipoClinica.MEDICA,
                    logo: 'https://via.placeholder.com/150x150/2563eb/ffffff?text=O',
                    corPrimaria: '#2563eb',
                    corSecundaria: '#1e40af',
                    tema: 'light',
                    ativo: true,
                },
            }),
            prisma.clinica.create({
                data: {
                    tenantId: 'clinica-nutricao-002',
                    nome: 'Clínica de Nutrição Vida Saudável',
                    tipo: enums_1.TipoClinica.NUTRICIONAL,
                    logo: 'https://via.placeholder.com/150x150/059669/ffffff?text=N',
                    corPrimaria: '#059669',
                    corSecundaria: '#047857',
                    tema: 'light',
                    ativo: true,
                },
            }),
            prisma.clinica.create({
                data: {
                    tenantId: 'clinica-psicologia-003',
                    nome: 'Clínica de Psicologia Mente Sã',
                    tipo: enums_1.TipoClinica.PSICOLOGICA,
                    logo: 'https://via.placeholder.com/150x150/7c3aed/ffffff?text=P',
                    corPrimaria: '#7c3aed',
                    corSecundaria: '#6d28d9',
                    tema: 'light',
                    ativo: true,
                },
            }),
        ]);
        console.log('✅ Clínicas criadas');
        // Criar especialidades para cada clínica
        const especialidades = yield Promise.all([
            // Especialidades Ortopedia
            prisma.especialidade.create({
                data: {
                    tenantId: clinicas[0].tenantId,
                    nome: 'Ortopedia Geral',
                    descricao: 'Tratamento de lesões e doenças do sistema musculoesquelético',
                    tipoClinica: enums_1.TipoClinica.MEDICA,
                    configuracoes: {
                        duracaoConsulta: 30,
                        intervaloConsultas: 15,
                        permiteAgendamentoOnline: true,
                    },
                    ativo: true,
                },
            }),
            prisma.especialidade.create({
                data: {
                    tenantId: clinicas[0].tenantId,
                    nome: 'Traumatologia',
                    descricao: 'Especializada em traumas e fraturas',
                    tipoClinica: enums_1.TipoClinica.MEDICA,
                    configuracoes: {
                        duracaoConsulta: 45,
                        intervaloConsultas: 20,
                        permiteAgendamentoOnline: true,
                    },
                    ativo: true,
                },
            }),
            // Especialidades Nutrição
            prisma.especialidade.create({
                data: {
                    tenantId: clinicas[1].tenantId,
                    nome: 'Nutrição Clínica',
                    descricao: 'Avaliação e tratamento nutricional personalizado',
                    tipoClinica: enums_1.TipoClinica.NUTRICIONAL,
                    configuracoes: {
                        duracaoConsulta: 60,
                        intervaloConsultas: 30,
                        permiteAgendamentoOnline: true,
                    },
                    ativo: true,
                },
            }),
            prisma.especialidade.create({
                data: {
                    tenantId: clinicas[1].tenantId,
                    nome: 'Nutrição Esportiva',
                    descricao: 'Nutrição especializada para atletas e praticantes de esporte',
                    tipoClinica: enums_1.TipoClinica.NUTRICIONAL,
                    configuracoes: {
                        duracaoConsulta: 45,
                        intervaloConsultas: 20,
                        permiteAgendamentoOnline: true,
                    },
                    ativo: true,
                },
            }),
            // Especialidades Psicologia
            prisma.especialidade.create({
                data: {
                    tenantId: clinicas[2].tenantId,
                    nome: 'Psicologia Clínica',
                    descricao: 'Avaliação e tratamento psicológico',
                    tipoClinica: enums_1.TipoClinica.PSICOLOGICA,
                    configuracoes: {
                        duracaoConsulta: 50,
                        intervaloConsultas: 10,
                        permiteAgendamentoOnline: true,
                    },
                    ativo: true,
                },
            }),
            prisma.especialidade.create({
                data: {
                    tenantId: clinicas[2].tenantId,
                    nome: 'Psicologia Infantil',
                    descricao: 'Atenção psicológica especializada para crianças',
                    tipoClinica: enums_1.TipoClinica.PSICOLOGICA,
                    configuracoes: {
                        duracaoConsulta: 40,
                        intervaloConsultas: 20,
                        permiteAgendamentoOnline: true,
                    },
                    ativo: true,
                },
            }),
        ]);
        console.log('✅ Especialidades criadas');
        // Criar usuários para cada clínica
        const senhaHash = yield bcryptjs_1.default.hash('123456', 12);
        const usuarios = yield Promise.all([
            // Usuários Clínica Ortopedia
            prisma.usuario.create({
                data: {
                    tenantId: clinicas[0].tenantId,
                    email: 'admin@clinicaortopedia.com',
                    senha: senhaHash,
                    role: enums_1.RoleUsuario.ADMIN,
                    ativo: true,
                },
            }),
            prisma.usuario.create({
                data: {
                    tenantId: clinicas[0].tenantId,
                    email: 'carlos.silva@clinicaortopedia.com',
                    senha: senhaHash,
                    role: enums_1.RoleUsuario.PROFISSIONAL,
                    ativo: true,
                },
            }),
            prisma.usuario.create({
                data: {
                    tenantId: clinicas[0].tenantId,
                    email: 'recepcao@clinicaortopedia.com',
                    senha: senhaHash,
                    role: enums_1.RoleUsuario.RECEPCIONISTA,
                    ativo: true,
                },
            }),
            // Usuários Clínica Nutrição
            prisma.usuario.create({
                data: {
                    tenantId: clinicas[1].tenantId,
                    email: 'admin@nutricao.com',
                    senha: senhaHash,
                    role: enums_1.RoleUsuario.ADMIN,
                    ativo: true,
                },
            }),
            prisma.usuario.create({
                data: {
                    tenantId: clinicas[1].tenantId,
                    email: 'ana.santos@nutricao.com',
                    senha: senhaHash,
                    role: enums_1.RoleUsuario.PROFISSIONAL,
                    ativo: true,
                },
            }),
            // Usuários Clínica Psicologia
            prisma.usuario.create({
                data: {
                    tenantId: clinicas[2].tenantId,
                    email: 'admin@psicologia.com',
                    senha: senhaHash,
                    role: enums_1.RoleUsuario.ADMIN,
                    ativo: true,
                },
            }),
            prisma.usuario.create({
                data: {
                    tenantId: clinicas[2].tenantId,
                    email: 'maria.costa@psicologia.com',
                    senha: senhaHash,
                    role: enums_1.RoleUsuario.PROFISSIONAL,
                    ativo: true,
                },
            }),
        ]);
        console.log('✅ Usuários criados');
        // Criar profissionais
        const profissionais = yield Promise.all([
            // Profissionais Clínica Ortopedia
            prisma.profissional.create({
                data: {
                    tenantId: clinicas[0].tenantId,
                    nome: 'Dr. Carlos Silva',
                    especialidadeId: especialidades[0].id,
                    registro: 'CRM-12345',
                    crm: 'CRM-12345',
                    email: 'carlos.silva@clinicaortopedia.com',
                    telefone: '(11) 99999-1111',
                    sexo: 'M',
                    dataNascimento: new Date('1980-05-15'),
                    dataContratacao: new Date('2020-01-15'),
                    status: enums_1.ProfissionalStatus.ATIVO,
                    rua: 'Rua das Flores',
                    numero: '123',
                    bairro: 'Centro',
                    cidade: 'São Paulo',
                    estado: 'SP',
                    cep: '01234-567',
                    horarioInicio: '08:00',
                    horarioFim: '18:00',
                    intervalo: '30',
                },
            }),
            // Profissionais Clínica Nutrição
            prisma.profissional.create({
                data: {
                    tenantId: clinicas[1].tenantId,
                    nome: 'Dra. Ana Santos',
                    especialidadeId: especialidades[2].id,
                    registro: 'CRN-54321',
                    crm: null,
                    email: 'ana.santos@nutricao.com',
                    telefone: '(11) 99999-2222',
                    sexo: 'F',
                    dataNascimento: new Date('1985-08-20'),
                    dataContratacao: new Date('2021-03-10'),
                    status: enums_1.ProfissionalStatus.ATIVO,
                    rua: 'Av. Paulista',
                    numero: '456',
                    bairro: 'Bela Vista',
                    cidade: 'São Paulo',
                    estado: 'SP',
                    cep: '01310-100',
                    horarioInicio: '09:00',
                    horarioFim: '17:00',
                    intervalo: '45',
                },
            }),
            // Profissionais Clínica Psicologia
            prisma.profissional.create({
                data: {
                    tenantId: clinicas[2].tenantId,
                    nome: 'Dra. Maria Costa',
                    especialidadeId: especialidades[4].id,
                    registro: 'CRP-98765',
                    crm: null,
                    email: 'maria.costa@psicologia.com',
                    telefone: '(11) 99999-3333',
                    sexo: 'F',
                    dataNascimento: new Date('1982-12-10'),
                    dataContratacao: new Date('2019-06-20'),
                    status: enums_1.ProfissionalStatus.ATIVO,
                    rua: 'Rua Augusta',
                    numero: '789',
                    bairro: 'Consolação',
                    cidade: 'São Paulo',
                    estado: 'SP',
                    cep: '01212-001',
                    horarioInicio: '10:00',
                    horarioFim: '19:00',
                    intervalo: '50',
                },
            }),
        ]);
        console.log('✅ Profissionais criados');
        // Atualizar usuários com profissionalId
        yield Promise.all([
            prisma.usuario.update({
                where: { id: usuarios[1].id },
                data: { profissionalId: profissionais[0].id },
            }),
            prisma.usuario.update({
                where: { id: usuarios[4].id },
                data: { profissionalId: profissionais[1].id },
            }),
            prisma.usuario.update({
                where: { id: usuarios[6].id },
                data: { profissionalId: profissionais[2].id },
            }),
        ]);
        console.log('✅ Usuários vinculados aos profissionais');
        // Criar pacientes de exemplo
        const pacientes = yield Promise.all([
            prisma.paciente.create({
                data: {
                    tenantId: clinicas[0].tenantId,
                    nome: 'João Silva',
                    cpf: '123.456.789-00',
                    dataNascimento: new Date('1990-03-15'),
                    email: 'joao.silva@email.com',
                    telefone: '(11) 98888-1111',
                    endereco: 'Rua A',
                    numero: '100',
                    bairro: 'Vila Nova',
                    cidade: 'São Paulo',
                    estado: 'SP',
                    cep: '01234-567',
                    profissionalId: profissionais[0].id,
                },
            }),
            prisma.paciente.create({
                data: {
                    tenantId: clinicas[1].tenantId,
                    nome: 'Maria Oliveira',
                    cpf: '987.654.321-00',
                    dataNascimento: new Date('1985-07-22'),
                    email: 'maria.oliveira@email.com',
                    telefone: '(11) 98888-2222',
                    endereco: 'Rua B',
                    numero: '200',
                    bairro: 'Jardim Paulista',
                    cidade: 'São Paulo',
                    estado: 'SP',
                    cep: '01234-568',
                    profissionalId: profissionais[1].id,
                },
            }),
            prisma.paciente.create({
                data: {
                    tenantId: clinicas[2].tenantId,
                    nome: 'Pedro Santos',
                    cpf: '456.789.123-00',
                    dataNascimento: new Date('1995-11-08'),
                    email: 'pedro.santos@email.com',
                    telefone: '(11) 98888-3333',
                    endereco: 'Rua C',
                    numero: '300',
                    bairro: 'Mooca',
                    cidade: 'São Paulo',
                    estado: 'SP',
                    cep: '01234-569',
                    profissionalId: profissionais[2].id,
                },
            }),
        ]);
        console.log('✅ Pacientes criados');
        // Criar agendamentos de exemplo
        const hoje = new Date();
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);
        yield Promise.all([
            prisma.agendamento.create({
                data: {
                    tenantId: clinicas[0].tenantId,
                    pacienteId: pacientes[0].id,
                    profissionalId: profissionais[0].id,
                    data: amanha,
                    horaInicio: '09:00',
                    horaFim: '09:30',
                    tipo: enums_1.TipoAgendamento.CONSULTA,
                    status: enums_1.StatusAgendamento.AGENDADO,
                    observacoes: 'Primeira consulta',
                },
            }),
            prisma.agendamento.create({
                data: {
                    tenantId: clinicas[1].tenantId,
                    pacienteId: pacientes[1].id,
                    profissionalId: profissionais[1].id,
                    data: new Date(amanha.getTime() + 2 * 60 * 60 * 1000), // +2 horas
                    horaInicio: '11:00',
                    horaFim: '12:00',
                    tipo: enums_1.TipoAgendamento.CONSULTA,
                    status: enums_1.StatusAgendamento.AGENDADO,
                    observacoes: 'Avaliação nutricional',
                },
            }),
            prisma.agendamento.create({
                data: {
                    tenantId: clinicas[2].tenantId,
                    pacienteId: pacientes[2].id,
                    profissionalId: profissionais[2].id,
                    data: new Date(amanha.getTime() + 4 * 60 * 60 * 1000), // +4 horas
                    horaInicio: '14:00',
                    horaFim: '14:50',
                    tipo: enums_1.TipoAgendamento.CONSULTA,
                    status: enums_1.StatusAgendamento.AGENDADO,
                    observacoes: 'Sessão de terapia',
                },
            }),
        ]);
        console.log('✅ Agendamentos criados');
        console.log('🎉 Seed concluído com sucesso!');
        console.log('');
        console.log('📋 Credenciais de acesso:');
        console.log('');
        console.log('🏥 Clínica Ortopédica:');
        console.log('  Admin: admin@clinicaortopedia.com / 123456');
        console.log('  Profissional: carlos.silva@clinicaortopedia.com / 123456');
        console.log('  Recepção: recepcao@clinicaortopedia.com / 123456');
        console.log('');
        console.log('🥗 Clínica de Nutrição:');
        console.log('  Admin: admin@nutricao.com / 123456');
        console.log('  Profissional: ana.santos@nutricao.com / 123456');
        console.log('');
        console.log('🧠 Clínica de Psicologia:');
        console.log('  Admin: admin@psicologia.com / 123456');
        console.log('  Profissional: maria.costa@psicologia.com / 123456');
        console.log('');
    });
}
main()
    .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//# sourceMappingURL=seed.js.map
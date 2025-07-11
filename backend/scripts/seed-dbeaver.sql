-- =====================================================
-- SCRIPT SQL PARA POPULAR BANCO DE DADOS OMNICARE
-- Baseado no seed.ts - Execute em ordem no DBeaver
-- =====================================================

-- 1. LIMPEZA DOS DADOS EXISTENTES (ordem reversa das dependências)
-- =====================================================

DELETE FROM "arquivos_mensagens";
DELETE FROM "arquivos_chat";
DELETE FROM "leituras_mensagens";
DELETE FROM "mensagens";
DELETE FROM "chat_participantes";
DELETE FROM "chats";
DELETE FROM "notificacoes";
DELETE FROM "message_templates";
DELETE FROM "clinica_whatsapp_config";
DELETE FROM "pagamentos_clinica";
DELETE FROM "lembretes_clinica";
DELETE FROM "historico_bloqueios";
DELETE FROM "faturas_clinica";
DELETE FROM "pagamentos";
DELETE FROM "faturamentos";
DELETE FROM "exames";
DELETE FROM "anamneses";
DELETE FROM "prontuarios";
DELETE FROM "agendamentos";
DELETE FROM "pacientes";
DELETE FROM "usuarios";
DELETE FROM "profissionais";
DELETE FROM "especialidades";
DELETE FROM "template_especialidades";
DELETE FROM "campos_personalizados";
DELETE FROM "fluxos_especialidades";
DELETE FROM "relatorios_especialidades";
DELETE FROM "dashboards_especialidades";
DELETE FROM "clinicas";

-- 2. CRIAÇÃO DA CLÍNICA (TENANT)
-- =====================================================

INSERT INTO "clinicas" (
    "id", "tenant_id", "nome", "tipo", "logo", "corPrimaria", 
    "corSecundaria", "tema", "ativo", "createdAt", "updatedAt"
) VALUES (
    gen_random_uuid(),
    'tenant-001',
    'Clínica Exemplo',
    'MEDICA'::"TipoClinica",
    'https://via.placeholder.com/150',
    '#2563eb',
    '#1e40af',
    'light',
    true,
    NOW(),
    NOW()
);

-- 3. CRIAÇÃO DE USUÁRIOS ADMIN E SUPER_ADMIN
-- =====================================================

INSERT INTO "usuarios" (
    "id", "tenant_id", "email", "senha", "role", "ativo", "createdAt", "updatedAt"
) VALUES 
(
    gen_random_uuid(),
    'tenant-001',
    'admin@clinica.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uKGi', -- @DLe200320
    'ADMIN'::"RoleUsuario",
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'superadmin@clinica.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uKGi', -- @DLe200320
    'SUPER_ADMIN'::"RoleUsuario",
    true,
    NOW(),
    NOW()
);

-- 4. CRIAÇÃO DE RECEPCIONISTAS
-- =====================================================

INSERT INTO "usuarios" (
    "id", "tenant_id", "email", "senha", "role", "ativo", "createdAt", "updatedAt"
) VALUES 
(
    gen_random_uuid(),
    'tenant-001',
    'recepcionista1@clinica.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uKGi', -- @DLe200320
    'RECEPCIONISTA'::"RoleUsuario",
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'recepcionista2@clinica.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uKGi', -- @DLe200320
    'RECEPCIONISTA'::"RoleUsuario",
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'recepcionista3@clinica.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uKGi', -- @DLe200320
    'RECEPCIONISTA'::"RoleUsuario",
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'recepcionista4@clinica.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uKGi', -- @DLe200320
    'RECEPCIONISTA'::"RoleUsuario",
    true,
    NOW(),
    NOW()
);

-- 5. CRIAÇÃO DE ESPECIALIDADES
-- =====================================================

INSERT INTO "especialidades" (
    "id", "tenant_id", "nome", "descricao", "tipo_clinica", "configuracoes", "ativo", "createdAt", "updatedAt"
) VALUES 
(
    gen_random_uuid(),
    'tenant-001',
    'Clínico Geral',
    'Atendimento geral e preventivo',
    'MEDICA'::"TipoClinica",
    '{}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Cardiologia',
    'Especialidade do coração e sistema cardiovascular',
    'MEDICA'::"TipoClinica",
    '{}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Dermatologia',
    'Especialidade da pele e anexos',
    'MEDICA'::"TipoClinica",
    '{}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Ginecologia',
    'Saúde da mulher',
    'MEDICA'::"TipoClinica",
    '{}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Ortopedia',
    'Especialidade do sistema musculoesquelético',
    'MEDICA'::"TipoClinica",
    '{}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Pediatria',
    'Atendimento infantil',
    'MEDICA'::"TipoClinica",
    '{}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Psicologia',
    'Saúde mental e comportamento',
    'MEDICA'::"TipoClinica",
    '{}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Nutrição',
    'Nutrição e alimentação saudável',
    'MEDICA'::"TipoClinica",
    '{}',
    true,
    NOW(),
    NOW()
);

-- 6. CRIAÇÃO DE PROFISSIONAIS
-- =====================================================

INSERT INTO "profissionais" (
    "id", "tenant_id", "nome", "especialidade_id", "registro", "crm", "email", "telefone", 
    "sexo", "data_nascimento", "data_contratacao", "status", "rua", "numero", 
    "bairro", "cidade", "estado", "cep", "horario_inicio", "horario_fim", 
    "intervalo", "dias_trabalho", "createdAt", "updatedAt"
) 
SELECT 
    gen_random_uuid(),
    'tenant-001',
    'Dr. João Silva',
    e.id,
    'CRM12345',
    'CRM12345',
    'joao.silva@clinica.com',
    '11999999999',
    'M',
    (CURRENT_DATE - INTERVAL '44 years'),
    (CURRENT_DATE - INTERVAL '1460 days'),
    'ATIVO'::"ProfissionalStatus",
    'Rua Exemplo',
    '100',
    'Centro',
    'São Paulo',
    'SP',
    '01000-000',
    '08:00',
    '18:00',
    '12:00-13:00',
    ARRAY['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'],
    NOW(),
    NOW()
FROM "especialidades" e WHERE e.nome = 'Clínico Geral' AND e."tenant_id" = 'tenant-001'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    'Dra. Maria Santos',
    e.id,
    'CRM67890',
    'CRM67890',
    'maria.santos@clinica.com',
    '11988888888',
    'F',
    (CURRENT_DATE - INTERVAL '39 years'),
    (CURRENT_DATE - INTERVAL '1460 days'),
    'ATIVO'::"ProfissionalStatus",
    'Rua Exemplo',
    '100',
    'Centro',
    'São Paulo',
    'SP',
    '01000-000',
    '08:00',
    '18:00',
    '12:00-13:00',
    ARRAY['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'],
    NOW(),
    NOW()
FROM "especialidades" e WHERE e.nome = 'Cardiologia' AND e."tenant_id" = 'tenant-001'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    'Dr. Carlos Oliveira',
    e.id,
    'CRM11111',
    'CRM11111',
    'carlos.oliveira@clinica.com',
    '11977777777',
    'M',
    (CURRENT_DATE - INTERVAL '49 years'),
    (CURRENT_DATE - INTERVAL '1825 days'),
    'ATIVO'::"ProfissionalStatus",
    'Rua Exemplo',
    '100',
    'Centro',
    'São Paulo',
    'SP',
    '01000-000',
    '08:00',
    '18:00',
    '12:00-13:00',
    ARRAY['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'],
    NOW(),
    NOW()
FROM "especialidades" e WHERE e.nome = 'Dermatologia' AND e."tenant_id" = 'tenant-001'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    'Dra. Ana Costa',
    e.id,
    'CRM22222',
    'CRM22222',
    'ana.costa@clinica.com',
    '11966666666',
    'F',
    (CURRENT_DATE - INTERVAL '42 years'),
    (CURRENT_DATE - INTERVAL '1460 days'),
    'ATIVO'::"ProfissionalStatus",
    'Rua Exemplo',
    '100',
    'Centro',
    'São Paulo',
    'SP',
    '01000-000',
    '08:00',
    '18:00',
    '12:00-13:00',
    ARRAY['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'],
    NOW(),
    NOW()
FROM "especialidades" e WHERE e.nome = 'Ginecologia' AND e."tenant_id" = 'tenant-001'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    'Dr. Pedro Lima',
    e.id,
    'CRM33333',
    'CRM33333',
    'pedro.lima@clinica.com',
    '11955555555',
    'M',
    (CURRENT_DATE - INTERVAL '46 years'),
    (CURRENT_DATE - INTERVAL '1825 days'),
    'ATIVO'::"ProfissionalStatus",
    'Rua Exemplo',
    '100',
    'Centro',
    'São Paulo',
    'SP',
    '01000-000',
    '08:00',
    '18:00',
    '12:00-13:00',
    ARRAY['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'],
    NOW(),
    NOW()
FROM "especialidades" e WHERE e.nome = 'Ortopedia' AND e."tenant_id" = 'tenant-001'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    'Dra. Fernanda Rocha',
    e.id,
    'CRM44444',
    'CRM44444',
    'fernanda.rocha@clinica.com',
    '11944444444',
    'F',
    (CURRENT_DATE - INTERVAL '37 years'),
    (CURRENT_DATE - INTERVAL '1095 days'),
    'ATIVO'::"ProfissionalStatus",
    'Rua Exemplo',
    '100',
    'Centro',
    'São Paulo',
    'SP',
    '01000-000',
    '08:00',
    '18:00',
    '12:00-13:00',
    ARRAY['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'],
    NOW(),
    NOW()
FROM "especialidades" e WHERE e.nome = 'Pediatria' AND e."tenant_id" = 'tenant-001'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    'Psic. Roberto Almeida',
    e.id,
    'CRP12345',
    NULL,
    'roberto.almeida@clinica.com',
    '11933333333',
    'M',
    (CURRENT_DATE - INTERVAL '41 years'),
    (CURRENT_DATE - INTERVAL '1460 days'),
    'ATIVO'::"ProfissionalStatus",
    'Rua Exemplo',
    '100',
    'Centro',
    'São Paulo',
    'SP',
    '01000-000',
    '08:00',
    '18:00',
    '12:00-13:00',
    ARRAY['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'],
    NOW(),
    NOW()
FROM "especialidades" e WHERE e.nome = 'Psicologia' AND e."tenant_id" = 'tenant-001'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    'Nutr. Juliana Ferreira',
    e.id,
    'CRN12345',
    NULL,
    'juliana.ferreira@clinica.com',
    '11922222222',
    'F',
    (CURRENT_DATE - INTERVAL '35 years'),
    (CURRENT_DATE - INTERVAL '1095 days'),
    'ATIVO'::"ProfissionalStatus",
    'Rua Exemplo',
    '100',
    'Centro',
    'São Paulo',
    'SP',
    '01000-000',
    '08:00',
    '18:00',
    '12:00-13:00',
    ARRAY['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'],
    NOW(),
    NOW()
FROM "especialidades" e WHERE e.nome = 'Nutrição' AND e."tenant_id" = 'tenant-001';

-- 7. CRIAÇÃO DE USUÁRIOS PARA PROFISSIONAIS
-- =====================================================

INSERT INTO "usuarios" (
    "id", "tenant_id", "email", "senha", "role", "profissional_id", "ativo", "createdAt", "updatedAt"
)
SELECT 
    gen_random_uuid(),
    'tenant-001',
    p.email,
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uKGi', -- @DLe200320
    'PROFISSIONAL'::"RoleUsuario",
    p.id,
    true,
    NOW(),
    NOW()
FROM "profissionais" p WHERE p."tenant_id" = 'tenant-001';

-- 8. CRIAÇÃO DE PACIENTES
-- =====================================================

INSERT INTO "pacientes" (
    "id", "tenant_id", "nome", "data_nascimento", "cpf", "telefone", "email", 
    "endereco", "numero", "bairro", "cep", "cidade", "estado", "pais", 
    "profissional_id", "createdAt", "updatedAt"
) VALUES 
(
    gen_random_uuid(),
    'tenant-001',
    'Maria Souza',
    (CURRENT_DATE - INTERVAL '34 years'),
    '123.456.789-00',
    '11988888888',
    'maria.souza@paciente.com',
    'Av. Principal, 200',
    '200',
    'Bairro Novo',
    '02000-000',
    'São Paulo',
    'SP',
    'Brasil',
    (SELECT id FROM "profissionais" WHERE nome = 'Dr. João Silva' LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'José Pereira',
    (CURRENT_DATE - INTERVAL '39 years'),
    '234.567.890-11',
    '11977777777',
    'jose.pereira@paciente.com',
    'Rua das Flores, 150',
    '150',
    'Centro',
    '01000-000',
    'São Paulo',
    'SP',
    'Brasil',
    (SELECT id FROM "profissionais" WHERE nome = 'Dra. Maria Santos' LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Ana Beatriz Lima',
    (CURRENT_DATE - INTERVAL '29 years'),
    '345.678.901-22',
    '11966666666',
    'ana.lima@paciente.com',
    'Rua do Comércio, 300',
    '300',
    'Vila Madalena',
    '03000-000',
    'São Paulo',
    'SP',
    'Brasil',
    (SELECT id FROM "profissionais" WHERE nome = 'Dr. Carlos Oliveira' LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Roberto Santos',
    (CURRENT_DATE - INTERVAL '46 years'),
    '456.789.012-33',
    '11955555555',
    'roberto.santos@paciente.com',
    'Av. Paulista, 1000',
    '1000',
    'Bela Vista',
    '04000-000',
    'São Paulo',
    'SP',
    'Brasil',
    (SELECT id FROM "profissionais" WHERE nome = 'Dra. Ana Costa' LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Fernanda Costa',
    (CURRENT_DATE - INTERVAL '32 years'),
    '567.890.123-44',
    '11944444444',
    'fernanda.costa@paciente.com',
    'Rua Augusta, 500',
    '500',
    'Consolação',
    '05000-000',
    'São Paulo',
    'SP',
    'Brasil',
    (SELECT id FROM "profissionais" WHERE nome = 'Dr. Pedro Lima' LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Lucas Oliveira',
    (CURRENT_DATE - INTERVAL '37 years'),
    '678.901.234-55',
    '11933333333',
    'lucas.oliveira@paciente.com',
    'Rua Oscar Freire, 200',
    '200',
    'Jardins',
    '06000-000',
    'São Paulo',
    'SP',
    'Brasil',
    (SELECT id FROM "profissionais" WHERE nome = 'Dra. Fernanda Rocha' LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Patrícia Silva',
    (CURRENT_DATE - INTERVAL '26 years'),
    '789.012.345-66',
    '11922222222',
    'patricia.silva@paciente.com',
    'Rua Teodoro Sampaio, 800',
    '800',
    'Pinheiros',
    '07000-000',
    'São Paulo',
    'SP',
    'Brasil',
    (SELECT id FROM "profissionais" WHERE nome = 'Psic. Roberto Almeida' LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Marcelo Rocha',
    (CURRENT_DATE - INTERVAL '44 years'),
    '890.123.456-77',
    '11911111111',
    'marcelo.rocha@paciente.com',
    'Av. Brigadeiro Faria Lima, 1500',
    '1500',
    'Itaim Bibi',
    '08000-000',
    'São Paulo',
    'SP',
    'Brasil',
    (SELECT id FROM "profissionais" WHERE nome = 'Nutr. Juliana Ferreira' LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Camila Ferreira',
    (CURRENT_DATE - INTERVAL '31 years'),
    '901.234.567-88',
    '11900000000',
    'camila.ferreira@paciente.com',
    'Rua Haddock Lobo, 400',
    '400',
    'Cerqueira César',
    '09000-000',
    'São Paulo',
    'SP',
    'Brasil',
    (SELECT id FROM "profissionais" WHERE nome = 'Dr. João Silva' LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'Diego Almeida',
    (CURRENT_DATE - INTERVAL '35 years'),
    '012.345.678-99',
    '11899999999',
    'diego.almeida@paciente.com',
    'Rua Pamplona, 600',
    '600',
    'Jardim Paulista',
    '10000-000',
    'São Paulo',
    'SP',
    'Brasil',
    (SELECT id FROM "profissionais" WHERE nome = 'Dra. Maria Santos' LIMIT 1),
    NOW(),
    NOW()
);

-- 9. CRIAÇÃO DE AGENDAMENTOS
-- =====================================================

INSERT INTO "agendamentos" (
    "id", "tenant_id", "paciente_id", "profissional_id", "data", "hora_inicio", "hora_fim",
    "tipo", "status", "observacoes", "createdAt", "updatedAt"
)
SELECT 
    gen_random_uuid(),
    'tenant-001',
    p.id,
    p."profissional_id",
    (CURRENT_DATE - INTERVAL '30 days'),
    '08:00',
    '09:00',
    'CONSULTA'::"TipoAgendamento",
    'CONFIRMADO'::"StatusAgendamento",
    'Primeira consulta',
    NOW(),
    NOW()
FROM "pacientes" p WHERE p."tenant_id" = 'tenant-001' AND p.nome = 'Maria Souza'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    p.id,
    p."profissional_id",
    (CURRENT_DATE - INTERVAL '25 days'),
    '10:00',
    '11:00',
    'RETORNO'::"TipoAgendamento",
    'AGENDADO'::"StatusAgendamento",
    'Retorno para avaliação',
    NOW(),
    NOW()
FROM "pacientes" p WHERE p."tenant_id" = 'tenant-001' AND p.nome = 'Maria Souza'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    p.id,
    p."profissional_id",
    (CURRENT_DATE - INTERVAL '20 days'),
    '14:00',
    '15:00',
    'CONSULTA'::"TipoAgendamento",
    'CONFIRMADO'::"StatusAgendamento",
    'Primeira consulta',
    NOW(),
    NOW()
FROM "pacientes" p WHERE p."tenant_id" = 'tenant-001' AND p.nome = 'José Pereira'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    p.id,
    p."profissional_id",
    (CURRENT_DATE - INTERVAL '15 days'),
    '16:00',
    '17:00',
    'RETORNO'::"TipoAgendamento",
    'AGENDADO'::"StatusAgendamento",
    'Retorno para avaliação',
    NOW(),
    NOW()
FROM "pacientes" p WHERE p."tenant_id" = 'tenant-001' AND p.nome = 'José Pereira'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    p.id,
    p."profissional_id",
    (CURRENT_DATE - INTERVAL '10 days'),
    '08:00',
    '09:00',
    'CONSULTA'::"TipoAgendamento",
    'CONFIRMADO'::"StatusAgendamento",
    'Primeira consulta',
    NOW(),
    NOW()
FROM "pacientes" p WHERE p."tenant_id" = 'tenant-001' AND p.nome = 'Ana Beatriz Lima'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    p.id,
    p."profissional_id",
    (CURRENT_DATE - INTERVAL '5 days'),
    '10:00',
    '11:00',
    'RETORNO'::"TipoAgendamento",
    'AGENDADO'::"StatusAgendamento",
    'Retorno para avaliação',
    NOW(),
    NOW()
FROM "pacientes" p WHERE p."tenant_id" = 'tenant-001' AND p.nome = 'Ana Beatriz Lima'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    p.id,
    p."profissional_id",
    (CURRENT_DATE + INTERVAL '5 days'),
    '14:00',
    '15:00',
    'CONSULTA'::"TipoAgendamento",
    'CONFIRMADO'::"StatusAgendamento",
    'Primeira consulta',
    NOW(),
    NOW()
FROM "pacientes" p WHERE p."tenant_id" = 'tenant-001' AND p.nome = 'Roberto Santos'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    p.id,
    p."profissional_id",
    (CURRENT_DATE + INTERVAL '10 days'),
    '16:00',
    '17:00',
    'RETORNO'::"TipoAgendamento",
    'AGENDADO'::"StatusAgendamento",
    'Retorno para avaliação',
    NOW(),
    NOW()
FROM "pacientes" p WHERE p."tenant_id" = 'tenant-001' AND p.nome = 'Roberto Santos'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    p.id,
    p."profissional_id",
    (CURRENT_DATE + INTERVAL '15 days'),
    '08:00',
    '09:00',
    'CONSULTA'::"TipoAgendamento",
    'CONFIRMADO'::"StatusAgendamento",
    'Primeira consulta',
    NOW(),
    NOW()
FROM "pacientes" p WHERE p."tenant_id" = 'tenant-001' AND p.nome = 'Fernanda Costa'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    p.id,
    p."profissional_id",
    (CURRENT_DATE + INTERVAL '20 days'),
    '10:00',
    '11:00',
    'RETORNO'::"TipoAgendamento",
    'AGENDADO'::"StatusAgendamento",
    'Retorno para avaliação',
    NOW(),
    NOW()
FROM "pacientes" p WHERE p."tenant_id" = 'tenant-001' AND p.nome = 'Fernanda Costa'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    p.id,
    p."profissional_id",
    (CURRENT_DATE + INTERVAL '25 days'),
    '14:00',
    '15:00',
    'CONSULTA'::"TipoAgendamento",
    'CONFIRMADO'::"StatusAgendamento",
    'Primeira consulta',
    NOW(),
    NOW()
FROM "pacientes" p WHERE p."tenant_id" = 'tenant-001' AND p.nome = 'Lucas Oliveira'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    p.id,
    p."profissional_id",
    (CURRENT_DATE + INTERVAL '30 days'),
    '16:00',
    '17:00',
    'RETORNO'::"TipoAgendamento",
    'AGENDADO'::"StatusAgendamento",
    'Retorno para avaliação',
    NOW(),
    NOW()
FROM "pacientes" p WHERE p."tenant_id" = 'tenant-001' AND p.nome = 'Lucas Oliveira';

-- 10. CRIAÇÃO DE PRONTUÁRIOS (apenas para agendamentos confirmados)
-- =====================================================

INSERT INTO "prontuarios" (
    "id", "tenant_id", "paciente_id", "profissional_id", "data", "tipo", "descricao",
    "diagnostico", "prescricao", "observacoes", "createdAt", "updatedAt"
)
SELECT 
    gen_random_uuid(),
    'tenant-001',
    a."paciente_id",
    a."profissional_id",
    a.data,
    a.tipo::text::"TipoProntuario",
    CONCAT('Prontuário de ', LOWER(a.tipo::text), ' - ', p.nome),
    'Diagnóstico a ser definido',
    'Prescrição médica',
    CONCAT('Observações da consulta de ', TO_CHAR(a.data, 'DD/MM/YYYY')),
    NOW(),
    NOW()
FROM "agendamentos" a
JOIN "pacientes" p ON p.id = a."paciente_id"
WHERE a."tenant_id" = 'tenant-001' AND a.status = 'CONFIRMADO'::"StatusAgendamento";

-- 11. CRIAÇÃO DE ANAMNESES
-- =====================================================

INSERT INTO "anamneses" (
    "id", "tenant_id", "paciente_id", "profissional_id", "prontuario_id", "data",
    "template_id", "campos", "createdAt", "updatedAt"
)
SELECT 
    gen_random_uuid(),
    'tenant-001',
    pr."paciente_id",
    pr."profissional_id",
    pr.id,
    pr.data,
    'template-anamnese-padrao',
    '{
        "queixaPrincipal": "Queixa principal do paciente",
        "historiaAtual": "História atual da doença",
        "antecedentesPatologicos": "Antecedentes patológicos",
        "antecedentesGinecologicos": "N/A",
        "antecedentesCirurgicos": "Nenhum",
        "medicamentosEmUso": "Medicamentos em uso",
        "habitos": "Hábitos de vida",
        "antecedentesFamiliares": "Antecedentes familiares",
        "exameFisico": "Exame físico realizado"
    }',
    NOW(),
    NOW()
FROM "prontuarios" pr WHERE pr."tenant_id" = 'tenant-001';

-- 12. CRIAÇÃO DE EXAMES
-- =====================================================

INSERT INTO "exames" (
    "id", "tenant_id", "prontuario_id", "tipo", "data", "resultado", "observacoes", "arquivos", "createdAt", "updatedAt"
)
SELECT 
    gen_random_uuid(),
    'tenant-001',
    pr.id,
    'Hemograma Completo',
    (pr.data + INTERVAL '1 day'),
    'Resultado do Hemograma Completo - Valores dentro dos parâmetros normais',
    'Exame Hemograma Completo realizado conforme solicitado',
    '["https://exemplo.com/exames/hemograma-completo.pdf"]'::jsonb,
    NOW(),
    NOW()
FROM "prontuarios" pr WHERE pr."tenant_id" = 'tenant-001'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    pr.id,
    'Glicemia em Jejum',
    (pr.data + INTERVAL '2 days'),
    'Resultado da Glicemia em Jejum - Valores dentro dos parâmetros normais',
    'Exame Glicemia em Jejum realizado conforme solicitado',
    '["https://exemplo.com/exames/glicemia-em-jejum.pdf"]'::jsonb,
    NOW(),
    NOW()
FROM "prontuarios" pr WHERE pr."tenant_id" = 'tenant-001'

UNION ALL

SELECT 
    gen_random_uuid(),
    'tenant-001',
    pr.id,
    'Colesterol Total',
    (pr.data + INTERVAL '1 day'),
    'Resultado do Colesterol Total - Valores dentro dos parâmetros normais',
    'Exame Colesterol Total realizado conforme solicitado',
    '["https://exemplo.com/exames/colesterol-total.pdf"]'::jsonb,
    NOW(),
    NOW()
FROM "prontuarios" pr WHERE pr."tenant_id" = 'tenant-001';

-- 13. CRIAÇÃO DE FATURAMENTO
-- =====================================================

INSERT INTO "faturamentos" (
    "id", "tenant_id", "paciente_id", "profissional_id", "agendamento_id", "prontuario_id",
    "tipo", "valor", "desconto", "valorFinal", "valor_pago", "formaPagamento",
    "status", "data_vencimento", "data_pagamento", "observacoes", "createdAt", "updatedAt"
)
SELECT 
    gen_random_uuid(),
    'tenant-001',
    a."paciente_id",
    a."profissional_id",
    a.id,
    pr.id,
    a.tipo::text::"TipoFaturamento",
    CASE WHEN a.tipo = 'CONSULTA'::"TipoAgendamento" THEN 150.00 ELSE 100.00 END,
    0.00,
    CASE WHEN a.tipo = 'CONSULTA'::"TipoAgendamento" THEN 150.00 ELSE 100.00 END,
    CASE WHEN RANDOM() > 0.3 THEN 0.00 ELSE CASE WHEN a.tipo = 'CONSULTA'::"TipoAgendamento" THEN 150.00 ELSE 100.00 END END,
    'PIX'::"FormaPagamento",
    CASE WHEN RANDOM() > 0.3 THEN 'PENDENTE'::"StatusFaturamento" ELSE 'PAGO'::"StatusFaturamento" END,
    (a.data + INTERVAL '10 days'),
    CASE WHEN RANDOM() > 0.3 THEN NULL ELSE (a.data + INTERVAL '2 days') END,
    CONCAT('Faturamento para ', LOWER(a.tipo::text), ' de ', p.nome),
    NOW(),
    NOW()
FROM "agendamentos" a
JOIN "pacientes" p ON p.id = a."paciente_id"
LEFT JOIN "prontuarios" pr ON pr."paciente_id" = a."paciente_id" AND pr.data = a.data
WHERE a."tenant_id" = 'tenant-001';

-- 14. CRIAÇÃO DE FATURAS DA CLÍNICA
-- =====================================================

INSERT INTO "faturas_clinica" (
    "id", "tenant_id", "numero_fatura", "valor", "data_vencimento", "status", "dias_atraso",
    "nivel_bloqueio", "observacoes", "createdAt", "updatedAt"
) VALUES 
(
    gen_random_uuid(),
    'tenant-001',
    'FAT-2024-001',
    550.00,
    (CURRENT_DATE + INTERVAL '45 days'),
    'PENDENTE'::"StatusFatura",
    0,
    'NOTIFICACAO'::"NivelBloqueio",
    'Fatura mensal - janeiro 2024',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'FAT-2024-002',
    600.00,
    (CURRENT_DATE + INTERVAL '75 days'),
    'PENDENTE'::"StatusFatura",
    0,
    'NOTIFICACAO'::"NivelBloqueio",
    'Fatura mensal - fevereiro 2024',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'FAT-2024-003',
    650.00,
    (CURRENT_DATE + INTERVAL '105 days'),
    'PENDENTE'::"StatusFatura",
    0,
    'NOTIFICACAO'::"NivelBloqueio",
    'Fatura mensal - março 2024',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'FAT-2024-004',
    700.00,
    (CURRENT_DATE - INTERVAL '15 days'),
    'PAGO'::"StatusFatura",
    0,
    'SEM_BLOQUEIO'::"NivelBloqueio",
    'Fatura mensal - dezembro 2023',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'FAT-2024-005',
    750.00,
    (CURRENT_DATE - INTERVAL '45 days'),
    'PAGO'::"StatusFatura",
    0,
    'SEM_BLOQUEIO'::"NivelBloqueio",
    'Fatura mensal - novembro 2023',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'tenant-001',
    'FAT-2024-006',
    800.00,
    (CURRENT_DATE - INTERVAL '75 days'),
    'PAGO'::"StatusFatura",
    0,
    'SEM_BLOQUEIO'::"NivelBloqueio",
    'Fatura mensal - outubro 2023',
    NOW(),
    NOW()
);

-- 15. CRIAÇÃO DE TEMPLATE DE ESPECIALIDADE
-- =====================================================

INSERT INTO "template_especialidades" (
    "id", "tenant_id", "nome", "descricao", "tipo_clinica", "categoria", "campos",
    "validacoes", "ativo", "ordem", "createdAt", "updatedAt"
) VALUES (
    gen_random_uuid(),
    'tenant-001',
    'Template Anamnese Clínico Geral',
    'Template padrão para anamnese de clínico geral',
    'MEDICA'::"TipoClinica",
    'ANAMNESE'::"CategoriaCampo",
    '{
        "queixaPrincipal": {"tipo": "TEXTO", "obrigatorio": true},
        "historiaAtual": {"tipo": "TEXTAREA", "obrigatorio": true},
        "antecedentesPatologicos": {"tipo": "TEXTAREA", "obrigatorio": false},
        "medicamentosEmUso": {"tipo": "TEXTAREA", "obrigatorio": false},
        "habitos": {"tipo": "TEXTAREA", "obrigatorio": false},
        "antecedentesFamiliares": {"tipo": "TEXTAREA", "obrigatorio": false},
        "exameFisico": {"tipo": "TEXTAREA", "obrigatorio": true}
    }',
    '{}',
    true,
    1,
    NOW(),
    NOW()
);

-- 16. CRIAÇÃO DE CONFIGURAÇÃO WHATSAPP
-- =====================================================

INSERT INTO "clinica_whatsapp_config" (
    "id", "tenant_id", "z_api_instance_id", "z_api_token", "numero_whatsapp", "mensagens_ativas",
    "horario_envio_lembrete", "dias_antecedencia_lembrete", "ativo", "createdAt", "updatedAt"
) VALUES (
    gen_random_uuid(),
    'tenant-001',
    'instance-001',
    'token-exemplo',
    '5511999999999',
    '{
        "lembreteConsulta": true,
        "confirmacaoConsulta": true,
        "cancelamentoConsulta": true
    }',
    '08:00',
    1,
    true,
    NOW(),
    NOW()
);

-- 17. CRIAÇÃO DE CHAT
-- =====================================================

INSERT INTO "chats" (
    "id", "tenant_id", "tipo", "nome", "descricao", "criado_por", "ativo", "createdAt", "updatedAt"
) VALUES (
    gen_random_uuid(),
    'tenant-001',
    'GERAL'::"TipoChat",
    'Chat Geral da Clínica',
    'Chat para comunicação geral da equipe',
    (SELECT id FROM "usuarios" WHERE email = 'admin@clinica.com' LIMIT 1),
    true,
    NOW(),
    NOW()
);

-- 18. ADICIONAR PARTICIPANTES AO CHAT
-- =====================================================

INSERT INTO "chat_participantes" (
    "id", "chat_id", "user_id", "tenant_id", "admin", "ativo", "createdAt", "updatedAt"
)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM "chats" WHERE "tenant_id" = 'tenant-001' LIMIT 1),
    u.id,
    'tenant-001',
    (u.role = 'ADMIN'::"RoleUsuario"),
    true,
    NOW(),
    NOW()
FROM "usuarios" u WHERE u."tenant_id" = 'tenant-001';

-- =====================================================
-- FIM DO SCRIPT - DADOS POPULADOS COM SUCESSO!
-- =====================================================

-- Verificação dos dados criados
SELECT 'Clínica' as tipo, COUNT(*) as quantidade FROM "clinicas" WHERE "tenant_id" = 'tenant-001'
UNION ALL
SELECT 'Especialidades', COUNT(*) FROM "especialidades" WHERE "tenant_id" = 'tenant-001'
UNION ALL
SELECT 'Profissionais', COUNT(*) FROM "profissionais" WHERE "tenant_id" = 'tenant-001'
UNION ALL
SELECT 'Usuários', COUNT(*) FROM "usuarios" WHERE "tenant_id" = 'tenant-001'
UNION ALL
SELECT 'Pacientes', COUNT(*) FROM "pacientes" WHERE "tenant_id" = 'tenant-001'
UNION ALL
SELECT 'Agendamentos', COUNT(*) FROM "agendamentos" WHERE "tenant_id" = 'tenant-001'
UNION ALL
SELECT 'Prontuários', COUNT(*) FROM "prontuarios" WHERE "tenant_id" = 'tenant-001'
UNION ALL
SELECT 'Anamneses', COUNT(*) FROM "anamneses" WHERE "tenant_id" = 'tenant-001'
UNION ALL
SELECT 'Exames', COUNT(*) FROM "exames" WHERE "tenant_id" = 'tenant-001'
UNION ALL
SELECT 'Faturamento', COUNT(*) FROM "faturamentos" WHERE "tenant_id" = 'tenant-001'
UNION ALL
SELECT 'Faturas Clínica', COUNT(*) FROM "faturas_clinica" WHERE "tenant_id" = 'tenant-001'; 
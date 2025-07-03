/*
  Warnings:

  - You are about to drop the `Agendamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Anamnese` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Especialidade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mensagem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Paciente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profissional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prontuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoClinica" AS ENUM ('MEDICA', 'ODONTOLOGICA', 'NUTRICIONAL', 'PSICOLOGICA', 'FISIOTERAPICA', 'ESTETICA', 'VETERINARIA', 'EDUCACIONAL', 'CORPORATIVA', 'PERSONALIZADA');

-- CreateEnum
CREATE TYPE "TipoCampo" AS ENUM ('TEXTO', 'NUMERO', 'DATA', 'SELECT', 'MULTISELECT', 'TEXTAREA', 'BOOLEANO', 'EMAIL', 'TELEFONE', 'CEP', 'CPF', 'CNPJ', 'MOEDA', 'PERCENTUAL', 'COR', 'ARQUIVO', 'IMAGEM', 'ASSINATURA', 'GEOLOCALIZACAO');

-- CreateEnum
CREATE TYPE "CategoriaCampo" AS ENUM ('PACIENTE', 'PROFISSIONAL', 'ANAMNESE', 'PRONTUARIO', 'AGENDAMENTO', 'FINANCEIRO', 'RELATORIO');

-- CreateEnum
CREATE TYPE "StatusFatura" AS ENUM ('PENDENTE', 'PAGO', 'PARCIAL', 'VENCIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "NivelBloqueio" AS ENUM ('SEM_BLOQUEIO', 'NOTIFICACAO', 'AVISO_TOPO', 'RESTRICAO_FUNCIONALIDADES', 'BLOQUEIO_TOTAL');

-- CreateEnum
CREATE TYPE "FormaPagamentoClinica" AS ENUM ('PIX', 'BOLETO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'TRANSFERENCIA', 'DINHEIRO');

-- CreateEnum
CREATE TYPE "TipoLembrete" AS ENUM ('NOTIFICACAO_3_DIAS', 'AVISO_5_DIAS', 'RESTRICAO_7_DIAS', 'BLOQUEIO_10_DIAS', 'PERSONALIZADO');

-- CreateEnum
CREATE TYPE "StatusLembrete" AS ENUM ('ENVIADO', 'ENTREGUE', 'LIDO', 'FALHA');

-- AlterEnum
ALTER TYPE "RoleUsuario" ADD VALUE 'SUPER_ADMIN';

-- AlterEnum
ALTER TYPE "StatusAgendamento" ADD VALUE 'REMARCADO';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TipoAgendamento" ADD VALUE 'SESSAO_TERAPIA';
ALTER TYPE "TipoAgendamento" ADD VALUE 'AVALIACAO_PSICOLOGICA';
ALTER TYPE "TipoAgendamento" ADD VALUE 'AVALIACAO_FISICA';
ALTER TYPE "TipoAgendamento" ADD VALUE 'SESSAO_FISIOTERAPIA';
ALTER TYPE "TipoAgendamento" ADD VALUE 'PROCEDIMENTO_ODONTOLOGICO';
ALTER TYPE "TipoAgendamento" ADD VALUE 'LIMPEZA';
ALTER TYPE "TipoAgendamento" ADD VALUE 'EXTRACAO';
ALTER TYPE "TipoAgendamento" ADD VALUE 'PROCEDIMENTO_ESTETICO';
ALTER TYPE "TipoAgendamento" ADD VALUE 'CONSULTA_ESTETICA';
ALTER TYPE "TipoAgendamento" ADD VALUE 'VACINA';
ALTER TYPE "TipoAgendamento" ADD VALUE 'CIRURGIA';
ALTER TYPE "TipoAgendamento" ADD VALUE 'CONSULTA_VETERINARIA';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TipoProntuario" ADD VALUE 'AVALIACAO';
ALTER TYPE "TipoProntuario" ADD VALUE 'SESSAO';
ALTER TYPE "TipoProntuario" ADD VALUE 'RELATORIO';
ALTER TYPE "TipoProntuario" ADD VALUE 'EVOLUCAO';
ALTER TYPE "TipoProntuario" ADD VALUE 'PRESCRICAO';

-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "Anamnese" DROP CONSTRAINT "Anamnese_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "Anamnese" DROP CONSTRAINT "Anamnese_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "Anamnese" DROP CONSTRAINT "Anamnese_prontuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Exame" DROP CONSTRAINT "Exame_prontuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Paciente" DROP CONSTRAINT "Paciente_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "Profissional" DROP CONSTRAINT "Profissional_especialidadeId_fkey";

-- DropForeignKey
ALTER TABLE "Prontuario" DROP CONSTRAINT "Prontuario_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "Prontuario" DROP CONSTRAINT "Prontuario_profissionalId_fkey";

-- DropTable
DROP TABLE "Agendamento";

-- DropTable
DROP TABLE "Anamnese";

-- DropTable
DROP TABLE "Especialidade";

-- DropTable
DROP TABLE "Exame";

-- DropTable
DROP TABLE "Mensagem";

-- DropTable
DROP TABLE "Paciente";

-- DropTable
DROP TABLE "Profissional";

-- DropTable
DROP TABLE "Prontuario";

-- DropTable
DROP TABLE "Usuario";

-- CreateTable
CREATE TABLE "clinicas" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoClinica" NOT NULL,
    "logo" TEXT,
    "corPrimaria" TEXT NOT NULL DEFAULT '#2563eb',
    "corSecundaria" TEXT NOT NULL DEFAULT '#1e40af',
    "tema" TEXT NOT NULL DEFAULT 'light',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinica_whatsapp_config" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "z_api_instance_id" TEXT NOT NULL,
    "z_api_token" TEXT NOT NULL,
    "numero_whatsapp" TEXT NOT NULL,
    "mensagens_ativas" JSONB NOT NULL,
    "horario_envio_lembrete" TEXT NOT NULL,
    "dias_antecedencia_lembrete" INTEGER NOT NULL DEFAULT 1,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinica_whatsapp_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_templates" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "variaveis" TEXT[],
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "RoleUsuario" NOT NULL,
    "profissional_id" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "especialidades" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo_clinica" "TipoClinica" NOT NULL,
    "configuracoes" JSONB NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "especialidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profissionais" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "especialidade_id" TEXT NOT NULL,
    "registro" TEXT NOT NULL,
    "crm" TEXT,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "data_contratacao" TIMESTAMP(3) NOT NULL,
    "status" "ProfissionalStatus" NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" CHAR(2) NOT NULL,
    "cep" TEXT NOT NULL,
    "horario_inicio" TEXT NOT NULL,
    "horario_fim" TEXT NOT NULL,
    "intervalo" TEXT NOT NULL,
    "dias_trabalho" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profissionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" CHAR(2) NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'Brasil',
    "convenio_nome" TEXT,
    "convenio_numero" TEXT,
    "convenio_plano" TEXT,
    "convenio_validade" TIMESTAMP(3),
    "profissional_id" TEXT NOT NULL,
    "campos_personalizados" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamentos" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "profissional_id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "hora_inicio" TEXT NOT NULL,
    "hora_fim" TEXT NOT NULL,
    "tipo" "TipoAgendamento" NOT NULL,
    "status" "StatusAgendamento" NOT NULL,
    "observacoes" TEXT,
    "campos_personalizados" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prontuarios" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "profissional_id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoProntuario" NOT NULL,
    "descricao" TEXT NOT NULL,
    "diagnostico" TEXT,
    "prescricao" TEXT,
    "observacoes" TEXT,
    "campos_personalizados" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prontuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anamneses" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "profissional_id" TEXT NOT NULL,
    "prontuario_id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "template_id" TEXT NOT NULL,
    "campos" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anamneses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exames" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "prontuario_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "resultado" TEXT NOT NULL,
    "observacoes" TEXT,
    "arquivos" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_especialidades" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo_clinica" "TipoClinica" NOT NULL,
    "categoria" "CategoriaCampo" NOT NULL,
    "campos" JSONB NOT NULL,
    "validacoes" JSONB NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_especialidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campos_personalizados" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoCampo" NOT NULL,
    "categoria" "CategoriaCampo" NOT NULL,
    "obrigatorio" BOOLEAN NOT NULL DEFAULT false,
    "opcoes" TEXT[],
    "valor_padrao" TEXT,
    "validacoes" JSONB NOT NULL,
    "dependencias" TEXT[],
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "template_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campos_personalizados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fluxos_especialidades" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo_clinica" "TipoClinica" NOT NULL,
    "etapas" JSONB NOT NULL,
    "validacoes" JSONB NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fluxos_especialidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorios_especialidades" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo_clinica" "TipoClinica" NOT NULL,
    "tipo" TEXT NOT NULL,
    "parametros" JSONB NOT NULL,
    "template" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relatorios_especialidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboards_especialidades" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo_clinica" "TipoClinica" NOT NULL,
    "widgets" JSONB NOT NULL,
    "layout" JSONB NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboards_especialidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagens" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "sender_name" TEXT NOT NULL,
    "sender_role" "RoleUsuario" NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faturas_clinica" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "numero_fatura" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "data_pagamento" TIMESTAMP(3),
    "status" "StatusFatura" NOT NULL DEFAULT 'PENDENTE',
    "dias_atraso" INTEGER NOT NULL DEFAULT 0,
    "nivel_bloqueio" "NivelBloqueio" NOT NULL DEFAULT 'SEM_BLOQUEIO',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faturas_clinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos_clinica" (
    "id" TEXT NOT NULL,
    "fatura_id" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "forma_pagamento" "FormaPagamentoClinica" NOT NULL,
    "data_pagamento" TIMESTAMP(3) NOT NULL,
    "comprovante" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentos_clinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lembretes_clinica" (
    "id" TEXT NOT NULL,
    "fatura_id" TEXT NOT NULL,
    "tipo" "TipoLembrete" NOT NULL,
    "mensagem" TEXT NOT NULL,
    "data_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_envio" "StatusLembrete" NOT NULL DEFAULT 'ENVIADO',
    "destinatario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lembretes_clinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_bloqueios" (
    "id" TEXT NOT NULL,
    "fatura_id" TEXT NOT NULL,
    "nivel_anterior" "NivelBloqueio" NOT NULL,
    "nivel_novo" "NivelBloqueio" NOT NULL,
    "motivo" TEXT NOT NULL,
    "aplicado_por" TEXT NOT NULL,
    "data_aplicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_bloqueios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clinicas_tenant_id_key" ON "clinicas"("tenant_id");

-- CreateIndex
CREATE INDEX "clinicas_tenant_id_idx" ON "clinicas"("tenant_id");

-- CreateIndex
CREATE INDEX "clinicas_tipo_idx" ON "clinicas"("tipo");

-- CreateIndex
CREATE INDEX "clinicas_ativo_idx" ON "clinicas"("ativo");

-- CreateIndex
CREATE UNIQUE INDEX "clinica_whatsapp_config_tenant_id_key" ON "clinica_whatsapp_config"("tenant_id");

-- CreateIndex
CREATE INDEX "message_templates_tenant_id_idx" ON "message_templates"("tenant_id");

-- CreateIndex
CREATE INDEX "message_templates_tipo_idx" ON "message_templates"("tipo");

-- CreateIndex
CREATE INDEX "message_templates_ativo_idx" ON "message_templates"("ativo");

-- CreateIndex
CREATE INDEX "usuarios_tenant_id_idx" ON "usuarios"("tenant_id");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_role_idx" ON "usuarios"("role");

-- CreateIndex
CREATE INDEX "usuarios_ativo_idx" ON "usuarios"("ativo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_tenant_id_email_key" ON "usuarios"("tenant_id", "email");

-- CreateIndex
CREATE INDEX "especialidades_tenant_id_idx" ON "especialidades"("tenant_id");

-- CreateIndex
CREATE INDEX "especialidades_tipo_clinica_idx" ON "especialidades"("tipo_clinica");

-- CreateIndex
CREATE INDEX "especialidades_ativo_idx" ON "especialidades"("ativo");

-- CreateIndex
CREATE UNIQUE INDEX "especialidades_tenant_id_nome_key" ON "especialidades"("tenant_id", "nome");

-- CreateIndex
CREATE INDEX "profissionais_tenant_id_idx" ON "profissionais"("tenant_id");

-- CreateIndex
CREATE INDEX "profissionais_especialidade_id_idx" ON "profissionais"("especialidade_id");

-- CreateIndex
CREATE INDEX "profissionais_status_idx" ON "profissionais"("status");

-- CreateIndex
CREATE INDEX "profissionais_email_idx" ON "profissionais"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profissionais_tenant_id_email_key" ON "profissionais"("tenant_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "profissionais_tenant_id_crm_key" ON "profissionais"("tenant_id", "crm");

-- CreateIndex
CREATE INDEX "pacientes_tenant_id_idx" ON "pacientes"("tenant_id");

-- CreateIndex
CREATE INDEX "pacientes_profissional_id_idx" ON "pacientes"("profissional_id");

-- CreateIndex
CREATE INDEX "pacientes_cpf_idx" ON "pacientes"("cpf");

-- CreateIndex
CREATE INDEX "pacientes_email_idx" ON "pacientes"("email");

-- CreateIndex
CREATE INDEX "pacientes_nome_idx" ON "pacientes"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_tenant_id_cpf_key" ON "pacientes"("tenant_id", "cpf");

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_tenant_id_email_key" ON "pacientes"("tenant_id", "email");

-- CreateIndex
CREATE INDEX "agendamentos_tenant_id_idx" ON "agendamentos"("tenant_id");

-- CreateIndex
CREATE INDEX "agendamentos_paciente_id_idx" ON "agendamentos"("paciente_id");

-- CreateIndex
CREATE INDEX "agendamentos_profissional_id_idx" ON "agendamentos"("profissional_id");

-- CreateIndex
CREATE INDEX "agendamentos_data_idx" ON "agendamentos"("data");

-- CreateIndex
CREATE INDEX "agendamentos_status_idx" ON "agendamentos"("status");

-- CreateIndex
CREATE INDEX "agendamentos_tipo_idx" ON "agendamentos"("tipo");

-- CreateIndex
CREATE INDEX "agendamentos_tenant_id_data_idx" ON "agendamentos"("tenant_id", "data");

-- CreateIndex
CREATE INDEX "agendamentos_tenant_id_profissional_id_data_idx" ON "agendamentos"("tenant_id", "profissional_id", "data");

-- CreateIndex
CREATE INDEX "prontuarios_tenant_id_idx" ON "prontuarios"("tenant_id");

-- CreateIndex
CREATE INDEX "prontuarios_paciente_id_idx" ON "prontuarios"("paciente_id");

-- CreateIndex
CREATE INDEX "prontuarios_profissional_id_idx" ON "prontuarios"("profissional_id");

-- CreateIndex
CREATE INDEX "prontuarios_data_idx" ON "prontuarios"("data");

-- CreateIndex
CREATE INDEX "prontuarios_tipo_idx" ON "prontuarios"("tipo");

-- CreateIndex
CREATE INDEX "prontuarios_tenant_id_paciente_id_idx" ON "prontuarios"("tenant_id", "paciente_id");

-- CreateIndex
CREATE UNIQUE INDEX "anamneses_prontuario_id_key" ON "anamneses"("prontuario_id");

-- CreateIndex
CREATE INDEX "anamneses_tenant_id_idx" ON "anamneses"("tenant_id");

-- CreateIndex
CREATE INDEX "anamneses_paciente_id_idx" ON "anamneses"("paciente_id");

-- CreateIndex
CREATE INDEX "anamneses_profissional_id_idx" ON "anamneses"("profissional_id");

-- CreateIndex
CREATE INDEX "anamneses_template_id_idx" ON "anamneses"("template_id");

-- CreateIndex
CREATE INDEX "anamneses_data_idx" ON "anamneses"("data");

-- CreateIndex
CREATE INDEX "exames_tenant_id_idx" ON "exames"("tenant_id");

-- CreateIndex
CREATE INDEX "exames_prontuario_id_idx" ON "exames"("prontuario_id");

-- CreateIndex
CREATE INDEX "exames_tipo_idx" ON "exames"("tipo");

-- CreateIndex
CREATE INDEX "exames_data_idx" ON "exames"("data");

-- CreateIndex
CREATE INDEX "template_especialidades_tenant_id_idx" ON "template_especialidades"("tenant_id");

-- CreateIndex
CREATE INDEX "template_especialidades_tipo_clinica_idx" ON "template_especialidades"("tipo_clinica");

-- CreateIndex
CREATE INDEX "template_especialidades_categoria_idx" ON "template_especialidades"("categoria");

-- CreateIndex
CREATE INDEX "template_especialidades_ativo_idx" ON "template_especialidades"("ativo");

-- CreateIndex
CREATE UNIQUE INDEX "template_especialidades_tenant_id_nome_key" ON "template_especialidades"("tenant_id", "nome");

-- CreateIndex
CREATE INDEX "campos_personalizados_tenant_id_idx" ON "campos_personalizados"("tenant_id");

-- CreateIndex
CREATE INDEX "campos_personalizados_categoria_idx" ON "campos_personalizados"("categoria");

-- CreateIndex
CREATE INDEX "campos_personalizados_tipo_idx" ON "campos_personalizados"("tipo");

-- CreateIndex
CREATE INDEX "campos_personalizados_ativo_idx" ON "campos_personalizados"("ativo");

-- CreateIndex
CREATE UNIQUE INDEX "campos_personalizados_tenant_id_nome_key" ON "campos_personalizados"("tenant_id", "nome");

-- CreateIndex
CREATE INDEX "fluxos_especialidades_tenant_id_idx" ON "fluxos_especialidades"("tenant_id");

-- CreateIndex
CREATE INDEX "fluxos_especialidades_tipo_clinica_idx" ON "fluxos_especialidades"("tipo_clinica");

-- CreateIndex
CREATE INDEX "fluxos_especialidades_ativo_idx" ON "fluxos_especialidades"("ativo");

-- CreateIndex
CREATE UNIQUE INDEX "fluxos_especialidades_tenant_id_nome_key" ON "fluxos_especialidades"("tenant_id", "nome");

-- CreateIndex
CREATE INDEX "relatorios_especialidades_tenant_id_idx" ON "relatorios_especialidades"("tenant_id");

-- CreateIndex
CREATE INDEX "relatorios_especialidades_tipo_clinica_idx" ON "relatorios_especialidades"("tipo_clinica");

-- CreateIndex
CREATE INDEX "relatorios_especialidades_tipo_idx" ON "relatorios_especialidades"("tipo");

-- CreateIndex
CREATE INDEX "relatorios_especialidades_ativo_idx" ON "relatorios_especialidades"("ativo");

-- CreateIndex
CREATE UNIQUE INDEX "relatorios_especialidades_tenant_id_nome_key" ON "relatorios_especialidades"("tenant_id", "nome");

-- CreateIndex
CREATE INDEX "dashboards_especialidades_tenant_id_idx" ON "dashboards_especialidades"("tenant_id");

-- CreateIndex
CREATE INDEX "dashboards_especialidades_tipo_clinica_idx" ON "dashboards_especialidades"("tipo_clinica");

-- CreateIndex
CREATE INDEX "dashboards_especialidades_ativo_idx" ON "dashboards_especialidades"("ativo");

-- CreateIndex
CREATE UNIQUE INDEX "dashboards_especialidades_tenant_id_nome_key" ON "dashboards_especialidades"("tenant_id", "nome");

-- CreateIndex
CREATE INDEX "mensagens_tenant_id_idx" ON "mensagens"("tenant_id");

-- CreateIndex
CREATE INDEX "mensagens_sender_id_idx" ON "mensagens"("sender_id");

-- CreateIndex
CREATE INDEX "mensagens_timestamp_idx" ON "mensagens"("timestamp");

-- CreateIndex
CREATE INDEX "mensagens_tenant_id_timestamp_idx" ON "mensagens"("tenant_id", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "faturas_clinica_numero_fatura_key" ON "faturas_clinica"("numero_fatura");

-- CreateIndex
CREATE INDEX "faturas_clinica_tenant_id_idx" ON "faturas_clinica"("tenant_id");

-- CreateIndex
CREATE INDEX "faturas_clinica_status_idx" ON "faturas_clinica"("status");

-- CreateIndex
CREATE INDEX "faturas_clinica_data_vencimento_idx" ON "faturas_clinica"("data_vencimento");

-- CreateIndex
CREATE INDEX "faturas_clinica_dias_atraso_idx" ON "faturas_clinica"("dias_atraso");

-- CreateIndex
CREATE INDEX "faturas_clinica_nivel_bloqueio_idx" ON "faturas_clinica"("nivel_bloqueio");

-- CreateIndex
CREATE INDEX "pagamentos_clinica_fatura_id_idx" ON "pagamentos_clinica"("fatura_id");

-- CreateIndex
CREATE INDEX "pagamentos_clinica_data_pagamento_idx" ON "pagamentos_clinica"("data_pagamento");

-- CreateIndex
CREATE INDEX "lembretes_clinica_fatura_id_idx" ON "lembretes_clinica"("fatura_id");

-- CreateIndex
CREATE INDEX "lembretes_clinica_tipo_idx" ON "lembretes_clinica"("tipo");

-- CreateIndex
CREATE INDEX "lembretes_clinica_data_envio_idx" ON "lembretes_clinica"("data_envio");

-- CreateIndex
CREATE INDEX "historico_bloqueios_fatura_id_idx" ON "historico_bloqueios"("fatura_id");

-- CreateIndex
CREATE INDEX "historico_bloqueios_data_aplicacao_idx" ON "historico_bloqueios"("data_aplicacao");

-- AddForeignKey
ALTER TABLE "clinica_whatsapp_config" ADD CONSTRAINT "clinica_whatsapp_config_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_templates" ADD CONSTRAINT "message_templates_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinica_whatsapp_config"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "especialidades" ADD CONSTRAINT "especialidades_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profissionais" ADD CONSTRAINT "profissionais_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profissionais" ADD CONSTRAINT "profissionais_especialidade_id_fkey" FOREIGN KEY ("especialidade_id") REFERENCES "especialidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prontuarios" ADD CONSTRAINT "prontuarios_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prontuarios" ADD CONSTRAINT "prontuarios_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prontuarios" ADD CONSTRAINT "prontuarios_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anamneses" ADD CONSTRAINT "anamneses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anamneses" ADD CONSTRAINT "anamneses_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anamneses" ADD CONSTRAINT "anamneses_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anamneses" ADD CONSTRAINT "anamneses_prontuario_id_fkey" FOREIGN KEY ("prontuario_id") REFERENCES "prontuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exames" ADD CONSTRAINT "exames_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exames" ADD CONSTRAINT "exames_prontuario_id_fkey" FOREIGN KEY ("prontuario_id") REFERENCES "prontuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_especialidades" ADD CONSTRAINT "template_especialidades_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campos_personalizados" ADD CONSTRAINT "campos_personalizados_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fluxos_especialidades" ADD CONSTRAINT "fluxos_especialidades_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios_especialidades" ADD CONSTRAINT "relatorios_especialidades_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboards_especialidades" ADD CONSTRAINT "dashboards_especialidades_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faturas_clinica" ADD CONSTRAINT "faturas_clinica_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos_clinica" ADD CONSTRAINT "pagamentos_clinica_fatura_id_fkey" FOREIGN KEY ("fatura_id") REFERENCES "faturas_clinica"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lembretes_clinica" ADD CONSTRAINT "lembretes_clinica_fatura_id_fkey" FOREIGN KEY ("fatura_id") REFERENCES "faturas_clinica"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_bloqueios" ADD CONSTRAINT "historico_bloqueios_fatura_id_fkey" FOREIGN KEY ("fatura_id") REFERENCES "faturas_clinica"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `chat_id` to the `mensagens` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoChat" AS ENUM ('GERAL', 'PRIVADO', 'GRUPO');

-- CreateEnum
CREATE TYPE "StatusLeitura" AS ENUM ('NAO_LIDA', 'LIDA', 'ENTREGUE');

-- CreateEnum
CREATE TYPE "TipoArquivo" AS ENUM ('IMAGEM', 'DOCUMENTO', 'AUDIO', 'VIDEO', 'OUTRO');

-- AlterTable
ALTER TABLE "mensagens" ADD COLUMN     "chat_id" TEXT NOT NULL,
ADD COLUMN     "editada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "editada_em" TIMESTAMP(3),
ADD COLUMN     "usuarioId" TEXT;

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "tipo" "TipoChat" NOT NULL,
    "nome" TEXT,
    "descricao" TEXT,
    "criado_por" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_participantes" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_participantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leituras_mensagens" (
    "id" TEXT NOT NULL,
    "mensagem_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "status" "StatusLeitura" NOT NULL,
    "lida_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatParticipanteId" TEXT,

    CONSTRAINT "leituras_mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arquivos_chat" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nome_original" TEXT NOT NULL,
    "tipo" "TipoArquivo" NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "uploadado_por" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arquivos_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arquivos_mensagens" (
    "id" TEXT NOT NULL,
    "mensagem_id" TEXT NOT NULL,
    "arquivo_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arquivos_mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mensagem_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "corpo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "enviada" BOOLEAN NOT NULL DEFAULT false,
    "enviada_em" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chats_tenant_id_idx" ON "chats"("tenant_id");

-- CreateIndex
CREATE INDEX "chats_tipo_idx" ON "chats"("tipo");

-- CreateIndex
CREATE INDEX "chats_ativo_idx" ON "chats"("ativo");

-- CreateIndex
CREATE INDEX "chat_participantes_chat_id_idx" ON "chat_participantes"("chat_id");

-- CreateIndex
CREATE INDEX "chat_participantes_user_id_idx" ON "chat_participantes"("user_id");

-- CreateIndex
CREATE INDEX "chat_participantes_tenant_id_idx" ON "chat_participantes"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_participantes_chat_id_user_id_key" ON "chat_participantes"("chat_id", "user_id");

-- CreateIndex
CREATE INDEX "leituras_mensagens_mensagem_id_idx" ON "leituras_mensagens"("mensagem_id");

-- CreateIndex
CREATE INDEX "leituras_mensagens_user_id_idx" ON "leituras_mensagens"("user_id");

-- CreateIndex
CREATE INDEX "leituras_mensagens_tenant_id_idx" ON "leituras_mensagens"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "leituras_mensagens_mensagem_id_user_id_key" ON "leituras_mensagens"("mensagem_id", "user_id");

-- CreateIndex
CREATE INDEX "arquivos_chat_tenant_id_idx" ON "arquivos_chat"("tenant_id");

-- CreateIndex
CREATE INDEX "arquivos_chat_chat_id_idx" ON "arquivos_chat"("chat_id");

-- CreateIndex
CREATE INDEX "arquivos_chat_uploadado_por_idx" ON "arquivos_chat"("uploadado_por");

-- CreateIndex
CREATE INDEX "arquivos_mensagens_mensagem_id_idx" ON "arquivos_mensagens"("mensagem_id");

-- CreateIndex
CREATE INDEX "arquivos_mensagens_arquivo_id_idx" ON "arquivos_mensagens"("arquivo_id");

-- CreateIndex
CREATE UNIQUE INDEX "arquivos_mensagens_mensagem_id_arquivo_id_key" ON "arquivos_mensagens"("mensagem_id", "arquivo_id");

-- CreateIndex
CREATE INDEX "notificacoes_tenant_id_idx" ON "notificacoes"("tenant_id");

-- CreateIndex
CREATE INDEX "notificacoes_user_id_idx" ON "notificacoes"("user_id");

-- CreateIndex
CREATE INDEX "notificacoes_mensagem_id_idx" ON "notificacoes"("mensagem_id");

-- CreateIndex
CREATE INDEX "notificacoes_lida_idx" ON "notificacoes"("lida");

-- CreateIndex
CREATE INDEX "notificacoes_enviada_idx" ON "notificacoes"("enviada");

-- CreateIndex
CREATE INDEX "mensagens_chat_id_idx" ON "mensagens"("chat_id");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participantes" ADD CONSTRAINT "chat_participantes_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participantes" ADD CONSTRAINT "chat_participantes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participantes" ADD CONSTRAINT "chat_participantes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leituras_mensagens" ADD CONSTRAINT "leituras_mensagens_mensagem_id_fkey" FOREIGN KEY ("mensagem_id") REFERENCES "mensagens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leituras_mensagens" ADD CONSTRAINT "leituras_mensagens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leituras_mensagens" ADD CONSTRAINT "leituras_mensagens_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leituras_mensagens" ADD CONSTRAINT "leituras_mensagens_chatParticipanteId_fkey" FOREIGN KEY ("chatParticipanteId") REFERENCES "chat_participantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos_chat" ADD CONSTRAINT "arquivos_chat_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos_chat" ADD CONSTRAINT "arquivos_chat_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos_chat" ADD CONSTRAINT "arquivos_chat_uploadado_por_fkey" FOREIGN KEY ("uploadado_por") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos_mensagens" ADD CONSTRAINT "arquivos_mensagens_mensagem_id_fkey" FOREIGN KEY ("mensagem_id") REFERENCES "mensagens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos_mensagens" ADD CONSTRAINT "arquivos_mensagens_arquivo_id_fkey" FOREIGN KEY ("arquivo_id") REFERENCES "arquivos_chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_mensagem_id_fkey" FOREIGN KEY ("mensagem_id") REFERENCES "mensagens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

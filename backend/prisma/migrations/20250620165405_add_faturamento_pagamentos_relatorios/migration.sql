-- CreateEnum
CREATE TYPE "TipoFaturamento" AS ENUM ('CONSULTA', 'RETORNO', 'EXAME', 'PROCEDIMENTO', 'MEDICAMENTO', 'MATERIAL', 'OUTROS');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO', 'TRANSFERENCIA', 'CHEQUE', 'OUTROS');

-- CreateEnum
CREATE TYPE "StatusFaturamento" AS ENUM ('PENDENTE', 'PAGO', 'PARCIAL', 'VENCIDO', 'CANCELADO');

-- CreateTable
CREATE TABLE "faturamentos" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "profissional_id" TEXT NOT NULL,
    "agendamento_id" TEXT,
    "prontuario_id" TEXT,
    "tipo" "TipoFaturamento" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "desconto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorFinal" DECIMAL(10,2) NOT NULL,
    "valor_pago" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "status" "StatusFaturamento" NOT NULL DEFAULT 'PENDENTE',
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "data_pagamento" TIMESTAMP(3),
    "observacoes" TEXT,
    "campos_personalizados" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faturamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "faturamento_id" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "forma_pagamento" "FormaPagamento" NOT NULL,
    "data_pagamento" TIMESTAMP(3) NOT NULL,
    "comprovante" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "faturamentos_tenant_id_idx" ON "faturamentos"("tenant_id");

-- CreateIndex
CREATE INDEX "faturamentos_paciente_id_idx" ON "faturamentos"("paciente_id");

-- CreateIndex
CREATE INDEX "faturamentos_profissional_id_idx" ON "faturamentos"("profissional_id");

-- CreateIndex
CREATE INDEX "faturamentos_agendamento_id_idx" ON "faturamentos"("agendamento_id");

-- CreateIndex
CREATE INDEX "faturamentos_prontuario_id_idx" ON "faturamentos"("prontuario_id");

-- CreateIndex
CREATE INDEX "faturamentos_tipo_idx" ON "faturamentos"("tipo");

-- CreateIndex
CREATE INDEX "faturamentos_status_idx" ON "faturamentos"("status");

-- CreateIndex
CREATE INDEX "faturamentos_data_vencimento_idx" ON "faturamentos"("data_vencimento");

-- CreateIndex
CREATE INDEX "faturamentos_data_pagamento_idx" ON "faturamentos"("data_pagamento");

-- CreateIndex
CREATE INDEX "pagamentos_tenant_id_idx" ON "pagamentos"("tenant_id");

-- CreateIndex
CREATE INDEX "pagamentos_faturamento_id_idx" ON "pagamentos"("faturamento_id");

-- CreateIndex
CREATE INDEX "pagamentos_data_pagamento_idx" ON "pagamentos"("data_pagamento");

-- AddForeignKey
ALTER TABLE "faturamentos" ADD CONSTRAINT "faturamentos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faturamentos" ADD CONSTRAINT "faturamentos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faturamentos" ADD CONSTRAINT "faturamentos_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faturamentos" ADD CONSTRAINT "faturamentos_agendamento_id_fkey" FOREIGN KEY ("agendamento_id") REFERENCES "agendamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faturamentos" ADD CONSTRAINT "faturamentos_prontuario_id_fkey" FOREIGN KEY ("prontuario_id") REFERENCES "prontuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "clinicas"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_faturamento_id_fkey" FOREIGN KEY ("faturamento_id") REFERENCES "faturamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- =====================================================
-- SCRIPT SQL PARA CORRIGIR LOGIN DO RECEPCIONISTA1
-- Verifica e corrige especificamente o usuário recepcionista1@clinica.com
-- =====================================================

-- 1. VERIFICAR O USUÁRIO ATUAL
-- =====================================================
SELECT 
    "id",
    "email",
    "senha",
    "role",
    "ativo",
    "tenant_id",
    "createdAt",
    "updatedAt"
FROM "usuarios" 
WHERE "email" = 'recepcionista1@clinica.com' AND "tenant_id" = 'tenant-001';

-- 2. ATUALIZAR ESPECIFICAMENTE O RECEPCIONISTA1
-- =====================================================
UPDATE "usuarios" 
SET 
    "senha" = '$2a$12$6F0fZlC5ZfB.gMLAanOXC.kVX.CGSuIwMcqoQbH1PztSDVsNSytQa',
    "updatedAt" = NOW()
WHERE "email" = 'recepcionista1@clinica.com' AND "tenant_id" = 'tenant-001';

-- 3. VERIFICAR SE A ATUALIZAÇÃO FUNCIONOU
-- =====================================================
SELECT 
    "id",
    "email",
    "senha",
    "role",
    "ativo",
    "tenant_id",
    "updatedAt"
FROM "usuarios" 
WHERE "email" = 'recepcionista1@clinica.com' AND "tenant_id" = 'tenant-001';

-- 4. ATUALIZAR TODOS OS USUÁRIOS PARA GARANTIR
-- =====================================================
UPDATE "usuarios" 
SET 
    "senha" = '$2a$12$6F0fZlC5ZfB.gMLAanOXC.kVX.CGSuIwMcqoQbH1PztSDVsNSytQa',
    "updatedAt" = NOW()
WHERE "tenant_id" = 'tenant-001';

-- 5. VERIFICAR TODOS OS USUÁRIOS ATUALIZADOS
-- =====================================================
SELECT 
    "email",
    "role",
    "ativo",
    "senha",
    "updatedAt"
FROM "usuarios" 
WHERE "tenant_id" = 'tenant-001'
ORDER BY "role", "email";

-- 6. VERIFICAR SE A CLÍNICA ESTÁ ATIVA
-- =====================================================
SELECT 
    "id",
    "nome",
    "ativo",
    "tenant_id"
FROM "clinicas" 
WHERE "tenant_id" = 'tenant-001';

-- =====================================================
-- FIM DO SCRIPT - VERIFICAÇÃO E CORREÇÃO COMPLETA!
-- ===================================================== 
-- =====================================================
-- SCRIPT SQL PARA ATUALIZAR SENHAS DOS USUÁRIOS
-- Atualiza todas as senhas para a nova hash fornecida
-- =====================================================

-- Atualizar senhas de todos os usuários
UPDATE "usuarios" 
SET 
    "senha" = '$2a$12$6F0fZlC5ZfB.gMLAanOXC.kVX.CGSuIwMcqoQbH1PztSDVsNSytQa',
    "updatedAt" = NOW()
WHERE "tenant_id" = 'tenant-001';

-- Verificar quantos usuários foram atualizados
SELECT 
    COUNT(*) as "usuarios_atualizados",
    'Senhas atualizadas com sucesso!' as "status"
FROM "usuarios" 
WHERE "tenant_id" = 'tenant-001' AND "senha" = '$2a$12$6F0fZlC5ZfB.gMLAanOXC.kVX.CGSuIwMcqoQbH1PztSDVsNSytQa';

-- Listar todos os usuários com suas novas senhas (apenas para verificação)
SELECT 
    "id",
    "email",
    "role",
    "ativo",
    "senha",
    "updatedAt"
FROM "usuarios" 
WHERE "tenant_id" = 'tenant-001'
ORDER BY "role", "email";

-- =====================================================
-- FIM DO SCRIPT - SENHAS ATUALIZADAS!
-- ===================================================== 
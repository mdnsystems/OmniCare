-- =============================================================================
-- SCRIPT DE INICIALIZAÇÃO DO BANCO DE DADOS
-- =============================================================================
-- 
-- Este script é executado automaticamente quando o container PostgreSQL
-- é iniciado pela primeira vez
-- 
-- =============================================================================

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Configurar timezone
SET timezone = 'America/Sao_Paulo';

-- Criar usuário de aplicação (opcional)
-- CREATE USER swiftclinic_app WITH PASSWORD 'app_password';
-- GRANT ALL PRIVILEGES ON DATABASE swift_clinic TO swiftclinic_app;

-- Configurar configurações de performance (removidas configurações problemáticas do pg_stat_statements)
-- ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
-- ALTER SYSTEM SET pg_stat_statements.track = 'all';
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000;

-- Recarregar configurações
SELECT pg_reload_conf();

-- Criar índices de performance (serão criados pelo Prisma, mas podemos adicionar extras aqui)
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clinicas_tenant_id ON clinicas(tenant_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usuarios_tenant_email ON usuarios(tenant_id, email);

-- Log de inicialização
DO $$
BEGIN
    RAISE NOTICE 'Banco de dados omnicare inicializado com sucesso!';
    RAISE NOTICE 'Timezone configurado: %', current_setting('timezone');
    RAISE NOTICE 'Data/hora atual: %', now();
END $$; 
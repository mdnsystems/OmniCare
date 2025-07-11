# =============================================================================
# MAKEFILE - SWIFT CLINIC API
# =============================================================================
# 
# Comandos úteis para gerenciar o ambiente Docker
# 
# =============================================================================

.PHONY: help setup setup-dev build build-dev up up-dev down logs logs-api logs-db logs-redis clean clean-all migrate seed studio health test-docker

# Variáveis
COMPOSE_FILE = docker-compose.yml
COMPOSE_DEV_FILE = docker-compose.dev.yml

# Comando padrão
help:
	@echo "============================================================================="
	@echo "SWIFT CLINIC API - COMANDOS DISPONÍVEIS"
	@echo "============================================================================="
	@echo ""
	@echo "SETUP E CONFIGURAÇÃO:"
	@echo "  setup        - Configurar e iniciar ambiente de produção"
	@echo "  setup-dev    - Configurar e iniciar ambiente de desenvolvimento"
	@echo "  build        - Build das imagens de produção"
	@echo "  build-dev    - Build das imagens de desenvolvimento"
	@echo ""
	@echo "GERENCIAMENTO DE SERVIÇOS:"
	@echo "  up           - Iniciar serviços de produção"
	@echo "  up-dev       - Iniciar serviços de desenvolvimento"
	@echo "  down         - Parar todos os serviços"
	@echo "  restart      - Reiniciar todos os serviços"
	@echo "  restart-api  - Reiniciar apenas a API"
	@echo ""
	@echo "LOGS E MONITORAMENTO:"
	@echo "  logs         - Ver logs de todos os serviços"
	@echo "  logs-api     - Ver logs da API"
	@echo "  logs-db      - Ver logs do PostgreSQL"
	@echo "  logs-redis   - Ver logs do Redis"
	@echo "  health       - Verificar saúde dos serviços"
	@echo "  test-docker  - Testar ambiente Docker"
	@echo ""
	@echo "BANCO DE DADOS:"
	@echo "  migrate      - Executar migrações"
	@echo "  seed         - Executar seed do banco"
	@echo "  studio       - Abrir Prisma Studio"
	@echo "  db-reset     - Reset completo do banco (CUIDADO!)"
	@echo ""
	@echo "MANUTENÇÃO:"
	@echo "  clean        - Limpar containers e volumes não utilizados"
	@echo "  clean-all    - Limpar tudo (CUIDADO!)"
	@echo "  shell        - Acessar shell do container da API"
	@echo "  shell-db     - Acessar shell do PostgreSQL"
	@echo ""

# =============================================================================
# SETUP E CONFIGURAÇÃO
# =============================================================================

setup:
	@echo "🔧 Configurando ambiente de produção..."
	@./scripts/docker-setup.sh prod

setup-dev:
	@echo "🔧 Configurando ambiente de desenvolvimento..."
	@./scripts/docker-setup.sh dev

build:
	@echo "🏗️  Fazendo build das imagens de produção..."
	@docker-compose -f $(COMPOSE_FILE) build

build-dev:
	@echo "🏗️  Fazendo build das imagens de desenvolvimento..."
	@docker-compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) build

# =============================================================================
# GERENCIAMENTO DE SERVIÇOS
# =============================================================================

up:
	@echo "🚀 Iniciando serviços de produção..."
	@docker-compose -f $(COMPOSE_FILE) up -d

up-dev:
	@echo "🚀 Iniciando serviços de desenvolvimento..."
	@docker-compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) up -d
	@docker-compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) --profile development up -d

down:
	@echo "🛑 Parando todos os serviços..."
	@docker-compose -f $(COMPOSE_FILE) down

restart:
	@echo "🔄 Reiniciando todos os serviços..."
	@docker-compose -f $(COMPOSE_FILE) restart

restart-api:
	@echo "🔄 Reiniciando API..."
	@docker-compose -f $(COMPOSE_FILE) restart api

# =============================================================================
# LOGS E MONITORAMENTO
# =============================================================================

logs:
	@echo "📋 Mostrando logs de todos os serviços..."
	@docker-compose -f $(COMPOSE_FILE) logs -f

logs-api:
	@echo "📋 Mostrando logs da API..."
	@docker-compose -f $(COMPOSE_FILE) logs -f api

logs-db:
	@echo "📋 Mostrando logs do PostgreSQL..."
	@docker-compose -f $(COMPOSE_FILE) logs -f postgres

logs-redis:
	@echo "📋 Mostrando logs do Redis..."
	@docker-compose -f $(COMPOSE_FILE) logs -f redis

health:
	@echo "🏥 Verificando saúde dos serviços..."
	@docker-compose -f $(COMPOSE_FILE) ps
	@echo ""
	@echo "🔍 Testando endpoints de saúde..."
	@curl -f http://localhost:8080/health || echo "❌ API não está respondendo"
	@docker-compose -f $(COMPOSE_FILE) exec -T postgres pg_isready -U postgres -d swift_clinic && echo "✅ PostgreSQL OK" || echo "❌ PostgreSQL não está respondendo"
	@docker-compose -f $(COMPOSE_FILE) exec -T redis redis-cli ping && echo "✅ Redis OK" || echo "❌ Redis não está respondendo"

# =============================================================================
# TESTES
# =============================================================================

test-docker:
	@echo "🧪 Testando ambiente Docker..."
	@./scripts/test-docker.sh

# =============================================================================
# BANCO DE DADOS
# =============================================================================

migrate:
	@echo "🗄️  Executando migrações..."
	@docker-compose -f $(COMPOSE_FILE) exec -T api npx prisma migrate deploy

seed:
	@echo "🌱 Executando seed do banco..."
	@docker-compose -f $(COMPOSE_FILE) exec -T api npm run seed

studio:
	@echo "🎨 Abrindo Prisma Studio..."
	@docker-compose -f $(COMPOSE_FILE) exec -T api npx prisma studio --hostname 0.0.0.0 --port 5555

db-reset:
	@echo "⚠️  ATENÇÃO: Isso irá apagar todos os dados do banco!"
	@read -p "Tem certeza? Digite 'sim' para confirmar: " confirm; \
	if [ "$$confirm" = "sim" ]; then \
		echo "🗑️  Resetando banco de dados..."; \
		docker-compose -f $(COMPOSE_FILE) down; \
		docker volume rm swiftclinic_postgres_data || true; \
		docker-compose -f $(COMPOSE_FILE) up -d; \
		echo "⏳ Aguardando banco ficar pronto..."; \
		sleep 10; \
		docker-compose -f $(COMPOSE_FILE) exec -T api npx prisma migrate deploy; \
		echo "✅ Banco resetado com sucesso!"; \
	else \
		echo "❌ Operação cancelada."; \
	fi

# =============================================================================
# MANUTENÇÃO
# =============================================================================

clean:
	@echo "🧹 Limpando containers e volumes não utilizados..."
	@docker system prune -f
	@docker volume prune -f

clean-all:
	@echo "⚠️  ATENÇÃO: Isso irá remover TODOS os containers, imagens e volumes!"
	@read -p "Tem certeza? Digite 'sim' para confirmar: " confirm; \
	if [ "$$confirm" = "sim" ]; then \
		echo "🗑️  Limpando tudo..."; \
		docker-compose -f $(COMPOSE_FILE) down -v; \
		docker system prune -a -f --volumes; \
		echo "✅ Limpeza completa realizada!"; \
	else \
		echo "❌ Operação cancelada."; \
	fi

shell:
	@echo "🐚 Acessando shell do container da API..."
	@docker-compose -f $(COMPOSE_FILE) exec api sh

shell-db:
	@echo "🐚 Acessando shell do PostgreSQL..."
	@docker-compose -f $(COMPOSE_FILE) exec postgres psql -U postgres -d swift_clinic 
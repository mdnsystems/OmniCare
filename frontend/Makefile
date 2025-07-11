# ===========================================
# Makefile para OmniCare Frontend Docker
# ===========================================

.PHONY: help dev dev-full preview build prod nginx logs stop clean reset backup health monitor

# Variáveis
DOCKER_COMPOSE = docker-compose
DOCKER_DEV_SCRIPT = ./scripts/docker-dev.sh
DOCKER_PROD_SCRIPT = ./scripts/docker-prod.sh

# Comando padrão
help: ## Mostra esta ajuda
	@echo "🐳 OmniCare Frontend - Comandos Docker"
	@echo "======================================"
	@echo ""
	@echo "Desenvolvimento:"
	@echo "  make dev        - Inicia ambiente de desenvolvimento"
	@echo "  make dev-full   - Inicia ambiente completo (frontend + backend mock)"
	@echo "  make preview    - Inicia preview de produção"
	@echo "  make build      - Faz build de produção"
	@echo ""
	@echo "Produção:"
	@echo "  make prod       - Deploy de produção"
	@echo "  make nginx      - Deploy com nginx reverso"
	@echo "  make health     - Health check da aplicação"
	@echo "  make backup     - Cria backup da aplicação"
	@echo ""
	@echo "Gerenciamento:"
	@echo "  make logs       - Mostra logs"
	@echo "  make stop       - Para todos os containers"
	@echo "  make clean      - Limpa containers e imagens"
	@echo "  make reset      - Reset completo"
	@echo "  make monitor    - Monitoramento em tempo real"
	@echo ""
	@echo "Para mais detalhes, consulte DOCKER.md"

# ===========================================
# Desenvolvimento
# ===========================================

dev: ## Inicia ambiente de desenvolvimento
	@echo "🚀 Iniciando ambiente de desenvolvimento..."
	$(DOCKER_DEV_SCRIPT) dev

dev-full: ## Inicia ambiente completo (frontend + backend mock)
	@echo "🚀 Iniciando ambiente completo..."
	$(DOCKER_DEV_SCRIPT) dev-full

preview: ## Inicia preview de produção
	@echo "👀 Iniciando preview de produção..."
	$(DOCKER_DEV_SCRIPT) preview

build: ## Faz build de produção
	@echo "🔨 Fazendo build de produção..."
	$(DOCKER_DEV_SCRIPT) build

# ===========================================
# Produção
# ===========================================

prod: ## Deploy de produção
	@echo "🚀 Fazendo deploy de produção..."
	$(DOCKER_PROD_SCRIPT) deploy

nginx: ## Deploy com nginx reverso
	@echo "🌐 Fazendo deploy com nginx reverso..."
	$(DOCKER_PROD_SCRIPT) nginx

health: ## Health check da aplicação
	@echo "🏥 Verificando saúde da aplicação..."
	$(DOCKER_PROD_SCRIPT) health

backup: ## Cria backup da aplicação
	@echo "💾 Criando backup da aplicação..."
	$(DOCKER_PROD_SCRIPT) backup

# ===========================================
# Gerenciamento
# ===========================================

logs: ## Mostra logs
	@echo "📋 Mostrando logs..."
	$(DOCKER_DEV_SCRIPT) logs

logs-full: ## Mostra logs de todos os serviços
	@echo "📋 Mostrando logs completos..."
	$(DOCKER_DEV_SCRIPT) logs full

stop: ## Para todos os containers
	@echo "⏹️ Parando containers..."
	$(DOCKER_DEV_SCRIPT) stop

clean: ## Limpa containers e imagens
	@echo "🧹 Limpando containers e imagens..."
	$(DOCKER_COMPOSE) down --remove-orphans -v
	docker system prune -f
	@echo "✅ Limpeza concluída!"

reset: ## Reset completo
	@echo "🔄 Fazendo reset completo..."
	$(DOCKER_DEV_SCRIPT) reset

monitor: ## Monitoramento em tempo real
	@echo "📊 Iniciando monitoramento..."
	$(DOCKER_PROD_SCRIPT) monitor

# ===========================================
# Comandos Docker Compose Diretos
# ===========================================

up-dev: ## Docker compose up para desenvolvimento
	$(DOCKER_COMPOSE) --profile dev up --build -d

up-dev-full: ## Docker compose up para desenvolvimento completo
	$(DOCKER_COMPOSE) --profile dev-full up --build -d

up-preview: ## Docker compose up para preview
	$(DOCKER_COMPOSE) --profile preview up --build -d

up-prod: ## Docker compose up para produção
	$(DOCKER_COMPOSE) --profile prod up --build -d

up-nginx: ## Docker compose up com nginx
	$(DOCKER_COMPOSE) --profile nginx up --build -d

down: ## Docker compose down
	$(DOCKER_COMPOSE) down --remove-orphans

ps: ## Mostra status dos containers
	$(DOCKER_COMPOSE) ps

# ===========================================
# Utilitários
# ===========================================

shell: ## Entra no container de desenvolvimento
	$(DOCKER_COMPOSE) exec frontend-dev sh

shell-prod: ## Entra no container de produção
	$(DOCKER_COMPOSE) exec frontend-prod sh

stats: ## Mostra estatísticas dos containers
	docker stats

env: ## Copia arquivo de ambiente
	@if [ ! -f .env ]; then \
		echo "📝 Copiando env.example para .env..."; \
		cp env.example .env; \
		echo "✅ Arquivo .env criado. Configure as variáveis de ambiente."; \
	else \
		echo "ℹ️ Arquivo .env já existe."; \
	fi

check: ## Verifica se Docker está rodando
	@if docker info > /dev/null 2>&1; then \
		echo "✅ Docker está rodando"; \
	else \
		echo "❌ Docker não está rodando. Inicie o Docker Desktop."; \
		exit 1; \
	fi

# ===========================================
# Desenvolvimento Avançado
# ===========================================

install: ## Instala dependências localmente
	@echo "📦 Instalando dependências..."
	npm ci

dev-local: ## Desenvolvimento local (sem Docker)
	@echo "🚀 Iniciando desenvolvimento local..."
	npm run dev

build-local: ## Build local (sem Docker)
	@echo "🔨 Fazendo build local..."
	npm run build

lint: ## Executa linter
	@echo "🔍 Executando linter..."
	npm run lint

# ===========================================
# Deploy Avançado
# ===========================================

deploy-staging: ## Deploy para staging
	@echo "🚀 Fazendo deploy para staging..."
	$(DOCKER_PROD_SCRIPT) deploy

deploy-prod: ## Deploy para produção
	@echo "🚀 Fazendo deploy para produção..."
	$(DOCKER_PROD_SCRIPT) deploy

rollback: ## Rollback (especifique o backup)
	@if [ -z "$(BACKUP)" ]; then \
		echo "❌ Especifique o diretório de backup: make rollback BACKUP=./backups/20241201_143022"; \
		exit 1; \
	fi
	@echo "🔄 Fazendo rollback de $(BACKUP)..."
	$(DOCKER_PROD_SCRIPT) rollback $(BACKUP)

# ===========================================
# Documentação
# ===========================================

docs: ## Abre documentação Docker
	@if command -v xdg-open > /dev/null; then \
		xdg-open DOCKER.md; \
	elif command -v open > /dev/null; then \
		open DOCKER.md; \
	else \
		echo "📖 Abra o arquivo DOCKER.md para ver a documentação"; \
	fi

readme: ## Mostra README do projeto
	@if [ -f README.md ]; then \
		cat README.md; \
	else \
		echo "📖 README.md não encontrado"; \
	fi

# ===========================================
# Informações do Sistema
# ===========================================

info: ## Mostra informações do sistema
	@echo "🐳 Informações do Docker:"
	@docker --version
	@docker-compose --version
	@echo ""
	@echo "📦 Informações do Node.js:"
	@node --version
	@npm --version
	@echo ""
	@echo "📁 Informações do Projeto:"
	@echo "Diretório: $(PWD)"
	@echo "Branch: $(shell git branch --show-current 2>/dev/null || echo 'N/A')"
	@echo "Commit: $(shell git rev-parse --short HEAD 2>/dev/null || echo 'N/A')"

version: ## Mostra versão do projeto
	@echo "📋 Versão do projeto:"
	@if [ -f package.json ]; then \
		echo "Nome: $(shell node -p "require('./package.json').name")"; \
		echo "Versão: $(shell node -p "require('./package.json').version")"; \
	else \
		echo "package.json não encontrado"; \
	fi 
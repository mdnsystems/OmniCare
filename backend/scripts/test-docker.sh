#!/bin/bash

# =============================================================================
# SCRIPT DE TESTE DO DOCKER - SWIFT CLINIC API
# =============================================================================
# 
# Este script testa se o ambiente Docker está funcionando corretamente
# 
# =============================================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_failure() {
    echo -e "${RED}❌ $1${NC}"
}

# Contadores
TESTS_PASSED=0
TESTS_FAILED=0

# Função para executar teste
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -n "🧪 Testando: $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        print_success "PASSOU"
        ((TESTS_PASSED++))
    else
        print_failure "FALHOU"
        ((TESTS_FAILED++))
    fi
}

# Verificar se Docker está rodando
test_docker_running() {
    docker info > /dev/null 2>&1
}

# Verificar se containers estão rodando
test_containers_running() {
    docker-compose ps --services --filter "status=running" | grep -q "api" && \
    docker-compose ps --services --filter "status=running" | grep -q "postgres" && \
    docker-compose ps --services --filter "status=running" | grep -q "redis"
}

# Testar conexão com PostgreSQL
test_postgres_connection() {
    docker-compose exec -T postgres pg_isready -U postgres -d swift_clinic > /dev/null 2>&1
}

# Testar conexão com Redis
test_redis_connection() {
    docker-compose exec -T redis redis-cli ping > /dev/null 2>&1
}

# Testar API health check
test_api_health() {
    curl -f http://localhost:8080/health > /dev/null 2>&1
}

# Testar API health detalhado
test_api_health_detailed() {
    curl -f http://localhost:8080/health/detailed > /dev/null 2>&1
}

# Testar resposta da API
test_api_response() {
    local response=$(curl -s http://localhost:8080/)
    echo "$response" | grep -q "Swift Clinic API"
}

# Testar Prisma Studio (se em desenvolvimento)
test_prisma_studio() {
    if docker-compose ps | grep -q "prisma-studio"; then
        curl -f http://localhost:5555 > /dev/null 2>&1
    else
        return 0
    fi
}

# Testar Adminer (se em desenvolvimento)
test_adminer() {
    if docker-compose ps | grep -q "adminer"; then
        curl -f http://localhost:8081 > /dev/null 2>&1
    else
        return 0
    fi
}

# Testar Redis Commander (se em desenvolvimento)
test_redis_commander() {
    if docker-compose ps | grep -q "redis-commander"; then
        curl -f http://localhost:8082 > /dev/null 2>&1
    else
        return 0
    fi
}

# Testar migrações do banco
test_database_migrations() {
    docker-compose exec -T api npx prisma migrate status > /dev/null 2>&1
}

# Testar geração do Prisma Client
test_prisma_client() {
    docker-compose exec -T api npx prisma generate > /dev/null 2>&1
}

# Função principal
main() {
    print_header "TESTE DO AMBIENTE DOCKER - SWIFT CLINIC API"
    
    print_message "Iniciando testes do ambiente Docker..."
    echo ""
    
    # Testes básicos do Docker
    print_header "TESTES BÁSICOS DO DOCKER"
    run_test "Docker está rodando" "test_docker_running"
    run_test "Docker Compose está disponível" "docker-compose --version > /dev/null 2>&1"
    
    # Testes dos containers
    print_header "TESTES DOS CONTAINERS"
    run_test "Containers estão rodando" "test_containers_running"
    run_test "Container da API está ativo" "docker-compose ps api | grep -q 'Up'"
    run_test "Container do PostgreSQL está ativo" "docker-compose ps postgres | grep -q 'Up'"
    run_test "Container do Redis está ativo" "docker-compose ps redis | grep -q 'Up'"
    
    # Testes de conectividade
    print_header "TESTES DE CONECTIVIDADE"
    run_test "PostgreSQL está respondendo" "test_postgres_connection"
    run_test "Redis está respondendo" "test_redis_connection"
    
    # Testes da API
    print_header "TESTES DA API"
    run_test "API está respondendo" "test_api_health"
    run_test "Health check detalhado" "test_api_health_detailed"
    run_test "Resposta da API" "test_api_response"
    
    # Testes de desenvolvimento (se aplicável)
    print_header "TESTES DE DESENVOLVIMENTO"
    run_test "Prisma Studio" "test_prisma_studio"
    run_test "Adminer" "test_adminer"
    run_test "Redis Commander" "test_redis_commander"
    
    # Testes do banco de dados
    print_header "TESTES DO BANCO DE DADOS"
    run_test "Status das migrações" "test_database_migrations"
    run_test "Prisma Client" "test_prisma_client"
    
    # Resultados
    print_header "RESULTADOS DOS TESTES"
    echo ""
    echo -e "${GREEN}✅ Testes passaram: $TESTS_PASSED${NC}"
    echo -e "${RED}❌ Testes falharam: $TESTS_FAILED${NC}"
    echo ""
    
    local total_tests=$((TESTS_PASSED + TESTS_FAILED))
    local success_rate=$((TESTS_PASSED * 100 / total_tests))
    
    echo -e "📊 Taxa de sucesso: ${success_rate}%"
    echo ""
    
    if [ $TESTS_FAILED -eq 0 ]; then
        print_success "🎉 TODOS OS TESTES PASSARAM! O ambiente está funcionando perfeitamente."
        echo ""
        print_message "URLs disponíveis:"
        echo "  🌐 API: http://localhost:8080"
        echo "  🏥 Health Check: http://localhost:8080/health"
        echo "  📊 Health Detalhado: http://localhost:8080/health/detailed"
        
        if docker-compose ps | grep -q "prisma-studio"; then
            echo "  🎨 Prisma Studio: http://localhost:5555"
        fi
        
        if docker-compose ps | grep -q "adminer"; then
            echo "  🗄️ Adminer: http://localhost:8081"
        fi
        
        if docker-compose ps | grep -q "redis-commander"; then
            echo "  🔴 Redis Commander: http://localhost:8082"
        fi
        
        exit 0
    else
        print_failure "⚠️ ALGUNS TESTES FALHARAM. Verifique os logs e configurações."
        echo ""
        print_message "Comandos úteis para debug:"
        echo "  📋 Ver logs: make logs"
        echo "  🏥 Verificar saúde: make health"
        echo "  🔄 Reiniciar: make restart"
        echo "  🧹 Limpar e recriar: make clean-all && make setup-dev"
        
        exit 1
    fi
}

# Executar função principal
main "$@" 
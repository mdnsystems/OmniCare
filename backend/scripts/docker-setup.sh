#!/bin/bash

# =============================================================================
# SCRIPT DE SETUP DO DOCKER - SWIFT CLINIC API
# =============================================================================
# 
# Este script facilita a configuração e inicialização do ambiente Docker
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

# Verificar se Docker está instalado
check_docker() {
    print_message "Verificando se o Docker está instalado..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker não está instalado. Por favor, instale o Docker primeiro."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
        exit 1
    fi
    
    print_message "Docker e Docker Compose estão instalados!"
}

# Verificar se os containers estão rodando
check_containers() {
    print_message "Verificando status dos containers..."
    
    if docker-compose ps | grep -q "Up"; then
        print_warning "Alguns containers já estão rodando. Deseja parar e recriar? (y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            print_message "Parando containers existentes..."
            docker-compose down
        else
            print_message "Mantendo containers existentes."
            return
        fi
    fi
}

# Criar arquivo .env se não existir
setup_env() {
    if [ ! -f .env ]; then
        print_message "Criando arquivo .env baseado no env.example..."
        cp env.example .env
        
        # Gerar secrets JWT únicos
        JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
        JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
        
        # Substituir secrets no .env
        sed -i "s/sua-chave-secreta-jwt-unica-e-segura-com-pelo-menos-32-caracteres-aqui/$JWT_SECRET/g" .env
        sed -i "s/sua-chave-secreta-refresh-unica-e-segura-com-pelo-menos-32-caracteres-aqui/$JWT_REFRESH_SECRET/g" .env
        
        print_message "Arquivo .env criado com secrets JWT únicos!"
    else
        print_message "Arquivo .env já existe."
    fi
}

# Criar diretórios necessários
create_directories() {
    print_message "Criando diretórios necessários..."
    
    mkdir -p uploads
    mkdir -p logs
    mkdir -p generated
    
    print_message "Diretórios criados!"
}

# Build das imagens
build_images() {
    print_message "Fazendo build das imagens Docker..."
    
    if [ "$1" = "dev" ]; then
        print_message "Build para desenvolvimento..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
    else
        print_message "Build para produção..."
        docker-compose build
    fi
}

# Iniciar serviços
start_services() {
    print_message "Iniciando serviços..."
    
    if [ "$1" = "dev" ]; then
        print_message "Iniciando ambiente de desenvolvimento..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
        
        # Iniciar ferramentas de desenvolvimento
        print_message "Iniciando ferramentas de desenvolvimento..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml --profile development up -d
    else
        print_message "Iniciando ambiente de produção..."
        docker-compose up -d
    fi
}

# Aguardar serviços ficarem prontos
wait_for_services() {
    print_message "Aguardando serviços ficarem prontos..."
    
    # Aguardar PostgreSQL
    print_message "Aguardando PostgreSQL..."
    timeout=60
    while ! docker-compose exec -T postgres pg_isready -U postgres -d swift_clinic > /dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            print_error "Timeout aguardando PostgreSQL"
            exit 1
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    
    # Aguardar Redis
    print_message "Aguardando Redis..."
    timeout=30
    while ! docker-compose exec -T redis redis-cli --raw incr ping > /dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            print_error "Timeout aguardando Redis"
            exit 1
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    
    print_message "Todos os serviços estão prontos!"
}

# Executar migrações
run_migrations() {
    print_message "Executando migrações do banco de dados..."
    
    docker-compose exec -T api npx prisma migrate deploy
    
    print_message "Migrações executadas com sucesso!"
}

# Executar seed (opcional)
run_seed() {
    print_warning "Deseja executar o seed do banco de dados? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_message "Executando seed do banco de dados..."
        docker-compose exec -T api npm run seed
        print_message "Seed executado com sucesso!"
    fi
}

# Mostrar informações dos serviços
show_info() {
    print_header "INFORMAÇÕES DOS SERVIÇOS"
    
    echo -e "${GREEN}API:${NC} http://localhost:8080"
    echo -e "${GREEN}Health Check:${NC} http://localhost:8080/health"
    
    if [ "$1" = "dev" ]; then
        echo -e "${GREEN}Prisma Studio:${NC} http://localhost:5555"
        echo -e "${GREEN}Adminer (PostgreSQL):${NC} http://localhost:8081"
        echo -e "${GREEN}Redis Commander:${NC} http://localhost:8082"
    fi
    
    echo -e "${GREEN}PostgreSQL:${NC} localhost:5432"
    echo -e "${GREEN}Redis:${NC} localhost:6379"
    
    echo ""
    print_message "Para ver os logs: docker-compose logs -f"
    print_message "Para parar os serviços: docker-compose down"
}

# Função principal
main() {
    print_header "SETUP DO DOCKER - SWIFT CLINIC API"
    
    # Verificar argumentos
    ENVIRONMENT=${1:-prod}
    
    if [ "$ENVIRONMENT" != "prod" ] && [ "$ENVIRONMENT" != "dev" ]; then
        print_error "Uso: $0 [prod|dev]"
        print_error "  prod: Ambiente de produção (padrão)"
        print_error "  dev:  Ambiente de desenvolvimento"
        exit 1
    fi
    
    print_message "Configurando ambiente: $ENVIRONMENT"
    
    # Executar etapas
    check_docker
    check_containers
    setup_env
    create_directories
    build_images "$ENVIRONMENT"
    start_services "$ENVIRONMENT"
    wait_for_services
    run_migrations
    run_seed
    show_info "$ENVIRONMENT"
    
    print_header "SETUP CONCLUÍDO COM SUCESSO!"
}

# Executar função principal
main "$@" 
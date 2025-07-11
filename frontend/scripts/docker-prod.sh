#!/bin/bash

# ===========================================
# Script de Deploy de Produção - OmniCare
# ===========================================

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
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Função para verificar se Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está rodando. Por favor, inicie o Docker Desktop."
        exit 1
    fi
    print_message "Docker está rodando"
}

# Função para verificar variáveis de ambiente
check_env() {
    if [ ! -f .env ]; then
        print_warning "Arquivo .env não encontrado. Copiando de env.example..."
        cp env.example .env
        print_warning "Por favor, configure as variáveis de ambiente no arquivo .env"
    fi
}

# Função para build de produção
build_prod() {
    print_header "Build de Produção"
    check_docker
    check_env
    
    print_message "Removendo build anterior..."
    rm -rf dist/
    
    print_message "Construindo aplicação para produção..."
    docker-compose --profile build up --build --no-deps
    
    print_message "Build concluído! Arquivos em ./dist/"
}

# Função para deploy local
deploy_local() {
    print_header "Deploy Local de Produção"
    check_docker
    check_env
    
    print_message "Parando containers existentes..."
    docker-compose --profile prod down --remove-orphans
    
    print_message "Construindo e iniciando container de produção..."
    docker-compose --profile prod up --build -d
    
    print_message "Aguardando container estar pronto..."
    sleep 5
    
    print_message "Verificando status do container..."
    docker-compose --profile prod ps
    
    print_message "Aplicação disponível em: http://localhost"
    print_message "Para ver logs: docker-compose --profile prod logs -f frontend-prod"
    print_message "Para parar: docker-compose --profile prod down"
}

# Função para deploy com nginx reverso
deploy_with_nginx() {
    print_header "Deploy com Nginx Reverso"
    check_docker
    check_env
    
    print_message "Parando containers existentes..."
    docker-compose --profile nginx down --remove-orphans
    
    print_message "Construindo e iniciando containers..."
    docker-compose --profile nginx up --build -d
    
    print_message "Aguardando containers estarem prontos..."
    sleep 10
    
    print_message "Verificando status dos containers..."
    docker-compose --profile nginx ps
    
    print_message "Nginx disponível em: http://localhost:8080"
    print_message "Para ver logs: docker-compose --profile nginx logs -f"
    print_message "Para parar: docker-compose --profile nginx down"
}

# Função para health check
health_check() {
    print_message "Verificando saúde da aplicação..."
    
    # Verificar se o container está rodando
    if docker-compose --profile prod ps | grep -q "Up"; then
        print_message "Container está rodando"
    else
        print_error "Container não está rodando"
        return 1
    fi
    
    # Verificar se a aplicação responde
    if curl -f http://localhost > /dev/null 2>&1; then
        print_message "Aplicação está respondendo"
    else
        print_error "Aplicação não está respondendo"
        return 1
    fi
    
    print_message "Health check passou!"
}

# Função para backup
backup() {
    print_header "Backup da Aplicação"
    
    BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    print_message "Criando backup em: $BACKUP_DIR"
    
    # Backup dos arquivos de build
    if [ -d "dist" ]; then
        cp -r dist "$BACKUP_DIR/"
        print_message "Backup dos arquivos de build criado"
    fi
    
    # Backup das configurações
    cp docker-compose.yml "$BACKUP_DIR/"
    cp Dockerfile "$BACKUP_DIR/"
    cp nginx.conf "$BACKUP_DIR/"
    
    print_message "Backup concluído!"
}

# Função para rollback
rollback() {
    if [ -z "$1" ]; then
        print_error "Especifique o diretório de backup para rollback"
        echo "Uso: $0 rollback <backup_dir>"
        exit 1
    fi
    
    BACKUP_DIR="$1"
    
    if [ ! -d "$BACKUP_DIR" ]; then
        print_error "Diretório de backup não encontrado: $BACKUP_DIR"
        exit 1
    fi
    
    print_header "Rollback da Aplicação"
    print_warning "Isso irá restaurar a aplicação do backup: $BACKUP_DIR"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "Parando containers..."
        docker-compose --profile prod down
        
        print_message "Restaurando arquivos..."
        if [ -d "$BACKUP_DIR/dist" ]; then
            rm -rf dist
            cp -r "$BACKUP_DIR/dist" ./
        fi
        
        print_message "Reiniciando containers..."
        docker-compose --profile prod up -d
        
        print_message "Rollback concluído!"
    else
        print_message "Rollback cancelado"
    fi
}

# Função para logs de produção
logs() {
    docker-compose --profile prod logs -f frontend-prod
}

# Função para monitoramento
monitor() {
    print_header "Monitoramento da Aplicação"
    
    while true; do
        clear
        echo "=== Status dos Containers ==="
        docker-compose --profile prod ps
        
        echo -e "\n=== Uso de Recursos ==="
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
        
        echo -e "\n=== Logs Recentes ==="
        docker-compose --profile prod logs --tail=10 frontend-prod
        
        echo -e "\nPressione Ctrl+C para sair"
        sleep 5
    done
}

# Função para mostrar ajuda
help() {
    print_header "Script de Deploy de Produção - OmniCare"
    echo
    echo "Uso: $0 [comando] [opções]"
    echo
    echo "Comandos disponíveis:"
    echo "  build      - Faz build de produção"
    echo "  deploy     - Deploy local de produção"
    echo "  nginx      - Deploy com nginx reverso"
    echo "  health     - Verifica saúde da aplicação"
    echo "  backup     - Cria backup da aplicação"
    echo "  rollback   - Faz rollback de um backup"
    echo "  logs       - Mostra logs de produção"
    echo "  monitor    - Monitoramento em tempo real"
    echo "  help       - Mostra esta ajuda"
    echo
    echo "Exemplos:"
    echo "  $0 build"
    echo "  $0 deploy"
    echo "  $0 rollback ./backups/20241201_143022"
    echo
}

# Verificar se comando foi fornecido
if [ $# -eq 0 ]; then
    help
    exit 1
fi

# Executar comando
case "$1" in
    build)
        build_prod
        ;;
    deploy)
        deploy_local
        ;;
    nginx)
        deploy_with_nginx
        ;;
    health)
        health_check
        ;;
    backup)
        backup
        ;;
    rollback)
        rollback $2
        ;;
    logs)
        logs
        ;;
    monitor)
        monitor
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Comando desconhecido: $1"
        help
        exit 1
        ;;
esac 
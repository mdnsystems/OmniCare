#!/bin/bash

# ===========================================
# Script de Desenvolvimento Docker - OmniCare
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

# Função para limpar containers antigos
cleanup() {
    print_message "Limpando containers antigos..."
    docker-compose down --remove-orphans
    docker system prune -f
}

# Função para desenvolvimento
dev() {
    print_header "Iniciando Ambiente de Desenvolvimento"
    check_docker
    cleanup
    
    print_message "Construindo e iniciando container de desenvolvimento..."
    docker-compose --profile dev up --build -d
    
    print_message "Aguardando container estar pronto..."
    sleep 5
    
    print_message "Verificando status do container..."
    docker-compose --profile dev ps
    
    print_message "Aplicação disponível em: http://localhost:5173"
    print_message "Para ver logs: docker-compose --profile dev logs -f frontend-dev"
    print_message "Para parar: docker-compose --profile dev down"
}

# Função para desenvolvimento completo (com backend mock)
dev_full() {
    print_header "Iniciando Ambiente de Desenvolvimento Completo"
    check_docker
    cleanup
    
    print_message "Construindo e iniciando containers (frontend + backend mock)..."
    docker-compose --profile dev-full up --build -d
    
    print_message "Aguardando containers estarem prontos..."
    sleep 10
    
    print_message "Verificando status dos containers..."
    docker-compose --profile dev-full ps
    
    print_message "Frontend disponível em: http://localhost:5173"
    print_message "Backend mock disponível em: http://localhost:8080"
    print_message "Para ver logs: docker-compose --profile dev-full logs -f"
    print_message "Para parar: docker-compose --profile dev-full down"
}

# Função para preview de produção
preview() {
    print_header "Iniciando Preview de Produção"
    check_docker
    cleanup
    
    print_message "Construindo aplicação para produção..."
    docker-compose --profile preview up --build -d
    
    print_message "Aguardando container estar pronto..."
    sleep 5
    
    print_message "Preview disponível em: http://localhost:4173"
    print_message "Para parar: docker-compose --profile preview down"
}

# Função para build de produção
build() {
    print_header "Build de Produção"
    check_docker
    
    print_message "Construindo aplicação para produção..."
    docker-compose --profile build up --build
    
    print_message "Build concluído! Arquivos em ./dist/"
}

# Função para logs
logs() {
    if [ "$1" = "full" ]; then
        docker-compose --profile dev-full logs -f
    else
        docker-compose --profile dev logs -f frontend-dev
    fi
}

# Função para parar todos os containers
stop() {
    print_message "Parando todos os containers..."
    docker-compose down --remove-orphans
    print_message "Containers parados"
}

# Função para reset completo
reset() {
    print_header "Reset Completo"
    print_warning "Isso irá remover todos os containers, imagens e volumes!"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "Removendo containers..."
        docker-compose down --remove-orphans -v
        print_message "Removendo imagens..."
        docker rmi $(docker images -q omnicare*) 2>/dev/null || true
        print_message "Limpando sistema..."
        docker system prune -af
        print_message "Reset completo!"
    else
        print_message "Reset cancelado"
    fi
}

# Função para mostrar ajuda
help() {
    print_header "Script de Desenvolvimento Docker - OmniCare"
    echo
    echo "Uso: $0 [comando]"
    echo
    echo "Comandos disponíveis:"
    echo "  dev        - Inicia ambiente de desenvolvimento (apenas frontend)"
    echo "  dev-full   - Inicia ambiente completo (frontend + backend mock)"
    echo "  preview    - Inicia preview de produção"
    echo "  build      - Faz build de produção"
    echo "  logs       - Mostra logs do frontend"
    echo "  logs full  - Mostra logs de todos os serviços"
    echo "  stop       - Para todos os containers"
    echo "  reset      - Reset completo (remove tudo)"
    echo "  help       - Mostra esta ajuda"
    echo
    echo "Exemplos:"
    echo "  $0 dev"
    echo "  $0 dev-full"
    echo "  $0 logs"
    echo
}

# Verificar se comando foi fornecido
if [ $# -eq 0 ]; then
    help
    exit 1
fi

# Executar comando
case "$1" in
    dev)
        dev
        ;;
    dev-full)
        dev_full
        ;;
    preview)
        preview
        ;;
    build)
        build
        ;;
    logs)
        logs $2
        ;;
    stop)
        stop
        ;;
    reset)
        reset
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
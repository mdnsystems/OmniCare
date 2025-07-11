# =============================================================================
# SCRIPT DE SETUP DO DOCKER - SWIFT CLINIC API (WINDOWS)
# =============================================================================
# 
# Este script facilita a configuração e inicialização do ambiente Docker no Windows
# 
# =============================================================================

param(
    [Parameter(Position=0)]
    [ValidateSet("prod", "dev")]
    [string]$Environment = "prod"
)

# Função para imprimir mensagens coloridas
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Header {
    param([string]$Message)
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "========================================" -ForegroundColor Blue
}

# Verificar se Docker está instalado
function Test-Docker {
    Write-Info "Verificando se o Docker está instalado..."
    
    try {
        $dockerVersion = docker --version
        $composeVersion = docker-compose --version
        Write-Info "Docker e Docker Compose estão instalados!"
        Write-Info "Docker: $dockerVersion"
        Write-Info "Compose: $composeVersion"
    }
    catch {
        Write-Error "Docker não está instalado ou não está no PATH. Por favor, instale o Docker Desktop primeiro."
        exit 1
    }
}

# Verificar se os containers estão rodando
function Test-Containers {
    Write-Info "Verificando status dos containers..."
    
    $runningContainers = docker-compose ps --services --filter "status=running" 2>$null
    if ($runningContainers) {
        Write-Warning "Alguns containers já estão rodando. Deseja parar e recriar? (s/N)"
        $response = Read-Host
        if ($response -eq "s" -or $response -eq "S") {
            Write-Info "Parando containers existentes..."
            docker-compose down
        }
        else {
            Write-Info "Mantendo containers existentes."
            return
        }
    }
}

# Criar arquivo .env se não existir
function Setup-Environment {
    if (-not (Test-Path ".env")) {
        Write-Info "Criando arquivo .env baseado no env.example..."
        Copy-Item "env.example" ".env"
        
        # Gerar secrets JWT únicos
        $jwtSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
        $jwtRefreshSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
        
        # Substituir secrets no .env
        $envContent = Get-Content ".env" -Raw
        $envContent = $envContent -replace "sua-chave-secreta-jwt-unica-e-segura-com-pelo-menos-32-caracteres-aqui", $jwtSecret
        $envContent = $envContent -replace "sua-chave-secreta-refresh-unica-e-segura-com-pelo-menos-32-caracteres-aqui", $jwtRefreshSecret
        Set-Content ".env" $envContent
        
        Write-Info "Arquivo .env criado com secrets JWT únicos!"
    }
    else {
        Write-Info "Arquivo .env já existe."
    }
}

# Criar diretórios necessários
function New-Directories {
    Write-Info "Criando diretórios necessários..."
    
    $directories = @("uploads", "logs", "generated")
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir | Out-Null
        }
    }
    
    Write-Info "Diretórios criados!"
}

# Build das imagens
function Build-Images {
    Write-Info "Fazendo build das imagens Docker..."
    
    if ($Environment -eq "dev") {
        Write-Info "Build para desenvolvimento..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
    }
    else {
        Write-Info "Build para produção..."
        docker-compose build
    }
}

# Iniciar serviços
function Start-Services {
    Write-Info "Iniciando serviços..."
    
    if ($Environment -eq "dev") {
        Write-Info "Iniciando ambiente de desenvolvimento..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
        
        # Iniciar ferramentas de desenvolvimento
        Write-Info "Iniciando ferramentas de desenvolvimento..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml --profile development up -d
    }
    else {
        Write-Info "Iniciando ambiente de produção..."
        docker-compose up -d
    }
}

# Aguardar serviços ficarem prontos
function Wait-Services {
    Write-Info "Aguardando serviços ficarem prontos..."
    
    # Aguardar PostgreSQL
    Write-Info "Aguardando PostgreSQL..."
    $timeout = 60
    while ($timeout -gt 0) {
        try {
            $result = docker-compose exec -T postgres pg_isready -U postgres -d swift_clinic 2>$null
            if ($LASTEXITCODE -eq 0) {
                break
            }
        }
        catch {
            # Ignorar erros
        }
        Start-Sleep -Seconds 1
        $timeout--
    }
    
    if ($timeout -le 0) {
        Write-Error "Timeout aguardando PostgreSQL"
        exit 1
    }
    
    # Aguardar Redis
    Write-Info "Aguardando Redis..."
    $timeout = 30
    while ($timeout -gt 0) {
        try {
            $result = docker-compose exec -T redis redis-cli --raw incr ping 2>$null
            if ($LASTEXITCODE -eq 0) {
                break
            }
        }
        catch {
            # Ignorar erros
        }
        Start-Sleep -Seconds 1
        $timeout--
    }
    
    if ($timeout -le 0) {
        Write-Error "Timeout aguardando Redis"
        exit 1
    }
    
    Write-Info "Todos os serviços estão prontos!"
}

# Executar migrações
function Invoke-Migrations {
    Write-Info "Executando migrações do banco de dados..."
    
    docker-compose exec -T api npx prisma migrate deploy
    
    Write-Info "Migrações executadas com sucesso!"
}

# Executar seed (opcional)
function Invoke-Seed {
    Write-Warning "Deseja executar o seed do banco de dados? (s/N)"
    $response = Read-Host
    if ($response -eq "s" -or $response -eq "S") {
        Write-Info "Executando seed do banco de dados..."
        docker-compose exec -T api npm run seed
        Write-Info "Seed executado com sucesso!"
    }
}

# Mostrar informações dos serviços
function Show-Info {
    Write-Header "INFORMAÇÕES DOS SERVIÇOS"
    
    Write-Host "API: http://localhost:8080" -ForegroundColor Green
    Write-Host "Health Check: http://localhost:8080/health" -ForegroundColor Green
    
    if ($Environment -eq "dev") {
        Write-Host "Prisma Studio: http://localhost:5555" -ForegroundColor Green
        Write-Host "Adminer (PostgreSQL): http://localhost:8081" -ForegroundColor Green
        Write-Host "Redis Commander: http://localhost:8082" -ForegroundColor Green
    }
    
    Write-Host "PostgreSQL: localhost:5432" -ForegroundColor Green
    Write-Host "Redis: localhost:6379" -ForegroundColor Green
    
    Write-Host ""
    Write-Info "Para ver os logs: docker-compose logs -f"
    Write-Info "Para parar os serviços: docker-compose down"
}

# Função principal
function Main {
    Write-Header "SETUP DO DOCKER - SWIFT CLINIC API (WINDOWS)"
    
    Write-Info "Configurando ambiente: $Environment"
    
    # Executar etapas
    Test-Docker
    Test-Containers
    Setup-Environment
    New-Directories
    Build-Images
    Start-Services
    Wait-Services
    Invoke-Migrations
    Invoke-Seed
    Show-Info
    
    Write-Header "SETUP CONCLUÍDO COM SUCESSO!"
}

# Executar função principal
Main 
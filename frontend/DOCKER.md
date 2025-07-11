# 🐳 Docker - OmniCare Frontend

Este documento explica como usar Docker para desenvolvimento e produção do projeto OmniCare Frontend.

## 📋 Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando
- [Docker Compose](https://docs.docker.com/compose/) (incluído no Docker Desktop)
- Git Bash ou terminal compatível (para os scripts)

## 🚀 Início Rápido

### Desenvolvimento

```bash
# Iniciar ambiente de desenvolvimento
./scripts/docker-dev.sh dev

# Acessar a aplicação
# http://localhost:5173
```

### Produção

```bash
# Build e deploy de produção
./scripts/docker-prod.sh deploy

# Acessar a aplicação
# http://localhost
```

## 📁 Estrutura dos Arquivos Docker

```
├── Dockerfile                 # Multi-stage build para dev/prod
├── docker-compose.yml         # Configuração principal
├── docker-compose.override.yml # Configurações de desenvolvimento
├── nginx.conf                 # Configuração do nginx para produção
├── .dockerignore              # Arquivos ignorados no build
├── scripts/
│   ├── docker-dev.sh          # Scripts de desenvolvimento
│   └── docker-prod.sh         # Scripts de produção
└── DOCKER.md                  # Esta documentação
```

## 🔧 Configurações

### Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp env.example .env
```

Configure as seguintes variáveis no arquivo `.env`:

```env
# Configurações da Z-API
VITE_ZAPI_INSTANCE_ID=seu_instance_id_aqui
VITE_ZAPI_TOKEN=seu_token_aqui

# Outras configurações
VITE_APP_TITLE=OmniCare
VITE_APP_VERSION=1.0.0
VITE_API_URL=http://localhost:8080/api
```

## 🛠️ Comandos de Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento básico (apenas frontend)
./scripts/docker-dev.sh dev

# Desenvolvimento completo (frontend + backend mock)
./scripts/docker-dev.sh dev-full

# Preview de produção
./scripts/docker-dev.sh preview

# Build de produção
./scripts/docker-dev.sh build

# Ver logs
./scripts/docker-dev.sh logs
./scripts/docker-dev.sh logs full

# Parar containers
./scripts/docker-dev.sh stop

# Reset completo
./scripts/docker-dev.sh reset

# Ajuda
./scripts/docker-dev.sh help
```

### Comandos Docker Compose Diretos

```bash
# Desenvolvimento
docker-compose --profile dev up --build -d

# Desenvolvimento completo
docker-compose --profile dev-full up --build -d

# Preview
docker-compose --profile preview up --build -d

# Produção
docker-compose --profile prod up --build -d

# Build apenas
docker-compose --profile build up --build

# Parar todos
docker-compose down --remove-orphans
```

## 🚀 Comandos de Produção

### Scripts Disponíveis

```bash
# Build de produção
./scripts/docker-prod.sh build

# Deploy local
./scripts/docker-prod.sh deploy

# Deploy com nginx reverso
./scripts/docker-prod.sh nginx

# Health check
./scripts/docker-prod.sh health

# Backup
./scripts/docker-prod.sh backup

# Rollback
./scripts/docker-prod.sh rollback ./backups/20241201_143022

# Logs
./scripts/docker-prod.sh logs

# Monitoramento
./scripts/docker-prod.sh monitor

# Ajuda
./scripts/docker-prod.sh help
```

## 🔍 Portas Utilizadas

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Frontend Dev | 5173 | Desenvolvimento com hot reload |
| Frontend Prod | 80 | Produção |
| Frontend Preview | 4173 | Preview de produção |
| Nginx Reverso | 8080 | Proxy reverso |
| Backend Mock | 8080 | Servidor mock para desenvolvimento |

## 📊 Perfis Docker Compose

### `dev`
- Container de desenvolvimento com hot reload
- Volume mapeado para código fonte
- Porta 5173

### `dev-full`
- Frontend + Backend mock
- Ambiente completo para desenvolvimento
- Portas 5173 e 8080

### `preview`
- Build de produção para preview
- Nginx servindo arquivos estáticos
- Porta 4173

### `prod`
- Build de produção otimizado
- Nginx com configurações de segurança
- Porta 80

### `build`
- Apenas build, sem container rodando
- Gera arquivos em `./dist/`

### `nginx`
- Nginx reverso + frontend
- Proxy para backend
- Porta 8080

## 🔧 Configurações Avançadas

### Otimizações de Build

O Dockerfile utiliza multi-stage build para otimizar:

1. **Estágio deps**: Instala dependências de produção
2. **Estágio builder**: Build da aplicação
3. **Estágio production**: Nginx servindo arquivos estáticos
4. **Estágio development**: Ambiente de desenvolvimento

### Configurações do Nginx

O `nginx.conf` inclui:

- Gzip compression
- Cache para arquivos estáticos
- Headers de segurança
- Configuração para SPA (fallback para index.html)
- Proxy para API e WebSocket
- Logs estruturados

### Volumes e Persistência

```yaml
volumes:
  - .:/app                    # Código fonte
  - /app/node_modules         # Dependências isoladas
  - /app/dist                 # Build isolado
```

## 🐛 Troubleshooting

### Problemas Comuns

#### Container não inicia
```bash
# Verificar logs
docker-compose logs frontend-dev

# Verificar se Docker está rodando
docker info

# Limpar containers antigos
docker-compose down --remove-orphans
docker system prune -f
```

#### Hot reload não funciona
```bash
# Verificar configurações de polling
export CHOKIDAR_USEPOLLING=true
export WATCHPACK_POLLING=true

# Reiniciar container
docker-compose restart frontend-dev
```

#### Porta já em uso
```bash
# Verificar processos na porta
netstat -ano | findstr :5173

# Parar processo ou usar porta diferente
docker-compose --profile dev up -d -p 5174:5173
```

#### Problemas de permissão (Linux/Mac)
```bash
# Dar permissão aos scripts
chmod +x scripts/*.sh

# Executar com sudo se necessário
sudo ./scripts/docker-dev.sh dev
```

### Logs e Debug

```bash
# Logs em tempo real
docker-compose logs -f frontend-dev

# Logs de todos os serviços
docker-compose logs -f

# Entrar no container
docker-compose exec frontend-dev sh

# Verificar recursos
docker stats
```

## 🔒 Segurança

### Headers de Segurança

O nginx está configurado com:

- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer-when-downgrade`
- `Content-Security-Policy`

### Boas Práticas

1. **Nunca commitar arquivos `.env`**
2. **Usar secrets para credenciais em produção**
3. **Manter imagens atualizadas**
4. **Usar usuário não-root quando possível**
5. **Limitar recursos dos containers**

## 📈 Monitoramento

### Health Check

```bash
# Verificar saúde da aplicação
./scripts/docker-prod.sh health

# Monitoramento em tempo real
./scripts/docker-prod.sh monitor
```

### Métricas

```bash
# Uso de recursos
docker stats

# Logs estruturados
docker-compose logs --tail=100 frontend-prod
```

## 🔄 CI/CD

### GitHub Actions (exemplo)

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: |
          docker build --target production -t omnicare-frontend .
      - name: Deploy
        run: |
          # Deploy steps
```

## 🤝 Contribuição

### Para Novos Desenvolvedores

1. **Clone o repositório**
2. **Instale o Docker Desktop**
3. **Configure as variáveis de ambiente**
4. **Execute o script de desenvolvimento**

```bash
git clone <repository>
cd frontend
cp env.example .env
# Configure .env
./scripts/docker-dev.sh dev
```

### Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Build de produção testado
- [ ] Health check passando
- [ ] Logs verificados
- [ ] Backup criado (se necessário)

## 📞 Suporte

Para problemas relacionados ao Docker:

1. Verifique esta documentação
2. Consulte os logs: `./scripts/docker-dev.sh logs`
3. Execute health check: `./scripts/docker-prod.sh health`
4. Abra uma issue no repositório

---

**Última atualização**: Dezembro 2024
**Versão**: 1.0.0 
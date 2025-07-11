# 🐳 OmniCare Frontend - Docker

Configuração Docker completa para desenvolvimento e produção do OmniCare Frontend.

## ⚡ Início Rápido

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado
- Git Bash ou terminal compatível

### Desenvolvimento
```bash
# 1. Clone o repositório
git clone <repository>
cd frontend

# 2. Configure as variáveis de ambiente
cp env.example .env
# Edite o arquivo .env com suas configurações

# 3. Inicie o ambiente de desenvolvimento
./scripts/docker-dev.sh dev

# 4. Acesse a aplicação
# http://localhost:5173
```

### Produção
```bash
# Deploy de produção
./scripts/docker-prod.sh deploy

# Acesse a aplicação
# http://localhost
```

## 🛠️ Comandos Principais

### Desenvolvimento
```bash
./scripts/docker-dev.sh dev        # Desenvolvimento básico
./scripts/docker-dev.sh dev-full   # Desenvolvimento completo
./scripts/docker-dev.sh preview    # Preview de produção
./scripts/docker-dev.sh build      # Build de produção
./scripts/docker-dev.sh logs       # Ver logs
./scripts/docker-dev.sh stop       # Parar containers
```

### Produção
```bash
./scripts/docker-prod.sh deploy    # Deploy de produção
./scripts/docker-prod.sh nginx     # Deploy com nginx
./scripts/docker-prod.sh health    # Health check
./scripts/docker-prod.sh backup    # Backup
./scripts/docker-prod.sh monitor   # Monitoramento
```

### Make (Alternativa)
```bash
make dev        # Desenvolvimento
make prod       # Produção
make logs       # Logs
make stop       # Parar
make help       # Ajuda
```

## 📁 Estrutura

```
├── Dockerfile                 # Multi-stage build
├── docker-compose.yml         # Configuração principal
├── docker-compose.override.yml # Desenvolvimento
├── nginx.conf                 # Configuração nginx
├── .dockerignore              # Arquivos ignorados
├── scripts/
│   ├── docker-dev.sh          # Scripts de desenvolvimento
│   └── docker-prod.sh         # Scripts de produção
├── Makefile                   # Comandos make
├── DOCKER.md                  # Documentação completa
└── README-DOCKER.md           # Este arquivo
```

## 🔧 Configuração

### Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Configure as variáveis necessárias
VITE_ZAPI_INSTANCE_ID=seu_instance_id
VITE_ZAPI_TOKEN=seu_token
VITE_API_URL=http://localhost:8080/api
```

## 🚀 Perfis Disponíveis

| Perfil | Descrição | Porta |
|--------|-----------|-------|
| `dev` | Desenvolvimento com hot reload | 5173 |
| `dev-full` | Frontend + Backend mock | 5173, 8080 |
| `preview` | Preview de produção | 4173 |
| `prod` | Produção otimizada | 80 |
| `nginx` | Nginx reverso | 8080 |

## 🔍 Troubleshooting

### Problemas Comuns

**Container não inicia:**
```bash
# Verificar logs
./scripts/docker-dev.sh logs

# Verificar se Docker está rodando
docker info

# Limpar containers antigos
./scripts/docker-dev.sh stop
```

**Hot reload não funciona:**
```bash
# Reiniciar container
docker-compose restart frontend-dev
```

**Porta já em uso:**
```bash
# Verificar processos
netstat -ano | findstr :5173

# Usar porta diferente
docker-compose --profile dev up -d -p 5174:5173
```

## 📚 Documentação Completa

Para informações detalhadas, consulte:
- [DOCKER.md](DOCKER.md) - Documentação completa
- [Makefile](Makefile) - Comandos make disponíveis

## 🤝 Contribuição

1. Clone o repositório
2. Configure o ambiente: `cp env.example .env`
3. Inicie desenvolvimento: `./scripts/docker-dev.sh dev`
4. Faça suas alterações
5. Teste: `./scripts/docker-dev.sh preview`
6. Commit e push

## 📞 Suporte

- Verifique a documentação em [DOCKER.md](DOCKER.md)
- Execute: `./scripts/docker-dev.sh logs`
- Abra uma issue no repositório

---

**Desenvolvido com ❤️ para OmniCare** 
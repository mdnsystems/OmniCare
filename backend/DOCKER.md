# Docker - Omni Care API

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Configuração Rápida](#configuração-rápida)
- [Ambientes Disponíveis](#ambientes-disponíveis)
- [Comandos Úteis](#comandos-úteis)
- [Estrutura dos Containers](#estrutura-dos-containers)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Troubleshooting](#troubleshooting)
- [Desenvolvimento](#desenvolvimento)
- [Produção](#produção)

## 🎯 Visão Geral

Este projeto utiliza Docker para containerização completa da aplicação, incluindo:

- **API Node.js** com TypeScript
- **PostgreSQL** para banco de dados
- **Redis** para cache e sessões
- **Ferramentas de desenvolvimento** (Prisma Studio, Adminer, Redis Commander)

## 📋 Pré-requisitos

- Docker Desktop (versão 20.10+)
- Docker Compose (versão 2.0+)
- Node.js (apenas para scripts de setup)
- Git

### Verificar Instalação

```bash
# Verificar Docker
docker --version
docker-compose --version

# Verificar Node.js (para scripts)
node --version
npm --version
```

## 🚀 Configuração Rápida

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd backend
```

### 2. Setup Automático

```bash
# Para desenvolvimento (recomendado para novos desenvolvedores)
make setup-dev

# Para produção
make setup
```

### 3. Verificar Funcionamento

```bash
# Verificar saúde dos serviços
make health

# Ver logs
make logs
```

## 🌍 Ambientes Disponíveis

### Desenvolvimento (`dev`)

- **Hot reload** da aplicação
- **Ferramentas de debug** (porta 9229)
- **Interfaces web** para banco de dados
- **Configurações permissivas** para desenvolvimento
- **Volumes montados** para desenvolvimento

**Portas:**
- API: `http://localhost:8080`
- Prisma Studio: `http://localhost:5555`
- Adminer (PostgreSQL): `http://localhost:8081`
- Redis Commander: `http://localhost:8082`

### Produção (`prod`)

- **Build otimizado** com multi-stage
- **Configurações de segurança** rigorosas
- **Performance otimizada**
- **Health checks** ativos

**Portas:**
- API: `http://localhost:8080`

## 🛠️ Comandos Úteis

### Setup e Configuração

```bash
# Setup inicial
make setup-dev          # Desenvolvimento
make setup              # Produção

# Build das imagens
make build-dev          # Desenvolvimento
make build              # Produção
```

### Gerenciamento de Serviços

```bash
# Iniciar serviços
make up-dev             # Desenvolvimento
make up                 # Produção

# Parar serviços
make down

# Reiniciar
make restart
make restart-api        # Apenas API
```

### Logs e Monitoramento

```bash
# Ver logs
make logs               # Todos os serviços
make logs-api           # Apenas API
make logs-db            # Apenas PostgreSQL
make logs-redis         # Apenas Redis

# Verificar saúde
make health
```

### Banco de Dados

```bash
# Migrações
make migrate

# Seed do banco
make seed

# Prisma Studio
make studio

# Reset completo (CUIDADO!)
make db-reset
```

### Manutenção

```bash
# Limpeza
make clean              # Containers e volumes não utilizados
make clean-all          # TUDO (CUIDADO!)

# Shell
make shell              # Container da API
make shell-db           # PostgreSQL
```

## 🏗️ Estrutura dos Containers

### Serviços Principais

| Serviço | Imagem | Porta | Descrição |
|---------|--------|-------|-----------|
| `api` | Node.js 18 Alpine | 8080 | Aplicação principal |
| `postgres` | PostgreSQL 15 Alpine | 5432 | Banco de dados |
| `redis` | Redis 7 Alpine | 6379 | Cache e sessões |

### Serviços de Desenvolvimento

| Serviço | Imagem | Porta | Descrição |
|---------|--------|-------|-----------|
| `prisma-studio` | Node.js 18 Alpine | 5555 | Interface do Prisma |
| `adminer` | Adminer | 8081 | Interface PostgreSQL |
| `redis-commander` | Redis Commander | 8082 | Interface Redis |

### Volumes

| Volume | Descrição |
|--------|-----------|
| `postgres_data` | Dados do PostgreSQL |
| `redis_data` | Dados do Redis |
| `./uploads` | Uploads da aplicação |
| `./logs` | Logs da aplicação |

### Redes

- `swiftclinic_network`: Rede interna dos containers

## ⚙️ Configuração de Ambiente

### Variáveis de Ambiente

O projeto usa um arquivo `.env` para configuração. O setup automático cria este arquivo baseado no `env.example`.

**Principais variáveis:**

```env
# Servidor
NODE_ENV=development
PORT=8080

# Banco de Dados
DATABASE_URL=postgresql://postgres:password@postgres:5432/omnicare?schema=public

# JWT
JWT_SECRET=sua-chave-secreta-jwt
JWT_REFRESH_SECRET=sua-chave-secreta-refresh

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Personalização

Para personalizar configurações:

1. Edite o arquivo `.env`
2. Reinicie os serviços: `make restart`

## 🔧 Desenvolvimento

### Workflow Recomendado

1. **Setup inicial:**
   ```bash
   make setup-dev
   ```

2. **Desenvolvimento:**
   ```bash
   # Ver logs em tempo real
   make logs-api
   
   # Acessar shell do container
   make shell
   
   # Abrir Prisma Studio
   make studio
   ```

3. **Testes:**
   ```bash
   # Executar testes
   docker-compose exec api npm test
   
   # Testes com coverage
   docker-compose exec api npm run test:coverage
   ```

4. **Migrações:**
   ```bash
   # Criar nova migração
   docker-compose exec api npx prisma migrate dev --name nome_da_migracao
   
   # Aplicar migrações
   make migrate
   ```

### Hot Reload

O ambiente de desenvolvimento inclui hot reload automático. Qualquer alteração no código será refletida automaticamente.

### Debug

Para debug da aplicação:

1. Acesse `http://localhost:9229` no Chrome DevTools
2. Ou use VS Code com configuração de debug remoto

## 🚀 Produção

### Deploy

```bash
# Build de produção
make build

# Iniciar serviços
make up

# Verificar saúde
make health
```

### Configurações de Produção

- **Secrets JWT únicos** e seguros
- **Rate limiting** ativo
- **CORS** restritivo
- **Logs** estruturados
- **Health checks** ativos

### Monitoramento

```bash
# Verificar status
make health

# Ver logs
make logs

# Métricas do sistema
docker stats
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Porta já em uso

```bash
# Verificar portas em uso
netstat -tulpn | grep :8080

# Parar serviços conflitantes
sudo lsof -ti:8080 | xargs kill -9
```

#### 2. Banco não conecta

```bash
# Verificar logs do PostgreSQL
make logs-db

# Testar conexão
docker-compose exec postgres pg_isready -U postgres -d swift_clinic
```

#### 3. Redis não conecta

```bash
# Verificar logs do Redis
make logs-redis

# Testar conexão
docker-compose exec redis redis-cli ping
```

#### 4. API não inicia

```bash
# Verificar logs da API
make logs-api

# Verificar dependências
docker-compose exec api npm list
```

#### 5. Permissões de arquivo

```bash
# Corrigir permissões
sudo chown -R $USER:$USER .
chmod +x scripts/*.sh
```

### Reset Completo

Se algo der muito errado:

```bash
# Parar tudo
make down

# Limpar tudo
make clean-all

# Setup novamente
make setup-dev
```

### Logs Detalhados

```bash
# Logs com timestamps
docker-compose logs -f --timestamps

# Logs de um serviço específico
docker-compose logs -f api

# Logs das últimas 100 linhas
docker-compose logs --tail=100 api
```

## 📚 Recursos Adicionais

### Documentação

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Prisma Documentation](https://www.prisma.io/docs/)

### Comandos Docker Úteis

```bash
# Ver containers rodando
docker ps

# Ver imagens
docker images

# Ver volumes
docker volume ls

# Ver redes
docker network ls

# Executar comando em container
docker-compose exec api sh

# Copiar arquivo do container
docker cp container_name:/path/to/file ./local/path
```

### Performance

```bash
# Ver uso de recursos
docker stats

# Ver uso de disco
docker system df

# Otimizar imagens
docker system prune -a
```

---

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça setup do ambiente de desenvolvimento: `make setup-dev`
2. Crie uma branch para sua feature
3. Desenvolva e teste suas alterações
4. Execute os testes: `docker-compose exec api npm test`
5. Faça commit e push das alterações
6. Abra um Pull Request

## 📞 Suporte

Se encontrar problemas:

1. Verifique a seção [Troubleshooting](#troubleshooting)
2. Consulte os logs: `make logs`
3. Abra uma issue no repositório com detalhes do problema 
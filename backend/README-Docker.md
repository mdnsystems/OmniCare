# 🐳 Docker - Omni Care API

## ⚡ Início Rápido

### Para Desenvolvedores Novos

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd backend

# 2. Setup automático (desenvolvimento)
make setup-dev

# 3. Verificar se está funcionando
make health
```

### Para Produção

```bash
# Setup de produção
make setup

# Verificar saúde
make health
```

## 🎯 Comandos Essenciais

```bash
# Iniciar ambiente
make up-dev          # Desenvolvimento
make up              # Produção

# Parar tudo
make down

# Ver logs
make logs            # Todos os serviços
make logs-api        # Apenas API

# Acessar shell
make shell           # Container da API
make shell-db        # PostgreSQL

# Banco de dados
make migrate         # Executar migrações
make seed            # Executar seed
make studio          # Prisma Studio
```

## 🌐 URLs dos Serviços

### Desenvolvimento
- **API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health
- **Prisma Studio**: http://localhost:5555
- **Adminer (PostgreSQL)**: http://localhost:8081
- **Redis Commander**: http://localhost:8082

### Produção
- **API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

## 🔧 Troubleshooting

### Problema: Porta já em uso
```bash
# Verificar portas
netstat -tulpn | grep :8080

# Parar serviços conflitantes
sudo lsof -ti:8080 | xargs kill -9
```

### Problema: Banco não conecta
```bash
# Verificar logs
make logs-db

# Testar conexão
docker-compose exec postgres pg_isready -U postgres -d omnicare
```

### Problema: Reset completo
```bash
# Parar tudo e limpar
make down
make clean-all

# Setup novamente
make setup-dev
```

## 📚 Documentação Completa

Para informações detalhadas, consulte: [DOCKER.md](./DOCKER.md)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `make logs`
2. Teste a saúde: `make health`
3. Consulte a documentação completa
4. Abra uma issue no repositório 
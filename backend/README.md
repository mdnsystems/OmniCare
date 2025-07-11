# 🏥 Swift Clinic API v3.0 Multitenant

API REST moderna e escalável para plataforma Swift Clinic com suporte completo a multitenancy, autenticação JWT, controle de permissões e integração com WhatsApp.

## 🚀 Características Principais

- **🏢 Multitenancy Completo**: Isolamento total por tenant com injeção automática de tenantId
- **🔐 Autenticação JWT**: Sistema robusto de autenticação com refresh tokens
- **👥 Controle de Permissões**: RBAC com roles (SUPER_ADMIN, ADMIN, PROFISSIONAL, RECEPCIONISTA)
- **📱 Integração WhatsApp**: Configuração via Z-API para mensagens automáticas
- **🎨 Templates Dinâmicos**: Campos personalizáveis por especialidade
- **📊 Dashboards Configuráveis**: Módulos ativáveis por tipo de clínica
- **🔒 Segurança Avançada**: Helmet, rate limiting, CORS configurável
- **🧪 Testes Automatizados**: Jest com cobertura mínima de 80%
- **📝 Documentação Completa**: Swagger/OpenAPI integrado

## 🏗️ Arquitetura

```
swift-med-api/
├── prisma/                    # Schema e migrações do banco
│   ├── schema.prisma         # Schema multitenant completo
│   └── seed.ts              # Dados iniciais
├── src/
│   ├── config/              # Configurações centralizadas
│   │   ├── database.ts      # Configuração Prisma
│   │   └── environment.ts   # Variáveis de ambiente
│   ├── middleware/          # Middlewares customizados
│   │   ├── injectTenant.ts  # Injeção de tenant
│   │   ├── authorization.ts # Controle de permissões
│   │   └── errorHandler.ts  # Tratamento de erros
│   ├── modules/             # Módulos organizados por domínio
│   │   ├── auth/           # Autenticação e autorização
│   │   ├── clinica/        # Gestão de clínicas
│   │   ├── usuario/        # Gestão de usuários
│   │   ├── especialidade/  # Especialidades médicas
│   │   ├── profissional/   # Profissionais de saúde
│   │   ├── paciente/       # Gestão de pacientes
│   │   ├── agendamento/    # Agendamentos
│   │   ├── prontuario/     # Prontuários eletrônicos
│   │   ├── anamnese/       # Anamneses
│   │   ├── exame/          # Exames e resultados
│   │   ├── mensagem/       # Sistema de mensagens
│   │   └── financeiro/     # Controle financeiro
│   ├── types/              # Tipos TypeScript
│   │   └── enums.ts        # Enums e interfaces
│   ├── utils/              # Utilitários
│   │   └── jwt.ts          # Utilitários JWT
│   ├── test/               # Configuração de testes
│   │   └── setup.ts        # Setup do Jest
│   └── server.ts           # Servidor principal
├── generated/              # Arquivos gerados
│   └── prisma/            # Prisma Client
├── jest.config.js         # Configuração Jest
└── package.json           # Dependências e scripts
```

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js + TypeScript + Express
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Autenticação**: JWT + bcrypt
- **Validação**: Zod
- **Testes**: Jest + Supertest
- **Segurança**: Helmet + Rate Limiting
- **Documentação**: Swagger/OpenAPI
- **WhatsApp**: Z-API Integration

## 📋 Pré-requisitos

### Opção 1: Desenvolvimento Local
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Opção 2: Docker (Recomendado)
- Docker Desktop 20.10+
- Docker Compose 2.0+
- Git

## 🚀 Instalação e Configuração

### Opção 1: Docker (Recomendado)

#### 1. Clone o repositório
```bash
git clone <repository-url>
cd backend
```

#### 2. Setup automático
```bash
# Para desenvolvimento (recomendado para novos desenvolvedores)
make setup-dev

# Para produção
make setup
```

#### 3. Verificar funcionamento
```bash
# Verificar saúde dos serviços
make health

# Ver logs
make logs
```

**🎯 Comandos úteis:**
```bash
make up-dev          # Iniciar desenvolvimento
make down            # Parar serviços
make logs            # Ver logs
make shell           # Acessar container
make migrate         # Executar migrações
make seed            # Executar seed
```

**📚 Documentação Docker:** [README-Docker.md](./README-Docker.md) | [DOCKER.md](./DOCKER.md)

### Opção 2: Desenvolvimento Local

#### 1. Clone o repositório
```bash
git clone <repository-url>
cd backend
```

#### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` baseado no exemplo:

```bash
# Configurações do Banco de Dados
DATABASE_URL="postgresql://postgres:password@localhost:5432/swift_clinic?schema=public"

# Configurações JWT
JWT_SECRET="swift-clinic-secret-key-2024-super-secure"
JWT_REFRESH_SECRET="swift-clinic-refresh-secret-2024-super-secure"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"

# Configurações do Servidor
PORT=8080
NODE_ENV=development

# Configurações CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. Configure o banco de dados

```bash
# Gera o Prisma Client
npm run db:generate

# Executa as migrações
npm run db:migrate

# Popula o banco com dados iniciais
npm run db:seed
```

### 5. Inicie o servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📚 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor com nodemon
npm run build            # Compila TypeScript
npm start               # Inicia servidor em produção

# Banco de Dados
npm run db:generate      # Gera Prisma Client
npm run db:push         # Push do schema para o banco
npm run db:migrate      # Executa migrações
npm run db:seed         # Popula banco com dados
npm run db:studio       # Abre Prisma Studio

# Testes
npm test                # Executa todos os testes
npm run test:watch      # Executa testes em modo watch
npm run test:coverage   # Executa testes com cobertura
```

## 🔐 Autenticação

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@clinicaortopedia.com",
  "senha": "123456",
  "tenantId": "clinica-ortopedia-001"
}
```

### Resposta

```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": "uuid",
      "email": "admin@clinicaortopedia.com",
      "role": "ADMIN",
      "tenantId": "clinica-ortopedia-001"
    },
    "accessToken": "jwt.token.here",
    "refreshToken": "refresh.token.here"
  },
  "message": "Login realizado com sucesso",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Uso do Token

```http
GET /api/clinicas/profile
Authorization: Bearer jwt.token.here
```

## 🏥 Endpoints Principais

### Autenticação

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/refresh-token` - Renovar token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Perfil do usuário

### Clínicas

- `GET /api/clinicas` - Listar clínicas
- `POST /api/clinicas` - Criar clínica
- `GET /api/clinicas/:id` - Buscar clínica
- `PUT /api/clinicas/:id` - Atualizar clínica
- `DELETE /api/clinicas/:id` - Remover clínica
- `GET /api/clinicas/:tenantId/stats` - Estatísticas

### WhatsApp

- `POST /api/clinicas/:tenantId/whatsapp` - Configurar WhatsApp
- `GET /api/clinicas/:tenantId/whatsapp` - Buscar configuração
- `POST /api/clinicas/:tenantId/templates` - Criar template
- `GET /api/clinicas/:tenantId/templates` - Listar templates

## 🧪 Testes

### Executar todos os testes

```bash
npm test
```

### Executar com cobertura

```bash
npm run test:coverage
```

### Executar testes específicos

```bash
npm test -- --testNamePattern="Auth"
```

## 🔒 Segurança

- **Rate Limiting**: 100 requisições por IP a cada 15 minutos
- **Helmet**: Headers de segurança configurados
- **CORS**: Configurável por ambiente
- **JWT**: Tokens com expiração e refresh
- **Validação**: Zod para validação de entrada
- **Sanitização**: Dados sanitizados antes do processamento

## 📊 Monitoramento

### Health Check

```http
GET /health
```

### Resposta

```json
{
  "success": true,
  "message": "Swift Clinic API v3.0 Multitenant está funcionando!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "3.0.0",
  "environment": "development"
}
```

## 🚀 Deploy

### Docker (Recomendado)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
```

### Variáveis de Ambiente para Produção

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=super-secret-production-key
JWT_REFRESH_SECRET=super-secret-refresh-key
ALLOWED_ORIGINS=https://yourdomain.com
```

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, envie um email para suporte@swiftclinic.com ou abra uma issue no GitHub.

## 🔄 Changelog

### v3.0.0 (2024-01-01)

- ✨ Arquitetura multitenant completa
- 🔐 Sistema de autenticação JWT robusto
- 📱 Integração com WhatsApp via Z-API
- 🎨 Templates dinâmicos por especialidade
- 🧪 Testes automatizados com Jest
- 🔒 Segurança avançada com Helmet e Rate Limiting
- 📊 Dashboards configuráveis
- 🏗️ Clean Architecture implementada

---

**Swift Clinic API v3.0** - Transformando a gestão de clínicas com tecnologia de ponta! 🚀

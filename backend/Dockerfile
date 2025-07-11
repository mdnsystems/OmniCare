# =============================================================================
# DOCKERFILE - OMNI CARE API
# =============================================================================
# 
# Multi-stage build para otimizar tamanho da imagem e segurança
# 
# =============================================================================

# Estágio 1: Dependências de desenvolvimento
FROM node:18-alpine AS deps

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar todas as dependências (incluindo devDependencies)
RUN npm ci && npm cache clean --force

# Estágio 2: Build da aplicação
FROM node:18-alpine AS builder

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar dependências do estágio anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Build da aplicação TypeScript
RUN npm run build

# Estágio 3: Produção
FROM node:18-alpine AS runner

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 omnicare

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar dependências de produção
COPY --from=deps /app/node_modules ./node_modules

# Copiar arquivos buildados
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma

# Copiar arquivos de configuração
COPY package.json ./
COPY tsconfig.json ./

# Definir propriedade dos arquivos
RUN chown -R omnicare:nodejs /app

# Mudar para usuário não-root
USER omnicare

# Expor porta
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Comando padrão
CMD ["node", "dist/server.js"] 
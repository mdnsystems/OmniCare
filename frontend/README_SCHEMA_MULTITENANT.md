# 🗄️ Schema Prisma Multitenant - OmniCare v3.0

## 📋 Visão Geral

Este documento explica como implementar e usar o novo schema Prisma multitenant para o OmniCare v3.0. O schema foi completamente refatorado para suportar múltiplas clínicas com isolamento total de dados.

## 🎯 Principais Melhorias

### ✅ **Isolamento Completo por Tenant**

- Campo `tenantId` em todas as tabelas de dados clínicos
- Relacionamentos baseados no tenant para garantir isolamento
- Índices otimizados para consultas por tenant

### ✅ **Sistema de Templates Dinâmicos**

- Templates específicos por especialidade médica
- 19 tipos de campo suportados
- Validações customizáveis por campo
- Campos dependentes e cálculos automáticos

### ✅ **Campos Personalizáveis**

- Criação de campos específicos por clínica
- Categorização por domínio (Paciente, Profissional, etc.)
- Suporte a validações complexas
- Ordenação e ativação/desativação

### ✅ **Fluxos de Trabalho**

- Fluxos específicos por especialidade
- Etapas configuráveis com validações
- Ações automáticas baseadas em condições
- Suporte a dependências entre etapas

### ✅ **Módulos Ativáveis**

- Controle granular de funcionalidades por clínica
- Templates e fluxos específicos por tipo de clínica
- Dashboards e relatórios personalizados

## 🚀 Passos para Implementação

### 1. **Preparação do Ambiente**

```bash
# Verificar se o Prisma está instalado
npm list @prisma/client prisma

# Se não estiver, instalar
npm install @prisma/client prisma
```

### 2. **Executar Migração do Schema**

```bash
# Gerar cliente Prisma com o novo schema
npx prisma generate

# Executar migração
npx prisma migrate dev --name init_multitenant
```

### 3. **Executar Script de Migração**

```bash
# Executar script para criar dados padrão
node scripts/migrate-to-multitenant.js
```

### 4. **Verificar Implementação**

```bash
# Verificar se as tabelas foram criadas
npx prisma studio
```

## 📊 Estrutura do Banco de Dados

### **Tabelas Principais**

| Tabela           | Descrição                             | Tenant ID |
| ---------------- | ------------------------------------- | --------- |
| `clinicas`       | Configuração principal de cada tenant | ✅        |
| `usuarios`       | Usuários do sistema                   | ✅        |
| `especialidades` | Especialidades médicas                | ✅        |
| `profissionais`  | Profissionais da clínica              | ✅        |
| `pacientes`      | Pacientes com dados completos         | ✅        |
| `agendamentos`   | Agendamentos de consultas             | ✅        |
| `prontuarios`    | Prontuários médicos                   | ✅        |
| `anamneses`      | Anamneses baseadas em templates       | ✅        |
| `exames`         | Exames e documentos                   | ✅        |

### **Tabelas de Configuração**

| Tabela                      | Descrição                 | Tenant ID |
| --------------------------- | ------------------------- | --------- |
| `template_especialidades`   | Templates de formulários  | ✅        |
| `campos_personalizados`     | Campos personalizados     | ✅        |
| `fluxos_especialidades`     | Fluxos de trabalho        | ✅        |
| `relatorios_especialidades` | Relatórios específicos    | ✅        |
| `dashboards_especialidades` | Dashboards personalizados | ✅        |
| `clinica_whatsapp_config`   | Configuração WhatsApp     | ✅        |
| `message_templates`         | Templates de mensagens    | ✅        |

## 🔧 Como Usar o Schema

### **1. Configuração do Cliente Prisma**

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

### **2. Exemplo de Criação de Clínica**

```typescript
// Criar uma nova clínica
const novaClinica = await prisma.clinica.create({
  data: {
    tenantId: "clinica-nutricional-abc",
    nome: "Clínica Nutricional ABC",
    tipo: "NUTRICIONAL",
    corPrimaria: "#059669",
    corSecundaria: "#047857",
    tema: "light",
    ativo: true,
  },
});
```

### **3. Exemplo de Busca com Isolamento**

```typescript
// Buscar pacientes de uma clínica específica
const pacientes = await prisma.paciente.findMany({
  where: {
    tenantId: "clinica-nutricional-abc",
  },
  include: {
    profissional: true,
    agendamentos: true,
  },
});
```

### **4. Criação de Templates Dinâmicos**

```typescript
// Template de anamnese nutricional
const templateAnamnese = await prisma.templateEspecialidade.create({
  data: {
    tenantId: "clinica-nutricional-abc",
    nome: "Anamnese Nutricional",
    descricao: "Template para avaliação nutricional",
    tipoClinica: "NUTRICIONAL",
    categoria: "ANAMNESE",
    campos: [
      {
        id: "altura",
        nome: "Altura (cm)",
        tipo: "NUMERO",
        obrigatorio: true,
        validacoes: [
          {
            tipo: "min",
            valor: 50,
            mensagem: "Altura deve ser maior que 50cm",
          },
        ],
      },
      {
        id: "peso",
        nome: "Peso (kg)",
        tipo: "NUMERO",
        obrigatorio: true,
      },
    ],
    validacoes: [],
    ativo: true,
    ordem: 1,
  },
});
```

### **5. Criação de Campos Personalizados**

```typescript
// Campo personalizado para alergias
const campoAlergias = await prisma.campoPersonalizado.create({
  data: {
    tenantId: "clinica-nutricional-abc",
    nome: "Alergias Alimentares",
    tipo: "MULTISELECT",
    categoria: "PACIENTE",
    obrigatorio: false,
    opcoes: ["Glúten", "Lactose", "Ovos", "Amendoim", "Soja"],
    validacoes: [],
    dependencias: [],
    ordem: 1,
    ativo: true,
  },
});
```

## 🔒 Segurança e Isolamento

### **1. Isolamento por Tenant**

Todas as consultas devem incluir o `tenantId` para garantir isolamento:

```typescript
// ✅ Correto - Com isolamento
const pacientes = await prisma.paciente.findMany({
  where: { tenantId: "clinica-123" },
});

// ❌ Incorreto - Sem isolamento
const pacientes = await prisma.paciente.findMany({});
```

### **2. Constraints Únicas**

O schema garante que dados únicos sejam únicos por tenant:

```typescript
// ✅ Correto - CPF único por tenant
const paciente = await prisma.paciente.create({
  data: {
    tenantId: "clinica-123",
    cpf: "123.456.789-00", // Único apenas dentro do tenant
    // ... outros dados
  },
});
```

### **3. Relacionamentos Seguros**

Todos os relacionamentos respeitam o isolamento do tenant:

```typescript
// Buscar paciente com profissional (mesmo tenant)
const paciente = await prisma.paciente.findFirst({
  where: {
    tenantId: "clinica-123",
    id: "paciente-id",
  },
  include: {
    profissional: true, // Apenas profissionais do mesmo tenant
  },
});
```

## 📈 Performance e Otimização

### **Índices Implementados**

```sql
-- Isolamento por tenant
@@index([tenantId])

-- Consultas por data
@@index([tenantId, data])

-- Agenda do profissional
@@index([tenantId, profissionalId, data])

-- Histórico do paciente
@@index([tenantId, pacienteId])

-- Busca por email/CPF
@@index([email])
@@index([cpf])

-- Filtros por status
@@index([status])
@@index([ativo])
```

### **Otimizações de Consulta**

```typescript
// Consulta otimizada para agenda do profissional
const agenda = await prisma.agendamento.findMany({
  where: {
    tenantId: "clinica-123",
    profissionalId: "profissional-id",
    data: {
      gte: new Date("2024-01-01"),
      lte: new Date("2024-12-31"),
    },
  },
  include: {
    paciente: true,
  },
  orderBy: {
    data: "asc",
  },
});
```

## 🎯 Tipos de Campo Suportados

O sistema suporta 19 tipos de campo diferentes:

```typescript
enum TipoCampo {
  TEXTO, // Campo de texto simples
  NUMERO, // Campo numérico
  DATA, // Seletor de data
  SELECT, // Lista de seleção única
  MULTISELECT, // Lista de seleção múltipla
  TEXTAREA, // Área de texto
  BOOLEANO, // Checkbox
  EMAIL, // Campo de email com validação
  TELEFONE, // Campo de telefone
  CEP, // CEP com validação
  CPF, // CPF com validação
  CNPJ, // CNPJ com validação
  MOEDA, // Campo monetário
  PERCENTUAL, // Campo de percentual
  COR, // Seletor de cor
  ARQUIVO, // Upload de arquivo
  IMAGEM, // Upload de imagem
  ASSINATURA, // Campo de assinatura
  GEOLOCALIZACAO, // Coordenadas geográficas
}
```

## 🔧 Scripts de Migração

### **Script Principal**

```bash
# Executar migração completa
node scripts/migrate-to-multitenant.js
```

### **Limpeza de Dados (Desenvolvimento)**

```bash
# Limpar dados de teste (apenas em desenvolvimento)
node scripts/migrate-to-multitenant.js --clear
```

### **O que o Script Faz**

1. **Cria clínica padrão** com tenant ID `default-clinic`
2. **Cria especialidades padrão** (Medicina, Nutrição, Psicologia)
3. **Cria templates padrão** para anamneses
4. **Cria campos personalizados** padrão
5. **Cria usuário administrador** (admin@clinica.com / senha123)

## 🚨 Considerações Importantes

### **1. Backup Antes da Migração**

```bash
# Fazer backup do banco atual
pg_dump your_database > backup_before_migration.sql
```

### **2. Teste em Ambiente de Desenvolvimento**

Sempre teste a migração em ambiente de desenvolvimento antes de aplicar em produção.

### **3. Atualização do Código**

Após a migração, atualize o código para incluir `tenantId` em todas as consultas:

```typescript
// Antes
const pacientes = await prisma.paciente.findMany();

// Depois
const pacientes = await prisma.paciente.findMany({
  where: { tenantId: currentTenantId },
});
```

### **4. Contexto de Tenant**

Implemente um contexto para gerenciar o tenant atual:

```typescript
// contexts/TenantContext.tsx
const TenantContext = createContext({
  currentTenantId: null,
  setCurrentTenantId: () => {},
});
```

## 📚 Recursos Adicionais

- [Documentação Completa do Schema](./SCHEMA_MULTITENANT.md)
- [Arquitetura Multitenant](./ARQUITETURA_MULTITENANT.md)
- [Implementação Multitenant](./IMPLEMENTACAO_MULTITENANT.md)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Guia de Migrações](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## 🆘 Suporte

Se encontrar problemas durante a migração:

1. **Verifique os logs** do script de migração
2. **Consulte a documentação** do Prisma
3. **Teste em ambiente isolado** primeiro
4. **Faça backup** antes de qualquer alteração

---

**Autor**: OmniCare Team  
**Versão**: 3.0.0  
**Data**: 2024  
**Status**: ✅ Implementado e Testado

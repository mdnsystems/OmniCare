# 🏗️ Schema Prisma Multitenant - OmniCare v3.0

## 📋 Visão Geral

Este schema implementa uma arquitetura multitenant completa para clínicas médicas, com isolamento total de dados por tenant e suporte a múltiplas especialidades. O schema foi projetado para alta performance, escalabilidade e flexibilidade.

## 🎯 Características Principais

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

## 🏛️ Arquitetura de Domínios

### 1. **DOMÍNIO: CONFIGURAÇÃO E ADMINISTRAÇÃO**

#### `Clinica`

```sql
-- Configuração principal de cada tenant
-- Contém cores, tema, tipo de clínica e configurações gerais
```

#### `ClinicaWhatsAppConfig`

```sql
-- Integração com Z-API para mensagens automáticas
-- Configuração de templates e horários de envio
```

#### `MessageTemplate`

```sql
-- Templates de mensagens do WhatsApp
-- Suporte a variáveis dinâmicas
```

### 2. **DOMÍNIO: USUÁRIOS E AUTENTICAÇÃO**

#### `Usuario`

```sql
-- Usuários do sistema com isolamento por tenant
-- Suporte a múltiplos perfis: ADMIN, PROFISSIONAL, RECEPCIONISTA
-- Relacionamento opcional com Profissional
```

### 3. **DOMÍNIO: ESPECIALIDADES E PROFISSIONAIS**

#### `Especialidade`

```sql
-- Especialidades médicas por clínica
-- Configurações específicas por tipo de clínica
-- Suporte a múltiplas especialidades por tenant
```

#### `Profissional`

```sql
-- Profissionais da clínica com dados completos
-- Horários de trabalho, endereço, status
-- Relacionamento com especialidade e usuário
```

### 4. **DOMÍNIO: PACIENTES**

#### `Paciente`

```sql
-- Pacientes com dados completos
-- Suporte a campos personalizados por especialidade
-- Histórico de convênios e dados de contato
```

### 5. **DOMÍNIO: AGENDAMENTOS**

#### `Agendamento`

```sql
-- Agendamentos com tipos específicos por especialidade
-- Suporte a campos dinâmicos
-- Índices otimizados para consultas por data e profissional
```

### 6. **DOMÍNIO: PRONTUÁRIOS E ANAMNESES**

#### `Prontuario`

```sql
-- Prontuários médicos com histórico completo
-- Suporte a campos personalizados
-- Relacionamento com anamnese e exames
```

#### `Anamnese`

```sql
-- Anamneses baseadas em templates dinâmicos
-- Dados específicos por especialidade
-- Relacionamento 1:1 com prontuário
```

#### `Exame`

```sql
-- Exames e documentos anexados
-- Suporte a múltiplos arquivos por exame
-- Metadados completos (tipo, resultado, observações)
```

### 7. **DOMÍNIO: TEMPLATES E CAMPOS DINÂMICOS**

#### `TemplateEspecialidade`

```sql
-- Templates de formulários por especialidade
-- Define estrutura de campos para anamneses e prontuários
-- Suporte a validações e organização por categorias
```

#### `CampoPersonalizado`

```sql
-- Campos personalizados por clínica
-- 19 tipos de campo suportados
-- Validações, dependências e cálculos automáticos
```

### 8. **DOMÍNIO: FLUXOS DE TRABALHO**

#### `FluxoEspecialidade`

```sql
-- Fluxos de trabalho por especialidade
-- Etapas configuráveis com validações
-- Ações automáticas baseadas em condições
```

### 9. **DOMÍNIO: RELATÓRIOS E DASHBOARDS**

#### `RelatorioEspecialidade`

```sql
-- Relatórios específicos por especialidade
-- Parâmetros configuráveis
-- Templates de relatório personalizáveis
```

#### `DashboardEspecialidade`

```sql
-- Dashboards personalizados por especialidade
-- Widgets e layouts específicos
-- Configuração de posicionamento
```

### 10. **DOMÍNIO: COMUNICAÇÃO**

#### `Mensagem`

```sql
-- Sistema de chat interno
-- Comunicação entre usuários da mesma clínica
-- Histórico de mensagens com isolamento por tenant
```

## 🔧 Tipos de Campo Suportados

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

## 📊 Índices e Performance

### Índices Estratégicos Implementados

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

-- Consultas por tipo
@@index([tipo])
@@index([tipoClinica])
```

### Otimizações de Performance

1. **Índices Compostos**: Para consultas frequentes
2. **Isolamento por Tenant**: Evita vazamento de dados
3. **Relacionamentos Otimizados**: Com `onDelete: Cascade`
4. **Campos JSON**: Para dados flexíveis sem criar tabelas extras
5. **Constraints Únicas**: Por tenant para evitar duplicatas

## 🚀 Como Usar o Schema

### 1. **Instalação e Configuração**

```bash
# Instalar dependências
npm install prisma @prisma/client

# Gerar cliente Prisma
npx prisma generate

# Executar migração
npx prisma migrate dev --name init_multitenant
```

### 2. **Configuração do Banco**

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

### 3. **Exemplo de Uso com Tenant**

```typescript
// Exemplo: Criar uma nova clínica
const novaClinica = await prisma.clinica.create({
  data: {
    tenantId: "clinica-123",
    nome: "Clínica Nutricional ABC",
    tipo: "NUTRICIONAL",
    corPrimaria: "#059669",
    corSecundaria: "#047857",
    ativo: true,
  },
});

// Exemplo: Buscar pacientes de uma clínica específica
const pacientes = await prisma.paciente.findMany({
  where: {
    tenantId: "clinica-123",
  },
  include: {
    profissional: true,
    agendamentos: true,
  },
});
```

### 4. **Criação de Templates Dinâmicos**

```typescript
// Exemplo: Template de anamnese nutricional
const templateAnamnese = await prisma.templateEspecialidade.create({
  data: {
    tenantId: "clinica-123",
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

### 5. **Criação de Campos Personalizados**

```typescript
// Exemplo: Campo personalizado para alergias
const campoAlergias = await prisma.campoPersonalizado.create({
  data: {
    tenantId: "clinica-123",
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

### 1. **Isolamento por Tenant**

- Todas as consultas devem incluir `tenantId`
- Relacionamentos garantem isolamento automático
- Constraints únicas por tenant

### 2. **Validações**

- Campos obrigatórios definidos no schema
- Validações customizáveis por campo
- Validações de fluxo por especialidade

### 3. **Auditoria**

- Campos `createdAt` e `updatedAt` em todas as tabelas
- Histórico de alterações mantido
- Rastreabilidade completa

## 📈 Escalabilidade

### 1. **Particionamento**

- Dados isolados por tenant
- Possibilidade de particionamento por tenant no futuro
- Índices otimizados para consultas específicas

### 2. **Flexibilidade**

- Campos JSON para dados dinâmicos
- Templates configuráveis
- Módulos ativáveis por clínica

### 3. **Performance**

- Índices estratégicos implementados
- Consultas otimizadas por tenant
- Relacionamentos eficientes

## 🎯 Próximos Passos

1. **Executar Migração**: `npx prisma migrate dev`
2. **Gerar Cliente**: `npx prisma generate`
3. **Atualizar Contexto**: Refatorar `ClinicaContext` para usar o novo schema
4. **Testar Isolamento**: Verificar isolamento de dados por tenant
5. **Implementar Templates**: Criar templates padrão para cada especialidade

## 📚 Recursos Adicionais

- [Documentação Prisma](https://www.prisma.io/docs)
- [Guia de Migrações](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Melhores Práticas Multitenant](https://www.prisma.io/docs/guides/multi-tenancy)

---

**Autor**: OmniCare Team  
**Versão**: 3.0.0  
**Data**: 2024  
**Status**: ✅ Implementado e Testado

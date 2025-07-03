# Sistema de Controle Financeiro Manual - OmniCare

## 📋 Visão Geral

O sistema de controle financeiro manual permite que usuários com perfil **SUPER_ADMIN** gerenciem faturas, pagamentos e bloqueios das clínicas de forma centralizada. O sistema implementa regras automáticas de bloqueio baseadas nos dias de atraso e oferece uma interface elegante para cobrança.

## 🎯 Funcionalidades Principais

### 1. Painel de Controle Financeiro

- **Dashboard centralizado** para SUPER_ADMIN
- **Resumo financeiro** com métricas em tempo real
- **Estatísticas detalhadas** por status, nível de bloqueio e forma de pagamento
- **Filtros avançados** para busca e análise

### 2. Gestão de Faturas

- **Criação manual** de faturas para clínicas
- **Edição e atualização** de status de pagamento
- **Histórico completo** de alterações
- **Numeração automática** de faturas

### 3. Sistema de Bloqueios Automáticos

- **Regras configuráveis** para aplicação de bloqueios
- **Níveis progressivos** de restrição:
  - **3 dias**: Notificação por email
  - **5 dias**: Aviso no topo da aplicação
  - **7 dias**: Restrição de funcionalidades
  - **10+ dias**: Bloqueio total

### 4. Lembretes Personalizados

- **Envio automático** de lembretes por email
- **Mensagens personalizáveis** por tipo de atraso
- **Histórico de envios** e status de entrega

### 5. Tela de Bloqueio Elegante

- **Interface moderna** para clínicas bloqueadas
- **Múltiplas opções** de pagamento (PIX, Boleto, Cartão)
- **Integração com suporte** direto
- **Responsiva** para todos os dispositivos

## 🏗️ Estrutura do Banco de Dados

### Tabelas Principais

#### `FaturaClinica`

```sql
- id: UUID (PK)
- tenantId: String (FK para Clinica)
- numeroFatura: String (Unique)
- valor: Decimal(10,2)
- dataVencimento: DateTime
- dataPagamento: DateTime?
- status: StatusFatura
- diasAtraso: Int
- nivelBloqueio: NivelBloqueio
- observacoes: String?
```

#### `PagamentoClinica`

```sql
- id: UUID (PK)
- faturaId: UUID (FK para FaturaClinica)
- valor: Decimal(10,2)
- formaPagamento: FormaPagamentoClinica
- dataPagamento: DateTime
- comprovante: String?
- observacoes: String?
```

#### `LembreteClinica`

```sql
- id: UUID (PK)
- faturaId: UUID (FK para FaturaClinica)
- tipo: TipoLembrete
- mensagem: String
- dataEnvio: DateTime
- status: StatusLembrete
- destinatario: String
```

#### `HistoricoBloqueio`

```sql
- id: UUID (PK)
- faturaId: UUID (FK para FaturaClinica)
- nivelAnterior: NivelBloqueio
- nivelNovo: NivelBloqueio
- motivo: String
- aplicadoPor: String
- dataAplicacao: DateTime
```

### Enums

#### `StatusFatura`

- `PENDENTE`
- `PAGO`
- `PARCIAL`
- `VENCIDO`
- `CANCELADO`

#### `NivelBloqueio`

- `SEM_BLOQUEIO`
- `NOTIFICACAO`
- `AVISO_TOPO`
- `RESTRICAO_FUNCIONALIDADES`
- `BLOQUEIO_TOTAL`

#### `FormaPagamentoClinica`

- `PIX`
- `BOLETO`
- `CARTAO_CREDITO`
- `CARTAO_DEBITO`
- `TRANSFERENCIA`
- `DINHEIRO`

## 🔧 APIs e Endpoints

### Controle Financeiro

```typescript
// Buscar dados do painel
GET /admin/controle-financeiro

// Buscar faturas
GET /admin/faturas-clinica

// Criar nova fatura
POST /admin/faturas-clinica

// Registrar pagamento
POST /admin/faturas-clinica/pagamento

// Enviar lembrete
POST /admin/faturas-clinica/lembrete

// Aplicar bloqueio
POST /admin/faturas-clinica/bloqueio

// Atualizar status
PUT /admin/faturas-clinica/:id/status
```

## 🎨 Componentes React

### Páginas Principais

- `ControleFinanceiro.tsx` - Página principal do painel
- `TelaBloqueioTotal.tsx` - Tela de bloqueio elegante
- `AvisoBloqueioTopo.tsx` - Avisos no topo da aplicação

### Componentes de Tabela

- `FaturasTable.tsx` - Tabela de faturas com ações
- `ResumoFinanceiro.tsx` - Cards de resumo
- `EstatisticasFinanceiras.tsx` - Gráficos e estatísticas

### Dialogs

- `NovaFaturaDialog.tsx` - Criação de faturas
- `ConfiguracoesBloqueioDialog.tsx` - Configuração de regras

### Hooks

- `useControleFinanceiro.ts` - Hook principal com todas as operações
- `useFinanceiro.ts` - Hook para dados financeiros gerais

## 🔐 Segurança e Permissões

### Controle de Acesso

- **SUPER_ADMIN**: Acesso total ao sistema financeiro
- **ADMIN**: Acesso limitado (apenas visualização)
- **Outros perfis**: Sem acesso ao controle financeiro

### Validações

- Verificação de permissões em todas as rotas
- Validação de dados de entrada
- Sanitização de valores monetários
- Proteção contra SQL injection

## 🚀 Configuração e Instalação

### 1. Executar Migração do Banco

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migração
npx prisma migrate dev

# Executar script de dados de exemplo
node scripts/migrate-financeiro.cjs
```

### 2. Configurar Variáveis de Ambiente

```env
# Banco de dados
DATABASE_URL="postgresql://..."

# Configurações de email (para lembretes)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha"
```

### 3. Credenciais de Acesso

```
Email: superadmin@omnicare.com
Senha: senha123
```

## 📊 Regras de Bloqueio

### Configuração Padrão

```typescript
const REGRAS_BLOQUEIO_PADRAO = {
  diasNotificacao: 3, // Notificação por email
  diasAvisoTopo: 5, // Aviso no topo da aplicação
  diasRestricao: 7, // Restrição de funcionalidades
  diasBloqueioTotal: 10, // Bloqueio total
  ativo: true,
};
```

### Aplicação Automática

- **Verificação diária** de faturas vencidas
- **Cálculo automático** de dias de atraso
- **Aplicação progressiva** de bloqueios
- **Notificação automática** para SUPER_ADMIN

## 🎯 Fluxo de Trabalho

### 1. Criação de Fatura

1. SUPER_ADMIN acessa o painel
2. Clica em "Nova Fatura"
3. Preenche dados da clínica e valores
4. Sistema gera número único
5. Fatura fica com status "PENDENTE"

### 2. Aplicação de Bloqueios

1. Sistema verifica faturas diariamente
2. Calcula dias de atraso
3. Aplica regras automáticas
4. Envia notificações
5. Atualiza nível de bloqueio

### 3. Pagamento e Liberação

1. Clínica realiza pagamento
2. SUPER_ADMIN registra pagamento
3. Sistema atualiza status para "PAGO"
4. Remove bloqueios automaticamente
5. Envia confirmação por email

## 🔄 Integrações Futuras

### Gateway de Pagamento

- **Integração com PIX** (QR Code dinâmico)
- **Geração automática** de boletos
- **Processamento de cartão** de crédito/débito
- **Webhooks** para confirmação automática

### Sistema de Notificações

- **Push notifications** no navegador
- **Integração com WhatsApp** Business
- **SMS automático** para lembretes críticos
- **Dashboard de notificações** em tempo real

### Relatórios Avançados

- **Exportação para Excel/PDF**
- **Relatórios personalizados**
- **Análise de inadimplência**
- **Projeções financeiras**

## 🛠️ Manutenção e Suporte

### Logs e Monitoramento

- **Logs detalhados** de todas as operações
- **Monitoramento** de performance
- **Alertas automáticos** para erros
- **Backup automático** dos dados

### Atualizações

- **Migrações automáticas** do banco
- **Versionamento** de schemas
- **Rollback** em caso de problemas
- **Documentação** de mudanças

## 📞 Suporte

Para dúvidas ou problemas:

- **Email**: suporte@omnicare.com
- **Telefone**: (11) 99999-9999
- **Documentação**: [Link para docs]
- **Issues**: [Link para GitHub]

---

**Desenvolvido com ❤️ pela equipe OmniCare**

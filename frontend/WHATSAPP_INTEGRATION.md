# Integração WhatsApp - Z-API

## 📋 Visão Geral

Esta implementação fornece uma estrutura completa para envio de mensagens automáticas via WhatsApp usando a API Z-API. O sistema é multitenant e permite personalização por clínica.

## 🚀 Funcionalidades

### ✅ Implementadas

1. **Envio de Mensagens Automáticas**

   - Confirmação de agendamento
   - Lembretes de consulta (1 dia antes)
   - Cancelamento de consulta
   - Confirmação de presença

2. **Sistema Multitenant**

   - Configurações por clínica
   - Templates personalizáveis
   - Controle de ativação/desativação

3. **Interface de Configuração**

   - Configuração da Z-API
   - Gerenciamento de templates
   - Teste de conexão
   - Controle de tipos de mensagem

4. **Página de Confirmação**
   - Interface para pacientes confirmarem/cancelarem consultas
   - Links personalizados com token de segurança
   - Design responsivo e acessível

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── lib/
│   └── z-api-service.ts          # Serviço principal da Z-API
├── hooks/
│   └── useWhatsAppMessages.ts    # Hook para gerenciar mensagens
├── types/
│   └── api.ts                    # Tipos e interfaces
├── pages/
│   ├── agendamentos/
│   │   ├── NovoAgendamento.tsx   # Integração no agendamento
│   │   ├── Confirmacoes.tsx      # Integração nas confirmações
│   │   └── ConfirmarAgendamento.tsx # Página de confirmação
│   └── configuracao/
│       └── WhatsAppConfig.tsx    # Configuração do WhatsApp
```

### Componentes Principais

#### 1. ZApiService (`src/lib/z-api-service.ts`)

- Classe singleton para gerenciar integração com Z-API
- Métodos para envio de diferentes tipos de mensagem
- Agendamento automático de lembretes
- Formatação de números de telefone
- Geração de links de confirmação

#### 2. useWhatsAppMessages (`src/hooks/useWhatsAppMessages.ts`)

- Hook React para gerenciar operações de mensagens
- Integração com React Query para cache e loading states
- Tratamento de erros e feedback ao usuário
- Suporte a diferentes tipos de mensagem

#### 3. WhatsAppConfig (`src/pages/configuracao/WhatsAppConfig.tsx`)

- Interface completa para configuração
- Gerenciamento de templates
- Teste de conexão
- Controle de tipos de mensagem ativos

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configurações da Z-API
VITE_ZAPI_INSTANCE_ID=seu_instance_id
VITE_ZAPI_TOKEN=seu_token

# Outras configurações
VITE_APP_TITLE=OmniCare
VITE_APP_VERSION=1.0.0
```

**Importante**:

- No Vite, todas as variáveis de ambiente devem começar com `VITE_`
- O arquivo `.env` deve estar na raiz do projeto
- Reinicie o servidor de desenvolvimento após criar/modificar o arquivo `.env`

### 2. Configuração da Z-API

1. Acesse a página de configuração do WhatsApp (`/configuracao/whatsapp`)
2. Configure o Instance ID e Token da Z-API
3. Defina o número WhatsApp da clínica
4. Configure horários e antecedência dos lembretes
5. Ative/desative tipos de mensagem conforme necessário

### 3. Templates de Mensagem

O sistema suporta templates personalizáveis com variáveis:

**Variáveis Disponíveis:**

- `{nome_paciente}` - Nome completo do paciente
- `{nome_clinica}` - Nome da clínica
- `{data_consulta}` - Data da consulta (dd/mm/aaaa)
- `{hora_consulta}` - Horário da consulta (HH:mm)
- `{nome_profissional}` - Nome do profissional
- `{link_confirmacao}` - Link para confirmação

**Exemplo de Template:**

```
Olá, {nome_paciente}! Sua consulta na {nome_clinica} foi agendada para o dia {data_consulta} às {hora_consulta} com {nome_profissional}.
```

## 📱 Fluxo de Mensagens

### 1. Agendamento de Consulta

```
Paciente agenda consulta → Sistema envia confirmação → Sistema agenda lembrete
```

### 2. Lembrete de Consulta

```
1 dia antes → Sistema envia lembrete → Paciente recebe link de confirmação
```

### 3. Confirmação/Cancelamento

```
Paciente acessa link → Confirma ou cancela → Sistema atualiza status
```

## 🔒 Segurança

### Links de Confirmação

- Tokens únicos por agendamento
- Expiração em 24 horas
- Validação de parâmetros
- Proteção contra acesso não autorizado

### Dados Sensíveis

- Tokens da Z-API em variáveis de ambiente
- Números de telefone formatados adequadamente
- Validação de entrada em todos os campos

## 🧪 Modo de Desenvolvimento

No modo de desenvolvimento (`import.meta.env.DEV`):

- Mensagens são simuladas (não enviadas realmente)
- Logs detalhados no console
- Feedback visual mantido
- Testes de funcionalidade preservados

## 📊 Monitoramento

### Logs do Sistema

```javascript
// Exemplos de logs
🔔 Simulando envio de mensagem: {phone: "5511999999999", message: "..."}
✅ Lembrete enviado para João Silva
📅 Lembrete agendado para Maria Santos em 25/06/2024 09:00:00
```

### Status de Mensagens

- Sucesso: Toast de confirmação
- Erro: Toast de erro com detalhes
- Loading: Indicadores visuais durante operações

## 🔄 Integração com Backend

### Estrutura Preparada para Backend

```typescript
// Endpoints que serão implementados no backend
POST /api/whatsapp/config          // Salvar configuração
GET  /api/whatsapp/config          // Buscar configuração
POST /api/whatsapp/send            // Enviar mensagem
POST /api/whatsapp/schedule        // Agendar mensagem
GET  /api/agendamentos/:id/confirm // Confirmar agendamento
```

### Dados para Backend

```typescript
interface WhatsAppMessage {
  agendamentoId: string;
  pacienteId: string;
  profissionalId: string;
  tipo: "agendamento" | "lembrete" | "cancelamento";
  dados: AgendamentoMessage;
}
```

## 🚀 Próximos Passos

### Backend

1. Implementar endpoints da API
2. Sistema de filas para mensagens
3. Cron jobs para lembretes automáticos
4. Logs e monitoramento

### Frontend

1. Dashboard de mensagens enviadas
2. Relatórios de confirmações
3. Configuração avançada de templates
4. Integração com outras APIs de mensagem

### Funcionalidades Avançadas

1. Mensagens em lote
2. Agendamento personalizado por paciente
3. Integração com WhatsApp Business API
4. Analytics de engajamento

## 📝 Notas Técnicas

### Performance

- Cache de configurações da clínica
- Debounce em operações de envio
- Lazy loading de componentes

### Acessibilidade

- Suporte a leitores de tela
- Navegação por teclado
- Contraste adequado
- Textos alternativos

### Responsividade

- Design mobile-first
- Adaptação para diferentes telas
- Componentes flexíveis

## 🤝 Contribuição

Para contribuir com melhorias:

1. Mantenha a estrutura de tipos TypeScript
2. Adicione testes para novas funcionalidades
3. Documente mudanças na API
4. Siga os padrões de código estabelecidos

## 📞 Suporte

Para dúvidas ou problemas:

- Verifique os logs do console
- Teste a conexão com Z-API
- Valide as configurações da clínica
- Consulte a documentação da Z-API

# Confirmações de Agendamentos

## Visão Geral

A funcionalidade de **Confirmações de Agendamentos** permite gerenciar o status dos agendamentos, enviar lembretes aos pacientes e acompanhar consultas que precisam de atenção.

## Funcionalidades Principais

### 1. Dashboard de Estatísticas

- **Pendentes**: Agendamentos aguardando confirmação
- **Confirmados**: Consultas já confirmadas
- **Próximos**: Agendamentos nos próximos 2 dias
- **Cancelados**: Consultas canceladas

### 2. Notificações de Atenção

- **Agendamentos Atrasados**: Consultas que já passaram da data/hora
- **Agendamentos Próximos**: Consultas nos próximos 2 dias
- Ações rápidas: Confirmar, Cancelar, Enviar Lembrete

### 3. Filtros Avançados

- **Busca**: Por nome do paciente, profissional, telefone ou email
- **Status**: Filtrar por status do agendamento
- **Tipo**: Filtrar por tipo de consulta (Consulta, Retorno, Exame)
- **Limpar Filtros**: Resetar todos os filtros aplicados

### 4. Gerenciamento por Abas

- **Pendentes**: Agendamentos que precisam de confirmação
- **Confirmados**: Consultas já confirmadas
- **Cancelados**: Histórico de cancelamentos

## Ações Disponíveis

### Confirmar Agendamento

- Altera o status de "AGENDADO" para "CONFIRMADO"
- Notificação de sucesso
- Atualização automática da lista

### Cancelar Agendamento

- Altera o status para "CANCELADO"
- Confirmação antes da ação
- Notificação de sucesso

### Enviar Lembrete

- Modal para personalizar mensagem
- Template automático com dados da consulta
- Integração com sistema de notificações

## Interface do Usuário

### Componentes Principais

1. **Header**

   - Título e descrição da funcionalidade
   - Ícone identificativo

2. **Notificações de Atenção**

   - Card destacado para agendamentos urgentes
   - Ações rápidas integradas
   - Cores diferenciadas por prioridade

3. **Cards de Estatísticas**

   - Métricas em tempo real
   - Ícones informativos
   - Contadores atualizados

4. **Filtros**

   - Interface intuitiva
   - Busca em tempo real
   - Filtros combináveis

5. **Lista de Agendamentos**
   - Cards informativos
   - Informações completas do paciente
   - Ações contextuais
   - Estados de loading

### Estados da Interface

- **Loading**: Skeletons durante carregamento
- **Erro**: Mensagem de erro com opção de retry
- **Vazio**: Estados vazios informativos
- **Sucesso**: Notificações toast de confirmação

## Integração com API

### Endpoints Utilizados

```typescript
// Buscar agendamentos
GET / api / agendamentos;

// Confirmar agendamento
PATCH / api / agendamentos / { id } / confirmar;

// Cancelar agendamento
PATCH / api / agendamentos / { id } / cancelar;

// Enviar lembrete
POST / api / agendamentos / { id } / lembrete;
```

### Hook Personalizado: `useConfirmacoes`

```typescript
const {
  agendamentos,
  agendamentosPendentes,
  agendamentosConfirmados,
  agendamentosCancelados,
  agendamentosProximos,
  agendamentosAtrasados,
  isLoading,
  error,
  confirmarAgendamento,
  cancelarAgendamento,
  enviarLembrete,
  isConfirming,
  isCanceling,
  isSendingReminder,
} = useConfirmacoes();
```

## Fluxo de Trabalho

### 1. Acesso à Funcionalidade

- Navegação via sidebar: "Agendamentos > Confirmações"
- URL: `/agendamentos/confirmacoes`

### 2. Visualização Inicial

- Carregamento dos dados
- Exibição das estatísticas
- Notificações de atenção (se houver)

### 3. Gerenciamento de Agendamentos

- Filtros para encontrar agendamentos específicos
- Ações em lote ou individuais
- Confirmação de ações importantes

### 4. Envio de Lembretes

- Seleção do agendamento
- Personalização da mensagem
- Confirmação de envio

## Benefícios

### Para a Clínica

- **Controle**: Acompanhamento completo dos agendamentos
- **Eficiência**: Ações rápidas e automatizadas
- **Redução de Faltas**: Lembretes automáticos
- **Organização**: Interface clara e intuitiva

### Para os Pacientes

- **Lembretes**: Notificações sobre consultas
- **Confirmação**: Processo simples de confirmação
- **Transparência**: Status claro do agendamento

## Tecnologias Utilizadas

- **React**: Interface de usuário
- **TypeScript**: Tipagem estática
- **TanStack Query**: Gerenciamento de estado e cache
- **Axios**: Requisições HTTP
- **date-fns**: Manipulação de datas
- **Lucide React**: Ícones
- **Tailwind CSS**: Estilização
- **Radix UI**: Componentes acessíveis

## Próximas Melhorias

1. **Notificações Push**: Integração com notificações do navegador
2. **Agendamento em Lote**: Confirmar/cancelar múltiplos agendamentos
3. **Relatórios**: Estatísticas detalhadas de confirmações
4. **Integração SMS**: Envio de lembretes via SMS
5. **Automação**: Lembretes automáticos baseados em regras
6. **Histórico**: Log de todas as ações realizadas

## Configuração

### Variáveis de Ambiente

```env
# API Base URL
VITE_API_URL=http://localhost:3000

# Configurações de Notificação
VITE_NOTIFICATION_ENABLED=true
VITE_SMS_ENABLED=false
```

### Permissões

- **ADMIN**: Acesso completo
- **RECEPCIONISTA**: Gerenciar confirmações
- **PROFISSIONAL**: Visualizar agendamentos próprios

## Suporte

Para dúvidas ou problemas com a funcionalidade de confirmações, consulte:

- Documentação da API
- Logs do sistema
- Equipe de desenvolvimento

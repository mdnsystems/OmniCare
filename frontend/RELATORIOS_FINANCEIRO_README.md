# Módulos de Relatórios e Financeiro - OmniCare

## 📊 Visão Geral

Os módulos de **Relatórios** e **Financeiro** foram implementados de forma integrada e padronizada no sistema OmniCare, seguindo os padrões visuais e arquiteturais existentes. Ambos os módulos são totalmente multitenant e se adaptam automaticamente ao tipo de clínica configurado.

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── pages/
│   ├── financeiro/
│   │   ├── index.tsx              # Dashboard principal do financeiro
│   │   ├── faturamento.tsx        # Gestão de faturamento
│   │   ├── pagamentos.tsx         # Gestão de pagamentos
│   │   └── relatorios.tsx         # Relatórios financeiros
│   └── relatorios/
│       ├── index.tsx              # Dashboard principal de relatórios
│       ├── consultas.tsx          # Relatórios de consultas
│       ├── receitas.tsx           # Relatórios de receitas
│       └── desempenho.tsx         # Relatórios de desempenho
├── components/
│   ├── charts/
│   │   ├── RelatoriosChart.tsx    # Componente de gráficos reutilizável
│   │   └── EvolucaoPacienteChart.tsx
│   ├── tables/
│   │   ├── faturamento.tsx        # Tabela de faturamento
│   │   ├── pagamentos.tsx         # Tabela de pagamentos
│   │   └── types/
│   │       └── faturamento.ts     # Tipos e utilitários
│   └── ui/
│       ├── metric-card.tsx        # Card de métricas reutilizável
│       └── filter-panel.tsx       # Painel de filtros reutilizável
├── hooks/
│   ├── useRelatorios.ts           # Hook para gerenciar relatórios
│   └── useFinanceiro.ts           # Hook para gerenciar dados financeiros
└── types/
    └── api.ts                     # Tipos TypeScript (já existente)
```

## 📊 Módulo de Relatórios

### Funcionalidades

- **Relatórios de Consultas**: Análise detalhada de consultas por período, profissional e especialidade
- **Relatórios de Receitas**: Análise financeira e projeções de receita
- **Relatórios de Desempenho**: Métricas de performance e indicadores operacionais

### Componentes Principais

#### `RelatoriosChart`

Componente reutilizável para gráficos com suporte a:

- Gráficos de área
- Gráficos de barras
- Gráficos de linha
- Gráficos de pizza

```tsx
import { RelatoriosChart } from "@/components/charts/RelatoriosChart";

<RelatoriosChart
  titulo="Receita por Período"
  tipo="area"
  dados={dadosReceita}
  config={configReceita}
  altura="h-[300px]"
  descricao="Análise da receita nos últimos 6 meses"
/>;
```

#### `MetricCard`

Card de métricas padronizado:

```tsx
import { MetricCard } from "@/components/ui/metric-card";
import { DollarSign } from "lucide-react";

<MetricCard
  titulo="Receita Total"
  valor="R$ 45.680,00"
  descricao="Receita do mês atual"
  icon={DollarSign}
  variant="success"
  trend={{
    valor: 15.3,
    positivo: true,
    texto: "vs mês anterior",
  }}
/>;
```

#### `FilterPanel`

Painel de filtros reutilizável:

```tsx
import { FilterPanel } from '@/components/ui/filter-panel'

const campos = [
  {
    key: 'periodo',
    label: 'Período',
    type: 'date-range'
  },
  {
    key: 'profissional',
    label: 'Profissional',
    type: 'select',
    options: [
      { label: 'Todos', value: 'TODOS' },
      { label: 'Dr. Carlos', value: 'prof1' }
    ]
  }
]

<FilterPanel
  titulo="Filtros do Relatório"
  campos={campos}
  onFiltrar={handleFiltrar}
  onLimpar={handleLimpar}
/>
```

### Hook `useRelatorios`

```tsx
import { useRelatorios } from "@/hooks/useRelatorios";

const {
  relatorios,
  loading,
  error,
  carregarRelatorios,
  gerarRelatorio,
  exportarRelatorio,
} = useRelatorios({
  tipo: "consultas",
  periodoInicio: "2024-01-01",
  periodoFim: "2024-01-31",
});
```

## 💰 Módulo Financeiro

### Funcionalidades

- **Faturamento**: Gestão completa de faturas e cobranças
- **Pagamentos**: Acompanhamento de pagamentos recebidos
- **Relatórios Financeiros**: Análises detalhadas da performance financeira

### Componentes Principais

#### Tabelas Especializadas

```tsx
// Tabela de Faturamento
import FaturamentoTable from "@/components/tables/faturamento";

<FaturamentoTable
  onView={handleViewFaturamento}
  onEdit={handleEditFaturamento}
  onDelete={handleDeleteFaturamento}
/>;

// Tabela de Pagamentos
import PagamentosTable from "@/components/tables/pagamentos";

<PagamentosTable
  onView={handleViewPagamento}
  onEdit={handleEditPagamento}
  onDelete={handleDeletePagamento}
/>;
```

### Hook `useFinanceiro`

```tsx
import { useFinanceiro } from "@/hooks/useFinanceiro";

const {
  data,
  loading,
  error,
  carregarDados,
  criarFaturamento,
  registrarPagamento,
} = useFinanceiro({
  status: StatusFaturamento.PENDENTE,
  periodoInicio: "2024-01-01",
});
```

## 🎨 Padrões Visuais

### Cores e Temas

- **Sucesso**: Verde (`text-green-600`, `bg-green-100`)
- **Aviso**: Amarelo (`text-yellow-600`, `bg-yellow-100`)
- **Erro**: Vermelho (`text-red-600`, `bg-red-100`)
- **Informação**: Azul (`text-blue-600`, `bg-blue-100`)

### Responsividade

- Grid responsivo: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Cards adaptáveis: `hover:shadow-lg transition-shadow`
- Gráficos responsivos: `aspect-video h-[300px]`

### Dark Mode

Todos os componentes suportam automaticamente o tema dark/light através das classes CSS do Tailwind.

## 🔧 Integração com Sistema Multitenant

### Contexto da Clínica

```tsx
import { useClinica } from '@/contexts/ClinicaContext'

const { getNomenclatura, isModuleActive } = useClinica()

// Nomenclatura adaptativa
<h1>Relatórios de {getNomenclatura('consultas')}</h1>

// Verificação de módulos ativos
{isModuleActive('financeiro') && (
  <FinanceiroModule />
)}
```

### Isolamento por Tenant

- Todos os dados são filtrados por `tenantId`
- Hooks gerenciam automaticamente o isolamento
- Componentes respeitam a configuração da clínica

## 📱 Navegação

### Rotas Implementadas

```tsx
// Módulo Financeiro
<Route path="/financeiro" element={<Financeiro />} />
<Route path="/financeiro/faturamento" element={<Faturamento />} />
<Route path="/financeiro/pagamentos" element={<Pagamentos />} />
<Route path="/financeiro/relatorios" element={<RelatoriosFinanceiros />} />

// Módulo de Relatórios
<Route path="/relatorios" element={<Relatorios />} />
<Route path="/relatorios/consultas" element={<RelatoriosConsultas />} />
<Route path="/relatorios/receitas" element={<RelatoriosReceitas />} />
<Route path="/relatorios/desempenho" element={<RelatoriosDesempenho />} />
```

### Sidebar

Os módulos são automaticamente adicionados ao menu lateral quando ativos na configuração da clínica.

## 🚀 Como Usar

### 1. Configuração da Clínica

```tsx
// Ativar módulos na configuração
const configuracao = {
  configuracoes: {
    usarFinanceiro: true,
    usarRelatorios: true,
    modulosAtivos: ["financeiro", "relatorios"],
  },
};
```

### 2. Implementação de Página

```tsx
import { MetricCard } from "@/components/ui/metric-card";
import { RelatoriosChart } from "@/components/charts/RelatoriosChart";
import { useRelatorios } from "@/hooks/useRelatorios";

export function MinhaPaginaRelatorio() {
  const { relatorios, loading } = useRelatorios();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          titulo="Total de Relatórios"
          valor={relatorios.length}
          icon={FileText}
        />
      </div>

      <RelatoriosChart
        titulo="Dados do Relatório"
        tipo="area"
        dados={dados}
        config={config}
      />
    </div>
  );
}
```

### 3. Personalização

```tsx
// Customizar cores do gráfico
const config = {
  receita: {
    label: "Receita",
    color: "hsl(var(--primary))",
  },
  pagamentos: {
    label: "Pagamentos",
    color: "hsl(var(--success))",
  },
};
```

## 📈 Dados Mock

Os módulos incluem dados mock completos para demonstração:

- **Faturamentos**: 2 registros com pacientes e profissionais
- **Pagamentos**: 2 registros vinculados aos faturamentos
- **Relatórios**: 3 relatórios de diferentes tipos
- **Métricas**: Dados calculados automaticamente

## 🔄 Próximos Passos

1. **Integração com API Real**: Substituir dados mock por chamadas reais
2. **Exportação Avançada**: Implementar exportação em PDF/Excel
3. **Agendamento de Relatórios**: Relatórios automáticos por email
4. **Dashboards Customizáveis**: Widgets arrastáveis e configuráveis
5. **Notificações**: Alertas de inadimplência e metas

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Recharts** para gráficos
- **Lucide React** para ícones
- **React Router** para navegação
- **TanStack Table** para tabelas
- **ShadCN UI** para componentes base

## 📝 Notas de Implementação

- Todos os componentes são totalmente tipados com TypeScript
- Suporte completo a temas dark/light
- Responsividade em todos os dispositivos
- Acessibilidade seguindo padrões WCAG
- Performance otimizada com lazy loading
- Código limpo e bem documentado

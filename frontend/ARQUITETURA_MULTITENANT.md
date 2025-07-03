# 🏗️ Arquitetura Multitenant - OmniCare v3.0

## 📋 Visão Geral

O OmniCare v3.0 foi completamente refatorado para suportar verdadeiro multitenant com isolamento de dados e especialidades específicas. Esta documentação descreve a nova arquitetura, componentes e padrões implementados.

## 🎯 Objetivos da Refatoração

### ✅ Implementados

1. **Isolamento de Dados por Tenant**

   - Campo `tenantId` em todas as entidades
   - Contexto de isolamento automático
   - Configurações específicas por clínica

2. **Sistema de Templates Dinâmicos**

   - Templates por especialidade
   - Campos customizáveis
   - Validações específicas

3. **Fluxos de Trabalho Personalizados**

   - Fluxos por especialidade
   - Etapas condicionais
   - Ações automáticas

4. **Nomenclatura Adaptativa**

   - Interface adaptada por especialidade
   - Termos específicos por área
   - Tradução automática

5. **Campos Dinâmicos**
   - 19 tipos de campo suportados
   - Validações customizáveis
   - Cálculos automáticos

## 🏛️ Arquitetura de Dados

### Estrutura Base

```typescript
interface BaseEntity {
  id: string;
  tenantId: string; // ID da clínica/tenant
  createdAt: string;
  updatedAt: string;
}
```

### Entidades Principais

```typescript
// Configuração da clínica
interface ConfiguracaoClinica extends BaseEntity {
  nome: string;
  tipo: TipoClinica;
  configuracoes: ConfiguracaoSistema;
  ativo: boolean;
}

// Templates por especialidade
interface TemplateEspecialidade extends BaseEntity {
  nome: string;
  tipoClinica: TipoClinica;
  categoria: CategoriaCampo;
  campos: CampoTemplate[];
  validacoes: ValidacaoTemplate[];
}

// Fluxos de trabalho
interface FluxoEspecialidade extends BaseEntity {
  nome: string;
  tipoClinica: TipoClinica;
  etapas: EtapaFluxo[];
  validacoes: ValidacaoFluxo[];
}
```

## 📁 Estrutura de Pastas

```
src/
├── components/
│   ├── dynamic-fields/          # Campos dinâmicos
│   │   ├── DynamicField.tsx     # Campo individual
│   │   ├── DynamicForm.tsx      # Formulário dinâmico
│   │   └── FieldEditor.tsx      # Editor de campos
│   ├── dynamic-flows/           # Fluxos de trabalho
│   │   └── FlowExecutor.tsx     # Executor de fluxos
│   └── ui/                      # Componentes base
├── contexts/
│   └── ClinicaContext.tsx       # Contexto multitenant
├── data/
│   ├── templates.ts             # Templates pré-definidos
│   └── fluxos.ts                # Fluxos pré-definidos
├── types/
│   └── api.ts                   # Tipos TypeScript
└── pages/                       # Páginas da aplicação
```

## 🔧 Componentes Principais

### 1. DynamicField

Componente para renderizar campos dinâmicos com 19 tipos diferentes:

```typescript
<DynamicField
  field={{
    id: "altura",
    nome: "Altura (cm)",
    tipo: TipoCampo.NUMERO,
    obrigatorio: true,
    validacoes: [
      { tipo: "min", valor: 50, mensagem: "Altura deve ser maior que 50cm" },
    ],
  }}
  value={formData.altura}
  onChange={(value) => setFormData({ ...formData, altura: value })}
/>
```

**Tipos Suportados:**

- TEXTO, NUMERO, DATA, SELECT, MULTISELECT
- TEXTAREA, BOOLEANO, EMAIL, TELEFONE
- CEP, CPF, CNPJ, MOEDA, PERCENTUAL
- COR, ARQUIVO, IMAGEM, ASSINATURA, GEOLOCALIZACAO

### 2. DynamicForm

Formulário dinâmico baseado em templates:

```typescript
<DynamicForm
  template={templateAnamneseNutricional}
  initialData={anamneseExistente}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

**Funcionalidades:**

- Validação automática
- Organização por seções
- Campos dependentes
- Cálculos automáticos

### 3. FlowExecutor

Executor de fluxos de trabalho:

```typescript
<FlowExecutor
  fluxo={fluxoConsultaNutricional}
  pacienteId="123"
  profissionalId="456"
  onComplete={handleComplete}
  onCancel={handleCancel}
/>
```

**Funcionalidades:**

- Execução passo a passo
- Validação de condições
- Ações automáticas
- Progresso visual

## 🎨 Sistema de Templates

### Templates por Especialidade

```typescript
// Nutrição
export const templateAnamneseNutricional: TemplateEspecialidade = {
  id: "anamnese_nutricional",
  tipoClinica: TipoClinica.NUTRICIONAL,
  categoria: CategoriaCampo.ANAMNESE,
  campos: [
    {
      id: "altura",
      nome: "Altura (cm)",
      tipo: TipoCampo.NUMERO,
      obrigatorio: true,
      secao: "Medidas Antropométricas",
    },
    // ... mais campos
  ],
};
```

### Categorias de Template

- **PACIENTE**: Dados do paciente
- **PROFISSIONAL**: Dados do profissional
- **ANAMNESE**: Avaliações iniciais
- **PRONTUARIO**: Registros clínicos
- **AGENDAMENTO**: Agendamentos
- **FINANCEIRO**: Dados financeiros
- **RELATORIO**: Relatórios

## 🔄 Sistema de Fluxos

### Fluxos por Especialidade

```typescript
// Psicologia
export const fluxoSessaoPsicologica: FluxoEspecialidade = {
  id: "fluxo_sessao_psicologica",
  tipoClinica: TipoClinica.PSICOLOGICA,
  etapas: [
    {
      id: "acolhimento",
      nome: "Acolhimento",
      obrigatoria: true,
      campos: ["estado_mental", "queixa_principal"],
      acoes: [
        {
          tipo: "criar_registro",
          parametros: { tipo: "anamnese", template: "anamnese_psicologica" },
        },
      ],
    },
    // ... mais etapas
  ],
};
```

### Tipos de Ação

- **criar_registro**: Criar novo registro
- **enviar_notificacao**: Enviar notificação
- **gerar_relatorio**: Gerar relatório
- **validar_campo**: Validar campo específico

### Condições de Fluxo

- **igual**: Valor igual
- **diferente**: Valor diferente
- **maior**: Valor maior
- **menor**: Valor menor
- **contem**: Contém valor

## 🌐 Nomenclatura Adaptativa

### Sistema de Tradução

```typescript
const nomenclaturaPorTipo: Record<TipoClinica, Record<string, string>> = {
  [TipoClinica.NUTRICIONAL]: {
    anamnese: "Avaliação Nutricional",
    paciente: "Paciente",
    profissional: "Nutricionista",
    consulta: "Consulta Nutricional",
  },
  [TipoClinica.PSICOLOGICA]: {
    anamnese: "Avaliação Psicológica",
    paciente: "Paciente",
    profissional: "Psicólogo",
    consulta: "Sessão Terapêutica",
  },
  // ... outras especialidades
};
```

### Uso na Interface

```typescript
const { getNomenclatura } = useClinica();

// Renderiza automaticamente baseado no tipo de clínica
<h1>Lista de {getNomenclatura('pacientes')}</h1>
<Button>Novo {getNomenclatura('paciente')}</Button>
```

## 🎯 Especialidades Suportadas

### 1. Nutrição

- **Templates**: Avaliação nutricional, prontuário nutricional
- **Fluxos**: Consulta nutricional
- **Campos**: IMC, circunferência abdominal, hábitos alimentares

### 2. Psicologia

- **Templates**: Avaliação psicológica, prontuário psicológico
- **Fluxos**: Sessão terapêutica
- **Campos**: Estado mental, queixa principal, histórico psicológico

### 3. Fisioterapia

- **Templates**: Avaliação fisioterapêutica, prontuário fisioterapêutico
- **Fluxos**: Sessão de fisioterapia
- **Campos**: Força muscular, amplitude de movimento, dor

### 4. Odontologia

- **Templates**: Anamnese odontológica, prontuário odontológico
- **Fluxos**: Procedimento odontológico
- **Campos**: Dor dental, sangramento gengival, hábitos orais

### 5. Estética

- **Templates**: Avaliação estética, prontuário estético
- **Fluxos**: Procedimento estético
- **Campos**: Tipo de pele, alergias cosméticas, fotos antes/depois

### 6. Veterinária

- **Templates**: Avaliação veterinária, prontuário veterinário
- **Fluxos**: Consulta veterinária
- **Campos**: Espécie, raça, vacinas, vermifugação

## 🔒 Isolamento de Dados

### Contexto Multitenant

```typescript
const ClinicaContext = createContext<ClinicaContextData>({
  configuracao: null,
  tenantId: null,
  isModuleActive: () => false,
  getNomenclatura: (chave: string) => chave,
  // ... outros métodos
});
```

### Middleware de Isolamento

```typescript
// TODO: Implementar no backend
const tenantMiddleware = (req, res, next) => {
  const tenantId = req.headers["x-tenant-id"];
  req.tenantId = tenantId;
  next();
};
```

## 📊 Dashboards e Relatórios

### Dashboards Específicos

```typescript
interface DashboardEspecialidade extends BaseEntity {
  nome: string;
  tipoClinica: TipoClinica;
  widgets: WidgetDashboard[];
  layout: LayoutDashboard;
}
```

### Relatórios por Especialidade

```typescript
interface RelatorioEspecialidade extends BaseEntity {
  nome: string;
  tipoClinica: TipoClinica;
  tipo: "consultas" | "faturamento" | "desempenho" | "pacientes";
  parametros: ParametroRelatorio[];
}
```

## 🚀 Próximos Passos

### Backend (TODO)

1. **Implementar tenant_id em todas as tabelas**
2. **Middleware de isolamento**
3. **APIs específicas por tenant**
4. **Sistema de templates dinâmicos**
5. **Execução de fluxos**

### Frontend (Em Desenvolvimento)

1. **Editor visual de templates** ✅
2. **Editor visual de fluxos** ✅
3. **Sistema de campos dinâmicos** ✅
4. **Dashboards específicos** 🔄
5. **Relatórios customizados** 🔄

### Integrações

1. **WhatsApp por tenant**
2. **Notificações push**
3. **Backup automático**
4. **Sincronização offline**

## 📝 Padrões de Desenvolvimento

### 1. Nomenclatura

```typescript
// ✅ Correto
const getNomenclatura = (chave: string) => {
  const tipo = configuracao?.tipo ?? TipoClinica.NUTRICIONAL;
  return nomenclaturaPorTipo[tipo][chave] ?? chave;
};

// ❌ Evitar
const getLabel = (key: string) => {
  if (tipoClinica === "nutricional") return labels.nutricional[key];
  if (tipoClinica === "psicologica") return labels.psicologica[key];
  // ...
};
```

### 2. Tipagem

```typescript
// ✅ Correto
interface CampoPersonalizado extends BaseEntity {
  tipo: TipoCampo;
  categoria: CategoriaCampo;
  validacoes: ValidacaoCampo[];
}

// ❌ Evitar
interface Campo {
  tipo: string;
  categoria: string;
  validacoes: any[];
}
```

### 3. Contexto

```typescript
// ✅ Correto
const { getNomenclatura, isModuleActive } = useClinica();

// ❌ Evitar
const configuracao = useContext(ClinicaContext);
const nomenclatura = configuracao?.nomenclatura;
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Banco de dados
DATABASE_URL=postgresql://user:pass@localhost:5432/omnicare

# Z-API (WhatsApp)
VITE_ZAPI_INSTANCE_ID=your_instance_id
VITE_ZAPI_TOKEN=your_token

# Configuração multitenant
VITE_DEFAULT_TENANT_ID=default
VITE_MULTITENANT_ENABLED=true
```

### Configuração de Clínica

```typescript
const configuracaoClinica: ConfiguracaoClinica = {
  id: "clinica-123",
  tenantId: "tenant-nutricao-123",
  nome: "Clínica Nutrição Plus",
  tipo: TipoClinica.NUTRICIONAL,
  configuracoes: {
    usarAnamnese: true,
    usarProntuario: true,
    usarAgendamento: true,
    modulosAtivos: ["anamnese", "prontuario", "agendamento"],
    templatesAtivos: ["anamnese_nutricional"],
    fluxosAtivos: ["fluxo_consulta_nutricional"],
  },
};
```

## 📚 Recursos Adicionais

- [Documentação da API](./API_DOCUMENTATION.md)
- [Guia de Migração](./MIGRATION_GUIDE.md)
- [Exemplos de Uso](./EXAMPLES.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

---

**OmniCare v3.0** - Sistema Multitenant para Clínicas
Desenvolvido com ❤️ para facilitar a gestão de clínicas de diferentes especialidades.

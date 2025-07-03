# OmniCare - Sistema de Gestão para Clínicas

Um sistema moderno, flexível e escalável para gestão de clínicas e centros de saúde de diversas especialidades.

## 🚀 Características

### ✨ Sistema Genérico e Adaptável

- **Múltiplas Especialidades**: Suporte para medicina, nutrição, psicologia, fisioterapia, odontologia, estética, veterinária e mais
- **Configuração Dinâmica**: Personalização completa por tipo de clínica
- **Interface Adaptativa**: Cores, ícones e nomenclatura específicos por especialidade
- **Módulos Flexíveis**: Ativação/desativação de funcionalidades conforme necessidade

### 🎨 Design System Moderno

- **Tema Claro/Escuro**: Suporte completo aos modos de visualização
- **Cores Personalizáveis**: Paleta de cores configurável por clínica
- **Componentes Reutilizáveis**: Biblioteca robusta de componentes UI
- **Responsivo**: Interface otimizada para desktop, tablet e mobile

### 📊 Funcionalidades Principais

- **Dashboard Inteligente**: Métricas e insights personalizados
- **Gestão de Pacientes**: Cadastro completo com histórico
- **Agendamentos**: Sistema de agendamento com confirmações
- **Prontuários**: Documentação clínica estruturada
- **Avaliações**: Anamneses específicas por especialidade
- **Financeiro**: Controle de faturamento e pagamentos
- **Relatórios**: Análises e relatórios personalizados

## 🏥 Tipos de Clínica Suportados

| Especialidade        | Ícone | Cores    | Funcionalidades Específicas                     |
| -------------------- | ----- | -------- | ----------------------------------------------- |
| **Médica**           | 🏥    | Azul     | Anamnese médica, exames, prescrições            |
| **Nutricional**      | 🥗    | Verde    | Avaliação nutricional, IMC, hábitos alimentares |
| **Psicológica**      | 🧠    | Roxo     | Estado mental, sintomas, história social        |
| **Fisioterapêutica** | 💪    | Vermelho | Avaliação física, mobilidade, dor               |
| **Odontológica**     | 🦷    | Ciano    | Anamnese odontológica, procedimentos            |
| **Estética**         | ✨    | Rosa     | Avaliação estética, tratamentos                 |
| **Veterinária**      | 🐾    | Laranja  | Espécies, avaliação veterinária                 |
| **Educacional**      | 🎓    | Verde    | Gestão educacional                              |
| **Corporativa**      | 🏢    | Cinza    | Gestão corporativa                              |
| **Personalizada**    | ⚙️    | Roxo     | Configuração totalmente customizável            |

## 🛠️ Tecnologias

### Frontend

- **React 19** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização utilitária
- **Radix UI** - Componentes acessíveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Estado e Dados

- **React Query** - Gerenciamento de estado servidor
- **Context API** - Estado global da aplicação
- **Axios** - Cliente HTTP

### UI/UX

- **Lucide React** - Ícones
- **Sonner** - Notificações toast
- **React Router** - Navegação
- **Date-fns** - Manipulação de datas

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/omnicare.git
cd omnicare

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## ⚙️ Configuração

### 1. Configuração Inicial da Clínica

Acesse `/configuracao` para personalizar:

- Nome e tipo da clínica
- Cores da marca
- Módulos ativos
- Campos personalizados

### 2. Tipos de Configuração

```typescript
enum TipoClinica {
  MEDICA = "MEDICA",
  NUTRICIONAL = "NUTRICIONAL",
  PSICOLOGICA = "PSICOLOGICA",
  FISIOTERAPICA = "FISIOTERAPICA",
  ODONTOLOGICA = "ODONTOLOGICA",
  ESTETICA = "ESTETICA",
  VETERINARIA = "VETERINARIA",
  EDUCACIONAL = "EDUCACIONAL",
  CORPORATIVA = "CORPORATIVA",
  PERSONALIZADA = "PERSONALIZADA",
}
```

### 3. Módulos Disponíveis

- `anamnese` - Sistema de avaliações
- `prontuario` - Gestão de prontuários
- `agendamento` - Sistema de agendamento
- `financeiro` - Controle financeiro
- `relatorios` - Relatórios e análises

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Button, Input, etc.)
│   ├── anamnese/       # Componentes específicos de avaliação
│   └── forms/          # Formulários
├── contexts/           # Contextos React
│   ├── AuthContext.tsx # Autenticação
│   └── ClinicaContext.tsx # Configuração da clínica
├── pages/              # Páginas da aplicação
│   ├── auth/           # Autenticação
│   ├── dashboard/      # Dashboards
│   ├── pacientes/      # Gestão de pacientes
│   ├── profissionais/  # Gestão de profissionais
│   ├── agendamentos/   # Agendamentos
│   ├── prontuarios/    # Prontuários
│   ├── anamnese/       # Avaliações
│   └── configuracao/   # Configuração
├── types/              # Definições de tipos TypeScript
├── lib/                # Utilitários e configurações
└── hooks/              # Hooks customizados
```

## 🎯 Funcionalidades por Especialidade

### Clínica Nutricional

- Avaliação nutricional completa
- Campos específicos: IMC, circunferência abdominal
- Tabs: Dados Gerais, Antecedentes, Hábitos, Alimentação, Hidratação

### Clínica Psicológica

- Avaliação psicológica estruturada
- Campos específicos: Estado mental, sintomas
- Tabs: Dados Gerais, Antecedentes, Estado Mental, Sintomas, História Social

### Clínica Fisioterapêutica

- Avaliação fisioterapêutica
- Campos específicos: Força muscular, mobilidade
- Tabs: Dados Gerais, Antecedentes, Avaliação Física, Mobilidade, Dor

### Clínica Médica

- Anamnese médica tradicional
- Campos específicos: Exame físico, medicamentos
- Tabs: Dados Gerais, Antecedentes, Exame Físico, Medicamentos, Exames

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run lint         # Linting do código
npm run preview      # Preview do build
```

### Padrões de Código

- **TypeScript**: Tipagem estática obrigatória
- **ESLint**: Linting configurado
- **Prettier**: Formatação automática
- **Conventional Commits**: Padrão de commits

## 🎨 Personalização

### Cores da Clínica

```typescript
interface ConfiguracaoClinica {
  corPrimaria: string; // Cor principal da marca
  corSecundaria: string; // Cor secundária
  tema: "light" | "dark" | "auto";
}
```

### Campos Personalizados

```typescript
interface CampoPersonalizado {
  id: string;
  nome: string;
  tipo:
    | "texto"
    | "numero"
    | "data"
    | "select"
    | "multiselect"
    | "textarea"
    | "arquivo";
  obrigatorio: boolean;
  opcoes?: string[];
  categoria: "anamnese" | "prontuario" | "paciente" | "profissional";
  ordem: number;
  ativo: boolean;
}
```

## 📈 Roadmap

### Versão 2.1

- [ ] Sistema de notificações push
- [ ] Integração com WhatsApp
- [ ] Relatórios avançados
- [ ] Backup automático

### Versão 2.2

- [ ] App mobile (React Native)
- [ ] Portal do paciente
- [ ] Integração com planos de saúde
- [ ] Telemedicina

### Versão 3.0

- [ ] IA para diagnósticos
- [ ] Análise preditiva
- [ ] Integração com dispositivos IoT
- [ ] Blockchain para prontuários

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: suporte@omnicare.com
- **Documentação**: [docs.omnicare.com](https://docs.omnicare.com)
- **Discord**: [Comunidade OmniCare](https://discord.gg/omnicare)

---

Desenvolvido com ❤️ para revolucionar a gestão de clínicas e centros de saúde.

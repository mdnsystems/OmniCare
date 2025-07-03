# Componente UserProfile

O componente `UserProfile` foi criado para exibir informações do usuário logado de forma consistente em toda a aplicação.

## Características

- **Avatar com iniciais**: Exibe a foto do usuário se disponível, caso contrário mostra as iniciais do nome
- **Nome e especialidade**: Mostra o nome do usuário e sua especialidade baseada no role
- **Botão de logout**: Permite ao usuário sair da aplicação
- **Múltiplas variantes**: Diferentes estilos para diferentes contextos de uso
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Sidebar collapsed**: Detecta automaticamente quando a sidebar está collapsed e mostra apenas o avatar

## Variantes Disponíveis

### 1. Default (Padrão)

```tsx
<UserProfile />
```

- Avatar grande (12x12)
- Nome, especialidade e email
- Botão de logout com texto
- Card com borda e padding

### 2. Compact

```tsx
<UserProfile variant="compact" />
```

- Avatar pequeno (8x8)
- Nome e especialidade apenas
- Botão de logout compacto
- Layout horizontal otimizado

### 3. Sidebar

```tsx
<UserProfile variant="sidebar" />
```

- Avatar médio (10x10)
- Nome e especialidade
- Botão de logout compacto
- Hover effects para sidebar
- **Quando collapsed**: Mostra apenas o avatar (8x8) centralizado

## Comportamento na Sidebar Collapsed

Quando a sidebar está no estado `collapsed` e o componente usa a variante `sidebar`, ele automaticamente:

- Reduz o tamanho do avatar para 8x8
- Remove todas as informações de texto (nome, especialidade)
- Remove o botão de logout
- Centraliza o avatar no container
- Mantém a funcionalidade de fallback para iniciais

## Props

| Prop         | Tipo                                  | Padrão      | Descrição                        |
| ------------ | ------------------------------------- | ----------- | -------------------------------- |
| `variant`    | `'default' \| 'compact' \| 'sidebar'` | `'default'` | Estilo visual do componente      |
| `showLogout` | `boolean`                             | `true`      | Se deve exibir o botão de logout |
| `className`  | `string`                              | `undefined` | Classes CSS adicionais           |

## Funcionalidades

### Geração de Iniciais

O componente gera automaticamente as iniciais do nome do usuário:

- Para nomes com uma palavra: primeira letra
- Para nomes com múltiplas palavras: primeira letra do primeiro e último nome

### Especialidades por Role

- `SUPER_ADMIN` → "Administrador"
- `ADMIN` → "Administrador"
- `PROFISSIONAL` → "Profissional"
- `RECEPCIONISTA` → "Recepcionista"

### Avatar

- Prioriza a foto de perfil do usuário (`user.fotoPerfil`)
- Fallback para serviço de avatares baseado no nome
- Fallback final para iniciais em um avatar colorido

### Detecção de Sidebar Collapsed

- Usa o hook `useSidebar()` para detectar o estado da sidebar
- Aplica automaticamente o comportamento collapsed quando `state === "collapsed"`
- Funciona apenas com a variante `sidebar`

## Integração na Sidebar

O componente já está integrado na sidebar principal da aplicação:

```tsx
// src/components/app-sidebar.tsx
<SidebarFooter className="border-t border-sidebar-border/50">
  <div>
    <UserProfile variant="sidebar" className="w-full" />
  </div>
</SidebarFooter>
```

## Exemplo de Uso

```tsx
import { UserProfile } from "@/components/user-profile"

// Uso básico
<UserProfile />

// Variante compacta sem logout
<UserProfile variant="compact" showLogout={false} />

// Com classes personalizadas
<UserProfile className="my-custom-class" />
```

## Arquivos Relacionados

- `src/components/user-profile.tsx` - Componente principal
- `src/lib/utils.ts` - Funções utilitárias (obterIniciais, obterEspecialidadePorRole)
- `src/types/api.ts` - Tipos TypeScript (Usuario)
- `src/contexts/AuthContext.tsx` - Contexto de autenticação
- `src/components/app-sidebar.tsx` - Integração na sidebar
- `src/components/ui/sidebar.tsx` - Hook useSidebar para detecção de estado

## Dependências

- `@radix-ui/react-avatar` - Componente de avatar
- `lucide-react` - Ícones (LogOut)
- `@/components/ui/button` - Botão
- `@/components/ui/sidebar` - Hook useSidebar
- `@/contexts/AuthContext` - Contexto de autenticação
- `@/lib/utils` - Funções utilitárias

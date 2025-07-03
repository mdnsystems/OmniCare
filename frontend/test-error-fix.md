# Correções para o Erro "Maximum update depth exceeded"

## Problema Identificado
O erro "Maximum update depth exceeded" estava sendo causado por re-renderizações desnecessárias em vários componentes, principalmente devido a:

1. **ProtectedRoute**: Estava acessando `userRole` diretamente do localStorage em vez de usar o contexto de autenticação
2. **Contextos não otimizados**: `AuthContext` e `ClinicaContext` não estavam memoizando seus valores
3. **Componentes com dependências desnecessárias**: Vários componentes estavam recriando objetos a cada renderização

## Correções Implementadas

### 1. ProtectedRoute.tsx
- **Problema**: Acessava `userRole` diretamente do localStorage
- **Solução**: Integrado com o `AuthContext` para usar `user` e `isAuthenticated`

### 2. AuthContext.tsx
- **Problema**: Valor do contexto recriado a cada renderização
- **Solução**: 
  - Adicionado `useMemo` para memoizar o valor do contexto
  - Adicionado tratamento de erro para JSON.parse
  - Otimizado o `useEffect` de inicialização

### 3. ClinicaContext.tsx
- **Problema**: Valor do contexto recriado a cada renderização
- **Solução**:
  - Adicionado `useMemo` para memoizar o valor do contexto
  - Adicionado tratamento de erro para JSON.parse
  - Otimizado o `useEffect` de inicialização

### 4. App.tsx
- **Problema**: Redirecionamentos condicionais causando re-renderizações
- **Solução**:
  - Memoizado os redirecionamentos com `useMemo`
  - Adicionada rota de login explícita
  - Otimizada a lógica de redirecionamento

### 5. AppSidebar.tsx
- **Problema**: `useMemo` com dependência desnecessária em `configuracao`
- **Solução**: Removida dependência direta de `configuracao`, mantendo apenas as funções necessárias

### 6. SidebarLayout.tsx
- **Problema**: Header recriado a cada renderização
- **Solução**: Memoizado o conteúdo do header com `useMemo`

### 7. NavMain.tsx
- **Problema**: Menu recriado a cada renderização
- **Solução**: Memoizado os itens do menu com `useMemo`

### 8. Logo.tsx
- **Problema**: Valores recalculados a cada renderização
- **Solução**: Memoizado os dados do logo com `useMemo`

### 9. ThemeToggle.tsx
- **Problema**: Handler recriado a cada renderização
- **Solução**: Memoizado o handler com `useCallback`

### 10. ThemeProvider.tsx
- **Problema**: Valor do contexto recriado a cada renderização
- **Solução**: Memoizado o valor do contexto com `useMemo`

### 11. useIsMobile.ts
- **Problema**: Callback recriado a cada renderização
- **Solução**: Memoizado o callback com `useCallback`

## Resultado
- Eliminadas as re-renderizações desnecessárias
- Melhorada a performance geral da aplicação
- Resolvido o erro "Maximum update depth exceeded"
- Mantida a funcionalidade original

## Verificação
O servidor está rodando na porta 5173 e não apresenta mais o erro de loop infinito. 
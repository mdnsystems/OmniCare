# Implementação Global da API ViaCEP

Esta implementação fornece uma solução global e reutilizável para integração com a API ViaCEP em todos os formulários que precisam de endereço.

## Estrutura

### 1. Serviço Global (`cep-service.ts`)
- **Singleton Pattern**: Garante uma única instância do serviço
- **Cache Inteligente**: Evita requisições desnecessárias
- **Tratamento de Erros**: Robustez na comunicação com a API
- **Formatação**: Formatação automática do CEP

### 2. Hook Personalizado (`use-cep.ts`)
- **Estado de Loading**: Controle de estado durante requisições
- **Tratamento de Erros**: Gerenciamento de erros centralizado
- **Funções Utilitárias**: Formatação e validação de CEP

### 3. Componente Reutilizável (`cep-input.tsx`)
- **Interface Padronizada**: Componente pronto para uso
- **Integração com Formulários**: Compatível com React Hook Form
- **Feedback Visual**: Loading states e mensagens de erro

## Como Usar

### Opção 1: Usando o Componente CEPInput (Recomendado)

```tsx
import { CEPInput } from "@/components/ui/cep-input";

// No seu formulário
<FormField
  control={form.control}
  name="cep"
  render={({ field }) => (
    <CEPInput
      value={field.value}
      onChange={field.onChange}
      fieldMapping={{
        logradouro: "endereco", // ou "rua"
        bairro: "bairro",
        localidade: "cidade",
        uf: "estado"
      }}
      setValue={(fieldName, value) => {
        form.setValue(fieldName as keyof YourFormType, value as any);
      }}
      required
    />
  )}
/>
```

### Opção 2: Usando o Hook useCEP

```tsx
import { useCEP } from "@/hooks/use-cep";

function MyForm() {
  const { fillAddressFromCEP, formatCEP, loading } = useCEP();
  
  const handleCEPBlur = async () => {
    const cep = form.getValues("cep");
    if (cep && cep.replace(/\D/g, "").length === 8) {
      await fillAddressFromCEP(
        cep,
        form.setValue,
        {
          logradouro: "endereco",
          bairro: "bairro",
          localidade: "cidade",
          uf: "estado"
        }
      );
    }
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    form.setValue("cep", formatted);
  };
}
```

### Opção 3: Usando o Serviço Diretamente

```tsx
import { cepService } from "@/lib/cep-service";

// Buscar dados do CEP
const cepData = await cepService.fetchCEP("12345-678");

// Preencher endereço automaticamente
await cepService.fillAddressFromCEP(
  "12345-678",
  setValue,
  {
    logradouro: "endereco",
    bairro: "bairro",
    localidade: "cidade",
    uf: "estado"
  }
);

// Formatar CEP
const formatted = cepService.formatCEP("12345678"); // "12345-678"

// Validar CEP
const isValid = cepService.validateCEP("12345-678"); // true
```

## Mapeamento de Campos

O `fieldMapping` permite mapear os campos retornados pela API ViaCEP para os campos do seu formulário:

```tsx
{
  logradouro: "endereco", // Campo da API -> Campo do formulário
  bairro: "bairro",
  localidade: "cidade",
  uf: "estado"
}
```

## Recursos

### Cache Automático
- CEPs já consultados são armazenados em cache
- Evita requisições desnecessárias
- Melhora a performance da aplicação

### Tratamento de Erros
- Validação de formato do CEP
- Tratamento de CEPs não encontrados
- Tratamento de erros de rede
- Feedback visual para o usuário

### Formatação Automática
- Formatação do CEP no padrão brasileiro (00000-000)
- Validação de entrada
- Limpeza de caracteres especiais

### Loading States
- Indicador visual durante requisições
- Desabilitação do campo durante busca
- Feedback imediato para o usuário

## Exemplos de Uso

### Formulário de Paciente
```tsx
<CEPInput
  value={field.value}
  onChange={field.onChange}
  fieldMapping={{
    logradouro: "endereco",
    bairro: "bairro",
    localidade: "cidade",
    uf: "estado"
  }}
  setValue={(fieldName, value) => {
    form.setValue(fieldName as keyof PacienteFormValues, value as any);
  }}
  required
/>
```

### Formulário de Profissional
```tsx
<CEPInput
  value={field.value}
  onChange={field.onChange}
  fieldMapping={{
    logradouro: "rua",
    bairro: "bairro",
    localidade: "cidade",
    uf: "estado"
  }}
  setValue={(fieldName, value) => {
    form.setValue(fieldName as keyof ProfissionalFormValues, value as string);
  }}
  required
/>
```

## Benefícios

1. **Reutilização**: Um único componente para todos os formulários
2. **Consistência**: Comportamento padronizado em toda a aplicação
3. **Manutenibilidade**: Mudanças centralizadas
4. **Performance**: Cache inteligente
5. **UX**: Feedback visual e tratamento de erros
6. **Type Safety**: Tipagem completa com TypeScript 
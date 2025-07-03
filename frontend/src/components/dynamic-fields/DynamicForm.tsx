import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { DynamicField } from './DynamicField';
import { 
  TemplateEspecialidade, 
  CampoTemplate, 
  ValidacaoCampo,
  TipoCampo 
} from '@/types/api';

interface DynamicFormProps {
  template: TemplateEspecialidade;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  disabled?: boolean;
  showValidation?: boolean;
}

export function DynamicForm({ 
  template, 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  disabled = false,
  showValidation = true 
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Organizar campos por seções
  const camposPorSecao = template.campos.reduce((acc, campo) => {
    const secao = campo.secao || 'Geral';
    if (!acc[secao]) {
      acc[secao] = [];
    }
    acc[secao].push(campo);
    return acc;
  }, {} as Record<string, CampoTemplate[]>);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };

  const validateField = (campo: CampoTemplate, value: any): string => {
    // Validações obrigatórias
    if (campo.obrigatorio && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${campo.nome} é obrigatório`;
    }

    // Validações customizadas
    for (const validacao of campo.validacoes) {
      switch (validacao.tipo) {
        case 'min':
          if (value && value < validacao.valor) {
            return validacao.mensagem || `${campo.nome} deve ser maior que ${validacao.valor}`;
          }
          break;
        case 'max':
          if (value && value > validacao.valor) {
            return validacao.mensagem || `${campo.nome} deve ser menor que ${validacao.valor}`;
          }
          break;
        case 'pattern':
          if (value && !new RegExp(validacao.valor).test(value)) {
            return validacao.mensagem || `${campo.nome} não está no formato correto`;
          }
          break;
        case 'custom':
          // Validação customizada pode ser implementada aqui
          break;
      }
    }

    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    template.campos.forEach(campo => {
      const error = validateField(campo, formData[campo.id]);
      if (error) {
        newErrors[campo.id] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success('Formulário salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar formulário');
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (campo: CampoTemplate) => {
    const fieldProps = {
      id: campo.id,
      nome: campo.nome,
      tipo: campo.tipo,
      obrigatorio: campo.obrigatorio,
      opcoes: campo.opcoes,
      valorPadrao: campo.valorPadrao,
      validacoes: campo.validacoes,
      ordem: campo.ordem,
      ativo: campo.ativo,
      descricao: campo.descricao
    };

    return (
      <DynamicField
        key={campo.id}
        field={fieldProps}
        value={formData[campo.id]}
        onChange={(value) => handleFieldChange(campo.id, value)}
        error={errors[campo.id]}
        disabled={disabled}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header do formulário */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{template.nome}</h2>
          <p className="text-muted-foreground">{template.descricao}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{template.categoria}</Badge>
          <Badge variant="secondary">{template.campos.length} campos</Badge>
        </div>
      </div>

      {/* Seções do formulário */}
      {Object.entries(camposPorSecao).map(([secao, campos]) => (
        <Card key={secao}>
          <CardHeader>
            <CardTitle className="text-lg">{secao}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campos
                .sort((a, b) => a.ordem - b.ordem)
                .map(renderField)}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Validações do template */}
      {showValidation && template.validacoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Validações do Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {template.validacoes.map((validacao, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">{validacao.tipo}</p>
                  <p className="text-sm text-muted-foreground">{validacao.mensagem}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botões de ação */}
      <div className="flex items-center justify-end gap-2 pt-6 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={disabled || isSubmitting}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={disabled || isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 
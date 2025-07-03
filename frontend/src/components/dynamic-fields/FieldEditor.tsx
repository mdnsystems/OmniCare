import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Save, 
  Copy, 
  Settings, 
  Eye, 
  EyeOff,
  GripVertical,
  X
} from 'lucide-react';
import { 
  TipoCampo, 
  CategoriaCampo, 
  CampoPersonalizado, 
  ValidacaoCampo,
  CalculoCampo 
} from '@/types/api';

interface FieldEditorProps {
  field?: CampoPersonalizado;
  onSave: (field: CampoPersonalizado) => void;
  onCancel: () => void;
  categoria: CategoriaCampo;
}

export function FieldEditor({ field, onSave, onCancel, categoria }: FieldEditorProps) {
  const [formData, setFormData] = useState<Partial<CampoPersonalizado>>(
    field || {
      nome: '',
      tipo: TipoCampo.TEXTO,
      categoria,
      obrigatorio: false,
      opcoes: [],
      valorPadrao: '',
      validacoes: [],
      dependencias: [],
      calculos: [],
      ordem: 0,
      ativo: true
    }
  );

  const [newOption, setNewOption] = useState('');
  const [newValidation, setNewValidation] = useState<Partial<ValidacaoCampo>>({});
  const [newCalculation, setNewCalculation] = useState<Partial<CalculoCampo>>({});

  const tiposCampo = [
    { value: TipoCampo.TEXTO, label: 'Texto', icon: '📝' },
    { value: TipoCampo.NUMERO, label: 'Número', icon: '🔢' },
    { value: TipoCampo.DATA, label: 'Data', icon: '📅' },
    { value: TipoCampo.SELECT, label: 'Seleção Única', icon: '📋' },
    { value: TipoCampo.MULTISELECT, label: 'Seleção Múltipla', icon: '📋' },
    { value: TipoCampo.TEXTAREA, label: 'Área de Texto', icon: '📄' },
    { value: TipoCampo.BOOLEANO, label: 'Sim/Não', icon: '✅' },
    { value: TipoCampo.EMAIL, label: 'E-mail', icon: '📧' },
    { value: TipoCampo.TELEFONE, label: 'Telefone', icon: '📞' },
    { value: TipoCampo.CEP, label: 'CEP', icon: '📍' },
    { value: TipoCampo.CPF, label: 'CPF', icon: '🆔' },
    { value: TipoCampo.CNPJ, label: 'CNPJ', icon: '🏢' },
    { value: TipoCampo.MOEDA, label: 'Moeda', icon: '💰' },
    { value: TipoCampo.PERCENTUAL, label: 'Percentual', icon: '📊' },
    { value: TipoCampo.COR, label: 'Cor', icon: '🎨' },
    { value: TipoCampo.ARQUIVO, label: 'Arquivo', icon: '📎' },
    { value: TipoCampo.IMAGEM, label: 'Imagem', icon: '🖼️' },
    { value: TipoCampo.ASSINATURA, label: 'Assinatura', icon: '✍️' },
    { value: TipoCampo.GEOLOCALIZACAO, label: 'Localização', icon: '📍' }
  ];

  const tiposValidacao = [
    { value: 'required', label: 'Obrigatório' },
    { value: 'min', label: 'Valor Mínimo' },
    { value: 'max', label: 'Valor Máximo' },
    { value: 'pattern', label: 'Padrão (Regex)' },
    { value: 'custom', label: 'Customizado' }
  ];

  const tiposCalculo = [
    { value: 'soma', label: 'Soma' },
    { value: 'subtracao', label: 'Subtração' },
    { value: 'multiplicacao', label: 'Multiplicação' },
    { value: 'divisao', label: 'Divisão' },
    { value: 'formula', label: 'Fórmula Customizada' }
  ];

  const handleSave = () => {
    if (!formData.nome || !formData.tipo) {
      toast.error('Nome e tipo são obrigatórios');
      return;
    }

    const fieldData: CampoPersonalizado = {
      id: field?.id || `field-${Date.now()}`,
      tenantId: field?.tenantId || 'default',
      nome: formData.nome,
      tipo: formData.tipo,
      categoria: formData.categoria || categoria,
      obrigatorio: formData.obrigatorio || false,
      opcoes: formData.opcoes || [],
      valorPadrao: formData.valorPadrao,
      validacoes: formData.validacoes || [],
      dependencias: formData.dependencias || [],
      calculos: formData.calculos || [],
      ordem: formData.ordem || 0,
      ativo: formData.ativo !== false,
      createdAt: field?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(fieldData);
    toast.success('Campo salvo com sucesso!');
  };

  const addOption = () => {
    if (newOption.trim()) {
      setFormData(prev => ({
        ...prev,
        opcoes: [...(prev.opcoes || []), newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      opcoes: prev.opcoes?.filter((_, i) => i !== index) || []
    }));
  };

  const addValidation = () => {
    if (newValidation.tipo && newValidation.mensagem) {
      setFormData(prev => ({
        ...prev,
        validacoes: [...(prev.validacoes || []), newValidation as ValidacaoCampo]
      }));
      setNewValidation({});
    }
  };

  const removeValidation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      validacoes: prev.validacoes?.filter((_, i) => i !== index) || []
    }));
  };

  const addCalculation = () => {
    if (newCalculation.tipo && newCalculation.resultado) {
      setFormData(prev => ({
        ...prev,
        calculos: [...(prev.calculos || []), newCalculation as CalculoCampo]
      }));
      setNewCalculation({});
    }
  };

  const removeCalculation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      calculos: prev.calculos?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {field ? 'Editar Campo' : 'Novo Campo'}
          </h2>
          <p className="text-muted-foreground">
            Configure as propriedades do campo dinâmico
          </p>
        </div>
        <Badge variant="outline">{categoria}</Badge>
      </div>

      {/* Configurações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Campo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Altura, Peso, Telefone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Campo *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: TipoCampo) => setFormData(prev => ({ ...prev, tipo: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposCampo.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      <span className="flex items-center gap-2">
                        <span>{tipo.icon}</span>
                        {tipo.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ordem">Ordem</Label>
              <Input
                id="ordem"
                type="number"
                value={formData.ordem}
                onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorPadrao">Valor Padrão</Label>
              <Input
                id="valorPadrao"
                value={formData.valorPadrao || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, valorPadrao: e.target.value }))}
                placeholder="Valor padrão"
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="obrigatorio"
                checked={formData.obrigatorio}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, obrigatorio: checked }))}
              />
              <Label htmlFor="obrigatorio">Campo obrigatório</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opções (para SELECT e MULTISELECT) */}
      {(formData.tipo === TipoCampo.SELECT || formData.tipo === TipoCampo.MULTISELECT) && (
        <Card>
          <CardHeader>
            <CardTitle>Opções de Seleção</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Nova opção"
                onKeyPress={(e) => e.key === 'Enter' && addOption()}
              />
              <Button type="button" onClick={addOption} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {formData.opcoes?.map((opcao, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{opcao}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Validações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Select
              value={newValidation.tipo}
              onValueChange={(value) => setNewValidation(prev => ({ ...prev, tipo: value as any }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de validação" />
              </SelectTrigger>
              <SelectContent>
                {tiposValidacao.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={newValidation.valor || ''}
              onChange={(e) => setNewValidation(prev => ({ ...prev, valor: e.target.value }))}
              placeholder="Valor"
            />

            <Input
              value={newValidation.mensagem || ''}
              onChange={(e) => setNewValidation(prev => ({ ...prev, mensagem: e.target.value }))}
              placeholder="Mensagem de erro"
            />
          </div>

          <Button type="button" onClick={addValidation} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Validação
          </Button>

          <div className="space-y-2">
            {formData.validacoes?.map((validacao, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                <Badge variant="outline">{validacao.tipo}</Badge>
                <span className="flex-1">{validacao.mensagem}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeValidation(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cálculos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Cálculos Automáticos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Select
              value={newCalculation.tipo}
              onValueChange={(value) => setNewCalculation(prev => ({ ...prev, tipo: value as any }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de cálculo" />
              </SelectTrigger>
              <SelectContent>
                {tiposCalculo.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={newCalculation.resultado || ''}
              onChange={(e) => setNewCalculation(prev => ({ ...prev, resultado: e.target.value }))}
              placeholder="Campo de resultado"
            />
          </div>

          <Button type="button" onClick={addCalculation} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Cálculo
          </Button>

          <div className="space-y-2">
            {formData.calculos?.map((calculo, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                <Badge variant="outline">{calculo.tipo}</Badge>
                <span className="flex-1">→ {calculo.resultado}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCalculation(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botões de ação */}
      <div className="flex items-center justify-end gap-2 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Campo
        </Button>
      </div>
    </div>
  );
} 
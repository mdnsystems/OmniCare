import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Upload, X } from 'lucide-react';
import { TipoCampo, CampoPersonalizado, ValidacaoCampo } from '@/types/api';

interface DynamicFieldProps {
  field: CampoPersonalizado;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export function DynamicField({ field, value, onChange, error, disabled }: DynamicFieldProps) {
  const renderField = () => {
    switch (field.tipo) {
      case TipoCampo.TEXTO:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.nome}
            disabled={disabled}
            className={error ? 'border-red-500' : ''}
          />
        );

      case TipoCampo.NUMERO:
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            placeholder={field.nome}
            disabled={disabled}
            className={error ? 'border-red-500' : ''}
          />
        );

      case TipoCampo.DATA:
        return (
          <DatePicker
            value={value ? new Date(value) : undefined}
            onSelect={(date) => onChange(date?.toISOString())}
            disabled={disabled}
          />
        );

      case TipoCampo.SELECT:
        return (
          <Select
            value={value || ''}
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={`Selecione ${field.nome}`} />
            </SelectTrigger>
            <SelectContent>
              {field.opcoes?.map((opcao) => (
                <SelectItem key={opcao} value={opcao}>
                  {opcao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case TipoCampo.MULTISELECT:
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {selectedValues.map((item: string) => (
                <Badge key={item} variant="secondary" className="flex items-center gap-1">
                  {item}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => onChange(selectedValues.filter(v => v !== item))}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Select
              onValueChange={(newValue) => {
                if (!selectedValues.includes(newValue)) {
                  onChange([...selectedValues, newValue]);
                }
              }}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Adicionar ${field.nome}`} />
              </SelectTrigger>
              <SelectContent>
                {field.opcoes?.filter(opcao => !selectedValues.includes(opcao)).map((opcao) => (
                  <SelectItem key={opcao} value={opcao}>
                    {opcao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case TipoCampo.TEXTAREA:
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.nome}
            disabled={disabled}
            className={error ? 'border-red-500' : ''}
            rows={4}
          />
        );

      case TipoCampo.BOOLEANO:
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value || false}
              onCheckedChange={onChange}
              disabled={disabled}
            />
            <Label className="text-sm font-medium">{field.nome}</Label>
          </div>
        );

      case TipoCampo.EMAIL:
        return (
          <Input
            type="email"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.nome}
            disabled={disabled}
            className={error ? 'border-red-500' : ''}
          />
        );

      case TipoCampo.TELEFONE:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="(00) 00000-0000"
            disabled={disabled}
            className={error ? 'border-red-500' : ''}
          />
        );

      case TipoCampo.CEP:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="00000-000"
            disabled={disabled}
            className={error ? 'border-red-500' : ''}
          />
        );

      case TipoCampo.CPF:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="000.000.000-00"
            disabled={disabled}
            className={error ? 'border-red-500' : ''}
          />
        );

      case TipoCampo.CNPJ:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="00.000.000/0000-00"
            disabled={disabled}
            className={error ? 'border-red-500' : ''}
          />
        );

      case TipoCampo.MOEDA:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="R$ 0,00"
            disabled={disabled}
            className={error ? 'border-red-500' : ''}
          />
        );

      case TipoCampo.PERCENTUAL:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0%"
            disabled={disabled}
            className={error ? 'border-red-500' : ''}
          />
        );

      case TipoCampo.COR:
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="w-16 h-10"
            />
            <Input
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              disabled={disabled}
              className={error ? 'border-red-500' : ''}
            />
          </div>
        );

      case TipoCampo.ARQUIVO:
        return (
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={disabled}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    onChange(file);
                  }
                };
                input.click();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Selecionar arquivo
            </Button>
            {value && (
              <div className="text-sm text-muted-foreground">
                Arquivo selecionado: {typeof value === 'string' ? value : value.name}
              </div>
            )}
          </div>
        );

      case TipoCampo.IMAGEM:
        return (
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={disabled}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    onChange(file);
                  }
                };
                input.click();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Selecionar imagem
            </Button>
            {value && (
              <div className="text-sm text-muted-foreground">
                Imagem selecionada: {typeof value === 'string' ? value : value.name}
              </div>
            )}
          </div>
        );

      case TipoCampo.ASSINATURA:
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Área para assinatura digital
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              disabled={disabled}
            >
              Assinar
            </Button>
          </div>
        );

      case TipoCampo.GEOLOCALIZACAO:
        return (
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={disabled}
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      onChange({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                      });
                    },
                    (error) => {
                      console.error('Erro ao obter localização:', error);
                    }
                  );
                }
              }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Obter localização
            </Button>
            {value && (
              <div className="text-sm text-muted-foreground">
                Lat: {value.latitude}, Lng: {value.longitude}
              </div>
            )}
          </div>
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.nome}
            disabled={disabled}
            className={error ? 'border-red-500' : ''}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className="text-sm font-medium">
        {field.nome}
        {field.obrigatorio && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {field.descricao && (
        <p className="text-xs text-muted-foreground">{field.descricao}</p>
      )}
    </div>
  );
} 
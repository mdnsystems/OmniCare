import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCEP } from "@/hooks/use-cep";

interface CEPInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  fieldMapping: {
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
  };
  setValue: (field: string, value: string) => void;
  showToast?: boolean;
}

export function CEPInput({
  value,
  onChange,
  onBlur,
  label = "CEP",
  placeholder = "00000-000",
  required = false,
  disabled = false,
  error,
  fieldMapping,
  setValue,
  showToast = true,
}: CEPInputProps) {
  const { formatCEP, fillAddressFromCEP, loading: cepLoading } = useCEP();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const formatted = formatCEP(newValue);
    onChange(formatted);
  };

  const handleBlur = async () => {
    if (value && value.replace(/\D/g, "").length === 8) {
      await fillAddressFromCEP(value, setValue, fieldMapping, showToast);
    }
    onBlur?.();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="cep">
        {label} {required && "*"}
      </Label>
      <Input
        id="cep"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled || cepLoading}
        maxLength={9}
        aria-describedby={error ? "cep-error" : undefined}
        aria-invalid={!!error}
      />
      {error && (
        <p id="cep-error" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
} 
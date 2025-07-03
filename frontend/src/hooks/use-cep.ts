import { useState, useCallback } from "react";
import { cepService } from "@/lib/cep-service";

// Re-exporta os tipos do serviço
export type { CEPData, CEPError } from "@/lib/cep-service";

export function useCEP() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<import("@/lib/cep-service").CEPError | null>(null);

  const fetchCEP = useCallback(async (cep: string): Promise<import("@/lib/cep-service").CEPData | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await cepService.fetchCEP(cep);
      
      if (!result) {
        setError({ message: "CEP não encontrado ou inválido", code: "NOT_FOUND" });
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar CEP";
      const error: import("@/lib/cep-service").CEPError = { message: errorMessage, code: "NETWORK_ERROR" };
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fillAddressFromCEP = useCallback(async (
    cep: string,
    setValue: (field: string, value: string) => void,
    fieldMapping: {
      logradouro?: string;
      bairro?: string;
      localidade?: string;
      uf?: string;
    },
    showToast: boolean = true
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await cepService.fillAddressFromCEP(cep, setValue, fieldMapping, showToast);
      
      if (!result) {
        setError({ message: "CEP não encontrado ou inválido", code: "NOT_FOUND" });
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar CEP";
      const error: import("@/lib/cep-service").CEPError = { message: errorMessage, code: "NETWORK_ERROR" };
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCache = useCallback(() => {
    cepService.clearCache();
  }, []);

  const formatCEP = useCallback((value: string): string => {
    return cepService.formatCEP(value);
  }, []);

  const validateCEP = useCallback((cep: string): boolean => {
    return cepService.validateCEP(cep);
  }, []);

  return {
    fetchCEP,
    fillAddressFromCEP,
    formatCEP,
    validateCEP,
    loading,
    error,
    clearError,
    clearCache,
  };
} 
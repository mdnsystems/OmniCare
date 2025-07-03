import { toast } from "sonner";

export interface CEPData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface CEPError {
  message: string;
  code?: string;
}

// Cache global para CEPs
const cepCache = new Map<string, CEPData>();

class CEPService {
  private static instance: CEPService;

  private constructor() {}

  public static getInstance(): CEPService {
    if (!CEPService.instance) {
      CEPService.instance = new CEPService();
    }
    return CEPService.instance;
  }

  /**
   * Busca dados do CEP na API ViaCEP
   */
  async fetchCEP(cep: string): Promise<CEPData | null> {
    try {
      // Remove caracteres não numéricos
      const cleanCEP = cep.replace(/\D/g, "");

      if (cleanCEP.length !== 8) {
        throw new Error("CEP deve ter 8 dígitos");
      }

      // Verifica se já está no cache
      if (cepCache.has(cleanCEP)) {
        return cepCache.get(cleanCEP)!;
      }

      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data: CEPData = await response.json();

      if (data.erro) {
        throw new Error("CEP não encontrado");
      }

      // Salva no cache
      cepCache.set(cleanCEP, data);

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao buscar CEP";
      console.error("Erro ao buscar CEP:", error);
      return null;
    }
  }

  /**
   * Preenche automaticamente os campos de endereço baseado no CEP
   */
  async fillAddressFromCEP(
    cep: string,
    setValue: (field: string, value: string) => void,
    fieldMapping: {
      logradouro?: string;
      bairro?: string;
      localidade?: string;
      uf?: string;
    },
    showToast: boolean = true
  ): Promise<boolean> {
    const cepData = await this.fetchCEP(cep);
    
    if (!cepData) {
      if (showToast) {
        toast.error("CEP não encontrado ou inválido");
      }
      return false;
    }

    // Mapeia os campos conforme especificado
    if (fieldMapping.logradouro) {
      setValue(fieldMapping.logradouro, cepData.logradouro);
    }
    if (fieldMapping.bairro) {
      setValue(fieldMapping.bairro, cepData.bairro);
    }
    if (fieldMapping.localidade) {
      setValue(fieldMapping.localidade, cepData.localidade);
    }
    if (fieldMapping.uf) {
      setValue(fieldMapping.uf, cepData.uf);
    }

    if (showToast) {
      toast.success("Endereço preenchido automaticamente!");
    }

    return true;
  }

  /**
   * Formata CEP para o padrão brasileiro (00000-000)
   */
  formatCEP(value: string): string {
    const cleanValue = value.replace(/\D/g, "");
    return cleanValue.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  /**
   * Valida se o CEP está no formato correto
   */
  validateCEP(cep: string): boolean {
    const cleanCEP = cep.replace(/\D/g, "");
    return cleanCEP.length === 8;
  }

  /**
   * Limpa o cache de CEPs
   */
  clearCache(): void {
    cepCache.clear();
  }

  /**
   * Obtém um CEP do cache (se existir)
   */
  getFromCache(cep: string): CEPData | undefined {
    const cleanCEP = cep.replace(/\D/g, "");
    return cepCache.get(cleanCEP);
  }

  /**
   * Verifica se um CEP está no cache
   */
  isInCache(cep: string): boolean {
    const cleanCEP = cep.replace(/\D/g, "");
    return cepCache.has(cleanCEP);
  }
}

// Exporta uma instância singleton
export const cepService = CEPService.getInstance();

// Exporta tipos para uso em outros arquivos
export type { CEPData, CEPError }; 
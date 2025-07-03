export interface Exame {
  id: string;
  tenantId: string;
  prontuarioId: string;
  tipo: string;
  data: string;
  resultado: string;
  observacoes?: string;
  arquivos: ArquivoExame[];
  createdAt: string;
  updatedAt: string;
  
  // Relacionamentos
  prontuario?: {
    id: string;
    paciente?: {
      id: string;
      nome: string;
      cpf: string;
      telefone: string;
      email: string;
      dataNascimento: string;
    };
    profissional?: {
      id: string;
      nome: string;
      crm: string;
      especialidade?: {
        id: string;
        nome: string;
      };
    };
  };
}

export interface ArquivoExame {
  id: string;
  nome: string;
  tipo: string;
  url: string;
  tamanho: number;
  uploadedAt: string;
} 
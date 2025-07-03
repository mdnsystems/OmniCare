export interface Lembrete {
  id: string;
  tenantId: string;
  pacienteId: string;
  profissionalId: string;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  tipo: string;
  status: string;
  prioridade: string;
  repetir: boolean;
  frequencia?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relacionamentos
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
} 
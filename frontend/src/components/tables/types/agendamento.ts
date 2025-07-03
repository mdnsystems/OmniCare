import { TipoAgendamento, StatusAgendamento } from "@/types/api";

export interface Agendamento {
  id: string;
  tenantId: string;
  pacienteId: string;
  profissionalId: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  tipo: TipoAgendamento;
  status: StatusAgendamento;
  observacoes?: string;
  camposPersonalizados?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  
  // Relacionamentos
  paciente?: {
    id: string;
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
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
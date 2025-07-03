import { api, extractData, handleApiError, PaginatedResponse } from './api';
import { 
  FaturaClinica, 
  CriarFaturaClinica, 
  RegistrarPagamentoClinica, 
  EnviarLembreteClinica, 
  AplicarBloqueioClinica,
  PainelFinanceiroData,
  StatusFatura,
  NivelBloqueio
} from '@/types/api';

export interface FaturaClinicaFilters {
  tenantId?: string;
  status?: StatusFatura;
  nivelBloqueio?: NivelBloqueio;
  dataVencimentoInicio?: string;
  dataVencimentoFim?: string;
  page?: number;
  limit?: number;
}

// Funções mock para faturas de clínica (endpoints não existem no backend ainda)
export const getFaturasClinica = async (filters?: FaturaClinicaFilters): Promise<PaginatedResponse<FaturaClinica>> => {
  // Mock temporário até implementar no backend
  const mockFaturas: FaturaClinica[] = [
    {
      id: 'mock-1',
      tenantId: filters?.tenantId || 'default-tenant',
      numeroFatura: 'FAT-2024-001',
      valor: 299.90,
      dataVencimento: '2024-01-15T00:00:00.000Z',
      status: 'PENDENTE' as StatusFatura,
      diasAtraso: 0,
      nivelBloqueio: 'SEM_BLOQUEIO' as NivelBloqueio,
      observacoes: 'Fatura mock para desenvolvimento',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      clinica: {
        id: 'clinica-1',
        tenantId: filters?.tenantId || 'default-tenant',
        nome: 'OmniCare',
        tipo: 'NUTRICIONAL',
        logo: null,
        corPrimaria: '#059669',
        corSecundaria: '#047857',
        tema: 'auto',
        ativo: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    },
    {
      id: 'mock-2',
      tenantId: filters?.tenantId || 'default-tenant',
      numeroFatura: 'FAT-2024-002',
      valor: 399.90,
      dataVencimento: '2024-01-10T00:00:00.000Z', // Vencida há alguns dias
      status: 'VENCIDO' as StatusFatura,
      diasAtraso: 5,
      nivelBloqueio: 'AVISO_TOPO' as NivelBloqueio,
      observacoes: 'Fatura vencida para teste de bloqueio',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      clinica: {
        id: 'clinica-1',
        tenantId: filters?.tenantId || 'default-tenant',
        nome: 'OmniCare',
        tipo: 'NUTRICIONAL',
        logo: null,
        corPrimaria: '#059669',
        corSecundaria: '#047857',
        tema: 'auto',
        ativo: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  ];

  return {
    data: mockFaturas,
    pagination: {
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      total: mockFaturas.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  };
};

export const getFaturasClinicaByTenant = async (tenantId: string): Promise<FaturaClinica[]> => {
  // Mock temporário até implementar no backend
  console.log('🔍 Buscando faturas para tenant:', tenantId);
  
  return [
    {
      id: 'mock-1',
      tenantId: tenantId,
      numeroFatura: 'FAT-2024-001',
      valor: 299.90,
      dataVencimento: '2024-01-15T00:00:00.000Z',
      status: 'PENDENTE' as StatusFatura,
      diasAtraso: 0,
      nivelBloqueio: 'SEM_BLOQUEIO' as NivelBloqueio,
      observacoes: 'Fatura mock para desenvolvimento',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      clinica: {
        id: 'clinica-1',
        tenantId: tenantId,
        nome: 'OmniCare',
        tipo: 'NUTRICIONAL',
        logo: null,
        corPrimaria: '#059669',
        corSecundaria: '#047857',
        tema: 'auto',
        ativo: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    },
    {
      id: 'mock-2',
      tenantId: tenantId,
      numeroFatura: 'FAT-2024-002',
      valor: 399.90,
      dataVencimento: '2024-01-10T00:00:00.000Z', // Vencida há alguns dias
      status: 'VENCIDO' as StatusFatura,
      diasAtraso: 5,
      nivelBloqueio: 'AVISO_TOPO' as NivelBloqueio,
      observacoes: 'Fatura vencida para teste de bloqueio',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      clinica: {
        id: 'clinica-1',
        tenantId: tenantId,
        nome: 'OmniCare',
        tipo: 'NUTRICIONAL',
        logo: null,
        corPrimaria: '#059669',
        corSecundaria: '#047857',
        tema: 'auto',
        ativo: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  ];
};

export const getFaturaClinica = async (id: string): Promise<FaturaClinica> => {
  // Mock temporário até implementar no backend
  return {
    id,
    tenantId: 'default-tenant',
    numeroFatura: `FAT-2024-${id}`,
    valor: 299.90,
    dataVencimento: '2024-01-15T00:00:00.000Z',
    status: 'PENDENTE' as StatusFatura,
    diasAtraso: 0,
    nivelBloqueio: 'SEM_BLOQUEIO' as NivelBloqueio,
    observacoes: 'Fatura mock para desenvolvimento',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    clinica: {
      id: 'clinica-1',
      tenantId: 'default-tenant',
      nome: 'OmniCare',
      tipo: 'NUTRICIONAL',
      logo: null,
      corPrimaria: '#059669',
      corSecundaria: '#047857',
      tema: 'auto',
      ativo: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  };
};

export const createFaturaClinica = async (data: CriarFaturaClinica): Promise<FaturaClinica> => {
  // Mock temporário até implementar no backend
  console.log('Criando fatura:', data);
  
  return {
    id: 'mock-created',
    tenantId: data.tenantId,
    numeroFatura: data.numeroFatura,
    valor: data.valor,
    dataVencimento: data.dataVencimento,
    status: 'PENDENTE' as StatusFatura,
    diasAtraso: 0,
    nivelBloqueio: 'SEM_BLOQUEIO' as NivelBloqueio,
    observacoes: data.observacoes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    clinica: {
      id: 'clinica-1',
      tenantId: data.tenantId,
      nome: 'OmniCare',
      tipo: 'NUTRICIONAL',
      logo: null,
      corPrimaria: '#059669',
      corSecundaria: '#047857',
      tema: 'auto',
      ativo: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  };
};

export const updateFaturaClinica = async (id: string, data: Partial<FaturaClinica>): Promise<FaturaClinica> => {
  // Mock temporário até implementar no backend
  console.log('Atualizando fatura:', id, data);
  
  return {
    id,
    tenantId: 'default-tenant',
    numeroFatura: `FAT-2024-${id}`,
    valor: data.valor || 299.90,
    dataVencimento: data.dataVencimento || '2024-01-15T00:00:00.000Z',
    status: data.status || 'PENDENTE',
    diasAtraso: data.diasAtraso || 0,
    nivelBloqueio: data.nivelBloqueio || 'SEM_BLOQUEIO',
    observacoes: data.observacoes || 'Fatura mock atualizada',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
    clinica: {
      id: 'clinica-1',
      tenantId: 'default-tenant',
      nome: 'OmniCare',
      tipo: 'NUTRICIONAL',
      logo: null,
      corPrimaria: '#059669',
      corSecundaria: '#047857',
      tema: 'auto',
      ativo: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  };
};

export const deleteFaturaClinica = async (id: string): Promise<void> => {
  // Mock temporário até implementar no backend
  console.log('Deletando fatura:', id);
};

export const updateStatusFaturaClinica = async (id: string, status: StatusFatura): Promise<FaturaClinica> => {
  // Mock temporário até implementar no backend
  console.log('Atualizando status da fatura:', id, status);
  
  return {
    id,
    tenantId: 'default-tenant',
    numeroFatura: `FAT-2024-${id}`,
    valor: 299.90,
    dataVencimento: '2024-01-15T00:00:00.000Z',
    status,
    diasAtraso: 0,
    nivelBloqueio: 'SEM_BLOQUEIO' as NivelBloqueio,
    observacoes: 'Fatura mock atualizada',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
    clinica: {
      id: 'clinica-1',
      tenantId: 'default-tenant',
      nome: 'OmniCare',
      tipo: 'NUTRICIONAL',
      logo: null,
      corPrimaria: '#059669',
      corSecundaria: '#047857',
      tema: 'auto',
      ativo: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  };
};

export const registrarPagamentoClinica = async (data: RegistrarPagamentoClinica): Promise<any> => {
  // Mock temporário até implementar no backend
  console.log('Registrando pagamento:', data);
  
  return {
    id: 'pagamento-1',
    faturaId: data.faturaId,
    valor: data.valor,
    dataPagamento: data.dataPagamento,
    formaPagamento: data.formaPagamento,
    comprovante: data.comprovante,
    observacoes: data.observacoes,
    createdAt: new Date().toISOString()
  };
};

export const enviarLembreteClinica = async (data: EnviarLembreteClinica): Promise<any> => {
  // Mock temporário até implementar no backend
  console.log('Enviando lembrete:', data);
  
  return {
    id: 'lembrete-1',
    faturaId: data.faturaId,
    tipo: data.tipo,
    destinatario: data.destinatario,
    mensagem: data.mensagem,
    enviadoEm: new Date().toISOString(),
    status: 'enviado'
  };
};

export const aplicarBloqueioClinica = async (data: AplicarBloqueioClinica): Promise<any> => {
  // Mock temporário até implementar no backend
  console.log('Aplicando bloqueio:', data);
  
  return {
    id: 'bloqueio-1',
    faturaId: data.faturaId,
    nivelBloqueio: data.nivelBloqueio,
    motivo: data.motivo,
    aplicadoEm: new Date().toISOString(),
    aplicadoPor: data.aplicadoPor
  };
};

export const getPainelFinanceiro = async (): Promise<PainelFinanceiroData> => {
  // Mock temporário até implementar no backend
  return {
    receitaTotal: 50000,
    receitaPaga: 35000,
    receitaPendente: 12000,
    receitaVencida: 3000,
    totalFaturas: 160,
    faturasPagas: 140,
    faturasPendentes: 15,
    faturasVencidas: 5,
    mediaTicket: 312.50,
    taxaConversao: 0.875,
    crescimentoMensal: 0.12,
    inadimplencia: 0.0625,
    faturamentosPorStatus: {
      PENDENTE: 15,
      PAGO: 140,
      VENCIDO: 5
    },
    faturamentosPorMes: [
      { mes: 'Jan', valor: 50000 },
      { mes: 'Fev', valor: 55000 },
      { mes: 'Mar', valor: 60000 }
    ],
    topClientes: [
      { nome: 'João Silva', valor: 5000 },
      { nome: 'Maria Santos', valor: 4500 },
      { nome: 'Pedro Costa', valor: 4000 }
    ]
  };
};

export const aplicarRegrasAutomaticas = async (): Promise<{ faturasAtualizadas: number }> => {
  // Mock temporário até implementar no backend
  console.log('Aplicando regras automáticas');
  
  return {
    faturasAtualizadas: 5
  };
};

export const gerarNumeroFatura = async (): Promise<{ numeroFatura: string }> => {
  // Mock temporário até implementar no backend
  const ano = new Date().getFullYear();
  const mes = String(new Date().getMonth() + 1).padStart(2, '0');
  const numero = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return {
    numeroFatura: `FAT-${ano}-${mes}-${numero}`
  };
};

export const getFaturasVencidas = async (): Promise<FaturaClinica[]> => {
  // Mock temporário até implementar no backend
  return [
    {
      id: 'mock-vencida',
      tenantId: 'default-tenant',
      numeroFatura: 'FAT-2024-VENCIDA',
      valor: 399.90,
      dataVencimento: '2024-01-10T00:00:00.000Z',
      status: 'VENCIDO' as StatusFatura,
      diasAtraso: 5,
      nivelBloqueio: 'AVISO_TOPO' as NivelBloqueio,
      observacoes: 'Fatura vencida',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      clinica: {
        id: 'clinica-1',
        tenantId: 'default-tenant',
        nome: 'OmniCare',
        tipo: 'NUTRICIONAL',
        logo: null,
        corPrimaria: '#059669',
        corSecundaria: '#047857',
        tema: 'auto',
        ativo: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  ];
};

export const getFaturasAVencer = async (dias: number = 7): Promise<FaturaClinica[]> => {
  // Mock temporário até implementar no backend
  return [
    {
      id: 'mock-a-vencer',
      tenantId: 'default-tenant',
      numeroFatura: 'FAT-2024-A-VENCER',
      valor: 299.90,
      dataVencimento: new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDENTE' as StatusFatura,
      diasAtraso: 0,
      nivelBloqueio: 'SEM_BLOQUEIO' as NivelBloqueio,
      observacoes: 'Fatura a vencer',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      clinica: {
        id: 'clinica-1',
        tenantId: 'default-tenant',
        nome: 'OmniCare',
        tipo: 'NUTRICIONAL',
        logo: null,
        corPrimaria: '#059669',
        corSecundaria: '#047857',
        tema: 'auto',
        ativo: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  ];
};

export const getFaturasByNivelBloqueio = async (nivelBloqueio: NivelBloqueio): Promise<FaturaClinica[]> => {
  // Mock temporário até implementar no backend
  return [
    {
      id: 'mock-bloqueio',
      tenantId: 'default-tenant',
      numeroFatura: 'FAT-2024-BLOQUEIO',
      valor: 399.90,
      dataVencimento: '2024-01-10T00:00:00.000Z',
      status: 'VENCIDO' as StatusFatura,
      diasAtraso: 5,
      nivelBloqueio,
      observacoes: 'Fatura com bloqueio',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      clinica: {
        id: 'clinica-1',
        tenantId: 'default-tenant',
        nome: 'OmniCare',
        tipo: 'NUTRICIONAL',
        logo: null,
        corPrimaria: '#059669',
        corSecundaria: '#047857',
        tema: 'auto',
        ativo: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  ];
};

export const exportFaturasClinica = async (filters?: FaturaClinicaFilters, formato: 'pdf' | 'xlsx' = 'xlsx'): Promise<Blob> => {
  // Mock temporário até implementar no backend
  console.log('Exportando faturas:', filters, formato);
  
  return new Blob(['Exportação de faturas de clínica'], { 
    type: formato === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}; 
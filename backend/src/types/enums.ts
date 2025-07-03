// =============================================================================
// ENUMS - SWIFT CLINIC API
// =============================================================================
// 
// Definição de todos os tipos enumerados utilizados no sistema
// Centraliza as constantes para facilitar manutenção e consistência
//
// =============================================================================

// Importa enums para uso interno
import { RoleUsuario } from './roleUsuario.enum';

// Exporte todos os enums manualmente criados
export { RoleUsuario } from './roleUsuario.enum';
export { TipoClinica } from './tipoClinica.enum';
export { ProfissionalStatus } from './profissionalStatus.enum';
export { TipoAgendamento } from './tipoAgendamento.enum';
export { StatusAgendamento } from './statusAgendamento.enum';
export { TipoProntuario } from './tipoProntuario.enum';
export { TipoCampo } from './tipoCampo.enum';
export { CategoriaCampo } from './categoriaCampo.enum';
export { StatusFatura } from './statusFatura.enum';
export { StatusFaturamento } from './statusFaturamento.enum';
export { FormaPagamento } from './formaPagamento.enum';
export { NivelBloqueio } from './nivelBloqueio.enum';
export { FormaPagamentoClinica } from './formaPagamentoClinica.enum';
export { TipoLembrete } from './tipoLembrete.enum';
export { StatusLembrete } from './statusLembrete.enum';
export { TipoArquivo } from './tipoArquivo.enum';

// =============================================================================
// TIPOS DE RESPOSTA DA API
// =============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// =============================================================================
// TIPOS DE AUTENTICAÇÃO
// =============================================================================

export interface JwtPayload {
  userId: string;
  tenantId: string;
  role: RoleUsuario;
  email: string;
  nome?: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
  tenantId?: string;
}

// =============================================================================
// TIPOS DE FILTROS E QUERY
// =============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams extends PaginationParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  tenantId?: string;
} 
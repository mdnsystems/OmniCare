// Enums base do sistema
export enum ProfissionalStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  FERIAS = 'FERIAS',
  LICENCA = 'LICENCA'
}

export enum RoleUsuario {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PROFISSIONAL = 'PROFISSIONAL',
  RECEPCIONISTA = 'RECEPCIONISTA'
}

// Tipos de agendamento por especialidade
export enum TipoAgendamento {
  // Tipos gerais
  CONSULTA = 'CONSULTA',
  RETORNO = 'RETORNO',
  EXAME = 'EXAME',
  PROCEDIMENTO = 'PROCEDIMENTO',
  
  // Psicologia
  SESSAO_TERAPIA = 'SESSAO_TERAPIA',
  AVALIACAO_PSICOLOGICA = 'AVALIACAO_PSICOLOGICA',
  
  // Fisioterapia
  AVALIACAO_FISICA = 'AVALIACAO_FISICA',
  SESSAO_FISIOTERAPIA = 'SESSAO_FISIOTERAPIA',
  
  // Odontologia
  PROCEDIMENTO_ODONTOLOGICO = 'PROCEDIMENTO_ODONTOLOGICO',
  LIMPEZA = 'LIMPEZA',
  EXTRACAO = 'EXTRACAO',
  
  // Estética
  PROCEDIMENTO_ESTETICO = 'PROCEDIMENTO_ESTETICO',
  CONSULTA_ESTETICA = 'CONSULTA_ESTETICA',
  
  // Veterinária
  VACINA = 'VACINA',
  CIRURGIA = 'CIRURGIA',
  CONSULTA_VETERINARIA = 'CONSULTA_VETERINARIA'
}

export enum StatusAgendamento {
  PENDENTE = 'PENDENTE',
  AGENDADO = 'AGENDADO',
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO = 'CANCELADO',
  REALIZADO = 'REALIZADO',
  REMARCADO = 'REMARCADO'
}

export enum TipoProntuario {
  // Tipos gerais
  CONSULTA = 'CONSULTA',
  RETORNO = 'RETORNO',
  EXAME = 'EXAME',
  PROCEDIMENTO = 'PROCEDIMENTO',
  DOCUMENTO = 'DOCUMENTO',
  
  // Específicos por especialidade
  AVALIACAO = 'AVALIACAO',
  SESSAO = 'SESSAO',
  RELATORIO = 'RELATORIO',
  EVOLUCAO = 'EVOLUCAO',
  PRESCRICAO = 'PRESCRICAO'
}

export enum TipoClinica {
  MEDICA = 'MEDICA',
  ODONTOLOGICA = 'ODONTOLOGICA',
  NUTRICIONAL = 'NUTRICIONAL',
  PSICOLOGICA = 'PSICOLOGICA',
  FISIOTERAPICA = 'FISIOTERAPICA',
  ESTETICA = 'ESTETICA',
  VETERINARIA = 'VETERINARIA',
  EDUCACIONAL = 'EDUCACIONAL',
  CORPORATIVA = 'CORPORATIVA',
  PERSONALIZADA = 'PERSONALIZADA'
}

// Tipos de campo dinâmicos
export enum TipoCampo {
  TEXTO = 'TEXTO',
  NUMERO = 'NUMERO',
  DATA = 'DATA',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
  TEXTAREA = 'TEXTAREA',
  ARQUIVO = 'ARQUIVO',
  BOOLEANO = 'BOOLEANO',
  EMAIL = 'EMAIL',
  TELEFONE = 'TELEFONE',
  CEP = 'CEP',
  CPF = 'CPF',
  CNPJ = 'CNPJ',
  MOEDA = 'MOEDA',
  PERCENTUAL = 'PERCENTUAL',
  COR = 'COR',
  IMAGEM = 'IMAGEM',
  ASSINATURA = 'ASSINATURA',
  GEOLOCALIZACAO = 'GEOLOCALIZACAO'
}

export enum CategoriaCampo {
  PACIENTE = 'PACIENTE',
  PROFISSIONAL = 'PROFISSIONAL',
  ANAMNESE = 'ANAMNESE',
  PRONTUARIO = 'PRONTUARIO',
  AGENDAMENTO = 'AGENDAMENTO',
  FINANCEIRO = 'FINANCEIRO',
  RELATORIO = 'RELATORIO'
}

// Interface base para todas as entidades multitenant
export interface BaseEntity {
  id: string;
  tenantId: string; // ID da clínica/tenant
  createdAt: string;
  updatedAt: string;
}

// Configuração da clínica/tenant
export interface ConfiguracaoClinica extends BaseEntity {
  nome: string;
  tipo: TipoClinica;
  logo?: string;
  corPrimaria: string;
  corSecundaria: string;
  tema: 'light' | 'dark' | 'auto';
  configuracoes: ConfiguracaoSistema;
  ativo: boolean;
}

// Interface para a entidade Clinica do banco de dados
export interface Clinica extends BaseEntity {
  nome: string;
  tipo: TipoClinica;
  logo?: string;
  corPrimaria: string;
  corSecundaria: string;
  tema: string;
  ativo: boolean;
}

export interface ConfiguracaoSistema {
  usarAnamnese: boolean;
  usarProntuario: boolean;
  usarAgendamento: boolean;
  usarFinanceiro: boolean;
  usarRelatorios: boolean;
  modulosAtivos: string[];
  templatesAtivos: string[];
  fluxosAtivos: string[];
}

// Sistema de templates por especialidade
export interface TemplateEspecialidade extends BaseEntity {
  nome: string;
  descricao: string;
  tipoClinica: TipoClinica;
  categoria: CategoriaCampo;
  campos: CampoTemplate[];
  validacoes: ValidacaoTemplate[];
  ativo: boolean;
  ordem: number;
}

export interface CampoTemplate {
  id: string;
  nome: string;
  tipo: TipoCampo;
  obrigatorio: boolean;
  opcoes?: string[];
  valorPadrao?: any;
  validacoes: ValidacaoCampo[];
  dependencias: string[];
  calculos: CalculoCampo[];
  ordem: number;
  ativo: boolean;
}

export interface ValidacaoCampo {
  tipo: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  valor: any;
  mensagem: string;
}

export interface CalculoCampo {
  tipo: 'soma' | 'subtracao' | 'multiplicacao' | 'divisao' | 'formula';
  campos: string[];
  formula?: string;
  resultado: string;
}

export interface ValidacaoTemplate {
  tipo: 'campos_obrigatorios' | 'dependencias' | 'regras_negocio';
  regras: string[];
  mensagem: string;
}

// Sistema de campos dinâmicos
export interface CampoPersonalizado extends BaseEntity {
  nome: string;
  tipo: TipoCampo;
  categoria: CategoriaCampo;
  obrigatorio: boolean;
  opcoes?: string[];
  valorPadrao?: any;
  validacoes: ValidacaoCampo[];
  dependencias: string[];
  calculos: CalculoCampo[];
  ordem: number;
  ativo: boolean;
  templateId?: string;
}

// Fluxos personalizados por especialidade
export interface FluxoEspecialidade extends BaseEntity {
  nome: string;
  descricao: string;
  tipoClinica: TipoClinica;
  etapas: EtapaFluxo[];
  validacoes: ValidacaoFluxo[];
  ativo: boolean;
}

export interface EtapaFluxo {
  id: string;
  nome: string;
  descricao: string;
  ordem: number;
  obrigatoria: boolean;
  campos: string[];
  acoes: AcaoFluxo[];
  condicoes: CondicaoFluxo[];
}

export interface AcaoFluxo {
  tipo: 'criar_registro' | 'enviar_notificacao' | 'gerar_relatorio' | 'validar_campo';
  parametros: Record<string, any>;
}

export interface CondicaoFluxo {
  campo: string;
  operador: 'igual' | 'diferente' | 'maior' | 'menor' | 'contem';
  valor: any;
}

export interface ValidacaoFluxo {
  tipo: 'etapas_obrigatorias' | 'sequencia' | 'dependencias';
  regras: string[];
  mensagem: string;
}

// Especialidades com configurações específicas
export interface Especialidade extends BaseEntity {
  nome: string;
  descricao: string;
  tipoClinica: TipoClinica;
  configuracoes: ConfiguracaoEspecialidade;
  templates: string[];
  fluxos: string[];
  ativo: boolean;
}

export interface ConfiguracaoEspecialidade {
  camposObrigatorios: string[];
  templatesDisponiveis: string[];
  fluxoEspecifico?: string;
  relatoriosDisponiveis: string[];
  dashboardsDisponiveis: string[];
}

// Entidades principais com tenant_id
export interface Profissional extends BaseEntity {
  nome: string;
  especialidadeId: string;
  registro: string;
  crm: string;
  email: string;
  telefone: string;
  sexo: string;
  dataNascimento: string;
  dataContratacao: string;
  status: ProfissionalStatus;
  // Campos de endereço diretos
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  // Campos de horário diretos
  horarioInicio: string;
  horarioFim: string;
  intervalo: string;
  diasTrabalho: string[];
  especialidade?: Especialidade;
}

export interface HorarioTrabalho {
  horarioInicio: string;
  horarioFim: string;
  intervalo: string;
  diasTrabalho: string[];
}

export interface Paciente extends BaseEntity {
  nome: string;
  dataNascimento: string;
  cpf: string;
  telefone: string;
  email: string;
  // Campos de endereço diretos (conforme schema do Prisma)
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  pais?: string;
  // Campos de convênio diretos (conforme schema do Prisma)
  convenioNome?: string;
  convenioNumero?: string;
  convenioPlano?: string;
  convenioValidade?: string;
  profissionalId: string;
  camposPersonalizados: Record<string, any>;
  profissional?: Profissional;
}

export interface Agendamento extends BaseEntity {
  pacienteId: string;
  profissionalId: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  tipo: TipoAgendamento;
  status: StatusAgendamento;
  observacoes?: string;
  camposPersonalizados: Record<string, any>;
  paciente?: Paciente;
  profissional?: Profissional;
}

export interface Prontuario extends BaseEntity {
  pacienteId: string;
  profissionalId: string;
  data: string;
  tipo: TipoProntuario;
  descricao: string;
  diagnostico?: string;
  prescricao?: string;
  observacoes?: string;
  camposPersonalizados: Record<string, any>;
  paciente?: Paciente;
  profissional?: Profissional;
}

// Anamnese dinâmica por especialidade
export interface Anamnese extends BaseEntity {
  pacienteId: string;
  profissionalId: string;
  prontuarioId: string;
  data: string;
  templateId: string;
  campos: Record<string, any>;
  paciente?: Paciente;
  profissional?: Profissional;
  prontuario?: Prontuario;
}

// Exames com suporte a arquivos
export interface Exame extends BaseEntity {
  prontuarioId: string;
  tipo: string;
  data: string;
  resultado: string;
  observacoes?: string;
  arquivos: ArquivoExame[];
  prontuario?: Prontuario;
}

export interface ArquivoExame {
  id: string;
  nome: string;
  tipo: string;
  url: string;
  tamanho: number;
  uploadedAt: string;
}

// Sistema de mensagens
export interface Mensagem extends BaseEntity {
  senderId: string;
  senderName: string;
  senderRole: RoleUsuario;
  content: string;
  timestamp: string;
}

// Usuários do sistema
export interface Usuario extends BaseEntity {
  nome?: string;
  email: string;
  senha: string;
  role: RoleUsuario;
  profissionalId?: string;
  fotoPerfil?: string;
  ativo: boolean;
}

// Configuração WhatsApp
export interface ClinicaWhatsAppConfig extends BaseEntity {
  zApiInstanceId: string;
  zApiToken: string;
  numeroWhatsApp: string;
  mensagensAtivas: {
    agendamento: boolean;
    lembrete: boolean;
    confirmacao: boolean;
    cancelamento: boolean;
  };
  templates: MessageTemplate[];
  horarioEnvioLembrete: string;
  diasAntecedenciaLembrete: number;
  ativo: boolean;
}

export interface MessageTemplate {
  id: string;
  nome: string;
  tipo: 'agendamento' | 'lembrete' | 'confirmacao' | 'cancelamento';
  template: string;
  variaveis: string[];
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

// Relatórios específicos por especialidade
export interface RelatorioEspecialidade extends BaseEntity {
  nome: string;
  descricao: string;
  tipoClinica: TipoClinica;
  tipo: 'consultas' | 'faturamento' | 'desempenho' | 'pacientes' | 'customizado';
  parametros: ParametroRelatorio[];
  template: string;
  ativo: boolean;
}

export interface ParametroRelatorio {
  nome: string;
  tipo: TipoCampo;
  obrigatorio: boolean;
  valorPadrao?: any;
  opcoes?: string[];
}

// Dashboards específicos por especialidade
export interface DashboardEspecialidade extends BaseEntity {
  nome: string;
  descricao: string;
  tipoClinica: TipoClinica;
  widgets: WidgetDashboard[];
  layout: LayoutDashboard;
  ativo: boolean;
}

export interface WidgetDashboard {
  id: string;
  tipo: 'grafico' | 'tabela' | 'card' | 'calendario' | 'lista';
  titulo: string;
  dados: string;
  configuracao: Record<string, any>;
  posicao: PosicaoWidget;
}

export interface PosicaoWidget {
  x: number;
  y: number;
  largura: number;
  altura: number;
}

export interface LayoutDashboard {
  colunas: number;
  linhas: number;
  widgets: PosicaoWidget[];
}

// Configuração Z-API
export interface ZApiConfig {
  instanceId: string;
  token: string;
  baseUrl: string;
}

export interface ZApiMessage {
  phone: string;
  message: string;
  linkPreview?: boolean;
}

export interface ZApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

// Mensagens de agendamento
export interface AgendamentoMessage {
  agendamentoId: string;
  pacienteId: string;
  profissionalId: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  tipo: TipoAgendamento;
  paciente: Paciente;
  profissional: Profissional;
  clinica: ConfiguracaoClinica;
}

export interface ConfirmacaoLink {
  agendamentoId: string;
  token: string;
  expiresAt: string;
}

// Tipos legados para compatibilidade (serão removidos gradualmente)
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrativo' | 'profissional' | 'recepcionista';
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  professionalId: string;
  date: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  patient: Patient;
  professional: Professional;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Interfaces para o módulo Financeiro
export interface Faturamento extends BaseEntity {
  pacienteId: string;
  profissionalId: string;
  agendamentoId?: string;
  prontuarioId?: string;
  tipo: TipoFaturamento;
  valor: number;
  desconto?: number;
  valorFinal: number;
  formaPagamento: FormaPagamento;
  status: StatusFaturamento;
  dataVencimento: string;
  dataPagamento?: string;
  observacoes?: string;
  camposPersonalizados: Record<string, any>;
  paciente?: Paciente;
  profissional?: Profissional;
  agendamento?: Agendamento;
  prontuario?: Prontuario;
}

export enum TipoFaturamento {
  CONSULTA = 'CONSULTA',
  PROCEDIMENTO = 'PROCEDIMENTO',
  EXAME = 'EXAME',
  MEDICAMENTO = 'MEDICAMENTO',
  MATERIAL = 'MATERIAL',
  TAXA = 'TAXA',
  OUTROS = 'OUTROS'
}

export enum FormaPagamento {
  DINHEIRO = 'DINHEIRO',
  PIX = 'PIX',
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  BOLETO = 'BOLETO',
  CONVENIO = 'CONVENIO',
  PARCELADO = 'PARCELADO'
}

export enum StatusFaturamento {
  PENDENTE = 'PENDENTE',
  PAGO = 'PAGO',
  PARCIAL = 'PARCIAL',
  VENCIDO = 'VENCIDO',
  CANCELADO = 'CANCELADO',
  ESTORNADO = 'ESTORNADO'
}

export interface Pagamento extends BaseEntity {
  faturamentoId: string;
  valor: number;
  formaPagamento: FormaPagamento;
  dataPagamento: string;
  comprovante?: string;
  observacoes?: string;
  faturamento?: Faturamento;
}

export interface RelatorioFinanceiro extends BaseEntity {
  nome: string;
  tipo: TipoRelatorioFinanceiro;
  periodoInicio: string;
  periodoFim: string;
  filtros: FiltroRelatorio[];
  dados: DadosRelatorioFinanceiro;
  geradoPor: string;
  geradoEm: string;
}

export enum TipoRelatorioFinanceiro {
  FATURAMENTO_MENSAL = 'FATURAMENTO_MENSAL',
  FATURAMENTO_ANUAL = 'FATURAMENTO_ANUAL',
  RECEITA_POR_PROFISSIONAL = 'RECEITA_POR_PROFISSIONAL',
  RECEITA_POR_ESPECIALIDADE = 'RECEITA_POR_ESPECIALIDADE',
  INADIMPLENCIA = 'INADIMPLENCIA',
  FLUXO_CAIXA = 'FLUXO_CAIXA',
  DESEMPENHO_FINANCEIRO = 'DESEMPENHO_FINANCEIRO'
}

export interface FiltroRelatorio {
  campo: string;
  operador: 'igual' | 'diferente' | 'maior' | 'menor' | 'entre' | 'contem';
  valor: any;
  valor2?: any;
}

export interface DadosRelatorioFinanceiro {
  resumo: ResumoFinanceiro;
  detalhamento: DetalhamentoFinanceiro[];
  graficos: GraficoFinanceiro[];
}

export interface ResumoFinanceiro {
  receitaTotal: number;
  receitaPaga: number;
  receitaPendente: number;
  receitaVencida: number;
  mediaTicket: number;
  taxaConversao: number;
  crescimentoMensal: number;
}

export interface DetalhamentoFinanceiro {
  periodo: string;
  receita: number;
  pagamentos: number;
  pendente: number;
  vencido: number;
  quantidade: number;
}

export interface GraficoFinanceiro {
  tipo: 'linha' | 'barra' | 'pizza' | 'area';
  titulo: string;
  dados: any[];
  configuracao: Record<string, any>;
}

// Interfaces para o módulo de Relatórios
export interface RelatorioConsultas extends BaseEntity {
  nome: string;
  tipo: TipoRelatorioConsultas;
  periodoInicio: string;
  periodoFim: string;
  filtros: FiltroRelatorio[];
  dados: DadosRelatorioConsultas;
  geradoPor: string;
  geradoEm: string;
}

export enum TipoRelatorioConsultas {
  CONSULTAS_POR_PERIODO = 'CONSULTAS_POR_PERIODO',
  CONSULTAS_POR_PROFISSIONAL = 'CONSULTAS_POR_PROFISSIONAL',
  CONSULTAS_POR_ESPECIALIDADE = 'CONSULTAS_POR_ESPECIALIDADE',
  TAXA_OCUPACAO = 'TAXA_OCUPACAO',
  CANCELAMENTOS = 'CANCELAMENTOS',
  REMARCACOES = 'REMARCACOES',
  SATISFACAO_PACIENTES = 'SATISFACAO_PACIENTES'
}

export interface DadosRelatorioConsultas {
  resumo: ResumoConsultas;
  detalhamento: DetalhamentoConsultas[];
  graficos: GraficoConsultas[];
}

export interface ResumoConsultas {
  totalConsultas: number;
  consultasRealizadas: number;
  consultasCanceladas: number;
  consultasRemarcadas: number;
  taxaOcupacao: number;
  mediaConsultasPorDia: number;
  crescimentoMensal: number;
}

export interface DetalhamentoConsultas {
  periodo: string;
  total: number;
  realizadas: number;
  canceladas: number;
  remarcadas: number;
  ocupacao: number;
}

export interface GraficoConsultas {
  tipo: 'linha' | 'barra' | 'pizza' | 'area';
  titulo: string;
  dados: any[];
  configuracao: Record<string, any>;
}

export interface RelatorioReceitas extends BaseEntity {
  nome: string;
  tipo: TipoRelatorioReceitas;
  periodoInicio: string;
  periodoFim: string;
  filtros: FiltroRelatorio[];
  dados: DadosRelatorioReceitas;
  geradoPor: string;
  geradoEm: string;
}

export enum TipoRelatorioReceitas {
  RECEITA_POR_PERIODO = 'RECEITA_POR_PERIODO',
  RECEITA_POR_SERVICO = 'RECEITA_POR_SERVICO',
  RECEITA_POR_PACIENTE = 'RECEITA_POR_PACIENTE',
  RECEITA_POR_CONVENIO = 'RECEITA_POR_CONVENIO',
  PROJECAO_RECEITA = 'PROJECAO_RECEITA',
  COMPARATIVO_PERIODOS = 'COMPARATIVO_PERIODOS'
}

export interface DadosRelatorioReceitas {
  resumo: ResumoReceitas;
  detalhamento: DetalhamentoReceitas[];
  graficos: GraficoReceitas[];
}

export interface ResumoReceitas {
  receitaTotal: number;
  receitaMedia: number;
  receitaMaxima: number;
  receitaMinima: number;
  crescimentoPeriodo: number;
  projecaoProximoPeriodo: number;
}

export interface DetalhamentoReceitas {
  periodo: string;
  receita: number;
  quantidade: number;
  media: number;
  crescimento: number;
}

export interface GraficoReceitas {
  tipo: 'linha' | 'barra' | 'pizza' | 'area';
  titulo: string;
  dados: any[];
  configuracao: Record<string, any>;
}

export interface RelatorioDesempenho extends BaseEntity {
  nome: string;
  tipo: TipoRelatorioDesempenho;
  periodoInicio: string;
  periodoFim: string;
  filtros: FiltroRelatorio[];
  dados: DadosRelatorioDesempenho;
  geradoPor: string;
  geradoEm: string;
}

export enum TipoRelatorioDesempenho {
  DESEMPENHO_PROFISSIONAIS = 'DESEMPENHO_PROFISSIONAIS',
  DESEMPENHO_ESPECIALIDADES = 'DESEMPENHO_ESPECIALIDADES',
  METRICAS_OPERACIONAIS = 'METRICAS_OPERACIONAIS',
  SATISFACAO_PACIENTES = 'SATISFACAO_PACIENTES',
  EFICIENCIA_ATENDIMENTO = 'EFICIENCIA_ATENDIMENTO',
  INDICADORES_KPI = 'INDICADORES_KPI'
}

export interface DadosRelatorioDesempenho {
  resumo: ResumoDesempenho;
  detalhamento: DetalhamentoDesempenho[];
  graficos: GraficoDesempenho[];
}

export interface ResumoDesempenho {
  mediaConsultasPorDia: number;
  taxaOcupacaoGeral: number;
  tempoMedioAtendimento: number;
  satisfacaoGeral: number;
  eficienciaGeral: number;
  crescimentoDesempenho: number;
}

export interface DetalhamentoDesempenho {
  periodo: string;
  consultasPorDia: number;
  ocupacao: number;
  tempoAtendimento: number;
  satisfacao: number;
  eficiencia: number;
}

export interface GraficoDesempenho {
  tipo: 'linha' | 'barra' | 'pizza' | 'area';
  titulo: string;
  dados: any[];
  configuracao: Record<string, any>;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// TIPOS PARA CONTROLE FINANCEIRO MANUAL
// =============================================================================

export enum StatusFatura {
  PENDENTE = 'PENDENTE',
  PAGO = 'PAGO',
  PARCIAL = 'PARCIAL',
  VENCIDO = 'VENCIDO',
  CANCELADO = 'CANCELADO'
}

export enum NivelBloqueio {
  SEM_BLOQUEIO = 'SEM_BLOQUEIO',
  NOTIFICACAO = 'NOTIFICACAO',
  AVISO_TOPO = 'AVISO_TOPO',
  RESTRICAO_FUNCIONALIDADES = 'RESTRICAO_FUNCIONALIDADES',
  BLOQUEIO_TOTAL = 'BLOQUEIO_TOTAL'
}

export enum FormaPagamentoClinica {
  PIX = 'PIX',
  BOLETO = 'BOLETO',
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  DINHEIRO = 'DINHEIRO'
}

export enum TipoLembrete {
  NOTIFICACAO_3_DIAS = 'NOTIFICACAO_3_DIAS',
  AVISO_5_DIAS = 'AVISO_5_DIAS',
  RESTRICAO_7_DIAS = 'RESTRICAO_7_DIAS',
  BLOQUEIO_10_DIAS = 'BLOQUEIO_10_DIAS',
  PERSONALIZADO = 'PERSONALIZADO'
}

export enum StatusLembrete {
  ENVIADO = 'ENVIADO',
  ENTREGUE = 'ENTREGUE',
  LIDO = 'LIDO',
  FALHA = 'FALHA'
}

export interface FaturaClinica extends BaseEntity {
  numeroFatura: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: StatusFatura;
  diasAtraso: number;
  nivelBloqueio: NivelBloqueio;
  observacoes?: string;
  clinica?: Clinica;
  pagamentos?: PagamentoClinica[];
  lembretes?: LembreteClinica[];
  historicoBloqueio?: HistoricoBloqueio[];
}

export interface PagamentoClinica extends BaseEntity {
  faturaId: string;
  valor: number;
  formaPagamento: FormaPagamentoClinica;
  dataPagamento: string;
  comprovante?: string;
  observacoes?: string;
  fatura?: FaturaClinica;
}

export interface LembreteClinica extends BaseEntity {
  faturaId: string;
  tipo: TipoLembrete;
  mensagem: string;
  dataEnvio: string;
  status: StatusLembrete;
  destinatario: string;
  fatura?: FaturaClinica;
}

export interface Lembrete extends BaseEntity {
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
  paciente?: Paciente;
  profissional?: Profissional;
}

export interface Chat extends BaseEntity {
  titulo: string;
  tipo: string;
  status: string;
  criadoPor: string;
  participantes?: ChatParticipante[];
  mensagens?: Mensagem[];
  criador?: {
    id: string;
    nome: string;
    email: string;
    role: string;
  };
}

export interface ChatParticipante extends BaseEntity {
  chatId: string;
  usuarioId: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  ultimaAtividade: string;
  usuario?: {
    id: string;
    nome: string;
    email: string;
    role: string;
  };
}

export interface Mensagem extends BaseEntity {
  chatId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  tipo: string;
  timestamp: string;
  lida: boolean;
  arquivos?: ArquivoMensagem[];
  sender?: {
    id: string;
    nome: string;
    email: string;
    role: string;
  };
}

export interface ArquivoMensagem extends BaseEntity {
  mensagemId: string;
  nome: string;
  tipo: string;
  url: string;
  tamanho: number;
  uploadedAt: string;
}

export interface HistoricoBloqueio extends BaseEntity {
  faturaId: string;
  nivelAnterior: NivelBloqueio;
  nivelNovo: NivelBloqueio;
  motivo: string;
  aplicadoPor: string;
  dataAplicacao: string;
  fatura?: FaturaClinica;
}

// Dados para o painel de controle financeiro
export interface PainelFinanceiroData {
  faturas: FaturaClinica[];
  resumo: {
    totalFaturas: number;
    totalPendente: number;
    totalPago: number;
    totalVencido: number;
    totalEmAtraso: number;
    valorTotalPendente: number;
    valorTotalPago: number;
    valorTotalVencido: number;
  };
  estatisticas: {
    faturasPorStatus: Array<{ status: StatusFatura; quantidade: number; valor: number }>;
    faturasPorNivelBloqueio: Array<{ nivel: NivelBloqueio; quantidade: number }>;
    pagamentosPorForma: Array<{ forma: FormaPagamentoClinica; quantidade: number; valor: number }>;
  };
}

// Configurações de regras automáticas
export interface RegrasBloqueio {
  diasNotificacao: number;
  diasAvisoTopo: number;
  diasRestricao: number;
  diasBloqueioTotal: number;
  ativo: boolean;
}

// Dados para criação/edição de faturas
export interface CriarFaturaClinica {
  tenantId: string;
  numeroFatura: string;
  valor: number;
  dataVencimento: string;
  observacoes?: string;
}

// Dados para registro de pagamento
export interface RegistrarPagamentoClinica {
  faturaId: string;
  valor: number;
  formaPagamento: FormaPagamentoClinica;
  dataPagamento: string;
  comprovante?: string;
  observacoes?: string;
}

// Dados para envio de lembrete
export interface EnviarLembreteClinica {
  faturaId: string;
  tipo: TipoLembrete;
  mensagem: string;
  destinatario: string;
}

// Dados para aplicação de bloqueio
export interface AplicarBloqueioClinica {
  faturaId: string;
  nivelNovo: NivelBloqueio;
  motivo: string;
  aplicadoPor: string;
} 
import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { 
  ConfiguracaoClinica, 
  TipoClinica, 
  TemplateEspecialidade,
  FluxoEspecialidade,
  CampoPersonalizado,
  Especialidade,
  RelatorioEspecialidade,
  DashboardEspecialidade
} from '@/types/api';

interface ClinicaContextData {
  // Configuração atual da clínica
  configuracao: ConfiguracaoClinica | null;
  setConfiguracao: (config: ConfiguracaoClinica) => void;
  tipoClinica: TipoClinica;
  
  // Sistema de módulos
  isModuleActive: (modulo: string) => boolean;
  getActiveModules: () => string[];
  
  // Sistema de templates
  getTemplatesByCategory: (categoria: string) => TemplateEspecialidade[];
  getTemplateById: (id: string) => TemplateEspecialidade | null;
  
  // Sistema de campos dinâmicos
  getCustomFields: (categoria: string) => CampoPersonalizado[];
  getFieldById: (id: string) => CampoPersonalizado | null;
  
  // Sistema de fluxos
  getFluxosByType: (tipoClinica: TipoClinica) => FluxoEspecialidade[];
  getFluxoById: (id: string) => FluxoEspecialidade | null;
  
  // Sistema de especialidades
  getEspecialidades: () => Especialidade[];
  getEspecialidadeById: (id: string) => Especialidade | null;
  
  // Sistema de relatórios
  getRelatoriosByType: (tipoClinica: TipoClinica) => RelatorioEspecialidade[];
  
  // Sistema de dashboards
  getDashboardsByType: (tipoClinica: TipoClinica) => DashboardEspecialidade[];
  
  // Nomenclatura adaptativa
  getNomenclatura: (chave: string) => string;
  
  // Estado do sistema
  isLoading: boolean;
  tenantId: string | null;
  tenantName: string;
}

interface ClinicaProviderProps {
  children: ReactNode;
}

const ClinicaContext = createContext<ClinicaContextData>({} as ClinicaContextData);

// Configurações padrão por tipo de clínica
const configuracaoPadrao: Record<TipoClinica, Partial<ConfiguracaoClinica>> = {
  [TipoClinica.MEDICA]: {
    nome: "Clínica Médica",
    tipo: TipoClinica.MEDICA,
    corPrimaria: "#2563eb",
    corSecundaria: "#1e40af",
    configuracoes: {
      usarAnamnese: true,
      usarProntuario: true,
      usarAgendamento: true,
      usarFinanceiro: true,
      usarRelatorios: true,
      modulosAtivos: ['anamnese', 'prontuario', 'agendamento', 'financeiro', 'relatorios'],
      templatesAtivos: ['anamnese_medica', 'prontuario_medico'],
      fluxosAtivos: ['fluxo_consulta_medica']
    }
  },
  [TipoClinica.NUTRICIONAL]: {
    nome: "Clínica Nutricional",
    tipo: TipoClinica.NUTRICIONAL,
    corPrimaria: "#059669",
    corSecundaria: "#047857",
    configuracoes: {
      usarAnamnese: true,
      usarProntuario: true,
      usarAgendamento: true,
      usarFinanceiro: true,
      usarRelatorios: true,
      modulosAtivos: ['anamnese', 'prontuario', 'agendamento', 'financeiro', 'relatorios'],
      templatesAtivos: ['anamnese_nutricional', 'prontuario_nutricional'],
      fluxosAtivos: ['fluxo_consulta_nutricional']
    }
  },
  [TipoClinica.PSICOLOGICA]: {
    nome: "Clínica Psicológica",
    tipo: TipoClinica.PSICOLOGICA,
    corPrimaria: "#7c3aed",
    corSecundaria: "#6d28d9",
    configuracoes: {
      usarAnamnese: true,
      usarProntuario: true,
      usarAgendamento: true,
      usarFinanceiro: true,
      usarRelatorios: true,
      modulosAtivos: ['anamnese', 'prontuario', 'agendamento', 'financeiro', 'relatorios'],
      templatesAtivos: ['anamnese_psicologica', 'prontuario_psicologico'],
      fluxosAtivos: ['fluxo_sessao_psicologica']
    }
  },
  [TipoClinica.FISIOTERAPICA]: {
    nome: "Clínica Fisioterapêutica",
    tipo: TipoClinica.FISIOTERAPICA,
    corPrimaria: "#dc2626",
    corSecundaria: "#b91c1c",
    configuracoes: {
      usarAnamnese: true,
      usarProntuario: true,
      usarAgendamento: true,
      usarFinanceiro: true,
      usarRelatorios: true,
      modulosAtivos: ['anamnese', 'prontuario', 'agendamento', 'financeiro', 'relatorios'],
      templatesAtivos: ['anamnese_fisioterapica', 'prontuario_fisioterapico'],
      fluxosAtivos: ['fluxo_sessao_fisioterapia']
    }
  },
  [TipoClinica.ODONTOLOGICA]: {
    nome: "Clínica Odontológica",
    tipo: TipoClinica.ODONTOLOGICA,
    corPrimaria: "#0891b2",
    corSecundaria: "#0e7490",
    configuracoes: {
      usarAnamnese: true,
      usarProntuario: true,
      usarAgendamento: true,
      usarFinanceiro: true,
      usarRelatorios: true,
      modulosAtivos: ['anamnese', 'prontuario', 'agendamento', 'financeiro', 'relatorios'],
      templatesAtivos: ['anamnese_odontologica', 'prontuario_odontologico'],
      fluxosAtivos: ['fluxo_procedimento_odontologico']
    }
  },
  [TipoClinica.ESTETICA]: {
    nome: "Clínica Estética",
    tipo: TipoClinica.ESTETICA,
    corPrimaria: "#ec4899",
    corSecundaria: "#db2777",
    configuracoes: {
      usarAnamnese: true,
      usarProntuario: true,
      usarAgendamento: true,
      usarFinanceiro: true,
      usarRelatorios: true,
      modulosAtivos: ['anamnese', 'prontuario', 'agendamento', 'financeiro', 'relatorios'],
      templatesAtivos: ['anamnese_estetica', 'prontuario_estetico'],
      fluxosAtivos: ['fluxo_procedimento_estetico']
    }
  },
  [TipoClinica.VETERINARIA]: {
    nome: "Clínica Veterinária",
    tipo: TipoClinica.VETERINARIA,
    corPrimaria: "#f59e0b",
    corSecundaria: "#d97706",
    configuracoes: {
      usarAnamnese: true,
      usarProntuario: true,
      usarAgendamento: true,
      usarFinanceiro: true,
      usarRelatorios: true,
      modulosAtivos: ['anamnese', 'prontuario', 'agendamento', 'financeiro', 'relatorios'],
      templatesAtivos: ['anamnese_veterinaria', 'prontuario_veterinario'],
      fluxosAtivos: ['fluxo_consulta_veterinaria']
    }
  },
  [TipoClinica.EDUCACIONAL]: {
    nome: "Centro Educacional",
    tipo: TipoClinica.EDUCACIONAL,
    corPrimaria: "#10b981",
    corSecundaria: "#059669",
    configuracoes: {
      usarAnamnese: false,
      usarProntuario: true,
      usarAgendamento: true,
      usarFinanceiro: true,
      usarRelatorios: true,
      modulosAtivos: ['prontuario', 'agendamento', 'financeiro', 'relatorios'],
      templatesAtivos: ['prontuario_educacional'],
      fluxosAtivos: ['fluxo_aula_educacional']
    }
  },
  [TipoClinica.CORPORATIVA]: {
    nome: "Centro Corporativo",
    tipo: TipoClinica.CORPORATIVA,
    corPrimaria: "#6b7280",
    corSecundaria: "#4b5563",
    configuracoes: {
      usarAnamnese: false,
      usarProntuario: true,
      usarAgendamento: true,
      usarFinanceiro: true,
      usarRelatorios: true,
      modulosAtivos: ['prontuario', 'agendamento', 'financeiro', 'relatorios'],
      templatesAtivos: ['prontuario_corporativo'],
      fluxosAtivos: ['fluxo_consulta_corporativa']
    }
  },
  [TipoClinica.PERSONALIZADA]: {
    nome: "Sistema Personalizado",
    tipo: TipoClinica.PERSONALIZADA,
    corPrimaria: "#8b5cf6",
    corSecundaria: "#7c3aed",
    configuracoes: {
      usarAnamnese: true,
      usarProntuario: true,
      usarAgendamento: true,
      usarFinanceiro: true,
      usarRelatorios: true,
      modulosAtivos: ['anamnese', 'prontuario', 'agendamento', 'financeiro', 'relatorios'],
      templatesAtivos: [],
      fluxosAtivos: []
    }
  }
};

// Nomenclatura adaptativa por tipo de clínica
const nomenclaturaPorTipo: Record<TipoClinica, Record<string, string>> = {
  [TipoClinica.MEDICA]: {
    'anamnese': 'Anamnese Médica',
    'prontuario': 'Prontuário Médico',
    'prontuarios': 'Prontuários Médicos',
    'consulta': 'Consulta Médica',
    'consultas': 'Consultas Médicas',
    'paciente': 'Paciente',
    'pacientes': 'Pacientes',
    'profissional': 'Médico',
    'profissionais': 'Médicos',
    'agendamento': 'Agendamento',
    'agendamentos': 'Agendamentos',
    'avaliacao': 'Avaliação Médica',
    'avaliacoes': 'Avaliações Médicas'
  },
  [TipoClinica.NUTRICIONAL]: {
    'anamnese': 'Avaliação Nutricional',
    'prontuario': 'Prontuário Nutricional',
    'prontuarios': 'Prontuários Nutricionais',
    'consulta': 'Consulta Nutricional',
    'consultas': 'Consultas Nutricionais',
    'paciente': 'Paciente',
    'pacientes': 'Pacientes',
    'profissional': 'Nutricionista',
    'profissionais': 'Nutricionistas',
    'agendamento': 'Agendamento',
    'agendamentos': 'Agendamentos',
    'avaliacao': 'Avaliação Nutricional',
    'avaliacoes': 'Avaliações Nutricionais'
  },
  [TipoClinica.PSICOLOGICA]: {
    'anamnese': 'Avaliação Psicológica',
    'prontuario': 'Prontuário Psicológico',
    'prontuarios': 'Prontuários Psicológicos',
    'consulta': 'Sessão Terapêutica',
    'consultas': 'Sessões Terapêuticas',
    'paciente': 'Paciente',
    'pacientes': 'Pacientes',
    'profissional': 'Psicólogo',
    'profissionais': 'Psicólogos',
    'agendamento': 'Agendamento',
    'agendamentos': 'Agendamentos',
    'avaliacao': 'Avaliação Psicológica',
    'avaliacoes': 'Avaliações Psicológicas'
  },
  [TipoClinica.FISIOTERAPICA]: {
    'anamnese': 'Avaliação Fisioterapêutica',
    'prontuario': 'Prontuário Fisioterapêutico',
    'prontuarios': 'Prontuários Fisioterapêuticos',
    'consulta': 'Sessão de Fisioterapia',
    'consultas': 'Sessões de Fisioterapia',
    'paciente': 'Paciente',
    'pacientes': 'Pacientes',
    'profissional': 'Fisioterapeuta',
    'profissionais': 'Fisioterapeutas',
    'agendamento': 'Agendamento',
    'agendamentos': 'Agendamentos',
    'avaliacao': 'Avaliação Fisioterapêutica',
    'avaliacoes': 'Avaliações Fisioterapêuticas'
  },
  [TipoClinica.ODONTOLOGICA]: {
    'anamnese': 'Anamnese Odontológica',
    'prontuario': 'Prontuário Odontológico',
    'prontuarios': 'Prontuários Odontológicos',
    'consulta': 'Consulta Odontológica',
    'consultas': 'Consultas Odontológicas',
    'paciente': 'Paciente',
    'pacientes': 'Pacientes',
    'profissional': 'Dentista',
    'profissionais': 'Dentistas',
    'agendamento': 'Agendamento',
    'agendamentos': 'Agendamentos',
    'avaliacao': 'Avaliação Odontológica',
    'avaliacoes': 'Avaliações Odontológicas'
  },
  [TipoClinica.ESTETICA]: {
    'anamnese': 'Avaliação Estética',
    'prontuario': 'Prontuário Estético',
    'prontuarios': 'Prontuários Estéticos',
    'consulta': 'Consulta Estética',
    'consultas': 'Consultas Estéticas',
    'paciente': 'Cliente',
    'pacientes': 'Clientes',
    'profissional': 'Esteticista',
    'profissionais': 'Esteticistas',
    'agendamento': 'Agendamento',
    'agendamentos': 'Agendamentos',
    'avaliacao': 'Avaliação Estética',
    'avaliacoes': 'Avaliações Estéticas'
  },
  [TipoClinica.VETERINARIA]: {
    'anamnese': 'Avaliação Veterinária',
    'prontuario': 'Prontuário Veterinário',
    'prontuarios': 'Prontuários Veterinários',
    'consulta': 'Consulta Veterinária',
    'consultas': 'Consultas Veterinárias',
    'paciente': 'Animal',
    'pacientes': 'Animais',
    'profissional': 'Veterinário',
    'profissionais': 'Veterinários',
    'agendamento': 'Agendamento',
    'agendamentos': 'Agendamentos',
    'avaliacao': 'Avaliação Veterinária',
    'avaliacoes': 'Avaliações Veterinárias'
  },
  [TipoClinica.EDUCACIONAL]: {
    'anamnese': 'Avaliação Educacional',
    'prontuario': 'Ficha do Aluno',
    'prontuarios': 'Fichas dos Alunos',
    'consulta': 'Aula',
    'consultas': 'Aulas',
    'paciente': 'Aluno',
    'pacientes': 'Alunos',
    'profissional': 'Professor',
    'profissionais': 'Professores',
    'agendamento': 'Agendamento',
    'agendamentos': 'Agendamentos',
    'avaliacao': 'Avaliação Educacional',
    'avaliacoes': 'Avaliações Educacionais'
  },
  [TipoClinica.CORPORATIVA]: {
    'anamnese': 'Avaliação Corporativa',
    'prontuario': 'Ficha do Funcionário',
    'prontuarios': 'Fichas dos Funcionários',
    'consulta': 'Atendimento',
    'consultas': 'Atendimentos',
    'paciente': 'Funcionário',
    'pacientes': 'Funcionários',
    'profissional': 'Profissional',
    'profissionais': 'Profissionais',
    'agendamento': 'Agendamento',
    'agendamentos': 'Agendamentos',
    'avaliacao': 'Avaliação Corporativa',
    'avaliacoes': 'Avaliações Corporativas'
  },
  [TipoClinica.PERSONALIZADA]: {
    'anamnese': 'Avaliação',
    'prontuario': 'Prontuário',
    'prontuarios': 'Prontuários',
    'consulta': 'Consulta',
    'consultas': 'Consultas',
    'paciente': 'Paciente',
    'pacientes': 'Pacientes',
    'profissional': 'Profissional',
    'profissionais': 'Profissionais',
    'agendamento': 'Agendamento',
    'agendamentos': 'Agendamentos',
    'avaliacao': 'Avaliação',
    'avaliacoes': 'Avaliações'
  }
};

export function ClinicaProvider({ children }: ClinicaProviderProps) {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoClinica | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [tenantName, setTenantName] = useState('OmniCare');

  useEffect(() => {
    const initializeClinica = () => {
      try {
        console.log('🏥 [ClinicaContext] Iniciando inicialização da clínica');
        
        // Carregar configuração da clínica do localStorage ou API
        const storedConfig = localStorage.getItem('clinicaConfig');
        const storedTenantId = localStorage.getItem('tenantId');
        const storedUser = localStorage.getItem('user');
        
        if (storedConfig && storedTenantId && storedUser) {
          try {
            const parsedConfig = JSON.parse(storedConfig);
            const parsedUser = JSON.parse(storedUser);
            
            console.log('🏥 [ClinicaContext] Configuração carregada do localStorage:', parsedConfig);
            console.log('🏥 [ClinicaContext] Usuário carregado:', parsedUser);
            
            setConfiguracao(parsedConfig);
            setTenantId(storedTenantId);
            setTenantName(parsedConfig.nome || 'OmniCare');
          } catch (error) {
            console.error('🏥 [ClinicaContext] Erro ao parsear configuração da clínica:', error);
            createDefaultConfig(storedTenantId);
          }
        } else {
          console.log('🏥 [ClinicaContext] Nenhuma configuração encontrada, criando padrão');
          createDefaultConfig(storedTenantId);
        }
      } catch (error) {
        console.error('🏥 [ClinicaContext] Erro na inicialização:', error);
        createDefaultConfig(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        console.log('🏥 [ClinicaContext] Inicialização concluída');
      }
    };

    const createDefaultConfig = (existingTenantId: string | null) => {
      // Configuração padrão baseado no tipo da clínica do usuário
      const userInfo = localStorage.getItem('userInfo');
      let tipoClinica = TipoClinica.MEDICA; // Padrão para clínica médica
      
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user.clinica?.tipo === 'MEDICA') {
            tipoClinica = TipoClinica.MEDICA;
          } else if (user.clinica?.tipo === 'NUTRICIONAL') {
            tipoClinica = TipoClinica.NUTRICIONAL;
          } else if (user.clinica?.tipo === 'PSICOLOGICA') {
            tipoClinica = TipoClinica.PSICOLOGICA;
          } else if (user.clinica?.tipo === 'FISIOTERAPICA') {
            tipoClinica = TipoClinica.FISIOTERAPICA;
          } else if (user.clinica?.tipo === 'ODONTOLOGICA') {
            tipoClinica = TipoClinica.ODONTOLOGICA;
          } else if (user.clinica?.tipo === 'ESTETICA') {
            tipoClinica = TipoClinica.ESTETICA;
          } else if (user.clinica?.tipo === 'VETERINARIA') {
            tipoClinica = TipoClinica.VETERINARIA;
          } else if (user.clinica?.tipo === 'EDUCACIONAL') {
            tipoClinica = TipoClinica.EDUCACIONAL;
          } else if (user.clinica?.tipo === 'CORPORATIVA') {
            tipoClinica = TipoClinica.CORPORATIVA;
          }
        } catch (e) {
          console.error('🏥 [ClinicaContext] Erro ao parsear informações do usuário:', e);
        }
      }
      
      const defaultConfig = configuracaoPadrao[tipoClinica] as ConfiguracaoClinica;
      const defaultTenantId = existingTenantId || 'tenant-default-' + Date.now();
      
      const newConfig = {
        id: "default",
        tenantId: defaultTenantId,
        nome: "OmniCare",
        tipo: tipoClinica,
        corPrimaria: defaultConfig.corPrimaria || "#2563eb",
        corSecundaria: defaultConfig.corSecundaria || "#1e40af",
        tema: 'auto',
        configuracoes: defaultConfig.configuracoes!,
        ativo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tenantName: 'OmniCare'
      };
      
      console.log('🏥 [ClinicaContext] Nova configuração criada:', newConfig);
      setConfiguracao(newConfig);
      setTenantId(defaultTenantId);
      setTenantName(newConfig.nome || 'OmniCare');
      localStorage.setItem('tenantId', defaultTenantId);
    };

    initializeClinica();
  }, []);

  const handleSetConfiguracao = useCallback((config: ConfiguracaoClinica) => {
    console.log('🏥 [ClinicaContext] Salvando configuração:', config);
    setConfiguracao(config);
    setTenantId(config.tenantId);
    setTenantName(config.nome || 'OmniCare');
    localStorage.setItem('clinicaConfig', JSON.stringify(config));
    localStorage.setItem('tenantId', config.tenantId);
  }, []);

  // Memoizar os módulos ativos para evitar recálculos desnecessários
  const modulosAtivos = useMemo(() => {
    const modulos = configuracao?.configuracoes.modulosAtivos ?? [];
    console.log('🏥 [ClinicaContext] Módulos ativos carregados:', modulos);
    return modulos;
  }, [configuracao?.configuracoes.modulosAtivos]);

  const isModuleActive = useCallback((modulo: string): boolean => {
    return modulosAtivos.includes(modulo);
  }, [modulosAtivos]);

  const getActiveModules = useCallback((): string[] => {
    return modulosAtivos;
  }, [modulosAtivos]);

  const getTemplatesByCategory = useCallback((categoria: string): TemplateEspecialidade[] => {
    // TODO: Implementar busca de templates por categoria
    return [];
  }, []);

  const getTemplateById = useCallback((id: string): TemplateEspecialidade | null => {
    // TODO: Implementar busca de template por ID
    return null;
  }, []);

  const getCustomFields = useCallback((categoria: string): CampoPersonalizado[] => {
    // TODO: Implementar busca de campos personalizados por categoria
    return [];
  }, []);

  const getFieldById = useCallback((id: string): CampoPersonalizado | null => {
    // TODO: Implementar busca de campo por ID
    return null;
  }, []);

  const getFluxosByType = useCallback((tipoClinica: TipoClinica): FluxoEspecialidade[] => {
    // TODO: Implementar busca de fluxos por tipo de clínica
    return [];
  }, []);

  const getFluxoById = useCallback((id: string): FluxoEspecialidade | null => {
    // TODO: Implementar busca de fluxo por ID
    return null;
  }, []);

  const getEspecialidades = useCallback((): Especialidade[] => {
    // TODO: Implementar busca de especialidades
    return [];
  }, []);

  const getEspecialidadeById = useCallback((id: string): Especialidade | null => {
    // TODO: Implementar busca de especialidade por ID
    return null;
  }, []);

  const getRelatoriosByType = useCallback((tipoClinica: TipoClinica): RelatorioEspecialidade[] => {
    // TODO: Implementar busca de relatórios por tipo de clínica
    return [];
  }, []);

  const getDashboardsByType = useCallback((tipoClinica: TipoClinica): DashboardEspecialidade[] => {
    // TODO: Implementar busca de dashboards por tipo de clínica
    return [];
  }, []);

  const getNomenclatura = useCallback((chave: string): string => {
    const tipo = configuracao?.tipo ?? TipoClinica.NUTRICIONAL;
    const nomenclatura = nomenclaturaPorTipo[tipo];
    return nomenclatura[chave] ?? chave;
  }, [configuracao?.tipo]);

  // Memoizar o valor do contexto para evitar re-renderizações desnecessárias
  const contextValue = useMemo(() => ({
    configuracao, 
    setConfiguracao: handleSetConfiguracao, 
    tipoClinica: configuracao?.tipo ?? TipoClinica.NUTRICIONAL,
    isModuleActive,
    getActiveModules,
    getTemplatesByCategory,
    getTemplateById,
    getCustomFields,
    getFieldById,
    getFluxosByType,
    getFluxoById,
    getEspecialidades,
    getEspecialidadeById,
    getRelatoriosByType,
    getDashboardsByType,
    getNomenclatura,
    isLoading,
    tenantId,
    tenantName
  }), [
    configuracao,
    handleSetConfiguracao,
    isModuleActive,
    getActiveModules,
    getTemplatesByCategory,
    getTemplateById,
    getCustomFields,
    getFieldById,
    getFluxosByType,
    getFluxoById,
    getEspecialidades,
    getEspecialidadeById,
    getRelatoriosByType,
    getDashboardsByType,
    getNomenclatura,
    isLoading,
    tenantId,
    tenantName
  ]);

  // Não renderizar até que a inicialização esteja completa
  if (!isInitialized) {
    console.log('🏥 [ClinicaContext] Aguardando inicialização...');
    return null;
  }

  return (
    <ClinicaContext.Provider value={contextValue}>
      {children}
    </ClinicaContext.Provider>
  );
}

export function useClinica(): ClinicaContextData {
  const context = useContext(ClinicaContext);
  if (!context) {
    throw new Error('useClinica deve ser usado dentro de um ClinicaProvider');
  }
  return context;
} 
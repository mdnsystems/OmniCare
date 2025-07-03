import { 
  FluxoEspecialidade, 
  TipoClinica, 
  EtapaFluxo,
  AcaoFluxo,
  CondicaoFluxo,
  ValidacaoFluxo 
} from '@/types/api';

// Fluxo para Nutrição
export const fluxoConsultaNutricional: FluxoEspecialidade = {
  id: 'fluxo_consulta_nutricional',
  tenantId: 'default',
  nome: 'Fluxo de Consulta Nutricional',
  descricao: 'Fluxo completo para consultas nutricionais',
  tipoClinica: TipoClinica.NUTRICIONAL,
  etapas: [
    {
      id: 'anamnese',
      nome: 'Anamnese Nutricional',
      descricao: 'Avaliação inicial do paciente',
      ordem: 1,
      obrigatoria: true,
      campos: ['altura', 'peso', 'imc', 'historico_familiar', 'alergias'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'anamnese',
            template: 'anamnese_nutricional'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'avaliacao_antropometrica',
      nome: 'Avaliação Antropométrica',
      descricao: 'Medidas e avaliação corporal',
      ordem: 2,
      obrigatoria: true,
      campos: ['circunferencia_abdominal', 'circunferencia_braquial'],
      acoes: [
        {
          tipo: 'validar_campo',
          parametros: {
            campo: 'imc',
            condicao: 'entre',
            valores: [18.5, 24.9]
          }
        }
      ],
      condicoes: [
        {
          campo: 'imc',
          operador: 'maior',
          valor: 18.5
        }
      ]
    },
    {
      id: 'prescricao_nutricional',
      nome: 'Prescrição Nutricional',
      descricao: 'Elaboração do plano alimentar',
      ordem: 3,
      obrigatoria: true,
      campos: ['plano_alimentar', 'objetivos', 'recomendacoes'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'prontuario',
            template: 'prontuario_nutricional'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'agendamento_retorno',
      nome: 'Agendamento de Retorno',
      descricao: 'Agendar próxima consulta',
      ordem: 4,
      obrigatoria: false,
      campos: ['data_retorno', 'observacoes_retorno'],
      acoes: [
        {
          tipo: 'enviar_notificacao',
          parametros: {
            tipo: 'lembrete_retorno',
            dias_antecedencia: 1
          }
        }
      ],
      condicoes: []
    }
  ],
  validacoes: [
    {
      tipo: 'etapas_obrigatorias',
      regras: ['anamnese', 'avaliacao_antropometrica', 'prescricao_nutricional'],
      mensagem: 'Anamnese, avaliação antropométrica e prescrição são obrigatórias'
    }
  ],
  ativo: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Fluxo para Psicologia
export const fluxoSessaoPsicologica: FluxoEspecialidade = {
  id: 'fluxo_sessao_psicologica',
  tenantId: 'default',
  nome: 'Fluxo de Sessão Psicológica',
  descricao: 'Fluxo para sessões de terapia',
  tipoClinica: TipoClinica.PSICOLOGICA,
  etapas: [
    {
      id: 'acolhimento',
      nome: 'Acolhimento',
      descricao: 'Momento inicial da sessão',
      ordem: 1,
      obrigatoria: true,
      campos: ['estado_mental', 'queixa_principal'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'anamnese',
            template: 'anamnese_psicologica'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'intervencao',
      nome: 'Intervenção Terapêutica',
      descricao: 'Desenvolvimento da sessão',
      ordem: 2,
      obrigatoria: true,
      campos: ['tecnicas_utilizadas', 'observacoes_sessao'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'prontuario',
            template: 'prontuario_psicologico'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'avaliacao_risco',
      nome: 'Avaliação de Risco',
      descricao: 'Avaliar necessidade de intervenção de emergência',
      ordem: 3,
      obrigatoria: false,
      campos: ['risco_suicida', 'risco_agressao'],
      acoes: [
        {
          tipo: 'enviar_notificacao',
          parametros: {
            tipo: 'alerta_risco',
            destinatarios: ['supervisor', 'emergencia']
          }
        }
      ],
      condicoes: [
        {
          campo: 'risco_suicida',
          operador: 'igual',
          valor: 'alto'
        }
      ]
    },
    {
      id: 'agendamento_proxima',
      nome: 'Agendamento Próxima Sessão',
      descricao: 'Agendar próxima sessão',
      ordem: 4,
      obrigatoria: true,
      campos: ['data_proxima_sessao', 'objetivos_proxima'],
      acoes: [
        {
          tipo: 'enviar_notificacao',
          parametros: {
            tipo: 'lembrete_sessao',
            dias_antecedencia: 1
          }
        }
      ],
      condicoes: []
    }
  ],
  validacoes: [
    {
      tipo: 'etapas_obrigatorias',
      regras: ['acolhimento', 'intervencao', 'agendamento_proxima'],
      mensagem: 'Acolhimento, intervenção e agendamento são obrigatórios'
    }
  ],
  ativo: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Fluxo para Fisioterapia
export const fluxoSessaoFisioterapia: FluxoEspecialidade = {
  id: 'fluxo_sessao_fisioterapia',
  tenantId: 'default',
  nome: 'Fluxo de Sessão de Fisioterapia',
  descricao: 'Fluxo para sessões de fisioterapia',
  tipoClinica: TipoClinica.FISIOTERAPICA,
  etapas: [
    {
      id: 'avaliacao_inicial',
      nome: 'Avaliação Inicial',
      descricao: 'Avaliação do estado atual do paciente',
      ordem: 1,
      obrigatoria: true,
      campos: ['queixa_principal', 'intensidade_dor', 'forca_muscular'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'anamnese',
            template: 'anamnese_fisioterapica'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'tratamento',
      nome: 'Tratamento',
      descricao: 'Aplicação das técnicas de tratamento',
      ordem: 2,
      obrigatoria: true,
      campos: ['tecnicas_aplicadas', 'tempo_tratamento', 'observacoes'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'prontuario',
            template: 'prontuario_fisioterapico'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'exercicios_domiciliares',
      nome: 'Exercícios Domiciliares',
      descricao: 'Prescrição de exercícios para casa',
      ordem: 3,
      obrigatoria: false,
      campos: ['exercicios_prescritos', 'frequencia', 'observacoes_exercicios'],
      acoes: [
        {
          tipo: 'enviar_notificacao',
          parametros: {
            tipo: 'lembrete_exercicios',
            frequencia: 'diario'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'agendamento_retorno',
      nome: 'Agendamento de Retorno',
      descricao: 'Agendar próxima sessão',
      ordem: 4,
      obrigatoria: true,
      campos: ['data_retorno', 'objetivos_proxima_sessao'],
      acoes: [
        {
          tipo: 'enviar_notificacao',
          parametros: {
            tipo: 'lembrete_sessao',
            dias_antecedencia: 1
          }
        }
      ],
      condicoes: []
    }
  ],
  validacoes: [
    {
      tipo: 'etapas_obrigatorias',
      regras: ['avaliacao_inicial', 'tratamento', 'agendamento_retorno'],
      mensagem: 'Avaliação inicial, tratamento e agendamento são obrigatórios'
    }
  ],
  ativo: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Fluxo para Odontologia
export const fluxoProcedimentoOdontologico: FluxoEspecialidade = {
  id: 'fluxo_procedimento_odontologico',
  tenantId: 'default',
  nome: 'Fluxo de Procedimento Odontológico',
  descricao: 'Fluxo para procedimentos odontológicos',
  tipoClinica: TipoClinica.ODONTOLOGICA,
  etapas: [
    {
      id: 'anamnese_odontologica',
      nome: 'Anamnese Odontológica',
      descricao: 'Avaliação inicial do paciente',
      ordem: 1,
      obrigatoria: true,
      campos: ['queixa_principal', 'dor_dental', 'medicacoes_uso'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'anamnese',
            template: 'anamnese_odontologica'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'exame_clinico',
      nome: 'Exame Clínico',
      descricao: 'Exame físico da cavidade oral',
      ordem: 2,
      obrigatoria: true,
      campos: ['estado_dentes', 'estado_gengiva', 'oclusao'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'prontuario',
            template: 'prontuario_odontologico'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'procedimento',
      nome: 'Procedimento',
      descricao: 'Execução do procedimento odontológico',
      ordem: 3,
      obrigatoria: true,
      campos: ['procedimento_realizado', 'dentes_envolvidos', 'material_utilizado'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'prontuario',
            template: 'procedimento_odontologico'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'orientacoes_pos',
      nome: 'Orientações Pós-Procedimento',
      descricao: 'Orientações para o paciente',
      ordem: 4,
      obrigatoria: true,
      campos: ['orientacoes', 'medicamentos_prescritos', 'restricoes'],
      acoes: [
        {
          tipo: 'enviar_notificacao',
          parametros: {
            tipo: 'lembrete_cuidados',
            frequencia: 'diario',
            dias: 7
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'agendamento_retorno',
      nome: 'Agendamento de Retorno',
      descricao: 'Agendar retorno para avaliação',
      ordem: 5,
      obrigatoria: true,
      campos: ['data_retorno', 'motivo_retorno'],
      acoes: [
        {
          tipo: 'enviar_notificacao',
          parametros: {
            tipo: 'lembrete_retorno',
            dias_antecedencia: 1
          }
        }
      ],
      condicoes: []
    }
  ],
  validacoes: [
    {
      tipo: 'etapas_obrigatorias',
      regras: ['anamnese_odontologica', 'exame_clinico', 'procedimento', 'orientacoes_pos'],
      mensagem: 'Anamnese, exame clínico, procedimento e orientações são obrigatórios'
    }
  ],
  ativo: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Fluxo para Estética
export const fluxoProcedimentoEstetico: FluxoEspecialidade = {
  id: 'fluxo_procedimento_estetico',
  tenantId: 'default',
  nome: 'Fluxo de Procedimento Estético',
  descricao: 'Fluxo para procedimentos estéticos',
  tipoClinica: TipoClinica.ESTETICA,
  etapas: [
    {
      id: 'avaliacao_estetica',
      nome: 'Avaliação Estética',
      descricao: 'Avaliação inicial do cliente',
      ordem: 1,
      obrigatoria: true,
      campos: ['queixa_principal', 'tipo_pele', 'alergias_cosmicos'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'anamnese',
            template: 'anamnese_estetica'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'fotos_antes',
      nome: 'Fotos Antes',
      descricao: 'Registro fotográfico antes do procedimento',
      ordem: 2,
      obrigatoria: true,
      campos: ['fotos_antes', 'angulos_fotos'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'arquivo',
            categoria: 'fotos_antes'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'procedimento_estetico',
      nome: 'Procedimento Estético',
      descricao: 'Execução do procedimento',
      ordem: 3,
      obrigatoria: true,
      campos: ['procedimento_realizado', 'produtos_utilizados', 'tempo_procedimento'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'prontuario',
            template: 'procedimento_estetico'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'fotos_depois',
      nome: 'Fotos Depois',
      descricao: 'Registro fotográfico após o procedimento',
      ordem: 4,
      obrigatoria: true,
      campos: ['fotos_depois', 'angulos_fotos_depois'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'arquivo',
            categoria: 'fotos_depois'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'orientacoes_pos',
      nome: 'Orientações Pós-Procedimento',
      descricao: 'Orientações para cuidados pós-procedimento',
      ordem: 5,
      obrigatoria: true,
      campos: ['orientacoes_cuidados', 'produtos_recomendados', 'restricoes'],
      acoes: [
        {
          tipo: 'enviar_notificacao',
          parametros: {
            tipo: 'lembrete_cuidados',
            frequencia: 'diario',
            dias: 14
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'agendamento_retorno',
      nome: 'Agendamento de Retorno',
      descricao: 'Agendar retorno para avaliação',
      ordem: 6,
      obrigatoria: true,
      campos: ['data_retorno', 'motivo_retorno'],
      acoes: [
        {
          tipo: 'enviar_notificacao',
          parametros: {
            tipo: 'lembrete_retorno',
            dias_antecedencia: 1
          }
        }
      ],
      condicoes: []
    }
  ],
  validacoes: [
    {
      tipo: 'etapas_obrigatorias',
      regras: ['avaliacao_estetica', 'fotos_antes', 'procedimento_estetico', 'fotos_depois'],
      mensagem: 'Avaliação, fotos antes, procedimento e fotos depois são obrigatórios'
    }
  ],
  ativo: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Fluxo para Veterinária
export const fluxoConsultaVeterinaria: FluxoEspecialidade = {
  id: 'fluxo_consulta_veterinaria',
  tenantId: 'default',
  nome: 'Fluxo de Consulta Veterinária',
  descricao: 'Fluxo para consultas veterinárias',
  tipoClinica: TipoClinica.VETERINARIA,
  etapas: [
    {
      id: 'identificacao_animal',
      nome: 'Identificação do Animal',
      descricao: 'Dados básicos do animal',
      ordem: 1,
      obrigatoria: true,
      campos: ['especie', 'raca', 'idade', 'peso'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'anamnese',
            template: 'anamnese_veterinaria'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'anamnese_veterinaria',
      nome: 'Anamnese Veterinária',
      descricao: 'Histórico e queixa do animal',
      ordem: 2,
      obrigatoria: true,
      campos: ['queixa_principal', 'sintomas', 'vacinas', 'vermifugacao'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'prontuario',
            template: 'prontuario_veterinario'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'exame_fisico',
      nome: 'Exame Físico',
      descricao: 'Exame físico do animal',
      ordem: 3,
      obrigatoria: true,
      campos: ['temperatura', 'frequencia_cardiaca', 'frequencia_respiratoria'],
      acoes: [
        {
          tipo: 'validar_campo',
          parametros: {
            campo: 'temperatura',
            condicao: 'normal',
            valores: [37.5, 39.5]
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'diagnostico_tratamento',
      nome: 'Diagnóstico e Tratamento',
      descricao: 'Diagnóstico e prescrição',
      ordem: 4,
      obrigatoria: true,
      campos: ['diagnostico', 'tratamento', 'medicamentos'],
      acoes: [
        {
          tipo: 'criar_registro',
          parametros: {
            tipo: 'prontuario',
            template: 'diagnostico_veterinario'
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'orientacoes_tutor',
      nome: 'Orientações ao Tutor',
      descricao: 'Orientações para o tutor do animal',
      ordem: 5,
      obrigatoria: true,
      campos: ['orientacoes_tutor', 'cuidados_especiais', 'dieta'],
      acoes: [
        {
          tipo: 'enviar_notificacao',
          parametros: {
            tipo: 'lembrete_cuidados',
            frequencia: 'diario',
            dias: 7
          }
        }
      ],
      condicoes: []
    },
    {
      id: 'agendamento_retorno',
      nome: 'Agendamento de Retorno',
      descricao: 'Agendar retorno para reavaliação',
      ordem: 6,
      obrigatoria: true,
      campos: ['data_retorno', 'motivo_retorno'],
      acoes: [
        {
          tipo: 'enviar_notificacao',
          parametros: {
            tipo: 'lembrete_retorno',
            dias_antecedencia: 1
          }
        }
      ],
      condicoes: []
    }
  ],
  validacoes: [
    {
      tipo: 'etapas_obrigatorias',
      regras: ['identificacao_animal', 'anamnese_veterinaria', 'exame_fisico', 'diagnostico_tratamento'],
      mensagem: 'Identificação, anamnese, exame físico e diagnóstico são obrigatórios'
    }
  ],
  ativo: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Mapa de fluxos por tipo de clínica
export const fluxosPorEspecialidade: Record<TipoClinica, FluxoEspecialidade[]> = {
  [TipoClinica.NUTRICIONAL]: [fluxoConsultaNutricional],
  [TipoClinica.PSICOLOGICA]: [fluxoSessaoPsicologica],
  [TipoClinica.FISIOTERAPICA]: [fluxoSessaoFisioterapia],
  [TipoClinica.ODONTOLOGICA]: [fluxoProcedimentoOdontologico],
  [TipoClinica.ESTETICA]: [fluxoProcedimentoEstetico],
  [TipoClinica.VETERINARIA]: [fluxoConsultaVeterinaria],
  [TipoClinica.MEDICA]: [],
  [TipoClinica.EDUCACIONAL]: [],
  [TipoClinica.CORPORATIVA]: [],
  [TipoClinica.PERSONALIZADA]: []
};

// Função para obter fluxos por tipo de clínica
export function getFluxosByType(tipoClinica: TipoClinica): FluxoEspecialidade[] {
  return fluxosPorEspecialidade[tipoClinica] || [];
}

// Função para obter fluxo por ID
export function getFluxoById(id: string): FluxoEspecialidade | null {
  for (const fluxos of Object.values(fluxosPorEspecialidade)) {
    const fluxo = fluxos.find(f => f.id === id);
    if (fluxo) return fluxo;
  }
  return null;
} 
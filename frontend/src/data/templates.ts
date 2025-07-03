import { 
  TemplateEspecialidade, 
  TipoClinica, 
  CategoriaCampo, 
  TipoCampo,
  ValidacaoCampo 
} from '@/types/api';

// Templates para Nutrição
export const templateAnamneseNutricional: TemplateEspecialidade = {
  id: 'anamnese_nutricional',
  tenantId: 'default',
  nome: 'Avaliação Nutricional',
  descricao: 'Template completo para avaliação nutricional de pacientes',
  tipoClinica: TipoClinica.NUTRICIONAL,
  categoria: CategoriaCampo.ANAMNESE,
  campos: [
    {
      id: 'altura',
      nome: 'Altura (cm)',
      tipo: TipoCampo.NUMERO,
      obrigatorio: true,
      validacoes: [
        { tipo: 'min', valor: 50, mensagem: 'Altura deve ser maior que 50cm' },
        { tipo: 'max', valor: 250, mensagem: 'Altura deve ser menor que 250cm' }
      ],
      ordem: 1,
      ativo: true,
      secao: 'Medidas Antropométricas'
    },
    {
      id: 'peso',
      nome: 'Peso (kg)',
      tipo: TipoCampo.NUMERO,
      obrigatorio: true,
      validacoes: [
        { tipo: 'min', valor: 1, mensagem: 'Peso deve ser maior que 1kg' },
        { tipo: 'max', valor: 500, mensagem: 'Peso deve ser menor que 500kg' }
      ],
      ordem: 2,
      ativo: true,
      secao: 'Medidas Antropométricas'
    },
    {
      id: 'imc',
      nome: 'IMC',
      tipo: TipoCampo.NUMERO,
      obrigatorio: false,
      ordem: 3,
      ativo: true,
      secao: 'Medidas Antropométricas'
    },
    {
      id: 'circunferencia_abdominal',
      nome: 'Circunferência Abdominal (cm)',
      tipo: TipoCampo.NUMERO,
      obrigatorio: false,
      ordem: 4,
      ativo: true,
      secao: 'Medidas Antropométricas'
    },
    {
      id: 'historico_familiar',
      nome: 'Histórico Familiar',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: false,
      ordem: 5,
      ativo: true,
      secao: 'Histórico Clínico'
    },
    {
      id: 'alergias',
      nome: 'Alergias Alimentares',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: false,
      ordem: 6,
      ativo: true,
      secao: 'Histórico Clínico'
    },
    {
      id: 'medicacoes',
      nome: 'Medicações em Uso',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: false,
      ordem: 7,
      ativo: true,
      secao: 'Histórico Clínico'
    },
    {
      id: 'atividade_fisica',
      nome: 'Atividade Física',
      tipo: TipoCampo.SELECT,
      obrigatorio: false,
      opcoes: ['Sedentário', 'Leve', 'Moderada', 'Intensa'],
      ordem: 8,
      ativo: true,
      secao: 'Hábitos de Vida'
    },
    {
      id: 'refeicoes_por_dia',
      nome: 'Refeições por Dia',
      tipo: TipoCampo.NUMERO,
      obrigatorio: false,
      validacoes: [
        { tipo: 'min', valor: 1, mensagem: 'Mínimo 1 refeição' },
        { tipo: 'max', valor: 10, mensagem: 'Máximo 10 refeições' }
      ],
      ordem: 9,
      ativo: true,
      secao: 'Hábitos Alimentares'
    },
    {
      id: 'consumo_agua',
      nome: 'Consumo de Água (L/dia)',
      tipo: TipoCampo.NUMERO,
      obrigatorio: false,
      ordem: 10,
      ativo: true,
      secao: 'Hábitos Alimentares'
    }
  ],
  validacoes: [
    {
      tipo: 'campos_obrigatorios',
      regras: ['altura', 'peso'],
      mensagem: 'Altura e peso são obrigatórios para cálculo do IMC'
    }
  ],
  ativo: true,
  ordem: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Templates para Psicologia
export const templateAnamnesePsicologica: TemplateEspecialidade = {
  id: 'anamnese_psicologica',
  tenantId: 'default',
  nome: 'Avaliação Psicológica',
  descricao: 'Template para avaliação psicológica inicial',
  tipoClinica: TipoClinica.PSICOLOGICA,
  categoria: CategoriaCampo.ANAMNESE,
  campos: [
    {
      id: 'estado_mental',
      nome: 'Estado Mental Atual',
      tipo: TipoCampo.SELECT,
      obrigatorio: true,
      opcoes: ['Estável', 'Ansioso', 'Deprimido', 'Eufórico', 'Irritado', 'Outro'],
      ordem: 1,
      ativo: true,
      secao: 'Estado Mental'
    },
    {
      id: 'queixa_principal',
      nome: 'Queixa Principal',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: true,
      ordem: 2,
      ativo: true,
      secao: 'Queixa'
    },
    {
      id: 'historico_psicologico',
      nome: 'Histórico Psicológico',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: false,
      ordem: 3,
      ativo: true,
      secao: 'Histórico'
    },
    {
      id: 'medicacoes_psiquiatricas',
      nome: 'Medicações Psiquiátricas',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: false,
      ordem: 4,
      ativo: true,
      secao: 'Medicações'
    },
    {
      id: 'suporte_social',
      nome: 'Suporte Social',
      tipo: TipoCampo.SELECT,
      obrigatorio: false,
      opcoes: ['Excelente', 'Bom', 'Regular', 'Ruim', 'Inexistente'],
      ordem: 5,
      ativo: true,
      secao: 'Contexto Social'
    },
    {
      id: 'qualidade_sono',
      nome: 'Qualidade do Sono',
      tipo: TipoCampo.SELECT,
      obrigatorio: false,
      opcoes: ['Excelente', 'Boa', 'Regular', 'Ruim', 'Insônia'],
      ordem: 6,
      ativo: true,
      secao: 'Hábitos'
    }
  ],
  validacoes: [
    {
      tipo: 'campos_obrigatorios',
      regras: ['estado_mental', 'queixa_principal'],
      mensagem: 'Estado mental e queixa principal são obrigatórios'
    }
  ],
  ativo: true,
  ordem: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Templates para Fisioterapia
export const templateAnamneseFisioterapica: TemplateEspecialidade = {
  id: 'anamnese_fisioterapica',
  tenantId: 'default',
  nome: 'Avaliação Fisioterapêutica',
  descricao: 'Template para avaliação fisioterapêutica',
  tipoClinica: TipoClinica.FISIOTERAPICA,
  categoria: CategoriaCampo.ANAMNESE,
  campos: [
    {
      id: 'queixa_principal',
      nome: 'Queixa Principal',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: true,
      ordem: 1,
      ativo: true,
      secao: 'Queixa'
    },
    {
      id: 'localizacao_dor',
      nome: 'Localização da Dor',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: false,
      ordem: 2,
      ativo: true,
      secao: 'Dor'
    },
    {
      id: 'intensidade_dor',
      nome: 'Intensidade da Dor (0-10)',
      tipo: TipoCampo.NUMERO,
      obrigatorio: false,
      validacoes: [
        { tipo: 'min', valor: 0, mensagem: 'Valor mínimo é 0' },
        { tipo: 'max', valor: 10, mensagem: 'Valor máximo é 10' }
      ],
      ordem: 3,
      ativo: true,
      secao: 'Dor'
    },
    {
      id: 'forca_muscular',
      nome: 'Força Muscular',
      tipo: TipoCampo.SELECT,
      obrigatorio: false,
      opcoes: ['0/5', '1/5', '2/5', '3/5', '4/5', '5/5'],
      ordem: 4,
      ativo: true,
      secao: 'Avaliação Física'
    },
    {
      id: 'amplitude_movimento',
      nome: 'Amplitude de Movimento',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: false,
      ordem: 5,
      ativo: true,
      secao: 'Avaliação Física'
    },
    {
      id: 'atividades_diarias',
      nome: 'Dificuldade nas Atividades Diárias',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: false,
      ordem: 6,
      ativo: true,
      secao: 'Funcionalidade'
    }
  ],
  validacoes: [
    {
      tipo: 'campos_obrigatorios',
      regras: ['queixa_principal'],
      mensagem: 'Queixa principal é obrigatória'
    }
  ],
  ativo: true,
  ordem: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Templates para Odontologia
export const templateAnamneseOdontologica: TemplateEspecialidade = {
  id: 'anamnese_odontologica',
  tenantId: 'default',
  nome: 'Anamnese Odontológica',
  descricao: 'Template para anamnese odontológica',
  tipoClinica: TipoClinica.ODONTOLOGICA,
  categoria: CategoriaCampo.ANAMNESE,
  campos: [
    {
      id: 'queixa_principal',
      nome: 'Queixa Principal',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: true,
      ordem: 1,
      ativo: true,
      secao: 'Queixa'
    },
    {
      id: 'dor_dental',
      nome: 'Dor Dental',
      tipo: TipoCampo.BOOLEANO,
      obrigatorio: false,
      ordem: 2,
      ativo: true,
      secao: 'Sintomas'
    },
    {
      id: 'sangramento_gengival',
      nome: 'Sangramento Gengival',
      tipo: TipoCampo.BOOLEANO,
      obrigatorio: false,
      ordem: 3,
      ativo: true,
      secao: 'Sintomas'
    },
    {
      id: 'halitose',
      nome: 'Halitose (Mau Hálito)',
      tipo: TipoCampo.BOOLEANO,
      obrigatorio: false,
      ordem: 4,
      ativo: true,
      secao: 'Sintomas'
    },
    {
      id: 'medicacoes_uso',
      nome: 'Medicações em Uso',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: false,
      ordem: 5,
      ativo: true,
      secao: 'Histórico Médico'
    },
    {
      id: 'alergias',
      nome: 'Alergias',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: false,
      ordem: 6,
      ativo: true,
      secao: 'Histórico Médico'
    },
    {
      id: 'habitos_oral',
      nome: 'Hábitos Orais',
      tipo: TipoCampo.MULTISELECT,
      obrigatorio: false,
      opcoes: ['Roer unhas', 'Morder objetos', 'Ranger dentes', 'Respiração bucal', 'Nenhum'],
      ordem: 7,
      ativo: true,
      secao: 'Hábitos'
    }
  ],
  validacoes: [
    {
      tipo: 'campos_obrigatorios',
      regras: ['queixa_principal'],
      mensagem: 'Queixa principal é obrigatória'
    }
  ],
  ativo: true,
  ordem: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Templates para Estética
export const templateAnamneseEstetica: TemplateEspecialidade = {
  id: 'anamnese_estetica',
  tenantId: 'default',
  nome: 'Avaliação Estética',
  descricao: 'Template para avaliação estética',
  tipoClinica: TipoClinica.ESTETICA,
  categoria: CategoriaCampo.ANAMNESE,
  campos: [
    {
      id: 'queixa_principal',
      nome: 'Queixa Principal',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: true,
      ordem: 1,
      ativo: true,
      secao: 'Queixa'
    },
    {
      id: 'tipo_pele',
      nome: 'Tipo de Pele',
      tipo: TipoCampo.SELECT,
      obrigatorio: false,
      opcoes: ['Normal', 'Seca', 'Oleosa', 'Mista', 'Sensível'],
      ordem: 2,
      ativo: true,
      secao: 'Características da Pele'
    },
    {
      id: 'alergias_cosmicos',
      nome: 'Alergias a Cosméticos',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: false,
      ordem: 3,
      ativo: true,
      secao: 'Histórico'
    },
    {
      id: 'exposicao_solar',
      nome: 'Exposição Solar',
      tipo: TipoCampo.SELECT,
      obrigatorio: false,
      opcoes: ['Baixa', 'Moderada', 'Alta', 'Muito Alta'],
      ordem: 4,
      ativo: true,
      secao: 'Hábitos'
    },
    {
      id: 'protetor_solar',
      nome: 'Uso de Protetor Solar',
      tipo: TipoCampo.BOOLEANO,
      obrigatorio: false,
      ordem: 5,
      ativo: true,
      secao: 'Hábitos'
    },
    {
      id: 'procedimentos_anteriores',
      nome: 'Procedimentos Estéticos Anteriores',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: false,
      ordem: 6,
      ativo: true,
      secao: 'Histórico'
    }
  ],
  validacoes: [
    {
      tipo: 'campos_obrigatorios',
      regras: ['queixa_principal'],
      mensagem: 'Queixa principal é obrigatória'
    }
  ],
  ativo: true,
  ordem: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Templates para Veterinária
export const templateAnamneseVeterinaria: TemplateEspecialidade = {
  id: 'anamnese_veterinaria',
  tenantId: 'default',
  nome: 'Avaliação Veterinária',
  descricao: 'Template para avaliação veterinária',
  tipoClinica: TipoClinica.VETERINARIA,
  categoria: CategoriaCampo.ANAMNESE,
  campos: [
    {
      id: 'especie',
      nome: 'Espécie',
      tipo: TipoCampo.SELECT,
      obrigatorio: true,
      opcoes: ['Cão', 'Gato', 'Ave', 'Réptil', 'Equino', 'Bovino', 'Outro'],
      ordem: 1,
      ativo: true,
      secao: 'Identificação'
    },
    {
      id: 'raca',
      nome: 'Raça',
      tipo: TipoCampo.TEXTO,
      obrigatorio: false,
      ordem: 2,
      ativo: true,
      secao: 'Identificação'
    },
    {
      id: 'idade',
      nome: 'Idade (anos)',
      tipo: TipoCampo.NUMERO,
      obrigatorio: false,
      ordem: 3,
      ativo: true,
      secao: 'Identificação'
    },
    {
      id: 'peso',
      nome: 'Peso (kg)',
      tipo: TipoCampo.NUMERO,
      obrigatorio: false,
      ordem: 4,
      ativo: true,
      secao: 'Identificação'
    },
    {
      id: 'queixa_principal',
      nome: 'Queixa Principal',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: true,
      ordem: 5,
      ativo: true,
      secao: 'Queixa'
    },
    {
      id: 'sintomas',
      nome: 'Sintomas',
      tipo: TipoCampo.TEXTAREA,
      obrigatorio: false,
      ordem: 6,
      ativo: true,
      secao: 'Sintomas'
    },
    {
      id: 'vacinas',
      nome: 'Vacinas em Dia',
      tipo: TipoCampo.BOOLEANO,
      obrigatorio: false,
      ordem: 7,
      ativo: true,
      secao: 'Histórico'
    },
    {
      id: 'vermifugacao',
      nome: 'Vermifugação',
      tipo: TipoCampo.BOOLEANO,
      obrigatorio: false,
      ordem: 8,
      ativo: true,
      secao: 'Histórico'
    }
  ],
  validacoes: [
    {
      tipo: 'campos_obrigatorios',
      regras: ['especie', 'queixa_principal'],
      mensagem: 'Espécie e queixa principal são obrigatórias'
    }
  ],
  ativo: true,
  ordem: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Mapa de templates por tipo de clínica
export const templatesPorEspecialidade: Record<TipoClinica, TemplateEspecialidade[]> = {
  [TipoClinica.NUTRICIONAL]: [templateAnamneseNutricional],
  [TipoClinica.PSICOLOGICA]: [templateAnamnesePsicologica],
  [TipoClinica.FISIOTERAPICA]: [templateAnamneseFisioterapica],
  [TipoClinica.ODONTOLOGICA]: [templateAnamneseOdontologica],
  [TipoClinica.ESTETICA]: [templateAnamneseEstetica],
  [TipoClinica.VETERINARIA]: [templateAnamneseVeterinaria],
  [TipoClinica.MEDICA]: [],
  [TipoClinica.EDUCACIONAL]: [],
  [TipoClinica.CORPORATIVA]: [],
  [TipoClinica.PERSONALIZADA]: []
};

// Função para obter templates por categoria e tipo de clínica
export function getTemplatesByCategoryAndType(
  categoria: CategoriaCampo, 
  tipoClinica: TipoClinica
): TemplateEspecialidade[] {
  const templates = templatesPorEspecialidade[tipoClinica] || [];
  return templates.filter(template => template.categoria === categoria);
}

// Função para obter template por ID
export function getTemplateById(id: string): TemplateEspecialidade | null {
  for (const templates of Object.values(templatesPorEspecialidade)) {
    const template = templates.find(t => t.id === id);
    if (template) return template;
  }
  return null;
} 
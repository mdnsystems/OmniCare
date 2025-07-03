import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  ClipboardList,
  Settings,
  Palette,
  Eye,
  Code,
  ArrowRight
} from 'lucide-react';
import { useClinica } from '@/contexts/ClinicaContext';
import { TipoClinica } from '@/types/api';
import { templateAnamneseNutricional, templateAnamneseOdontologica } from '@/data/templates';
import { DynamicForm } from '@/components/dynamic-fields/DynamicForm';

export function DemonstracaoMultitenant() {
  const { configuracao, setConfiguracao, getNomenclatura, isModuleActive } = useClinica();
  const [especialidadeAtiva, setEspecialidadeAtiva] = useState<TipoClinica>(configuracao?.tipo || TipoClinica.NUTRICIONAL);

  const especialidades = [
    {
      tipo: TipoClinica.NUTRICIONAL,
      nome: 'Nutrição',
      cor: '#059669',
      descricao: 'Clínica de nutrição com foco em avaliação nutricional',
      icon: '🥗'
    },
    {
      tipo: TipoClinica.ODONTOLOGICA,
      nome: 'Odontologia',
      cor: '#0891b2',
      descricao: 'Clínica odontológica com procedimentos específicos',
      icon: '🦷'
    },
    {
      tipo: TipoClinica.PSICOLOGICA,
      nome: 'Psicologia',
      cor: '#7c3aed',
      descricao: 'Clínica psicológica com sessões terapêuticas',
      icon: '🧠'
    },
    {
      tipo: TipoClinica.FISIOTERAPICA,
      nome: 'Fisioterapia',
      cor: '#dc2626',
      descricao: 'Clínica fisioterapêutica com avaliações físicas',
      icon: '💪'
    },
    {
      tipo: TipoClinica.ESTETICA,
      nome: 'Estética',
      cor: '#ec4899',
      descricao: 'Clínica estética com procedimentos cosméticos',
      icon: '✨'
    },
    {
      tipo: TipoClinica.VETERINARIA,
      nome: 'Veterinária',
      cor: '#f59e0b',
      descricao: 'Clínica veterinária para animais',
      icon: '🐾'
    }
  ];

  const handleMudarEspecialidade = (tipo: TipoClinica) => {
    const especialidade = especialidades.find(esp => esp.tipo === tipo);
    if (!especialidade) return;

    const novaConfiguracao = {
      ...configuracao!,
      tipo,
      nome: `Clínica ${especialidade.nome}`,
      corPrimaria: especialidade.cor,
      corSecundaria: especialidade.cor,
      configuracoes: {
        ...configuracao!.configuracoes,
        templatesAtivos: [`anamnese_${tipo.toLowerCase()}`],
        fluxosAtivos: [`fluxo_${tipo.toLowerCase()}`]
      }
    };

    setConfiguracao(novaConfiguracao);
    setEspecialidadeAtiva(tipo);
  };

  const getTemplateAtivo = () => {
    switch (especialidadeAtiva) {
      case TipoClinica.NUTRICIONAL:
        return templateAnamneseNutricional;
      case TipoClinica.ODONTOLOGICA:
        return templateAnamneseOdontologica;
      default:
        return templateAnamneseNutricional;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Demonstração Multitenant</h1>
        <p className="text-muted-foreground">
          Veja como a aplicação se adapta automaticamente para diferentes especialidades
        </p>
      </div>

      {/* Seletor de Especialidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Seletor de Especialidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {especialidades.map((especialidade) => (
              <Button
                key={especialidade.tipo}
                variant={especialidadeAtiva === especialidade.tipo ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleMudarEspecialidade(especialidade.tipo)}
                style={{
                  backgroundColor: especialidadeAtiva === especialidade.tipo ? especialidade.cor : undefined,
                  borderColor: especialidade.cor
                }}
              >
                <span className="text-2xl">{especialidade.icon}</span>
                <span className="font-medium">{especialidade.nome}</span>
                <span className="text-xs text-center opacity-80">{especialidade.descricao}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuração Atual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuração Atual da Clínica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Informações Básicas</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Nome:</strong> {configuracao?.nome}</p>
                <p><strong>Tipo:</strong> {configuracao?.tipo}</p>
                <p><strong>Tenant ID:</strong> {configuracao?.tenantId}</p>
                <p><strong>Status:</strong> 
                  <Badge variant={configuracao?.ativo ? "default" : "secondary"} className="ml-2">
                    {configuracao?.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Cores da Clínica</h4>
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: configuracao?.corPrimaria }}
                />
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: configuracao?.corSecundaria }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nomenclatura Adaptativa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Nomenclatura Adaptativa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Paciente</p>
              <p className="font-medium">{getNomenclatura('paciente')}</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Profissional</p>
              <p className="font-medium">{getNomenclatura('profissional')}</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Anamnese</p>
              <p className="font-medium">{getNomenclatura('anamnese')}</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Consulta</p>
              <p className="font-medium">{getNomenclatura('consulta')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Sidebar Simulado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Menu Sidebar (Simulado)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 hover:bg-muted rounded">
              <Users className="h-4 w-4" />
              <span>{getNomenclatura('pacientes')}</span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-muted rounded">
              <UserCheck className="h-4 w-4" />
              <span>{getNomenclatura('profissionais')}</span>
            </div>
            {isModuleActive('agendamento') && (
              <div className="flex items-center gap-2 p-2 hover:bg-muted rounded">
                <Calendar className="h-4 w-4" />
                <span>{getNomenclatura('agendamento')}</span>
              </div>
            )}
            {isModuleActive('prontuario') && (
              <div className="flex items-center gap-2 p-2 hover:bg-muted rounded">
                <FileText className="h-4 w-4" />
                <span>{getNomenclatura('prontuario')}</span>
              </div>
            )}
            {isModuleActive('anamnese') && (
              <div className="flex items-center gap-2 p-2 hover:bg-muted rounded">
                <ClipboardList className="h-4 w-4" />
                <span>{getNomenclatura('anamnese')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Template de Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Template de Formulário - {getNomenclatura('anamnese')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{getTemplateAtivo().nome}</h4>
                <p className="text-sm text-muted-foreground">{getTemplateAtivo().descricao}</p>
              </div>
              <Badge variant="outline">{getTemplateAtivo().categoria}</Badge>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getTemplateAtivo().campos.slice(0, 6).map((campo) => (
                <div key={campo.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{campo.nome}</span>
                    {campo.obrigatorio && (
                      <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Tipo:</strong> {campo.tipo}</p>
                    <p><strong>Seção:</strong> {campo.secao}</p>
                    {campo.opcoes && (
                      <p><strong>Opções:</strong> {campo.opcoes.slice(0, 3).join(', ')}...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button variant="outline">
                Ver Formulário Completo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Módulos Ativos */}
      <Card>
        <CardHeader>
          <CardTitle>Módulos Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {configuracao?.configuracoes.modulosAtivos.map((modulo) => (
              <Badge key={modulo} variant="default">
                {modulo}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle>Como Testar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>1. <strong>Selecione uma especialidade</strong> acima para ver as mudanças</p>
            <p>2. <strong>Observe a nomenclatura</strong> que muda automaticamente</p>
            <p>3. <strong>Veja o template</strong> que se adapta para cada especialidade</p>
            <p>4. <strong>Navegue pelo sistema</strong> para ver as mudanças em tempo real</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
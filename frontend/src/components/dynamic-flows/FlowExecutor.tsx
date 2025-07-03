import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Play, 
  Pause, 
  SkipForward,
  AlertCircle,
  Clock,
  User
} from 'lucide-react';
import { 
  FluxoEspecialidade, 
  EtapaFluxo, 
  AcaoFluxo,
  CondicaoFluxo 
} from '@/types/api';
import { DynamicForm } from '../dynamic-fields/DynamicForm';
import { useClinica } from '@/contexts/ClinicaContext';

interface FlowExecutorProps {
  fluxo: FluxoEspecialidade;
  pacienteId: string;
  profissionalId: string;
  onComplete: (resultado: any) => void;
  onCancel: () => void;
}

interface EtapaStatus {
  id: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'pulada' | 'erro';
  dados: Record<string, any>;
  erro?: string;
}

export function FlowExecutor({ 
  fluxo, 
  pacienteId, 
  profissionalId, 
  onComplete, 
  onCancel 
}: FlowExecutorProps) {
  const { getTemplateById } = useClinica();
  const [etapasStatus, setEtapasStatus] = useState<EtapaStatus[]>([]);
  const [etapaAtual, setEtapaAtual] = useState<number>(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [dadosCompletos, setDadosCompletos] = useState<Record<string, any>>({});

  // Inicializar status das etapas
  useEffect(() => {
    const statusInicial = fluxo.etapas.map(etapa => ({
      id: etapa.id,
      status: 'pendente' as const,
      dados: {}
    }));
    setEtapasStatus(statusInicial);
  }, [fluxo]);

  const progresso = (etapasStatus.filter(e => e.status === 'concluida').length / fluxo.etapas.length) * 100;

  const executarAcoes = async (acoes: AcaoFluxo[], dados: Record<string, any>) => {
    for (const acao of acoes) {
      try {
        switch (acao.tipo) {
          case 'criar_registro':
            // TODO: Implementar criação de registro
            console.log('Criando registro:', acao.parametros);
            break;
          
          case 'enviar_notificacao':
            // TODO: Implementar envio de notificação
            console.log('Enviando notificação:', acao.parametros);
            break;
          
          case 'gerar_relatorio':
            // TODO: Implementar geração de relatório
            console.log('Gerando relatório:', acao.parametros);
            break;
          
          case 'validar_campo':
            // TODO: Implementar validação de campo
            console.log('Validando campo:', acao.parametros);
            break;
        }
      } catch (error) {
        console.error('Erro ao executar ação:', error);
        throw error;
      }
    }
  };

  const verificarCondicoes = (condicoes: CondicaoFluxo[], dados: Record<string, any>): boolean => {
    if (condicoes.length === 0) return true;

    return condicoes.every(condicao => {
      const valor = dados[condicao.campo];
      
      switch (condicao.operador) {
        case 'igual':
          return valor === condicao.valor;
        case 'diferente':
          return valor !== condicao.valor;
        case 'maior':
          return valor > condicao.valor;
        case 'menor':
          return valor < condicao.valor;
        case 'contem':
          return String(valor).includes(String(condicao.valor));
        default:
          return true;
      }
    });
  };

  const executarEtapa = async (etapa: EtapaFluxo, dados: Record<string, any>) => {
    try {
      // Verificar condições
      if (!verificarCondicoes(etapa.condicoes, dados)) {
        return { status: 'pulada', dados };
      }

      // Executar ações
      await executarAcoes(etapa.acoes, dados);

      return { status: 'concluida', dados };
    } catch (error) {
      console.error('Erro ao executar etapa:', error);
      return { status: 'erro', dados, erro: error.message };
    }
  };

  const handleEtapaSubmit = async (dados: Record<string, any>) => {
    setIsExecuting(true);
    
    try {
      const etapa = fluxo.etapas[etapaAtual];
      const resultado = await executarEtapa(etapa, dados);

      // Atualizar status da etapa
      setEtapasStatus(prev => prev.map((status, index) => 
        index === etapaAtual 
          ? { ...status, ...resultado }
          : status
      ));

      // Atualizar dados completos
      setDadosCompletos(prev => ({ ...prev, ...dados }));

      // Verificar se há erro
      if (resultado.status === 'erro') {
        toast.error(`Erro na etapa: ${resultado.erro}`);
        return;
      }

      // Próxima etapa ou finalizar
      if (etapaAtual < fluxo.etapas.length - 1) {
        setEtapaAtual(prev => prev + 1);
        toast.success('Etapa concluída!');
      } else {
        // Fluxo completo
        toast.success('Fluxo concluído com sucesso!');
        onComplete(dadosCompletos);
      }
    } catch (error) {
      toast.error('Erro ao executar etapa');
      console.error('Erro:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const pularEtapa = () => {
    const etapa = fluxo.etapas[etapaAtual];
    
    if (etapa.obrigatoria) {
      toast.error('Esta etapa é obrigatória e não pode ser pulada');
      return;
    }

    setEtapasStatus(prev => prev.map((status, index) => 
      index === etapaAtual 
        ? { ...status, status: 'pulada' }
        : status
    ));

    if (etapaAtual < fluxo.etapas.length - 1) {
      setEtapaAtual(prev => prev + 1);
      toast.info('Etapa pulada');
    } else {
      onComplete(dadosCompletos);
    }
  };

  const voltarEtapa = () => {
    if (etapaAtual > 0) {
      setEtapaAtual(prev => prev - 1);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'em_andamento':
        return <Play className="h-5 w-5 text-blue-500" />;
      case 'pulada':
        return <SkipForward className="h-5 w-5 text-yellow-500" />;
      case 'erro':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const etapaAtualObj = fluxo.etapas[etapaAtual];
  const statusAtual = etapasStatus[etapaAtual];

  return (
    <div className="space-y-6">
      {/* Header do Fluxo */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{fluxo.nome}</h2>
          <p className="text-muted-foreground">{fluxo.descricao}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{fluxo.tipoClinica}</Badge>
          <Badge variant="secondary">{fluxo.etapas.length} etapas</Badge>
        </div>
      </div>

      {/* Progresso */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progresso do Fluxo</span>
              <span>{Math.round(progresso)}%</span>
            </div>
            <Progress value={progresso} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Etapas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Etapas */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Etapas do Fluxo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fluxo.etapas.map((etapa, index) => (
                  <div
                    key={etapa.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      index === etapaAtual
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setEtapaAtual(index)}
                  >
                    {getStatusIcon(etapasStatus[index]?.status || 'pendente')}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{etapa.nome}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {etapa.descricao}
                      </p>
                    </div>
                    {etapa.obrigatoria && (
                      <Badge variant="destructive" className="text-xs">
                        Obrigatória
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Etapa Atual */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(statusAtual?.status || 'pendente')}
                    {etapaAtualObj.nome}
                  </CardTitle>
                  <p className="text-muted-foreground">{etapaAtualObj.descricao}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Etapa {etapaAtual + 1} de {fluxo.etapas.length}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {statusAtual?.status === 'concluida' ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Etapa Concluída</h3>
                  <p className="text-muted-foreground mb-4">
                    Esta etapa foi concluída com sucesso.
                  </p>
                  <div className="flex justify-center gap-2">
                    {etapaAtual > 0 && (
                      <Button variant="outline" onClick={voltarEtapa}>
                        Voltar
                      </Button>
                    )}
                    {etapaAtual < fluxo.etapas.length - 1 ? (
                      <Button onClick={() => setEtapaAtual(prev => prev + 1)}>
                        Próxima Etapa
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={() => onComplete(dadosCompletos)}>
                        Finalizar Fluxo
                      </Button>
                    )}
                  </div>
                </div>
              ) : statusAtual?.status === 'pulada' ? (
                <div className="text-center py-8">
                  <SkipForward className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Etapa Pulada</h3>
                  <p className="text-muted-foreground mb-4">
                    Esta etapa foi pulada conforme as condições do fluxo.
                  </p>
                  <Button onClick={() => setEtapaAtual(prev => prev + 1)}>
                    Próxima Etapa
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ) : statusAtual?.status === 'erro' ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Erro na Etapa</h3>
                  <p className="text-muted-foreground mb-4">
                    {statusAtual.erro}
                  </p>
                  <Button onClick={() => setEtapaAtual(prev => prev)}>
                    Tentar Novamente
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Aqui seria renderizado o formulário dinâmico da etapa */}
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Formulário dinâmico para a etapa "{etapaAtualObj.nome}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Campos: {etapaAtualObj.campos.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex gap-2">
                      {etapaAtual > 0 && (
                        <Button variant="outline" onClick={voltarEtapa}>
                          Voltar
                        </Button>
                      )}
                      {!etapaAtualObj.obrigatoria && (
                        <Button variant="outline" onClick={pularEtapa}>
                          Pular Etapa
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={onCancel}>
                        Cancelar
                      </Button>
                      <Button 
                        onClick={() => handleEtapaSubmit({})}
                        disabled={isExecuting}
                      >
                        {isExecuting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Executando...
                          </>
                        ) : (
                          <>
                            Concluir Etapa
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
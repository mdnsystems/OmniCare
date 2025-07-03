import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  RefreshCw,
  Settings,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  Mail,
  Send
} from 'lucide-react';
import { useControleFinanceiro } from '@/hooks/useControleFinanceiro';
import { useLembretesPersonalizados } from '@/hooks/useLembretesPersonalizados';
import { StatusFatura, NivelBloqueio, FaturaClinica } from '@/types/api';
import { FaturasTable } from '@/components/tables/faturas-clinica';
import { ResumoFinanceiro } from '@/components/admin/resumo-financeiro';
import { EstatisticasFinanceiras } from '@/components/admin/estatisticas-financeiras';
import { NovaFaturaDialog } from '@/components/admin/nova-fatura-dialog';
import { ConfiguracoesBloqueioDialog } from '@/components/admin/configuracoes-bloqueio-dialog';
import { LembretePersonalizadoDialog } from '@/components/admin/lembrete-personalizado-dialog';

export function ControleFinanceiro() {
  const {
    painelData,
    faturas,
    isLoading,
    aplicarRegrasAutomaticas,
    formatarValor,
    calcularDiasAtraso
  } = useControleFinanceiro();

  const {
    enviarLembretesLote,
    abrirDialogLembrete
  } = useLembretesPersonalizados();

  const [isNovaFaturaOpen, setIsNovaFaturaOpen] = useState(false);
  const [isConfiguracoesOpen, setIsConfiguracoesOpen] = useState(false);
  const [isLembreteDialogOpen, setIsLembreteDialogOpen] = useState(false);
  const [faturaSelecionada, setFaturaSelecionada] = useState<FaturaClinica | null>(null);

  // Função para obter cor do status
  const getStatusColor = (status: StatusFatura) => {
    switch (status) {
      case StatusFatura.PAGO:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case StatusFatura.PENDENTE:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case StatusFatura.VENCIDO:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case StatusFatura.PARCIAL:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case StatusFatura.CANCELADO:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Função para obter cor do nível de bloqueio
  const getNivelBloqueioColor = (nivel: NivelBloqueio) => {
    switch (nivel) {
      case NivelBloqueio.SEM_BLOQUEIO:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case NivelBloqueio.NOTIFICACAO:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case NivelBloqueio.AVISO_TOPO:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case NivelBloqueio.RESTRICAO_FUNCIONALIDADES:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case NivelBloqueio.BLOQUEIO_TOTAL:
        return 'bg-red-900 text-red-100 dark:bg-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Faturas que precisam de atenção
  const faturasCriticas = faturas.filter(fatura => {
    const diasAtraso = calcularDiasAtraso(fatura.dataVencimento);
    return fatura.status === StatusFatura.VENCIDO || diasAtraso > 0;
  });

  // Faturas com bloqueio total
  const faturasBloqueioTotal = faturas.filter(fatura => 
    fatura.nivelBloqueio === NivelBloqueio.BLOQUEIO_TOTAL
  );

  // Faturas que precisam de lembretes
  const faturasParaLembrete = faturas.filter(fatura => {
    const diasAtraso = calcularDiasAtraso(fatura.dataVencimento);
    return (fatura.status === StatusFatura.VENCIDO || diasAtraso > 0) && 
           fatura.status !== StatusFatura.PAGO;
  });

  // Função para abrir dialog de lembrete personalizado
  const handleAbrirLembrete = (fatura: FaturaClinica) => {
    setFaturaSelecionada(fatura);
    setIsLembreteDialogOpen(true);
  };

  // Função para enviar lembretes em lote
  const handleEnviarLembretesLote = async () => {
    if (faturasParaLembrete.length === 0) return;
    
    await enviarLembretesLote.mutateAsync(faturasParaLembrete);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle Financeiro</h1>
          <p className="text-muted-foreground">
            Gerencie faturas, pagamentos e bloqueios das clínicas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConfiguracoesOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={aplicarRegrasAutomaticas}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Aplicar Regras
          </Button>
          <Button
            size="sm"
            onClick={() => setIsNovaFaturaOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Fatura
          </Button>
        </div>
      </div>

      {/* Alertas Críticos */}
      {(faturasCriticas.length > 0 || faturasBloqueioTotal.length > 0) && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg text-red-800 dark:text-red-200">
                Atenção Necessária
              </CardTitle>
              <Badge variant="outline" className="text-red-600 border-red-300">
                {faturasCriticas.length + faturasBloqueioTotal.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {faturasBloqueioTotal.length > 0 && (
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                  {faturasBloqueioTotal.length} clínica(s) com bloqueio total
                </span>
              </div>
            )}
            {faturasCriticas.length > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  {faturasCriticas.length} fatura(s) em atraso
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resumo Financeiro */}
      {painelData && <ResumoFinanceiro resumo={painelData.resumo} />}

      {/* Conteúdo Principal */}
      <Tabs defaultValue="faturas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="faturas">Faturas</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          <TabsTrigger value="acoes">Ações Rápidas</TabsTrigger>
        </TabsList>

        <TabsContent value="faturas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Faturas das Clínicas</CardTitle>
            </CardHeader>
            <CardContent>
              <FaturasTable 
                faturas={faturas} 
                onEnviarLembrete={handleAbrirLembrete}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estatisticas" className="space-y-4">
          {painelData && <EstatisticasFinanceiras estatisticas={painelData.estatisticas} />}
        </TabsContent>

        <TabsContent value="acoes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Ação: Aplicar Regras Automáticas */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Aplicar Regras</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Aplica automaticamente os níveis de bloqueio baseado nos dias de atraso
                </p>
                <Button 
                  onClick={aplicarRegrasAutomaticas}
                  className="w-full"
                >
                  Executar Agora
                </Button>
              </CardContent>
            </Card>

            {/* Ação: Enviar Lembretes */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-lg">Enviar Lembretes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Envia lembretes personalizados para clínicas em atraso
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={handleEnviarLembretesLote}
                    disabled={faturasParaLembrete.length === 0 || enviarLembretesLote.isPending}
                    className="w-full"
                  >
                    {enviarLembretesLote.isPending ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar em Lote ({faturasParaLembrete.length})
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    {faturasParaLembrete.length} clínica(s) selecionada(s)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Ação: Relatório de Cobrança */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">Relatório</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Gera relatório completo de cobrança e inadimplência
                </p>
                <Button 
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  Em Desenvolvimento
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <NovaFaturaDialog 
        open={isNovaFaturaOpen} 
        onOpenChange={setIsNovaFaturaOpen} 
      />
      
      <ConfiguracoesBloqueioDialog 
        open={isConfiguracoesOpen} 
        onOpenChange={setIsConfiguracoesOpen} 
      />

      <LembretePersonalizadoDialog
        open={isLembreteDialogOpen}
        onOpenChange={setIsLembreteDialogOpen}
        fatura={faturaSelecionada}
      />
    </div>
  );
} 
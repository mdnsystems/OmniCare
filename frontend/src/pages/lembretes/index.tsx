import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Calendar, Clock, AlertCircle, CheckCircle, XCircle, Loader2, Users, FileText } from "lucide-react";
import LembretesTable from "@/components/tables/lembretes";
import { useLembretesStats } from "@/hooks/useLembretes";

export default function LembretesPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useLembretesStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lembretes</h1>
          <p className="text-muted-foreground">
            Gerencie os lembretes e notificações da clínica
          </p>
        </div>
        <Button onClick={() => navigate("/lembretes/novo")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Lembrete
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Lembretes</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold">{stats?.totalLembretes || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Todos os lembretes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.lembretesPorStatus?.PENDENTE || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Aguardando execução
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {stats?.lembretesPorStatus?.CONCLUIDO || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Finalizados com sucesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {stats?.lembretesPorStatus?.CANCELADO || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Cancelados ou não realizados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por Tipo */}
      {stats?.lembretesPorTipo && Object.keys(stats.lembretesPorTipo).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
            <CardDescription>
              Quantidade de lembretes por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.lembretesPorTipo).map(([tipo, quantidade]) => (
                <div key={tipo} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">{tipo}</span>
                  <Badge variant="secondary">{quantidade}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Distribuição por Prioridade */}
      {stats?.lembretesPorPrioridade && Object.keys(stats.lembretesPorPrioridade).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Prioridade</CardTitle>
            <CardDescription>
              Quantidade de lembretes por nível de prioridade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(stats.lembretesPorPrioridade).map(([prioridade, quantidade]) => (
                <div key={prioridade} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">{prioridade}</span>
                  <Badge 
                    variant={prioridade === 'ALTA' ? 'destructive' : prioridade === 'MEDIA' ? 'default' : 'secondary'}
                  >
                    {quantidade}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas Adicionais */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Média por Dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {stats?.mediaLembretesPorDia?.toFixed(1) || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Lembretes criados por dia em média
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Crescimento Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {stats?.crescimentoMensal ? (
                  <span className={stats.crescimentoMensal >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {stats.crescimentoMensal >= 0 ? '+' : ''}{stats.crescimentoMensal.toFixed(1)}%
                  </span>
                ) : (
                  '0%'
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Comparado ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Lembretes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Lembretes</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os lembretes da clínica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LembretesTable />
        </CardContent>
      </Card>
    </div>
  );
} 
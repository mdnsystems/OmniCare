import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Calendar, Users, FileText, Loader2, CheckCircle, XCircle, Archive } from "lucide-react";
import ChatsTable from "@/components/tables/chats";
import { useChatsStats } from "@/hooks/useChats";

export default function ListaChats() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useChatsStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chats</h1>
          <p className="text-muted-foreground">
            Gerencie os chats e conversas da clínica
          </p>
        </div>
        <Button onClick={() => navigate("/chat/novo")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Chat
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold">{stats?.totalChats || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Todos os chats criados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
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
                {stats?.chatsPorStatus?.ATIVO || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Chats em atividade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arquivados</CardTitle>
            <Archive className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-600">
                {stats?.chatsPorStatus?.ARQUIVADO || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Chats arquivados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fechados</CardTitle>
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
                {stats?.chatsPorStatus?.FECHADO || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Chats encerrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por Tipo */}
      {stats?.chatsPorTipo && Object.keys(stats.chatsPorTipo).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
            <CardDescription>
              Quantidade de chats por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.chatsPorTipo).map(([tipo, quantidade]) => (
                <div key={tipo} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">{tipo}</span>
                  <Badge variant="secondary">{quantidade}</Badge>
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
              <FileText className="h-4 w-4" />
              Média de Mensagens
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
                {stats?.mediaMensagensPorChat?.toFixed(1) || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Mensagens por chat em média
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
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

      {/* Tabela de Chats */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Chats</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os chats da clínica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChatsTable />
        </CardContent>
      </Card>
    </div>
  );
} 
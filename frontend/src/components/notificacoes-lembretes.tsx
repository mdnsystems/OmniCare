"use client"

import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Clock, DollarSign, FileText, X, QrCode, MessageCircle, ExternalLink, Calendar, Building } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotificacoesLembretes } from '@/hooks/useNotificacoesLembretes';
import { NotificacaoLembrete } from '@/services/lembrete.service';
import { useNavigate } from 'react-router-dom';
import { QRCodePagamento } from '@/components/qr-code-pagamento';

export function NotificacoesLembretes() {
  const {
    notificacoes,
    totalNaoLidas,
    isLoading,
    marcarComoLida,
    marcarTodasComoLidas,
    deveMostrarNotificacoes,
  } = useNotificacoesLembretes();

  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const [selectedNotificacao, setSelectedNotificacao] = useState<NotificacaoLembrete | null>(null);
  const navigate = useNavigate();

  // Formatar valor monetário
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Formatar data
  const formatarData = (data: string) => {
    return format(parseISO(data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  // Formatar data de vencimento
  const formatarDataVencimento = (data: string) => {
    return format(parseISO(data), "dd/MM/yyyy", { locale: ptBR });
  };

  // Obter ícone baseado no tipo de lembrete
  const getIcone = (tipo: string) => {
    switch (tipo) {
      case 'NOTIFICACAO_3_DIAS':
        return <Bell className="h-4 w-4" />;
      case 'AVISO_5_DIAS':
        return <Clock className="h-4 w-4" />;
      case 'RESTRICAO_7_DIAS':
        return <FileText className="h-4 w-4" />;
      case 'BLOQUEIO_10_DIAS':
        return <X className="h-4 w-4" />;
      case 'PERSONALIZADO':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Obter cor do badge baseado no tipo
  const getBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'NOTIFICACAO_3_DIAS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'AVISO_5_DIAS':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'RESTRICAO_7_DIAS':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'BLOQUEIO_10_DIAS':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'PERSONALIZADO':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Obter texto do tipo
  const getTipoTexto = (tipo: string) => {
    switch (tipo) {
      case 'NOTIFICACAO_3_DIAS':
        return 'Notificação 3 dias';
      case 'AVISO_5_DIAS':
        return 'Aviso 5 dias';
      case 'RESTRICAO_7_DIAS':
        return 'Restrição 7 dias';
      case 'BLOQUEIO_10_DIAS':
        return 'Bloqueio 10 dias';
      case 'PERSONALIZADO':
        return 'Personalizado';
      default:
        return tipo;
    }
  };

  // Obter cor de urgência baseada no tipo
  const getUrgenciaColor = (tipo: string) => {
    switch (tipo) {
      case 'NOTIFICACAO_3_DIAS':
        return 'text-blue-600 dark:text-blue-400';
      case 'AVISO_5_DIAS':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'RESTRICAO_7_DIAS':
        return 'text-orange-600 dark:text-orange-400';
      case 'BLOQUEIO_10_DIAS':
        return 'text-red-600 dark:text-red-400';
      case 'PERSONALIZADO':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Abrir modal com detalhes da notificação
  const handleAbrirDetalhes = async (notificacao: NotificacaoLembrete) => {
    setSelectedNotificacao(notificacao);
    setModalOpen(true);
    
    // Marcar como lida automaticamente
    if (!notificacao.lida) {
      await marcarComoLida.mutateAsync(notificacao.id);
    }
  };

  // Marcar todas como lidas
  const handleMarcarTodasComoLidas = async () => {
    await marcarTodasComoLidas.mutateAsync();
  };

  // Abrir chat com super admin
  const handleAbrirChat = () => {
    setModalOpen(false);
    navigate('/chat');
  };

  // Abrir QR Code de pagamento
  const handleGerarQRCode = () => {
    setQrCodeOpen(true);
  };

  // Se não deve mostrar notificações, não renderizar nada
  if (!deveMostrarNotificacoes) {
    return null;
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {totalNaoLidas > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {totalNaoLidas > 99 ? '99+' : totalNaoLidas}
              </Badge>
            )}
            <span className="sr-only">Notificações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notificações de Lembretes</span>
            {totalNaoLidas > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarcarTodasComoLidas}
                className="h-6 px-2 text-xs"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Marcar todas
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <ScrollArea className="h-96">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (notificacoes as NotificacaoLembrete[]).length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
              </div>
            ) : (
              <DropdownMenuGroup>
                {(notificacoes as NotificacaoLembrete[]).map((notificacao: NotificacaoLembrete) => (
                  <DropdownMenuItem
                    key={notificacao.id}
                    className={`flex flex-col items-start p-3 cursor-pointer ${
                      !notificacao.lida ? 'bg-muted/50' : ''
                    }`}
                    onClick={() => handleAbrirDetalhes(notificacao)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className={`mt-1 ${!notificacao.lida ? 'text-primary' : 'text-muted-foreground'}`}>
                        {getIcone(notificacao.tipo)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={`text-xs ${getBadgeColor(notificacao.tipo)}`}>
                            {getTipoTexto(notificacao.tipo)}
                          </Badge>
                          {!notificacao.lida && (
                            <Badge variant="secondary" className="text-xs">
                              Nova
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm font-medium mb-1">
                          {notificacao.fatura?.clinica?.nome || 'Clínica'}
                        </p>
                        
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {notificacao.mensagem}
                        </p>
                        
                        {notificacao.fatura && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                            <span>Fatura: {notificacao.fatura.numeroFatura}</span>
                            <span>{formatarValor(notificacao.fatura.valor)}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatarData(notificacao.dataEnvio)}</span>
                          {!notificacao.lida && (
                            <Check className="h-3 w-3 text-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            )}
          </ScrollArea>
          
          {(notificacoes as NotificacaoLembrete[]).length > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="w-full justify-center text-xs"
                >
                  Fechar
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de Detalhes */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNotificacao && getIcone(selectedNotificacao.tipo)}
              <span>Detalhes da Notificação</span>
            </DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre a fatura e opções de ação
            </DialogDescription>
          </DialogHeader>

          {selectedNotificacao && (
            <div className="space-y-6">
              {/* Cabeçalho da Notificação */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Badge variant="outline" className={getBadgeColor(selectedNotificacao.tipo)}>
                        {getTipoTexto(selectedNotificacao.tipo)}
                      </Badge>
                      {!selectedNotificacao.lida && (
                        <Badge variant="secondary" className="text-xs">
                          Nova
                        </Badge>
                      )}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {formatarData(selectedNotificacao.dataEnvio)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedNotificacao.mensagem}
                  </p>
                  
                  <div className={`p-3 rounded-lg border-l-4 ${getUrgenciaColor(selectedNotificacao.tipo)} bg-muted/50`}>
                    <p className="text-sm font-medium">
                      {selectedNotificacao.tipo === 'BLOQUEIO_10_DIAS' && '⚠️ Sistema bloqueado - Ação imediata necessária'}
                      {selectedNotificacao.tipo === 'RESTRICAO_7_DIAS' && '⚠️ Restrições ativas - Regularize sua situação'}
                      {selectedNotificacao.tipo === 'AVISO_5_DIAS' && '⚠️ Aviso importante - Verifique o prazo'}
                      {selectedNotificacao.tipo === 'NOTIFICACAO_3_DIAS' && 'ℹ️ Notificação informativa'}
                      {selectedNotificacao.tipo === 'PERSONALIZADO' && '📢 Mensagem personalizada'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Informações da Fatura */}
              {selectedNotificacao.fatura && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Informações da Fatura
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Clínica</p>
                        <p className="text-sm">{selectedNotificacao.fatura.clinica?.nome || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Número da Fatura</p>
                        <p className="text-sm font-mono">{selectedNotificacao.fatura.numeroFatura}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Valor</p>
                        <p className="text-lg font-bold text-primary">
                          {formatarValor(selectedNotificacao.fatura.valor)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Vencimento</p>
                        <p className="text-sm flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatarDataVencimento(selectedNotificacao.fatura.dataVencimento)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ações */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações Disponíveis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      onClick={handleGerarQRCode}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Gerar QR Code
                    </Button>
                    
                    <Button 
                      onClick={handleAbrirChat}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Falar com Suporte
                    </Button>
                    
                    <Button 
                      onClick={() => window.open('/financeiro/faturamento', '_blank')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver Todas as Faturas
                    </Button>
                    
                    <Button 
                      onClick={() => setModalOpen(false)}
                      className="w-full justify-start"
                      variant="secondary"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Fechar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal QR Code */}
      <QRCodePagamento
        open={qrCodeOpen}
        onOpenChange={setQrCodeOpen}
        fatura={selectedNotificacao?.fatura || null}
      />
    </>
  );
} 
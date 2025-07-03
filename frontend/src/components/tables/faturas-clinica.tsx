import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  DollarSign,
  MessageSquare,
  Lock,
  Calendar,
  Building,
  Search,
  Filter,
  Download,
  Mail
} from 'lucide-react';
import { 
  FaturaClinica, 
  StatusFatura, 
  NivelBloqueio, 
  FormaPagamentoClinica,
  TipoLembrete
} from '@/types/api';
import { useControleFinanceiro } from '@/hooks/useControleFinanceiro';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FaturasTableProps {
  faturas: FaturaClinica[];
  onEnviarLembrete?: (fatura: FaturaClinica) => void;
}

export function FaturasTable({ faturas, onEnviarLembrete }: FaturasTableProps) {
  const {
    registrarPagamento,
    enviarLembrete,
    aplicarBloqueio,
    atualizarStatusFatura,
    formatarValor,
    calcularDiasAtraso
  } = useControleFinanceiro();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [nivelBloqueioFilter, setNivelBloqueioFilter] = useState<string>('TODOS');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  
  // Estados para dialogs
  const [selectedFatura, setSelectedFatura] = useState<FaturaClinica | null>(null);
  const [isPagamentoDialogOpen, setIsPagamentoDialogOpen] = useState(false);
  const [isLembreteDialogOpen, setIsLembreteDialogOpen] = useState(false);
  const [isBloqueioDialogOpen, setIsBloqueioDialogOpen] = useState(false);
  const [isDetalhesDialogOpen, setIsDetalhesDialogOpen] = useState(false);

  // Estados para formulários
  const [pagamentoData, setPagamentoData] = useState({
    valor: '',
    formaPagamento: FormaPagamentoClinica.PIX,
    dataPagamento: new Date().toISOString().split('T')[0],
    observacoes: ''
  });

  const [lembreteData, setLembreteData] = useState({
    tipo: TipoLembrete.PERSONALIZADO,
    mensagem: '',
    destinatario: ''
  });

  const [bloqueioData, setBloqueioData] = useState({
    nivelNovo: NivelBloqueio.NOTIFICACAO,
    motivo: ''
  });

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

  // Filtrar faturas
  const faturasFiltradas = faturas.filter(fatura => {
    const matchesSearch = fatura.numeroFatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fatura.clinica?.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'TODOS' || fatura.status === statusFilter;
    
    const matchesNivelBloqueio = nivelBloqueioFilter === 'TODOS' || fatura.nivelBloqueio === nivelBloqueioFilter;
    
    const matchesDate = !dateFilter || 
                       format(parseISO(fatura.dataVencimento), 'yyyy-MM-dd') === format(dateFilter, 'yyyy-MM-dd');
    
    return matchesSearch && matchesStatus && matchesNivelBloqueio && matchesDate;
  });

  // Handlers
  const handleRegistrarPagamento = async () => {
    if (!selectedFatura) return;

    try {
      await registrarPagamento.mutateAsync({
        faturaId: selectedFatura.id,
        valor: parseFloat(pagamentoData.valor),
        formaPagamento: pagamentoData.formaPagamento,
        dataPagamento: pagamentoData.dataPagamento,
        observacoes: pagamentoData.observacoes
      });

      setIsPagamentoDialogOpen(false);
      setPagamentoData({
        valor: '',
        formaPagamento: FormaPagamentoClinica.PIX,
        dataPagamento: new Date().toISOString().split('T')[0],
        observacoes: ''
      });
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
    }
  };

  const handleEnviarLembrete = async () => {
    if (!selectedFatura) return;

    try {
      await enviarLembrete.mutateAsync({
        faturaId: selectedFatura.id,
        tipo: lembreteData.tipo,
        mensagem: lembreteData.mensagem,
        destinatario: lembreteData.destinatario || selectedFatura.clinica?.nome || ''
      });

      setIsLembreteDialogOpen(false);
      setLembreteData({
        tipo: TipoLembrete.PERSONALIZADO,
        mensagem: '',
        destinatario: ''
      });
    } catch (error) {
      console.error('Erro ao enviar lembrete:', error);
    }
  };

  const handleAplicarBloqueio = async () => {
    if (!selectedFatura) return;

    try {
      await aplicarBloqueio.mutateAsync({
        faturaId: selectedFatura.id,
        nivelNovo: bloqueioData.nivelNovo,
        motivo: bloqueioData.motivo,
        aplicadoPor: 'SUPER_ADMIN' // TODO: Pegar do contexto de autenticação
      });

      setIsBloqueioDialogOpen(false);
      setBloqueioData({
        nivelNovo: NivelBloqueio.NOTIFICACAO,
        motivo: ''
      });
    } catch (error) {
      console.error('Erro ao aplicar bloqueio:', error);
    }
  };

  const handleMarcarComoPaga = async (fatura: FaturaClinica) => {
    try {
      await atualizarStatusFatura.mutateAsync({
        faturaId: fatura.id,
        status: StatusFatura.PAGO
      });
    } catch (error) {
      console.error('Erro ao marcar como paga:', error);
    }
  };

  // Verificar se a fatura está em atraso
  const isFaturaEmAtraso = (fatura: FaturaClinica) => {
    const diasAtraso = calcularDiasAtraso(fatura.dataVencimento);
    return fatura.status === StatusFatura.VENCIDO || diasAtraso > 0;
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filtros</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Limpar Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <Input
                placeholder="Número da fatura ou clínica..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos os Status</SelectItem>
                  {Object.values(StatusFatura).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nível de Bloqueio</Label>
              <Select value={nivelBloqueioFilter} onValueChange={setNivelBloqueioFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos os Níveis</SelectItem>
                  {Object.values(NivelBloqueio).map((nivel) => (
                    <SelectItem key={nivel} value={nivel}>
                      {nivel.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data de Vencimento</Label>
              <DatePicker date={dateFilter} onSelect={setDateFilter} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Faturas ({faturasFiltradas.length})</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fatura</TableHead>
                <TableHead>Clínica</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bloqueio</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faturasFiltradas.map((fatura) => {
                const diasAtraso = calcularDiasAtraso(fatura.dataVencimento);
                const emAtraso = isFaturaEmAtraso(fatura);
                
                return (
                  <TableRow key={fatura.id} className={emAtraso ? 'bg-red-50 dark:bg-red-950/20' : ''}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{fatura.numeroFatura}</div>
                        {emAtraso && (
                          <div className="text-xs text-red-600 dark:text-red-400">
                            {diasAtraso} dia{diasAtraso !== 1 ? 's' : ''} em atraso
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{fatura.clinica?.nome || 'Clínica não encontrada'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatarValor(fatura.valor)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(parseISO(fatura.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(fatura.status)}>
                        {fatura.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getNivelBloqueioColor(fatura.nivelBloqueio)}>
                        {fatura.nivelBloqueio.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            setSelectedFatura(fatura);
                            setIsDetalhesDialogOpen(true);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          {fatura.status !== StatusFatura.PAGO && (
                            <DropdownMenuItem onClick={() => {
                              setSelectedFatura(fatura);
                              setPagamentoData({
                                valor: fatura.valor.toString(),
                                formaPagamento: FormaPagamentoClinica.PIX,
                                dataPagamento: new Date().toISOString().split('T')[0],
                                observacoes: ''
                              });
                              setIsPagamentoDialogOpen(true);
                            }}>
                              <DollarSign className="h-4 w-4 mr-2" />
                              Registrar Pagamento
                            </DropdownMenuItem>
                          )}
                          {emAtraso && onEnviarLembrete && (
                            <DropdownMenuItem onClick={() => onEnviarLembrete(fatura)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Enviar Lembrete
                            </DropdownMenuItem>
                          )}
                          {fatura.status !== StatusFatura.PAGO && (
                            <DropdownMenuItem onClick={() => {
                              setSelectedFatura(fatura);
                              setIsBloqueioDialogOpen(true);
                            }}>
                              <Lock className="h-4 w-4 mr-2" />
                              Aplicar Bloqueio
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {fatura.status !== StatusFatura.PAGO && (
                            <DropdownMenuItem onClick={() => handleMarcarComoPaga(fatura)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Marcar como Paga
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Pagamento */}
      <Dialog open={isPagamentoDialogOpen} onOpenChange={setIsPagamentoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
            <DialogDescription>
              Registre o pagamento da fatura {selectedFatura?.numeroFatura}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={pagamentoData.valor}
                onChange={(e) => setPagamentoData({ ...pagamentoData, valor: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
              <Select 
                value={pagamentoData.formaPagamento} 
                onValueChange={(value) => setPagamentoData({ ...pagamentoData, formaPagamento: value as FormaPagamentoClinica })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FormaPagamentoClinica.PIX}>PIX</SelectItem>
                  <SelectItem value={FormaPagamentoClinica.BOLETO}>Boleto</SelectItem>
                  <SelectItem value={FormaPagamentoClinica.CARTAO_CREDITO}>Cartão de Crédito</SelectItem>
                  <SelectItem value={FormaPagamentoClinica.CARTAO_DEBITO}>Cartão de Débito</SelectItem>
                  <SelectItem value={FormaPagamentoClinica.TRANSFERENCIA}>Transferência</SelectItem>
                  <SelectItem value={FormaPagamentoClinica.DINHEIRO}>Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dataPagamento">Data do Pagamento</Label>
              <Input
                id="dataPagamento"
                type="date"
                value={pagamentoData.dataPagamento}
                onChange={(e) => setPagamentoData({ ...pagamentoData, dataPagamento: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={pagamentoData.observacoes}
                onChange={(e) => setPagamentoData({ ...pagamentoData, observacoes: e.target.value })}
                placeholder="Observações sobre o pagamento..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPagamentoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRegistrarPagamento} disabled={registrarPagamento.isPending}>
              {registrarPagamento.isPending ? 'Registrando...' : 'Registrar Pagamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Bloqueio */}
      <Dialog open={isBloqueioDialogOpen} onOpenChange={setIsBloqueioDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aplicar Bloqueio</DialogTitle>
            <DialogDescription>
              Aplique um nível de bloqueio à fatura {selectedFatura?.numeroFatura}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nivelBloqueio">Nível de Bloqueio</Label>
              <Select 
                value={bloqueioData.nivelNovo} 
                onValueChange={(value) => setBloqueioData({ ...bloqueioData, nivelNovo: value as NivelBloqueio })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NivelBloqueio.NOTIFICACAO}>Notificação</SelectItem>
                  <SelectItem value={NivelBloqueio.AVISO_TOPO}>Aviso no Topo</SelectItem>
                  <SelectItem value={NivelBloqueio.RESTRICAO_FUNCIONALIDADES}>Restrição de Funcionalidades</SelectItem>
                  <SelectItem value={NivelBloqueio.BLOQUEIO_TOTAL}>Bloqueio Total</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="motivo">Motivo</Label>
              <Textarea
                id="motivo"
                value={bloqueioData.motivo}
                onChange={(e) => setBloqueioData({ ...bloqueioData, motivo: e.target.value })}
                placeholder="Motivo do bloqueio..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBloqueioDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAplicarBloqueio} disabled={aplicarBloqueio.isPending}>
              {aplicarBloqueio.isPending ? 'Aplicando...' : 'Aplicar Bloqueio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Detalhes */}
      <Dialog open={isDetalhesDialogOpen} onOpenChange={setIsDetalhesDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Fatura</DialogTitle>
            <DialogDescription>
              Informações completas sobre a fatura {selectedFatura?.numeroFatura}
            </DialogDescription>
          </DialogHeader>
          
          {selectedFatura && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Número da Fatura</Label>
                  <p className="text-sm">{selectedFatura.numeroFatura}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Clínica</Label>
                  <p className="text-sm">{selectedFatura.clinica?.nome || 'Clínica não encontrada'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Valor</Label>
                  <p className="text-sm font-bold">{formatarValor(selectedFatura.valor)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Vencimento</Label>
                  <p className="text-sm">{format(parseISO(selectedFatura.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedFatura.status)}>
                    {selectedFatura.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nível de Bloqueio</Label>
                  <Badge className={getNivelBloqueioColor(selectedFatura.nivelBloqueio)}>
                    {selectedFatura.nivelBloqueio.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              {selectedFatura.observacoes && (
                <div>
                  <Label className="text-sm font-medium">Observações</Label>
                  <p className="text-sm text-muted-foreground">{selectedFatura.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 
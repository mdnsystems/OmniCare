import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Clock, 
  Lock, 
  MessageSquare,
  Settings,
  Save
} from 'lucide-react';
import { RegrasBloqueio } from '@/types/api';

interface ConfiguracoesBloqueioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfiguracoesBloqueioDialog({ open, onOpenChange }: ConfiguracoesBloqueioDialogProps) {
  const [configuracoes, setConfiguracoes] = useState<RegrasBloqueio>({
    diasNotificacao: 3,
    diasAvisoTopo: 5,
    diasRestricao: 7,
    diasBloqueioTotal: 10,
    ativo: true
  });

  const handleSave = async () => {
    try {
      // TODO: Implementar salvamento das configurações
      console.log('Salvando configurações:', configuracoes);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  const niveisBloqueio = [
    {
      nivel: 'Notificação',
      dias: configuracoes.diasNotificacao,
      descricao: 'Envia notificação por email para o administrador da clínica',
      icon: MessageSquare,
      color: 'text-yellow-600'
    },
    {
      nivel: 'Aviso no Topo',
      dias: configuracoes.diasAvisoTopo,
      descricao: 'Exibe aviso no topo da aplicação para todos os usuários da clínica',
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      nivel: 'Restrição de Funcionalidades',
      dias: configuracoes.diasRestricao,
      descricao: 'Bloqueia funcionalidades avançadas como relatórios e exportações',
      icon: Lock,
      color: 'text-red-600'
    },
    {
      nivel: 'Bloqueio Total',
      dias: configuracoes.diasBloqueioTotal,
      descricao: 'Bloqueia completamente o acesso à aplicação com tela de cobrança',
      icon: Lock,
      color: 'text-red-900'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Bloqueio
          </DialogTitle>
          <DialogDescription>
            Configure as regras automáticas de bloqueio baseadas nos dias de atraso
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Configuração Geral */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuração Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ativo" className="text-base font-medium">
                    Regras Automáticas Ativas
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Aplica automaticamente os níveis de bloqueio baseado nos dias de atraso
                  </p>
                </div>
                <Switch
                  id="ativo"
                  checked={configuracoes.ativo}
                  onCheckedChange={(checked) => setConfiguracoes({ ...configuracoes, ativo: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações por Nível */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configurações por Nível</h3>
            
            {niveisBloqueio.map((nivel, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <nivel.icon className={`h-5 w-5 ${nivel.color}`} />
                      <CardTitle className="text-base">{nivel.nivel}</CardTitle>
                      <Badge variant="outline">{nivel.dias} dias</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {nivel.descricao}
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`dias-${index}`}>
                      Dias de atraso para aplicar {nivel.nivel.toLowerCase()}
                    </Label>
                    <Input
                      id={`dias-${index}`}
                      type="number"
                      min="0"
                      value={nivel.dias}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        switch (index) {
                          case 0:
                            setConfiguracoes({ ...configuracoes, diasNotificacao: value });
                            break;
                          case 1:
                            setConfiguracoes({ ...configuracoes, diasAvisoTopo: value });
                            break;
                          case 2:
                            setConfiguracoes({ ...configuracoes, diasRestricao: value });
                            break;
                          case 3:
                            setConfiguracoes({ ...configuracoes, diasBloqueioTotal: value });
                            break;
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumo das Regras */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo das Regras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Notificação</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {configuracoes.diasNotificacao} dias de atraso
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Aviso no Topo</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {configuracoes.diasAvisoTopo} dias de atraso
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Restrição de Funcionalidades</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {configuracoes.diasRestricao} dias de atraso
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-100 dark:bg-red-950/40 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-red-900" />
                    <span className="text-sm font-medium">Bloqueio Total</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {configuracoes.diasBloqueioTotal} dias de atraso
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• As regras são aplicadas automaticamente todos os dias às 00:00</p>
                <p>• Os níveis de bloqueio são cumulativos (cada nível inclui os anteriores)</p>
                <p>• O bloqueio é removido automaticamente quando a fatura é paga</p>
                <p>• Administradores podem aplicar bloqueios manualmente a qualquer momento</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!configuracoes.ativo}
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
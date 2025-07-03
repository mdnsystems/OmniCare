import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useControleFinanceiro } from '@/hooks/useControleFinanceiro';
import { useClinica } from '@/contexts/ClinicaContext';

interface NovaFaturaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NovaFaturaDialog({ open, onOpenChange }: NovaFaturaDialogProps) {
  const { criarFatura, gerarNumeroFatura } = useControleFinanceiro();
  const { configuracao } = useClinica();

  const [formData, setFormData] = useState({
    numeroFatura: '',
    valor: '',
    dataVencimento: new Date(),
    observacoes: ''
  });

  // Gerar número de fatura quando o componente for montado
  useEffect(() => {
    const gerarNumero = async () => {
      try {
        const numero = await gerarNumeroFatura();
        setFormData(prev => ({ ...prev, numeroFatura: numero }));
      } catch (error) {
        console.error('Erro ao gerar número de fatura:', error);
      }
    };

    if (open) {
      gerarNumero();
    }
  }, [open, gerarNumeroFatura]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!configuracao?.tenantId) {
      console.error('Tenant ID não encontrado');
      return;
    }

    try {
      await criarFatura.mutateAsync({
        tenantId: configuracao.tenantId,
        numeroFatura: formData.numeroFatura,
        valor: parseFloat(formData.valor),
        dataVencimento: formData.dataVencimento.toISOString().split('T')[0],
        observacoes: formData.observacoes
      });

      // Reset form
      const novoNumero = await gerarNumeroFatura();
      setFormData({
        numeroFatura: novoNumero,
        valor: '',
        dataVencimento: new Date(),
        observacoes: ''
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao criar fatura:', error);
    }
  };

  const handleGerarNovoNumero = async () => {
    try {
      const novoNumero = await gerarNumeroFatura();
      setFormData(prev => ({
        ...prev,
        numeroFatura: novoNumero
      }));
    } catch (error) {
      console.error('Erro ao gerar novo número:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Fatura</DialogTitle>
          <DialogDescription>
            Crie uma nova fatura para uma clínica
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numeroFatura">Número da Fatura</Label>
            <div className="flex gap-2">
              <Input
                id="numeroFatura"
                value={formData.numeroFatura}
                onChange={(e) => setFormData({ ...formData, numeroFatura: e.target.value })}
                placeholder="Número da fatura"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGerarNovoNumero}
              >
                Gerar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              placeholder="0,00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Data de Vencimento</Label>
            <DatePicker 
              date={formData.dataVencimento} 
              onSelect={(date) => date && setFormData({ ...formData, dataVencimento: date })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações sobre a fatura..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={criarFatura.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={criarFatura.isPending || !formData.valor}
            >
              {criarFatura.isPending ? 'Criando...' : 'Criar Fatura'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
"use client"

import React, { useState, useEffect } from 'react';
import { QrCode, Copy, Download, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface QRCodePagamentoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fatura: {
    numeroFatura: string;
    valor: number;
    dataVencimento: string;
    clinica?: {
      nome: string;
    };
  } | null;
}

interface QRCodeData {
  qrCode: string;
  pixKey: string;
  pixKeyType: 'email' | 'cpf' | 'cnpj' | 'phone' | 'random';
  expiresAt: string;
}

export function QRCodePagamento({ open, onOpenChange, fatura }: QRCodePagamentoProps) {
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Gerar QR Code PIX (mock - substituir por integração real)
  const gerarQRCode = async () => {
    if (!fatura) return;

    setIsLoading(true);
    
    try {
      // Simular chamada para API de pagamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - substituir por integração real com gateway de pagamento
      const mockQRCodeData: QRCodeData = {
        qrCode: `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(7)}520400005303986540599.905802BR5913OmniCare Clinica6008Brasil62070503***6304${Math.random().toString(36).substring(7)}`,
        pixKey: 'suporte@omnicare.com.br',
        pixKeyType: 'email',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
      };
      
      setQrCodeData(mockQRCodeData);
    } catch (error) {
      toast.error('Erro ao gerar QR Code. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Copiar chave PIX
  const copiarChavePIX = async () => {
    if (!qrCodeData) return;
    
    try {
      await navigator.clipboard.writeText(qrCodeData.pixKey);
      setCopied(true);
      toast.success('Chave PIX copiada!');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar chave PIX');
    }
  };

  // Download QR Code
  const downloadQRCode = () => {
    if (!qrCodeData) return;
    
    // Criar canvas com QR Code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = 300;
      canvas.height = 300;
      
      // Desenhar QR Code (simplificado - usar biblioteca real como qrcode.js)
      ctx.fillStyle = '#000';
      ctx.fillRect(50, 50, 200, 200);
      
      // Download
      const link = document.createElement('a');
      link.download = `qrcode-${fatura?.numeroFatura}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('QR Code baixado!');
    }
  };

  // Formatar valor monetário
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Formatar data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obter tipo de chave PIX
  const getPixKeyTypeText = (type: string) => {
    switch (type) {
      case 'email':
        return 'E-mail';
      case 'cpf':
        return 'CPF';
      case 'cnpj':
        return 'CNPJ';
      case 'phone':
        return 'Telefone';
      case 'random':
        return 'Chave Aleatória';
      default:
        return type;
    }
  };

  useEffect(() => {
    if (open && fatura && !qrCodeData) {
      gerarQRCode();
    }
  }, [open, fatura]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code PIX para Pagamento
          </DialogTitle>
          <DialogDescription>
            Escaneie o QR Code ou copie a chave PIX para realizar o pagamento
          </DialogDescription>
        </DialogHeader>

        {fatura && (
          <div className="space-y-4">
            {/* Informações da Fatura */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Fatura #{fatura.numeroFatura}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Clínica:</span>
                  <span className="text-sm font-medium">{fatura.clinica?.nome || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatarValor(fatura.valor)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Vencimento:</span>
                  <span className="text-sm">{formatarData(fatura.dataVencimento)}</span>
                </div>
              </CardContent>
            </Card>

            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">QR Code PIX</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : qrCodeData ? (
                  <>
                    {/* QR Code Image */}
                    <div className="flex justify-center">
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                          <QrCode className="h-32 w-32 text-gray-400" />
                          <span className="text-xs text-gray-500 ml-2">QR Code</span>
                        </div>
                      </div>
                    </div>

                    {/* Chave PIX */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Chave PIX ({getPixKeyTypeText(qrCodeData.pixKeyType)}):
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copiarChavePIX}
                          className="h-6 px-2"
                        >
                          {copied ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div className="bg-muted p-2 rounded text-sm font-mono break-all">
                        {qrCodeData.pixKey}
                      </div>
                    </div>

                    {/* Validade */}
                    <div className="text-xs text-muted-foreground text-center">
                      Válido até: {formatarData(qrCodeData.expiresAt)}
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <Button
                        onClick={downloadQRCode}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                      <Button
                        onClick={() => onOpenChange(false)}
                        variant="secondary"
                        className="flex-1"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Fechar
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    Erro ao gerar QR Code
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instruções */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como Pagar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">1</Badge>
                  <span>Abra o app do seu banco</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">2</Badge>
                  <span>Escolha a opção PIX</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">3</Badge>
                  <span>Escaneie o QR Code ou cole a chave PIX</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">4</Badge>
                  <span>Confirme o pagamento</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 
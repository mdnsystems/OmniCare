import React, { useState, useEffect, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface RateLimitNotificationProps {
  isVisible: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryCount?: number;
  maxRetries?: number;
}

export function RateLimitNotification({
  isVisible,
  onRetry,
  onDismiss,
  retryCount = 0,
  maxRetries = 3
}: RateLimitNotificationProps) {
  const [showRetryButton, setShowRetryButton] = useState(false);

  useEffect(() => {
    if (isVisible && retryCount < maxRetries) {
      // Mostrar botão de retry após 3 segundos
      const timer = setTimeout(() => {
        setShowRetryButton(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, retryCount, maxRetries]);

  if (!isVisible) return null;

  return (
    <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      <div className="flex-1">
        <AlertTitle className="text-orange-800 dark:text-orange-200">
          Muitas requisições
        </AlertTitle>
        <AlertDescription className="text-orange-700 dark:text-orange-300">
          O servidor está recebendo muitas requisições. 
          {retryCount > 0 && (
            <span className="block mt-1">
              Tentativa {retryCount} de {maxRetries}
            </span>
          )}
          {retryCount >= maxRetries && (
            <span className="block mt-1 font-medium">
              Aguarde alguns minutos antes de tentar novamente.
            </span>
          )}
        </AlertDescription>
      </div>
      
      <div className="flex gap-2">
        {showRetryButton && retryCount < maxRetries && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Tentar Novamente
          </Button>
        )}
        
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-orange-600 hover:bg-orange-100 dark:text-orange-400 dark:hover:bg-orange-900"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </Alert>
  );
}

// Hook para gerenciar notificações de rate limiting
export function useRateLimitNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);

  const showNotification = useCallback(() => {
    setIsVisible(true);
    setRetryCount(prev => prev + 1);
  }, []);

  const hideNotification = useCallback(() => {
    setIsVisible(false);
  }, []);

  const resetRetryCount = useCallback(() => {
    setRetryCount(0);
  }, []);

  const handleRetry = useCallback(() => {
    if (retryCount < maxRetries) {
      // Aqui você pode implementar a lógica de retry
      console.log('🔄 Tentando novamente...');
    }
  }, [retryCount, maxRetries]);

  return {
    isVisible,
    retryCount,
    maxRetries,
    showNotification,
    hideNotification,
    resetRetryCount,
    handleRetry
  };
} 
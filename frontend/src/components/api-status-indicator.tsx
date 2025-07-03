import { useApiMonitor } from '@/hooks/useApiHealth';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApiStatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export function ApiStatusIndicator({ showDetails = false, className }: ApiStatusIndicatorProps) {
  const { isOnline, isLoading } = useApiMonitor();

  if (isLoading) {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "flex items-center gap-1 px-2 py-1 text-xs",
          "bg-yellow-50 text-yellow-700 border-yellow-200",
          "dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
          className
        )}
      >
        <AlertCircle className="h-3 w-3" />
        {showDetails ? 'Verificando conexão...' : 'Verificando'}
      </Badge>
    );
  }

  if (isOnline) {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "flex items-center gap-1 px-2 py-1 text-xs",
          "bg-green-50 text-green-700 border-green-200",
          "dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
          className
        )}
      >
        <Wifi className="h-3 w-3" />
        {showDetails ? 'Conectado' : 'Online'}
      </Badge>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center gap-1 px-2 py-1 text-xs",
        "bg-red-50 text-red-700 border-red-200",
        "dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        className
      )}
    >
      <WifiOff className="h-3 w-3" />
      {showDetails ? 'Desconectado' : 'Offline'}
    </Badge>
  );
}

export default ApiStatusIndicator; 
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  Trash2, 
  Eye,
  MapPin
} from 'lucide-react';
import { Paciente } from '@/types/api';

interface PacienteCardProps {
  paciente: Paciente;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  className?: string;
}

// Função utilitária para calcular idade
const calculateAge = (birthDate: string | Date): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Função utilitária para formatar telefone
const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

// Função utilitária para obter iniciais do nome
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Função utilitária para formatar data
const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('pt-BR');
};

export const OptimizedPacienteCard = React.memo<PacienteCardProps>(({
  paciente,
  onEdit,
  onDelete,
  onView,
  className,
}) => {
  // Memoizar dados formatados para evitar recálculos desnecessários
  const formattedData = React.useMemo(() => ({
    nome: paciente.nome,
    idade: calculateAge(paciente.dataNascimento),
    telefone: formatPhone(paciente.telefone),
    email: paciente.email,
    dataNascimento: formatDate(paciente.dataNascimento),
    iniciais: getInitials(paciente.nome),
    endereco: `${paciente.endereco}, ${paciente.numero}`,
    cidade: `${paciente.cidade} - ${paciente.estado}`,
  }), [
    paciente.nome,
    paciente.dataNascimento,
    paciente.telefone,
    paciente.email,
    paciente.endereco,
    paciente.numero,
    paciente.cidade,
    paciente.estado,
  ]);

  // Memoizar handlers para evitar recriações desnecessárias
  const handleEdit = React.useCallback(() => {
    onEdit(paciente.id);
  }, [paciente.id, onEdit]);

  const handleDelete = React.useCallback(() => {
    onDelete(paciente.id);
  }, [paciente.id, onDelete]);

  const handleView = React.useCallback(() => {
    onView(paciente.id);
  }, [paciente.id, onView]);

  return (
    <Card className={`hover:shadow-md transition-all duration-200 ${className || ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {formattedData.iniciais}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold">
                {formattedData.nome}
              </CardTitle>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formattedData.idade} anos</span>
                <Badge variant="secondary" className="text-xs">
                  {formattedData.dataNascimento}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Informações de contato */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{formattedData.email}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{formattedData.telefone}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{formattedData.endereco}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{formattedData.cidade}</span>
          </div>
        </div>

        {/* Convênio se existir */}
        {paciente.convenioNome && (
          <div className="pt-2 border-t">
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Convênio:</span>
              <span>{paciente.convenioNome}</span>
              {paciente.convenioPlano && (
                <Badge variant="outline" className="text-xs">
                  {paciente.convenioPlano}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Ações */}
        <div className="flex gap-2 pt-3 border-t">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleView}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleEdit}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={handleDelete}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedPacienteCard.displayName = 'OptimizedPacienteCard'; 
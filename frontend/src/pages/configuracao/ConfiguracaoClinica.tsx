import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Settings, 
  Palette, 
  Building2, 
  Users, 
  FileText, 
  Calendar, 
  DollarSign, 
  BarChart2,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import { useClinica } from "@/contexts/ClinicaContext";
import { TipoClinica, ConfiguracaoClinica as ConfiguracaoClinicaType } from "@/types/api";

export function ConfiguracaoClinica() {
  const { configuracao, setConfiguracao } = useClinica();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ConfiguracaoClinicaType>>(
    configuracao || {
      nome: "OmniCare",
      tipo: TipoClinica.NUTRICIONAL,
      corPrimaria: "#059669",
      corSecundaria: "#047857",
      tema: 'auto',
      configuracoes: {
        usarAnamnese: true,
        usarProntuario: true,
        usarAgendamento: true,
        usarFinanceiro: true,
        usarRelatorios: true,
        camposPersonalizados: [],
        modulosAtivos: ['anamnese', 'prontuario', 'agendamento', 'financeiro', 'relatorios']
      }
    }
  );

  const tiposClinica = [
    { value: TipoClinica.MEDICA, label: "Clínica Médica", icon: "🏥" },
    { value: TipoClinica.NUTRICIONAL, label: "Clínica Nutricional", icon: "🥗" },
    { value: TipoClinica.PSICOLOGICA, label: "Clínica Psicológica", icon: "🧠" },
    { value: TipoClinica.FISIOTERAPICA, label: "Clínica Fisioterapêutica", icon: "💪" },
    { value: TipoClinica.ODONTOLOGICA, label: "Clínica Odontológica", icon: "🦷" },
    { value: TipoClinica.ESTETICA, label: "Clínica Estética", icon: "✨" },
    { value: TipoClinica.VETERINARIA, label: "Clínica Veterinária", icon: "🐾" },
    { value: TipoClinica.EDUCACIONAL, label: "Centro Educacional", icon: "🎓" },
    { value: TipoClinica.CORPORATIVA, label: "Centro Corporativo", icon: "🏢" },
    { value: TipoClinica.PERSONALIZADA, label: "Sistema Personalizado", icon: "⚙️" },
  ];

  const modulos = [
    { id: 'anamnese', label: 'Avaliações/Anamnese', icon: FileText, description: 'Sistema de avaliações personalizadas' },
    { id: 'prontuario', label: 'Prontuários', icon: FileText, description: 'Gestão de prontuários e documentos' },
    { id: 'agendamento', label: 'Agendamentos', icon: Calendar, description: 'Sistema de agendamento de consultas' },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign, description: 'Controle financeiro e faturamento' },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart2, description: 'Relatórios e análises' },
  ];

  const handleSave = () => {
    if (formData) {
      const novaConfiguracao: ConfiguracaoClinicaType = {
        id: configuracao?.id || "default",
        nome: formData.nome || "OmniCare",
        tipo: formData.tipo || TipoClinica.NUTRICIONAL,
        corPrimaria: formData.corPrimaria || "#059669",
        corSecundaria: formData.corSecundaria || "#047857",
        tema: formData.tema || 'auto',
        configuracoes: {
          usarAnamnese: formData.configuracoes?.usarAnamnese ?? true,
          usarProntuario: formData.configuracoes?.usarProntuario ?? true,
          usarAgendamento: formData.configuracoes?.usarAgendamento ?? true,
          usarFinanceiro: formData.configuracoes?.usarFinanceiro ?? true,
          usarRelatorios: formData.configuracoes?.usarRelatorios ?? true,
          camposPersonalizados: formData.configuracoes?.camposPersonalizados || [],
          modulosAtivos: formData.configuracoes?.modulosAtivos || ['anamnese', 'prontuario', 'agendamento', 'financeiro', 'relatorios']
        },
        createdAt: configuracao?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setConfiguracao(novaConfiguracao);
      setIsEditing(false);
      toast.success("Configuração salva com sucesso!");
    }
  };

  const handleCancel = () => {
    setFormData(configuracao || {
      nome: "OmniCare",
      tipo: TipoClinica.NUTRICIONAL,
      corPrimaria: "#059669",
      corSecundaria: "#047857",
      tema: 'auto',
      configuracoes: {
        usarAnamnese: true,
        usarProntuario: true,
        usarAgendamento: true,
        usarFinanceiro: true,
        usarRelatorios: true,
        camposPersonalizados: [],
        modulosAtivos: ['anamnese', 'prontuario', 'agendamento', 'financeiro', 'relatorios']
      }
    });
    setIsEditing(false);
  };

  const toggleModulo = (moduloId: string) => {
    if (!formData.configuracoes) return;

    const modulosAtivos = formData.configuracoes.modulosAtivos || [];
    const novosModulos = modulosAtivos.includes(moduloId)
      ? modulosAtivos.filter(id => id !== moduloId)
      : [...modulosAtivos, moduloId];

    setFormData({
      ...formData,
      configuracoes: {
        ...formData.configuracoes,
        modulosAtivos: novosModulos
      }
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configuração da Clínica</h1>
            <p className="text-muted-foreground">
              Personalize o sistema para sua especialidade
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
            <CardDescription>
              Dados principais da clínica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Clínica</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                disabled={!isEditing}
                placeholder="Digite o nome da clínica"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Clínica</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: TipoClinica) => setFormData({ ...formData, tipo: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de clínica" />
                </SelectTrigger>
                <SelectContent>
                  {tiposClinica.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      <span className="flex items-center gap-2">
                        <span>{tipo.icon}</span>
                        {tipo.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tema">Tema</Label>
              <Select
                value={formData.tema}
                onValueChange={(value: 'light' | 'dark' | 'auto') => setFormData({ ...formData, tema: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Cores da Clínica
            </CardTitle>
            <CardDescription>
              Personalize as cores do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="corPrimaria">Cor Primária</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="corPrimaria"
                  type="color"
                  value={formData.corPrimaria}
                  onChange={(e) => setFormData({ ...formData, corPrimaria: e.target.value })}
                  disabled={!isEditing}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.corPrimaria}
                  onChange={(e) => setFormData({ ...formData, corPrimaria: e.target.value })}
                  disabled={!isEditing}
                  placeholder="#059669"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="corSecundaria">Cor Secundária</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="corSecundaria"
                  type="color"
                  value={formData.corSecundaria}
                  onChange={(e) => setFormData({ ...formData, corSecundaria: e.target.value })}
                  disabled={!isEditing}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.corSecundaria}
                  onChange={(e) => setFormData({ ...formData, corSecundaria: e.target.value })}
                  disabled={!isEditing}
                  placeholder="#047857"
                />
              </div>
            </div>

            {/* Preview das cores */}
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: formData.corPrimaria }}
                />
                <span className="text-sm">Primária</span>
                <div 
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: formData.corSecundaria }}
                />
                <span className="text-sm">Secundária</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Módulos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Módulos Ativos
          </CardTitle>
          <CardDescription>
            Selecione quais módulos estarão disponíveis no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modulos.map((modulo) => {
              const isActive = formData.configuracoes?.modulosAtivos?.includes(modulo.id) ?? false;
              const ModuloIcon = modulo.icon;
              
              return (
                <div
                  key={modulo.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-muted-foreground/50'
                  } ${!isEditing ? 'cursor-default' : ''}`}
                  onClick={() => isEditing && toggleModulo(modulo.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ModuloIcon className="h-5 w-5" />
                      <span className="font-medium">{modulo.label}</span>
                    </div>
                    {isEditing && (
                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <Eye className="h-4 w-4 text-primary" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{modulo.description}</p>
                  <div className="mt-2">
                    <Badge variant={isActive ? "default" : "secondary"}>
                      {isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Versão:</span>
              <p className="font-medium">2.0.0</p>
            </div>
            <div>
              <span className="text-muted-foreground">Última Atualização:</span>
              <p className="font-medium">{configuracao?.updatedAt ? new Date(configuracao.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">ID da Configuração:</span>
              <p className="font-medium">{configuracao?.id || 'default'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
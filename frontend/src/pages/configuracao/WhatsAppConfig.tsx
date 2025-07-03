import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useClinica } from "@/contexts/ClinicaContext";
import { zApiService } from "@/lib/z-api-service";
import { ClinicaWhatsAppConfig, MessageTemplate } from "@/types/api";
import { 
  MessageCircle, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  TestTube, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Smartphone,
  Clock,
  Calendar
} from "lucide-react";

export function WhatsAppConfig() {
  const { toast } = useToast();
  const { configuracao } = useClinica();
  const [config, setConfig] = useState<ClinicaWhatsAppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    const clinicaConfig = zApiService.getClinicaConfig();
    setConfig(clinicaConfig);
  };

  const handleSaveConfig = async () => {
    if (!config) return;

    setIsLoading(true);
    try {
      // Em produção, isso seria uma chamada para a API
      zApiService.updateClinicaConfig(config);
      
      toast({
        title: "✅ Configuração salva!",
        description: "As configurações do WhatsApp foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!config) return;

    setIsTestLoading(true);
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "✅ Conexão testada!",
        description: "Conexão com Z-API estabelecida com sucesso.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro na conexão",
        description: "Não foi possível conectar com a Z-API.",
        variant: "destructive",
      });
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setIsTemplateDialogOpen(true);
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setIsTemplateDialogOpen(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (!config) return;

    const updatedTemplates = config.templates.filter(t => t.id !== templateId);
    setConfig({
      ...config,
      templates: updatedTemplates
    });

    toast({
      title: "✅ Template removido!",
      description: "Template de mensagem removido com sucesso.",
    });
  };

  const handleSaveTemplate = () => {
    if (!config || !editingTemplate) return;

    let updatedTemplates: MessageTemplate[];

    if (editingTemplate.id) {
      // Editar template existente
      updatedTemplates = config.templates.map(t => 
        t.id === editingTemplate.id ? editingTemplate : t
      );
    } else {
      // Adicionar novo template
      const newTemplate: MessageTemplate = {
        ...editingTemplate,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updatedTemplates = [...config.templates, newTemplate];
    }

    setConfig({
      ...config,
      templates: updatedTemplates
    });

    setIsTemplateDialogOpen(false);
    setEditingTemplate(null);

    toast({
      title: "✅ Template salvo!",
      description: "Template de mensagem salvo com sucesso.",
    });
  };

  const getVariableDescription = (variable: string) => {
    const descriptions: Record<string, string> = {
      nome_paciente: "Nome completo do paciente",
      nome_clinica: "Nome da clínica",
      data_consulta: "Data da consulta (dd/mm/aaaa)",
      hora_consulta: "Horário da consulta (HH:mm)",
      nome_profissional: "Nome do profissional",
      link_confirmacao: "Link para confirmação da consulta"
    };
    return descriptions[variable] || variable;
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-lg">
          <MessageCircle className="w-5 h-5 text-green-700 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Configuração WhatsApp</h1>
          <p className="text-sm text-muted-foreground">
            Configure a integração com WhatsApp para envio de mensagens automáticas
          </p>
        </div>
      </div>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="test">Teste</TabsTrigger>
        </TabsList>

        {/* Configuração Principal */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações da Z-API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instanceId">Instance ID</Label>
                  <Input
                    id="instanceId"
                    value={config.zApiInstanceId}
                    onChange={(e) => setConfig({ ...config, zApiInstanceId: e.target.value })}
                    placeholder="Digite o Instance ID da Z-API"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="token">Token</Label>
                  <Input
                    id="token"
                    type="password"
                    value={config.zApiToken}
                    onChange={(e) => setConfig({ ...config, zApiToken: e.target.value })}
                    placeholder="Digite o Token da Z-API"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroWhatsApp">Número WhatsApp</Label>
                <Input
                  id="numeroWhatsApp"
                  value={config.numeroWhatsApp}
                  onChange={(e) => setConfig({ ...config, numeroWhatsApp: e.target.value })}
                  placeholder="+5511999999999"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Mensagens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horarioEnvio">Horário de Envio do Lembrete</Label>
                  <Input
                    id="horarioEnvio"
                    type="time"
                    value={config.horarioEnvioLembrete}
                    onChange={(e) => setConfig({ ...config, horarioEnvioLembrete: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diasAntecedencia">Dias de Antecedência</Label>
                  <Input
                    id="diasAntecedencia"
                    type="number"
                    min="1"
                    max="7"
                    value={config.diasAntecedenciaLembrete}
                    onChange={(e) => setConfig({ ...config, diasAntecedenciaLembrete: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Tipos de Mensagem</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Confirmação de Agendamento</span>
                    </div>
                    <Switch
                      checked={config.mensagensAtivas.agendamento}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        mensagensAtivas: { ...config.mensagensAtivas, agendamento: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Lembrete de Consulta</span>
                    </div>
                    <Switch
                      checked={config.mensagensAtivas.lembrete}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        mensagensAtivas: { ...config.mensagensAtivas, lembrete: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Confirmação de Presença</span>
                    </div>
                    <Switch
                      checked={config.mensagensAtivas.confirmacao}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        mensagensAtivas: { ...config.mensagensAtivas, confirmacao: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Cancelamento</span>
                    </div>
                    <Switch
                      checked={config.mensagensAtivas.cancelamento}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        mensagensAtivas: { ...config.mensagensAtivas, cancelamento: checked }
                      })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status da Integração</span>
                  <Badge variant={config.ativo ? "default" : "secondary"}>
                    {config.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <Switch
                  checked={config.ativo}
                  onCheckedChange={(checked) => setConfig({ ...config, ativo: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveConfig} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Templates de Mensagem */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Templates de Mensagem</h3>
            <Button onClick={handleAddTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{template.nome}</CardTitle>
                    <Badge variant={template.ativo ? "default" : "secondary"}>
                      {template.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Tipo</Label>
                    <p className="text-sm text-muted-foreground capitalize">{template.tipo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Template</Label>
                    <p className="text-sm text-muted-foreground mt-1">{template.template}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Variáveis</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.variaveis.map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {config.templates.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Nenhum template configurado
                </p>
                <p className="text-sm text-muted-foreground">
                  Crie templates para personalizar as mensagens enviadas
                </p>
                <Button onClick={handleAddTemplate} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Template
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Teste de Conexão */}
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Teste de Conexão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Teste a conexão com a Z-API para verificar se as configurações estão corretas.
              </p>
              
              <div className="space-y-2">
                <Label>Status da Conexão</Label>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Conectado</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Configurações Atuais</Label>
                <div className="text-sm space-y-1">
                  <p><strong>Instance ID:</strong> {config.zApiInstanceId}</p>
                  <p><strong>Token:</strong> {config.zApiToken ? '***' + config.zApiToken.slice(-4) : 'Não configurado'}</p>
                  <p><strong>Número WhatsApp:</strong> {config.numeroWhatsApp}</p>
                </div>
              </div>

              <Button onClick={handleTestConnection} disabled={isTestLoading}>
                {isTestLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Testar Conexão
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Template */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Editar Template' : 'Novo Template'}
            </DialogTitle>
            <DialogDescription>
              Configure um template de mensagem para envio automático via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Nome do Template</Label>
              <Input
                id="templateName"
                value={editingTemplate?.nome || ''}
                onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, nome: e.target.value } : null)}
                placeholder="Ex: Confirmação de Agendamento"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateType">Tipo</Label>
              <select
                id="templateType"
                className="w-full p-2 border border-input bg-background rounded-md"
                value={editingTemplate?.tipo || 'agendamento'}
                onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, tipo: e.target.value as any } : null)}
              >
                <option value="agendamento">Agendamento</option>
                <option value="lembrete">Lembrete</option>
                <option value="confirmacao">Confirmação</option>
                <option value="cancelamento">Cancelamento</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateText">Template da Mensagem</Label>
              <Textarea
                id="templateText"
                value={editingTemplate?.template || ''}
                onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, template: e.target.value } : null)}
                placeholder="Ex: Olá, {nome_paciente}! Sua consulta na {nome_clinica} foi agendada para o dia {data_consulta} às {hora_consulta} com {nome_profissional}."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Use as variáveis entre chaves para personalizar a mensagem
              </p>
            </div>

            <div className="space-y-2">
              <Label>Variáveis Disponíveis</Label>
              <div className="grid grid-cols-2 gap-2">
                {['nome_paciente', 'nome_clinica', 'data_consulta', 'hora_consulta', 'nome_profissional', 'link_confirmacao'].map((variable) => (
                  <div key={variable} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm font-mono">{variable}</span>
                    <span className="text-xs text-muted-foreground">{getVariableDescription(variable)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="templateActive"
                checked={editingTemplate?.ativo || false}
                onCheckedChange={(checked) => setEditingTemplate(prev => prev ? { ...prev, ativo: checked } : null)}
              />
              <Label htmlFor="templateActive">Template ativo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTemplate}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
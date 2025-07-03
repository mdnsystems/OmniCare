import { UserProfile } from "@/components/user-profile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ExemploUserProfile() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Exemplo - Perfil do Usuário</h1>
        <p className="text-muted-foreground">
          Demonstração das diferentes variantes do componente UserProfile
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Variant Default */}
        <Card>
          <CardHeader>
            <CardTitle>Variante Padrão</CardTitle>
            <CardDescription>
              Exibe avatar, nome, especialidade, email e botão de logout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfile variant="default" />
          </CardContent>
        </Card>

        {/* Variant Compact */}
        <Card>
          <CardHeader>
            <CardTitle>Variante Compacta</CardTitle>
            <CardDescription>
              Versão mais compacta com avatar menor e informações essenciais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfile variant="compact" />
          </CardContent>
        </Card>

        {/* Variant Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Variante Sidebar</CardTitle>
            <CardDescription>
              Otimizada para uso em sidebars com hover effects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfile variant="sidebar" />
          </CardContent>
        </Card>

        {/* Sem Logout */}
        <Card>
          <CardHeader>
            <CardTitle>Sem Botão de Logout</CardTitle>
            <CardDescription>
              Apenas exibe as informações do usuário sem o botão de sair
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfile variant="default" showLogout={false} />
          </CardContent>
        </Card>

        {/* Compact Sem Logout */}
        <Card>
          <CardHeader>
            <CardTitle>Compacta Sem Logout</CardTitle>
            <CardDescription>
              Versão compacta sem o botão de logout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfile variant="compact" showLogout={false} />
          </CardContent>
        </Card>

        {/* Sidebar Sem Logout */}
        <Card>
          <CardHeader>
            <CardTitle>Sidebar Sem Logout</CardTitle>
            <CardDescription>
              Variante sidebar sem o botão de logout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfile variant="sidebar" showLogout={false} />
          </CardContent>
        </Card>
      </div>

      {/* Seção de Comportamento Collapsed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Comportamento na Sidebar Collapsed
            <Badge variant="secondary">Nova Funcionalidade</Badge>
          </CardTitle>
          <CardDescription>
            Quando a sidebar está collapsed, a variante "sidebar" mostra apenas o avatar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-sm">Sidebar Expandida:</h4>
                <div className="border rounded-lg p-4 bg-muted/20">
                  <UserProfile variant="sidebar" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-sm">Sidebar Collapsed:</h4>
                <div className="border rounded-lg p-4 bg-muted/20 w-16">
                  <UserProfile variant="sidebar" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Simulação: Container com largura reduzida para demonstrar o comportamento collapsed
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Como Funciona:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• O componente detecta automaticamente o estado da sidebar usando <code>useSidebar()</code></li>
                <li>• Quando <code>state === "collapsed"</code>, mostra apenas o avatar centralizado</li>
                <li>• O avatar reduz para 8x8 pixels para economizar espaço</li>
                <li>• Mantém a funcionalidade de fallback para iniciais</li>
                <li>• Funciona apenas com a variante <code>sidebar</code></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como Usar</CardTitle>
          <CardDescription>
            Exemplos de código para implementar o componente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Importação:</h4>
              <pre className="bg-muted p-3 rounded-md text-sm">
                {`import { UserProfile } from "@/components/user-profile"`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Uso Básico:</h4>
              <pre className="bg-muted p-3 rounded-md text-sm">
                {`// Variante padrão
<UserProfile />

// Variante compacta
<UserProfile variant="compact" />

// Variante sidebar (com detecção automática de collapsed)
<UserProfile variant="sidebar" />

// Sem botão de logout
<UserProfile showLogout={false} />

// Com classe personalizada
<UserProfile className="my-custom-class" />`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Props Disponíveis:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><code>variant</code>: 'default' | 'compact' | 'sidebar' (padrão: 'default')</li>
                <li><code>showLogout</code>: boolean (padrão: true)</li>
                <li><code>className</code>: string (classes CSS adicionais)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Detecção de Sidebar Collapsed:</h4>
              <p className="text-sm text-muted-foreground">
                O componente automaticamente detecta quando a sidebar está collapsed usando o hook <code>useSidebar()</code>. 
                Quando <code>state === "collapsed"</code> e a variante é <code>sidebar</code>, ele mostra apenas o avatar centralizado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
"use client"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/toggle-theme"
import { NotificacoesLembretes } from "@/components/notificacoes-lembretes"
import { useLocation, Link } from "react-router-dom"
import React, { useEffect } from "react"
import { useBloqueioClinica } from "@/hooks/useBloqueioClinica"
import { useAuth } from "@/contexts/AuthContext"
import { TelaBloqueioTotal } from "@/components/admin/tela-bloqueio-total"
import { RestricoesFuncionalidades } from "@/components/admin/restricoes-funcionalidades"
import { NivelBloqueio } from "@/types/api"
import { clearModalCache } from "@/utils/clearCache"

function formatBreadcrumb(path: string) {
  const segments = path.split('/').filter(Boolean)
  return segments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    href: '/' + segments.slice(0, index + 1).join('/'),
    isLast: index === segments.length - 1
  }))
}

interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const location = useLocation()
  const { user } = useAuth()
  const { 
    faturasEmAtraso, 
    faturasComBloqueioTotal, 
    faturasComRestricao,
    totalEmAtraso,
    nivelBloqueioAtual,
    isLoading,
    faturas,
    deveMostrarBloqueioTotal,
    deveAplicarRestricoes
  } = useBloqueioClinica()

  // Limpar cache do modal antigo ao montar o componente
  useEffect(() => {
    console.log('🧹 Limpando cache do modal antigo...')
    clearModalCache()
  }, [])

  // Logs para debug
  useEffect(() => {
    console.log('🔍 Status do bloqueio:', {
      isLoading,
      nivelBloqueioAtual,
      faturasComBloqueioTotal: faturasComBloqueioTotal.length,
      faturasEmAtraso: faturasEmAtraso.length,
      totalEmAtraso
    })
  }, [isLoading, nivelBloqueioAtual, faturasComBloqueioTotal, faturasEmAtraso, totalEmAtraso])

  console.log('🎯 Deve mostrar bloqueio total:', deveMostrarBloqueioTotal)

  // Memoizar os breadcrumbs para evitar recálculos desnecessários
  const breadcrumbs = React.useMemo(() => {
    return formatBreadcrumb(location.pathname)
  }, [location.pathname])

  // Memoizar o header para evitar re-renderizações desnecessárias
  const headerContent = React.useMemo(() => (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-muted border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
      <div className="flex items-center gap-2 px-4 justify-between w-full">
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
          <SidebarTrigger className="-ml-1 shrink-0" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4 shrink-0"
          />
          <div className="flex-1">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={item.href}>
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <Link to={item.href} className="text-sm font-medium hover:underline">
                          {item.label}
                        </Link>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <NotificacoesLembretes />
          <ThemeToggle className="shrink-0" />
        </div>
      </div>
    </header>
  ), [breadcrumbs])

  // Funções para lidar com ações de bloqueio
  const handlePagarFatura = (fatura: any) => {
    // TODO: Implementar redirecionamento para página de pagamento
    console.log('Redirecionando para pagamento da fatura:', fatura.numeroFatura)
  }

  const handleFalarSuporte = () => {
    // TODO: Implementar contato com suporte
    console.log('Abrindo contato com suporte')
  }

  // Se deve mostrar bloqueio total, renderizar tela de bloqueio
  if (deveMostrarBloqueioTotal && faturasComBloqueioTotal.length > 0) {
    console.log('🚨 Renderizando tela de bloqueio total')
    return (
      <TelaBloqueioTotal 
        fatura={faturasComBloqueioTotal[0]}
        onPagar={(formaPagamento) => {
          console.log('Pagamento solicitado:', formaPagamento)
        }}
        onFalarSuporte={() => {
          console.log('Suporte solicitado')
        }}
      />
    )
  }

  console.log('✅ Renderizando layout normal')

  // Conteúdo principal com possíveis restrições
  const conteudoPrincipal = (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
      {children}
    </div>
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {headerContent}
        
        {/* Aplicar restrições de funcionalidades se necessário */}
        {deveAplicarRestricoes ? (
          <RestricoesFuncionalidades
            faturas={faturas}
            onPagar={handlePagarFatura}
            onFalarSuporte={handleFalarSuporte}
          >
            {conteudoPrincipal}
          </RestricoesFuncionalidades>
        ) : (
          conteudoPrincipal
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}

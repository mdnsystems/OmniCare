import * as React from "react"
import {
  LayoutDashboard, Users, UserCheck, Calendar, FileText, DollarSign, BarChart2, ClipboardList, Settings,
  FileText as Template, GitBranch as Workflow, Shield, MessageSquare
} from "lucide-react"

import { NavMain } from "@/components/nav-main" 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import { UserProfile } from "@/components/user-profile"
import { useClinica } from "@/contexts/ClinicaContext"
import { useAuth } from "@/contexts/AuthContext"
import { useChatNotifications } from "@/hooks/useChatNotifications"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isModuleActive, getNomenclatura } = useClinica()
  const { user } = useAuth()
  const { notification } = useChatNotifications()

  // Memoizar as nomenclaturas para evitar recálculos desnecessários
  const nomenclaturas = React.useMemo(() => ({
    pacientes: getNomenclatura('pacientes'),
    paciente: getNomenclatura('paciente'),
    profissionais: getNomenclatura('profissionais'),
    profissional: getNomenclatura('profissional'),
    agendamento: getNomenclatura('agendamento'),
    prontuario: getNomenclatura('prontuario'),
    prontuarios: getNomenclatura('prontuarios'),
    consultas: getNomenclatura('consultas'),
    anamnese: getNomenclatura('anamnese'),
    avaliacoes: getNomenclatura('avaliacoes'),
    avaliacao: getNomenclatura('avaliacao')
  }), [getNomenclatura])

  // Função para obter itens do menu baseados na role do usuário
  const getMenuItemsByRole = React.useCallback((role: string) => {
    const baseItems = []

    switch (role) {
      case 'SUPER_ADMIN':
        // Dashboard macro do super admin
        baseItems.push({
          title: "Dashboard",
          url: "/super-admin",
          icon: LayoutDashboard,
          items: [
            { title: "Visão Geral", url: "/super-admin" },
          ],
        })

        // Gestão de Clínicas
        baseItems.push({
          title: "Gestão de Clínicas",
          url: "/super-admin/clinicas",
          icon: Users,
          items: [
            { title: "Lista de Clínicas", url: "/super-admin/clinicas" },
          ],
        })

        // Relatórios Macro
        baseItems.push({
          title: "Relatórios Macro",
          url: "/super-admin/relatorios",
          icon: BarChart2,
          items: [
            { title: "Relatórios Gerais", url: "/super-admin/relatorios" },
            { title: "Usuários e Permissões", url: "/super-admin/relatorios/usuarios" },
            { title: "Atividades", url: "/super-admin/relatorios/atividades" },
            { title: "Gestão de Clínicas", url: "/super-admin/relatorios/gestao-clinicas" },
            { title: "Chat", url: "/super-admin/relatorios/chat" },
          ],
        })

        // Configuração (opcional, se houver configurações globais relevantes)
        baseItems.push({
          title: "Configuração",
          url: "/configuracao",
          icon: Settings,
          items: [
            { title: "Configurações do Sistema", url: "/configuracao" },
          ],
        })
        break

      case 'ADMIN':
        // Dashboard
        baseItems.push({
          title: "Dashboard",
          url: "/dashboard/administrativo",
          icon: LayoutDashboard,
          items: [
            { title: "Visão Geral", url: "/dashboard/administrativo" },
            { title: "Atividades", url: "/dashboard/atividades" },
          ],
        })

        // Pacientes
        baseItems.push({
          title: nomenclaturas.pacientes,
          url: "/pacientes",
          icon: Users,
          items: [
            { title: `Lista de ${nomenclaturas.pacientes}`, url: "/pacientes" },
            { title: `Novo ${nomenclaturas.paciente}`, url: "/pacientes/novo" },
          ],
        })

        // Profissionais
        baseItems.push({
          title: nomenclaturas.profissionais,
          url: "/profissionais",
          icon: UserCheck,
          items: [
            { title: `Lista de ${nomenclaturas.profissionais}`, url: "/profissionais" },
            { title: `Novo ${nomenclaturas.profissional}`, url: "/profissionais/novo" },
            { title: "Especialidades", url: "/profissionais/especialidades" },
          ],
        })

        // Agendamentos
        if (isModuleActive('agendamento')) {
          baseItems.push({
            title: nomenclaturas.agendamento,
            url: "/agendamentos",
            icon: Calendar,
            items: [
              { title: "Calendário", url: "/agendamentos" },
              { title: `Novo ${nomenclaturas.agendamento}`, url: "/agendamentos/novo" },
              { title: "Confirmações", url: "/agendamentos/confirmacoes" },
            ],
          })
        }

        // Prontuários
        if (isModuleActive('prontuario')) {
          baseItems.push({
            title: nomenclaturas.prontuario,
            url: "/prontuarios",
            icon: FileText,
            items: [
              { title: "Visão Geral", url: "/prontuarios" },
              { title: `${nomenclaturas.consultas} do Dia`, url: "/prontuarios/hoje" },
              { title: `Lista de ${nomenclaturas.prontuarios}`, url: "/prontuarios/lista" },
              { title: "Modelos", url: "/prontuarios/modelos" },
            ],
          })
        }

        // Anamnese
        if (isModuleActive('anamnese')) {
          baseItems.push({
            title: nomenclaturas.anamnese,
            url: "/anamnese",
            icon: ClipboardList,
            items: [
              { title: `Lista de ${nomenclaturas.avaliacoes}`, url: "/anamnese" },
              { title: `Nova ${nomenclaturas.avaliacao}`, url: "/anamnese/nova" },
            ],
          })
        }

        // Templates
        if (isModuleActive('templates')) {
          baseItems.push({
            title: "Templates",
            url: "/templates",
            icon: Template,
            items: [
              { title: "Templates de Formulários", url: "/templates/formularios" },
              { title: "Editor de Templates", url: "/templates/editor" },
              { title: "Campos Dinâmicos", url: "/templates/campos" },
            ],
          })
        }

        // Fluxos
        if (isModuleActive('fluxos')) {
          baseItems.push({
            title: "Fluxos",
            url: "/fluxos",
            icon: Workflow,
            items: [
              { title: "Fluxos de Trabalho", url: "/fluxos" },
              { title: "Editor de Fluxos", url: "/fluxos/editor" },
              { title: "Executar Fluxo", url: "/fluxos/executar" },
            ],
          })
        }

        // Financeiro
        if (isModuleActive('financeiro')) {
          baseItems.push({
            title: "Financeiro",
            url: "/financeiro",
            icon: DollarSign,
            items: [
              { title: "Faturamento", url: "/financeiro/faturamento" },
              { title: "Pagamentos", url: "/financeiro/pagamentos" },
              { title: "Relatórios", url: "/financeiro/relatorios" },
            ],
          })
        }

        // Relatórios
        if (isModuleActive('relatorios')) {
          baseItems.push({
            title: "Relatórios",
            url: "/relatorios",
            icon: BarChart2,
            items: [
              { title: nomenclaturas.consultas, url: "/relatorios/consultas" },
              { title: "Receitas", url: "/relatorios/receitas" },
              { title: "Desempenho", url: "/relatorios/desempenho" },
            ],
          })
        }

        // Configuração
        baseItems.push({
          title: "Configuração",
          url: "/configuracao",
          icon: Settings,
          items: [
            { title: "Configuração da Clínica", url: "/configuracao" },
            { title: "Personalização", url: "/configuracao/personalizacao" },
            { title: "WhatsApp", url: "/configuracao/whatsapp" },
            { title: "Demonstração Multitenant", url: "/configuracao/demonstracao" },
          ],
        })

        // Chat com notificação
        baseItems.push({
          title: "Chat",
          url: "/chat",
          icon: MessageSquare,
          badge: notification.hasUnreadMessages ? notification.unreadCount : undefined,
          items: [
            { title: "Conversas", url: "/chat" }
          ],
        })
        break

      case 'PROFISSIONAL':
        // Dashboard
        baseItems.push({
          title: "Dashboard",
          url: "/dashboard/profissional",
          icon: LayoutDashboard,
          items: [
            { title: "Visão Geral", url: "/dashboard/profissional" },
            { title: "Atividades", url: "/dashboard/atividades" },
          ],
        })

        // Pacientes
        baseItems.push({
          title: nomenclaturas.pacientes,
          url: "/pacientes",
          icon: Users,
          items: [
            { title: `Lista de ${nomenclaturas.pacientes}`, url: "/pacientes" },
          ],
        })

        // Agendamentos
        if (isModuleActive('agendamento')) {
          baseItems.push({
            title: nomenclaturas.agendamento,
            url: "/agendamentos",
            icon: Calendar,
            items: [
              { title: "Calendário", url: "/agendamentos" },
              { title: "Confirmações", url: "/agendamentos/confirmacoes" },
            ],
          })
        }

        // Prontuários
        if (isModuleActive('prontuario')) {
          baseItems.push({
            title: nomenclaturas.prontuario,
            url: "/prontuarios",
            icon: FileText,
            items: [
              { title: "Visão Geral", url: "/prontuarios" },
              { title: `${nomenclaturas.consultas} do Dia`, url: "/prontuarios/hoje" },
              { title: `Lista de ${nomenclaturas.prontuarios}`, url: "/prontuarios/lista" },
              { title: "Modelos", url: "/prontuarios/modelos" },
            ],
          })
        }

        // Anamnese
        if (isModuleActive('anamnese')) {
          baseItems.push({
            title: nomenclaturas.anamnese,
            url: "/anamnese",
            icon: ClipboardList,
            items: [
              { title: `Lista de ${nomenclaturas.avaliacoes}`, url: "/anamnese" },
              { title: `Nova ${nomenclaturas.avaliacao}`, url: "/anamnese/nova" },
            ],
          })
        }

        // Chat com notificação
        baseItems.push({
          title: "Chat",
          url: "/chat",
          icon: MessageSquare,
          badge: notification.hasUnreadMessages ? notification.unreadCount : undefined,
          items: [
            { title: "Conversas", url: "/chat" }
          ],
        })
        break

      case 'RECEPCIONISTA':
        // Dashboard
        baseItems.push({
          title: "Dashboard",
          url: "/dashboard/recepcionista",
          icon: LayoutDashboard,
          items: [
            { title: "Visão Geral", url: "/dashboard/recepcionista" },
            { title: "Atividades", url: "/dashboard/atividades" },
          ],
        })

        // Pacientes
        baseItems.push({
          title: nomenclaturas.pacientes,
          url: "/pacientes",
          icon: Users,
          items: [
            { title: `Lista de ${nomenclaturas.pacientes}`, url: "/pacientes" },
            { title: `Novo ${nomenclaturas.paciente}`, url: "/pacientes/novo" },
          ],
        })

        // Profissionais
        baseItems.push({
          title: nomenclaturas.profissionais,
          url: "/profissionais",
          icon: UserCheck,
          items: [
            { title: `Lista de ${nomenclaturas.profissionais}`, url: "/profissionais" },
            { title: "Especialidades", url: "/profissionais/especialidades" },
          ],
        })

        // Agendamentos
        if (isModuleActive('agendamento')) {
          baseItems.push({
            title: nomenclaturas.agendamento,
            url: "/agendamentos",
            icon: Calendar,
            items: [
              { title: "Calendário", url: "/agendamentos" },
              { title: `Novo ${nomenclaturas.agendamento}`, url: "/agendamentos/novo" },
              { title: "Confirmações", url: "/agendamentos/confirmacoes" },
            ],
          })
        }

        // Chat com notificação
        baseItems.push({
          title: "Chat",
          url: "/chat",
          icon: MessageSquare,
          badge: notification.hasUnreadMessages ? notification.unreadCount : undefined,
          items: [
            { title: "Conversas", url: "/chat" }
          ],
        })
        break

      default:
        // Menu padrão para roles não reconhecidas
        baseItems.push({
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
          items: [
            { title: "Visão Geral", url: "/dashboard" },
          ],
        })
        break
    }

    return baseItems
  }, [nomenclaturas, isModuleActive, notification])

  // Menu dinâmico baseado na role do usuário - memoizado para evitar re-renderizações
  const data = React.useMemo(() => {
    return getMenuItemsByRole(user?.role || '');
  }, [user?.role, getMenuItemsByRole])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/50">
        <div className="flex h-16 items-center px-2">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-0 py-4">
        <NavMain items={data} /> 
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/50">
        <div>
          <UserProfile variant="sidebar" className="w-full" />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

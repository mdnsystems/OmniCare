"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import React from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    badge?: number
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const location = useLocation()

  // Memoizar os cálculos de estado ativo para evitar recálculos desnecessários
  const activeStates = React.useMemo(() => {
    return items.map((item) => {
      const isActive = location.pathname.startsWith(item.url)
      const hasActiveChild = item.items?.some(subItem => 
        location.pathname === subItem.url
      )
      
      return {
        isActive,
        hasActiveChild,
        subItems: item.items?.map((subItem) => ({
          ...subItem,
          isSubActive: location.pathname === subItem.url
        }))
      }
    })
  }, [items, location.pathname])

  // Memoizar o menu para evitar re-renderizações desnecessárias
  const menuItems = React.useMemo(() => {
    return items.map((item, index) => {
      const { isActive, hasActiveChild, subItems } = activeStates[index]
      
      return (
        <Collapsible
          key={item.title}
          asChild
          defaultOpen={isActive || hasActiveChild}
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton 
                tooltip={item.title}
                isActive={isActive}
              >
                {item.icon && (
                  <item.icon className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate">{item.title}</span>
                <div className="ml-auto flex items-center gap-2">
                  {item.badge && (
                    <SidebarMenuBadge variant="secondary">
                      {item.badge > 99 ? '99+' : item.badge}
                    </SidebarMenuBadge>
                  )}
                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                </div>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub className="mt-1 space-y-0.5 pl-4">
                {subItems?.map((subItem) => {
                  const isSubActive = subItem.isSubActive
                  
                  return (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton 
                        asChild
                        isActive={isSubActive}
                      >
                        <Link to={subItem.url} className="flex items-center gap-2 w-full">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            isSubActive 
                              ? "bg-sidebar-accent-foreground" 
                              : "bg-foreground/50"
                          )} />
                          <span className="truncate">{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      )
    })
  }, [items, activeStates])

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
        Menu Principal
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1 px-2">
        {menuItems}
      </SidebarMenu>
    </SidebarGroup>
  )
}

"use client"

import * as React from "react"
import { LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useSidebar } from "@/components/ui/sidebar"
import { obterIniciais, obterEspecialidadePorRole } from "@/lib/utils"

interface UserProfileProps {
  variant?: 'default' | 'compact' | 'sidebar'
  showLogout?: boolean
  className?: string
}

export function UserProfile({ 
  variant = 'default', 
  showLogout = true, 
  className 
}: UserProfileProps) {
  const { user, signOut } = useAuth()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  if (!user) return null

  const iniciais = obterIniciais(user.nome || user.email)
  const especialidade = obterEspecialidadePorRole(user.role)

  const handleLogout = () => {
    signOut()
  }

  // Se estiver collapsed e for variante sidebar, mostrar apenas o avatar
  if (isCollapsed && variant === 'sidebar') {
    return (
      <div className={`flex items-center justify-center p-2 ${className}`}>
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src={user.fotoPerfil || `https://ui-avatars.com/api/?name=${user.nome || user.email}&background=random`} 
            alt={user.nome || user.email} 
          />
          <AvatarFallback className="text-xs font-medium">
            {iniciais}
          </AvatarFallback>
        </Avatar>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src={user.fotoPerfil || `https://ui-avatars.com/api/?name=${user.nome || user.email}&background=random`} 
            alt={user.nome || user.email} 
          />
          <AvatarFallback className="text-xs font-medium">
            {iniciais}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate">
            {user.nome || user.email}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {especialidade}
          </span>
        </div>
        {showLogout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 w-8 p-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors ${className}`}>
        <Avatar className="h-10 w-10">
          <AvatarImage 
            src={user.fotoPerfil || `https://ui-avatars.com/api/?name=${user.nome || user.email}&background=random`} 
            alt={user.nome || user.email} 
          />
          <AvatarFallback className="text-sm font-medium">
            {iniciais}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-medium truncate">
            {user.nome || user.email}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {especialidade}
          </span>
        </div>
        {showLogout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 w-8 p-0"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  // Variant default
  return (
    <div className={`flex items-center gap-4 p-4 bg-card rounded-lg border ${className}`}>
      <Avatar className="h-12 w-12">
        <AvatarImage 
          src={user.fotoPerfil || `https://ui-avatars.com/api/?name=${user.nome || user.email}&background=random`} 
          alt={user.nome || user.email} 
        />
        <AvatarFallback className="text-base font-medium">
          {iniciais}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-base font-semibold truncate">
          {user.nome || user.email}
        </span>
        <span className="text-sm text-muted-foreground truncate">
          {especialidade}
        </span>
        <span className="text-xs text-muted-foreground/70 truncate">
          {user.email}
        </span>
      </div>
      {showLogout && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </Button>
      )}
    </div>
  )
} 
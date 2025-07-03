"use client"

import * as React from "react"
import { Clock, Calendar, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TimePicker } from "@/components/ui/time-picker"

interface WorkSchedule {
  [key: string]: {
    inicio: string
    fim: string
    ativo?: boolean
  }
}

interface WorkSchedulePickerProps {
  schedule: WorkSchedule
  onScheduleChange: (schedule: WorkSchedule) => void
  disabled?: boolean
}

const diasSemana = [
  { key: 'segunda', label: 'Segunda-feira', short: 'SEG' },
  { key: 'terca', label: 'Terça-feira', short: 'TER' },
  { key: 'quarta', label: 'Quarta-feira', short: 'QUA' },
  { key: 'quinta', label: 'Quinta-feira', short: 'QUI' },
  { key: 'sexta', label: 'Sexta-feira', short: 'SEX' },
  { key: 'sabado', label: 'Sábado', short: 'SAB' },
  { key: 'domingo', label: 'Domingo', short: 'DOM' }
] as const

export function WorkSchedulePicker({ 
  schedule, 
  onScheduleChange, 
  disabled = false 
}: WorkSchedulePickerProps) {
  
  const updateDaySchedule = (day: string, field: 'inicio' | 'fim', value: string) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [field]: value
      }
    }
    onScheduleChange(newSchedule)
  }

  const toggleDayActive = (day: string) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        ativo: !schedule[day]?.ativo
      }
    }
    onScheduleChange(newSchedule)
  }

  const getDayStatus = (day: string) => {
    const daySchedule = schedule[day]
    if (!daySchedule?.ativo) return 'inactive'
    if (!daySchedule.inicio || !daySchedule.fim) return 'incomplete'
    return 'active'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'incomplete':
        return 'bg-yellow-500'
      case 'inactive':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo'
      case 'incomplete':
        return 'Incompleto'
      case 'inactive':
        return 'Inativo'
      default:
        return 'Inativo'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Horários de Trabalho</h3>
          <p className="text-sm text-muted-foreground">
            Configure os horários de atendimento para cada dia da semana
          </p>
        </div>
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {diasSemana.map(({ key, label, short }) => {
          const status = getDayStatus(key)
          const daySchedule = schedule[key] || { inicio: '', fim: '', ativo: true }
          
          return (
            <Card key={key} className={cn(
              "transition-all duration-200 hover:shadow-md",
              status === 'inactive' && "opacity-60",
              disabled && "opacity-50 cursor-not-allowed"
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      getStatusColor(status)
                    )} />
                    <CardTitle className="text-base font-medium">
                      {label}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {getStatusText(status)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleDayActive(key)}
                      disabled={disabled}
                      className="h-6 w-6 p-0"
                    >
                      {daySchedule.ativo ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <X className="h-3 w-3 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {daySchedule.ativo ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Horário de Início
                      </label>
                      <TimePicker
                        time={daySchedule.inicio}
                        onTimeChange={(time) => updateDaySchedule(key, 'inicio', time)}
                        placeholder="08:00"
                        disabled={disabled}
                      />
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-px bg-border"></div>
                      <span className="px-3 text-xs text-muted-foreground font-medium">até</span>
                      <div className="w-12 h-px bg-border"></div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Horário de Término
                      </label>
                      <TimePicker
                        time={daySchedule.fim}
                        onTimeChange={(time) => updateDaySchedule(key, 'fim', time)}
                        placeholder="18:00"
                        disabled={disabled}
                      />
                    </div>
                    
                    {daySchedule.inicio && daySchedule.fim && (
                      <div className="mt-3 p-2 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">
                            {daySchedule.inicio} - {daySchedule.fim}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Dia não disponível para atendimento
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Resumo semanal */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resumo da Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {diasSemana.map(({ key, short }) => {
              const status = getDayStatus(key)
              const daySchedule = schedule[key]
              const hasSchedule = daySchedule?.inicio && daySchedule?.fim
              
              return (
                <div key={key} className="text-center space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    {short}
                  </div>
                  <div className={cn(
                    "text-xs px-2 py-1 rounded-md border",
                    status === 'active' && hasSchedule
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                      : status === 'incomplete'
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                  )}>
                    {hasSchedule ? `${daySchedule.inicio} - ${daySchedule.fim}` : "—"}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimePicker } from "@/components/ui/time-picker"
import { WorkSchedulePicker } from "@/components/ui/work-schedule-picker"

export function TimePickerDemo() {
  const [selectedTime, setSelectedTime] = React.useState("")
  const [schedule, setSchedule] = React.useState({
    segunda: { inicio: "08:00", fim: "18:00", ativo: true },
    terca: { inicio: "08:00", fim: "18:00", ativo: true },
    quarta: { inicio: "08:00", fim: "18:00", ativo: true },
    quinta: { inicio: "08:00", fim: "18:00", ativo: true },
    sexta: { inicio: "08:00", fim: "18:00", ativo: true },
    sabado: { inicio: "09:00", fim: "14:00", ativo: true },
    domingo: { inicio: "", fim: "", ativo: false }
  })

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">TimePicker Moderno</h1>
        <p className="text-muted-foreground">
          Demonstração do novo TimePicker com design clean e moderno
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TimePicker Simples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⏰</span>
              TimePicker Simples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecione um horário:</label>
              <TimePicker
                time={selectedTime}
                onTimeChange={setSelectedTime}
                placeholder="Escolha um horário"
              />
            </div>
            
            {selectedTime && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Horário selecionado:</strong> {selectedTime}
                </p>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              <p>✨ <strong>Recursos:</strong></p>
              <ul className="mt-2 space-y-1">
                <li>• Interface visual com relógio circular</li>
                <li>• Controles de incremento/decremento</li>
                <li>• Horários comuns pré-definidos</li>
                <li>• Input manual com validação</li>
                <li>• Design responsivo e acessível</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* WorkSchedulePicker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              Horários de Trabalho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WorkSchedulePicker
              schedule={schedule}
              onScheduleChange={setSchedule}
            />
          </CardContent>
        </Card>
      </div>

      {/* Comparação */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="text-center">🎨 Melhorias no Design</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-red-600 mb-2">❌ Antes</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Interface básica com inputs simples</li>
                <li>• Grid de botões pequenos e confusos</li>
                <li>• Sem feedback visual claro</li>
                <li>• Difícil de usar em dispositivos móveis</li>
                <li>• Design não intuitivo</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-600 mb-2">✅ Agora</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Interface visual com relógio circular</li>
                <li>• Controles intuitivos de + e -</li>
                <li>• Feedback visual em tempo real</li>
                <li>• Totalmente responsivo</li>
                <li>• Design moderno e clean</li>
                <li>• Horários comuns pré-definidos</li>
                <li>• Status visual para cada dia</li>
                <li>• Resumo semanal interativo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
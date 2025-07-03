"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimePickerTest } from "@/components/ui/time-picker-test"

export function TimePickerExample() {
  const [horarioInicio, setHorarioInicio] = React.useState("")
  const [horarioFim, setHorarioFim] = React.useState("")

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Teste do TimePicker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Horário de Início</label>
          <TimePickerTest
            time={horarioInicio}
            onTimeChange={setHorarioInicio}
            placeholder="08:00"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Horário de Término</label>
          <TimePickerTest
            time={horarioFim}
            onTimeChange={setHorarioFim}
            placeholder="18:00"
          />
        </div>
        
        {(horarioInicio || horarioFim) && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-300">
              <strong>Horários selecionados:</strong><br />
              Início: {horarioInicio || "Não definido"}<br />
              Fim: {horarioFim || "Não definido"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
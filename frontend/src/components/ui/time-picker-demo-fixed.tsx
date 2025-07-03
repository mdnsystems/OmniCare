"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimePicker } from "@/components/ui/time-picker"
import { Button } from "@/components/ui/button"

export function TimePickerDemoFixed() {
  const [selectedTime, setSelectedTime] = React.useState("")
  const [formData, setFormData] = React.useState({
    nome: "",
    horario: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Formulário enviado! Nome: ${formData.nome}, Horário: ${selectedTime}`)
  }

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">TimePicker Corrigido ✅</h1>
        <p className="text-muted-foreground">
          Agora sem problemas de submit do formulário!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teste Simples */}
        <Card>
          <CardHeader>
            <CardTitle>Teste Simples</CardTitle>
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
          </CardContent>
        </Card>

        {/* Teste dentro de Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>Teste dentro de Formulário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome:</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Digite seu nome"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Horário:</label>
                <TimePicker
                  time={selectedTime}
                  onTimeChange={setSelectedTime}
                  placeholder="Escolha um horário"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Enviar Formulário
              </Button>
              
              <p className="text-xs text-muted-foreground">
                💡 Clique no TimePicker e depois no botão "Enviar". 
                O formulário só deve ser enviado quando clicar no botão, não no TimePicker!
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Instruções */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">✅ Problema Resolvido!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <p><strong>O que foi corrigido:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Adicionado <code>type="button"</code> em todos os botões do TimePicker</li>
              <li>Adicionado <code>e.preventDefault()</code> nos event handlers</li>
              <li>Adicionado <code>e.stopPropagation()</code> para evitar propagação de eventos</li>
              <li>O TimePicker agora funciona corretamente dentro de formulários</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
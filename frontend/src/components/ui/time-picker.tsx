"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Clock, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface TimePickerProps {
  time: string
  onTimeChange: (time: string) => void
  placeholder?: string
  disabled?: boolean
}

export function TimePicker({ 
  time, 
  onTimeChange, 
  placeholder = "Selecione um horário",
  disabled = false 
}: TimePickerProps) {
  const [inputValue, setInputValue] = React.useState(time || "")
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedHour, setSelectedHour] = React.useState(0)
  const [selectedMinute, setSelectedMinute] = React.useState(0)

  React.useEffect(() => {
    if (time) {
      const [hour, minute] = time.split(':').map(Number)
      setSelectedHour(hour)
      setSelectedMinute(minute)
    }
  }, [time])

  // Gerar opções de hora (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i)
  
  // Gerar opções de minuto (0, 15, 30, 45)
  const minutes = [0, 15, 30, 45]

  const handleTimeSelect = (hour: number, minute: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    setInputValue(timeString)
    onTimeChange(timeString)
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    onTimeChange(value)
  }

  const handleInputBlur = () => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (inputValue && !timeRegex.test(inputValue)) {
      setInputValue("")
      onTimeChange("")
    }
  }

  const incrementHour = () => {
    const newHour = (selectedHour + 1) % 24
    setSelectedHour(newHour)
    handleTimeSelect(newHour, selectedMinute)
  }

  const decrementHour = () => {
    const newHour = selectedHour === 0 ? 23 : selectedHour - 1
    setSelectedHour(newHour)
    handleTimeSelect(newHour, selectedMinute)
  }

  const incrementMinute = () => {
    const currentIndex = minutes.indexOf(selectedMinute)
    const newIndex = (currentIndex + 1) % minutes.length
    const newMinute = minutes[newIndex]
    setSelectedMinute(newMinute)
    handleTimeSelect(selectedHour, newMinute)
  }

  const decrementMinute = () => {
    const currentIndex = minutes.indexOf(selectedMinute)
    const newIndex = currentIndex === 0 ? minutes.length - 1 : currentIndex - 1
    const newMinute = minutes[newIndex]
    setSelectedMinute(newMinute)
    handleTimeSelect(selectedHour, newMinute)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-10",
            !time && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time ? (
            format(new Date(`2000-01-01T${time}`), "HH:mm", { locale: ptBR })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          {/* Input manual */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="time-input" className="text-sm font-medium">
              Digite o horário
            </Label>
            <Input
              id="time-input"
              type="time"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="w-full"
            />
          </div>

          <Separator className="my-4" />

          {/* Seletor visual */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Selecione visualmente</Label>
            
            {/* Controles de hora e minuto */}
            <div className="flex items-center justify-center gap-6">
              {/* Hora */}
              <div className="flex flex-col items-center space-y-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={incrementHour}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-border bg-background flex items-center justify-center">
                    <span className="text-2xl font-semibold text-foreground">
                      {selectedHour.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-medium">H</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={decrementHour}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-2xl font-bold text-muted-foreground">:</div>

              {/* Minuto */}
              <div className="flex flex-col items-center space-y-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={incrementMinute}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-border bg-background flex items-center justify-center">
                    <span className="text-2xl font-semibold text-foreground">
                      {selectedMinute.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-xs text-secondary-foreground font-medium">M</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={decrementMinute}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Opções rápidas */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Horários comuns</Label>
              <div className="grid grid-cols-4 gap-2">
                {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map((timeOption) => (
                  <Button
                    key={timeOption}
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 text-xs",
                      time === timeOption && "bg-primary text-primary-foreground border-primary"
                    )}
                    onClick={() => {
                      const [hour, minute] = timeOption.split(':').map(Number)
                      setSelectedHour(hour)
                      setSelectedMinute(minute)
                      handleTimeSelect(hour, minute)
                    }}
                  >
                    {timeOption}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 
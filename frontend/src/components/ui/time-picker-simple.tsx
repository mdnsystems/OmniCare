"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface TimePickerSimpleProps {
  time: string
  onTimeChange: (time: string) => void
  placeholder?: string
  disabled?: boolean
}

export function TimePickerSimple({ 
  time, 
  onTimeChange, 
  placeholder = "Selecione um horário",
  disabled = false 
}: TimePickerSimpleProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onTimeChange(value)
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
          {time ? time : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Selecione o horário</label>
            <Input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map((timeOption) => (
              <Button
                key={timeOption}
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 text-xs",
                  time === timeOption && "bg-primary text-primary-foreground border-primary"
                )}
                onClick={() => {
                  onTimeChange(timeOption)
                  setIsOpen(false)
                }}
              >
                {timeOption}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 
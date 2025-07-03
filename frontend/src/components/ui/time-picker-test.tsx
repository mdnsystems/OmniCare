"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TimePickerTestProps {
  time: string
  onTimeChange: (time: string) => void
  placeholder?: string
}

export function TimePickerTest({ 
  time, 
  onTimeChange, 
  placeholder = "Selecione um horário"
}: TimePickerTestProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (timeOption: string) => {
    onTimeChange(timeOption)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        className="w-full justify-start text-left font-normal h-10"
      >
        {time || placeholder}
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md p-3 z-50 shadow-lg">
          <div className="space-y-3">
            <Input
              type="time"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full"
            />
            
            <div className="grid grid-cols-4 gap-2">
              {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map((timeOption) => (
                <Button
                  key={timeOption}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => handleOptionClick(timeOption)}
                >
                  {timeOption}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
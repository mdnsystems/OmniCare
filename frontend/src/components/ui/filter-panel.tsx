import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"
import { useState } from "react"

interface FilterOption {
  label: string
  value: string
}

interface FilterField {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'date-range'
  options?: FilterOption[]
  placeholder?: string
}

interface FilterPanelProps {
  titulo?: string
  campos: FilterField[]
  onFiltrar: (filtros: Record<string, any>) => void
  onLimpar: () => void
  className?: string
}

export function FilterPanel({ 
  titulo = "Filtros", 
  campos, 
  onFiltrar, 
  onLimpar,
  className 
}: FilterPanelProps) {
  const [filtros, setFiltros] = useState<Record<string, any>>({})
  const [filtrosAtivos, setFiltrosAtivos] = useState<Record<string, any>>({})

  const handleFiltrar = () => {
    const filtrosValidos = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => 
        value !== undefined && value !== null && value !== ''
      )
    )
    setFiltrosAtivos(filtrosValidos)
    onFiltrar(filtrosValidos)
  }

  const handleLimpar = () => {
    setFiltros({})
    setFiltrosAtivos({})
    onLimpar()
  }

  const handleInputChange = (key: string, value: any) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const removeFiltro = (key: string) => {
    const novosFiltros = { ...filtros }
    delete novosFiltros[key]
    setFiltros(novosFiltros)
    
    const novosFiltrosAtivos = { ...filtrosAtivos }
    delete novosFiltrosAtivos[key]
    setFiltrosAtivos(novosFiltrosAtivos)
    onFiltrar(novosFiltrosAtivos)
  }

  const renderField = (campo: FilterField) => {
    switch (campo.type) {
      case 'text':
        return (
          <Input
            placeholder={campo.placeholder || campo.label}
            value={filtros[campo.key] || ''}
            onChange={(e) => handleInputChange(campo.key, e.target.value)}
          />
        )
      
      case 'select':
        return (
          <Select 
            value={filtros[campo.key] || ''} 
            onValueChange={(value) => handleInputChange(campo.key, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={campo.placeholder || campo.label} />
            </SelectTrigger>
            <SelectContent>
              {campo.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'date':
        return (
          <DatePicker
            date={filtros[campo.key] ? new Date(filtros[campo.key]) : null}
            onSelect={(date) => handleInputChange(campo.key, date?.toISOString())}
          />
        )
      
      case 'date-range':
        return (
          <div className="flex gap-2">
            <DatePicker
              date={filtros[`${campo.key}_inicio`] ? new Date(filtros[`${campo.key}_inicio`]) : null}
              onSelect={(date) => handleInputChange(`${campo.key}_inicio`, date?.toISOString())}
            />
            <DatePicker
              date={filtros[`${campo.key}_fim`] ? new Date(filtros[`${campo.key}_fim`]) : null}
              onSelect={(date) => handleInputChange(`${campo.key}_fim`, date?.toISOString())}
            />
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {titulo}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLimpar}>
              Limpar
            </Button>
            <Button size="sm" onClick={handleFiltrar}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campos.map((campo) => (
            <div key={campo.key} className="space-y-2">
              <label className="text-sm font-medium">{campo.label}</label>
              {renderField(campo)}
            </div>
          ))}
        </div>

        {/* Filtros Ativos */}
        {Object.keys(filtrosAtivos).length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Filtros Ativos:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filtrosAtivos).map(([key, value]) => {
                const campo = campos.find(c => c.key === key)
                return (
                  <div
                    key={key}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                  >
                    <span>{campo?.label}: {value}</span>
                    <button
                      onClick={() => removeFiltro(key)}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
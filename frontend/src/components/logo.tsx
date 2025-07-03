import { useSidebar } from "@/components/ui/sidebar"
import { Activity, Heart, Brain, Dumbbell, Stethoscope, Sparkles, PawPrint, GraduationCap, Building2, Settings } from "lucide-react"
import { useClinica } from "@/contexts/ClinicaContext"
import { TipoClinica } from "@/types/api"
import React from "react"

// Mapeamento de ícones por tipo de clínica
const clinicaIcons = {
  [TipoClinica.MEDICA]: Activity,
  [TipoClinica.NUTRICIONAL]: Heart,
  [TipoClinica.PSICOLOGICA]: Brain,
  [TipoClinica.FISIOTERAPICA]: Dumbbell,
  [TipoClinica.ODONTOLOGICA]: Stethoscope,
  [TipoClinica.ESTETICA]: Sparkles,
  [TipoClinica.VETERINARIA]: PawPrint,
  [TipoClinica.EDUCACIONAL]: GraduationCap,
  [TipoClinica.CORPORATIVA]: Building2,
  [TipoClinica.PERSONALIZADA]: Settings,
}

export function Logo() {
  const { state } = useSidebar()
  const { configuracao } = useClinica()
  const isCollapsed = state === "collapsed"

  // Memoizar os valores para evitar recálculos desnecessários
  const logoData = React.useMemo(() => {
    const IconComponent = configuracao ? clinicaIcons[configuracao.tipo] : Activity
    const nomeClinica = configuracao?.nome || "OmniCare"
    const subtitulo = configuracao?.tipo ? getSubtituloClinica(configuracao.tipo) : "Sistema de Gestão"
    const corPrimaria = configuracao?.corPrimaria || '#059669'

    return {
      IconComponent,
      nomeClinica,
      subtitulo,
      corPrimaria
    }
  }, [configuracao])

  function getSubtituloClinica(tipo: TipoClinica): string {
    const subtitulos = {
      [TipoClinica.MEDICA]: "Clínica Médica",
      [TipoClinica.NUTRICIONAL]: "Clínica Nutricional",
      [TipoClinica.PSICOLOGICA]: "Clínica Psicológica",
      [TipoClinica.FISIOTERAPICA]: "Clínica Fisioterapêutica",
      [TipoClinica.ODONTOLOGICA]: "Clínica Odontológica",
      [TipoClinica.ESTETICA]: "Clínica Estética",
      [TipoClinica.VETERINARIA]: "Clínica Veterinária",
      [TipoClinica.EDUCACIONAL]: "Centro Educacional",
      [TipoClinica.CORPORATIVA]: "Centro Corporativo",
      [TipoClinica.PERSONALIZADA]: "Sistema Personalizado",
    }
    return subtitulos[tipo] || "Sistema de Gestão"
  }

  return (
    <div className="flex items-center justify-center h-12 shrink-0 transition-all duration-300 ease-in-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-8">
      {isCollapsed ? (
        <div 
          className="flex items-center justify-center w-8 h-8 rounded-lg shadow-sm"
          style={{ 
            backgroundColor: logoData.corPrimaria,
            color: '#ffffff'
          }}
        >
          <logoData.IconComponent className="h-5 w-5" />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center justify-center w-8 h-8 rounded-lg shadow-sm"
            style={{ 
              backgroundColor: logoData.corPrimaria,
              color: '#ffffff'
            }}
          >
            <logoData.IconComponent className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground tracking-tight">
              {logoData.nomeClinica}
            </span>
            <span className="text-xs text-muted-foreground/70 font-medium">
              {logoData.subtitulo}
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 
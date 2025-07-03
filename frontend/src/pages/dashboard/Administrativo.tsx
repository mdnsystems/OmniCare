import CardDashboardAdmin from "@/components/card-dashboard-admin";
import CardHoje from "@/components/card-hoje";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfissionais } from "@/hooks/useProfissionais";
import { DashboardInsights } from "@/components/dashboard-insights";
import { Profissional } from "@/types/api";

export function DashboardAdministrativo() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [selectedProfessional, setSelectedProfessional] = useState<string>("TODOS");
  const { data: professionalsData, isLoading } = useProfissionais();

  // Extrair a lista de profissionais do PaginatedResponse
  const professionals = professionalsData?.data || [];

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      <CardDashboardAdmin />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="flex flex-col w-full p-4 gap-4 h-[600px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              </div>
              <p className="text-xl font-bold">Consultas do Dia</p>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={selectedProfessional}
                onValueChange={setSelectedProfessional}
              >
                <SelectTrigger className="max-content">
                  <SelectValue>
                    {selectedProfessional === "TODOS" 
                      ? "Todos os Profissionais" 
                      : professionals?.find((p: Profissional) => p.id === selectedProfessional)?.nome || "Selecione um profissional"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos os Profissionais</SelectItem>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>Carregando...</SelectItem>
                  ) : (
                    professionals?.map((professional: Profissional) => (
                      <SelectItem key={professional.id} value={professional.id}>
                        {professional.nome}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <DatePicker date={date} onSelect={setDate} className="max-content" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <CardHoje date={date} professionalId={selectedProfessional} />
          </div>
        </Card>

        <DashboardInsights className="w-full" />
      </div>
    </div>
  );
} 
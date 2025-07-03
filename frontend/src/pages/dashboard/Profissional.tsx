import CardDashboard from "@/components/card-dashboard";
import CardHoje from "@/components/card-hoje";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { DashboardInsights } from "@/components/dashboard-insights";

export function DashboardProfissional() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      <CardDashboard />

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
              <DatePicker date={date} onSelect={setDate} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <CardHoje date={date} />
          </div>
        </Card>

        <DashboardInsights className="w-full" />
      </div>
    </div>
  );
} 
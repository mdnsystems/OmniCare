import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar1, UserCheck, UserX, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import DashboardCard from "./ui/dashboard-card";
import { useDashboard } from "@/hooks/useDashboard";

export default function CardDashboard() {
  const { data: dashboard, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-full text-center text-red-600">
          Erro ao carregar dados do dashboard
        </div>
      </div>
    );
  }

  const agendamentos = dashboard?.agendamentos || {
    hoje: 0,
    realizados: 0,
    cancelados: 0
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
        title="Consultas Hoje"
        value={agendamentos.hoje}
        trend={0}
        icon={<Calendar1 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 dark:text-blue-400" />}
        color="bg-blue-100 dark:bg-blue-900/30"
      />
      <DashboardCard
        title="Atendidas"
        value={agendamentos.realizados}
        trend={0}
        icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-700 dark:text-green-400" />}
        color="bg-green-100 dark:bg-green-900/30"
      />
      <DashboardCard
        title="Confirmadas"
        value={agendamentos.confirmados || 0}
        trend={0}
        icon={<UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-violet-700 dark:text-violet-400" />}
        color="bg-violet-100 dark:bg-violet-900/30"
      />
      <DashboardCard
        title="Canceladas"
        value={agendamentos.cancelados}
        trend={0}
        icon={<UserX className="w-4 h-4 sm:w-5 sm:h-5 text-red-700 dark:text-red-400" />}
        color="bg-red-100 dark:bg-red-900/30"
      />
    </div>
  );
}

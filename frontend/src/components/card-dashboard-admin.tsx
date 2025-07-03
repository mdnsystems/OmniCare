import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  UserX, 
  DollarSign, 
  UserPlus, 
  Users, 
  BarChart, 
  Clock, 
  Star 
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/hooks/useDashboard";

interface AdminDashboardCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const AdminDashboardCard = ({ title, value, trend, icon, color, description }: AdminDashboardCardProps) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card className="group flex flex-col justify-between w-full hover:bg-muted/50 transition-all duration-300 hover:shadow-md py-0">
      <CardContent className="flex w-full justify-between p-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-sm sm:text-base font-medium text-muted-foreground">
            {title}
          </h2>
          <div className="flex items-baseline gap-2">
            <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
            {trend !== undefined && (
              <div className={cn(
                "flex items-center text-xs sm:text-sm font-medium",
                isPositive && "text-green-600 dark:text-green-400",
                isNegative && "text-red-600 dark:text-red-400"
              )}>
                <span>{trend > 0 ? '+' : ''}{trend}%</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-col items-end justify-between gap-2">
          <div className={cn(
            "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
            color
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CardDashboardAdmin() {
  const { data: dashboard, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="col-span-full text-center">
            <div className="text-red-600 mb-2">Erro ao carregar dados do dashboard</div>
            <div className="text-gray-600 text-sm">{error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  const agendamentos = dashboard?.agendamentos || { 
    hoje: 0, 
    mes: 0, 
    realizados: 0, 
    cancelados: 0, 
    taxaSucesso: 0 
  };
  const financeiro = dashboard?.financeiro || { 
    receitaTotal: 0, 
    receitaPaga: 0, 
    receitaPendente: 0, 
    mediaTicket: 0 
  };
  const pacientes = dashboard?.pacientes || { 
    total: 0, 
    novosMes: 0 
  };
  const profissionais = dashboard?.profissionais || { 
    total: 0, 
    ativos: 0 
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AdminDashboardCard
          title="Total de Consultas"
          value={agendamentos.mes || 0}
          trend={0}
          icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 dark:text-blue-400" />}
          color="bg-blue-100 dark:bg-blue-900/30"
          description="Este mês"
        />
        <AdminDashboardCard
          title="Taxa de Cancelamento"
          value={`${agendamentos.mes > 0 ? ((agendamentos.cancelados / agendamentos.mes) * 100).toFixed(1) : 0}%`}
          trend={0}
          icon={<UserX className="w-4 h-4 sm:w-5 sm:h-5 text-red-700 dark:text-red-400" />}
          color="bg-red-100 dark:bg-red-900/30"
          description="Média mensal"
        />
        <AdminDashboardCard
          title="Receita Total"
          value={`R$ ${(financeiro.receitaTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          trend={0}
          icon={<DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-700 dark:text-green-400" />}
          color="bg-green-100 dark:bg-green-900/30"
          description="Este mês"
        />
        <AdminDashboardCard
          title="Pacientes Novos"
          value={pacientes.novosMes || 0}
          trend={0}
          icon={<UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-violet-700 dark:text-violet-400" />}
          color="bg-violet-100 dark:bg-violet-900/30"
          description="Este mês"
        />
        <AdminDashboardCard
          title="Profissionais Ativos"
          value={profissionais.ativos || 0}
          icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 dark:text-amber-400" />}
          color="bg-amber-100 dark:bg-amber-900/30"
          description="Total"
        />
        <AdminDashboardCard
          title="Ticket Médio"
          value={`R$ ${(financeiro.mediaTicket || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={<BarChart className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-700 dark:text-cyan-400" />}
          color="bg-cyan-100 dark:bg-cyan-900/30"
          description="Por consulta"
        />
        <AdminDashboardCard
          title="Taxa de Sucesso"
          value={`${(agendamentos.taxaSucesso || 0).toFixed(1)}%`}
          trend={0}
          icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-700 dark:text-orange-400" />}
          color="bg-orange-100 dark:bg-orange-900/30"
          description="Consultas realizadas"
        />
        <AdminDashboardCard
          title="Total de Pacientes"
          value={pacientes.total || 0}
          trend={0}
          icon={<Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-700 dark:text-yellow-400" />}
          color="bg-yellow-100 dark:bg-yellow-900/30"
          description="Cadastrados"
        />
      </div>
    </div>
  );
} 
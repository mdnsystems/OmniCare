import { Card, CardContent } from "@/components/ui/card";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: number;
  trend?: number;
  icon: React.ReactNode;
  color: string;
}

export const DashboardCard = ({ title, value, trend, icon, color }: DashboardCardProps) => {
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
                {isPositive ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-2">
          <div className={cn(
            "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
            color
          )}>
            {icon}
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Ver todas</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard; 
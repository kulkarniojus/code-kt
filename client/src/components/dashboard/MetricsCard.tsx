import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function MetricsCard({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend,
  className 
}: MetricsCardProps) {
  return (
    <Card className={cn("", className)} data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-3xl font-bold tracking-tight">{value}</span>
            {description && (
              <span className="text-xs text-muted-foreground mt-1">
                {description}
              </span>
            )}
          </div>
          {trend && (
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-md",
              trend.isPositive 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

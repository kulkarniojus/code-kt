import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FrameworkBadgeProps {
  framework: string;
  className?: string;
}

const frameworkColors: Record<string, string> = {
  angular: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  react: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  vue: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  svelte: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  nextjs: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  typescript: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  javascript: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export function FrameworkBadge({ framework, className }: FrameworkBadgeProps) {
  const colorClass = frameworkColors[framework.toLowerCase()] || "bg-muted text-muted-foreground";
  
  return (
    <Badge 
      className={cn("text-xs font-medium no-default-hover-elevate no-default-active-elevate", colorClass, className)}
      data-testid={`badge-framework-${framework.toLowerCase()}`}
    >
      {framework}
    </Badge>
  );
}

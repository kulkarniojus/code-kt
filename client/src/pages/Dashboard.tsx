import { useQuery } from "@tanstack/react-query";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { DependencyChart } from "@/components/dashboard/DependencyChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Box, 
  Server, 
  Filter, 
  Layers, 
  Route, 
  FileCode 
} from "lucide-react";
import type { Project, ProjectMetrics, Dependency } from "@shared/schema";

export default function Dashboard() {
  const { data: project, isLoading: loadingProject } = useQuery<Project>({
    queryKey: ["/api/projects/current"],
  });

  const { data: metrics, isLoading: loadingMetrics } = useQuery<ProjectMetrics>({
    queryKey: ["/api/projects/current/metrics"],
  });

  const { data: dependencies = [], isLoading: loadingDeps } = useQuery<Dependency[]>({
    queryKey: ["/api/projects/current/dependencies"],
  });

  const isLoading = loadingProject || loadingMetrics || loadingDeps;

  return (
    <div className="p-6 space-y-6" data-testid="page-dashboard">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Project overview and code analysis metrics
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ProjectOverview 
          project={project || null} 
          metrics={metrics || null} 
        />
        <QuickActions />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))
        ) : (
          <>
            <MetricsCard
              title="Components"
              value={metrics?.totalComponents || 0}
              description="UI components"
              icon={Box}
            />
            <MetricsCard
              title="Services"
              value={metrics?.totalServices || 0}
              description="Business logic"
              icon={Server}
            />
            <MetricsCard
              title="Directives"
              value={metrics?.totalDirectives || 0}
              description="DOM manipulators"
              icon={Layers}
            />
            <MetricsCard
              title="Pipes/Filters"
              value={metrics?.totalPipes || 0}
              description="Data transformers"
              icon={Filter}
            />
            <MetricsCard
              title="Routes"
              value={metrics?.totalRoutes || 0}
              description="Navigation paths"
              icon={Route}
            />
            <MetricsCard
              title="Modules"
              value={metrics?.totalModules || 0}
              description="Feature modules"
              icon={FileCode}
            />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DependencyChart dependencies={dependencies} />
        <RecentActivity />
      </div>
    </div>
  );
}

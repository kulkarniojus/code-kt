import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FrameworkBadge } from "./FrameworkBadge";
import { 
  FileCode, 
  GitBranch, 
  Package, 
  Clock,
  CheckCircle2
} from "lucide-react";
import type { Project, ProjectMetrics } from "@shared/schema";

interface ProjectOverviewProps {
  project: Project | null;
  metrics: ProjectMetrics | null;
}

export function ProjectOverview({ project, metrics }: ProjectOverviewProps) {
  const scanProgress = project?.status === "completed" ? 100 : project?.status === "scanning" ? 65 : 0;

  return (
    <Card className="col-span-full lg:col-span-2" data-testid="card-project-overview">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{project?.name || "No Project Loaded"}</CardTitle>
            <CardDescription className="mt-1">
              {project?.rootPath || "Configure a project to start analysis"}
            </CardDescription>
          </div>
          {project?.framework && (
            <div className="flex gap-2">
              <FrameworkBadge framework={project.framework} />
              {project.language && <FrameworkBadge framework={project.language} />}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {project?.status === "scanning" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Scanning progress</span>
              <span className="font-medium">{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" data-testid="progress-scan" />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <FileCode className="w-5 h-5 text-primary" />
            <div>
              <div className="text-xl font-semibold">{metrics?.totalFiles || 0}</div>
              <div className="text-xs text-muted-foreground">Files</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <GitBranch className="w-5 h-5 text-chart-2" />
            <div>
              <div className="text-xl font-semibold">{metrics?.totalModules || 0}</div>
              <div className="text-xs text-muted-foreground">Modules</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Package className="w-5 h-5 text-chart-3" />
            <div>
              <div className="text-xl font-semibold">{metrics?.totalComponents || 0}</div>
              <div className="text-xs text-muted-foreground">Components</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Clock className="w-5 h-5 text-chart-4" />
            <div>
              <div className="text-xl font-semibold">
                {metrics?.totalLines ? `${(metrics.totalLines / 1000).toFixed(1)}k` : "0"}
              </div>
              <div className="text-xs text-muted-foreground">Lines</div>
            </div>
          </div>
        </div>

        {project?.status === "completed" && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Last scanned: {project.lastScanned ? new Date(project.lastScanned).toLocaleString() : "Never"}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

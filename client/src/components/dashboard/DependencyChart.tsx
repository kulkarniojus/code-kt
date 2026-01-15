import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Shield, Zap, TestTube } from "lucide-react";
import type { Dependency } from "@shared/schema";

interface DependencyChartProps {
  dependencies: Dependency[];
}

const categoryIcons: Record<string, typeof Package> = {
  ui: Package,
  state: Zap,
  testing: TestTube,
  utility: Shield,
};

const categoryColors: Record<string, string> = {
  ui: "text-chart-1",
  state: "text-chart-2",
  testing: "text-chart-3",
  utility: "text-chart-4",
};

export function DependencyChart({ dependencies }: DependencyChartProps) {
  const groupedDeps = dependencies.reduce((acc, dep) => {
    const category = dep.category || "other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(dep);
    return acc;
  }, {} as Record<string, Dependency[]>);

  const categories = Object.keys(groupedDeps);

  return (
    <Card data-testid="card-dependencies">
      <CardHeader>
        <CardTitle className="text-lg">Dependencies</CardTitle>
        <CardDescription>Project libraries by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-4">
            {categories.length > 0 ? (
              categories.map((category) => {
                const Icon = categoryIcons[category] || Package;
                const colorClass = categoryColors[category] || "text-muted-foreground";
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${colorClass}`} />
                      <span className="text-sm font-medium capitalize">{category}</span>
                      <Badge variant="secondary" className="text-xs">
                        {groupedDeps[category].length}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 pl-6">
                      {groupedDeps[category].slice(0, 6).map((dep) => (
                        <Badge 
                          key={dep.id} 
                          variant="outline" 
                          className="text-xs"
                          data-testid={`badge-dep-${dep.name}`}
                        >
                          {dep.name}
                          {dep.version && (
                            <span className="ml-1 text-muted-foreground">
                              @{dep.version}
                            </span>
                          )}
                        </Badge>
                      ))}
                      {groupedDeps[category].length > 6 && (
                        <Badge variant="secondary" className="text-xs">
                          +{groupedDeps[category].length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Package className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-sm">No dependencies found</p>
                <p className="text-xs">Scan a project to see dependencies</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

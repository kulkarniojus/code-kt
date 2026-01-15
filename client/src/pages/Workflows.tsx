import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FlowDiagram } from "@/components/workflows/FlowDiagram";
import { FlowList } from "@/components/workflows/FlowList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Workflow, GitBranch } from "lucide-react";
import type { CodeFlow, FlowStep } from "@shared/schema";

export default function Workflows() {
  const [selectedFlow, setSelectedFlow] = useState<CodeFlow | null>(null);

  const { data: flows = [], isLoading } = useQuery<CodeFlow[]>({
    queryKey: ["/api/projects/current/flows"],
  });

  const handleStepClick = (step: FlowStep) => {
  };

  return (
    <div className="h-full flex flex-col" data-testid="page-workflows">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Workflow className="w-6 h-6" />
              Workflows
            </h1>
            <p className="text-muted-foreground">
              Trace feature flows and execution paths through the codebase
            </p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <GitBranch className="w-3 h-3" />
            {flows.length} workflows detected
          </Badge>
        </div>
      </div>

      <div className="flex-1 p-6 pt-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <div className="lg:col-span-1">
            {isLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </CardContent>
              </Card>
            ) : (
              <FlowList
                flows={flows}
                selectedId={selectedFlow?.id}
                onSelect={setSelectedFlow}
              />
            )}
          </div>

          <div className="lg:col-span-2 h-full min-h-96">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <FlowDiagram
                flow={selectedFlow}
                onStepClick={handleStepClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

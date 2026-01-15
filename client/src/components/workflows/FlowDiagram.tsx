import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowRight, 
  Play, 
  FileCode, 
  Server, 
  Database, 
  Layout,
  Workflow,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CodeFlow, FlowStep } from "@shared/schema";

interface FlowDiagramProps {
  flow: CodeFlow | null;
  onStepClick?: (step: FlowStep) => void;
}

const stepIcons: Record<string, typeof FileCode> = {
  component: Layout,
  service: Server,
  store: Database,
  route: Play,
  file: FileCode,
};

const stepColors: Record<string, string> = {
  component: "text-chart-2 bg-chart-2/10 border-chart-2/30",
  service: "text-chart-3 bg-chart-3/10 border-chart-3/30",
  store: "text-chart-4 bg-chart-4/10 border-chart-4/30",
  route: "text-chart-1 bg-chart-1/10 border-chart-1/30",
  file: "text-chart-5 bg-chart-5/10 border-chart-5/30",
};

function FlowStep({ step, index, isLast, onClick }: { 
  step: FlowStep; 
  index: number; 
  isLast: boolean;
  onClick?: (step: FlowStep) => void;
}) {
  const Icon = stepIcons[step.type] || FileCode;
  const colorClass = stepColors[step.type] || stepColors.file;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onClick?.(step)}
        className={cn(
          "relative flex items-center gap-3 p-4 rounded-lg border transition-all hover-elevate flex-1",
          colorClass
        )}
        data-testid={`flow-step-${step.id}`}
      >
        <div className="absolute -left-8 flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
          {index + 1}
        </div>
        <div className={cn("p-2 rounded-md", colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-medium">{step.name}</p>
          {step.filePath && (
            <p className="text-xs opacity-70 font-mono truncate">{step.filePath}</p>
          )}
          {step.description && (
            <p className="text-sm mt-1 opacity-80">{step.description}</p>
          )}
        </div>
        <Badge variant="secondary" className="capitalize text-xs">
          {step.type}
        </Badge>
      </button>
      
      {!isLast && (
        <div className="flex flex-col items-center py-2">
          <div className="w-0.5 h-4 bg-border" />
          <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
          <div className="w-0.5 h-4 bg-border" />
        </div>
      )}
    </div>
  );
}

export function FlowDiagram({ flow, onStepClick }: FlowDiagramProps) {
  if (!flow) {
    return (
      <Card className="h-full" data-testid="flow-diagram-empty">
        <CardContent className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Workflow className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-medium">No flow selected</p>
          <p className="text-sm">Select a workflow to view its execution path</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col" data-testid="flow-diagram">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>{flow.name}</CardTitle>
            <CardDescription>
              {flow.steps.length} steps in this workflow
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Play className="w-4 h-4" />
            Trace Flow
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="p-6 pl-12 space-y-2">
            {flow.steps.map((step, index) => (
              <FlowStep
                key={step.id}
                step={step}
                index={index}
                isLast={index === flow.steps.length - 1}
                onClick={onStepClick}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

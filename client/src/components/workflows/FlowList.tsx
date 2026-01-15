import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Workflow, 
  LogIn, 
  ShoppingCart, 
  Settings, 
  Search,
  User,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CodeFlow } from "@shared/schema";

interface FlowListProps {
  flows: CodeFlow[];
  selectedId?: string;
  onSelect: (flow: CodeFlow) => void;
}

const flowIcons: Record<string, typeof Workflow> = {
  login: LogIn,
  checkout: ShoppingCart,
  settings: Settings,
  search: Search,
  profile: User,
  form: FileText,
};

function getFlowIcon(name: string) {
  const key = name.toLowerCase();
  for (const [k, icon] of Object.entries(flowIcons)) {
    if (key.includes(k)) return icon;
  }
  return Workflow;
}

export function FlowList({ flows, selectedId, onSelect }: FlowListProps) {
  return (
    <Card data-testid="flow-list">
      <CardHeader>
        <CardTitle className="text-lg">Workflows</CardTitle>
        <CardDescription>Feature flows and user journeys</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          {flows.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Workflow className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">No workflows detected</p>
              <p className="text-xs">Scan a project to analyze flows</p>
            </div>
          ) : (
            <div className="space-y-2">
              {flows.map((flow) => {
                const Icon = getFlowIcon(flow.name);
                const isSelected = flow.id === selectedId;
                
                return (
                  <button
                    key={flow.id}
                    onClick={() => onSelect(flow)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all hover-elevate",
                      isSelected && "bg-accent"
                    )}
                    data-testid={`flow-item-${flow.id}`}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{flow.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {flow.steps.length} steps
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {flow.steps[0]?.type || "flow"}
                    </Badge>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

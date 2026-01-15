import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, Box, FileCode } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Component } from "@shared/schema";

interface ComponentTreeProps {
  components: Component[];
  onSelect?: (component: Component) => void;
}

interface GroupedComponents {
  [module: string]: Component[];
}

function ComponentItem({ component, onSelect }: { component: Component; onSelect?: (c: Component) => void }) {
  return (
    <button
      onClick={() => onSelect?.(component)}
      className="w-full flex items-center gap-3 p-2 rounded-md text-left hover-elevate"
      data-testid={`component-item-${component.id}`}
    >
      <Box className="w-4 h-4 text-chart-2 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{component.name}</p>
        <p className="text-xs text-muted-foreground truncate">{component.filePath}</p>
      </div>
      <Badge variant="secondary" className="text-xs capitalize flex-shrink-0">
        {component.type}
      </Badge>
    </button>
  );
}

export function ComponentTree({ components, onSelect }: ComponentTreeProps) {
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  const grouped = components.reduce((acc, comp) => {
    const module = comp.moduleId?.toString() || "Standalone";
    if (!acc[module]) acc[module] = [];
    acc[module].push(comp);
    return acc;
  }, {} as GroupedComponents);

  const toggleModule = (module: string) => {
    const newOpen = new Set(openModules);
    if (newOpen.has(module)) {
      newOpen.delete(module);
    } else {
      newOpen.add(module);
    }
    setOpenModules(newOpen);
  };

  return (
    <Card data-testid="component-tree">
      <CardHeader>
        <CardTitle className="text-lg">Component Tree</CardTitle>
        <CardDescription>
          {components.length} components found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          {components.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Box className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">No components found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(grouped).map(([module, comps]) => (
                <Collapsible
                  key={module}
                  open={openModules.has(module)}
                  onOpenChange={() => toggleModule(module)}
                >
                  <CollapsibleTrigger className="w-full flex items-center gap-2 p-2 rounded-md hover-elevate">
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform",
                      openModules.has(module) && "rotate-90"
                    )} />
                    <FileCode className="w-4 h-4 text-chart-1" />
                    <span className="text-sm font-medium flex-1 text-left">
                      {module === "Standalone" ? "Standalone Components" : `Module ${module}`}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {comps.length}
                    </Badge>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 space-y-1 mt-1">
                    {comps.map((comp) => (
                      <ComponentItem key={comp.id} component={comp} onSelect={onSelect} />
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

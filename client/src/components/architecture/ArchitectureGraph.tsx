import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Download,
  Layers,
  Box,
  Database,
  Server,
  Layout,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArchitectureNode } from "@shared/schema";

interface ArchitectureGraphProps {
  nodes: ArchitectureNode[];
  onNodeClick?: (node: ArchitectureNode) => void;
}

const nodeTypeStyles: Record<string, { icon: typeof Box; color: string; bg: string }> = {
  module: { icon: Layers, color: "text-chart-1", bg: "bg-chart-1/10" },
  component: { icon: Box, color: "text-chart-2", bg: "bg-chart-2/10" },
  service: { icon: Server, color: "text-chart-3", bg: "bg-chart-3/10" },
  store: { icon: Database, color: "text-chart-4", bg: "bg-chart-4/10" },
  page: { icon: Layout, color: "text-chart-5", bg: "bg-chart-5/10" },
};

function ArchNode({ node, onClick }: { node: ArchitectureNode; onClick?: (node: ArchitectureNode) => void }) {
  const style = nodeTypeStyles[node.type] || nodeTypeStyles.component;
  const Icon = style.icon;

  return (
    <button
      onClick={() => onClick?.(node)}
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-lg border border-border transition-all hover-elevate",
        style.bg
      )}
      data-testid={`arch-node-${node.id}`}
    >
      <div className={cn("p-3 rounded-full", style.bg)}>
        <Icon className={cn("w-6 h-6", style.color)} />
      </div>
      <span className="text-sm font-medium text-center">{node.label}</span>
      <Badge variant="secondary" className="text-xs capitalize">
        {node.type}
      </Badge>
    </button>
  );
}

export function ArchitectureGraph({ nodes, onNodeClick }: ArchitectureGraphProps) {
  const groupedNodes = nodes.reduce((acc, node) => {
    const type = node.type || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(node);
    return acc;
  }, {} as Record<string, ArchitectureNode[]>);

  const layers = ["module", "page", "component", "service", "store"];

  return (
    <Card className="h-full flex flex-col" data-testid="architecture-graph">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
        <div>
          <CardTitle>Architecture Overview</CardTitle>
          <CardDescription>Visual representation of project structure</CardDescription>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" data-testid="button-zoom-in">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" data-testid="button-zoom-out">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" data-testid="button-fullscreen">
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" data-testid="button-download">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-6">
        {nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Layers className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-medium">No architecture data</p>
            <p className="text-sm">Scan a project to generate architecture diagram</p>
          </div>
        ) : (
          <div className="space-y-8">
            {layers.map((layer, layerIdx) => {
              const layerNodes = groupedNodes[layer] || [];
              if (layerNodes.length === 0) return null;
              
              return (
                <div key={layer} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{layer}s</Badge>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                    {layerNodes.map((node) => (
                      <ArchNode key={node.id} node={node} onClick={onNodeClick} />
                    ))}
                  </div>
                  
                  {layerIdx < layers.length - 1 && groupedNodes[layers[layerIdx + 1]]?.length > 0 && (
                    <div className="flex justify-center py-2">
                      <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

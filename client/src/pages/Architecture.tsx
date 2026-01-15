import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArchitectureGraph } from "@/components/architecture/ArchitectureGraph";
import { ComponentTree } from "@/components/architecture/ComponentTree";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  GitBranch, 
  Layers, 
  Box, 
  Server, 
  Route as RouteIcon,
  Filter
} from "lucide-react";
import type { ArchitectureNode, Component, Service, Route } from "@shared/schema";

export default function Architecture() {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);

  const { data: architectureNodes = [], isLoading: loadingArch } = useQuery<ArchitectureNode[]>({
    queryKey: ["/api/projects/current/architecture"],
  });

  const { data: components = [], isLoading: loadingComponents } = useQuery<Component[]>({
    queryKey: ["/api/projects/current/components"],
  });

  const { data: services = [], isLoading: loadingServices } = useQuery<Service[]>({
    queryKey: ["/api/projects/current/services"],
  });

  const { data: routes = [], isLoading: loadingRoutes } = useQuery<Route[]>({
    queryKey: ["/api/projects/current/routes"],
  });

  const isLoading = loadingArch || loadingComponents || loadingServices || loadingRoutes;

  return (
    <div className="h-full flex flex-col" data-testid="page-architecture">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <GitBranch className="w-6 h-6" />
              Architecture
            </h1>
            <p className="text-muted-foreground">
              Visual representation of project structure and dependencies
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="gap-1">
              <Box className="w-3 h-3" />
              {components.length} Components
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Server className="w-3 h-3" />
              {services.length} Services
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <RouteIcon className="w-3 h-3" />
              {routes.length} Routes
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 pt-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <div className="lg:col-span-2 h-full min-h-96">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ArchitectureGraph 
                nodes={architectureNodes} 
                onNodeClick={setSelectedNode}
              />
            )}
          </div>

          <div className="space-y-6 overflow-auto">
            <Tabs defaultValue="components">
              <TabsList className="w-full">
                <TabsTrigger value="components" className="flex-1 gap-1">
                  <Box className="w-3 h-3" />
                  Components
                </TabsTrigger>
                <TabsTrigger value="services" className="flex-1 gap-1">
                  <Server className="w-3 h-3" />
                  Services
                </TabsTrigger>
              </TabsList>

              <TabsContent value="components" className="mt-4">
                <ComponentTree components={components} />
              </TabsContent>

              <TabsContent value="services" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Services</CardTitle>
                    <CardDescription>{services.length} services found</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      {services.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                          <Server className="w-12 h-12 mb-4 opacity-50" />
                          <p className="text-sm">No services found</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {services.map((service) => (
                            <div
                              key={service.id}
                              className="flex items-center gap-3 p-3 rounded-lg hover-elevate"
                              data-testid={`service-item-${service.id}`}
                            >
                              <Server className="w-4 h-4 text-chart-3" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{service.name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {service.filePath}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {service.methods?.length || 0} methods
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {selectedNode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Node Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Name:</span>
                    <p className="font-medium">{selectedNode.label}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <Badge variant="secondary" className="ml-2 capitalize">
                      {selectedNode.type}
                    </Badge>
                  </div>
                  {selectedNode.filePath && (
                    <div>
                      <span className="text-sm text-muted-foreground">File:</span>
                      <p className="text-sm font-mono truncate">{selectedNode.filePath}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  GitBranch, 
  FolderTree, 
  MessageSquare, 
  Settings,
  Code2,
  Layers,
  Workflow,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    description: "Project overview & metrics",
  },
  {
    title: "Architecture",
    url: "/architecture",
    icon: GitBranch,
    description: "Visual architecture diagrams",
  },
  {
    title: "Code Explorer",
    url: "/explorer",
    icon: FolderTree,
    description: "Navigate codebase",
  },
  {
    title: "Workflows",
    url: "/workflows",
    icon: Workflow,
    description: "Code flow analysis",
  },
];

const toolsNavItems = [
  {
    title: "Chat Assistant",
    url: "/chat",
    icon: MessageSquare,
    description: "AI-powered code Q&A",
    badge: "AI",
  },
  {
    title: "Configuration",
    url: "/config",
    icon: Settings,
    description: "Project settings",
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const [analysisOpen, setAnalysisOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sidebar-foreground">Code KT</span>
            <span className="text-xs text-muted-foreground">Knowledge Transfer</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <Collapsible open={analysisOpen} onOpenChange={setAnalysisOpen}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel 
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 cursor-pointer flex items-center justify-between hover-elevate rounded-md"
                data-testid="toggle-analysis-section"
              >
                <span>Analysis</span>
                {analysisOpen ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location === item.url}
                        tooltip={item.description}
                      >
                        <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible open={toolsOpen} onOpenChange={setToolsOpen}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel 
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 cursor-pointer flex items-center justify-between hover-elevate rounded-md"
                data-testid="toggle-tools-section"
              >
                <span>Tools</span>
                {toolsOpen ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {toolsNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location === item.url}
                        tooltip={item.description}
                      >
                        <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
            <Layers className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-sidebar-foreground truncate">
              Demo Project
            </span>
            <span className="text-xs text-muted-foreground">Ready to scan</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

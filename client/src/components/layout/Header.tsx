import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Sun, 
  Moon, 
  Bell,
  RefreshCw,
  FileCode,
  Box,
  Server,
  Route,
  X
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import type { Component, Service, Route as RouteType, FileTreeNode } from "@shared/schema";

interface HeaderProps {
  onScan?: () => void;
  isScanning?: boolean;
}

interface SearchResult {
  type: "component" | "service" | "route" | "file";
  name: string;
  path?: string;
  description?: string;
}

export function Header({ onScan, isScanning }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: components = [] } = useQuery<Component[]>({
    queryKey: ["/api/projects/current/components"],
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/projects/current/services"],
  });

  const { data: routes = [] } = useQuery<RouteType[]>({
    queryKey: ["/api/projects/current/routes"],
  });

  const { data: files = [] } = useQuery<FileTreeNode[]>({
    queryKey: ["/api/projects/current/files"],
  });

  const flattenFiles = (nodes: FileTreeNode[], acc: FileTreeNode[] = []): FileTreeNode[] => {
    for (const node of nodes) {
      if (node.type === "file") {
        acc.push(node);
      }
      if (node.children) {
        flattenFiles(node.children, acc);
      }
    }
    return acc;
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const matches: SearchResult[] = [];

    components.forEach((c) => {
      if (c.name.toLowerCase().includes(query) || c.filePath.toLowerCase().includes(query)) {
        matches.push({
          type: "component",
          name: c.name,
          path: c.filePath,
          description: c.description || `${c.type} component`,
        });
      }
    });

    services.forEach((s) => {
      if (s.name.toLowerCase().includes(query) || s.filePath.toLowerCase().includes(query)) {
        matches.push({
          type: "service",
          name: s.name,
          path: s.filePath,
          description: s.description || "Service",
        });
      }
    });

    routes.forEach((r) => {
      if (r.path.toLowerCase().includes(query) || (r.componentName && r.componentName.toLowerCase().includes(query))) {
        matches.push({
          type: "route",
          name: r.path,
          path: r.filePath || undefined,
          description: `Route to ${r.componentName}`,
        });
      }
    });

    const allFiles = flattenFiles(files);
    allFiles.forEach((f) => {
      if (f.name.toLowerCase().includes(query) || f.path.toLowerCase().includes(query)) {
        if (!matches.find(m => m.path === f.path)) {
          matches.push({
            type: "file",
            name: f.name,
            path: f.path,
            description: f.language || "File",
          });
        }
      }
    });

    setResults(matches.slice(0, 10));
  }, [searchQuery, components, services, routes, files]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setSearchQuery("");
    if (result.type === "file" || result.type === "component" || result.type === "service") {
      setLocation("/explorer");
    } else if (result.type === "route") {
      setLocation("/workflows");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "component": return <Box className="w-4 h-4 text-blue-500" />;
      case "service": return <Server className="w-4 h-4 text-green-500" />;
      case "route": return <Route className="w-4 h-4 text-purple-500" />;
      default: return <FileCode className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <header className="flex items-center justify-between gap-4 h-14 px-4 border-b border-border bg-background sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
        
        <div className="relative hidden md:flex items-center" ref={searchRef}>
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground z-10" />
          <Input 
            type="search"
            placeholder="Search files, components, functions..."
            className="pl-9 pr-8 w-80 bg-muted/50 border-0 focus-visible:ring-1"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            data-testid="input-global-search"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 h-6 w-6"
              onClick={() => {
                setSearchQuery("");
                setResults([]);
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
          
          {showResults && results.length > 0 && (
            <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
              <ScrollArea className="max-h-80">
                <div className="p-1">
                  {results.map((result, index) => (
                    <div
                      key={`${result.type}-${result.name}-${index}`}
                      className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover-elevate"
                      onClick={() => handleResultClick(result)}
                      data-testid={`search-result-${index}`}
                    >
                      {getIcon(result.type)}
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-sm truncate">{result.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{result.path || result.description}</span>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
                        {result.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          )}
          
          {showResults && searchQuery && results.length === 0 && (
            <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
              <div className="p-4 text-center text-muted-foreground text-sm">
                No results found for "{searchQuery}"
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onScan}
          disabled={isScanning}
          data-testid="button-scan-project"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? "Scanning..." : "Scan Project"}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                2
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <span className="font-medium">Scan Complete</span>
                <span className="text-xs text-muted-foreground">Project analysis finished successfully</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <span className="font-medium">New Components Detected</span>
                <span className="text-xs text-muted-foreground">12 new components found in last scan</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>
      </div>
    </header>
  );
}

import { 
  type User, 
  type InsertUser, 
  type Project, 
  type InsertProject,
  type ProjectMetrics,
  type InsertProjectMetrics,
  type Component,
  type InsertComponent,
  type Service,
  type InsertService,
  type Route,
  type InsertRoute,
  type CodeModule,
  type InsertCodeModule,
  type Dependency,
  type InsertDependency,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type ArchitectureNode,
  type CodeFlow,
  type FileTreeNode
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProject(id: number): Promise<Project | undefined>;
  getCurrentProject(): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  
  getProjectMetrics(projectId: number): Promise<ProjectMetrics | undefined>;
  createProjectMetrics(metrics: InsertProjectMetrics): Promise<ProjectMetrics>;
  updateProjectMetrics(projectId: number, updates: Partial<ProjectMetrics>): Promise<ProjectMetrics | undefined>;
  
  getComponents(projectId: number): Promise<Component[]>;
  createComponent(component: InsertComponent): Promise<Component>;
  
  getServices(projectId: number): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  
  getRoutes(projectId: number): Promise<Route[]>;
  createRoute(route: InsertRoute): Promise<Route>;
  
  getModules(projectId: number): Promise<CodeModule[]>;
  createModule(module: InsertCodeModule): Promise<CodeModule>;
  
  getDependencies(projectId: number): Promise<Dependency[]>;
  createDependency(dependency: InsertDependency): Promise<Dependency>;
  
  getConversations(projectId?: number): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;
  
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  getArchitectureNodes(projectId: number): Promise<ArchitectureNode[]>;
  getCodeFlows(projectId: number): Promise<CodeFlow[]>;
  getFileTree(projectId: number): Promise<FileTreeNode[]>;
  getFileContent(path: string): Promise<string>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<number, Project>;
  private projectMetrics: Map<number, ProjectMetrics>;
  private components: Map<number, Component>;
  private services: Map<number, Service>;
  private routes: Map<number, Route>;
  private modules: Map<number, CodeModule>;
  private dependencies: Map<number, Dependency>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  
  private projectIdCounter = 1;
  private metricsIdCounter = 1;
  private componentIdCounter = 1;
  private serviceIdCounter = 1;
  private routeIdCounter = 1;
  private moduleIdCounter = 1;
  private dependencyIdCounter = 1;
  private conversationIdCounter = 1;
  private messageIdCounter = 1;
  private currentProjectId: number | null = null;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.projectMetrics = new Map();
    this.components = new Map();
    this.services = new Map();
    this.routes = new Map();
    this.modules = new Map();
    this.dependencies = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    
    this.initializeDemoData();
  }

  private initializeDemoData() {
    const demoProject: Project = {
      id: this.projectIdCounter++,
      name: "Demo Frontend App",
      rootPath: "./src",
      framework: "React",
      language: "TypeScript",
      buildTool: "Vite",
      status: "completed",
      lastScanned: new Date(),
      createdAt: new Date(),
    };
    this.projects.set(demoProject.id, demoProject);
    this.currentProjectId = demoProject.id;

    const metrics: ProjectMetrics = {
      id: this.metricsIdCounter++,
      projectId: demoProject.id,
      totalFiles: 45,
      totalLines: 8500,
      totalComponents: 24,
      totalServices: 8,
      totalDirectives: 3,
      totalPipes: 5,
      totalModules: 6,
      totalRoutes: 12,
      updatedAt: new Date(),
    };
    this.projectMetrics.set(metrics.id, metrics);

    const demoComponents: InsertComponent[] = [
      { projectId: 1, name: "AppSidebar", type: "layout", filePath: "src/components/layout/AppSidebar.tsx", props: ["items"], state: [], description: "Main navigation sidebar" },
      { projectId: 1, name: "Header", type: "layout", filePath: "src/components/layout/Header.tsx", props: ["onScan"], state: [], description: "Top header with search and actions" },
      { projectId: 1, name: "Dashboard", type: "page", filePath: "src/pages/Dashboard.tsx", props: [], state: [], description: "Main dashboard view" },
      { projectId: 1, name: "MetricsCard", type: "ui", filePath: "src/components/dashboard/MetricsCard.tsx", props: ["title", "value", "icon"], state: [], description: "Displays a single metric" },
      { projectId: 1, name: "ChatMessage", type: "ui", filePath: "src/components/chat/ChatMessage.tsx", props: ["role", "content"], state: [], description: "Chat message bubble" },
      { projectId: 1, name: "FileTree", type: "ui", filePath: "src/components/explorer/FileTree.tsx", props: ["nodes", "onSelect"], state: ["expanded"], description: "File browser tree" },
      { projectId: 1, name: "CodeViewer", type: "ui", filePath: "src/components/explorer/CodeViewer.tsx", props: ["file", "content"], state: [], description: "Source code display" },
      { projectId: 1, name: "ArchitectureGraph", type: "visualization", filePath: "src/components/architecture/ArchitectureGraph.tsx", props: ["nodes"], state: ["zoom"], description: "Architecture diagram" },
    ];
    
    demoComponents.forEach(comp => {
      const component: Component = { 
        ...comp, 
        id: this.componentIdCounter++,
        moduleId: comp.moduleId ?? null,
        props: comp.props ?? null,
        state: comp.state ?? null,
        description: comp.description ?? null
      };
      this.components.set(component.id, component);
    });

    const demoServices: InsertService[] = [
      { projectId: 1, name: "ApiService", filePath: "src/lib/queryClient.ts", methods: ["apiRequest", "getQueryClient"], dependencies: [], description: "HTTP API client" },
      { projectId: 1, name: "ThemeService", filePath: "src/lib/theme.tsx", methods: ["useTheme", "setTheme"], dependencies: [], description: "Theme management" },
      { projectId: 1, name: "StorageService", filePath: "src/lib/storage.ts", methods: ["get", "set", "remove"], dependencies: [], description: "Local storage wrapper" },
      { projectId: 1, name: "AuthService", filePath: "src/lib/auth.ts", methods: ["login", "logout", "getUser"], dependencies: ["ApiService"], description: "Authentication handling" },
    ];
    
    demoServices.forEach(svc => {
      const service: Service = { 
        ...svc, 
        id: this.serviceIdCounter++,
        description: svc.description ?? null,
        methods: svc.methods ?? null,
        dependencies: svc.dependencies ?? null
      };
      this.services.set(service.id, service);
    });

    const demoRoutes: InsertRoute[] = [
      { projectId: 1, path: "/", componentName: "Dashboard", filePath: "src/pages/Dashboard.tsx", guards: [], children: [] },
      { projectId: 1, path: "/architecture", componentName: "Architecture", filePath: "src/pages/Architecture.tsx", guards: [], children: [] },
      { projectId: 1, path: "/explorer", componentName: "Explorer", filePath: "src/pages/Explorer.tsx", guards: [], children: [] },
      { projectId: 1, path: "/chat", componentName: "Chat", filePath: "src/pages/Chat.tsx", guards: [], children: [] },
      { projectId: 1, path: "/workflows", componentName: "Workflows", filePath: "src/pages/Workflows.tsx", guards: [], children: [] },
      { projectId: 1, path: "/config", componentName: "Config", filePath: "src/pages/Config.tsx", guards: [], children: [] },
    ];
    
    demoRoutes.forEach(route => {
      const r: Route = { 
        ...route, 
        id: this.routeIdCounter++,
        filePath: route.filePath ?? null,
        componentName: route.componentName ?? null,
        guards: route.guards ?? null,
        children: route.children ?? null
      };
      this.routes.set(r.id, r);
    });

    const demoDependencies: InsertDependency[] = [
      { projectId: 1, name: "react", version: "18.3.0", type: "production", category: "ui" },
      { projectId: 1, name: "react-dom", version: "18.3.0", type: "production", category: "ui" },
      { projectId: 1, name: "@tanstack/react-query", version: "5.0.0", type: "production", category: "state" },
      { projectId: 1, name: "wouter", version: "3.0.0", type: "production", category: "utility" },
      { projectId: 1, name: "tailwindcss", version: "3.4.0", type: "production", category: "ui" },
      { projectId: 1, name: "lucide-react", version: "0.400.0", type: "production", category: "ui" },
      { projectId: 1, name: "typescript", version: "5.5.0", type: "development", category: "utility" },
      { projectId: 1, name: "vite", version: "5.0.0", type: "development", category: "utility" },
    ];
    
    demoDependencies.forEach(dep => {
      const d: Dependency = { 
        ...dep, 
        id: this.dependencyIdCounter++,
        version: dep.version ?? null,
        category: dep.category ?? null
      };
      this.dependencies.set(d.id, d);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getCurrentProject(): Promise<Project | undefined> {
    if (this.currentProjectId) {
      return this.projects.get(this.currentProjectId);
    }
    return Array.from(this.projects.values())[0];
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const newProject: Project = { 
      ...project, 
      id, 
      status: project.status ?? null,
      framework: project.framework ?? null,
      language: project.language ?? null,
      buildTool: project.buildTool ?? null,
      createdAt: new Date(),
      lastScanned: null
    };
    this.projects.set(id, newProject);
    this.currentProjectId = id;
    return newProject;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    const updated = { ...project, ...updates };
    this.projects.set(id, updated);
    return updated;
  }

  async getProjectMetrics(projectId: number): Promise<ProjectMetrics | undefined> {
    return Array.from(this.projectMetrics.values()).find(m => m.projectId === projectId);
  }

  async createProjectMetrics(metrics: InsertProjectMetrics): Promise<ProjectMetrics> {
    const id = this.metricsIdCounter++;
    const newMetrics: ProjectMetrics = { 
      ...metrics, 
      id, 
      totalFiles: metrics.totalFiles ?? null,
      totalLines: metrics.totalLines ?? null,
      totalComponents: metrics.totalComponents ?? null,
      totalServices: metrics.totalServices ?? null,
      totalDirectives: metrics.totalDirectives ?? null,
      totalPipes: metrics.totalPipes ?? null,
      totalModules: metrics.totalModules ?? null,
      totalRoutes: metrics.totalRoutes ?? null,
      updatedAt: new Date() 
    };
    this.projectMetrics.set(id, newMetrics);
    return newMetrics;
  }

  async updateProjectMetrics(projectId: number, updates: Partial<ProjectMetrics>): Promise<ProjectMetrics | undefined> {
    const metrics = await this.getProjectMetrics(projectId);
    if (!metrics) return undefined;
    const updated = { ...metrics, ...updates, updatedAt: new Date() };
    this.projectMetrics.set(metrics.id, updated);
    return updated;
  }

  async getComponents(projectId: number): Promise<Component[]> {
    return Array.from(this.components.values()).filter(c => c.projectId === projectId);
  }

  async createComponent(component: InsertComponent): Promise<Component> {
    const id = this.componentIdCounter++;
    const newComponent: Component = { 
      ...component, 
      id,
      moduleId: component.moduleId ?? null,
      props: component.props ?? null,
      state: component.state ?? null,
      description: component.description ?? null
    };
    this.components.set(id, newComponent);
    return newComponent;
  }

  async getServices(projectId: number): Promise<Service[]> {
    return Array.from(this.services.values()).filter(s => s.projectId === projectId);
  }

  async createService(service: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const newService: Service = { 
      ...service, 
      id,
      description: service.description ?? null,
      methods: service.methods ?? null,
      dependencies: service.dependencies ?? null
    };
    this.services.set(id, newService);
    return newService;
  }

  async getRoutes(projectId: number): Promise<Route[]> {
    return Array.from(this.routes.values()).filter(r => r.projectId === projectId);
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const id = this.routeIdCounter++;
    const newRoute: Route = { 
      ...route, 
      id,
      filePath: route.filePath ?? null,
      componentName: route.componentName ?? null,
      guards: route.guards ?? null,
      children: route.children ?? null
    };
    this.routes.set(id, newRoute);
    return newRoute;
  }

  async getModules(projectId: number): Promise<CodeModule[]> {
    return Array.from(this.modules.values()).filter(m => m.projectId === projectId);
  }

  async createModule(module: InsertCodeModule): Promise<CodeModule> {
    const id = this.moduleIdCounter++;
    const newModule: CodeModule = { 
      ...module, 
      id,
      description: module.description ?? null,
      dependencies: module.dependencies ?? null,
      exports: module.exports ?? null,
      linesOfCode: module.linesOfCode ?? null
    };
    this.modules.set(id, newModule);
    return newModule;
  }

  async getDependencies(projectId: number): Promise<Dependency[]> {
    return Array.from(this.dependencies.values()).filter(d => d.projectId === projectId);
  }

  async createDependency(dependency: InsertDependency): Promise<Dependency> {
    const id = this.dependencyIdCounter++;
    const newDependency: Dependency = { 
      ...dependency, 
      id,
      version: dependency.version ?? null,
      category: dependency.category ?? null
    };
    this.dependencies.set(id, newDependency);
    return newDependency;
  }

  async getConversations(projectId?: number): Promise<Conversation[]> {
    const convs = Array.from(this.conversations.values());
    if (projectId) {
      return convs.filter(c => c.projectId === projectId);
    }
    return convs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationIdCounter++;
    const newConversation: Conversation = { 
      ...conversation, 
      id, 
      projectId: conversation.projectId ?? null,
      createdAt: new Date() 
    };
    this.conversations.set(id, newConversation);
    return newConversation;
  }

  async deleteConversation(id: number): Promise<void> {
    this.conversations.delete(id);
    Array.from(this.messages.entries())
      .filter(([_, msg]) => msg.conversationId === id)
      .forEach(([msgId]) => this.messages.delete(msgId));
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const newMessage: Message = { 
      ...message, 
      id, 
      imageUrl: message.imageUrl ?? null,
      fileReferences: message.fileReferences ?? null,
      createdAt: new Date() 
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getArchitectureNodes(projectId: number): Promise<ArchitectureNode[]> {
    const components = await this.getComponents(projectId);
    const services = await this.getServices(projectId);
    const routes = await this.getRoutes(projectId);
    
    const nodes: ArchitectureNode[] = [];
    
    nodes.push({
      id: "module-app",
      label: "App Module",
      type: "module",
      filePath: "src/App.tsx"
    });
    
    routes.forEach(route => {
      nodes.push({
        id: `page-${route.id}`,
        label: route.componentName || route.path,
        type: "page",
        filePath: route.filePath || undefined
      });
    });
    
    components.forEach(comp => {
      nodes.push({
        id: `component-${comp.id}`,
        label: comp.name,
        type: "component",
        filePath: comp.filePath
      });
    });
    
    services.forEach(svc => {
      nodes.push({
        id: `service-${svc.id}`,
        label: svc.name,
        type: "service",
        filePath: svc.filePath
      });
    });
    
    return nodes;
  }

  async getCodeFlows(projectId: number): Promise<CodeFlow[]> {
    return [
      {
        id: "flow-login",
        name: "User Login Flow",
        steps: [
          { id: "step-1", type: "component", name: "LoginForm", filePath: "src/components/auth/LoginForm.tsx", description: "User enters credentials" },
          { id: "step-2", type: "service", name: "AuthService.login", filePath: "src/lib/auth.ts", description: "Validate and authenticate" },
          { id: "step-3", type: "store", name: "UserStore", filePath: "src/stores/user.ts", description: "Store user session" },
          { id: "step-4", type: "route", name: "Navigate to Dashboard", filePath: "src/App.tsx", description: "Redirect after login" },
        ]
      },
      {
        id: "flow-chat",
        name: "Chat with AI",
        steps: [
          { id: "step-1", type: "component", name: "ChatInput", filePath: "src/components/chat/ChatInput.tsx", description: "User enters message or uploads image" },
          { id: "step-2", type: "service", name: "ChatService.send", filePath: "src/lib/chat.ts", description: "Send message to API" },
          { id: "step-3", type: "service", name: "AIService.analyze", filePath: "server/routes.ts", description: "Process with AI model" },
          { id: "step-4", type: "component", name: "ChatMessage", filePath: "src/components/chat/ChatMessage.tsx", description: "Display AI response" },
        ]
      },
      {
        id: "flow-scan",
        name: "Project Scan",
        steps: [
          { id: "step-1", type: "component", name: "Header.onScan", filePath: "src/components/layout/Header.tsx", description: "User clicks scan button" },
          { id: "step-2", type: "service", name: "ScanService.scan", filePath: "server/routes.ts", description: "Traverse file system" },
          { id: "step-3", type: "service", name: "AnalyzerService", filePath: "server/analyzer.ts", description: "Parse and analyze code" },
          { id: "step-4", type: "store", name: "ProjectStore", filePath: "src/stores/project.ts", description: "Update project data" },
          { id: "step-5", type: "component", name: "Dashboard", filePath: "src/pages/Dashboard.tsx", description: "Refresh metrics display" },
        ]
      }
    ];
  }

  async getFileTree(projectId: number): Promise<FileTreeNode[]> {
    return [
      {
        name: "src",
        path: "src",
        type: "folder",
        children: [
          {
            name: "components",
            path: "src/components",
            type: "folder",
            children: [
              {
                name: "layout",
                path: "src/components/layout",
                type: "folder",
                children: [
                  { name: "AppSidebar.tsx", path: "src/components/layout/AppSidebar.tsx", type: "file", language: "typescript" },
                  { name: "Header.tsx", path: "src/components/layout/Header.tsx", type: "file", language: "typescript" },
                ]
              },
              {
                name: "dashboard",
                path: "src/components/dashboard",
                type: "folder",
                children: [
                  { name: "MetricsCard.tsx", path: "src/components/dashboard/MetricsCard.tsx", type: "file", language: "typescript" },
                  { name: "ProjectOverview.tsx", path: "src/components/dashboard/ProjectOverview.tsx", type: "file", language: "typescript" },
                  { name: "QuickActions.tsx", path: "src/components/dashboard/QuickActions.tsx", type: "file", language: "typescript" },
                ]
              },
              {
                name: "chat",
                path: "src/components/chat",
                type: "folder",
                children: [
                  { name: "ChatMessage.tsx", path: "src/components/chat/ChatMessage.tsx", type: "file", language: "typescript" },
                  { name: "ChatInput.tsx", path: "src/components/chat/ChatInput.tsx", type: "file", language: "typescript" },
                ]
              },
              {
                name: "explorer",
                path: "src/components/explorer",
                type: "folder",
                children: [
                  { name: "FileTree.tsx", path: "src/components/explorer/FileTree.tsx", type: "file", language: "typescript" },
                  { name: "CodeViewer.tsx", path: "src/components/explorer/CodeViewer.tsx", type: "file", language: "typescript" },
                ]
              },
            ]
          },
          {
            name: "pages",
            path: "src/pages",
            type: "folder",
            children: [
              { name: "Dashboard.tsx", path: "src/pages/Dashboard.tsx", type: "file", language: "typescript" },
              { name: "Architecture.tsx", path: "src/pages/Architecture.tsx", type: "file", language: "typescript" },
              { name: "Explorer.tsx", path: "src/pages/Explorer.tsx", type: "file", language: "typescript" },
              { name: "Chat.tsx", path: "src/pages/Chat.tsx", type: "file", language: "typescript" },
              { name: "Workflows.tsx", path: "src/pages/Workflows.tsx", type: "file", language: "typescript" },
              { name: "Config.tsx", path: "src/pages/Config.tsx", type: "file", language: "typescript" },
            ]
          },
          {
            name: "lib",
            path: "src/lib",
            type: "folder",
            children: [
              { name: "queryClient.ts", path: "src/lib/queryClient.ts", type: "file", language: "typescript" },
              { name: "theme.tsx", path: "src/lib/theme.tsx", type: "file", language: "typescript" },
              { name: "utils.ts", path: "src/lib/utils.ts", type: "file", language: "typescript" },
            ]
          },
          { name: "App.tsx", path: "src/App.tsx", type: "file", language: "typescript" },
          { name: "main.tsx", path: "src/main.tsx", type: "file", language: "typescript" },
          { name: "index.css", path: "src/index.css", type: "file", language: "css" },
        ]
      },
      {
        name: "server",
        path: "server",
        type: "folder",
        children: [
          { name: "index.ts", path: "server/index.ts", type: "file", language: "typescript" },
          { name: "routes.ts", path: "server/routes.ts", type: "file", language: "typescript" },
          { name: "storage.ts", path: "server/storage.ts", type: "file", language: "typescript" },
        ]
      },
      { name: "package.json", path: "package.json", type: "file", language: "json" },
      { name: "tsconfig.json", path: "tsconfig.json", type: "file", language: "json" },
      { name: "vite.config.ts", path: "vite.config.ts", type: "file", language: "typescript" },
    ];
  }

  async getFileContent(path: string): Promise<string> {
    const sampleCode: Record<string, string> = {
      "src/App.tsx": `import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "@/lib/theme";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import Dashboard from "@/pages/Dashboard";
import Architecture from "@/pages/Architecture";
import Explorer from "@/pages/Explorer";
import Chat from "@/pages/Chat";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/architecture" component={Architecture} />
      <Route path="/explorer" component={Explorer} />
      <Route path="/chat" component={Chat} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 overflow-hidden">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}`,
      "src/components/layout/Header.tsx": `import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

interface HeaderProps {
  onScan?: () => void;
}

export function Header({ onScan }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="relative">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9 w-80" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onScan}>Scan Project</Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>
      </div>
    </header>
  );
}`,
      "src/pages/Dashboard.tsx": `import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { DependencyChart } from "@/components/dashboard/DependencyChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Layers, Box, GitBranch, Route, FileCode, Server } from "lucide-react";

export default function Dashboard() {
  const { data: project } = useQuery({
    queryKey: ["/api/projects/current"],
  });

  const { data: metrics } = useQuery({
    queryKey: ["/api/projects/current/metrics"],
  });

  const { data: dependencies = [] } = useQuery({
    queryKey: ["/api/projects/current/dependencies"],
  });

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <MetricsCard
            title="Components"
            value={metrics?.totalComponents || 0}
            icon={<Box className="w-4 h-4" />}
          />
          <MetricsCard
            title="Services"
            value={metrics?.totalServices || 0}
            icon={<Server className="w-4 h-4" />}
          />
          <MetricsCard
            title="Modules"
            value={metrics?.totalModules || 0}
            icon={<Layers className="w-4 h-4" />}
          />
          <MetricsCard
            title="Routes"
            value={metrics?.totalRoutes || 0}
            icon={<Route className="w-4 h-4" />}
          />
          <MetricsCard
            title="Files"
            value={metrics?.totalFiles || 0}
            icon={<FileCode className="w-4 h-4" />}
          />
          <MetricsCard
            title="Dependencies"
            value={dependencies.length}
            icon={<GitBranch className="w-4 h-4" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ProjectOverview project={project} />
          <DependencyChart dependencies={dependencies} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}`,
      "src/pages/Architecture.tsx": `import { useQuery } from "@tanstack/react-query";
import { ArchitectureGraph } from "@/components/architecture/ArchitectureGraph";
import { ComponentTree } from "@/components/architecture/ComponentTree";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ArchitectureNode, Component, Service } from "@shared/schema";

export default function Architecture() {
  const { data: nodes = [] } = useQuery<ArchitectureNode[]>({
    queryKey: ["/api/projects/current/architecture"],
  });

  const { data: components = [] } = useQuery<Component[]>({
    queryKey: ["/api/projects/current/components"],
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/projects/current/services"],
  });

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Architecture</h1>
        <div className="grid gap-6 lg:grid-cols-2">
          <ArchitectureGraph nodes={nodes} />
          <ComponentTree components={components} services={services} />
        </div>
      </div>
    </div>
  );
}`,
      "src/pages/Chat.tsx": `import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Bot } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef(null);

  const handleSendMessage = async (content, imageFile) => {
    // Add user message
    setMessages(prev => [...prev, { role: "user", content }]);
    
    // Stream AI response
    setIsStreaming(true);
    const response = await fetch("/api/kt/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: content }),
    });
    
    // Process SSE stream
    const reader = response.body?.getReader();
    // ... streaming logic
    setIsStreaming(false);
  };

  return (
    <div className="h-full flex">
      <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
    </div>
  );
}`,
    };
    
    return sampleCode[path] || `// File: ${path}
// 
// This file is part of the demo project structure.
// In a real project scan, actual file contents would be loaded here.
// 
// The Code KT platform analyzes:
// - Component structure and props
// - Service dependencies
// - Route definitions
// - Import/export relationships
//
export default function Component() {
  return <div>Component content</div>;
}`;
  }
}

export const storage = new MemStorage();

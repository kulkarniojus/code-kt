import { useState } from "react";
import { ProjectConfig } from "@/components/config/ProjectConfig";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Info, BookOpen, ExternalLink, Copy, Check, Plug, Code, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Config() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const configExample = `{
  "name": "My Frontend App",
  "rootPath": "./src",
  "framework": "react",
  "language": "typescript",
  "buildTool": "vite",
  "excludePatterns": [
    "node_modules",
    "dist",
    ".git",
    "coverage"
  ],
  "includePatterns": [
    "**/*.ts",
    "**/*.tsx",
    "**/*.js",
    "**/*.jsx"
  ],
  "features": {
    "aiAnalysis": true,
    "autoScan": false,
    "generateDiagrams": true
  }
}`;

  const apiExample = `// Configure a new project
fetch('/api/projects/configure', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'My Project',
    rootPath: './src',
    framework: 'react',
    language: 'typescript',
    buildTool: 'vite'
  })
});

// Trigger a project scan
fetch('/api/projects/scan', { method: 'POST' });

// Get project data
const project = await fetch('/api/projects/current').then(r => r.json());
const components = await fetch('/api/projects/current/components').then(r => r.json());
const flows = await fetch('/api/projects/current/flows').then(r => r.json());`;

  const integrationSteps = [
    {
      step: 1,
      title: "Clone or Install the Agent",
      description: "Get the Code KT agent into your development environment",
      code: `# Clone the repository
git clone https://github.com/your-org/code-kt-agent.git

# Or install as a dependency
npm install code-kt-agent`
    },
    {
      step: 2,
      title: "Configure Your Project",
      description: "Create a configuration file or use the API to set up your project",
      code: `// Create agent.config.json in your project root
{
  "name": "Your Project Name",
  "rootPath": "./src",
  "framework": "auto"
}`
    },
    {
      step: 3,
      title: "Run the Scanner",
      description: "Scan your codebase to index components, services, and routes",
      code: `# Start the Code KT server
npm run dev

# The scanner will automatically analyze your codebase
# Or trigger manually via API:
curl -X POST http://localhost:5000/api/projects/scan`
    },
    {
      step: 4,
      title: "Access the Dashboard",
      description: "Open the web interface to explore your codebase",
      code: `# Open in your browser
http://localhost:5000

# Use the Chat Assistant to ask questions
# Explore Architecture, Code Explorer, and Workflows`
    }
  ];

  return (
    <div className="h-full overflow-auto" data-testid="page-config">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Configuration
            </h1>
            <p className="text-muted-foreground">
              Configure the Code KT agent for your project
            </p>
          </div>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Project Settings
            </TabsTrigger>
            <TabsTrigger value="integration" className="gap-2">
              <Plug className="w-4 h-4" />
              Integration Guide
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Code className="w-4 h-4" />
              API Reference
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Alert>
              <Info className="w-4 h-4" />
              <AlertTitle>Current Project Configuration</AlertTitle>
              <AlertDescription className="mt-2">
                This is currently configured to scan the Demo Frontend App. You can modify these settings 
                or create a new project configuration for your own codebase.
              </AlertDescription>
            </Alert>

            <ProjectConfig />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileJson className="w-5 h-5" />
                  Configuration File
                </CardTitle>
                <CardDescription>
                  Create an agent.config.json file in your project root
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-muted text-sm font-mono overflow-x-auto">
                    {configExample}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 gap-2"
                    onClick={() => copyToClipboard(configExample, "config")}
                  >
                    {copied === "config" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === "config" ? "Copied" : "Copy"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Supported Frameworks</CardTitle>
                <CardDescription>
                  Code KT supports these frontend frameworks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: "React", desc: "Components, hooks, context" },
                    { name: "Angular", desc: "Modules, services, directives" },
                    { name: "Vue.js", desc: "Components, composables, stores" },
                    { name: "Svelte", desc: "Components, stores, actions" },
                    { name: "Next.js", desc: "Pages, API routes, SSR" },
                    { name: "Nuxt.js", desc: "Pages, plugins, middleware" },
                  ].map((fw) => (
                    <div key={fw.name} className="p-4 rounded-lg bg-muted/50 border">
                      <p className="font-medium">{fw.name}</p>
                      <p className="text-xs text-muted-foreground">{fw.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <Alert>
              <BookOpen className="w-4 h-4" />
              <AlertTitle>Integration Guide</AlertTitle>
              <AlertDescription>
                Follow these steps to integrate Code KT with your existing project
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {integrationSteps.map((item) => (
                <Card key={item.step}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        {item.step}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="p-4 rounded-lg bg-muted text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                        {item.code}
                      </pre>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 gap-2"
                        onClick={() => copyToClipboard(item.code, `step-${item.step}`)}
                      >
                        {copied === `step-${item.step}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
                <CardDescription>
                  What you need to run Code KT
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">System Requirements</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Node.js 18+ or Bun</li>
                      <li>2GB RAM minimum</li>
                      <li>Modern web browser</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Optional</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>OpenAI API key (for AI chat)</li>
                      <li>PostgreSQL (for persistence)</li>
                      <li>Git (for version tracking)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Alert>
              <Code className="w-4 h-4" />
              <AlertTitle>API Reference</AlertTitle>
              <AlertDescription>
                Use these endpoints to integrate Code KT programmatically
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Endpoints</CardTitle>
                <CardDescription>
                  REST API for project configuration and data access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {[
                    { method: "GET", path: "/api/projects/current", desc: "Get current project info" },
                    { method: "GET", path: "/api/projects/current/metrics", desc: "Get project metrics" },
                    { method: "GET", path: "/api/projects/current/components", desc: "List all components" },
                    { method: "GET", path: "/api/projects/current/services", desc: "List all services" },
                    { method: "GET", path: "/api/projects/current/routes", desc: "List all routes" },
                    { method: "GET", path: "/api/projects/current/flows", desc: "List code workflows" },
                    { method: "GET", path: "/api/projects/current/files", desc: "Get file tree" },
                    { method: "GET", path: "/api/files/content/:path", desc: "Get file content" },
                    { method: "POST", path: "/api/projects/configure", desc: "Configure new project" },
                    { method: "POST", path: "/api/projects/scan", desc: "Trigger project scan" },
                    { method: "POST", path: "/api/kt/chat", desc: "Chat with AI (SSE)" },
                  ].map((endpoint) => (
                    <div key={endpoint.path} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Badge variant={endpoint.method === "GET" ? "secondary" : "default"}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono flex-1">{endpoint.path}</code>
                      <span className="text-sm text-muted-foreground">{endpoint.desc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Example Usage</CardTitle>
                <CardDescription>
                  JavaScript/TypeScript code examples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-muted text-sm font-mono overflow-x-auto">
                    {apiExample}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 gap-2"
                    onClick={() => copyToClipboard(apiExample, "api")}
                  >
                    {copied === "api" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === "api" ? "Copied" : "Copy"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

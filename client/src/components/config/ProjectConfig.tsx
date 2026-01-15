import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  FolderOpen, 
  Save, 
  RefreshCw, 
  Settings,
  Code2,
  FileJson,
  Shield,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectConfigProps {
  onSave?: (config: ProjectConfigData) => void;
}

interface ProjectConfigData {
  rootPath: string;
  framework: string;
  excludePatterns: string[];
  includePatterns: string[];
  enableAI: boolean;
  autoScan: boolean;
  scanDepth: number;
}

export function ProjectConfig({ onSave }: ProjectConfigProps) {
  const { toast } = useToast();
  const [config, setConfig] = useState<ProjectConfigData>({
    rootPath: "./src",
    framework: "auto",
    excludePatterns: ["node_modules", "dist", ".git", "coverage"],
    includePatterns: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    enableAI: true,
    autoScan: false,
    scanDepth: 10,
  });

  const handleSave = () => {
    onSave?.(config);
    toast({
      title: "Configuration saved",
      description: "Project settings have been updated",
    });
  };

  const frameworks = [
    { value: "auto", label: "Auto-detect" },
    { value: "angular", label: "Angular" },
    { value: "react", label: "React" },
    { value: "vue", label: "Vue.js" },
    { value: "svelte", label: "Svelte" },
    { value: "nextjs", label: "Next.js" },
  ];

  return (
    <Card data-testid="project-config">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Project Configuration
            </CardTitle>
            <CardDescription>
              Configure how the agent scans and analyzes your codebase
            </CardDescription>
          </div>
          <Button onClick={handleSave} className="gap-2" data-testid="button-save-config">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="general" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="framework" className="gap-2">
              <Code2 className="w-4 h-4" />
              Framework
            </TabsTrigger>
            <TabsTrigger value="patterns" className="gap-2">
              <FileJson className="w-4 h-4" />
              Patterns
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2">
              <Zap className="w-4 h-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rootPath">Project Root Path</Label>
                <div className="flex gap-2">
                  <Input
                    id="rootPath"
                    value={config.rootPath}
                    onChange={(e) => setConfig({ ...config, rootPath: e.target.value })}
                    placeholder="./src"
                    data-testid="input-root-path"
                  />
                  <Button variant="outline" size="icon" data-testid="button-browse">
                    <FolderOpen className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  The root directory for code scanning
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scanDepth">Maximum Scan Depth</Label>
                <Input
                  id="scanDepth"
                  type="number"
                  value={config.scanDepth}
                  onChange={(e) => setConfig({ ...config, scanDepth: parseInt(e.target.value) || 10 })}
                  min={1}
                  max={50}
                  data-testid="input-scan-depth"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum folder depth to scan (1-50)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label>Enable AI Analysis</Label>
                  <p className="text-xs text-muted-foreground">
                    Use AI to understand code patterns and generate explanations
                  </p>
                </div>
                <Switch
                  checked={config.enableAI}
                  onCheckedChange={(checked) => setConfig({ ...config, enableAI: checked })}
                  data-testid="switch-enable-ai"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label>Auto-scan on Changes</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically rescan when files change
                  </p>
                </div>
                <Switch
                  checked={config.autoScan}
                  onCheckedChange={(checked) => setConfig({ ...config, autoScan: checked })}
                  data-testid="switch-auto-scan"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="framework" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Framework Detection</Label>
                <Select
                  value={config.framework}
                  onValueChange={(value) => setConfig({ ...config, framework: value })}
                >
                  <SelectTrigger data-testid="select-framework">
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    {frameworks.map((fw) => (
                      <SelectItem key={fw.value} value={fw.value}>
                        {fw.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose auto-detect or specify the framework manually
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <h4 className="font-medium">Detected Configuration</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Framework:</span>
                    <Badge variant="secondary" className="ml-2">React</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Language:</span>
                    <Badge variant="secondary" className="ml-2">TypeScript</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Build Tool:</span>
                    <Badge variant="secondary" className="ml-2">Vite</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">State:</span>
                    <Badge variant="secondary" className="ml-2">React Query</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Include Patterns</Label>
                <Textarea
                  value={config.includePatterns.join("\n")}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    includePatterns: e.target.value.split("\n").filter(Boolean) 
                  })}
                  placeholder="**/*.ts&#10;**/*.tsx"
                  rows={6}
                  className="font-mono text-sm"
                  data-testid="textarea-include-patterns"
                />
                <p className="text-xs text-muted-foreground">
                  Glob patterns for files to include (one per line)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Exclude Patterns</Label>
                <Textarea
                  value={config.excludePatterns.join("\n")}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    excludePatterns: e.target.value.split("\n").filter(Boolean) 
                  })}
                  placeholder="node_modules&#10;dist"
                  rows={6}
                  className="font-mono text-sm"
                  data-testid="textarea-exclude-patterns"
                />
                <p className="text-xs text-muted-foreground">
                  Patterns for files/folders to exclude (one per line)
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="p-4 rounded-lg border border-dashed space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <h4 className="font-medium">Security Settings</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                The agent operates in read-only mode and never modifies your code.
                Authentication-protected routes are bypassed during static code analysis.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Read-only access</Badge>
                <Badge variant="outline">No code modification</Badge>
                <Badge variant="outline">Static analysis only</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Configuration File (agent.config.json)</Label>
              <Textarea
                value={JSON.stringify(config, null, 2)}
                readOnly
                rows={10}
                className="font-mono text-sm bg-muted/50"
                data-testid="textarea-config-json"
              />
              <p className="text-xs text-muted-foreground">
                You can also configure the agent by placing an agent.config.json file in your project root
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

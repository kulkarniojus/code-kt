import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import type { Component, Service, Route, CodeFlow, Project } from "@shared/schema";

const hasOpenAICredentials = !!(process.env.AI_INTEGRATIONS_OPENAI_API_KEY && process.env.AI_INTEGRATIONS_OPENAI_BASE_URL);

const openai = hasOpenAICredentials ? new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
}) : null;

async function buildProjectContext(projectId: number): Promise<string> {
  const project = await storage.getProject(projectId);
  const components = await storage.getComponents(projectId);
  const services = await storage.getServices(projectId);
  const routes = await storage.getRoutes(projectId);
  const flows = await storage.getCodeFlows(projectId);
  const dependencies = await storage.getDependencies(projectId);
  const metrics = await storage.getProjectMetrics(projectId);
  
  const componentsByType = components.reduce((acc, c) => {
    acc[c.type] = acc[c.type] || [];
    acc[c.type].push(c);
    return acc;
  }, {} as Record<string, typeof components>);
  
  const componentSummary = Object.entries(componentsByType)
    .map(([type, comps]) => `  ${type}: ${comps.map(c => `${c.name} (${c.filePath})`).join(", ")}`)
    .join("\n");
  
  return `
PROJECT: ${project?.name || "Demo Frontend App"}
FRAMEWORK: ${project?.framework || "React"} with ${project?.language || "TypeScript"}
BUILD TOOL: ${project?.buildTool || "Vite"}
STATUS: ${project?.status || "completed"}

METRICS:
- Total Files: ${metrics?.totalFiles || 0}
- Total Lines: ${metrics?.totalLines || 0}
- Components: ${metrics?.totalComponents || components.length}
- Services: ${metrics?.totalServices || services.length}
- Routes: ${metrics?.totalRoutes || routes.length}

COMPONENTS BY TYPE:
${componentSummary || "No components found"}

DETAILED COMPONENTS:
${components.map(c => `- ${c.name}: ${c.description || c.type} at [${c.filePath}]`).join("\n") || "None"}

SERVICES:
${services.map(s => `- ${s.name}: ${s.description || "Service"} at [${s.filePath}]
  Methods: ${s.methods?.join(", ") || "N/A"}
  Dependencies: ${s.dependencies?.join(", ") || "None"}`).join("\n") || "None"}

ROUTES:
${routes.map(r => `- ${r.path} -> ${r.componentName} [${r.filePath}]`).join("\n") || "None"}

WORKFLOWS/CODE FLOWS:
${flows.map(f => `- ${f.name}: ${f.steps.map(s => s.name).join(" -> ")}`).join("\n") || "None"}

DEPENDENCIES:
${dependencies.slice(0, 10).map(d => `- ${d.name}@${d.version} (${d.type})`).join("\n") || "None"}
`;
}

function generateFallbackResponse(
  message: string, 
  components: Component[], 
  services: Service[], 
  routes: Route[], 
  flows: CodeFlow[],
  project: Project | undefined
): string {
  if (!message?.trim()) {
    return "Please ask a question about this project.";
  }
  
  const lowerMessage = message.toLowerCase();
  const projectName = project?.name || "Demo Frontend App";
  
  const safeFilePath = (path: string | null | undefined): string => path || "unknown";
  const safeDescription = (desc: string | null | undefined, fallback: string): string => desc || fallback;
  
  if (lowerMessage.includes("structure") || lowerMessage.includes("architecture") || lowerMessage.includes("explain") || lowerMessage.includes("overview")) {
    const componentTypes = components.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const typeBreakdown = Object.entries(componentTypes)
      .map(([type, count]) => `  - ${count} ${type} components`)
      .join("\n") || "  - No components found";
    
    const keyComponents = components.slice(0, 5).map(c => 
      `- [${c.name}](${safeFilePath(c.filePath)}) - ${safeDescription(c.description, c.type)}`
    ).join("\n") || "- No components found";
    
    const servicesList = services.map(s => 
      `- [${s.name}](${safeFilePath(s.filePath)}) - ${safeDescription(s.description, "Business logic")}`
    ).join("\n") || "- No services found";
    
    const routesList = routes.map(r => 
      `- \`${r.path}\` -> [${r.componentName || "Unknown"}](${safeFilePath(r.filePath)})`
    ).join("\n") || "- No routes found";
    
    return `## ${projectName} - Architecture Overview

This is a **${project?.framework || "React"}** application built with **${project?.language || "TypeScript"}** and bundled using **${project?.buildTool || "Vite"}**.

### Project Structure

**Components (${components.length} total):**
${typeBreakdown}

**Key Components:**
${keyComponents}

**Services (${services.length}):**
${servicesList}

**Routes (${routes.length}):**
${routesList}

### Entry Point
The main entry is [App.tsx](src/App.tsx), which sets up routing, providers, and the overall layout with sidebar navigation.

### Data Flow
State management uses **TanStack React Query** for server state. The [queryClient.ts](src/lib/queryClient.ts) configures API calls and caching.`;
  }
  
  if (lowerMessage.includes("component")) {
    const componentTypes = components.reduce((acc: Record<string, Component[]>, c) => {
      acc[c.type] = acc[c.type] || [];
      acc[c.type].push(c);
      return acc;
    }, {});
    
    let response = `## Components in ${projectName}\n\n`;
    
    if (Object.keys(componentTypes).length === 0) {
      return response + "No components found in this project.";
    }
    
    for (const [type, comps] of Object.entries(componentTypes)) {
      response += `### ${type.charAt(0).toUpperCase() + type.slice(1)} Components\n`;
      response += comps.map(c => `- **[${c.name}](${safeFilePath(c.filePath)})** - ${safeDescription(c.description, "Component")}`).join("\n");
      response += "\n\n";
    }
    
    return response;
  }
  
  if (lowerMessage.includes("route") || lowerMessage.includes("navigation") || lowerMessage.includes("page")) {
    const routesList = routes.map(r => 
      `| \`${r.path}\` | [${r.componentName || "Unknown"}](${safeFilePath(r.filePath)}) |`
    ).join("\n") || "| No routes | found |";
    
    return `## Routing in ${projectName}

Routes are defined in [App.tsx](src/App.tsx) using **wouter** for lightweight client-side routing.

### Available Routes:
${routesList}

### Navigation
The sidebar uses the **SidebarProvider** from shadcn/ui for collapsible navigation. Each route renders its page component in the main content area.`;
  }
  
  if (lowerMessage.includes("service") || lowerMessage.includes("api") || lowerMessage.includes("data")) {
    const servicesList = services.map(s => `
**[${s.name}](${safeFilePath(s.filePath)})**
- Description: ${safeDescription(s.description, "Business logic service")}
- Methods: ${s.methods?.join(", ") || "Various"}
- Dependencies: ${s.dependencies?.length ? s.dependencies.join(", ") : "None"}`).join("\n") || "\nNo services found.";
    
    return `## Services & API in ${projectName}

### Services:
${servicesList}

### API Client
The [queryClient.ts](src/lib/queryClient.ts) provides:
- \`apiRequest(method, url, data)\` - Makes HTTP requests
- TanStack Query integration for caching and refetching`;
  }
  
  if (lowerMessage.includes("flow") || lowerMessage.includes("workflow") || lowerMessage.includes("how does")) {
    if (flows.length === 0) {
      return `## Code Flows in ${projectName}\n\nNo code flows have been detected yet. Try scanning the project to analyze code flows.`;
    }
    
    const flowsList = flows.map(f => `
### ${f.name}
${f.steps.map((s, i: number) => `${i + 1}. **${s.name}** ([${safeFilePath(s.filePath)}](${safeFilePath(s.filePath)}))
   ${s.description || "Step in the flow"}`).join("\n")}`).join("\n");
    
    return `## Code Flows in ${projectName}
${flowsList}`;
  }
  
  return `## Welcome to ${projectName} Knowledge Transfer

I can help you understand this codebase! Here's a quick overview:

| Metric | Count |
|--------|-------|
| Components | ${components.length} |
| Services | ${services.length} |
| Routes | ${routes.length} |
| Code Flows | ${flows.length} |

### Try asking about:
- "Explain the project architecture"
- "Show me the components"
- "How does routing work?"
- "What services are available?"
- "Explain the login flow"

Or upload a screenshot of the UI and I'll identify the relevant components!`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/projects/current", async (req: Request, res: Response) => {
    try {
      const project = await storage.getCurrentProject();
      if (!project) {
        return res.status(404).json({ error: "No project found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error getting current project:", error);
      res.status(500).json({ error: "Failed to get project" });
    }
  });

  app.get("/api/projects/current/metrics", async (req: Request, res: Response) => {
    try {
      const project = await storage.getCurrentProject();
      if (!project) {
        return res.status(404).json({ error: "No project found" });
      }
      const metrics = await storage.getProjectMetrics(project.id);
      res.json(metrics || {});
    } catch (error) {
      console.error("Error getting metrics:", error);
      res.status(500).json({ error: "Failed to get metrics" });
    }
  });

  app.get("/api/projects/current/dependencies", async (req: Request, res: Response) => {
    try {
      const project = await storage.getCurrentProject();
      if (!project) {
        return res.json([]);
      }
      const dependencies = await storage.getDependencies(project.id);
      res.json(dependencies);
    } catch (error) {
      console.error("Error getting dependencies:", error);
      res.status(500).json({ error: "Failed to get dependencies" });
    }
  });

  app.get("/api/projects/current/components", async (req: Request, res: Response) => {
    try {
      const project = await storage.getCurrentProject();
      if (!project) {
        return res.json([]);
      }
      const components = await storage.getComponents(project.id);
      res.json(components);
    } catch (error) {
      console.error("Error getting components:", error);
      res.status(500).json({ error: "Failed to get components" });
    }
  });

  app.get("/api/projects/current/services", async (req: Request, res: Response) => {
    try {
      const project = await storage.getCurrentProject();
      if (!project) {
        return res.json([]);
      }
      const services = await storage.getServices(project.id);
      res.json(services);
    } catch (error) {
      console.error("Error getting services:", error);
      res.status(500).json({ error: "Failed to get services" });
    }
  });

  app.get("/api/projects/current/routes", async (req: Request, res: Response) => {
    try {
      const project = await storage.getCurrentProject();
      if (!project) {
        return res.json([]);
      }
      const routes = await storage.getRoutes(project.id);
      res.json(routes);
    } catch (error) {
      console.error("Error getting routes:", error);
      res.status(500).json({ error: "Failed to get routes" });
    }
  });

  app.get("/api/projects/current/architecture", async (req: Request, res: Response) => {
    try {
      const project = await storage.getCurrentProject();
      if (!project) {
        return res.json([]);
      }
      const nodes = await storage.getArchitectureNodes(project.id);
      res.json(nodes);
    } catch (error) {
      console.error("Error getting architecture:", error);
      res.status(500).json({ error: "Failed to get architecture" });
    }
  });

  app.get("/api/projects/current/flows", async (req: Request, res: Response) => {
    try {
      const project = await storage.getCurrentProject();
      if (!project) {
        return res.json([]);
      }
      const flows = await storage.getCodeFlows(project.id);
      res.json(flows);
    } catch (error) {
      console.error("Error getting flows:", error);
      res.status(500).json({ error: "Failed to get flows" });
    }
  });

  app.get("/api/projects/current/files", async (req: Request, res: Response) => {
    try {
      const project = await storage.getCurrentProject();
      if (!project) {
        return res.json([]);
      }
      const files = await storage.getFileTree(project.id);
      res.json(files);
    } catch (error) {
      console.error("Error getting files:", error);
      res.status(500).json({ error: "Failed to get files" });
    }
  });

  app.get("/api/files/content/*", async (req: Request, res: Response) => {
    try {
      const path = req.params[0] || req.query.path as string;
      if (!path) {
        return res.status(400).json({ error: "Path is required" });
      }
      const content = await storage.getFileContent(path);
      res.json(content);
    } catch (error) {
      console.error("Error getting file content:", error);
      res.status(500).json({ error: "Failed to get file content" });
    }
  });

  app.post("/api/projects/scan", async (req: Request, res: Response) => {
    try {
      const project = await storage.getCurrentProject();
      if (project) {
        await storage.updateProject(project.id, { 
          status: "scanning",
          lastScanned: new Date()
        });
        
        setTimeout(async () => {
          await storage.updateProject(project.id, { status: "completed" });
        }, 3000);
      }
      res.json({ success: true, message: "Scan started" });
    } catch (error) {
      console.error("Error starting scan:", error);
      res.status(500).json({ error: "Failed to start scan" });
    }
  });

  app.get("/api/kt/conversations", async (req: Request, res: Response) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error getting conversations:", error);
      res.status(500).json({ error: "Failed to get conversations" });
    }
  });

  app.post("/api/kt/conversations", async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const conversation = await storage.createConversation({ 
        title: title || "New Chat",
        projectId: null
      });
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  app.delete("/api/kt/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  app.post("/api/kt/chat", async (req: Request, res: Response) => {
    try {
      const { conversationId, message, imageUrl } = req.body;

      const project = await storage.getCurrentProject();
      const projectId = project?.id || 1;
      const components = await storage.getComponents(projectId);
      const services = await storage.getServices(projectId);
      const routes = await storage.getRoutes(projectId);
      const flows = await storage.getCodeFlows(projectId);
      
      const projectContext = await buildProjectContext(projectId);

      const codebaseContext = `
You are a Code KT (Knowledge Transfer) Assistant specializing in this specific project. Your role is to help developers understand THIS codebase, not provide general coding advice.

IMPORTANT: Always answer based on the actual project data below. Reference specific files, components, and services from this project.

${projectContext}

YOUR CAPABILITIES:
1. Explain this project's architecture and how components are organized
2. Describe specific components, their props, and how they work together
3. Trace code flows through the application (e.g., user login, data fetching)
4. Suggest which files to modify for specific changes
5. Explain the design patterns and libraries used in THIS project
6. If shown a screenshot, identify which components from THIS project match the UI

RESPONSE GUIDELINES:
- Always reference actual files from the project using markdown links: [ComponentName](path/to/file)
- When explaining flows, show the step-by-step path through components/services
- Be specific to THIS project - don't give generic React/TypeScript advice unless asked
- Use the project's actual component names, service names, and file paths
- If asked about something not in the project, say so and suggest alternatives

FORMAT:
- Use markdown formatting for readability
- Use code blocks for code snippets
- Use tables for comparisons
- Link to files when mentioning them
`;

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      if (!openai) {
        const fallbackResponse = generateFallbackResponse(message, components, services, routes, flows, project);
        res.write(`data: ${JSON.stringify({ content: fallbackResponse })}\n\n`);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
        return;
      }

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: codebaseContext }
      ];

      if (imageUrl && imageUrl.startsWith("data:image")) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: message || "What can you tell me about this UI screenshot? Identify components and suggest relevant files for modifications." },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        });
      } else {
        messages.push({ role: "user", content: message });
      }

      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        stream: true,
        max_completion_tokens: 2048,
      });

      let fullResponse = "";
      const fileReferences: string[] = [];

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);

          const fileMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g);
          if (fileMatches) {
            fileMatches.forEach(match => {
              const pathMatch = match.match(/\(([^)]+)\)/);
              if (pathMatch && !fileReferences.includes(pathMatch[1])) {
                fileReferences.push(pathMatch[1]);
              }
            });
          }
        }
      }

      if (conversationId) {
        await storage.createMessage({
          conversationId,
          role: "user",
          content: message,
          imageUrl: imageUrl || null,
          fileReferences: []
        });
        await storage.createMessage({
          conversationId,
          role: "assistant",
          content: fullResponse,
          imageUrl: null,
          fileReferences
        });
      }

      if (fileReferences.length > 0) {
        res.write(`data: ${JSON.stringify({ fileReferences })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error in chat:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to process message" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to process message" });
      }
    }
  });

  app.post("/api/projects/configure", async (req: Request, res: Response) => {
    try {
      const { name, rootPath, framework, language, buildTool } = req.body;
      
      const project = await storage.createProject({
        name: name || "New Project",
        rootPath: rootPath || "./src",
        framework: framework || null,
        language: language || null,
        buildTool: buildTool || null,
        status: "pending"
      });

      await storage.createProjectMetrics({
        projectId: project.id,
        totalFiles: 0,
        totalLines: 0,
        totalComponents: 0,
        totalServices: 0,
        totalDirectives: 0,
        totalPipes: 0,
        totalModules: 0,
        totalRoutes: 0
      });

      res.status(201).json(project);
    } catch (error) {
      console.error("Error configuring project:", error);
      res.status(500).json({ error: "Failed to configure project" });
    }
  });

  return httpServer;
}

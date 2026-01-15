import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  MessageSquare, 
  FolderTree, 
  GitBranch,
  Workflow
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Ask about code",
      description: "Chat with AI about this codebase",
      icon: MessageSquare,
      href: "/chat",
      variant: "default" as const,
    },
    {
      title: "Explore Files",
      description: "Navigate the file structure",
      icon: FolderTree,
      href: "/explorer",
      variant: "outline" as const,
    },
    {
      title: "View Architecture",
      description: "See system architecture",
      icon: GitBranch,
      href: "/architecture",
      variant: "outline" as const,
    },
    {
      title: "Code Flows",
      description: "Trace feature workflows",
      icon: Workflow,
      href: "/workflows",
      variant: "outline" as const,
    },
  ];

  return (
    <Card data-testid="card-quick-actions">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Common tasks for code knowledge transfer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {actions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button 
                variant={action.variant}
                className="w-full justify-start gap-3"
                data-testid={`button-action-${action.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <action.icon className="w-4 h-4 flex-shrink-0" />
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium text-sm">{action.title}</span>
                  <span className="text-xs opacity-70 font-normal">{action.description}</span>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, ExternalLink, FileCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FileTreeNode } from "@shared/schema";

interface CodeViewerProps {
  file: FileTreeNode | null;
  content: string;
  isLoading?: boolean;
}

export function CodeViewer({ file, content, isLoading }: CodeViewerProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "File content has been copied",
    });
  };

  if (!file) {
    return (
      <Card className="h-full" data-testid="code-viewer-empty">
        <CardContent className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <FileCode className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-medium">No file selected</p>
          <p className="text-sm">Select a file from the tree to view its contents</p>
        </CardContent>
      </Card>
    );
  }

  const lines = content.split("\n");
  const language = file.name.split(".").pop()?.toLowerCase() || "text";

  return (
    <Card className="h-full flex flex-col" data-testid="code-viewer">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3 border-b">
        <div className="flex items-center gap-3 min-w-0">
          <FileCode className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <CardTitle className="text-base truncate">{file.name}</CardTitle>
            <span className="text-xs text-muted-foreground truncate">{file.path}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="secondary" className="text-xs">
            {language.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {lines.length} lines
          </Badge>
          <Button variant="ghost" size="icon" onClick={handleCopy} data-testid="button-copy-code">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <Skeleton key={i} className="h-4" style={{ width: `${Math.random() * 40 + 60}%` }} />
            ))}
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="flex">
              <div className="flex flex-col items-end py-4 px-3 bg-muted/30 border-r border-border text-muted-foreground select-none">
                {lines.map((_, i) => (
                  <span key={i} className="text-xs font-mono leading-6 tabular-nums">
                    {i + 1}
                  </span>
                ))}
              </div>
              <pre className="flex-1 p-4 overflow-x-auto">
                <code className="text-sm font-mono leading-6">
                  {lines.map((line, i) => (
                    <div key={i} className="hover:bg-muted/50 -mx-4 px-4">
                      {line || " "}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

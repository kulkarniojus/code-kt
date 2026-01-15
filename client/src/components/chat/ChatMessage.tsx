import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, User, Copy, FileCode, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileReference {
  path: string;
  lines?: string;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  fileReferences?: string[];
  timestamp?: Date;
}

export function ChatMessage({ role, content, imageUrl, fileReferences = [], timestamp }: ChatMessageProps) {
  const { toast } = useToast();
  const isUser = role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied",
    });
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const codeContent = part.slice(3, -3);
        const lines = codeContent.split("\n");
        const language = lines[0].trim();
        const code = lines.slice(1).join("\n");
        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden bg-muted/50 border border-border">
            <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
              <span className="text-xs font-mono text-muted-foreground">{language || "code"}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  toast({ title: "Code copied" });
                }}
                className="h-6 px-2"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <pre className="p-3 overflow-x-auto">
              <code className="text-sm font-mono">{code}</code>
            </pre>
          </div>
        );
      }
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  return (
    <div
      className={cn(
        "flex gap-3 p-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
      data-testid={`chat-message-${role}`}
    >
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className={cn(
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={cn(
        "flex flex-col gap-2 max-w-[85%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-3",
          isUser 
            ? "bg-primary text-primary-foreground rounded-br-sm" 
            : "bg-muted rounded-bl-sm"
        )}>
          {imageUrl && (
            <div className="mb-3">
              <img 
                src={imageUrl} 
                alt="Uploaded screenshot" 
                className="max-w-full rounded-lg max-h-64 object-contain"
              />
            </div>
          )}
          <div className="text-sm leading-relaxed">
            {renderContent(content)}
          </div>
        </div>

        {fileReferences.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {fileReferences.map((ref, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="gap-1 cursor-pointer hover-elevate"
                data-testid={`file-ref-${idx}`}
              >
                <FileCode className="w-3 h-3" />
                <span className="text-xs font-mono">{ref}</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          {timestamp && (
            <span className="text-xs text-muted-foreground">
              {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          {!isUser && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Copy className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

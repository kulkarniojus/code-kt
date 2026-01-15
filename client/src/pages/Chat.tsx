import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Bot,
  Sparkles
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Conversation, Message } from "@shared/schema";

interface ChatMessageType {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  fileReferences?: string[];
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations = [], isLoading: loadingConversations } = useQuery<Conversation[]>({
    queryKey: ["/api/kt/conversations"],
  });

  const createConversation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/kt/conversations", { title: "New Chat" });
      return res.json();
    },
    onSuccess: (data) => {
      setCurrentConversationId(data.id);
      setMessages([]);
      queryClient.invalidateQueries({ queryKey: ["/api/kt/conversations"] });
    },
  });

  const deleteConversation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/kt/conversations/${id}`);
    },
    onSuccess: () => {
      setCurrentConversationId(null);
      setMessages([]);
      queryClient.invalidateQueries({ queryKey: ["/api/kt/conversations"] });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string, imageFile?: File) => {
    let convId = currentConversationId;
    
    if (!convId) {
      const res = await apiRequest("POST", "/api/kt/conversations", { title: content.slice(0, 50) || "New Chat" });
      const conv = await res.json();
      convId = conv.id;
      setCurrentConversationId(conv.id);
      queryClient.invalidateQueries({ queryKey: ["/api/kt/conversations"] });
    }

    let imageUrl: string | undefined;
    if (imageFile) {
      const reader = new FileReader();
      imageUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      imageUrl,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsStreaming(true);
    const assistantMessage: ChatMessageType = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "",
      fileReferences: [],
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch(`/api/kt/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: convId,
          message: content,
          imageUrl,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last.role === "assistant") {
                      last.content += data.content;
                    }
                    return updated;
                  });
                }
                if (data.fileReferences) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last.role === "assistant") {
                      last.fileReferences = data.fileReferences;
                    }
                    return updated;
                  });
                }
              } catch {
              }
            }
          }
        }
      }
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant") {
          last.content = "Sorry, I encountered an error. Please try again.";
        }
        return updated;
      });
    }

    setIsStreaming(false);
  };

  const selectConversation = (conv: Conversation) => {
    setCurrentConversationId(conv.id);
    setMessages([]);
  };

  return (
    <div className="h-full flex" data-testid="page-chat">
      <div className="w-72 border-r border-border flex flex-col bg-muted/30">
        <div className="p-4 border-b border-border">
          <Button 
            className="w-full gap-2" 
            onClick={() => createConversation.mutate()}
            disabled={createConversation.isPending}
            data-testid="button-new-chat"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {loadingConversations ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer hover-elevate ${
                    currentConversationId === conv.id ? "bg-accent" : ""
                  }`}
                  onClick={() => selectConversation(conv)}
                  data-testid={`conversation-${conv.id}`}
                >
                  <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="flex-1 text-sm truncate">{conv.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation.mutate(conv.id);
                    }}
                    data-testid={`delete-conversation-${conv.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">Code KT Assistant</h2>
              <p className="text-xs text-muted-foreground">
                Ask about code, upload screenshots, get file suggestions
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="w-3 h-3" />
            AI Powered
          </Badge>
        </div>

        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Welcome to Code KT Assistant</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  I can help you understand this codebase, explain architecture, 
                  find files, and answer questions about the code.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "Explain the project structure",
                    "How does authentication work?",
                    "Show me the main components",
                    "Where are API routes defined?",
                  ].map((suggestion) => (
                    <Badge 
                      key={suggestion}
                      variant="outline" 
                      className="cursor-pointer hover-elevate"
                      onClick={() => handleSendMessage(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  imageUrl={msg.imageUrl}
                  fileReferences={msg.fileReferences}
                  timestamp={msg.timestamp}
                />
              ))
            )}
            {isStreaming && (
              <div className="flex items-center gap-2 px-4 py-2 text-muted-foreground">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <ChatInput
          onSend={handleSendMessage}
          disabled={isStreaming}
          placeholder="Ask about the code, upload a screenshot..."
        />
      </div>
    </div>
  );
}

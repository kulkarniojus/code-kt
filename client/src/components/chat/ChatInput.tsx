import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string, imageFile?: File) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!message.trim() && !imageFile) return;
    onSend(message.trim(), imageFile || undefined);
    setMessage("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img 
            src={imagePreview} 
            alt="Upload preview" 
            className="max-h-24 rounded-lg border border-border"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={removeImage}
            data-testid="button-remove-image"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
          data-testid="input-image-upload"
        />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          data-testid="button-attach-image"
        >
          <ImagePlus className="w-5 h-5" />
        </Button>

        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Ask about the codebase, upload a screenshot..."}
            disabled={disabled}
            className="min-h-[44px] max-h-32 resize-none pr-12"
            rows={1}
            data-testid="input-chat-message"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={disabled || (!message.trim() && !imageFile)}
          data-testid="button-send-message"
        >
          {disabled ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {["Explain this project", "Show architecture", "Where is login flow?", "List all components"].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setMessage(suggestion)}
            disabled={disabled}
            data-testid={`suggestion-${suggestion.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}

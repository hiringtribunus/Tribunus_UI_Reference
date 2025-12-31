"use client";

import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ChatComposerProps {
  onSend: (message: string) => void;
  isSending: boolean;
}

/**
 * Chat input composer with auto-grow textarea
 * Enter to send, Shift+Enter for newline
 */
export function ChatComposer({ onSend, isSending }: ChatComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    setValue(target.value);

    // Auto-grow height
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isSending) return;

    onSend(trimmed);
    setValue("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="border-t p-4 bg-white">
      <div className="max-w-[800px] mx-auto">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={value}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="resize-none min-h-[44px] max-h-[160px] rounded-sm"
            disabled={isSending}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!value.trim() || isSending}
            className="rounded-sm bg-accent hover:bg-accent-hover text-white h-[44px] w-[44px] flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-text-3 mt-2">
          Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

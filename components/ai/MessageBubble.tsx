"use client";

import type { ChatMessage } from "@/lib/ai/types";
import { cn } from "@/lib/cn";

interface MessageBubbleProps {
  message: ChatMessage;
}

/**
 * Individual message bubble with role-based styling
 * User messages: right-aligned, surface-2 background
 * Assistant messages: left-aligned, white with border
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  // Simple markdown-like formatting for bold text
  const formatContent = (content: string) => {
    // Split by ** for bold formatting
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-3 max-w-[80%] text-sm",
          isUser
            ? "bg-surface-2 text-text"
            : "bg-white border border-border text-text"
        )}
        title={new Date(message.createdAt).toLocaleString()}
      >
        <div className="whitespace-pre-wrap break-words">
          {formatContent(message.content)}
        </div>
      </div>
    </div>
  );
}

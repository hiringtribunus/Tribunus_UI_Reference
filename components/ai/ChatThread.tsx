"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/ai/types";
import { MessageBubble } from "./MessageBubble";

interface ChatThreadProps {
  messages: ChatMessage[];
}

/**
 * Scrollable chat thread container with auto-scroll to latest message
 */
export function ChatThread({ messages }: ChatThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <p className="text-sm text-text-3">Start a conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

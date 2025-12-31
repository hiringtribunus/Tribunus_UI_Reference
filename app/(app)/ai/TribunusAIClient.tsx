"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ChatMode, ChatMessage } from "@/lib/ai/types";
import { getSession, appendMessage, clearSession } from "@/lib/ai/chatStore";
import { buildPlaceholderResponse } from "@/lib/ai/placeholders";
import { ChatHeader } from "@/components/ai/ChatHeader";
import { ChatThread } from "@/components/ai/ChatThread";
import { ChatComposer } from "@/components/ai/ChatComposer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TribunusAIClientProps {
  projects: Array<{ id: string; name: string }>;
  initialProjectId: string;
  initialMode: ChatMode;
}

/**
 * Main client container for Tribunus AI chat interface
 * Manages state, localStorage sync, and URL params
 */
export function TribunusAIClient({
  projects,
  initialProjectId,
  initialMode,
}: TribunusAIClientProps) {
  const router = useRouter();

  // State
  const [projectId, setProjectId] = useState(initialProjectId);
  const [mode, setMode] = useState(initialMode);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Load initial messages from localStorage
    const session = getSession(initialProjectId, initialMode);
    return session.messages;
  });
  const [isSending, setIsSending] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Update URL when context changes
  const updateURL = useCallback(
    (newProjectId: string, newMode: ChatMode) => {
      router.replace(`/ai?projectId=${newProjectId}&mode=${newMode}`);
    },
    [router]
  );

  // Load messages when context changes
  useEffect(() => {
    const session = getSession(projectId, mode);
    setMessages(session.messages);
  }, [projectId, mode]);

  // Handle project change
  const handleProjectChange = (newProjectId: string) => {
    setProjectId(newProjectId);
    updateURL(newProjectId, mode);
  };

  // Handle mode change
  const handleModeChange = (newMode: ChatMode) => {
    setMode(newMode);
    updateURL(projectId, newMode);
  };

  // Send message
  const handleSend = async (content: string) => {
    setIsSending(true);

    // Create user message
    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    // Append user message
    const sessionAfterUser = appendMessage(projectId, mode, userMessage);
    setMessages(sessionAfterUser.messages);

    // Simulate typing delay (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Get project name
    const projectName = projects.find((p) => p.id === projectId)?.name;

    // Generate assistant response
    const assistantContent = buildPlaceholderResponse({
      mode,
      projectName: projectId === "none" ? undefined : projectName,
      message: content,
    });

    const assistantMessage: ChatMessage = {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      content: assistantContent,
      createdAt: new Date().toISOString(),
    };

    // Append assistant message
    const sessionAfterAssistant = appendMessage(
      projectId,
      mode,
      assistantMessage
    );
    setMessages(sessionAfterAssistant.messages);

    setIsSending(false);
  };

  // Clear chat
  const handleClearChat = () => {
    clearSession(projectId, mode);
    const session = getSession(projectId, mode);
    setMessages(session.messages);
    setShowClearDialog(false);
  };

  return (
    <div className="h-full flex flex-col">
      <ChatHeader
        projects={projects}
        selectedProjectId={projectId}
        activeMode={mode}
        onProjectChange={handleProjectChange}
        onModeChange={handleModeChange}
        onClearChat={() => setShowClearDialog(true)}
      />

      <ChatThread messages={messages} />

      <ChatComposer onSend={handleSend} isSending={isSending} />

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all messages from this conversation. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearChat}>
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

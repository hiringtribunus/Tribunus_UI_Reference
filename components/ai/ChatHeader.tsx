"use client";

import type { ChatMode } from "@/lib/ai/types";
import { Button } from "@/components/ui/button";
import { ProjectContextSelector } from "./ProjectContextSelector";
import { ModeToggle } from "./ModeToggle";

interface ChatHeaderProps {
  projects: Array<{ id: string; name: string }>;
  selectedProjectId: string;
  activeMode: ChatMode;
  onProjectChange: (id: string) => void;
  onModeChange: (mode: ChatMode) => void;
  onClearChat: () => void;
}

/**
 * Chat header with title, project selector, mode toggles, and clear button
 */
export function ChatHeader({
  projects,
  selectedProjectId,
  activeMode,
  onProjectChange,
  onModeChange,
  onClearChat,
}: ChatHeaderProps) {
  // Get context label
  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const contextLabel = selectedProject
    ? `Project: ${selectedProject.name}`
    : "General context";

  return (
    <div className="border-b px-6 py-4 bg-white">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-text">Tribunus AI</h1>
          <p className="text-sm text-text-3">{contextLabel}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <ProjectContextSelector
            projects={projects}
            selectedProjectId={selectedProjectId}
            onProjectChange={onProjectChange}
          />
          <ModeToggle activeMode={activeMode} onModeChange={onModeChange} />
          <Button
            variant="outline"
            onClick={onClearChat}
            className="rounded-sm"
          >
            Clear chat
          </Button>
        </div>
      </div>
    </div>
  );
}

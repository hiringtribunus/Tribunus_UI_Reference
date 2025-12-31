"use client";

import type { ChatMode } from "@/lib/ai/types";
import { cn } from "@/lib/cn";

interface ModeToggleProps {
  activeMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

const MODE_LABELS: Record<ChatMode, string> = {
  council_reports: "Council Reports",
  web: "Web",
  news: "News",
};

/**
 * Mode toggle buttons for chat (Council Reports / Web / News)
 * Pill-style buttons with active state
 */
export function ModeToggle({ activeMode, onModeChange }: ModeToggleProps) {
  const modes: ChatMode[] = ["council_reports", "web", "news"];

  return (
    <div className="flex items-center gap-2">
      {modes.map((mode) => {
        const isActive = activeMode === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onModeChange(mode)}
            className={cn(
              "h-9 px-4 rounded-full text-sm font-medium border transition-colors",
              isActive
                ? "bg-accent-soft border-accent text-accent"
                : "bg-transparent border-border text-text-2 hover:bg-surface-2"
            )}
          >
            {MODE_LABELS[mode]}
          </button>
        );
      })}
    </div>
  );
}

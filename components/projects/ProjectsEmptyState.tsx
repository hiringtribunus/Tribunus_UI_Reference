"use client";

import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface ProjectsEmptyStateProps {
  isSearching?: boolean;
  onCreateClick: () => void;
}

/**
 * Empty state shown when there are no projects
 * Shows different message for empty list vs. no search results
 */
export function ProjectsEmptyState({
  isSearching = false,
  onCreateClick,
}: ProjectsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div
        className={cn(
          "w-16 h-16 rounded-md mb-4",
          "bg-surface-2 flex items-center justify-center"
        )}
      >
        <FolderKanban className="w-8 h-8 text-text-3" />
      </div>

      {isSearching ? (
        <>
          <h3 className="text-base font-semibold text-text mb-1">
            No projects found
          </h3>
          <p className="text-sm text-text-2 mb-4 text-center max-w-sm">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-base font-semibold text-text mb-1">
            No projects yet
          </h3>
          <p className="text-sm text-text-2 mb-4 text-center max-w-sm">
            Create your first project to get started with real estate development
            planning.
          </p>
          <Button
            onClick={onCreateClick}
            className={cn(
              "bg-accent hover:bg-accent-hover text-white",
              "rounded-sm px-4 py-2 h-10",
              "transition-colors duration-150"
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </>
      )}
    </div>
  );
}

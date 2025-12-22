"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Project } from "@/lib/projects/types";
import { ProjectsToolbar } from "./ProjectsToolbar";
import { ProjectsGrid } from "./ProjectsGrid";
import { ProjectsList } from "./ProjectsList";
import { ProjectsEmptyState } from "./ProjectsEmptyState";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { ProjectActionsMenu } from "./ProjectActionsMenu";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/cn";

interface ProjectsClientProps {
  projects: Project[];
  view: "grid" | "list";
}

/**
 * Client component for projects page
 * Manages dialog states and coordinates all UI components
 */
export function ProjectsClient({ projects, view }: ProjectsClientProps) {
  const searchParams = useSearchParams();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const isSearching = !!searchParams.get("q");
  const isEmpty = projects.length === 0;

  const handleProjectMenuClick = (project: Project, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProject(project);
  };

  return (
    <>
      {/* Toolbar */}
      <ProjectsToolbar onCreateClick={() => setCreateDialogOpen(true)} />

      {/* Content */}
      {isEmpty ? (
        <ProjectsEmptyState
          isSearching={isSearching}
          onCreateClick={() => setCreateDialogOpen(true)}
        />
      ) : view === "grid" ? (
        <ProjectsGrid
          projects={projects}
          onProjectMenuClick={handleProjectMenuClick}
        />
      ) : (
        <ProjectsList
          projects={projects}
          onProjectMenuClick={handleProjectMenuClick}
        />
      )}

      {/* Create dialog */}
      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {/* Actions menu with rename/delete dialogs */}
      {selectedProject && (
        <ProjectActionsMenu
          project={selectedProject}
          trigger={
            <button
              className={cn(
                "w-8 h-8 rounded-sm",
                "flex items-center justify-center",
                "hover:bg-surface-2"
              )}
              aria-label="Project actions"
            >
              <MoreVertical className="w-4 h-4 text-text-2" />
            </button>
          }
        />
      )}
    </>
  );
}

"use client";

import type { Project } from "@/lib/projects/types";
import { ProjectCard } from "./ProjectCard";

interface ProjectsGridProps {
  projects: Project[];
  onProjectMenuClick: (project: Project, e: React.MouseEvent) => void;
}

/**
 * Responsive grid layout for project cards
 * 1 column mobile, 2 tablet, 3-4 desktop
 */
export function ProjectsGrid({
  projects,
  onProjectMenuClick,
}: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onMenuClick={(e) => onProjectMenuClick(project, e)}
        />
      ))}
    </div>
  );
}

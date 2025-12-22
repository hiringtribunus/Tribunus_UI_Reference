"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FolderKanban, MoreVertical } from "lucide-react";
import type { Project } from "@/lib/projects/types";
import { cn } from "@/lib/cn";

interface ProjectCardProps {
  project: Project;
  onMenuClick: (e: React.MouseEvent) => void;
}

/**
 * Drive-like project card for grid view
 * Click to navigate, hover for menu button
 */
export function ProjectCard({ project, onMenuClick }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className={cn(
        "group block relative",
        "bg-surface border border-border rounded-md",
        "p-4",
        "hover:border-border-strong hover:shadow-md",
        "transition-all duration-150"
      )}
    >
      {/* Icon */}
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            "w-10 h-10 rounded-sm",
            "bg-surface-2 flex items-center justify-center"
          )}
        >
          <FolderKanban className="w-5 h-5 text-text-2" />
        </div>

        {/* Actions menu button (visible on hover) */}
        <button
          onClick={onMenuClick}
          className={cn(
            "opacity-0 group-hover:opacity-100",
            "w-8 h-8 rounded-sm",
            "flex items-center justify-center",
            "hover:bg-surface-2",
            "transition-opacity duration-150"
          )}
          aria-label="Project actions"
        >
          <MoreVertical className="w-4 h-4 text-text-2" />
        </button>
      </div>

      {/* Project name */}
      <h3
        className={cn(
          "text-sm font-medium text-text mb-1",
          "truncate"
        )}
        title={project.name}
      >
        {project.name}
      </h3>

      {/* Address */}
      <p
        className={cn(
          "text-xs text-text-2 mb-2",
          "truncate"
        )}
        title={project.address || ""}
      >
        {project.address || "—"}
      </p>

      {/* Last modified */}
      <p className="text-xs text-text-3">
        Modified{" "}
        {formatDistanceToNow(new Date(project.updated_at), {
          addSuffix: true,
        })}
      </p>
    </Link>
  );
}

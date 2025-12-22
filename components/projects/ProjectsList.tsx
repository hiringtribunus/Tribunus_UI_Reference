"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical } from "lucide-react";
import type { Project } from "@/lib/projects/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/cn";

interface ProjectsListProps {
  projects: Project[];
  onProjectMenuClick: (project: Project, e: React.MouseEvent) => void;
}

/**
 * Table/list view for projects (Drive-like)
 * Click row to navigate, menu button for actions
 */
export function ProjectsList({
  projects,
  onProjectMenuClick,
}: ProjectsListProps) {
  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-text-2 font-medium">Name</TableHead>
            <TableHead className="text-text-2 font-medium">Address</TableHead>
            <TableHead className="text-text-2 font-medium">
              Last Modified
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              className={cn(
                "group border-border",
                "hover:bg-surface-2 cursor-pointer",
                "transition-colors duration-150"
              )}
            >
              <TableCell className="font-medium">
                <Link
                  href={`/projects/${project.id}`}
                  className="block w-full text-text hover:text-accent"
                >
                  {project.name}
                </Link>
              </TableCell>
              <TableCell className="text-text-2">
                {project.address || "—"}
              </TableCell>
              <TableCell className="text-text-2">
                {formatDistanceToNow(new Date(project.updated_at), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <button
                  onClick={(e) => onProjectMenuClick(project, e)}
                  className={cn(
                    "w-8 h-8 rounded-sm",
                    "flex items-center justify-center",
                    "opacity-0 group-hover:opacity-100",
                    "hover:bg-surface-3",
                    "transition-opacity duration-150"
                  )}
                  aria-label="Project actions"
                >
                  <MoreVertical className="w-4 h-4 text-text-2" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

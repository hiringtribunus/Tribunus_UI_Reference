"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RenameProjectDialog } from "./RenameProjectDialog";
import { DeleteProjectDialog } from "./DeleteProjectDialog";
import type { Project } from "@/lib/projects/types";

interface ProjectActionsMenuProps {
  project: Project;
  trigger: React.ReactNode;
}

/**
 * Dropdown menu for project actions (Rename, Delete)
 * Manages dialog states internally
 * Works with both grid and list views
 */
export function ProjectActionsMenu({
  project,
  trigger,
}: ProjectActionsMenuProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleRename = () => {
    setMenuOpen(false);
    // Small delay to avoid modal conflicts
    setTimeout(() => setRenameOpen(true), 100);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    // Small delay to avoid modal conflicts
    setTimeout(() => setDeleteOpen(true), 100);
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem onClick={handleRename}>
            <Edit className="w-4 h-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-danger focus:text-danger"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameProjectDialog
        project={project}
        open={renameOpen}
        onOpenChange={setRenameOpen}
      />

      <DeleteProjectDialog
        project={project}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}

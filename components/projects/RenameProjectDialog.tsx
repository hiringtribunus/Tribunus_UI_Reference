"use client";

import { useState, useTransition, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { renameProject } from "@/lib/projects/actions";
import type { Project } from "@/lib/projects/types";
import { cn } from "@/lib/cn";

interface RenameProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog for renaming a project
 * Pre-fills with current name
 */
export function RenameProjectDialog({
  project,
  open,
  onOpenChange,
}: RenameProjectDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

  // Pre-fill name when project changes
  useEffect(() => {
    if (project) {
      setName(project.name);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setError(null);

    startTransition(async () => {
      const result = await renameProject({
        id: project.id,
        name: name.trim(),
      });

      if (result.error) {
        setError(result.error);
      } else {
        onOpenChange(false);
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isPending) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setError(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Enter a new name for this project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">
                Project Name <span className="text-danger">*</span>
              </Label>
              <Input
                id="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "h-10 rounded-sm",
                  error && "border-danger focus-visible:ring-danger"
                )}
                disabled={isPending}
                required
                autoFocus
              />
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              className="rounded-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !name.trim() || name.trim() === project?.name}
              className={cn(
                "bg-accent hover:bg-accent-hover text-white",
                "rounded-sm"
              )}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

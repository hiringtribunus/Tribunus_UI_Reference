"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { createProject } from "@/lib/projects/actions";
import { cn } from "@/lib/cn";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog for creating a new project
 * Validates input and calls server action
 */
export function CreateProjectDialog({
  open,
  onOpenChange,
}: CreateProjectDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createProject({
        name: formData.name,
        address: formData.address || null,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.project) {
        // Success - close dialog and reset form
        onOpenChange(false);
        setFormData({ name: "", address: "" });
        // Optionally navigate to project detail
        // router.push(`/projects/${result.project.id}`);
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isPending) {
      onOpenChange(newOpen);
      if (!newOpen) {
        // Reset form when closing
        setFormData({ name: "", address: "" });
        setError(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <DialogDescription>
              Create a new real estate development project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name field */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Project Name <span className="text-danger">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Downtown Office Complex"
                className={cn(
                  "h-10 rounded-sm",
                  error && "border-danger focus-visible:ring-danger"
                )}
                disabled={isPending}
                required
                autoFocus
              />
            </div>

            {/* Address field */}
            <div className="space-y-2">
              <Label htmlFor="address">Address (optional)</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="123 Main St, San Francisco, CA 94102"
                className="h-10 rounded-sm"
                disabled={isPending}
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-danger">{error}</p>
            )}
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
              disabled={isPending || !formData.name.trim()}
              className={cn(
                "bg-accent hover:bg-accent-hover text-white",
                "rounded-sm"
              )}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

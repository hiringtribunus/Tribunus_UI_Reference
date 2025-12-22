import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FolderKanban } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Not found page for invalid project IDs
 */
export default function ProjectNotFound() {
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

      <h1 className="text-lg font-semibold text-text mb-1">
        Project not found
      </h1>
      <p className="text-sm text-text-2 mb-4 text-center max-w-sm">
        The project you&apos;re looking for doesn&apos;t exist or has been deleted.
      </p>

      <Button
        asChild
        className={cn(
          "bg-accent hover:bg-accent-hover text-white",
          "rounded-sm px-4 h-10"
        )}
      >
        <Link href="/projects">Back to Projects</Link>
      </Button>
    </div>
  );
}

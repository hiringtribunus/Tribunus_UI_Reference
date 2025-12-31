"use client";

import { Button } from "@/components/ui/button";

type ProFormaHeaderProps = {
  projectName: string | null;
  isDirty: boolean;
  isPending: boolean;
  onSave: () => void;
  onRevert: () => void;
};

export function ProFormaHeader({
  projectName,
  isDirty,
  isPending,
  onSave,
  onRevert,
}: ProFormaHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold">
          Pro Forma{projectName ? ` - ${projectName}` : ""}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onRevert}
          disabled={!isDirty || isPending}
        >
          Revert
        </Button>
        <Button onClick={onSave} disabled={!isDirty || isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

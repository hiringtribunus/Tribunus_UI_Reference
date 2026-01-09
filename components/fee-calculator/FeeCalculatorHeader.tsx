"use client";

import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";

interface FeeCalculatorHeaderProps {
  projectName: string | null;
  isDirty: boolean;
  isPending: boolean;
  onSave: () => void;
  onRevert: () => void;
}

export function FeeCalculatorHeader({
  projectName,
  isDirty,
  isPending,
  onSave,
  onRevert,
}: FeeCalculatorHeaderProps) {
  return (
    <div className="border-b px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Fee Calculator</h1>
        {projectName && (
          <p className="text-sm text-gray-600 mt-1">{projectName}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRevert}
          disabled={!isDirty || isPending}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Revert
        </Button>

        <Button
          size="sm"
          onClick={onSave}
          disabled={!isDirty || isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

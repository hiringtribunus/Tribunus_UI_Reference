"use client";

import { UseFormReturn } from "react-hook-form";
import { ProjectProfileData } from "@/lib/projects/profile-types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface DocumentChecklistSectionProps {
  form: UseFormReturn<ProjectProfileData>;
}

/**
 * Document Checklist section: Track document readiness
 * 15 standard development documents with status tracking
 */
export function DocumentChecklistSection({
  form,
}: DocumentChecklistSectionProps) {
  const checklist = form.watch("docsChecklist") || [];

  return (
    <div className="space-y-3">
      {checklist.map((item, index) => (
        <div
          key={item.key}
          className="flex items-center gap-3 p-3 border border-border rounded-md hover:bg-surface-2 transition-colors"
        >
          {/* Document Label */}
          <div className="flex-1">
            <p className="text-sm font-medium text-text">{item.label}</p>
          </div>

          {/* Status Select */}
          <Select
            value={item.status}
            onValueChange={(value) => {
              form.setValue(`docsChecklist.${index}.status`, value as any);
              form.setValue(
                `docsChecklist.${index}.updatedAt`,
                new Date().toISOString()
              );
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Badge */}
          <StatusBadge status={item.status} />
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    ready: { label: "Ready", className: "bg-success/10 text-success border-success/20" },
    in_progress: { label: "In Progress", className: "bg-warning/10 text-warning border-warning/20" },
    not_started: { label: "Not Started", className: "bg-surface-2 text-text-3 border-border" },
  };

  const { label, className } = config[status as keyof typeof config] || config.not_started;

  return <Badge variant="outline" className={className}>{label}</Badge>;
}

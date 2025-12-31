"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectContextSelectorProps {
  projects: Array<{ id: string; name: string }>;
  selectedProjectId: string; // "none" for general context
  onProjectChange: (projectId: string) => void;
}

/**
 * Project context dropdown for chat
 * First option is "None (General)" for general context
 */
export function ProjectContextSelector({
  projects,
  selectedProjectId,
  onProjectChange,
}: ProjectContextSelectorProps) {
  return (
    <Select value={selectedProjectId} onValueChange={onProjectChange}>
      <SelectTrigger className="w-[300px] h-10 rounded-sm">
        <SelectValue placeholder="Select project" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">None (General)</SelectItem>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Project = {
  id: string;
  name: string;
};

type ProjectSelectorProps = {
  projects: Project[];
  selectedProjectId: string | null;
};

export function ProjectSelector({
  projects,
  selectedProjectId,
}: ProjectSelectorProps) {
  const router = useRouter();

  const handleChange = (projectId: string) => {
    router.push(`/proforma?projectId=${projectId}`);
  };

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="project-select" className="text-sm font-medium">
        Project:
      </label>
      <Select value={selectedProjectId ?? ""} onValueChange={handleChange}>
        <SelectTrigger id="project-select" className="w-[300px]">
          <SelectValue placeholder="Select a project..." />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

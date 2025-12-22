import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects/queries";
import { getProjectSources } from "@/lib/sources/queries";
import type { ListSourcesParams } from "@/lib/sources/types";
import { ProjectSourcesClient } from "@/components/sources/ProjectSourcesClient";

interface ProjectSourcesPageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{
    q?: string;
    kind?: ListSourcesParams["kind"];
    status?: ListSourcesParams["status"];
    sort?: ListSourcesParams["sort"];
  }>;
}

export default async function ProjectSourcesPage({
  params,
  searchParams,
}: ProjectSourcesPageProps) {
  const { projectId } = await params;
  const queryParams = await searchParams;

  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  const {
    q = "",
    kind = "all",
    status = "active",
    sort = "updated_desc",
  } = queryParams;

  const sources = await getProjectSources(projectId, {
    q: q || undefined,
    kind,
    status,
    sort,
  });

  return (
    <ProjectSourcesClient
      projectId={projectId}
      project={project}
      sources={sources}
    />
  );
}

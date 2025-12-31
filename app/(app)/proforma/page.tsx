import { ensureProFormaRow } from "@/lib/proforma/queries";
import { getProjects, getProjectById } from "@/lib/projects/queries";
import { ProFormaClient } from "./ProFormaClient";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ProFormaPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const projectId =
    typeof searchParams.projectId === "string"
      ? searchParams.projectId
      : null;

  // Fetch all projects for the selector
  const projects = await getProjects();

  // If no project selected, show empty state
  if (!projectId) {
    return (
      <ProFormaClient
        initialProjects={projects}
        selectedProjectId={null}
        initialAssumptions={null}
        projectName={null}
      />
    );
  }

  // Fetch selected project and its pro forma
  const [project, assumptions] = await Promise.all([
    getProjectById(projectId),
    ensureProFormaRow(projectId),
  ]);

  return (
    <ProFormaClient
      initialProjects={projects}
      selectedProjectId={projectId}
      initialAssumptions={assumptions}
      projectName={project?.name ?? null}
    />
  );
}

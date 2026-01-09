import { ensureFeeCalculatorRow } from "@/lib/fee-calculator/queries";
import { getProjects, getProjectById } from "@/lib/projects/queries";
import { FeeCalculatorClient } from "./FeeCalculatorClient";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function FeeCalculatorPage(props: {
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
      <FeeCalculatorClient
        initialProjects={projects}
        selectedProjectId={null}
        initialAssumptions={null}
        projectName={null}
      />
    );
  }

  // Fetch selected project and its fee calculator
  const [project, assumptions] = await Promise.all([
    getProjectById(projectId),
    ensureFeeCalculatorRow(projectId),
  ]);

  return (
    <FeeCalculatorClient
      initialProjects={projects}
      selectedProjectId={projectId}
      initialAssumptions={assumptions}
      projectName={project?.name ?? null}
    />
  );
}

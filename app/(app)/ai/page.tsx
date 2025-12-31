import { getProjects } from "@/lib/projects/queries";
import { TribunusAIClient } from "./TribunusAIClient";
import type { ChatMode } from "@/lib/ai/types";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/**
 * Tribunus AI Chat Page
 * Server component that fetches projects and parses URL params
 */
export default async function TribunusAIPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  // Parse projectId from URL (default: "none")
  const projectId =
    typeof searchParams.projectId === "string"
      ? searchParams.projectId
      : "none";

  // Parse mode from URL (default: "council_reports")
  const mode =
    typeof searchParams.mode === "string" &&
    ["council_reports", "web", "news"].includes(searchParams.mode)
      ? (searchParams.mode as ChatMode)
      : "council_reports";

  // Fetch projects for selector
  const allProjects = await getProjects();
  const projects = allProjects.map((p) => ({ id: p.id, name: p.name }));

  return (
    <TribunusAIClient
      projects={projects}
      initialProjectId={projectId}
      initialMode={mode}
    />
  );
}

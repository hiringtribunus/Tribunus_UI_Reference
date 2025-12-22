import { getProjects } from "@/lib/projects/queries";
import { ProjectsClient } from "@/components/projects/ProjectsClient";

interface ProjectsPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: "updated_desc" | "created_desc" | "name_asc";
    view?: "grid" | "list";
  }>;
}

/**
 * Projects index page (Server Component)
 * Fetches projects based on URL params and renders appropriate view
 */
export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;
  const { q, sort = "updated_desc", view = "grid" } = params;

  // Fetch projects server-side
  const projects = await getProjects({ q, sort });

  return <ProjectsClient projects={projects} view={view} />;
}

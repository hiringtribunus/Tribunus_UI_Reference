import { notFound } from "next/navigation";
import { getProjectAndProfile } from "@/lib/projects/profile-queries";
import { ProjectProfileClient } from "@/components/projects/profile/ProjectProfileClient";

interface ProjectDetailPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

/**
 * Project detail page (Server Component)
 * Loads project and profile, renders client-side form
 */
export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { projectId } = await params;

  // Fetch project and profile (auto-creates profile if missing)
  const { project, profile } = await getProjectAndProfile(projectId);

  if (!project || !profile) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <ProjectProfileClient
        initialProject={project}
        initialProfile={profile}
      />
    </div>
  );
}

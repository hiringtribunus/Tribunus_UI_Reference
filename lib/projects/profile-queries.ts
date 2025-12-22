import { getMockProjectProfile } from "@/lib/supabase/mock";
import { getProjectById } from "./queries";
import { ProjectProfile } from "./profile-types";
import { Project } from "./types";

/**
 * Fetches both project and profile data
 * Profile is auto-created if it doesn't exist
 */
export async function getProjectAndProfile(projectId: string): Promise<{
  project: Project | null;
  profile: ProjectProfile | null;
}> {
  const [project, profile] = await Promise.all([
    getProjectById(projectId),
    getMockProjectProfile(projectId),
  ]);

  return { project, profile };
}

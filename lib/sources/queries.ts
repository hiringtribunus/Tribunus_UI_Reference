import type { ListSourcesParams, ProjectSource } from "./types";
import { getMockProjectSources, getMockSourceById } from "@/lib/supabase/mock";
// SUPABASE INTEGRATION: Uncomment when ready
// import { createServerClient } from "@/lib/supabase/server";

/**
 * Fetch sources for a project with search, filter, and sort options.
 * Currently backed by the in-memory mock store.
 */
export async function getProjectSources(
  projectId: string,
  params: ListSourcesParams = {}
): Promise<ProjectSource[]> {
  // MOCK DATA (temporary)
  return getMockProjectSources(projectId, params);

  // SUPABASE INTEGRATION: Uncomment when ready
  /*
  const supabase = await createServerClient();

  const { q, sort = "updated_desc", kind, status = "active" } = params;

  let query = supabase
    .from("project_sources")
    .select("*")
    .eq("project_id", projectId);

  if (kind && kind !== "all") {
    query = query.eq("kind", kind);
  }

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (q) {
    query = query.or(
      [
        `title.ilike.%${q}%`,
        `publisher.ilike.%${q}%`,
        `notes.ilike.%${q}%`,
        `url.ilike.%${q}%`,
        `project_ref.ilike.%${q}%`,
      ].join(",")
    );
  }

  switch (sort) {
    case "created_desc":
      query = query.order("created_at", { ascending: false });
      break;
    case "title_asc":
      query = query.order("title", { ascending: true });
      break;
    case "published_desc":
      query = query.order("published_at", { ascending: false, nullsFirst: false });
      break;
    case "meeting_desc":
      query = query.order("meeting_date", { ascending: false, nullsFirst: false });
      break;
    case "updated_desc":
    default:
      query = query.order("updated_at", { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching project sources:", error);
    return [];
  }

  return data || [];
  */
}

export async function getProjectSource(
  projectId: string,
  sourceId: string
): Promise<ProjectSource | null> {
  // MOCK DATA (temporary)
  return getMockSourceById(projectId, sourceId);

  // SUPABASE INTEGRATION: Uncomment when ready
  /*
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("project_sources")
    .select("*")
    .eq("project_id", projectId)
    .eq("id", sourceId)
    .single();

  if (error) {
    console.error("Error fetching source:", error);
    return null;
  }

  return data;
  */
}

/**
 * Signed URL helper (stub for private bucket support)
 * Currently returns the provided path unchanged.
 */
export async function getSignedSourceUrl(storagePath: string): Promise<string | null> {
  if (!storagePath) return null;

  // SUPABASE INTEGRATION: Uncomment when ready
  /*
  const supabase = await createServerClient();

  const { data, error } = await supabase.storage
    .from("project-sources")
    .createSignedUrl(storagePath, 60 * 30); // 30 minutes

  if (error || !data?.signedUrl) {
    console.error("Failed to get signed URL", error);
    return null;
  }

  return data.signedUrl;
  */

  return storagePath;
}

import type { Project, ProjectsQueryParams } from "./types";
import { getMockProjects, getMockProjectById } from "@/lib/supabase/mock";
// SUPABASE INTEGRATION: Uncomment when ready
// import { createServerClient } from "@/lib/supabase/server";

/**
 * Get all projects with optional search and sorting
 * Currently using mock data - replace with Supabase when ready
 */
export async function getProjects(
  params: ProjectsQueryParams = {}
): Promise<Project[]> {
  // MOCK DATA (temporary)
  return getMockProjects(params);

  // SUPABASE INTEGRATION: Uncomment when ready
  /*
  const supabase = await createServerClient();

  let query = supabase
    .from("projects")
    .select("*");

  // Search by name or address
  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,address.ilike.%${params.q}%`);
  }

  // Sort
  const sort = params.sort || "updated_desc";
  switch (sort) {
    case "updated_desc":
      query = query.order("updated_at", { ascending: false });
      break;
    case "created_desc":
      query = query.order("created_at", { ascending: false });
      break;
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
  }

  // Limit
  if (params.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data || [];
  */
}

/**
 * Get a single project by ID
 * Currently using mock data - replace with Supabase when ready
 */
export async function getProjectById(id: string): Promise<Project | null> {
  // MOCK DATA (temporary)
  return getMockProjectById(id);

  // SUPABASE INTEGRATION: Uncomment when ready
  /*
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  return data;
  */
}

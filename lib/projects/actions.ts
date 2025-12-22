"use server";

import { revalidatePath } from "next/cache";
import {
  createProjectSchema,
  renameProjectSchema,
  deleteProjectSchema,
  type CreateProjectInput,
  type RenameProjectInput,
  type DeleteProjectInput,
  type Project,
} from "./types";
import {
  createMockProject,
  updateMockProject,
  deleteMockProject,
} from "@/lib/supabase/mock";
// SUPABASE INTEGRATION: Uncomment when ready
// import { createServerClient } from "@/lib/supabase/server";

/**
 * Server Action: Create a new project
 */
export async function createProject(
  input: CreateProjectInput
): Promise<{ project?: Project; error?: string }> {
  try {
    // Validate input
    const validated = createProjectSchema.parse(input);

    // MOCK DATA (temporary)
    const project = await createMockProject(validated);

    // SUPABASE INTEGRATION: Uncomment when ready
    /*
    const supabase = await createServerClient();

    const { data: project, error } = await supabase
      .from("projects")
      .insert([validated])
      .select()
      .single();

    if (error) {
      return { error: "Failed to create project" };
    }
    */

    // Revalidate projects list
    revalidatePath("/projects");

    return { project };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to create project" };
  }
}

/**
 * Server Action: Rename a project
 */
export async function renameProject(
  input: RenameProjectInput
): Promise<{ project?: Project; error?: string }> {
  try {
    // Validate input
    const validated = renameProjectSchema.parse(input);

    // MOCK DATA (temporary)
    const project = await updateMockProject(validated.id, {
      name: validated.name,
    });

    if (!project) {
      return { error: "Project not found" };
    }

    // SUPABASE INTEGRATION: Uncomment when ready
    /*
    const supabase = await createServerClient();

    const { data: project, error } = await supabase
      .from("projects")
      .update({ name: validated.name })
      .eq("id", validated.id)
      .select()
      .single();

    if (error) {
      return { error: "Failed to rename project" };
    }

    if (!project) {
      return { error: "Project not found" };
    }
    */

    // Revalidate paths
    revalidatePath("/projects");
    revalidatePath(`/projects/${validated.id}`);

    return { project };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to rename project" };
  }
}

/**
 * Server Action: Delete a project
 */
export async function deleteProject(
  input: DeleteProjectInput
): Promise<{ ok?: true; error?: string }> {
  try {
    // Validate input
    const validated = deleteProjectSchema.parse(input);

    // MOCK DATA (temporary)
    const success = await deleteMockProject(validated.id);

    if (!success) {
      return { error: "Project not found" };
    }

    // SUPABASE INTEGRATION: Uncomment when ready
    /*
    const supabase = await createServerClient();

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", validated.id);

    if (error) {
      return { error: "Failed to delete project" };
    }
    */

    // Revalidate projects list
    revalidatePath("/projects");

    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to delete project" };
  }
}

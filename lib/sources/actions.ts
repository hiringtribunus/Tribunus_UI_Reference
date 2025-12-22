"use server";

import { revalidatePath } from "next/cache";

import type { CreateSourceInput, ProjectSource, UpdateSourceInput } from "./types";
import { createSourceSchema, updateSourceSchema } from "./validation";
import {
  createMockSource,
  deleteMockSource,
  getMockSourceById,
  updateMockSource,
} from "@/lib/supabase/mock";
// SUPABASE INTEGRATION: Uncomment when ready
// import { createServerClient } from "@/lib/supabase/server";

export async function createSource(
  projectId: string,
  input: CreateSourceInput
): Promise<{ source?: ProjectSource; error?: string }> {
  try {
    const validated = createSourceSchema.parse(input);

    // MOCK DATA (temporary)
    const source = await createMockSource(projectId, validated);

    // SUPABASE INTEGRATION: Uncomment when ready
    /*
    const supabase = await createServerClient();
    const { data: source, error } = await supabase
      .from("project_sources")
      .insert([{ ...validated, project_id: projectId, ingestion: "not_ingested" }])
      .select()
      .single();

    if (error) {
      return { error: "Failed to create source" };
    }
    */

    revalidatePath(`/projects/${projectId}/sources`);
    return { source };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to create source" };
  }
}

export async function updateSource(
  projectId: string,
  input: UpdateSourceInput
): Promise<{ source?: ProjectSource; error?: string }> {
  try {
    const validated = updateSourceSchema.parse(input);

    // MOCK DATA (temporary)
    const source = await updateMockSource(projectId, {
      ...validated,
      ingestion: "not_ingested",
    });

    if (!source) {
      return { error: "Source not found" };
    }

    // SUPABASE INTEGRATION: Uncomment when ready
    /*
    const supabase = await createServerClient();
    const { data: source, error } = await supabase
      .from("project_sources")
      .update({ ...validated, ingestion: "not_ingested" })
      .eq("project_id", projectId)
      .eq("id", validated.id)
      .select()
      .single();

    if (error) {
      return { error: "Failed to update source" };
    }

    if (!source) {
      return { error: "Source not found" };
    }
    */

    revalidatePath(`/projects/${projectId}/sources`);
    return { source };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to update source" };
  }
}

export async function deleteSource(
  projectId: string,
  sourceId: string
): Promise<{ ok?: true; error?: string }> {
  try {
    const existing = await getMockSourceById(projectId, sourceId);

    // MOCK DATA (temporary)
    const success = await deleteMockSource(projectId, sourceId);

    if (!success) {
      return { error: "Source not found" };
    }

    if (existing?.storage_path) {
      // Best-effort storage cleanup (non-blocking)
      try {
        // SUPABASE INTEGRATION: Uncomment when ready
        /*
        const supabase = await createServerClient();
        await supabase.storage.from("project-sources").remove([existing.storage_path]);
        */
      } catch (storageError) {
        console.warn("Failed to delete storage object (non-blocking)", storageError);
      }
    }

    // SUPABASE INTEGRATION: Uncomment when ready
    /*
    const supabase = await createServerClient();
    const { error } = await supabase
      .from("project_sources")
      .delete()
      .eq("project_id", projectId)
      .eq("id", sourceId);

    if (error) {
      return { error: "Failed to delete source" };
    }
    */

    revalidatePath(`/projects/${projectId}/sources`);
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to delete source" };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import type { ProFormaAssumptions, ProFormaRow } from "./types";
import { saveProFormaSchema } from "./validation";
import { saveMockProForma } from "./mock";

type SaveProFormaResult = {
  proforma: ProFormaRow | null;
  error: string | null;
};

/**
 * Save pro forma assumptions for a project.
 * Server Action with validation and revalidation.
 */
export async function saveProForma(
  projectId: string,
  assumptions: ProFormaAssumptions
): Promise<SaveProFormaResult> {
  try {
    // Validate input (no normalization needed with new structure)
    const validated = saveProFormaSchema.parse({ projectId, assumptions });

    // Save to mock layer
    const proforma = await saveMockProForma(
      validated.projectId,
      validated.assumptions
    );

    // Revalidate the pro forma page
    revalidatePath("/proforma");

    return { proforma, error: null };
  } catch (error) {
    console.error("Failed to save pro forma:", error);

    if (error instanceof Error) {
      return { proforma: null, error: error.message };
    }

    return { proforma: null, error: "Failed to save pro forma" };
  }

  /* Future Supabase implementation:
  try {
    const validated = saveProFormaSchema.parse({ projectId, assumptions });

    const { data, error } = await supabase
      .from('project_proformas')
      .upsert({
        project_id: validated.projectId,
        assumptions: validated.assumptions,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/proforma');

    return {
      proforma: {
        project_id: data.project_id,
        updated_at: data.updated_at,
        assumptions: data.assumptions as ProFormaAssumptions,
      },
      error: null,
    };
  } catch (error) {
    console.error('Failed to save pro forma:', error);

    if (error instanceof Error) {
      return { proforma: null, error: error.message };
    }

    return { proforma: null, error: 'Failed to save pro forma' };
  }
  */
}

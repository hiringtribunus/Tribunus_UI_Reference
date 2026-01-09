"use server";

import { revalidatePath } from "next/cache";
import type { FeeCalculatorAssumptions } from "./types";
import { saveMockFeeCalculator } from "./mock";

/**
 * Save fee calculator assumptions for a project.
 * Server action for client-side form submission.
 */
export async function saveFeeCalculator(
  projectId: string,
  assumptions: FeeCalculatorAssumptions
): Promise<{ error?: string }> {
  try {
    // Save to mock storage
    await saveMockFeeCalculator(projectId, assumptions);

    // Revalidate the fee calculator page
    revalidatePath(`/fee-calculator?projectId=${projectId}`);

    return {};
  } catch (error) {
    console.error("Failed to save fee calculator:", error);
    return { error: "Failed to save fee calculator" };
  }

  /* Future Supabase implementation:
  try {
    const { error } = await supabase
      .from('project_fee_calculators')
      .upsert({
        project_id: projectId,
        assumptions,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    revalidatePath(`/fee-calculator?projectId=${projectId}`);
    return {};
  } catch (error) {
    console.error("Failed to save fee calculator:", error);
    return { error: "Failed to save fee calculator" };
  }
  */
}

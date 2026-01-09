import type { FeeCalculatorAssumptions } from "./types";
import {
  getMockFeeCalculator,
  ensureMockFeeCalculator,
} from "./mock";

/**
 * Get fee calculator assumptions for a project.
 * Returns null if no fee calculator exists.
 */
export async function getFeeCalculator(
  projectId: string
): Promise<FeeCalculatorAssumptions | null> {
  // Use mock layer
  const row = await getMockFeeCalculator(projectId);

  if (!row?.assumptions) {
    return null;
  }

  return row.assumptions;

  /* Future Supabase implementation:
  const { data, error } = await supabase
    .from('project_fee_calculators')
    .select('assumptions')
    .eq('project_id', projectId)
    .single();

  if (error || !data) return null;
  return data.assumptions;
  */
}

/**
 * Ensure a fee calculator row exists for a project.
 * Creates with defaults if missing.
 */
export async function ensureFeeCalculatorRow(
  projectId: string
): Promise<FeeCalculatorAssumptions> {
  // Check if exists
  const existing = await getFeeCalculator(projectId);
  if (existing) {
    return existing;
  }

  // Use mock layer to create
  const row = await ensureMockFeeCalculator(projectId);

  return row.assumptions;

  /* Future Supabase implementation:
  const { data, error } = await supabase
    .from('project_fee_calculators')
    .upsert({
      project_id: projectId,
      assumptions: defaultAssumptions,
    })
    .select('assumptions')
    .single();

  if (error || !data) throw new Error('Failed to create fee calculator');
  return data.assumptions;
  */
}

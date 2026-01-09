import type { FeeCalculatorAssumptions, FeeCalculatorRow } from "./types";
import { defaultAssumptions } from "./defaults";

/**
 * In-memory mock "database" for fee calculator data.
 * Key: projectId, Value: FeeCalculatorRow
 */
const mockFeeCalculatorDB = new Map<string, FeeCalculatorRow>();

/**
 * Get fee calculator row from mock storage.
 */
export async function getMockFeeCalculator(
  projectId: string
): Promise<FeeCalculatorRow | null> {
  return mockFeeCalculatorDB.get(projectId) || null;
}

/**
 * Ensure a fee calculator row exists in mock storage.
 * Creates with defaults if missing.
 */
export async function ensureMockFeeCalculator(
  projectId: string
): Promise<FeeCalculatorRow> {
  const existing = mockFeeCalculatorDB.get(projectId);

  if (existing) {
    return existing;
  }

  // Create new row with defaults
  const newRow: FeeCalculatorRow = {
    project_id: projectId,
    updated_at: new Date().toISOString(),
    assumptions: defaultAssumptions,
  };

  mockFeeCalculatorDB.set(projectId, newRow);
  return newRow;
}

/**
 * Save fee calculator assumptions to mock storage.
 */
export async function saveMockFeeCalculator(
  projectId: string,
  assumptions: FeeCalculatorAssumptions
): Promise<FeeCalculatorRow> {
  const row: FeeCalculatorRow = {
    project_id: projectId,
    updated_at: new Date().toISOString(),
    assumptions,
  };

  mockFeeCalculatorDB.set(projectId, row);
  return row;
}

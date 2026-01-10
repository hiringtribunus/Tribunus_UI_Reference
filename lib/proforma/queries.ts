import type { ProFormaAssumptions } from "./types";
import {
  getMockProForma,
  ensureMockProForma,
  seedFromProfile,
} from "./mock";
import { defaultAssumptions } from "./defaults";

/**
 * Migrate legacy pro forma assumptions to current schema.
 * Handles backward compatibility for data saved with old structure.
 */
function migrateLegacyAssumptions(assumptions: any): ProFormaAssumptions {
  // If assumptions already match new structure, return as-is
  if (
    assumptions.meta?.monetization !== undefined &&
    assumptions.program?.siteAreaSqft !== undefined &&
    assumptions.timeline?.landEntitlementMonths !== undefined &&
    assumptions.softCosts !== undefined &&
    assumptions.hardCosts !== undefined
  ) {
    return assumptions as ProFormaAssumptions;
  }

  // Otherwise, start with defaults and attempt to migrate what we can
  const migrated: any = { ...defaultAssumptions };

  // Migrate meta
  if (assumptions.meta?.assetType) {
    migrated.meta.assetType = assumptions.meta.assetType;
  }
  if (assumptions.meta?.monetization) {
    migrated.meta.monetization = assumptions.meta.monetization;
  }

  // Migrate program - preserve units if available
  if (assumptions.program?.units) {
    migrated.program.units = assumptions.program.units;
  }

  // Migrate timeline - try to extract phase months from old structure
  if (assumptions.timeline?.phases) {
    migrated.timeline.landEntitlementMonths = assumptions.timeline.phases.entitlementMonths ?? 12;
    migrated.timeline.servicingMonths = 6; // Default
    migrated.timeline.constructionMonths = assumptions.timeline.phases.constructionMonths ?? 18;
  } else if (assumptions.timeline?.totalMonths) {
    // Old flat structure - split proportionally
    const total = assumptions.timeline.totalMonths;
    migrated.timeline.landEntitlementMonths = Math.round(total * 0.33);
    migrated.timeline.servicingMonths = Math.round(total * 0.17);
    migrated.timeline.constructionMonths = total - migrated.timeline.landEntitlementMonths - migrated.timeline.servicingMonths;
  }

  return migrated as ProFormaAssumptions;
}

/**
 * Get pro forma assumptions for a project.
 * Returns null if no pro forma exists.
 * Applies migration to handle legacy data formats.
 */
export async function getProForma(
  projectId: string
): Promise<ProFormaAssumptions | null> {
  // Use mock layer
  const row = await getMockProForma(projectId);

  if (!row?.assumptions) {
    return null;
  }

  // Apply migration to handle legacy data
  return migrateLegacyAssumptions(row.assumptions);

  /* Future Supabase implementation:
  const { data, error } = await supabase
    .from('project_proformas')
    .select('assumptions')
    .eq('project_id', projectId)
    .single();

  if (error || !data) return null;
  return migrateLegacyAssumptions(data.assumptions);
  */
}

/**
 * Ensure a pro forma row exists for a project.
 * Creates with defaults (optionally seeded from profile) if missing.
 */
export async function ensureProFormaRow(
  projectId: string
): Promise<ProFormaAssumptions> {
  // Check if exists
  const existing = await getProForma(projectId);
  if (existing) {
    return existing;
  }

  // Try to seed from project profile
  const seededAssumptions = await seedFromProjectProfile(projectId);

  // Use mock layer to create
  const row = await ensureMockProForma(projectId);

  // Merge seeded values if available
  if (seededAssumptions) {
    const merged = {
      ...row.assumptions,
      program: {
        ...row.assumptions.program,
        ...seededAssumptions.program,
      },
    };
    return merged;
  }

  return row.assumptions;

  /* Future Supabase implementation:
  // Attempt insert with defaults
  const assumptions = seededAssumptions || defaultAssumptions;

  const { data, error } = await supabase
    .from('project_proformas')
    .upsert({
      project_id: projectId,
      assumptions,
    })
    .select('assumptions')
    .single();

  if (error) throw error;
  return data.assumptions as ProFormaAssumptions;
  */
}

/**
 * Attempt to seed pro forma from project profile data.
 * Returns null if profile not found or has no relevant data.
 */
async function seedFromProjectProfile(
  projectId: string
): Promise<Partial<ProFormaAssumptions> | null> {
  try {
    // Import here to avoid circular deps
    const { getProjectAndProfile } = await import("../projects/profile-queries");
    const { project, profile } = await getProjectAndProfile(projectId);

    if (!profile?.data) return null;

    const { proposal } = profile.data;

    // Extract units and GFA from profile
    const units = proposal?.unitsProposed ?? null;
    const gfaValue = proposal?.gfa?.value ?? null;
    const gfaUnit = proposal?.gfa?.unit ?? "sqft";

    // Convert GFA to sqft if needed
    let saleableAreaSqft = gfaValue;
    if (gfaValue && gfaUnit === "m2") {
      saleableAreaSqft = gfaValue * 10.7639; // m2 to sqft
    }

    if (units || saleableAreaSqft) {
      return seedFromProfile(units, saleableAreaSqft);
    }

    return null;
  } catch (error) {
    // If profile queries fail, just return null
    return null;
  }
}

import { ProjectProfileData, DocChecklistKey, ProjectProfile } from "./profile-types";

export const DEFAULT_CITY = "Coquitlam";
export const DEFAULT_PROVINCE = "BC";

// Default checklist items with labels
export const DOC_CHECKLIST_ITEMS: Array<{
  key: DocChecklistKey;
  label: string;
}> = [
  { key: "title_search", label: "Title Search" },
  { key: "site_plan", label: "Site Plan" },
  { key: "context_plan", label: "Context Plan" },
  { key: "project_statistics", label: "Project Statistics" },
  { key: "floor_plans_parking", label: "Floor Plans & Parking" },
  { key: "setback_diagram", label: "Setback Diagram" },
  { key: "elevations", label: "Elevations" },
  { key: "renderings", label: "Renderings" },
  { key: "topo_survey", label: "Topographic Survey" },
  { key: "landscape_plan", label: "Landscape Plan" },
  { key: "servicing_concept", label: "Servicing Concept" },
  { key: "stormwater_plan", label: "Stormwater Management Plan" },
  { key: "arborist_report", label: "Arborist Report" },
  { key: "environmental_assessment", label: "Environmental Assessment" },
  { key: "geotechnical_report", label: "Geotechnical Report" },
];

/**
 * Creates a default profile for a new project
 */
export function createDefaultProfile(
  projectId: string,
  projectName: string,
  projectAddress?: string | null
): ProjectProfile {
  return {
    project_id: projectId,
    updated_at: new Date().toISOString(),
    setup_status: "draft",
    data: {
      overview: {
        projectDisplayName: projectName,
        siteAddress: projectAddress || "",
        city: DEFAULT_CITY,
        province: DEFAULT_PROVINCE,
      },
      location: {},
      siteLegal: {},
      planning: {
        developmentPermitAreas: {},
        constraintsFlags: {},
      },
      proposal: {
        parking: {},
      },
      docsChecklist: DOC_CHECKLIST_ITEMS.map((item) => ({
        key: item.key,
        label: item.label,
        status: "not_started" as const,
      })),
    },
  };
}

/**
 * Computes setup status based on required fields
 * Complete when ALL of these are true:
 * - overview.projectDisplayName non-empty
 * - overview.siteAddress non-empty
 * - planning.currentZoning non-empty
 * - siteLegal.lotArea.value exists and > 0
 * - proposal.applicationType exists
 * - proposal.primaryUse exists
 */
export function computeSetupStatus(data: ProjectProfileData): "draft" | "complete" {
  const required = [
    data.overview.projectDisplayName?.trim(),
    data.overview.siteAddress?.trim(),
    data.planning.currentZoning?.trim(),
    data.siteLegal.lotArea?.value && data.siteLegal.lotArea.value > 0,
    data.proposal.applicationType,
    data.proposal.primaryUse,
  ];

  return required.every(Boolean) ? "complete" : "draft";
}

/**
 * Computes FSR (Floor Space Ratio) from lot area and GFA
 * Converts both to same unit (m2) before calculation
 * Returns null if lot area is zero or invalid
 */
export function computeFSR(
  lotArea: number,
  lotUnit: "m2" | "sqft",
  gfa: number,
  gfaUnit: "m2" | "sqft"
): number | null {
  if (!lotArea || lotArea <= 0) return null;
  if (!gfa || gfa <= 0) return null;

  // Convert both to m2
  const lotM2 = lotUnit === "sqft" ? lotArea * 0.092903 : lotArea;
  const gfaM2 = gfaUnit === "sqft" ? gfa * 0.092903 : gfa;

  if (lotM2 <= 0) return null;

  // FSR = GFA / Lot Area
  return parseFloat((gfaM2 / lotM2).toFixed(2));
}

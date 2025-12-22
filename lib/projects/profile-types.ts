import { z } from "zod";

// Document checklist keys
export type DocChecklistKey =
  | "title_search"
  | "site_plan"
  | "context_plan"
  | "project_statistics"
  | "floor_plans_parking"
  | "setback_diagram"
  | "elevations"
  | "renderings"
  | "topo_survey"
  | "landscape_plan"
  | "servicing_concept"
  | "stormwater_plan"
  | "arborist_report"
  | "environmental_assessment"
  | "geotechnical_report";

// Main profile data type (matches FEATURE_3.md spec)
export interface ProjectProfileData {
  overview: {
    projectDisplayName: string;
    siteAddress: string;
    city: string;
    province: string;
    postalCode?: string;
    notes?: string;
  };

  location: {
    lat?: number;
    lng?: number;
    geocodeConfidence?: "high" | "medium" | "low" | "manual" | "unknown";
    geocodeProvider?: "mapbox";
    lastGeocodedAt?: string;
  };

  siteLegal: {
    pid?: string;
    legalDescription?: string;
    titleNotes?: string;
    lotArea?: { value: number; unit: "m2" | "sqft" };
    lotDimensions?: { widthM?: number; depthM?: number; frontageM?: number };
  };

  planning: {
    currentZoning?: string;
    ocpDesignation?: string;
    developmentPermitAreas?: {
      formAndCharacter?: boolean;
      watercourseProtection?: boolean;
      hazardousConditions?: boolean;
    };
    constraintsFlags?: {
      nearWatercourse?: boolean;
      steepSlope?: boolean;
      heritage?: boolean;
      contaminatedSite?: boolean;
      significantTrees?: boolean;
    };
    variancesRequested?: string;
  };

  proposal: {
    applicationType?:
      | "Rezoning"
      | "Development Permit"
      | "Subdivision"
      | "Building Permit"
      | "OCP Amendment"
      | "Other";
    primaryUse?:
      | "Multi-family"
      | "Single-family"
      | "Townhouse"
      | "Mixed-use"
      | "Commercial"
      | "Industrial"
      | "Other";
    unitsProposed?: number;
    gfa?: { value: number; unit: "m2" | "sqft" };
    storeys?: number;
    heightM?: number;
    siteCoveragePct?: number;
    fsr?: number;
    parking?: {
      required?: number;
      provided?: number;
      notes?: string;
    };
  };

  docsChecklist?: Array<{
    key: DocChecklistKey;
    label: string;
    status: "not_started" | "in_progress" | "ready";
    notes?: string;
    updatedAt?: string;
  }>;
}

// Full profile record
export interface ProjectProfile {
  project_id: string;
  updated_at: string;
  setup_status: "draft" | "complete";
  data: ProjectProfileData;
}

// Zod schemas for validation
export const profileDataSchema = z.object({
  overview: z.object({
    projectDisplayName: z.string().min(1, "Project name is required"),
    siteAddress: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    postalCode: z.string().optional(),
    notes: z.string().optional(),
  }),

  location: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    geocodeConfidence: z.enum(["high", "medium", "low", "manual", "unknown"]).optional(),
    geocodeProvider: z.literal("mapbox").optional(),
    lastGeocodedAt: z.string().optional(),
  }),

  siteLegal: z.object({
    pid: z.string().optional(),
    legalDescription: z.string().optional(),
    titleNotes: z.string().optional(),
    lotArea: z
      .object({
        value: z.number().min(0, "Lot area must be positive"),
        unit: z.enum(["m2", "sqft"]),
      })
      .optional(),
    lotDimensions: z
      .object({
        widthM: z.number().min(0).optional(),
        depthM: z.number().min(0).optional(),
        frontageM: z.number().min(0).optional(),
      })
      .optional(),
  }),

  planning: z.object({
    currentZoning: z.string().optional(),
    ocpDesignation: z.string().optional(),
    developmentPermitAreas: z
      .object({
        formAndCharacter: z.boolean().optional(),
        watercourseProtection: z.boolean().optional(),
        hazardousConditions: z.boolean().optional(),
      })
      .optional(),
    constraintsFlags: z
      .object({
        nearWatercourse: z.boolean().optional(),
        steepSlope: z.boolean().optional(),
        heritage: z.boolean().optional(),
        contaminatedSite: z.boolean().optional(),
        significantTrees: z.boolean().optional(),
      })
      .optional(),
    variancesRequested: z.string().optional(),
  }),

  proposal: z.object({
    applicationType: z
      .enum([
        "Rezoning",
        "Development Permit",
        "Subdivision",
        "Building Permit",
        "OCP Amendment",
        "Other",
      ])
      .optional(),
    primaryUse: z
      .enum([
        "Multi-family",
        "Single-family",
        "Townhouse",
        "Mixed-use",
        "Commercial",
        "Industrial",
        "Other",
      ])
      .optional(),
    unitsProposed: z.number().int().min(0).optional(),
    gfa: z
      .object({
        value: z.number().min(0, "GFA must be positive"),
        unit: z.enum(["m2", "sqft"]),
      })
      .optional(),
    storeys: z.number().int().min(0).optional(),
    heightM: z.number().min(0).optional(),
    siteCoveragePct: z.number().min(0).max(100).optional(),
    fsr: z.number().min(0).optional(),
    parking: z
      .object({
        required: z.number().int().min(0).optional(),
        provided: z.number().int().min(0).optional(),
        notes: z.string().optional(),
      })
      .optional(),
  }),

  docsChecklist: z
    .array(
      z.object({
        key: z.union([
          z.literal("title_search"),
          z.literal("site_plan"),
          z.literal("context_plan"),
          z.literal("project_statistics"),
          z.literal("floor_plans_parking"),
          z.literal("setback_diagram"),
          z.literal("elevations"),
          z.literal("renderings"),
          z.literal("topo_survey"),
          z.literal("landscape_plan"),
          z.literal("servicing_concept"),
          z.literal("stormwater_plan"),
          z.literal("arborist_report"),
          z.literal("environmental_assessment"),
          z.literal("geotechnical_report"),
        ]),
        label: z.string(),
        status: z.enum(["not_started", "in_progress", "ready"]),
        notes: z.string().optional(),
        updatedAt: z.string().optional(),
      })
    )
    .optional(),
});

// Schema for update action
export const updateProfileSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  profileData: profileDataSchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

import { z } from "zod";

// Helper: nullable number (finite, allow null)
const nullableNumber = z.number().finite().nullable();

// Helper: nullable percent (0-100, allow null)
const nullablePercent = z.number().min(0).max(100).nullable();

// Enums for asset type and monetization
const assetTypeSchema = z.enum(['TOWNHOME', 'MULTIFAMILY']);
const monetizationSchema = z.enum(['FOR_SALE', 'FOR_RENT']);

// Meta validation
const metaSchema = z.object({
  assetType: assetTypeSchema,
  monetization: monetizationSchema,
});

// Program & Density validation
const programSchema = z.object({
  units: z.number().int().min(1).max(50000).nullable(),
  siteAreaSqft: z.number().min(1).max(50000000).nullable(),
  fsr: z.number().min(0.1).max(20).nullable(), // Floor Space Ratio
  efficiencyPct: z.number().min(50).max(100).nullable(), // Efficiency %
});

// Acquisition validation
const acquisitionSchema = z.object({
  landPurchasePrice: nullableNumber,
  capitalizedLandCost: nullableNumber,
});

// Revenue validation
const revenueSchema = z.object({
  totalRevenue: nullableNumber,
  sellingCostPct: nullablePercent,
  sellingCostAddBack: nullableNumber,
});

// Timeline validation (3 phases)
const timelineSchema = z.object({
  landEntitlementMonths: z.number().int().min(0).max(120).nullable(),
  servicingMonths: z.number().int().min(0).max(120).nullable(),
  constructionMonths: z.number().int().min(0).max(120).nullable(),
});

// Soft Costs validation
const softCostsSchema = z.object({
  consultants: nullableNumber,
  municipalPermitFees: nullableNumber,
  otherSoftCosts: nullableNumber,
  marketing: nullableNumber,
  finance: nullableNumber,
  contingencyPct: nullablePercent,
});

// Hard Costs validation
const hardCostsSchema = z.object({
  totalConstructionHardCost: nullableNumber,
  constructionManagement: nullableNumber,
  landServicingOffsite: nullableNumber,
  landServicingOnsite: nullableNumber,
  contingencyPct: nullablePercent,
});

// Scenario validation (not nullable, defaults to 0)
const scenarioSchema = z.object({
  deltaRevenuePct: z.number().min(-20).max(20),
  deltaHardCostPct: z.number().min(-20).max(20),
  deltaDurationMonths: z.number().int().min(-12).max(12),
});

// Complete assumptions schema
export const assumptionsSchema = z.object({
  meta: metaSchema,
  program: programSchema,
  acquisition: acquisitionSchema,
  revenue: revenueSchema,
  timeline: timelineSchema,
  softCosts: softCostsSchema,
  hardCosts: hardCostsSchema,
  scenario: scenarioSchema,
});

// Server action input schema (includes project_id)
export const saveProFormaSchema = z.object({
  projectId: z.string().uuid(),
  assumptions: assumptionsSchema,
});

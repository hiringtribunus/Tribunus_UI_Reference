import { z } from "zod";

// Helper: nullable number (finite, allow null)
const nullableNumber = z.number().finite().nullable();

// Helper: nullable percent (0-100, allow null)
const nullablePercent = z.number().min(0).max(100).nullable();

// Program validation
const programSchema = z.object({
  units: z.number().int().min(1).max(50000).nullable(),
  saleableAreaSqft: z.number().min(1).max(5000000).nullable(),
});

// Acquisition validation
const acquisitionSchema = z.object({
  landPrice: nullableNumber,
  closingCostsPct: nullablePercent,
});

// Revenue validation
const revenueSchema = z.object({
  salePricePerSqft: nullableNumber,
  otherRevenue: nullableNumber,
  salesCommissionPct: nullablePercent,
});

// Costs validation
const costsSchema = z.object({
  hardCostPerSqft: nullableNumber,
  softCostPctOfHard: nullablePercent,
  contingencyPctOfHard: nullablePercent,
  contingencyPctOfSoft: nullablePercent,
  devFeePctOfCost: nullablePercent,
});

// Financing validation
const financingSchema = z.object({
  loanToCostPct: nullablePercent,
  interestRatePct: nullablePercent,
  lenderFeePct: nullablePercent,
  interestCoverageFactor: z.number().min(0).max(1).nullable(),
});

// Timeline validation
const timelineSchema = z.object({
  totalMonths: z.number().int().min(1).max(120).nullable(),
});

// Scenario validation (not nullable, defaults to 0)
const scenarioSchema = z.object({
  deltaSalePricePerSqftPct: z.number().min(-10).max(10),
  deltaHardCostPerSqftPct: z.number().min(-10).max(10),
  deltaInterestRatePct: z.number().min(-10).max(10), // Absolute points
  deltaTotalMonths: z.number().int().min(-6).max(6),
});

// Complete assumptions schema
export const assumptionsSchema = z.object({
  program: programSchema,
  acquisition: acquisitionSchema,
  revenue: revenueSchema,
  costs: costsSchema,
  financing: financingSchema,
  timeline: timelineSchema,
  scenario: scenarioSchema,
});

// Server action input schema (includes project_id)
export const saveProFormaSchema = z.object({
  projectId: z.string().uuid(),
  assumptions: assumptionsSchema,
});

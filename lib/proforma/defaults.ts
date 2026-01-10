import type { ProFormaAssumptions } from "./types";

// Default assumptions with all numeric fields as null and scenario deltas as 0
export const defaultAssumptions: ProFormaAssumptions = {
  meta: {
    assetType: 'TOWNHOME',
    monetization: 'FOR_SALE',
  },
  program: {
    units: null,
    siteAreaSqft: null,
    fsr: null,
    efficiencyPct: 85, // Default efficiency 85%
  },
  acquisition: {
    landPurchasePrice: null,
    capitalizedLandCost: null,
  },
  revenue: {
    totalRevenue: null,
    sellingCostPct: null,
    sellingCostAddBack: null,
  },
  timeline: {
    landEntitlementMonths: 12,
    servicingMonths: 6,
    constructionMonths: 18,
  },
  softCosts: {
    consultants: null,
    municipalPermitFees: null,
    otherSoftCosts: null,
    marketing: null,
    finance: null,
    contingencyPct: 5, // Default 5% soft contingency
  },
  hardCosts: {
    totalConstructionHardCost: null,
    constructionManagement: null,
    landServicingOffsite: null,
    landServicingOnsite: null,
    contingencyPct: 5, // Default 5% hard contingency
  },
  scenario: {
    deltaRevenuePct: 0,
    deltaHardCostPct: 0,
    deltaDurationMonths: 0,
  },
};

// Recommended slider ranges for scenario analysis
export const scenarioRanges = {
  deltaRevenuePct: { min: -20, max: 20, step: 1 },
  deltaHardCostPct: { min: -20, max: 20, step: 1 },
  deltaDurationMonths: { min: -12, max: 12, step: 1 },
} as const;

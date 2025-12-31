import type { ProFormaAssumptions } from "./types";

// Default assumptions with all numeric fields as null and scenario deltas as 0
export const defaultAssumptions: ProFormaAssumptions = {
  program: {
    units: null,
    saleableAreaSqft: null,
  },
  acquisition: {
    landPrice: null,
    closingCostsPct: null,
  },
  revenue: {
    salePricePerSqft: null,
    otherRevenue: null,
    salesCommissionPct: null,
  },
  costs: {
    hardCostPerSqft: null,
    softCostPctOfHard: null,
    contingencyPctOfHard: null,
    contingencyPctOfSoft: null,
    devFeePctOfCost: null,
  },
  financing: {
    loanToCostPct: null,
    interestRatePct: null,
    lenderFeePct: null,
    interestCoverageFactor: 0.5, // Default to 50% average outstanding
  },
  timeline: {
    totalMonths: null,
  },
  scenario: {
    deltaSalePricePerSqftPct: 0,
    deltaHardCostPerSqftPct: 0,
    deltaInterestRatePct: 0,
    deltaTotalMonths: 0,
  },
};

// Recommended slider ranges for scenario analysis
export const scenarioRanges = {
  deltaSalePricePerSqftPct: { min: -10, max: 10, step: 1 },
  deltaHardCostPerSqftPct: { min: -10, max: 10, step: 1 },
  deltaInterestRatePct: { min: -2, max: 2, step: 0.1 },
  deltaTotalMonths: { min: -6, max: 6, step: 1 },
} as const;

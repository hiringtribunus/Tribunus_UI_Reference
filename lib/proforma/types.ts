// Pro Forma types for assumptions, outputs, and database row

export type AssetType = 'TOWNHOME' | 'MULTIFAMILY';
export type Monetization = 'FOR_SALE' | 'FOR_RENT';
export type PhaseType = 'LAND_ENTITLEMENT' | 'SERVICING' | 'CONSTRUCTION';

export type MonthlyCashflowRow = {
  monthIndex: number; // 1..N
  phase: PhaseType;
  // Uses (costs)
  land: number;
  soft: number;
  hard: number;
  // Sources (revenue)
  revenue: number; // Revenue during construction phase
};

export type ProFormaAssumptions = {
  // Meta
  meta: {
    assetType: AssetType;
    monetization: Monetization;
  };

  // Program & Density
  program: {
    units: number | null;
    siteAreaSqft: number | null; // Site area in square feet
    fsr: number | null; // Floor Space Ratio
    efficiencyPct: number | null; // Efficiency percentage (e.g., 85 = 85%)
  };

  // Acquisition
  acquisition: {
    landPurchasePrice: number | null; // Raw land purchase price
    capitalizedLandCost: number | null; // All-in land cost used in cost stack
  };

  // Revenue
  revenue: {
    totalRevenue: number | null; // Total revenue ($)
    sellingCostPct: number | null; // Selling cost (%)
    sellingCostAddBack: number | null; // Selling cost add back ($)
  };

  // Timeline (3 phases)
  timeline: {
    landEntitlementMonths: number | null;
    servicingMonths: number | null;
    constructionMonths: number | null;
  };

  // Soft Costs (lump-sum inputs)
  softCosts: {
    consultants: number | null;
    municipalPermitFees: number | null;
    otherSoftCosts: number | null;
    marketing: number | null;
    finance: number | null;
    contingencyPct: number | null; // % of soft cost base
  };

  // Hard Costs
  hardCosts: {
    totalConstructionHardCost: number | null; // Lump sum
    constructionManagement: number | null;
    landServicingOffsite: number | null;
    landServicingOnsite: number | null;
    contingencyPct: number | null; // % of hard cost base
  };

  // Scenario sliders (UI-only; persist if user saves)
  scenario: {
    deltaRevenuePct: number; // e.g., -10..+10
    deltaHardCostPct: number; // e.g., -10..+10
    deltaDurationMonths: number; // e.g., -6..+6 months
  };
};

export type ProFormaOutputs = {
  // Derived/computed program metrics
  computed: {
    grossBuildableArea: number | null; // Site Area × FSR
    netSaleableSF: number | null; // GBA × Efficiency
    acres: number | null; // Site Area ÷ 43,560
    unitsPerAcre: number | null; // Units ÷ Acres
  };

  // Density benchmarks (using Land Purchase Price only)
  densityBenchmarks: {
    dollarPerLandSF: number | null;
    dollarPerBuildableSF: number | null;
    dollarPerSaleableSF: number | null;
    dollarPerAcre: number | null;
  };

  // Effective values after scenario deltas
  eff: {
    totalRevenue: number | null;
    totalConstructionHardCost: number | null;
    totalMonths: number | null;
    landEntitlementMonths: number | null;
    servicingMonths: number | null;
    constructionMonths: number | null;
  };

  // Revenue calculations
  revenue: {
    totalRevenue: number | null; // After delta
    sellingCost: number | null; // Revenue × sellingCostPct
    sellingCostAddBack: number | null;
    netRevenue: number | null; // Revenue - sellingCost + sellingCostAddBack
  };

  // Soft cost calculations
  softCosts: {
    softBase: number | null; // Sum of consultants, municipal, other, marketing, finance
    softContingency: number | null; // softBase × contingencyPct
    landAndSoftTotal: number | null; // capitalizedLandCost + softBase + softContingency
    // Normalized
    softBasePerUnit: number | null;
    softBasePerBuildableSF: number | null;
    softBasePerSaleableSF: number | null;
  };

  // Hard cost calculations
  hardCosts: {
    hardContingencyBase: number | null; // Construction + CM + Servicing (both)
    hardContingency: number | null; // hardContingencyBase × contingencyPct
    constructionAndHardTotal: number | null; // hardContingencyBase + hardContingency
    // Normalized
    hardBasePerUnit: number | null;
    hardBasePerBuildableSF: number | null;
    hardBasePerSaleableSF: number | null;
  };

  // Totals
  totals: {
    totalProjectCost: number | null; // landAndSoftTotal + constructionAndHardTotal
    profit: number | null; // netRevenue - totalProjectCost
    returnOnCostPct: number | null; // (profit / totalProjectCost) × 100
    // Normalized
    revenuePerSaleableSF: number | null;
  };

  // Monthly cashflow breakdown (for display only)
  monthly: {
    rows: MonthlyCashflowRow[];
  };
};

export type ProFormaRow = {
  project_id: string;
  updated_at: string;
  assumptions: ProFormaAssumptions;
};

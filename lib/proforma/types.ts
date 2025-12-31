// Pro Forma types for assumptions, outputs, and database row

export type ProFormaAssumptions = {
  // Program
  program: {
    units: number | null;
    saleableAreaSqft: number | null; // GFA/saleable area for revenue + cost per sqft
  };

  // Acquisition
  acquisition: {
    landPrice: number | null; // CAD
    closingCostsPct: number | null; // % of land price (legal, transfer taxes, etc)
  };

  // Revenue
  revenue: {
    salePricePerSqft: number | null; // CAD/sqft
    otherRevenue: number | null; // CAD (parking, storage, misc)
    salesCommissionPct: number | null; // % of total revenue
  };

  // Costs
  costs: {
    hardCostPerSqft: number | null; // CAD/sqft
    softCostPctOfHard: number | null; // % of hard
    contingencyPctOfHard: number | null; // % of hard
    contingencyPctOfSoft: number | null; // % of soft
    devFeePctOfCost: number | null; // % of (land + hard + soft + contingency)
  };

  // Financing (simple interest approximation)
  financing: {
    loanToCostPct: number | null; // % LTC
    interestRatePct: number | null; // annual %
    lenderFeePct: number | null; // % of loan amount (one-time)
    interestCoverageFactor: number | null; // 0..1 multiplier for avg outstanding (default 0.5)
  };

  // Timeline (used for interest approximation)
  timeline: {
    totalMonths: number | null; // total project duration
  };

  // Scenario sliders (UI-only; not persisted unless user saves)
  scenario: {
    deltaSalePricePerSqftPct: number; // e.g., -10..+10
    deltaHardCostPerSqftPct: number; // e.g., -10..+10
    deltaInterestRatePct: number; // e.g., -2..+2 (absolute points)
    deltaTotalMonths: number; // e.g., -6..+6 months
  };
};

export type ProFormaOutputs = {
  // Derived inputs (after scenario)
  eff: {
    salePricePerSqft: number | null;
    hardCostPerSqft: number | null;
    interestRatePct: number | null;
    totalMonths: number | null;
  };

  // Core $ values
  revenue: {
    grossRevenue: number | null;
    salesCommission: number | null;
    netRevenue: number | null;
  };

  costs: {
    landTotal: number | null; // land + closing costs
    hard: number | null;
    soft: number | null;
    contingency: number | null;
    devFee: number | null;
    subtotalBeforeFinancing: number | null;
  };

  financing: {
    loanAmount: number | null;
    lenderFee: number | null;
    interest: number | null;
    totalFinancing: number | null;
  };

  totals: {
    totalCost: number | null;
    profit: number | null;
    profitMarginPct: number | null; // profit / netRevenue
    equityNeeded: number | null; // totalCost - loanAmount
    equityMultiple: number | null; // (equity + profit)/equity
    roiPct: number | null; // profit / equity
  };
};

export type ProFormaRow = {
  project_id: string;
  updated_at: string;
  assumptions: ProFormaAssumptions;
};

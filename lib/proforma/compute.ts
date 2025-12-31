import type { ProFormaAssumptions, ProFormaOutputs } from "./types";

/**
 * Compute pro forma outputs from assumptions.
 * @param base - The base assumptions
 * @param applyScenario - Whether to apply scenario deltas
 * @returns Computed outputs with all financial metrics
 */
export function computeProForma(
  base: ProFormaAssumptions,
  applyScenario: boolean
): ProFormaOutputs {
  // 1. Apply scenario deltas to get effective values
  const eff = computeEffectiveValues(base, applyScenario);

  // 2. Compute revenue
  const revenue = computeRevenue(base, eff);

  // 3. Compute costs (pre-financing)
  const costs = computeCosts(base, eff);

  // 4. Compute financing
  const financing = computeFinancing(base, eff, costs);

  // 5. Compute totals
  const totals = computeTotals(revenue, costs, financing);

  return {
    eff,
    revenue,
    costs,
    financing,
    totals,
  };
}

/**
 * Compute effective values after applying scenario deltas.
 */
function computeEffectiveValues(
  base: ProFormaAssumptions,
  applyScenario: boolean
): ProFormaOutputs["eff"] {
  if (!applyScenario) {
    // No scenario: return base values
    return {
      salePricePerSqft: base.revenue.salePricePerSqft,
      hardCostPerSqft: base.costs.hardCostPerSqft,
      interestRatePct: base.financing.interestRatePct,
      totalMonths: base.timeline.totalMonths,
    };
  }

  // Apply scenario deltas
  const { scenario } = base;

  const effSalePricePerSqft =
    base.revenue.salePricePerSqft !== null
      ? Math.max(
          0,
          base.revenue.salePricePerSqft *
            (1 + scenario.deltaSalePricePerSqftPct / 100)
        )
      : null;

  const effHardCostPerSqft =
    base.costs.hardCostPerSqft !== null
      ? Math.max(
          0,
          base.costs.hardCostPerSqft *
            (1 + scenario.deltaHardCostPerSqftPct / 100)
        )
      : null;

  const effInterestRatePct =
    base.financing.interestRatePct !== null
      ? Math.max(0, base.financing.interestRatePct + scenario.deltaInterestRatePct)
      : null;

  const effTotalMonths =
    base.timeline.totalMonths !== null
      ? Math.max(1, base.timeline.totalMonths + scenario.deltaTotalMonths)
      : null;

  return {
    salePricePerSqft: effSalePricePerSqft,
    hardCostPerSqft: effHardCostPerSqft,
    interestRatePct: effInterestRatePct,
    totalMonths: effTotalMonths,
  };
}

/**
 * Compute revenue metrics.
 */
function computeRevenue(
  base: ProFormaAssumptions,
  eff: ProFormaOutputs["eff"]
): ProFormaOutputs["revenue"] {
  // grossRevenue = saleableAreaSqft * effSalePricePerSqft + otherRevenue
  const grossRevenue =
    base.program.saleableAreaSqft !== null && eff.salePricePerSqft !== null
      ? base.program.saleableAreaSqft * eff.salePricePerSqft +
        (base.revenue.otherRevenue ?? 0)
      : null;

  // salesCommission = grossRevenue * (salesCommissionPct/100)
  const salesCommission =
    grossRevenue !== null && base.revenue.salesCommissionPct !== null
      ? grossRevenue * (base.revenue.salesCommissionPct / 100)
      : null;

  // netRevenue = grossRevenue - salesCommission
  const netRevenue =
    grossRevenue !== null && salesCommission !== null
      ? grossRevenue - salesCommission
      : null;

  return {
    grossRevenue,
    salesCommission,
    netRevenue,
  };
}

/**
 * Compute cost metrics (pre-financing).
 */
function computeCosts(
  base: ProFormaAssumptions,
  eff: ProFormaOutputs["eff"]
): ProFormaOutputs["costs"] {
  // hard = saleableAreaSqft * effHardCostPerSqft
  const hard =
    base.program.saleableAreaSqft !== null && eff.hardCostPerSqft !== null
      ? base.program.saleableAreaSqft * eff.hardCostPerSqft
      : null;

  // soft = hard * (softCostPctOfHard/100)
  const soft =
    hard !== null && base.costs.softCostPctOfHard !== null
      ? hard * (base.costs.softCostPctOfHard / 100)
      : null;

  // contHard = hard * (contingencyPctOfHard/100)
  const contHard =
    hard !== null && base.costs.contingencyPctOfHard !== null
      ? hard * (base.costs.contingencyPctOfHard / 100)
      : null;

  // contSoft = soft * (contingencyPctOfSoft/100)
  const contSoft =
    soft !== null && base.costs.contingencyPctOfSoft !== null
      ? soft * (base.costs.contingencyPctOfSoft / 100)
      : null;

  // contingency = contHard + contSoft
  const contingency =
    contHard !== null || contSoft !== null
      ? (contHard ?? 0) + (contSoft ?? 0)
      : null;

  // landClosing = landPrice * (closingCostsPct/100)
  const landClosing =
    base.acquisition.landPrice !== null &&
    base.acquisition.closingCostsPct !== null
      ? base.acquisition.landPrice * (base.acquisition.closingCostsPct / 100)
      : null;

  // landTotal = landPrice + landClosing
  const landTotal =
    base.acquisition.landPrice !== null
      ? base.acquisition.landPrice + (landClosing ?? 0)
      : null;

  // subtotalBeforeDevFee = landTotal + hard + soft + contingency
  const subtotalBeforeDevFee =
    landTotal !== null || hard !== null || soft !== null || contingency !== null
      ? (landTotal ?? 0) + (hard ?? 0) + (soft ?? 0) + (contingency ?? 0)
      : null;

  // devFee = subtotalBeforeDevFee * (devFeePctOfCost/100)
  const devFee =
    subtotalBeforeDevFee !== null && base.costs.devFeePctOfCost !== null
      ? subtotalBeforeDevFee * (base.costs.devFeePctOfCost / 100)
      : null;

  // subtotalBeforeFinancing = subtotalBeforeDevFee + devFee
  const subtotalBeforeFinancing =
    subtotalBeforeDevFee !== null
      ? subtotalBeforeDevFee + (devFee ?? 0)
      : null;

  return {
    landTotal,
    hard,
    soft,
    contingency,
    devFee,
    subtotalBeforeFinancing,
  };
}

/**
 * Compute financing metrics.
 */
function computeFinancing(
  base: ProFormaAssumptions,
  eff: ProFormaOutputs["eff"],
  costs: ProFormaOutputs["costs"]
): ProFormaOutputs["financing"] {
  // loanAmount = subtotalBeforeFinancing * (loanToCostPct/100)
  const loanAmount =
    costs.subtotalBeforeFinancing !== null &&
    base.financing.loanToCostPct !== null
      ? costs.subtotalBeforeFinancing * (base.financing.loanToCostPct / 100)
      : null;

  // lenderFee = loanAmount * (lenderFeePct/100)
  const lenderFee =
    loanAmount !== null && base.financing.lenderFeePct !== null
      ? loanAmount * (base.financing.lenderFeePct / 100)
      : null;

  // avgOutstanding = loanAmount * interestCoverageFactor
  const interestCoverageFactor = base.financing.interestCoverageFactor ?? 0.5;
  const avgOutstanding =
    loanAmount !== null ? loanAmount * interestCoverageFactor : null;

  // interest = avgOutstanding * (effInterestRatePct/100) * (effTotalMonths/12)
  const interest =
    avgOutstanding !== null &&
    eff.interestRatePct !== null &&
    eff.totalMonths !== null
      ? avgOutstanding * (eff.interestRatePct / 100) * (eff.totalMonths / 12)
      : null;

  // totalFinancing = lenderFee + interest
  const totalFinancing =
    lenderFee !== null || interest !== null
      ? (lenderFee ?? 0) + (interest ?? 0)
      : null;

  return {
    loanAmount,
    lenderFee,
    interest,
    totalFinancing,
  };
}

/**
 * Compute total metrics and returns.
 */
function computeTotals(
  revenue: ProFormaOutputs["revenue"],
  costs: ProFormaOutputs["costs"],
  financing: ProFormaOutputs["financing"]
): ProFormaOutputs["totals"] {
  // totalCost = subtotalBeforeFinancing + totalFinancing
  const totalCost =
    costs.subtotalBeforeFinancing !== null || financing.totalFinancing !== null
      ? (costs.subtotalBeforeFinancing ?? 0) + (financing.totalFinancing ?? 0)
      : null;

  // profit = netRevenue - totalCost
  const profit =
    revenue.netRevenue !== null && totalCost !== null
      ? revenue.netRevenue - totalCost
      : null;

  // profitMarginPct = (profit / netRevenue) * 100
  const profitMarginPct =
    profit !== null && revenue.netRevenue !== null && revenue.netRevenue !== 0
      ? (profit / revenue.netRevenue) * 100
      : null;

  // equityNeeded = totalCost - loanAmount
  const equityNeeded =
    totalCost !== null && financing.loanAmount !== null
      ? totalCost - financing.loanAmount
      : totalCost; // If no loan, equity = total cost

  // roiPct = (profit / equityNeeded) * 100
  const roiPct =
    profit !== null && equityNeeded !== null && equityNeeded !== 0
      ? (profit / equityNeeded) * 100
      : null;

  // equityMultiple = (equityNeeded + profit) / equityNeeded
  const equityMultiple =
    equityNeeded !== null && equityNeeded !== 0 && profit !== null
      ? (equityNeeded + profit) / equityNeeded
      : null;

  return {
    totalCost,
    profit,
    profitMarginPct,
    equityNeeded,
    equityMultiple,
    roiPct,
  };
}

/**
 * Compute delta between two values.
 */
export function computeDelta(
  base: number | null,
  scenario: number | null
): number | null {
  if (base === null || scenario === null) return null;
  return scenario - base;
}

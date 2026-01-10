import type {
  ProFormaAssumptions,
  ProFormaOutputs,
  MonthlyCashflowRow,
} from "./types";

/**
 * Compute pro forma outputs from assumptions (developer-grade pro forma engine).
 * @param base - The base assumptions
 * @param applyScenario - Whether to apply scenario deltas
 * @returns Computed outputs with all financial metrics
 */
export function computeProForma(
  base: ProFormaAssumptions,
  applyScenario: boolean
): ProFormaOutputs {
  // 1. Compute derived program metrics
  const computed = computeDerivedMetrics(base);

  // 2. Compute density benchmarks (using Land Purchase Price only)
  const densityBenchmarks = computeDensityBenchmarks(base, computed);

  // 3. Apply scenario deltas to get effective values
  const eff = computeEffectiveValues(base, applyScenario);

  // 4. Compute revenue
  const revenue = computeRevenue(base, eff);

  // 5. Compute soft costs
  const softCosts = computeSoftCosts(base, computed);

  // 6. Compute hard costs
  const hardCosts = computeHardCosts(base, eff, computed);

  // 7. Compute totals
  const totals = computeTotals(revenue, softCosts, hardCosts, computed);

  // 8. Generate monthly cashflow breakdown (for display only)
  const monthlyRows = generateMonthlyCashflows(
    base,
    eff,
    softCosts,
    hardCosts,
    revenue
  );

  return {
    computed,
    densityBenchmarks,
    eff,
    revenue,
    softCosts,
    hardCosts,
    totals,
    monthly: {
      rows: monthlyRows,
    },
  };
}

/**
 * Compute derived program metrics.
 */
function computeDerivedMetrics(
  base: ProFormaAssumptions
): ProFormaOutputs["computed"] {
  // Gross Buildable Area (GBA) = Site Area × FSR
  const grossBuildableArea =
    base.program.siteAreaSqft !== null && base.program.fsr !== null
      ? base.program.siteAreaSqft * base.program.fsr
      : null;

  // Net Saleable SF = GBA × Efficiency
  const netSaleableSF =
    grossBuildableArea !== null && base.program.efficiencyPct !== null
      ? grossBuildableArea * (base.program.efficiencyPct / 100)
      : null;

  // Acres = Site Area ÷ 43,560
  const acres =
    base.program.siteAreaSqft !== null
      ? base.program.siteAreaSqft / 43560
      : null;

  // Units per Acre = Units ÷ Acres
  const unitsPerAcre =
    base.program.units !== null && acres !== null && acres > 0
      ? base.program.units / acres
      : null;

  return {
    grossBuildableArea,
    netSaleableSF,
    acres,
    unitsPerAcre,
  };
}

/**
 * Compute density benchmarks (using Land Purchase Price only, never capitalized land).
 */
function computeDensityBenchmarks(
  base: ProFormaAssumptions,
  computed: ProFormaOutputs["computed"]
): ProFormaOutputs["densityBenchmarks"] {
  const landPrice = base.acquisition.landPurchasePrice;

  // $ / Land SF = Land Price ÷ Site Area
  const dollarPerLandSF =
    landPrice !== null && base.program.siteAreaSqft !== null && base.program.siteAreaSqft > 0
      ? landPrice / base.program.siteAreaSqft
      : null;

  // $ / Buildable SF = Land Price ÷ GBA
  const dollarPerBuildableSF =
    landPrice !== null && computed.grossBuildableArea !== null && computed.grossBuildableArea > 0
      ? landPrice / computed.grossBuildableArea
      : null;

  // $ / Saleable SF = Land Price ÷ Net Saleable SF
  const dollarPerSaleableSF =
    landPrice !== null && computed.netSaleableSF !== null && computed.netSaleableSF > 0
      ? landPrice / computed.netSaleableSF
      : null;

  // $ / Acre = Land Price ÷ Acres
  const dollarPerAcre =
    landPrice !== null && computed.acres !== null && computed.acres > 0
      ? landPrice / computed.acres
      : null;

  return {
    dollarPerLandSF,
    dollarPerBuildableSF,
    dollarPerSaleableSF,
    dollarPerAcre,
  };
}

/**
 * Compute effective values after applying scenario deltas.
 */
function computeEffectiveValues(
  base: ProFormaAssumptions,
  applyScenario: boolean
): ProFormaOutputs["eff"] {
  // Apply scenario deltas
  const deltaRevenue = applyScenario ? base.scenario.deltaRevenuePct : 0;
  const deltaHardCost = applyScenario ? base.scenario.deltaHardCostPct : 0;
  const deltaMonths = applyScenario ? base.scenario.deltaDurationMonths : 0;

  // Effective revenue = totalRevenue × (1 + deltaRevenuePct / 100)
  const totalRevenue =
    base.revenue.totalRevenue !== null
      ? Math.max(0, base.revenue.totalRevenue * (1 + deltaRevenue / 100))
      : null;

  // Effective hard cost = totalConstructionHardCost × (1 + deltaHardCostPct / 100)
  const totalConstructionHardCost =
    base.hardCosts.totalConstructionHardCost !== null
      ? Math.max(0, base.hardCosts.totalConstructionHardCost * (1 + deltaHardCost / 100))
      : null;

  // Compute base total months
  const baseLandEntitlement = base.timeline.landEntitlementMonths ?? 0;
  const baseServicing = base.timeline.servicingMonths ?? 0;
  const baseConstruction = base.timeline.constructionMonths ?? 0;
  const baseTotal = baseLandEntitlement + baseServicing + baseConstruction;

  // Apply duration delta proportionally to each phase
  let effLandEntitlement = baseLandEntitlement;
  let effServicing = baseServicing;
  let effConstruction = baseConstruction;

  if (baseTotal > 0) {
    const effTotal = Math.max(1, baseTotal + deltaMonths);
    const factor = effTotal / baseTotal;

    effLandEntitlement = Math.max(0, Math.round(baseLandEntitlement * factor));
    effServicing = Math.max(0, Math.round(baseServicing * factor));
    effConstruction = Math.max(0, Math.round(baseConstruction * factor));
  }

  const totalMonths = effLandEntitlement + effServicing + effConstruction;

  return {
    totalRevenue,
    totalConstructionHardCost,
    totalMonths,
    landEntitlementMonths: effLandEntitlement,
    servicingMonths: effServicing,
    constructionMonths: effConstruction,
  };
}

/**
 * Compute revenue metrics.
 */
function computeRevenue(
  base: ProFormaAssumptions,
  eff: ProFormaOutputs["eff"]
): ProFormaOutputs["revenue"] {
  const totalRevenue = eff.totalRevenue;

  // Selling Cost = Revenue × Selling Cost %
  const sellingCost =
    totalRevenue !== null && base.revenue.sellingCostPct !== null
      ? totalRevenue * (base.revenue.sellingCostPct / 100)
      : null;

  const sellingCostAddBack = base.revenue.sellingCostAddBack ?? 0;

  // Net Revenue = Revenue - Selling Cost + Selling Cost Add Back
  const netRevenue =
    totalRevenue !== null && sellingCost !== null
      ? totalRevenue - sellingCost + sellingCostAddBack
      : null;

  return {
    totalRevenue,
    sellingCost,
    sellingCostAddBack,
    netRevenue,
  };
}

/**
 * Compute soft cost metrics.
 */
function computeSoftCosts(
  base: ProFormaAssumptions,
  computed: ProFormaOutputs["computed"]
): ProFormaOutputs["softCosts"] {
  // Soft Base = sum of all soft cost inputs
  const softBase =
    (base.softCosts.consultants ?? 0) +
    (base.softCosts.municipalPermitFees ?? 0) +
    (base.softCosts.otherSoftCosts ?? 0) +
    (base.softCosts.marketing ?? 0) +
    (base.softCosts.finance ?? 0);

  // Soft Contingency = Soft Base × Contingency %
  const softContingency =
    base.softCosts.contingencyPct !== null
      ? softBase * (base.softCosts.contingencyPct / 100)
      : 0;

  // Land & Soft Total = Capitalized Land + Soft Base + Soft Contingency
  const landAndSoftTotal =
    (base.acquisition.capitalizedLandCost ?? 0) + softBase + softContingency;

  // Total soft cost (including contingency)
  const totalSoftCost = softBase + softContingency;

  // Normalized metrics (using total soft cost including contingency)
  const softBasePerUnit =
    base.program.units !== null && base.program.units > 0
      ? totalSoftCost / base.program.units
      : null;

  const softBasePerBuildableSF =
    computed.grossBuildableArea !== null && computed.grossBuildableArea > 0
      ? totalSoftCost / computed.grossBuildableArea
      : null;

  const softBasePerSaleableSF =
    computed.netSaleableSF !== null && computed.netSaleableSF > 0
      ? totalSoftCost / computed.netSaleableSF
      : null;

  return {
    softBase: softBase > 0 ? softBase : null,
    softContingency: softContingency > 0 ? softContingency : null,
    landAndSoftTotal: landAndSoftTotal > 0 ? landAndSoftTotal : null,
    softBasePerUnit,
    softBasePerBuildableSF,
    softBasePerSaleableSF,
  };
}

/**
 * Compute hard cost metrics.
 */
function computeHardCosts(
  base: ProFormaAssumptions,
  eff: ProFormaOutputs["eff"],
  computed: ProFormaOutputs["computed"]
): ProFormaOutputs["hardCosts"] {
  // Hard Contingency Base = Construction + CM + Servicing (both)
  const hardContingencyBase =
    (eff.totalConstructionHardCost ?? 0) +
    (base.hardCosts.constructionManagement ?? 0) +
    (base.hardCosts.landServicingOffsite ?? 0) +
    (base.hardCosts.landServicingOnsite ?? 0);

  // Hard Contingency = Hard Contingency Base × Contingency %
  const hardContingency =
    base.hardCosts.contingencyPct !== null
      ? hardContingencyBase * (base.hardCosts.contingencyPct / 100)
      : 0;

  // Construction & Hard Total = Hard Contingency Base + Hard Contingency
  const constructionAndHardTotal = hardContingencyBase + hardContingency;

  // Normalized metrics (using total hard cost including contingency)
  const hardBasePerUnit =
    base.program.units !== null && base.program.units > 0
      ? constructionAndHardTotal / base.program.units
      : null;

  const hardBasePerBuildableSF =
    computed.grossBuildableArea !== null && computed.grossBuildableArea > 0
      ? constructionAndHardTotal / computed.grossBuildableArea
      : null;

  const hardBasePerSaleableSF =
    computed.netSaleableSF !== null && computed.netSaleableSF > 0
      ? constructionAndHardTotal / computed.netSaleableSF
      : null;

  return {
    hardContingencyBase: hardContingencyBase > 0 ? hardContingencyBase : null,
    hardContingency: hardContingency > 0 ? hardContingency : null,
    constructionAndHardTotal: constructionAndHardTotal > 0 ? constructionAndHardTotal : null,
    hardBasePerUnit,
    hardBasePerBuildableSF,
    hardBasePerSaleableSF,
  };
}

/**
 * Compute total metrics and returns.
 */
function computeTotals(
  revenue: ProFormaOutputs["revenue"],
  softCosts: ProFormaOutputs["softCosts"],
  hardCosts: ProFormaOutputs["hardCosts"],
  computed: ProFormaOutputs["computed"]
): ProFormaOutputs["totals"] {
  // Total Project Cost = Land & Soft Total + Construction & Hard Total
  const totalProjectCost =
    (softCosts.landAndSoftTotal ?? 0) + (hardCosts.constructionAndHardTotal ?? 0);

  // Profit = Net Revenue - Total Project Cost
  const profit =
    revenue.netRevenue !== null
      ? revenue.netRevenue - totalProjectCost
      : null;

  // Return on Cost = Profit ÷ Total Project Cost
  const returnOnCostPct =
    profit !== null && totalProjectCost > 0
      ? (profit / totalProjectCost) * 100
      : null;

  // Revenue per Saleable SF
  const revenuePerSaleableSF =
    revenue.netRevenue !== null && computed.netSaleableSF !== null && computed.netSaleableSF > 0
      ? revenue.netRevenue / computed.netSaleableSF
      : null;

  return {
    totalProjectCost: totalProjectCost > 0 ? totalProjectCost : null,
    profit,
    returnOnCostPct,
    revenuePerSaleableSF,
  };
}

/**
 * Generate monthly cashflow rows (for display only, with specific allocation rules).
 * - Land costs: All in month 1
 * - Soft costs: Spread evenly across all months
 * - Hard costs: 1/8 in servicing phase, 7/8 in construction phase
 * - Revenue: Evenly across last 25% of construction phase
 */
function generateMonthlyCashflows(
  base: ProFormaAssumptions,
  eff: ProFormaOutputs["eff"],
  softCosts: ProFormaOutputs["softCosts"],
  hardCosts: ProFormaOutputs["hardCosts"],
  revenue: ProFormaOutputs["revenue"]
): MonthlyCashflowRow[] {
  if (eff.totalMonths === null || eff.totalMonths === 0) {
    return [];
  }

  const totalMonths = eff.totalMonths;
  const landEntitlementMonths = eff.landEntitlementMonths ?? 0;
  const servicingMonths = eff.servicingMonths ?? 0;
  const constructionMonths = eff.constructionMonths ?? 0;

  // Separate land from soft costs
  const landCost = base.acquisition.capitalizedLandCost ?? 0;
  const softTotal = (softCosts.softBase ?? 0) + (softCosts.softContingency ?? 0);
  const hardTotal = hardCosts.constructionAndHardTotal ?? 0;
  const totalRevenue = revenue.netRevenue ?? 0;

  const rows: MonthlyCashflowRow[] = [];

  // Allocate costs according to rules:
  // - Land: all in month 1
  // - Soft: evenly across all months
  // - Hard: 1/8 in servicing, 7/8 in construction
  // - Revenue: evenly across last 25% of construction

  const monthlySoft = totalMonths > 0 ? softTotal / totalMonths : 0;
  const servicingHardPerMonth = servicingMonths > 0 ? (hardTotal * 0.125) / servicingMonths : 0;
  const constructionHardPerMonth = constructionMonths > 0 ? (hardTotal * 0.875) / constructionMonths : 0;

  // Revenue starts in last 25% of construction
  const revenueMonths = Math.ceil(constructionMonths * 0.25);
  const monthlyRevenue = revenueMonths > 0 ? totalRevenue / revenueMonths : 0;
  const constructionStartMonth = landEntitlementMonths + servicingMonths + 1;
  const revenueStartMonth = constructionStartMonth + (constructionMonths - revenueMonths);

  // Generate monthly rows
  for (let m = 1; m <= totalMonths; m++) {
    let phase: "LAND_ENTITLEMENT" | "SERVICING" | "CONSTRUCTION";
    let land = 0;
    let soft = monthlySoft; // Soft costs in every month
    let hard = 0;
    let revenueForMonth = 0;

    if (m <= landEntitlementMonths) {
      phase = "LAND_ENTITLEMENT";
      if (m === 1) {
        land = landCost; // All land in month 1
      }
    } else if (m <= landEntitlementMonths + servicingMonths) {
      phase = "SERVICING";
      hard = servicingHardPerMonth; // 1/8 of hard costs spread over servicing
    } else {
      phase = "CONSTRUCTION";
      hard = constructionHardPerMonth; // 7/8 of hard costs spread over construction
      // Revenue only in last 25% of construction
      if (m >= revenueStartMonth) {
        revenueForMonth = monthlyRevenue;
      }
    }

    rows.push({
      monthIndex: m,
      phase,
      land,
      soft,
      hard,
      revenue: revenueForMonth,
    });
  }

  return rows;
}

/**
 * Compute delta between two values (utility function).
 */
export function computeDelta(
  base: number | null,
  scenario: number | null
): number | null {
  if (base === null || scenario === null) return null;
  return scenario - base;
}

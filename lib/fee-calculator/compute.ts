import type {
  FeeCalculatorAssumptions,
  FeeCalculatorOutputs,
} from "./types";

// DCC Rate Constants (CAD per unit or per m²)
const DCC_RATES = {
  SINGLE_FAMILY: 64396,
  DUPLEX_TRIPLEX_FOURPLEX_MULTIPLEX: 43483,
  TOWNHOUSE: 38537,
  APARTMENT: 24435,
  COMMERCIAL: 131, // per m²
  INDUSTRIAL: 73, // per m²
  INSTITUTIONAL: 132, // per m²
} as const;

// ACC Rate Constants (CAD per unit or per sqft)
const ACC_RATES = {
  LOW_RISE_RESIDENTIAL: 21205, // per unit
  MID_RISE_APARTMENTS: 21.31, // per sqft
  HIGH_RISE_APARTMENTS: 38.53, // per sqft
  INDUSTRIAL_COMMERCIAL_INSTITUTIONAL: 0, // no charge
} as const;

// Fixed Fee Constants (CAD)
export const FIXED_FEES = {
  PRE_APPLICATION_REVIEW: 2506.0,
  OCP_AMENDMENT: 10007.7, // Official Community Plan Amendment
} as const;

/**
 * Calculate DCC total based on development type and inputs
 */
function computeDccTotal(assumptions: FeeCalculatorAssumptions): number | null {
  const { developmentType, units, grossFloorAreaM2 } = assumptions.dcc;

  // Residential types use units
  if (
    developmentType === 'SINGLE_FAMILY' ||
    developmentType === 'DUPLEX_TRIPLEX_FOURPLEX_MULTIPLEX' ||
    developmentType === 'TOWNHOUSE' ||
    developmentType === 'APARTMENT'
  ) {
    if (units === null || units <= 0) {
      return null;
    }
    const rate = DCC_RATES[developmentType];
    return rate * units;
  }

  // Non-residential types use gross floor area (m²)
  if (
    developmentType === 'COMMERCIAL' ||
    developmentType === 'INDUSTRIAL' ||
    developmentType === 'INSTITUTIONAL'
  ) {
    if (grossFloorAreaM2 === null || grossFloorAreaM2 <= 0) {
      return null;
    }
    const rate = DCC_RATES[developmentType];
    return rate * grossFloorAreaM2;
  }

  return null;
}

/**
 * Calculate ACC total based on development category and inputs
 */
function computeAccTotal(assumptions: FeeCalculatorAssumptions): number | null {
  const { developmentCategory, units, developmentSqft } = assumptions.acc;

  // Low-Rise Residential uses units
  if (developmentCategory === 'LOW_RISE_RESIDENTIAL') {
    if (units === null || units <= 0) {
      return null;
    }
    return ACC_RATES.LOW_RISE_RESIDENTIAL * units;
  }

  // Mid-Rise and High-Rise use development sqft
  if (
    developmentCategory === 'MID_RISE_APARTMENTS' ||
    developmentCategory === 'HIGH_RISE_APARTMENTS'
  ) {
    if (developmentSqft === null || developmentSqft <= 0) {
      return null;
    }
    const rate = ACC_RATES[developmentCategory];
    return rate * developmentSqft;
  }

  // Industrial/Commercial/Institutional has no charge
  if (developmentCategory === 'INDUSTRIAL_COMMERCIAL_INSTITUTIONAL') {
    return 0;
  }

  return null;
}

/**
 * Compute fee calculator outputs from assumptions.
 * @param assumptions - The fee calculator assumptions
 * @returns Computed outputs with all fee calculations
 */
export function computeFeeCalculator(
  assumptions: FeeCalculatorAssumptions
): FeeCalculatorOutputs {
  // Calculate DCC total
  const totalDCC = computeDccTotal(assumptions);

  // Calculate ACC total
  const totalACC = computeAccTotal(assumptions);

  // CAC not implemented yet - return 0 instead of null
  const totalCAC = 0;

  // Grand total (sum of all fees including fixed fees)
  const grandTotal =
    totalDCC !== null || totalACC !== null || totalCAC !== null
      ? (totalDCC || 0) +
        (totalACC || 0) +
        (totalCAC || 0) +
        FIXED_FEES.PRE_APPLICATION_REVIEW +
        FIXED_FEES.OCP_AMENDMENT
      : null;

  return {
    dcc: {
      totalDCC,
    },
    acc: {
      totalACC,
    },
    cac: {
      totalCAC,
    },
    totals: {
      grandTotal,
    },
  };
}

import type { FeeCalculatorAssumptions } from "./types";

// Default assumptions with all numeric fields as null
export const defaultAssumptions: FeeCalculatorAssumptions = {
  dcc: {
    developmentType: 'SINGLE_FAMILY',
    units: null,
    grossFloorAreaM2: null,
  },
  acc: {
    developmentCategory: 'LOW_RISE_RESIDENTIAL',
    units: null,
    developmentSqft: null,
  },
  cac: {
    // Placeholder
  },
};

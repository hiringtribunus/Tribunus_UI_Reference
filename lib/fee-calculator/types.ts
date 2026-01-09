// Fee Calculator types for DCC, ACC, and CAC calculations

export type DCCDevelopmentType =
  | 'SINGLE_FAMILY'
  | 'DUPLEX_TRIPLEX_FOURPLEX_MULTIPLEX'
  | 'TOWNHOUSE'
  | 'APARTMENT'
  | 'COMMERCIAL'
  | 'INDUSTRIAL'
  | 'INSTITUTIONAL';

export type ACCDevelopmentCategory =
  | 'LOW_RISE_RESIDENTIAL'
  | 'MID_RISE_APARTMENTS'
  | 'HIGH_RISE_APARTMENTS'
  | 'INDUSTRIAL_COMMERCIAL_INSTITUTIONAL';

export type FeeCalculatorAssumptions = {
  // DCC (Development Cost Charges)
  dcc: {
    developmentType: DCCDevelopmentType;
    units: number | null; // Enabled for: Single Family, Duplex/etc, Townhouse, Apartment
    grossFloorAreaM2: number | null; // Enabled for: Commercial, Industrial, Institutional
  };

  // ACC (Amenity Cost Charges)
  acc: {
    developmentCategory: ACCDevelopmentCategory;
    units: number | null; // Enabled only for: Low-Rise Residential
    developmentSqft: number | null; // Enabled for: Mid-Rise, High-Rise, Industrial/Commercial/Institutional
  };

  // CAC (Community Amenity Contribution)
  cac: {
    // Placeholder for future fields
  };
};

export type FeeCalculatorOutputs = {
  dcc: {
    totalDCC: number | null;
  };

  acc: {
    totalACC: number | null;
  };

  cac: {
    totalCAC: number; // Always 0 for now (not null)
  };

  // Grand total (sum of all fees)
  totals: {
    grandTotal: number | null;
  };
};

export type FeeCalculatorRow = {
  project_id: string;
  updated_at: string;
  assumptions: FeeCalculatorAssumptions;
};

import { z } from "zod";

// DCC Development Type
const dccDevelopmentTypeSchema = z.enum([
  'SINGLE_FAMILY',
  'DUPLEX_TRIPLEX_FOURPLEX_MULTIPLEX',
  'TOWNHOUSE',
  'APARTMENT',
  'COMMERCIAL',
  'INDUSTRIAL',
  'INSTITUTIONAL',
]);

// ACC Development Category
const accDevelopmentCategorySchema = z.enum([
  'LOW_RISE_RESIDENTIAL',
  'MID_RISE_APARTMENTS',
  'HIGH_RISE_APARTMENTS',
  'INDUSTRIAL_COMMERCIAL_INSTITUTIONAL',
]);

// DCC Schema
const dccSchema = z.object({
  developmentType: dccDevelopmentTypeSchema,
  units: z.number().min(1).nullable(),
  grossFloorAreaM2: z.number().min(1).nullable(),
});

// ACC Schema
const accSchema = z.object({
  developmentCategory: accDevelopmentCategorySchema,
  units: z.number().min(1).nullable(),
  developmentSqft: z.number().min(1).nullable(),
});

// CAC Schema (placeholder)
const cacSchema = z.object({});

// Full Assumptions Schema
export const assumptionsSchema = z.object({
  dcc: dccSchema,
  acc: accSchema,
  cac: cacSchema,
});

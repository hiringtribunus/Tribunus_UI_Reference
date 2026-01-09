"use client";

import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FeeCalculatorAssumptions, FeeCalculatorOutputs } from "@/lib/fee-calculator/types";
import { formatCADWithCents } from "@/lib/utils/formatting";

interface FeeCalculatorFormProps {
  form: UseFormReturn<FeeCalculatorAssumptions>;
  outputs: FeeCalculatorOutputs;
}

export function FeeCalculatorForm({ form, outputs }: FeeCalculatorFormProps) {
  const { register, formState, watch, setValue } = form;
  const { errors } = formState;

  // Watch DCC development type
  const dccDevelopmentType = watch("dcc.developmentType");

  // Watch ACC development category
  const accDevelopmentCategory = watch("acc.developmentCategory");

  // Determine if DCC units field should be enabled
  const isDCCUnitsEnabled = [
    'SINGLE_FAMILY',
    'DUPLEX_TRIPLEX_FOURPLEX_MULTIPLEX',
    'TOWNHOUSE',
    'APARTMENT',
  ].includes(dccDevelopmentType);

  // Determine if DCC gross floor area field should be enabled
  const isDCCGrossFloorAreaEnabled = [
    'COMMERCIAL',
    'INDUSTRIAL',
    'INSTITUTIONAL',
  ].includes(dccDevelopmentType);

  // Determine if ACC units field should be enabled
  const isACCUnitsEnabled = accDevelopmentCategory === 'LOW_RISE_RESIDENTIAL';

  // Determine if ACC development sqft field should be enabled
  const isACCDevelopmentSqftEnabled = [
    'MID_RISE_APARTMENTS',
    'HIGH_RISE_APARTMENTS',
    'INDUSTRIAL_COMMERCIAL_INSTITUTIONAL',
  ].includes(accDevelopmentCategory);

  return (
    <Accordion type="multiple" defaultValue={["dcc", "acc", "cac"]} className="space-y-4 max-w-3xl">
      {/* DCC Accordion */}
      <AccordionItem value="dcc" className="border rounded-md">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center gap-2">
            <span className="font-medium">DCC</span>
            <span className="group relative">
              <Info className="h-4 w-4 text-gray-400" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 text-xs bg-gray-900 text-white rounded shadow-lg z-10">
                Development Cost Charges
              </span>
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <div className="space-y-6">
            {/* Development Type Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Development Type
              </Label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setValue("dcc.developmentType", "SINGLE_FAMILY", {
                      shouldDirty: true,
                    })
                  }
                  className={`
                    px-3 py-2 rounded-sm text-sm font-medium transition-colors
                    ${
                      dccDevelopmentType === "SINGLE_FAMILY"
                        ? "bg-accent text-white"
                        : "bg-surface border border-gray-300 text-gray-700 hover:bg-surface-2"
                    }
                  `}
                >
                  Single Family
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "dcc.developmentType",
                      "DUPLEX_TRIPLEX_FOURPLEX_MULTIPLEX",
                      { shouldDirty: true }
                    )
                  }
                  className={`
                    px-3 py-2 rounded-sm text-sm font-medium transition-colors
                    ${
                      dccDevelopmentType === "DUPLEX_TRIPLEX_FOURPLEX_MULTIPLEX"
                        ? "bg-accent text-white"
                        : "bg-surface border border-gray-300 text-gray-700 hover:bg-surface-2"
                    }
                  `}
                >
                  Duplex / Triplex / Fourplex / Multiplex
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue("dcc.developmentType", "TOWNHOUSE", {
                      shouldDirty: true,
                    })
                  }
                  className={`
                    px-3 py-2 rounded-sm text-sm font-medium transition-colors
                    ${
                      dccDevelopmentType === "TOWNHOUSE"
                        ? "bg-accent text-white"
                        : "bg-surface border border-gray-300 text-gray-700 hover:bg-surface-2"
                    }
                  `}
                >
                  Townhouse
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue("dcc.developmentType", "APARTMENT", {
                      shouldDirty: true,
                    })
                  }
                  className={`
                    px-3 py-2 rounded-sm text-sm font-medium transition-colors
                    ${
                      dccDevelopmentType === "APARTMENT"
                        ? "bg-accent text-white"
                        : "bg-surface border border-gray-300 text-gray-700 hover:bg-surface-2"
                    }
                  `}
                >
                  Apartment
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue("dcc.developmentType", "COMMERCIAL", {
                      shouldDirty: true,
                    })
                  }
                  className={`
                    px-3 py-2 rounded-sm text-sm font-medium transition-colors
                    ${
                      dccDevelopmentType === "COMMERCIAL"
                        ? "bg-accent text-white"
                        : "bg-surface border border-gray-300 text-gray-700 hover:bg-surface-2"
                    }
                  `}
                >
                  Commercial
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue("dcc.developmentType", "INDUSTRIAL", {
                      shouldDirty: true,
                    })
                  }
                  className={`
                    px-3 py-2 rounded-sm text-sm font-medium transition-colors
                    ${
                      dccDevelopmentType === "INDUSTRIAL"
                        ? "bg-accent text-white"
                        : "bg-surface border border-gray-300 text-gray-700 hover:bg-surface-2"
                    }
                  `}
                >
                  Industrial
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue("dcc.developmentType", "INSTITUTIONAL", {
                      shouldDirty: true,
                    })
                  }
                  className={`
                    px-3 py-2 rounded-sm text-sm font-medium transition-colors
                    ${
                      dccDevelopmentType === "INSTITUTIONAL"
                        ? "bg-accent text-white"
                        : "bg-surface border border-gray-300 text-gray-700 hover:bg-surface-2"
                    }
                  `}
                >
                  Institutional
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              {/* Units */}
              <div>
                <Label htmlFor="dcc.units">Units</Label>
                <Input
                  id="dcc.units"
                  type="number"
                  {...register("dcc.units", { valueAsNumber: true })}
                  className="mt-1 max-w-xs"
                  placeholder="0"
                  disabled={!isDCCUnitsEnabled}
                />
                {errors.dcc?.units && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.dcc.units.message}
                  </p>
                )}
              </div>

              {/* Gross Floor Area */}
              <div>
                <Label htmlFor="dcc.grossFloorAreaM2">
                  Gross Floor Area (m²)
                </Label>
                <Input
                  id="dcc.grossFloorAreaM2"
                  type="number"
                  {...register("dcc.grossFloorAreaM2", {
                    valueAsNumber: true,
                  })}
                  className="mt-1 max-w-xs"
                  placeholder="0"
                  disabled={!isDCCGrossFloorAreaEnabled}
                />
                {errors.dcc?.grossFloorAreaM2 && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.dcc.grossFloorAreaM2.message}
                  </p>
                )}
              </div>
            </div>

            {/* Output */}
            <div className="mt-6 pt-6 border-t flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total DCC</p>
                <p className="text-2xl font-semibold">
                  {formatCADWithCents(outputs.dcc.totalDCC)}
                </p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* ACC Accordion */}
      <AccordionItem value="acc" className="border rounded-md">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center gap-2">
            <span className="font-medium">ACC</span>
            <span className="group relative">
              <Info className="h-4 w-4 text-gray-400" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 text-xs bg-gray-900 text-white rounded shadow-lg z-10">
                Amenity Cost Charges
              </span>
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <div className="space-y-6">
            {/* Development Category Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Development Category
              </Label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setValue("acc.developmentCategory", "LOW_RISE_RESIDENTIAL", {
                      shouldDirty: true,
                    })
                  }
                  className={`
                    px-3 py-2 rounded-sm text-sm font-medium transition-colors
                    ${
                      accDevelopmentCategory === "LOW_RISE_RESIDENTIAL"
                        ? "bg-accent text-white"
                        : "bg-surface border border-gray-300 text-gray-700 hover:bg-surface-2"
                    }
                  `}
                >
                  Low-Rise Residential
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue("acc.developmentCategory", "MID_RISE_APARTMENTS", {
                      shouldDirty: true,
                    })
                  }
                  className={`
                    px-3 py-2 rounded-sm text-sm font-medium transition-colors
                    ${
                      accDevelopmentCategory === "MID_RISE_APARTMENTS"
                        ? "bg-accent text-white"
                        : "bg-surface border border-gray-300 text-gray-700 hover:bg-surface-2"
                    }
                  `}
                >
                  Mid-Rise Apartments
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue("acc.developmentCategory", "HIGH_RISE_APARTMENTS", {
                      shouldDirty: true,
                    })
                  }
                  className={`
                    px-3 py-2 rounded-sm text-sm font-medium transition-colors
                    ${
                      accDevelopmentCategory === "HIGH_RISE_APARTMENTS"
                        ? "bg-accent text-white"
                        : "bg-surface border border-gray-300 text-gray-700 hover:bg-surface-2"
                    }
                  `}
                >
                  High-Rise Apartments
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "acc.developmentCategory",
                      "INDUSTRIAL_COMMERCIAL_INSTITUTIONAL",
                      { shouldDirty: true }
                    )
                  }
                  className={`
                    px-3 py-2 rounded-sm text-sm font-medium transition-colors
                    ${
                      accDevelopmentCategory === "INDUSTRIAL_COMMERCIAL_INSTITUTIONAL"
                        ? "bg-accent text-white"
                        : "bg-surface border border-gray-300 text-gray-700 hover:bg-surface-2"
                    }
                  `}
                >
                  Industrial / Commercial / Institutional
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              {/* Units */}
              <div>
                <Label htmlFor="acc.units">Units</Label>
                <Input
                  id="acc.units"
                  type="number"
                  {...register("acc.units", { valueAsNumber: true })}
                  className="mt-1 max-w-xs"
                  placeholder="0"
                  disabled={!isACCUnitsEnabled}
                />
                {errors.acc?.units && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.acc.units.message}
                  </p>
                )}
              </div>

              {/* Development sqft */}
              <div>
                <Label htmlFor="acc.developmentSqft">
                  Development sqft
                </Label>
                <Input
                  id="acc.developmentSqft"
                  type="number"
                  {...register("acc.developmentSqft", {
                    valueAsNumber: true,
                  })}
                  className="mt-1 max-w-xs"
                  placeholder="0"
                  disabled={!isACCDevelopmentSqftEnabled}
                />
                {errors.acc?.developmentSqft && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.acc.developmentSqft.message}
                  </p>
                )}
              </div>
            </div>

            {/* Output */}
            <div className="mt-6 pt-6 border-t flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total ACC</p>
                <p className="text-2xl font-semibold">
                  {formatCADWithCents(outputs.acc.totalACC)}
                </p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* CAC Accordion */}
      <AccordionItem value="cac" className="border rounded-md">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center gap-2">
            <span className="font-medium">CAC</span>
            <span className="group relative">
              <Info className="h-4 w-4 text-gray-400" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 text-xs bg-gray-900 text-white rounded shadow-lg z-10">
                Community Amenity Contribution
              </span>
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <div className="space-y-6">
            {/* Placeholder */}
            <p className="text-sm text-gray-600">
              Placeholder for CAC calculation inputs (coming soon)
            </p>

            {/* Output */}
            <div className="mt-6 pt-6 border-t flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total CAC</p>
                <p className="text-2xl font-semibold">—</p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

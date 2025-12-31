"use client";

import { UseFormReturn } from "react-hook-form";
import type { ProFormaAssumptions } from "@/lib/proforma/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AssumptionsFormProps = {
  form: UseFormReturn<ProFormaAssumptions>;
};

export function AssumptionsForm({ form }: AssumptionsFormProps) {
  const { register, formState } = form;
  const { errors } = formState;

  return (
    <Accordion
      type="multiple"
      defaultValue={["program", "revenue", "costs"]}
      className="space-y-2"
    >
      {/* Program Section */}
      <AccordionItem value="program" className="border rounded-md px-4">
        <AccordionTrigger className="hover:no-underline">
          <span className="font-medium">Program</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
            <div>
              <Label htmlFor="program.units">Units</Label>
              <Input
                id="program.units"
                type="number"
                step="1"
                {...register("program.units", { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.program?.units && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.program.units.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="program.saleableAreaSqft">
                Saleable Area (sq ft)
              </Label>
              <Input
                id="program.saleableAreaSqft"
                type="number"
                step="0.01"
                {...register("program.saleableAreaSqft", {
                  valueAsNumber: true,
                })}
                className="mt-1"
              />
              {errors.program?.saleableAreaSqft && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.program.saleableAreaSqft.message}
                </p>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Acquisition Section */}
      <AccordionItem value="acquisition" className="border rounded-md px-4">
        <AccordionTrigger className="hover:no-underline">
          <span className="font-medium">Acquisition</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
            <div>
              <Label htmlFor="acquisition.landPrice">Land Price (CAD)</Label>
              <Input
                id="acquisition.landPrice"
                type="number"
                step="0.01"
                {...register("acquisition.landPrice", { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.acquisition?.landPrice && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.acquisition.landPrice.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="acquisition.closingCostsPct">
                Closing Costs (%)
              </Label>
              <Input
                id="acquisition.closingCostsPct"
                type="number"
                step="0.1"
                {...register("acquisition.closingCostsPct", {
                  valueAsNumber: true,
                })}
                className="mt-1"
              />
              {errors.acquisition?.closingCostsPct && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.acquisition.closingCostsPct.message}
                </p>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Revenue Section */}
      <AccordionItem value="revenue" className="border rounded-md px-4">
        <AccordionTrigger className="hover:no-underline">
          <span className="font-medium">Revenue</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
            <div>
              <Label htmlFor="revenue.salePricePerSqft">
                Sale Price (CAD/sq ft)
              </Label>
              <Input
                id="revenue.salePricePerSqft"
                type="number"
                step="0.01"
                {...register("revenue.salePricePerSqft", {
                  valueAsNumber: true,
                })}
                className="mt-1"
              />
              {errors.revenue?.salePricePerSqft && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.revenue.salePricePerSqft.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="revenue.otherRevenue">Other Revenue (CAD)</Label>
              <Input
                id="revenue.otherRevenue"
                type="number"
                step="0.01"
                {...register("revenue.otherRevenue", { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.revenue?.otherRevenue && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.revenue.otherRevenue.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="revenue.salesCommissionPct">
                Sales Commission (%)
              </Label>
              <Input
                id="revenue.salesCommissionPct"
                type="number"
                step="0.1"
                {...register("revenue.salesCommissionPct", {
                  valueAsNumber: true,
                })}
                className="mt-1"
              />
              {errors.revenue?.salesCommissionPct && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.revenue.salesCommissionPct.message}
                </p>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Costs Section */}
      <AccordionItem value="costs" className="border rounded-md px-4">
        <AccordionTrigger className="hover:no-underline">
          <span className="font-medium">Costs</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
            <div>
              <Label htmlFor="costs.hardCostPerSqft">
                Hard Cost (CAD/sq ft)
              </Label>
              <Input
                id="costs.hardCostPerSqft"
                type="number"
                step="0.01"
                {...register("costs.hardCostPerSqft", { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.costs?.hardCostPerSqft && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.costs.hardCostPerSqft.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="costs.softCostPctOfHard">
                Soft Cost (% of Hard)
              </Label>
              <Input
                id="costs.softCostPctOfHard"
                type="number"
                step="0.1"
                {...register("costs.softCostPctOfHard", {
                  valueAsNumber: true,
                })}
                className="mt-1"
              />
              {errors.costs?.softCostPctOfHard && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.costs.softCostPctOfHard.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="costs.contingencyPctOfHard">
                Contingency - Hard (%)
              </Label>
              <Input
                id="costs.contingencyPctOfHard"
                type="number"
                step="0.1"
                {...register("costs.contingencyPctOfHard", {
                  valueAsNumber: true,
                })}
                className="mt-1"
              />
              {errors.costs?.contingencyPctOfHard && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.costs.contingencyPctOfHard.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="costs.contingencyPctOfSoft">
                Contingency - Soft (%)
              </Label>
              <Input
                id="costs.contingencyPctOfSoft"
                type="number"
                step="0.1"
                {...register("costs.contingencyPctOfSoft", {
                  valueAsNumber: true,
                })}
                className="mt-1"
              />
              {errors.costs?.contingencyPctOfSoft && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.costs.contingencyPctOfSoft.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="costs.devFeePctOfCost">Dev Fee (% of Cost)</Label>
              <Input
                id="costs.devFeePctOfCost"
                type="number"
                step="0.1"
                {...register("costs.devFeePctOfCost", { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.costs?.devFeePctOfCost && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.costs.devFeePctOfCost.message}
                </p>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Financing Section */}
      <AccordionItem value="financing" className="border rounded-md px-4">
        <AccordionTrigger className="hover:no-underline">
          <span className="font-medium">Financing</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
            <div>
              <Label htmlFor="financing.loanToCostPct">Loan to Cost (%)</Label>
              <Input
                id="financing.loanToCostPct"
                type="number"
                step="0.1"
                {...register("financing.loanToCostPct", {
                  valueAsNumber: true,
                })}
                className="mt-1"
              />
              {errors.financing?.loanToCostPct && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.financing.loanToCostPct.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="financing.interestRatePct">
                Interest Rate (%)
              </Label>
              <Input
                id="financing.interestRatePct"
                type="number"
                step="0.01"
                {...register("financing.interestRatePct", {
                  valueAsNumber: true,
                })}
                className="mt-1"
              />
              {errors.financing?.interestRatePct && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.financing.interestRatePct.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="financing.lenderFeePct">Lender Fee (%)</Label>
              <Input
                id="financing.lenderFeePct"
                type="number"
                step="0.01"
                {...register("financing.lenderFeePct", { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.financing?.lenderFeePct && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.financing.lenderFeePct.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="financing.interestCoverageFactor">
                Interest Coverage Factor (0-1)
              </Label>
              <Input
                id="financing.interestCoverageFactor"
                type="number"
                step="0.01"
                {...register("financing.interestCoverageFactor", {
                  valueAsNumber: true,
                })}
                className="mt-1"
                placeholder="0.5"
              />
              {errors.financing?.interestCoverageFactor && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.financing.interestCoverageFactor.message}
                </p>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Timeline Section */}
      <AccordionItem value="timeline" className="border rounded-md px-4">
        <AccordionTrigger className="hover:no-underline">
          <span className="font-medium">Timeline</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
            <div>
              <Label htmlFor="timeline.totalMonths">
                Total Project Duration (months)
              </Label>
              <Input
                id="timeline.totalMonths"
                type="number"
                step="1"
                {...register("timeline.totalMonths", { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.timeline?.totalMonths && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.timeline.totalMonths.message}
                </p>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

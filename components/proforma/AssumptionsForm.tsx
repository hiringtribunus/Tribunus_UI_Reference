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
import { MetaToggles } from "./MetaToggles";
import { NumberInput } from "./NumberInput";

type AssumptionsFormProps = {
  form: UseFormReturn<ProFormaAssumptions>;
};

export function AssumptionsForm({ form }: AssumptionsFormProps) {
  const { register, formState, watch, setValue } = form;
  const { errors } = formState;

  const landEntitlementMonths = watch("timeline.landEntitlementMonths");
  const servicingMonths = watch("timeline.servicingMonths");
  const constructionMonths = watch("timeline.constructionMonths");

  // Calculate total months
  const totalMonths =
    (landEntitlementMonths ?? 0) +
    (servicingMonths ?? 0) +
    (constructionMonths ?? 0);

  return (
    <div className="space-y-4">
      {/* Meta Toggles */}
      <MetaToggles form={form} />

      <Accordion
        type="multiple"
        defaultValue={["program", "acquisition", "revenue", "timeline", "softCosts", "hardCosts"]}
        className="space-y-2"
      >
        {/* Program & Density Section */}
        <AccordionItem value="program" className="border rounded-md px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="font-medium">Program & Density</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
              <div>
                <Label htmlFor="program.units">Number of Units</Label>
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
                <Label htmlFor="program.siteAreaSqft">Site Area (sf)</Label>
                <Input
                  id="program.siteAreaSqft"
                  type="number"
                  step="1"
                  {...register("program.siteAreaSqft", {
                    valueAsNumber: true,
                  })}
                  className="mt-1"
                />
                {errors.program?.siteAreaSqft && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.program.siteAreaSqft.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="program.fsr">FSR (Floor Space Ratio)</Label>
                <Input
                  id="program.fsr"
                  type="number"
                  step="0.1"
                  {...register("program.fsr", { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.program?.fsr && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.program.fsr.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="program.efficiencyPct">Efficiency (%)</Label>
                <Input
                  id="program.efficiencyPct"
                  type="number"
                  step="1"
                  {...register("program.efficiencyPct", {
                    valueAsNumber: true,
                  })}
                  className="mt-1"
                  placeholder="85"
                />
                {errors.program?.efficiencyPct && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.program.efficiencyPct.message}
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
                <Label htmlFor="acquisition.landPurchasePrice">
                  Land Purchase Price ($)
                </Label>
                <NumberInput
                  id="acquisition.landPurchasePrice"
                  value={watch("acquisition.landPurchasePrice")}
                  onChange={(val) => setValue("acquisition.landPurchasePrice", val, { shouldDirty: true })}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Raw land price (used for density benchmarks)
                </p>
                {errors.acquisition?.landPurchasePrice && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.acquisition.landPurchasePrice.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="acquisition.capitalizedLandCost">
                  Capitalized Land Cost ($)
                </Label>
                <NumberInput
                  id="acquisition.capitalizedLandCost"
                  value={watch("acquisition.capitalizedLandCost")}
                  onChange={(val) => setValue("acquisition.capitalizedLandCost", val, { shouldDirty: true })}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  All-in land cost used in cost stack
                </p>
                {errors.acquisition?.capitalizedLandCost && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.acquisition.capitalizedLandCost.message}
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
                <Label htmlFor="revenue.totalRevenue">Total Revenue ($)</Label>
                <NumberInput
                  id="revenue.totalRevenue"
                  value={watch("revenue.totalRevenue")}
                  onChange={(val) => setValue("revenue.totalRevenue", val, { shouldDirty: true })}
                  className="mt-1"
                />
                {errors.revenue?.totalRevenue && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.revenue.totalRevenue.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="revenue.sellingCostPct">Selling Cost (%)</Label>
                <Input
                  id="revenue.sellingCostPct"
                  type="number"
                  step="0.1"
                  {...register("revenue.sellingCostPct", {
                    valueAsNumber: true,
                  })}
                  className="mt-1"
                />
                {errors.revenue?.sellingCostPct && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.revenue.sellingCostPct.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="revenue.sellingCostAddBack">
                  Selling Cost Add Back ($)
                </Label>
                <NumberInput
                  id="revenue.sellingCostAddBack"
                  value={watch("revenue.sellingCostAddBack")}
                  onChange={(val) => setValue("revenue.sellingCostAddBack", val, { shouldDirty: true })}
                  className="mt-1"
                />
                {errors.revenue?.sellingCostAddBack && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.revenue.sellingCostAddBack.message}
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
            <div className="space-y-4 pt-2 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="timeline.landEntitlementMonths">
                    Land & Entitlement (months)
                  </Label>
                  <Input
                    id="timeline.landEntitlementMonths"
                    type="number"
                    step="1"
                    {...register("timeline.landEntitlementMonths", {
                      valueAsNumber: true,
                    })}
                    className="mt-1"
                  />
                  {errors.timeline?.landEntitlementMonths && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.timeline.landEntitlementMonths.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="timeline.servicingMonths">
                    Servicing (months)
                  </Label>
                  <Input
                    id="timeline.servicingMonths"
                    type="number"
                    step="1"
                    {...register("timeline.servicingMonths", {
                      valueAsNumber: true,
                    })}
                    className="mt-1"
                  />
                  {errors.timeline?.servicingMonths && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.timeline.servicingMonths.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="timeline.constructionMonths">
                    Construction (months)
                  </Label>
                  <Input
                    id="timeline.constructionMonths"
                    type="number"
                    step="1"
                    {...register("timeline.constructionMonths", {
                      valueAsNumber: true,
                    })}
                    className="mt-1"
                  />
                  {errors.timeline?.constructionMonths && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.timeline.constructionMonths.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Duration:</span>{" "}
                  {totalMonths} months
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Soft Costs Section */}
        <AccordionItem value="softCosts" className="border rounded-md px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="font-medium">Soft Costs</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
              <div>
                <Label htmlFor="softCosts.consultants">Consultants ($)</Label>
                <NumberInput
                  id="softCosts.consultants"
                  value={watch("softCosts.consultants")}
                  onChange={(val) => setValue("softCosts.consultants", val, { shouldDirty: true })}
                  className="mt-1"
                />
                {errors.softCosts?.consultants && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.softCosts.consultants.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="softCosts.municipalPermitFees">
                  Municipal / Permit Fees ($)
                </Label>
                <NumberInput
                  id="softCosts.municipalPermitFees"
                  value={watch("softCosts.municipalPermitFees")}
                  onChange={(val) => setValue("softCosts.municipalPermitFees", val, { shouldDirty: true })}
                  className="mt-1"
                />
                {errors.softCosts?.municipalPermitFees && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.softCosts.municipalPermitFees.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="softCosts.otherSoftCosts">
                  Other Soft Costs ($)
                </Label>
                <NumberInput
                  id="softCosts.otherSoftCosts"
                  value={watch("softCosts.otherSoftCosts")}
                  onChange={(val) => setValue("softCosts.otherSoftCosts", val, { shouldDirty: true })}
                  className="mt-1"
                />
                {errors.softCosts?.otherSoftCosts && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.softCosts.otherSoftCosts.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="softCosts.marketing">Marketing ($)</Label>
                <NumberInput
                  id="softCosts.marketing"
                  value={watch("softCosts.marketing")}
                  onChange={(val) => setValue("softCosts.marketing", val, { shouldDirty: true })}
                  className="mt-1"
                />
                {errors.softCosts?.marketing && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.softCosts.marketing.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="softCosts.finance">Finance ($)</Label>
                <NumberInput
                  id="softCosts.finance"
                  value={watch("softCosts.finance")}
                  onChange={(val) => setValue("softCosts.finance", val, { shouldDirty: true })}
                  className="mt-1"
                />
                {errors.softCosts?.finance && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.softCosts.finance.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="softCosts.contingencyPct">
                  Soft Cost Contingency (%)
                </Label>
                <Input
                  id="softCosts.contingencyPct"
                  type="number"
                  step="0.1"
                  {...register("softCosts.contingencyPct", {
                    valueAsNumber: true,
                  })}
                  className="mt-1"
                  placeholder="5"
                />
                {errors.softCosts?.contingencyPct && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.softCosts.contingencyPct.message}
                  </p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Hard Costs Section */}
        <AccordionItem value="hardCosts" className="border rounded-md px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="font-medium">Hard Costs</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
              <div>
                <Label htmlFor="hardCosts.totalConstructionHardCost">
                  Construction Hard Cost ($)
                </Label>
                <NumberInput
                  id="hardCosts.totalConstructionHardCost"
                  value={watch("hardCosts.totalConstructionHardCost")}
                  onChange={(val) => setValue("hardCosts.totalConstructionHardCost", val, { shouldDirty: true })}
                  className="mt-1"
                />
                {errors.hardCosts?.totalConstructionHardCost && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.hardCosts.totalConstructionHardCost.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="hardCosts.constructionManagement">
                  Construction Management ($)
                </Label>
                <NumberInput
                  id="hardCosts.constructionManagement"
                  value={watch("hardCosts.constructionManagement")}
                  onChange={(val) => setValue("hardCosts.constructionManagement", val, { shouldDirty: true })}
                  className="mt-1"
                />
                {errors.hardCosts?.constructionManagement && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.hardCosts.constructionManagement.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="hardCosts.landServicingOffsite">
                  Land Servicing – Off-site ($)
                </Label>
                <NumberInput
                  id="hardCosts.landServicingOffsite"
                  value={watch("hardCosts.landServicingOffsite")}
                  onChange={(val) => setValue("hardCosts.landServicingOffsite", val, { shouldDirty: true })}
                  className="mt-1"
                />
                {errors.hardCosts?.landServicingOffsite && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.hardCosts.landServicingOffsite.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="hardCosts.landServicingOnsite">
                  Land Servicing – On-site ($)
                </Label>
                <NumberInput
                  id="hardCosts.landServicingOnsite"
                  value={watch("hardCosts.landServicingOnsite")}
                  onChange={(val) => setValue("hardCosts.landServicingOnsite", val, { shouldDirty: true })}
                  className="mt-1"
                />
                {errors.hardCosts?.landServicingOnsite && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.hardCosts.landServicingOnsite.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="hardCosts.contingencyPct">
                  Hard Cost Contingency (%)
                </Label>
                <Input
                  id="hardCosts.contingencyPct"
                  type="number"
                  step="0.1"
                  {...register("hardCosts.contingencyPct", {
                    valueAsNumber: true,
                  })}
                  className="mt-1"
                  placeholder="5"
                />
                {errors.hardCosts?.contingencyPct && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.hardCosts.contingencyPct.message}
                  </p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

"use client";

import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectProfileData } from "@/lib/projects/profile-types";

interface ProposalSectionProps {
  register: UseFormRegister<ProjectProfileData>;
  errors: FieldErrors<ProjectProfileData>;
  watch: UseFormWatch<ProjectProfileData>;
  setValue: (name: any, value: any) => void;
  fsr: number | null;
}

/**
 * Proposal section: Development proposal details
 * Fields: Application type, primary use, units, GFA, storeys, height, coverage, parking, FSR (computed)
 */
export function ProposalSection({
  register,
  errors,
  watch,
  setValue,
  fsr,
}: ProposalSectionProps) {
  const applicationType = watch("proposal.applicationType");
  const primaryUse = watch("proposal.primaryUse");
  const gfaUnit = watch("proposal.gfa.unit") || "m2";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Application Type */}
      <div>
        <Label htmlFor="applicationType">Application Type</Label>
        <Select value={applicationType || ""} onValueChange={(value) => setValue("proposal.applicationType", value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Rezoning">Rezoning</SelectItem>
            <SelectItem value="Development Permit">Development Permit</SelectItem>
            <SelectItem value="Subdivision">Subdivision</SelectItem>
            <SelectItem value="Building Permit">Building Permit</SelectItem>
            <SelectItem value="OCP Amendment">OCP Amendment</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Primary Use */}
      <div>
        <Label htmlFor="primaryUse">Primary Use</Label>
        <Select value={primaryUse || ""} onValueChange={(value) => setValue("proposal.primaryUse", value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select use" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Multi-family">Multi-family</SelectItem>
            <SelectItem value="Single-family">Single-family</SelectItem>
            <SelectItem value="Townhouse">Townhouse</SelectItem>
            <SelectItem value="Mixed-use">Mixed-use</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
            <SelectItem value="Industrial">Industrial</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Units Proposed */}
      <div>
        <Label htmlFor="unitsProposed">Units Proposed</Label>
        <Input
          id="unitsProposed"
          type="number"
          {...register("proposal.unitsProposed", { valueAsNumber: true })}
          placeholder="12"
          className="mt-1"
        />
      </div>

      {/* GFA */}
      <div>
        <Label htmlFor="gfa">Gross Floor Area</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="gfa"
            type="number"
            step="0.01"
            {...register("proposal.gfa.value", { valueAsNumber: true })}
            placeholder="1000"
            className="flex-1"
          />
          <Select value={gfaUnit} onValueChange={(value) => setValue("proposal.gfa.unit", value as "m2" | "sqft")}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="m2">m²</SelectItem>
              <SelectItem value="sqft">sqft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Storeys */}
      <div>
        <Label htmlFor="storeys">Storeys</Label>
        <Input
          id="storeys"
          type="number"
          {...register("proposal.storeys", { valueAsNumber: true })}
          placeholder="3"
          className="mt-1"
        />
      </div>

      {/* Height */}
      <div>
        <Label htmlFor="heightM">Height (meters)</Label>
        <Input
          id="heightM"
          type="number"
          step="0.1"
          {...register("proposal.heightM", { valueAsNumber: true })}
          placeholder="10.5"
          className="mt-1"
        />
      </div>

      {/* Site Coverage */}
      <div>
        <Label htmlFor="siteCoveragePct">Site Coverage (%)</Label>
        <Input
          id="siteCoveragePct"
          type="number"
          step="0.1"
          max="100"
          {...register("proposal.siteCoveragePct", { valueAsNumber: true })}
          placeholder="40"
          className="mt-1"
        />
      </div>

      {/* FSR (Computed) */}
      <div>
        <Label htmlFor="fsr">FSR (Computed)</Label>
        <Input id="fsr" value={fsr !== null ? fsr.toString() : ""} placeholder="Auto-calculated" disabled className="mt-1 bg-surface-2" />
        <p className="text-xs text-text-3 mt-1">Calculated from Lot Area and GFA</p>
      </div>

      {/* Parking */}
      <div className="md:col-span-2">
        <Label>Parking</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Input
            type="number"
            {...register("proposal.parking.required", { valueAsNumber: true })}
            placeholder="Required"
          />
          <Input
            type="number"
            {...register("proposal.parking.provided", { valueAsNumber: true })}
            placeholder="Provided"
          />
        </div>
      </div>

      {/* Parking Notes */}
      <div className="md:col-span-2">
        <Input {...register("proposal.parking.notes")} placeholder="Parking notes..." />
      </div>
    </div>
  );
}

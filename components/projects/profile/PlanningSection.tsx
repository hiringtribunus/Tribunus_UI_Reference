"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ProjectProfileData } from "@/lib/projects/profile-types";

interface PlanningSectionProps {
  register: UseFormRegister<ProjectProfileData>;
  errors: FieldErrors<ProjectProfileData>;
  watch: (name: any) => any;
  setValue: (name: any, value: any) => void;
}

/**
 * Planning section: Zoning, designations, and constraints
 * Fields: Zoning, OCP designation, DPAs (3 checkboxes), constraints (5 checkboxes), variances
 */
export function PlanningSection({
  register,
  errors,
  watch,
  setValue,
}: PlanningSectionProps) {
  return (
    <div className="space-y-4">
      {/* Current Zoning */}
      <div>
        <Label htmlFor="currentZoning">Current Zoning</Label>
        <Input
          id="currentZoning"
          {...register("planning.currentZoning")}
          placeholder="e.g., RT-1, RM-3"
          className="mt-1"
        />
      </div>

      {/* OCP Designation */}
      <div>
        <Label htmlFor="ocpDesignation">OCP Designation</Label>
        <Input
          id="ocpDesignation"
          {...register("planning.ocpDesignation")}
          placeholder="e.g., Medium Density Residential"
          className="mt-1"
        />
      </div>

      {/* Development Permit Areas */}
      <div>
        <Label>Development Permit Areas</Label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="dpa-form-character"
              checked={watch("planning.developmentPermitAreas.formAndCharacter") || false}
              onCheckedChange={(checked) =>
                setValue("planning.developmentPermitAreas.formAndCharacter", checked)
              }
            />
            <label htmlFor="dpa-form-character" className="text-sm text-text cursor-pointer">
              Form & Character
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="dpa-watercourse"
              checked={watch("planning.developmentPermitAreas.watercourseProtection") || false}
              onCheckedChange={(checked) =>
                setValue("planning.developmentPermitAreas.watercourseProtection", checked)
              }
            />
            <label htmlFor="dpa-watercourse" className="text-sm text-text cursor-pointer">
              Watercourse Protection
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="dpa-hazardous"
              checked={watch("planning.developmentPermitAreas.hazardousConditions") || false}
              onCheckedChange={(checked) =>
                setValue("planning.developmentPermitAreas.hazardousConditions", checked)
              }
            />
            <label htmlFor="dpa-hazardous" className="text-sm text-text cursor-pointer">
              Hazardous Conditions (steep slopes, etc.)
            </label>
          </div>
        </div>
      </div>

      {/* Constraint Flags */}
      <div>
        <Label>Site Constraints</Label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="constraint-watercourse"
              checked={watch("planning.constraintsFlags.nearWatercourse") || false}
              onCheckedChange={(checked) =>
                setValue("planning.constraintsFlags.nearWatercourse", checked)
              }
            />
            <label htmlFor="constraint-watercourse" className="text-sm text-text cursor-pointer">
              Near Watercourse
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="constraint-slope"
              checked={watch("planning.constraintsFlags.steepSlope") || false}
              onCheckedChange={(checked) =>
                setValue("planning.constraintsFlags.steepSlope", checked)
              }
            />
            <label htmlFor="constraint-slope" className="text-sm text-text cursor-pointer">
              Steep Slope
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="constraint-heritage"
              checked={watch("planning.constraintsFlags.heritage") || false}
              onCheckedChange={(checked) =>
                setValue("planning.constraintsFlags.heritage", checked)
              }
            />
            <label htmlFor="constraint-heritage" className="text-sm text-text cursor-pointer">
              Heritage Designation
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="constraint-contaminated"
              checked={watch("planning.constraintsFlags.contaminatedSite") || false}
              onCheckedChange={(checked) =>
                setValue("planning.constraintsFlags.contaminatedSite", checked)
              }
            />
            <label htmlFor="constraint-contaminated" className="text-sm text-text cursor-pointer">
              Contaminated Site
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="constraint-trees"
              checked={watch("planning.constraintsFlags.significantTrees") || false}
              onCheckedChange={(checked) =>
                setValue("planning.constraintsFlags.significantTrees", checked)
              }
            />
            <label htmlFor="constraint-trees" className="text-sm text-text cursor-pointer">
              Significant Trees
            </label>
          </div>
        </div>
      </div>

      {/* Variances Requested */}
      <div>
        <Label htmlFor="variancesRequested">Variances Requested</Label>
        <Textarea
          id="variancesRequested"
          {...register("planning.variancesRequested")}
          placeholder="Summary of requested variances..."
          rows={3}
          className="mt-1"
        />
      </div>
    </div>
  );
}

"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProjectProfileData } from "@/lib/projects/profile-types";

interface OverviewSectionProps {
  register: UseFormRegister<ProjectProfileData>;
  errors: FieldErrors<ProjectProfileData>;
}

/**
 * Overview section: Basic project information
 * 6 fields: projectDisplayName, siteAddress, city, province, postalCode, notes
 */
export function OverviewSection({ register, errors }: OverviewSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Project Display Name */}
      <div className="md:col-span-2">
        <Label htmlFor="projectDisplayName">
          Project Display Name <span className="text-danger">*</span>
        </Label>
        <Input
          id="projectDisplayName"
          {...register("overview.projectDisplayName")}
          placeholder="e.g., Downtown Mixed-Use Development"
          className="mt-1"
        />
        {errors.overview?.projectDisplayName && (
          <p className="text-sm text-danger mt-1">
            {errors.overview.projectDisplayName.message}
          </p>
        )}
      </div>

      {/* Site Address */}
      <div className="md:col-span-2">
        <Label htmlFor="siteAddress">
          Site Address <span className="text-danger">*</span>
        </Label>
        <Input
          id="siteAddress"
          {...register("overview.siteAddress")}
          placeholder="123 Main Street"
          className="mt-1"
        />
        {errors.overview?.siteAddress && (
          <p className="text-sm text-danger mt-1">
            {errors.overview.siteAddress.message}
          </p>
        )}
      </div>

      {/* City */}
      <div>
        <Label htmlFor="city">
          City <span className="text-danger">*</span>
        </Label>
        <Input
          id="city"
          {...register("overview.city")}
          placeholder="Coquitlam"
          className="mt-1"
        />
        {errors.overview?.city && (
          <p className="text-sm text-danger mt-1">{errors.overview.city.message}</p>
        )}
      </div>

      {/* Province */}
      <div>
        <Label htmlFor="province">
          Province <span className="text-danger">*</span>
        </Label>
        <Input
          id="province"
          {...register("overview.province")}
          placeholder="BC"
          className="mt-1"
        />
        {errors.overview?.province && (
          <p className="text-sm text-danger mt-1">
            {errors.overview.province.message}
          </p>
        )}
      </div>

      {/* Postal Code */}
      <div>
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input
          id="postalCode"
          {...register("overview.postalCode")}
          placeholder="V3B 1A1"
          className="mt-1"
        />
      </div>

      {/* Notes */}
      <div className="md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register("overview.notes")}
          placeholder="Additional project context or notes..."
          rows={3}
          className="mt-1"
        />
      </div>
    </div>
  );
}

"use client";

import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectProfileData } from "@/lib/projects/profile-types";

interface SiteLegalSectionProps {
  register: UseFormRegister<ProjectProfileData>;
  errors: FieldErrors<ProjectProfileData>;
  watch: UseFormWatch<ProjectProfileData>;
  setValue: (name: any, value: any) => void;
}

/**
 * Site & Legal section: Property details
 * Fields: PID, legal description, lot area (value + unit), lot dimensions, title notes
 */
export function SiteLegalSection({
  register,
  errors,
  watch,
  setValue,
}: SiteLegalSectionProps) {
  const lotAreaUnit = watch("siteLegal.lotArea.unit") || "m2";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* PID */}
      <div>
        <Label htmlFor="pid">Parcel Identifier (PID)</Label>
        <Input
          id="pid"
          {...register("siteLegal.pid")}
          placeholder="123-456-789"
          className="mt-1"
        />
      </div>

      {/* Legal Description */}
      <div className="md:col-span-2">
        <Label htmlFor="legalDescription">Legal Description</Label>
        <Textarea
          id="legalDescription"
          {...register("siteLegal.legalDescription")}
          placeholder="Lot 1, District Lot 123, Plan 456..."
          rows={2}
          className="mt-1"
        />
      </div>

      {/* Lot Area */}
      <div>
        <Label htmlFor="lotAreaValue">Lot Area</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="lotAreaValue"
            type="number"
            step="0.01"
            {...register("siteLegal.lotArea.value", { valueAsNumber: true })}
            placeholder="500"
            className="flex-1"
          />
          <Select
            value={lotAreaUnit}
            onValueChange={(value) =>
              setValue("siteLegal.lotArea.unit", value as "m2" | "sqft")
            }
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="m2">m²</SelectItem>
              <SelectItem value="sqft">sqft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {errors.siteLegal?.lotArea?.value && (
          <p className="text-sm text-danger mt-1">
            {errors.siteLegal.lotArea.value.message}
          </p>
        )}
      </div>

      {/* Lot Dimensions */}
      <div className="md:col-span-2">
        <Label>Lot Dimensions (meters)</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          <div>
            <Input
              type="number"
              step="0.1"
              {...register("siteLegal.lotDimensions.widthM", {
                valueAsNumber: true,
              })}
              placeholder="Width (m)"
            />
          </div>
          <div>
            <Input
              type="number"
              step="0.1"
              {...register("siteLegal.lotDimensions.depthM", {
                valueAsNumber: true,
              })}
              placeholder="Depth (m)"
            />
          </div>
          <div>
            <Input
              type="number"
              step="0.1"
              {...register("siteLegal.lotDimensions.frontageM", {
                valueAsNumber: true,
              })}
              placeholder="Frontage (m)"
            />
          </div>
        </div>
      </div>

      {/* Title Notes */}
      <div className="md:col-span-2">
        <Label htmlFor="titleNotes">Title Notes / Encumbrances</Label>
        <Textarea
          id="titleNotes"
          {...register("siteLegal.titleNotes")}
          placeholder="SRWs, covenants, charges on title..."
          rows={2}
          className="mt-1"
        />
      </div>
    </div>
  );
}

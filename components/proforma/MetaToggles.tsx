"use client";

import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { ProFormaAssumptions } from "@/lib/proforma/types";

interface MetaTogglesProps {
  form: UseFormReturn<ProFormaAssumptions>;
}

export function MetaToggles({ form }: MetaTogglesProps) {
  const monetization = form.watch("meta.monetization");

  return (
    <div className="space-y-4 mb-6 p-6 bg-white border rounded-md">
      <div>
        <Label className="text-sm font-medium mb-3 block">Monetization</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => form.setValue("meta.monetization", "FOR_SALE", { shouldDirty: true })}
            className={`
              px-6 py-2.5 rounded-sm text-sm font-medium transition-colors
              ${
                monetization === "FOR_SALE"
                  ? "bg-accent text-white"
                  : "bg-surface border border-gray-300 text-gray-700 hover:bg-surface-2"
              }
            `}
          >
            For Sale
          </button>
          <button
            type="button"
            disabled
            className="px-6 py-2.5 rounded-sm text-sm font-medium bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
          >
            For Rental
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          For Rental will be implemented in Phase 2
        </p>
      </div>
    </div>
  );
}

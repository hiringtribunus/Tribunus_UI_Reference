"use client";

import type { FeeCalculatorOutputs } from "@/lib/fee-calculator/types";
import { formatCADWithCents } from "@/lib/utils/formatting";
import { FIXED_FEES } from "@/lib/fee-calculator/compute";

interface CostSummaryProps {
  outputs: FeeCalculatorOutputs;
}

export function CostSummary({ outputs }: CostSummaryProps) {
  return (
    <div className="border rounded-md p-6 bg-white sticky top-6">
      <h3 className="font-medium text-lg mb-6">Cost Summary</h3>

      <div className="space-y-4">
        {/* Line Items */}
        <div className="space-y-3">
          {/* Total DCC */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Total DCC</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCADWithCents(outputs.dcc.totalDCC)}
            </span>
          </div>

          {/* Total ACC */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Total ACC</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCADWithCents(outputs.acc.totalACC)}
            </span>
          </div>

          {/* Total CAC */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Total CAC</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCADWithCents(outputs.cac.totalCAC)}
            </span>
          </div>

          {/* Pre-Application Review Fee */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Pre-Application Review</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCADWithCents(FIXED_FEES.PRE_APPLICATION_REVIEW)}
            </span>
          </div>

          {/* OCP Amendment Fee */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">OCP Amendment</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCADWithCents(FIXED_FEES.OCP_AMENDMENT)}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t pt-4 mt-4">
          {/* Grand Total */}
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900">Total Cost</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatCADWithCents(outputs.totals.grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

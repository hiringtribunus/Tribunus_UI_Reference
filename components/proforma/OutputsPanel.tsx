"use client";

import type { ProFormaOutputs } from "@/lib/proforma/types";
import {
  formatCAD,
  formatPercent,
  formatDelta,
  formatPercentDelta,
} from "@/lib/utils/formatting";
import { computeDelta } from "@/lib/proforma/compute";
import { cn } from "@/lib/cn";

type OutputsPanelProps = {
  baseOutputs: ProFormaOutputs;
  scenarioOutputs: ProFormaOutputs;
};

export function OutputsPanel({
  baseOutputs,
  scenarioOutputs,
}: OutputsPanelProps) {
  // Compute deltas
  const profitDelta = computeDelta(
    baseOutputs.totals.profit,
    scenarioOutputs.totals.profit
  );
  const marginDelta = computeDelta(
    baseOutputs.totals.profitMarginPct,
    scenarioOutputs.totals.profitMarginPct
  );
  const equityDelta = computeDelta(
    baseOutputs.totals.equityNeeded,
    scenarioOutputs.totals.equityNeeded
  );

  const profitValue = scenarioOutputs.totals.profit;
  const isProfitPositive = profitValue !== null && profitValue > 0;
  const isProfitNegative = profitValue !== null && profitValue < 0;

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Outputs</h3>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Net Revenue */}
        <KPICard
          label="Net Revenue"
          value={formatCAD(scenarioOutputs.revenue.netRevenue)}
        />

        {/* Total Cost */}
        <KPICard
          label="Total Cost"
          value={formatCAD(scenarioOutputs.totals.totalCost)}
        />

        {/* Profit */}
        <KPICard
          label="Profit"
          value={formatCAD(scenarioOutputs.totals.profit)}
          valueClassName={cn(
            isProfitPositive && "text-green-600",
            isProfitNegative && "text-red-600"
          )}
        />

        {/* Profit Margin */}
        <KPICard
          label="Profit Margin"
          value={formatPercent(scenarioOutputs.totals.profitMarginPct)}
        />

        {/* Equity Needed */}
        <KPICard
          label="Equity Needed"
          value={formatCAD(scenarioOutputs.totals.equityNeeded)}
        />

        {/* ROI */}
        <KPICard
          label="ROI"
          value={formatPercent(scenarioOutputs.totals.roiPct)}
        />
      </div>

      {/* Delta Strip */}
      <div className="border rounded-md p-4 bg-gray-50">
        <h4 className="text-sm font-medium mb-3">Scenario Impact</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <DeltaItem label="Profit Δ" value={formatDelta(profitDelta)} />
          <DeltaItem
            label="Margin Δ"
            value={formatPercentDelta(marginDelta)}
          />
          <DeltaItem label="Equity Δ" value={formatDelta(equityDelta)} />
        </div>
      </div>
    </div>
  );
}

function KPICard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="border rounded-md p-4">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className={cn("text-2xl font-semibold", valueClassName)}>
        {value}
      </div>
    </div>
  );
}

function DeltaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
